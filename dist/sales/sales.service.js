"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sale_entity_1 = require("./entities/sale.entity");
const products_service_1 = require("../products/products.service");
const users_service_1 = require("../users/users.service");
const ingredient_entity_1 = require("../ingredients/entities/ingredient.entity");
const product_ingredient_entity_1 = require("../products/entities/product-ingredient.entity");
const purchase_entity_1 = require("../purchases/entities/purchase.entity");
const stock_service_1 = require("../stock/stock.service");
const waste_entity_1 = require("../waste/entities/waste.entity");
const stock_entity_1 = require("../stock/entities/stock.entity"); // Import Stock entity
const product_entity_1 = require("../products/entities/product.entity");
const import_sales_entity_1 = require("./entities/import-sales.entity");
let SalesService = class SalesService {
    salesRepository;
    ingredientsRepository;
    productIngredientsRepository;
    purchasesRepository;
    wasteRepository;
    stockRepository;
    productRepository;
    unmatchedRepository;
    productsService;
    usersService;
    stockService;
    entityManager;
    constructor(salesRepository, ingredientsRepository, productIngredientsRepository, purchasesRepository, wasteRepository, stockRepository, productRepository, unmatchedRepository, productsService, usersService, stockService, entityManager) {
        this.salesRepository = salesRepository;
        this.ingredientsRepository = ingredientsRepository;
        this.productIngredientsRepository = productIngredientsRepository;
        this.purchasesRepository = purchasesRepository;
        this.wasteRepository = wasteRepository;
        this.stockRepository = stockRepository;
        this.productRepository = productRepository;
        this.unmatchedRepository = unmatchedRepository;
        this.productsService = productsService;
        this.usersService = usersService;
        this.stockService = stockService;
        this.entityManager = entityManager;
    }
    async create(createSaleDto, userId) {
        const user = await this.usersService.findById(userId);
        if (!user)
            throw new common_1.BadRequestException('User not found');
        if (!createSaleDto.productId) {
            throw new common_1.BadRequestException('Product ID is required for registered products');
        }
        const product = await this.productsService.findOne(createSaleDto.productId, userId);
        if (!product)
            throw new common_1.NotFoundException(`Product ${createSaleDto.productId} not found for this user`);
        console.log(`Product fetched: ${product.name}, Product ID: ${product.id}`);
        console.log(`Product.ingredients: Type = ${typeof product.ingredients}, Value = ${JSON.stringify(product.ingredients)}`);
        if (createSaleDto.quantity <= 0) {
            throw new common_1.BadRequestException('Quantity must be positive');
        }
        // Get max producible quantity
        const { maxQuantity, stockUpdates } = await this.productsService.getMaxProducibleQuantity(createSaleDto.productId, userId);
        if (createSaleDto.quantity > maxQuantity) {
            // Calculate stock updates based on requested quantity for accurate remaining amounts
            const adjustedStockUpdates = [];
            for (const pi of product.ingredients) {
                const ingredientId = pi.ingredient.id;
                const currentStock = await this.stockRepository.findOne({
                    where: { ingredient: { id: ingredientId } },
                    order: { purchased_at: 'ASC' },
                });
                if (currentStock) {
                    const neededTotal = pi.quantity * createSaleDto.quantity; // Total needed for requested quantity
                    const neededInStockUnit = await this.productsService.convertQuantity(neededTotal, pi.unit, currentStock.unit); // Use productsService
                    const remaining = currentStock.remaining_quantity - neededInStockUnit;
                    adjustedStockUpdates.push({
                        ingredientId,
                        remainingQuantity: Math.max(0, Number(remaining.toFixed(2))),
                        unit: currentStock.unit,
                    });
                }
            }
            const stockUpdateDetails = adjustedStockUpdates
                .map((update) => `Remaining: ${update.remainingQuantity} ${update.unit} for ingredient ${update.ingredientId}`)
                .join(', ');
            throw new common_1.BadRequestException(`Insufficient stock. Maximum sellable quantity is ${maxQuantity}. ${stockUpdateDetails}. ` +
                `Available stock details: Check individual ingredient availability.`);
        }
        const sale = await this.entityManager.transaction(async (transactionalEntityManager) => {
            const totalIngredientQuantities = {};
            console.log(`Product ingredients array: Type = ${typeof product.ingredients}, Length = ${product.ingredients ? product.ingredients.length : 'N/A'}`);
            for (const pi of product.ingredients) {
                const ingredientId = pi.ingredient.id;
                if (typeof pi.quantity !== 'number' || isNaN(pi.quantity)) {
                    throw new common_1.BadRequestException(`Invalid quantity for ingredient ${ingredientId}.`);
                }
                const neededQuantity = pi.quantity * createSaleDto.quantity;
                totalIngredientQuantities[ingredientId] = totalIngredientQuantities[ingredientId] || { quantity: 0, unit: pi.unit };
                totalIngredientQuantities[ingredientId].quantity += neededQuantity;
            }
            for (const [ingredientId, { quantity: neededQuantity, unit: requestedUnit },] of Object.entries(totalIngredientQuantities)) {
                const totalAvailable = await this.stockService.getAvailableStock(ingredientId, userId);
                const neededInLiters = await this.productsService.convertQuantity(neededQuantity, requestedUnit, 'L'); // Use productsService
                if (totalAvailable < neededInLiters) {
                    throw new common_1.BadRequestException(`Insufficient stock for ingredient ${ingredientId}. Available: ${totalAvailable.toFixed(2)}L, Needed: ${neededInLiters.toFixed(2)}L`);
                }
                let remainingToDeduct = neededQuantity;
                const stocks = await this.stockService.findAllByIngredientId(ingredientId, userId);
                for (const stock of stocks) {
                    if (remainingToDeduct <= 0)
                        break;
                    const stockRemainingInRequestedUnit = await this.productsService.convertQuantity(stock.remaining_quantity, stock.unit, requestedUnit); // Use productsService
                    // ADD THESE LOGS HERE:
                    console.log(`Debugging deduction for ingredient ${ingredientId}:`);
                    console.log(`  remainingToDeduct: ${remainingToDeduct}`);
                    console.log(`  stockRemainingInRequestedUnit: ${stockRemainingInRequestedUnit}`);
                    const deductAmountInRequestedUnit = Math.min(remainingToDeduct, stockRemainingInRequestedUnit);
                    console.log(`  deductAmountInRequestedUnit: ${deductAmountInRequestedUnit}`);
                    console.log(`  isNaN(deductAmountInRequestedUnit): ${isNaN(deductAmountInRequestedUnit)}`);
                    console.log(`  productsService.isCompatibleUnit(requestedUnit, stock.unit): ${this.productsService.isCompatibleUnit(requestedUnit, stock.unit)}`);
                    if (isNaN(deductAmountInRequestedUnit) ||
                        !this.productsService.isCompatibleUnit(requestedUnit, stock.unit)) {
                        throw new common_1.BadRequestException(`Invalid deduction amount or incompatible units for stock ${stock.id}`);
                    }
                    const deductAmountInStockUnit = await this.productsService.convertQuantity(deductAmountInRequestedUnit, requestedUnit, stock.unit); // Use productsService
                    stock.remaining_quantity = Math.max(0, stock.remaining_quantity - deductAmountInStockUnit);
                    remainingToDeduct -= deductAmountInRequestedUnit;
                    await transactionalEntityManager.save(stock);
                }
                if (remainingToDeduct > 0) {
                    throw new common_1.BadRequestException(`Failed to deduct full quantity (${remainingToDeduct} ${requestedUnit}) for ingredient ${ingredientId}`);
                }
            }
            const sale = this.salesRepository.create({
                product,
                product_name: product.name,
                quantity: createSaleDto.quantity,
                total_amount: product.sell_price * createSaleDto.quantity,
                user,
            });
            await transactionalEntityManager.save(sale);
            // Manually update quantity_sold for the product
            const productToUpdate = await transactionalEntityManager.findOne(product_entity_1.Product, {
                where: { id: product.id },
            });
            if (productToUpdate) {
                productToUpdate.quantity_sold =
                    Number(productToUpdate.quantity_sold) +
                        Number(createSaleDto.quantity);
                await transactionalEntityManager.save(productToUpdate);
            }
            return sale;
        });
        const savedSale = await this.salesRepository.findOne({
            where: { id: sale.id },
            relations: ['product', 'user'],
        });
        if (!savedSale) {
            throw new Error('Failed to retrieve saved sale');
        }
        return savedSale;
    }
    async findAll(userId) {
        return this.salesRepository.find({
            where: { user: { id: userId } },
            relations: ['product', 'user'],
        });
    }
    async findAllByUser(userId) {
        return this.findAll(userId);
    }
    async remove(id, userId) {
        const sale = await this.salesRepository.findOne({
            where: { id, user: { id: userId } },
            relations: ['product'],
        });
        if (!sale) {
            throw new common_1.NotFoundException(`Sale with ID ${id} not found for this user`);
        }
        // Decrement quantity_sold for the product
        if (sale.product) {
            const product = await this.productRepository.findOne({
                where: { id: sale.product.id },
            });
            if (product) {
                product.quantity_sold =
                    Number(product.quantity_sold) - Number(sale.quantity);
                await this.productRepository.save(product);
            }
        }
        await this.salesRepository.remove(sale);
    }
    async update(id, updateSaleDto, userId) {
        const existingSale = await this.salesRepository.findOne({
            where: { id, user: { id: userId } },
            relations: ['product'],
        });
        if (!existingSale) {
            throw new common_1.NotFoundException(`Sale with ID ${id} not found for this user`);
        }
        const oldQuantity = existingSale.quantity;
        const newQuantity = updateSaleDto.quantity ?? oldQuantity;
        if (newQuantity <= 0) {
            throw new common_1.BadRequestException('Quantity must be positive');
        }
        // Update quantity_sold for the product
        if (existingSale.product && newQuantity !== oldQuantity) {
            const quantityDifference = newQuantity - oldQuantity;
            const product = await this.productRepository.findOne({
                where: { id: existingSale.product.id },
            });
            if (product) {
                product.quantity_sold =
                    Number(product.quantity_sold) + quantityDifference;
                await this.productRepository.save(product);
            }
        }
        Object.assign(existingSale, updateSaleDto);
        if (updateSaleDto.quantity && existingSale.product) {
            existingSale.total_amount =
                existingSale.product.sell_price * newQuantity;
        }
        return this.salesRepository.save(existingSale);
    }
    async getDashboard(startDate, endDate, userId) {
        const sales = await this.salesRepository.find({
            where: { sale_date: (0, typeorm_2.Between)(startDate, endDate), user: { id: userId } },
            relations: [
                'product',
                'product.ingredients',
                'product.ingredients.ingredient',
            ],
        });
        const revenue = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
        const costs = sales
            .filter((sale) => sale.product)
            .reduce((sum, sale) => sum + (sale.product.total_cost || 0) * sale.quantity, 0);
        const profit = revenue - costs;
        const losingMoney = sales
            .filter((sale) => sale.product && sale.product.status === 'losing money')
            .reduce((acc, sale) => {
            const existing = acc.find((item) => item.name === sale.product.name);
            if (existing) {
                existing.quantity += sale.quantity;
                existing.loss += sale.quantity * sale.product.margin_amount;
            }
            else {
                acc.push({
                    name: sale.product.name,
                    quantity: sale.quantity,
                    loss: sale.quantity * sale.product.margin_amount,
                });
            }
            return acc;
        }, []);
        const winners = sales
            .filter((sale) => sale.product && sale.product.status === 'profitable')
            .reduce((acc, sale) => {
            const existing = acc.find((item) => item.name === sale.product.name);
            if (existing) {
                existing.quantity += sale.quantity;
                existing.profit += sale.quantity * sale.product.margin_amount;
            }
            else {
                acc.push({
                    name: sale.product.name,
                    quantity: sale.quantity,
                    profit: sale.quantity * sale.product.margin_amount,
                });
            }
            return acc;
        }, [])
            .sort((a, b) => b.profit - a.profit)
            .slice(0, 3);
        const quickWins = losingMoney.map((p) => ({
            name: p.name,
            suggestion: `Raise price by £${(Math.abs(p.loss / p.quantity) + 0.5).toFixed(2)}`,
        }));
        return {
            revenue: revenue.toFixed(2),
            costs: costs.toFixed(2),
            profit: profit.toFixed(2),
            profitMargin: revenue > 0 ? ((profit / revenue) * 100).toFixed(2) : '0.00',
            losingMoney,
            winners,
            quickWins,
        };
    }
    async getMonthlyRealityCheck(startDate, endDate, userId) {
        const sales = await this.salesRepository.find({
            where: { sale_date: (0, typeorm_2.Between)(startDate, endDate), user: { id: userId } },
            relations: [
                'product',
                'product.ingredients',
                'product.ingredients.ingredient',
            ],
        });
        const purchases = await this.purchasesRepository.find({
            where: {
                purchase_date: (0, typeorm_2.Between)(startDate, endDate),
                user: { id: userId },
            },
            relations: ['ingredient'],
        });
        const wastes = await this.wasteRepository.find({
            where: {
                wasteDate: (0, typeorm_2.Between)(startDate, endDate),
                stock: { ingredient: { user: { id: userId } } },
            },
            relations: ['stock', 'stock.ingredient'],
        });
        const missingRecipes = sales
            .filter((sale) => !sale.product && sale.product_name)
            .reduce((acc, sale) => {
            const existing = acc.find((item) => item.name === sale.product_name);
            if (existing) {
                existing.quantity += sale.quantity;
            }
            else {
                acc.push({
                    name: sale.product.name,
                    quantity: sale.quantity,
                });
            }
            return acc;
        }, []);
        const ingredientUsage = sales
            .filter((sale) => sale.product)
            .reduce((acc, sale) => {
            sale.product.ingredients.forEach((pi) => {
                const ingredient = pi.ingredient;
                const key = ingredient.id;
                if (!acc[key]) {
                    acc[key] = {
                        name: ingredient.name,
                        unit: ingredient.unit,
                        used: 0,
                        purchased: 0,
                        wasted: 0,
                    };
                }
                acc[key].used += pi.quantity * sale.quantity;
            });
            return acc;
        }, {});
        purchases.forEach((purchase) => {
            const key = purchase.ingredient.id;
            if (ingredientUsage[key]) {
                ingredientUsage[key].purchased += purchase.quantity;
            }
            else {
                ingredientUsage[key] = {
                    name: purchase.ingredient.name,
                    unit: purchase.ingredient.unit,
                    used: 0,
                    purchased: purchase.quantity,
                    wasted: 0,
                };
            }
        });
        wastes.forEach((waste) => {
            const key = waste.stock.ingredient.id;
            if (ingredientUsage[key]) {
                ingredientUsage[key].wasted += waste.quantity;
            }
            else {
                ingredientUsage[key] = {
                    name: waste.stock.ingredient.name,
                    unit: waste.stock.ingredient.unit,
                    used: 0,
                    purchased: waste.quantity,
                    wasted: waste.quantity,
                };
            }
        });
        const wasteAlerts = Object.values(ingredientUsage)
            .filter((usage) => usage.used + usage.wasted < usage.purchased * 0.9 || usage.wasted > 0)
            .map((usage) => ({
            name: usage.name,
            purchased: usage.purchased.toFixed(2),
            used: usage.used.toFixed(2),
            wasted: usage.wasted.toFixed(2),
            unit: usage.unit,
            suggestion: 'Check for missing recipes, staff usage, or higher waste.',
        }));
        return {
            missingRecipes,
            wasteAlerts,
            suggestions: [
                ...missingRecipes.map((r) => `Add recipe for ${r.name} (${r.quantity} sold)`),
                ...(wasteAlerts.length > 0
                    ? [
                        'Review recipes',
                        'Check staff drink logs',
                        'Verify waste percentages',
                    ]
                    : []),
            ],
        };
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __param(1, (0, typeorm_1.InjectRepository)(ingredient_entity_1.Ingredient)),
    __param(2, (0, typeorm_1.InjectRepository)(product_ingredient_entity_1.ProductIngredient)),
    __param(3, (0, typeorm_1.InjectRepository)(purchase_entity_1.Purchase)),
    __param(4, (0, typeorm_1.InjectRepository)(waste_entity_1.Waste)),
    __param(5, (0, typeorm_1.InjectRepository)(stock_entity_1.Stock)),
    __param(6, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(7, (0, typeorm_1.InjectRepository)(import_sales_entity_1.ImportSalesUnmatched)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        products_service_1.ProductsService,
        users_service_1.UsersService,
        stock_service_1.StockService,
        typeorm_2.EntityManager])
], SalesService);
//# sourceMappingURL=sales.service.js.map