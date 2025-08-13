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
exports.CreatePurchaseDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreatePurchaseDto {
    ingredientId;
    quantity;
    unit;
    purchasePrice; // Renamed for clarity
}
exports.CreatePurchaseDto = CreatePurchaseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'ID of the ingredient purchased' }),
    __metadata("design:type", String)
], CreatePurchaseDto.prototype, "ingredientId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({ description: 'Quantity purchased' }),
    __metadata("design:type", Number)
], CreatePurchaseDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Unit of purchase' }),
    __metadata("design:type", String)
], CreatePurchaseDto.prototype, "unit", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({ description: 'Price per unit of the purchase' }),
    __metadata("design:type", Number)
], CreatePurchaseDto.prototype, "purchasePrice", void 0);
//# sourceMappingURL=create-purchase.dto.js.map