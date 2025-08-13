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
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const product_ingredient_entity_1 = require("./product-ingredient.entity");
const sale_entity_1 = require("../../sales/entities/sale.entity");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const user_entity_1 = require("../../users/user.entity"); // Import User entity
let Product = class Product {
    id;
    user; // Add user relationship
    name;
    category;
    sell_price;
    total_cost;
    margin_amount;
    margin_percent;
    status;
    quantity_sold;
    created_at;
    ingredients;
    sales;
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the product' }),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.products, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], Product.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: false }),
    (0, swagger_1.ApiProperty)({ description: 'Name of the product', example: 'Coffee Latte' }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    (0, swagger_1.ApiProperty)({ description: 'Category of the product', example: 'Beverage' }),
    __metadata("design:type", String)
], Product.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    (0, swagger_1.ApiProperty)({ description: 'Selling price of the product', example: 4.5 }),
    __metadata("design:type", Number)
], Product.prototype, "sell_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    (0, swagger_1.ApiProperty)({ description: 'Total cost of the product', example: 2.5 }),
    __metadata("design:type", Number)
], Product.prototype, "total_cost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Margin amount', example: 2.0, required: false }),
    __metadata("design:type", Number)
], Product.prototype, "margin_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    (0, swagger_1.ApiProperty)({
        description: 'Margin percentage',
        example: 44.44,
        required: false,
    }),
    __metadata("design:type", Number)
], Product.prototype, "margin_percent", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    (0, swagger_1.ApiProperty)({ description: 'Status of the product', example: 'profitable' }),
    __metadata("design:type", String)
], Product.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    (0, swagger_1.ApiProperty)({
        description: 'Total quantity of the product sold',
        example: 100,
        required: false,
    }),
    __metadata("design:type", Number)
], Product.prototype, "quantity_sold", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2025-07-24T11:15:00Z',
    }),
    __metadata("design:type", Date)
], Product.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_ingredient_entity_1.ProductIngredient, (pi) => pi.product, {
        cascade: true,
        eager: true,
    }),
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'List of product-ingredient relations',
        type: () => [product_ingredient_entity_1.ProductIngredient],
        readOnly: true,
    }),
    __metadata("design:type", Array)
], Product.prototype, "ingredients", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sale_entity_1.Sale, (sale) => sale.product, { cascade: true }),
    (0, swagger_1.ApiProperty)({
        description: 'List of sales for the product',
        type: () => [sale_entity_1.Sale],
    }),
    __metadata("design:type", Array)
], Product.prototype, "sales", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Index)(['name', 'user'], { unique: true })
], Product);
//# sourceMappingURL=product.entity.js.map