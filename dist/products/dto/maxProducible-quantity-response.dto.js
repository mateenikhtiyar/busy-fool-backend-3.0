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
exports.GetMaxProducibleQuantityResponseDto = exports.StockUpdateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class StockUpdateDto {
    ingredientId;
    remainingQuantity;
    unit;
}
exports.StockUpdateDto = StockUpdateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the ingredient',
        example: 'c885486e-4e7c-42f3-971c-5778f7e96e8d',
    }),
    __metadata("design:type", String)
], StockUpdateDto.prototype, "ingredientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Remaining quantity after production',
        example: 5.45,
    }),
    __metadata("design:type", Number)
], StockUpdateDto.prototype, "remainingQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unit of measurement', example: 'L' }),
    __metadata("design:type", String)
], StockUpdateDto.prototype, "unit", void 0);
class GetMaxProducibleQuantityResponseDto {
    maxQuantity;
    stockUpdates;
}
exports.GetMaxProducibleQuantityResponseDto = GetMaxProducibleQuantityResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum number of products that can be produced',
        example: 9,
    }),
    __metadata("design:type", Number)
], GetMaxProducibleQuantityResponseDto.prototype, "maxQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [StockUpdateDto],
        description: 'Projected stock updates after production',
    }),
    __metadata("design:type", Array)
], GetMaxProducibleQuantityResponseDto.prototype, "stockUpdates", void 0);
//# sourceMappingURL=maxProducible-quantity-response.dto.js.map