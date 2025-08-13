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
exports.UpdateProductDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class IngredientDetail {
    ingredientId;
    quantity;
    unit;
    is_optional;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier of the ingredient',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], IngredientDetail.prototype, "ingredientId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    (0, swagger_1.ApiProperty)({ description: 'Quantity of the ingredient', example: 250 }),
    __metadata("design:type", Number)
], IngredientDetail.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: 'Unit of measurement (e.g., ml, g)',
        example: 'ml',
    }),
    __metadata("design:type", String)
], IngredientDetail.prototype, "unit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        description: 'Whether the ingredient is optional',
        example: false,
        required: false,
    }),
    __metadata("design:type", Boolean)
], IngredientDetail.prototype, "is_optional", void 0);
class UpdateProductDto {
    name;
    category;
    sell_price;
    ingredients;
}
exports.UpdateProductDto = UpdateProductDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: 'Name of the product',
        example: 'Updated Coffee Latte',
        required: false,
    }),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: 'Category of the product',
        example: 'Beverage',
        required: false,
    }),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: 'Selling price of the product',
        example: 5.0,
        required: false,
    }),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "sell_price", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => IngredientDetail),
    (0, swagger_1.ApiProperty)({
        description: 'List of ingredients with their quantities and units',
        type: [IngredientDetail],
        example: [
            {
                ingredientId: '123e4567-e89b-12d3-a456-426614174000',
                quantity: 250,
                unit: 'ml',
                is_optional: false,
            },
        ],
        required: false,
    }),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "ingredients", void 0);
//# sourceMappingURL=update-product.dto.js.map