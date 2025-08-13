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
exports.WasteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const waste_entity_1 = require("./entities/waste.entity");
const stock_entity_1 = require("../stock/entities/stock.entity");
const stock_service_1 = require("../stock/stock.service");
/**
 * Service to manage waste-related operations.
 */
let WasteService = class WasteService {
    wasteRepository;
    stockService;
    constructor(wasteRepository, stockService) {
        this.wasteRepository = wasteRepository;
        this.stockService = stockService;
    }
    /**
     * Records waste and updates stock levels within a transaction.
     * @param createWasteDto Data for the waste
     * @returns The created waste record
     * @throws NotFoundException if stock is not found
     * @throws BadRequestException if quantity exceeds available stock or is invalid
     */
    async create(createWasteDto) {
        const { stockId, quantity, unit, reason } = createWasteDto;
        if (quantity <= 0) {
            throw new common_1.BadRequestException('Quantity must be positive');
        }
        // Use transaction to ensure atomicity
        const waste = await (0, typeorm_2.getManager)().transaction(async (transactionalEntityManager) => {
            const stock = await transactionalEntityManager.findOne(stock_entity_1.Stock, {
                where: { id: stockId },
                relations: ['ingredient'],
            });
            if (!stock)
                throw new common_1.NotFoundException(`Stock ${stockId} not found`);
            const convertedQuantity = await this.stockService.convertQuantity(quantity, unit, stock.unit);
            if (convertedQuantity > stock.remaining_quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for waste recording. Available: ${stock.remaining_quantity.toFixed(2)} ${stock.unit}, Requested: ${convertedQuantity.toFixed(2)} ${stock.unit}`);
            }
            // Update stock
            stock.remaining_quantity -= convertedQuantity;
            stock.wasted_quantity += convertedQuantity;
            await transactionalEntityManager.save(stock_entity_1.Stock, stock);
            // Create waste record
            const newWaste = transactionalEntityManager.create(waste_entity_1.Waste, {
                stock: { id: stockId }, // Use stock ID for relation
                quantity: convertedQuantity,
                unit: stock.unit,
                reason,
            });
            return await transactionalEntityManager.save(waste_entity_1.Waste, newWaste);
        });
        return waste;
    }
    /**
     * Retrieves all waste records.
     * @returns List of all waste records
     */
    async findAll() {
        return this.wasteRepository.find({
            relations: ['stock', 'stock.ingredient'],
        });
    }
};
exports.WasteService = WasteService;
exports.WasteService = WasteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(waste_entity_1.Waste)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        stock_service_1.StockService])
], WasteService);
//# sourceMappingURL=waste.service.js.map