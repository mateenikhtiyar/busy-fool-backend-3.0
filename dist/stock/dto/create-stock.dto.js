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
exports.CreateStockDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateStockDto {
    ingredientId;
    purchased_quantity;
    unit;
    purchase_price;
    waste_percent;
}
exports.CreateStockDto = CreateStockDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the ingredient' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStockDto.prototype, "ingredientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity of the ingredient purchased' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreateStockDto.prototype, "purchased_quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unit of measurement (e.g., ml, g, unit)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStockDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Price per unit of the purchased ingredient' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateStockDto.prototype, "purchase_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Percentage of waste expected (0-100)',
        required: false,
        default: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateStockDto.prototype, "waste_percent", void 0);
//# sourceMappingURL=create-stock.dto.js.map