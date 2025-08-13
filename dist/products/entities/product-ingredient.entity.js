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
exports.ProductIngredient = void 0;
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
const ingredient_entity_1 = require("../../ingredients/entities/ingredient.entity");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const numberTransformer = {
    from: (value) => parseFloat(value),
    to: (value) => value.toFixed(2),
};
let ProductIngredient = class ProductIngredient {
    id;
    product;
    ingredient;
    quantity;
    unit;
    line_cost;
    is_optional;
    name;
    cost_per_unit;
    productId;
    ingredientId;
};
exports.ProductIngredient = ProductIngredient;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the product-ingredient relation',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], ProductIngredient.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, (product) => product.ingredients, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    (0, class_transformer_1.Exclude)() // Exclude the product reference to break circularity
    ,
    __metadata("design:type", product_entity_1.Product)
], ProductIngredient.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ingredient_entity_1.Ingredient, (ingredient) => ingredient.productIngredients, {
        eager: true,
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'ingredientId' }),
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Associated ingredient', type: () => ingredient_entity_1.Ingredient }),
    __metadata("design:type", ingredient_entity_1.Ingredient)
], ProductIngredient.prototype, "ingredient", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: false,
        transformer: numberTransformer,
    }),
    (0, swagger_1.ApiProperty)({ description: 'Quantity used', example: 50, minimum: 0.01 }),
    __metadata("design:type", Number)
], ProductIngredient.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: false }),
    (0, swagger_1.ApiProperty)({
        description: 'Unit of measurement',
        example: 'ml',
        minLength: 1,
        maxLength: 50,
    }),
    __metadata("design:type", String)
], ProductIngredient.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: false }),
    (0, swagger_1.ApiProperty)({ description: 'Line cost', example: 0.42, minimum: 0 }),
    __metadata("design:type", Number)
], ProductIngredient.prototype, "line_cost", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, swagger_1.ApiProperty)({
        description: 'Whether the ingredient is optional',
        example: false,
    }),
    __metadata("design:type", Boolean)
], ProductIngredient.prototype, "is_optional", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }) // Add column for name if needed
    ,
    (0, swagger_1.ApiProperty)({
        description: 'Ingredient name',
        example: 'Oat Milk',
        readOnly: true,
    }),
    __metadata("design:type", String)
], ProductIngredient.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 4, nullable: true }) // Add column for cost_per_unit
    ,
    (0, swagger_1.ApiProperty)({
        description: 'Waste-adjusted cost per unit',
        example: 0.0084,
        readOnly: true,
    }),
    __metadata("design:type", Number)
], ProductIngredient.prototype, "cost_per_unit", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductIngredient.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductIngredient.prototype, "ingredientId", void 0);
exports.ProductIngredient = ProductIngredient = __decorate([
    (0, typeorm_1.Entity)()
], ProductIngredient);
//# sourceMappingURL=product-ingredient.entity.js.map