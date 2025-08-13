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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../products/entities/product.entity");
const sale_entity_1 = require("../sales/entities/sale.entity");
let AnalyticsService = class AnalyticsService {
    productsRepository;
    saleRepository;
    constructor(productsRepository, saleRepository) {
        this.productsRepository = productsRepository;
        this.saleRepository = saleRepository;
    }
    async getDashboard(startDate, endDate) {
        if (!startDate || !endDate || startDate > endDate) {
            throw new common_1.BadRequestException('Invalid date range. Start date must be before end date.');
        }
        try {
            // Fetch sales within the date range with product details
            const sales = await this.saleRepository
                .createQueryBuilder('sale')
                .leftJoinAndSelect('sale.product', 'product')
                .leftJoinAndSelect('product.ingredients', 'ingredients')
                .leftJoinAndSelect('ingredients.ingredient', 'ingredient')
                .where('DATE(sale.sale_date) >= :startDate AND DATE(sale.sale_date) <= :endDate', { startDate, endDate })
                .getMany();
            if (!sales || sales.length === 0) {
                return {
                    revenue: '0.00',
                    costs: '0.00',
                    profit: '0.00',
                    profitMargin: '0.00',
                    losingMoney: [],
                    winners: [],
                    quickWins: [],
                };
            }
            // Calculate totals with type safety
            const revenue = sales.reduce((sum, sale) => {
                const amount = typeof sale.total_amount === 'number'
                    ? sale.total_amount
                    : parseFloat(sale.total_amount) || 0;
                return sum + amount;
            }, 0);
            const costs = sales.reduce((sum, sale) => {
                if (sale.product) {
                    const cost = typeof sale.product.total_cost === 'number'
                        ? sale.product.total_cost
                        : parseFloat(sale.product.total_cost) || 0;
                    return (sum +
                        cost *
                            (typeof sale.quantity === 'number'
                                ? sale.quantity
                                : parseFloat(sale.quantity) || 0));
                }
                return sum;
            }, 0);
            const profit = revenue - costs;
            const profitMargin = revenue > 0 ? ((profit / revenue) * 100).toFixed(2) : '0.00';
            // Identify winners and losing money products
            const losingMoney = sales
                .filter((sale) => sale.product && sale.product.status === 'losing money')
                .reduce((acc, sale) => {
                const existing = acc.find((item) => item.name === sale.product.name);
                if (existing) {
                    existing.quantity +=
                        typeof sale.quantity === 'number'
                            ? sale.quantity
                            : parseFloat(sale.quantity) || 0;
                    existing.margin_amount +=
                        (typeof sale.product.margin_amount === 'number'
                            ? sale.product.margin_amount
                            : parseFloat(sale.product.margin_amount) || 0) *
                            (typeof sale.quantity === 'number'
                                ? sale.quantity
                                : parseFloat(sale.quantity) || 0);
                }
                else {
                    acc.push({
                        name: sale.product.name,
                        quantity: typeof sale.quantity === 'number'
                            ? sale.quantity
                            : parseFloat(sale.quantity) || 0,
                        margin_amount: (typeof sale.product.margin_amount === 'number'
                            ? sale.product.margin_amount
                            : parseFloat(sale.product.margin_amount) || 0) *
                            (typeof sale.quantity === 'number'
                                ? sale.quantity
                                : parseFloat(sale.quantity) || 0),
                    });
                }
                return acc;
            }, []);
            const winners = sales
                .filter((sale) => sale.product && sale.product.status === 'profitable')
                .reduce((acc, sale) => {
                const existing = acc.find((item) => item.name === sale.product.name);
                if (existing) {
                    existing.quantity +=
                        typeof sale.quantity === 'number'
                            ? sale.quantity
                            : parseFloat(sale.quantity) || 0;
                    existing.margin_amount +=
                        (typeof sale.product.margin_amount === 'number'
                            ? sale.product.margin_amount
                            : parseFloat(sale.product.margin_amount) || 0) *
                            (typeof sale.quantity === 'number'
                                ? sale.quantity
                                : parseFloat(sale.quantity) || 0);
                }
                else {
                    acc.push({
                        name: sale.product.name,
                        quantity: typeof sale.quantity === 'number'
                            ? sale.quantity
                            : parseFloat(sale.quantity) || 0,
                        margin_amount: (typeof sale.product.margin_amount === 'number'
                            ? sale.product.margin_amount
                            : parseFloat(sale.product.margin_amount) || 0) *
                            (typeof sale.quantity === 'number'
                                ? sale.quantity
                                : parseFloat(sale.quantity) || 0),
                    });
                }
                return acc;
            }, [])
                .sort((a, b) => b.margin_amount - a.margin_amount)
                .slice(0, 3)
                .map((p) => ({
                name: p.name,
                margin_amount: Number(p.margin_amount.toFixed(2)),
            }));
            const quickWins = losingMoney.map((p) => ({
                name: p.name,
                suggestion: `Raise price by £${(Math.abs(p.margin_amount / p.quantity) + 0.5).toFixed(2)}`,
            }));
            return {
                revenue: Number(revenue).toFixed(2),
                costs: Number(costs).toFixed(2),
                profit: Number(profit).toFixed(2),
                profitMargin: profitMargin,
                losingMoney,
                winners,
                quickWins,
            };
        }
        catch (error) {
            console.error('Dashboard analytics error:', error);
            if (error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.InternalServerErrorException('An error occurred while generating dashboard data');
        }
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map