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
exports.Sale = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const product_entity_1 = require("../../products/entities/product.entity");
const user_entity_1 = require("../../users/user.entity");
let Sale = class Sale {
    id;
    product;
    product_name;
    user;
    quantity;
    total_amount;
    sale_date;
};
exports.Sale = Sale;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the sale' }),
    __metadata("design:type", String)
], Sale.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, {
        eager: true,
        nullable: true,
        onDelete: 'CASCADE',
    }),
    (0, swagger_1.ApiProperty)({
        description: 'Product sold (nullable for unregistered products)',
        type: () => product_entity_1.Product,
        required: false,
    }),
    __metadata("design:type", product_entity_1.Product)
], Sale.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)({
        description: 'Name of the product at time of sale (for unregistered products)',
        required: false,
    }),
    __metadata("design:type", String)
], Sale.prototype, "product_name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.sales, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], Sale.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    (0, swagger_1.ApiProperty)({ description: 'Quantity sold (e.g., number of cups)' }),
    __metadata("design:type", Number)
], Sale.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    (0, swagger_1.ApiProperty)({ description: 'Total sale amount (quantity × sell_price)' }),
    __metadata("design:type", Number)
], Sale.prototype, "total_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Date of the sale (optional)', required: false }),
    __metadata("design:type", Object)
], Sale.prototype, "sale_date", void 0);
exports.Sale = Sale = __decorate([
    (0, typeorm_1.Entity)()
], Sale);
//# sourceMappingURL=sale.entity.js.map