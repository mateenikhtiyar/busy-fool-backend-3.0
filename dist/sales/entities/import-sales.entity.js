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
exports.ImportSalesUnmatched = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/user.entity");
let ImportSalesUnmatched = class ImportSalesUnmatched {
    id;
    productName;
    quantitySold;
    salePrice;
    saleDate;
    isLinked;
    user;
};
exports.ImportSalesUnmatched = ImportSalesUnmatched;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ImportSalesUnmatched.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ImportSalesUnmatched.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ImportSalesUnmatched.prototype, "quantitySold", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal'),
    __metadata("design:type", Number)
], ImportSalesUnmatched.prototype, "salePrice", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ImportSalesUnmatched.prototype, "saleDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ImportSalesUnmatched.prototype, "isLinked", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.id),
    __metadata("design:type", user_entity_1.User)
], ImportSalesUnmatched.prototype, "user", void 0);
exports.ImportSalesUnmatched = ImportSalesUnmatched = __decorate([
    (0, typeorm_1.Entity)()
], ImportSalesUnmatched);
//# sourceMappingURL=import-sales.entity.js.map