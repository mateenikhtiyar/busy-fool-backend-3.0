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
exports.CreateIngredientDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateIngredientDto {
    name;
    unit;
    quantity;
    purchase_price;
    waste_percent;
    cost_per_ml;
    cost_per_gram;
    cost_per_unit;
    supplier;
}
exports.CreateIngredientDto = CreateIngredientDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Name of the ingredient', example: 'Oat Milk' }),
    __metadata("design:type", String)
], CreateIngredientDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: 'Unit of measurement (e.g., kg, L, unit)',
        example: 'L',
    }),
    __metadata("design:type", String)
], CreateIngredientDto.prototype, "unit", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    (0, swagger_1.ApiProperty)({ description: 'Quantity of the ingredient', example: 2 }),
    __metadata("design:type", Number)
], CreateIngredientDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, swagger_1.ApiProperty)({
        description: 'Purchase price of the ingredient',
        example: 2.53,
    }),
    __metadata("design:type", Number)
], CreateIngredientDto.prototype, "purchase_price", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, swagger_1.ApiProperty)({ description: 'Waste percentage (0-100)', example: 10 }),
    __metadata("design:type", Number)
], CreateIngredientDto.prototype, "waste_percent", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, swagger_1.ApiProperty)({
        description: 'Cost per milliliter',
        example: 0.00281,
        required: false,
    }),
    __metadata("design:type", Number)
], CreateIngredientDto.prototype, "cost_per_ml", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, swagger_1.ApiProperty)({
        description: 'Cost per gram',
        example: 0.0157,
        required: false,
    }),
    __metadata("design:type", Number)
], CreateIngredientDto.prototype, "cost_per_gram", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, swagger_1.ApiProperty)({ description: 'Cost per unit', example: 1.25, required: false }),
    __metadata("design:type", Number)
], CreateIngredientDto.prototype, "cost_per_unit", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: 'Supplier name',
        example: 'Oatly',
        required: false,
    }),
    __metadata("design:type", String)
], CreateIngredientDto.prototype, "supplier", void 0);
//# sourceMappingURL=create-ingredient.dto.js.map