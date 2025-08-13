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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const purchases_service_1 = require("../purchases/purchases.service");
const products_service_1 = require("../products/products.service");
const ingredients_service_1 = require("../ingredients/ingredients.service");
const stock_service_1 = require("../stock/stock.service");
const sales_service_1 = require("../sales/sales.service");
let DashboardService = class DashboardService {
    purchasesService;
    productsService;
    ingredientsService;
    stockService;
    salesService;
    constructor(purchasesService, productsService, ingredientsService, stockService, salesService) {
        this.purchasesService = purchasesService;
        this.productsService = productsService;
        this.ingredientsService = ingredientsService;
        this.stockService = stockService;
        this.salesService = salesService;
    }
    async getDashboardData(userId) {
        const purchases = await this.purchasesService.findAllByUser(userId);
        const products = await this.productsService.findAllByUser(userId);
        const ingredients = await this.ingredientsService.findAllByUser(userId);
        const stocks = await this.stockService.findAllByUser(userId);
        const sales = await this.salesService.findAllByUser(userId);
        const totalSales = sales.reduce((sum, s) => sum + Number(s.total_amount), 0);
        const salesCount = sales.length;
        const totalPurchasesCost = stocks.reduce((sum, s) => sum + Number(s.total_purchased_price), 0);
        const purchaseCount = purchases.length;
        const totalProductCost = products.reduce((sum, p) => sum + Number(p.total_cost), 0);
        const totalProfit = totalSales - totalProductCost;
        const totalMargin = products.reduce((sum, p) => sum + Number(p.margin_amount || 0), 0);
        const avgMarginPercent = products.length
            ? (totalMargin /
                products.reduce((sum, p) => sum + Number(p.sell_price || 0), 0)) *
                100
            : 0;
        const avgPurchasePrice = purchaseCount
            ? totalPurchasesCost / purchaseCount
            : 0;
        const totalStock = stocks.reduce((sum, s) => sum + Number(s.remaining_quantity || 0), 0);
        const lowStockIngredients = ingredients.filter((i) => {
            const stock = stocks.find((s) => s.ingredient && s.ingredient.id === i.id);
            return stock && Number(stock.remaining_quantity) < 0.5;
        });
        const latestPurchases = purchases
            .sort((a, b) => new Date(b.purchase_date).getTime() -
            new Date(a.purchase_date).getTime())
            .slice(0, 5);
        const suggestions = {
            stockManagement: lowStockIngredients.length
                ? `Restock ${lowStockIngredients.map((i) => i.name).join(', ')}`
                : 'All stocks are sufficient.',
            priceOptimization: avgPurchasePrice > 100
                ? 'Review high purchase prices for cost savings.'
                : 'Purchase prices are optimized.',
            salesBoost: salesCount < 5
                ? 'Consider promoting low-selling products.'
                : 'Sales performance is strong.',
        };
        return {
            overview: {
                totalSales: Number(totalSales.toFixed(2)),
                totalPurchasesCost: Number(totalPurchasesCost.toFixed(2)),
                totalProfit: Number(totalProfit.toFixed(2)),
                totalMargin: Number(totalMargin.toFixed(2)),
                avgMarginPercent: Number(avgMarginPercent.toFixed(2)),
            },
            analytics: {
                purchaseCount,
                salesCount,
                avgPurchasePrice: Number(avgPurchasePrice.toFixed(2)),
                totalStock: Number(totalStock.toFixed(2)),
                lowStockCount: lowStockIngredients.length,
            },
            products: products.map((p) => ({
                id: p.id,
                name: p.name,
                sellPrice: Number(p.sell_price),
                totalCost: Number(p.total_cost),
                margin: Number(p.margin_amount || 0),
                status: p.status,
            })),
            ingredients: ingredients.map((i) => ({
                id: i.id,
                name: i.name,
                unit: i.unit,
                quantity: Number(i.quantity),
                purchasePrice: Number(i.purchase_price),
            })),
            stockBrief: stocks.map((s) => ({
                id: s.id,
                ingredientId: s.ingredient ? s.ingredient.id : null,
                purchasedQuantity: Number(s.purchased_quantity),
                remainingQuantity: Number(s.remaining_quantity),
                unit: s.unit,
                totalPurchasedPrice: Number(s.total_purchased_price),
            })),
            latestPurchases: latestPurchases.map((p) => ({
                id: p.id,
                ingredientId: p.ingredient ? p.ingredient.id : null,
                quantity: p.quantity,
                purchasePrice: Number(p.purchasePrice),
                totalCost: Number(p.total_cost),
                purchaseDate: p.purchase_date,
            })),
            suggestions,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [purchases_service_1.PurchasesService,
        products_service_1.ProductsService,
        ingredients_service_1.IngredientsService,
        stock_service_1.StockService,
        sales_service_1.SalesService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map