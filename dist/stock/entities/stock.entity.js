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
exports.Stock = void 0;
const typeorm_1 = require("typeorm");
const ingredient_entity_1 = require("../../ingredients/entities/ingredient.entity");
const waste_entity_1 = require("../../waste/entities/waste.entity");
const user_entity_1 = require("../../users/user.entity");
let Stock = class Stock {
    id;
    user;
    ingredient;
    wastes;
    purchased_quantity;
    unit;
    total_purchased_price; // Total price for the purchased quantity
    purchase_price_per_unit; // Price per unit (e.g., per ml, L, etc.)
    waste_percent;
    remaining_quantity;
    wasted_quantity;
    purchased_at;
    updated_at;
};
exports.Stock = Stock;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Stock.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.stocks, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], Stock.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ingredient_entity_1.Ingredient, (ingredient) => ingredient.stocks, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", ingredient_entity_1.Ingredient)
], Stock.prototype, "ingredient", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => waste_entity_1.Waste, (waste) => waste.stock),
    __metadata("design:type", Array)
], Stock.prototype, "wastes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Stock.prototype, "purchased_quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: false }),
    __metadata("design:type", String)
], Stock.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Stock.prototype, "total_purchased_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 4, nullable: false }),
    __metadata("design:type", Number)
], Stock.prototype, "purchase_price_per_unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Stock.prototype, "waste_percent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Stock.prototype, "remaining_quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: false,
        default: 0,
    }),
    __metadata("design:type", Number)
], Stock.prototype, "wasted_quantity", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Stock.prototype, "purchased_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Stock.prototype, "updated_at", void 0);
exports.Stock = Stock = __decorate([
    (0, typeorm_1.Entity)()
], Stock);
//# sourceMappingURL=stock.entity.js.map