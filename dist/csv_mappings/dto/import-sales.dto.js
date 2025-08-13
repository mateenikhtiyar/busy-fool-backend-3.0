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
exports.ImportSalesDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ImportSalesDto {
    userId;
    confirm;
}
exports.ImportSalesDto = ImportSalesDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: '6b3db133-0d67-4d01-967a-4816e5c4fd77',
        description: 'User ID',
    }),
    __metadata("design:type", String)
], ImportSalesDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'boolean')
            return value;
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return false;
    }),
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'If false, runs preview without saving',
    }),
    __metadata("design:type", Boolean)
], ImportSalesDto.prototype, "confirm", void 0);
//# sourceMappingURL=import-sales.dto.js.map