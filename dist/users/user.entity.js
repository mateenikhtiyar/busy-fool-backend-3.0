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
exports.User = exports.UserRole = void 0;
// src/users/user.entity.ts
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const swagger_1 = require("@nestjs/swagger");
const product_entity_1 = require("../products/entities/product.entity");
const ingredient_entity_1 = require("../ingredients/entities/ingredient.entity");
const sale_entity_1 = require("../sales/entities/sale.entity");
const stock_entity_1 = require("../stock/entities/stock.entity");
const purchase_entity_1 = require("../purchases/entities/purchase.entity");
var UserRole;
(function (UserRole) {
    UserRole["OWNER"] = "owner";
    UserRole["STAFF"] = "staff";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = class User {
    id;
    products;
    ingredients;
    sales;
    stocks;
    purchases;
    name;
    email;
    password;
    role;
    profilePicture;
    phoneNumber;
    address;
    bio;
    dateOfBirth;
    created_at;
    last_updated;
    resetPasswordToken;
    resetPasswordExpires;
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the user' }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_entity_1.Product, (product) => product.user),
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", Array)
], User.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ingredient_entity_1.Ingredient, (ingredient) => ingredient.user),
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", Array)
], User.prototype, "ingredients", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sale_entity_1.Sale, (sale) => sale.user),
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", Array)
], User.prototype, "sales", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_entity_1.Stock, (stock) => stock.user),
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", Array)
], User.prototype, "stocks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => purchase_entity_1.Purchase, (purchase) => purchase.user),
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", Array)
], User.prototype, "purchases", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Name of the user' }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, swagger_1.ApiProperty)({ description: 'Email address of the user' }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({ description: 'Hashed password of the user' }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: UserRole, default: UserRole.OWNER }),
    (0, swagger_1.ApiProperty)({
        description: 'Role of the user (owner or staff)',
        enum: UserRole,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)({
        description: "URL or path to the user's profile picture",
        example: 'https://example.com/profile.jpg',
    }),
    __metadata("design:type", String)
], User.prototype, "profilePicture", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)({
        description: 'Phone number of the user',
        example: '+1234567890',
    }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    (0, swagger_1.ApiProperty)({
        description: 'Address of the user',
        example: '123 Coffee St, Caffeine City',
    }),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    (0, swagger_1.ApiProperty)({
        description: 'Short bio or description about the user',
        example: 'Coffee enthusiast',
    }),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'date' }),
    (0, swagger_1.ApiProperty)({
        description: 'Date of birth of the user',
        example: '1990-01-01',
    }),
    __metadata("design:type", Date)
], User.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, swagger_1.ApiProperty)({ description: 'Date the user was created' }),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, swagger_1.ApiProperty)({ description: 'Date the user was last updated' }),
    __metadata("design:type", Date)
], User.prototype, "last_updated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar' }),
    __metadata("design:type", Object)
], User.prototype, "resetPasswordToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "resetPasswordExpires", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPassword", null);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=user.entity.js.map