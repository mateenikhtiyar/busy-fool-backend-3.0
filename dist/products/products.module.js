"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const products_service_1 = require("./products.service");
const products_controller_1 = require("./products.controller");
const product_entity_1 = require("./entities/product.entity");
const product_ingredient_entity_1 = require("./entities/product-ingredient.entity");
const ingredients_module_1 = require("../ingredients/ingredients.module");
const stock_module_1 = require("../stock/stock.module");
const stock_entity_1 = require("../stock/entities/stock.entity");
const users_module_1 = require("../users/users.module");
const sale_entity_1 = require("../sales/entities/sale.entity");
const sales_module_1 = require("../sales/sales.module");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([product_entity_1.Product, product_ingredient_entity_1.ProductIngredient, stock_entity_1.Stock, sale_entity_1.Sale]),
            ingredients_module_1.IngredientsModule,
            (0, common_1.forwardRef)(() => stock_module_1.StockModule),
            (0, common_1.forwardRef)(() => sales_module_1.SalesModule),
            users_module_1.UsersModule,
        ],
        controllers: [products_controller_1.ProductsController],
        providers: [products_service_1.ProductsService],
        exports: [products_service_1.ProductsService, typeorm_1.TypeOrmModule],
    })
], ProductsModule);
//# sourceMappingURL=products.module.js.map