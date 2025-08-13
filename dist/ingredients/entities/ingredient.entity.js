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
exports.Ingredient = void 0;
const typeorm_1 = require("typeorm");
const product_ingredient_entity_1 = require("../../products/entities/product-ingredient.entity");
const stock_entity_1 = require("../../stock/entities/stock.entity");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/user.entity"); // Import User entity
let Ingredient = class Ingredient {
    id;
    user; // Add user relationship
    name;
    unit;
    quantity;
    purchase_price;
    waste_percent;
    cost_per_ml;
    cost_per_gram;
    cost_per_unit;
    supplier;
    created_at;
    productIngredients;
    stocks;
};
exports.Ingredient = Ingredient;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the ingredient',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], Ingredient.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.ingredients, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], Ingredient.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: false }),
    (0, swagger_1.ApiProperty)({
        description: 'Name of the ingredient',
        example: 'Oat Milk',
        minLength: 1,
        maxLength: 100,
    }),
    __metadata("design:type", String)
], Ingredient.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: false }),
    (0, swagger_1.ApiProperty)({
        description: 'Unit of measurement (e.g., ml, g, unit)',
        example: 'ml',
        minLength: 1,
        maxLength: 50,
    }),
    __metadata("design:type", String)
], Ingredient.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: false }),
    (0, swagger_1.ApiProperty)({
        description: 'Total quantity purchased (for initial record)',
        example: 100,
        minimum: 0.01,
    }),
    __metadata("design:type", Number)
], Ingredient.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: false }),
    (0, swagger_1.ApiProperty)({
        description: 'Purchase price for the total quantity',
        example: 0.84,
        minimum: 0.01,
    }),
    __metadata("design:type", Number)
], Ingredient.prototype, "purchase_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: false }),
    (0, swagger_1.ApiProperty)({
        description: 'Waste percentage (0-100)',
        example: 10.0,
        minimum: 0,
        maximum: 100,
    }),
    __metadata("design:type", Number)
], Ingredient.prototype, "waste_percent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    (0, swagger_1.ApiProperty)({
        description: 'Cost per milliliter (waste-adjusted)',
        example: 0.0084,
        required: false,
    }),
    __metadata("design:type", Object)
], Ingredient.prototype, "cost_per_ml", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    (0, swagger_1.ApiProperty)({
        description: 'Cost per gram (waste-adjusted)',
        example: 0.015,
        required: false,
    }),
    __metadata("design:type", Object)
], Ingredient.prototype, "cost_per_gram", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    (0, swagger_1.ApiProperty)({
        description: 'Cost per unit (waste-adjusted)',
        example: 1.5,
        required: false,
    }),
    __metadata("design:type", Object)
], Ingredient.prototype, "cost_per_unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    (0, swagger_1.ApiProperty)({
        description: 'Supplier name',
        example: 'Dairy Co.',
        required: false,
        maxLength: 100,
    }),
    __metadata("design:type", String)
], Ingredient.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2025-07-25T10:00:00Z',
        readOnly: true,
    }),
    __metadata("design:type", Date)
], Ingredient.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_ingredient_entity_1.ProductIngredient, (pi) => pi.ingredient),
    (0, swagger_1.ApiProperty)({
        description: 'List of product-ingredient relations',
        type: () => [product_ingredient_entity_1.ProductIngredient],
        readOnly: true,
    }),
    __metadata("design:type", Array)
], Ingredient.prototype, "productIngredients", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_entity_1.Stock, (stock) => stock.ingredient),
    (0, swagger_1.ApiProperty)({
        description: 'List of stock batches',
        type: () => [stock_entity_1.Stock],
        readOnly: true,
    }),
    __metadata("design:type", Array)
], Ingredient.prototype, "stocks", void 0);
exports.Ingredient = Ingredient = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Index)(['name', 'user'], { unique: true })
], Ingredient);
//# sourceMappingURL=ingredient.entity.js.map