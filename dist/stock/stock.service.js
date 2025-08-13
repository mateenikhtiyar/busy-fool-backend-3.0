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
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stock_entity_1 = require("./entities/stock.entity");
const ingredients_service_1 = require("../ingredients/ingredients.service");
let StockService = class StockService {
    stockRepository;
    ingredientsService;
    constructor(stockRepository, ingredientsService) {
        this.stockRepository = stockRepository;
        this.ingredientsService = ingredientsService;
    }
    async findAll(userId) {
        return this.stockRepository.find({
            where: { ingredient: { user: { id: userId } } },
            relations: ['ingredient'],
        });
    }
    async findAllByUser(userId) {
        return this.findAll(userId);
    }
    async findOne(id, userId) {
        const stock = await this.stockRepository.findOne({
            where: { id, ingredient: { user: { id: userId } } },
            relations: ['ingredient'],
        });
        if (!stock)
            throw new common_1.NotFoundException(`Stock batch ${id} not found for this user`);
        return stock;
    }
    async findAllByIngredientId(ingredientId, userId) {
        return this.stockRepository.find({
            where: { ingredient: { id: ingredientId, user: { id: userId } } },
            relations: ['ingredient'],
            order: { purchased_at: 'ASC' },
        });
    }
    async convertQuantity(quantity, fromUnit, toUnit) {
        const fromLower = fromUnit.toLowerCase().replace(/s$/, '');
        const toLower = toUnit.toLowerCase().replace(/s$/, '');
        if (fromLower === toLower)
            return Number(quantity.toFixed(2));
        const conversionFactors = {
            ml: 1,
            l: 1000,
            g: 1,
            kg: 1000,
        };
        const fromFactor = conversionFactors[fromLower] || 1;
        const toFactor = conversionFactors[toLower] || 1;
        if (fromLower === 'unit' && toLower === 'unit')
            return Number(quantity.toFixed(2));
        if (fromFactor && toFactor) {
            const converted = (quantity * fromFactor) / toFactor;
            return Number(converted.toFixed(2));
        }
        throw new common_1.BadRequestException(`Incompatible units: ${fromUnit} and ${toUnit}`);
    }
    async getAvailableStock(ingredientId, userId) {
        const stocks = await this.findAllByIngredientId(ingredientId, userId);
        return stocks.reduce((sum, stock) => sum + (Number(stock.remaining_quantity) || 0), 0);
    }
    isCompatibleUnit(unit1, unit2) {
        const u1 = unit1.toLowerCase().replace(/s$/, '');
        const u2 = unit2.toLowerCase().replace(/s$/, '');
        return (u1 === u2 ||
            (u1 === 'l' && u2 === 'ml') ||
            (u1 === 'ml' && u2 === 'l') ||
            (u1 === 'kg' && u2 === 'g') ||
            (u1 === 'g' && u2 === 'kg') ||
            (u1 === 'unit' && u2 === 'unit'));
    }
    async remove(id, userId) {
        const stock = await this.findOne(id, userId);
        await this.stockRepository.remove(stock);
    }
    async update(id, updateData, userId) {
        const stock = await this.findOne(id, userId);
        Object.assign(stock, updateData);
        return this.stockRepository.save(stock);
    }
    async create(createData) {
        const stock = this.stockRepository.create(createData);
        return this.stockRepository.save(stock);
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stock_entity_1.Stock)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        ingredients_service_1.IngredientsService])
], StockService);
//# sourceMappingURL=stock.service.js.map