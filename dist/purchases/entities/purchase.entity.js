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
exports.Purchase = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const ingredient_entity_1 = require("../../ingredients/entities/ingredient.entity");
const user_entity_1 = require("../../users/user.entity");
let Purchase = class Purchase {
    id;
    ingredient;
    user;
    quantity;
    purchasePrice; // Added to track per-unit price
    total_cost;
    purchase_date;
};
exports.Purchase = Purchase;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the purchase' }),
    __metadata("design:type", String)
], Purchase.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ingredient_entity_1.Ingredient, { eager: true, onDelete: 'CASCADE' }),
    (0, swagger_1.ApiProperty)({ description: 'Ingredient purchased' }),
    __metadata("design:type", ingredient_entity_1.Ingredient)
], Purchase.prototype, "ingredient", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.purchases, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], Purchase.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    (0, swagger_1.ApiProperty)({ description: 'Quantity purchased' }),
    __metadata("design:type", Number)
], Purchase.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    (0, swagger_1.ApiProperty)({ description: 'Price per unit of the purchase' }),
    __metadata("design:type", Number)
], Purchase.prototype, "purchasePrice", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    (0, swagger_1.ApiProperty)({ description: 'Total cost of the purchase' }),
    __metadata("design:type", Number)
], Purchase.prototype, "total_cost", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, swagger_1.ApiProperty)({ description: 'Date of the purchase' }),
    __metadata("design:type", Date)
], Purchase.prototype, "purchase_date", void 0);
exports.Purchase = Purchase = __decorate([
    (0, typeorm_1.Entity)()
], Purchase);
//# sourceMappingURL=purchase.entity.js.map