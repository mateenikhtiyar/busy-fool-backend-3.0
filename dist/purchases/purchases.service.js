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
exports.PurchasesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const purchase_entity_1 = require("./entities/purchase.entity");
const ingredients_service_1 = require("../ingredients/ingredients.service");
const stock_service_1 = require("../stock/stock.service");
const users_service_1 = require("../users/users.service");
let PurchasesService = class PurchasesService {
    purchaseRepository;
    stockService;
    ingredientsService;
    usersService;
    constructor(purchaseRepository, stockService, ingredientsService, usersService) {
        this.purchaseRepository = purchaseRepository;
        this.stockService = stockService;
        this.ingredientsService = ingredientsService;
        this.usersService = usersService;
    }
    async create(createPurchaseDto, userId) {
        const user = await this.usersService.findById(userId);
        if (!user)
            throw new common_1.BadRequestException('User not found');
        const { ingredientId, quantity, unit, purchasePrice } = createPurchaseDto;
        if (quantity <= 0 || purchasePrice < 0)
            throw new common_1.BadRequestException('Invalid quantity or price');
        const ingredient = await this.ingredientsService.findOne(ingredientId, userId);
        if (!ingredient)
            throw new common_1.NotFoundException(`Ingredient ${ingredientId} not found`);
        // Convert quantity to ingredient's base unit for consistency
        const normalizedQuantity = await this.stockService.convertQuantity(quantity, unit, ingredient.unit);
        const totalPurchasedPrice = Number(purchasePrice.toFixed(2));
        const purchasePricePerUnit = Number((totalPurchasedPrice / normalizedQuantity).toFixed(4)); // Per unit of base unit
        const wastePercent = ingredient.waste_percent || 0;
        const usablePercentage = 1 - wastePercent / 100;
        const remainingQuantity = Number((normalizedQuantity * usablePercentage).toFixed(2));
        const purchase = this.purchaseRepository.create({
            ingredient,
            quantity: normalizedQuantity, // Store in base unit
            purchasePrice: purchasePricePerUnit, // Per unit price of this purchase
            total_cost: totalPurchasedPrice,
            user,
        });
        const savedPurchase = await this.purchaseRepository.save(purchase);
        // Create or update stock
        const existingStocks = await this.stockService.findAllByIngredientId(ingredientId, userId);
        let stockToUpdate;
        for (const stock of existingStocks) {
            if (this.stockService.isCompatibleUnit(unit, stock.unit) &&
                stock.remaining_quantity > 0) {
                stockToUpdate = stock;
                break;
            }
        }
        if (stockToUpdate) {
            const convertedQuantity = await this.stockService.convertQuantity(quantity, unit, stockToUpdate.unit);
            const newRemaining = Number((Number(stockToUpdate.remaining_quantity) +
                convertedQuantity * usablePercentage).toFixed(2));
            const totalPurchased = Number((Number(stockToUpdate.purchased_quantity) + convertedQuantity).toFixed(2));
            // Recalculate weighted average in base unit
            const existingTotalCost = Number(stockToUpdate.purchase_price_per_unit) *
                Number(stockToUpdate.purchased_quantity);
            const newTotalCost = totalPurchasedPrice;
            const totalQuantity = Number(stockToUpdate.purchased_quantity) + normalizedQuantity;
            const weightedPricePerUnit = Number(((existingTotalCost + newTotalCost) / totalQuantity).toFixed(4));
            const newTotalPurchasedPrice = Number((Number(stockToUpdate.total_purchased_price || 0) + totalPurchasedPrice).toFixed(2));
            await this.stockService.update(stockToUpdate.id, {
                remaining_quantity: newRemaining,
                purchased_quantity: totalPurchased,
                purchase_price_per_unit: weightedPricePerUnit,
                total_purchased_price: newTotalPurchasedPrice,
                waste_percent: wastePercent,
                updated_at: new Date(),
            }, userId);
        }
        else {
            await this.stockService.create({
                ingredient,
                purchased_quantity: normalizedQuantity,
                unit: ingredient.unit, // Use ingredient's base unit
                purchase_price_per_unit: purchasePricePerUnit,
                total_purchased_price: totalPurchasedPrice,
                waste_percent: wastePercent,
                remaining_quantity: remainingQuantity,
                wasted_quantity: 0,
                purchased_at: new Date(),
            });
        }
        return savedPurchase;
    }
    async remove(id, userId) {
        const purchase = await this.purchaseRepository.findOne({
            where: { id, user: { id: userId } },
        });
        if (!purchase) {
            throw new common_1.NotFoundException(`Purchase with ID ${id} not found`);
        }
        await this.purchaseRepository.remove(purchase);
    }
    async findAll(userId) {
        return this.purchaseRepository.find({
            where: { user: { id: userId } },
            relations: ['ingredient'],
        });
    }
    async findAllByUser(userId) {
        return this.purchaseRepository.find({
            where: { user: { id: userId } },
            relations: ['ingredient'],
        });
    }
};
exports.PurchasesService = PurchasesService;
exports.PurchasesService = PurchasesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(purchase_entity_1.Purchase)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        stock_service_1.StockService,
        ingredients_service_1.IngredientsService,
        users_service_1.UsersService])
], PurchasesService);
//# sourceMappingURL=purchases.service.js.map