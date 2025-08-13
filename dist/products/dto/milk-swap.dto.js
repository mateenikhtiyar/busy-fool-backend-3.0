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
exports.MilkSwapDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class MilkSwapDto {
    productId;
    originalIngredientId;
    newIngredientId;
    upcharge;
}
exports.MilkSwapDto = MilkSwapDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'ID of the product' }),
    __metadata("design:type", String)
], MilkSwapDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'ID of the original ingredient to swap' }),
    __metadata("design:type", String)
], MilkSwapDto.prototype, "originalIngredientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'ID of the new ingredient' }),
    __metadata("design:type", String)
], MilkSwapDto.prototype, "newIngredientId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ description: 'Upcharge amount for the swap', required: false }),
    __metadata("design:type", Number)
], MilkSwapDto.prototype, "upcharge", void 0);
//# sourceMappingURL=milk-swap.dto.js.map