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
exports.Waste = void 0;
const typeorm_1 = require("typeorm");
const stock_entity_1 = require("../../stock/entities/stock.entity");
let Waste = class Waste {
    id;
    stock;
    quantity;
    unit;
    reason;
    wasteDate;
};
exports.Waste = Waste;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Waste.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_entity_1.Stock, (stock) => stock.wastes),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", stock_entity_1.Stock)
], Waste.prototype, "stock", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Waste.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: false }),
    __metadata("design:type", String)
], Waste.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: false }),
    __metadata("design:type", String)
], Waste.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Waste.prototype, "wasteDate", void 0);
exports.Waste = Waste = __decorate([
    (0, typeorm_1.Entity)()
], Waste);
//# sourceMappingURL=waste.entity.js.map