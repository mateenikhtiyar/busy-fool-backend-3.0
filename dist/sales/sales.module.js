"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sales_service_1 = require("./sales.service");
const sales_controller_1 = require("./sales.controller");
const sale_entity_1 = require("./entities/sale.entity");
const ingredient_entity_1 = require("../ingredients/entities/ingredient.entity");
const product_ingredient_entity_1 = require("../products/entities/product-ingredient.entity");
const purchase_entity_1 = require("../purchases/entities/purchase.entity");
const waste_entity_1 = require("../waste/entities/waste.entity");
const products_module_1 = require("../products/products.module");
const users_module_1 = require("../users/users.module");
const stock_module_1 = require("../stock/stock.module");
const waste_module_1 = require("../waste/waste.module");
const csv_mappings_module_1 = require("../csv_mappings/csv_mappings.module");
const csv_mappings_entity_1 = require("../csv_mappings/entities/csv-mappings.entity");
const import_sales_entity_1 = require("./entities/import-sales.entity");
let SalesModule = class SalesModule {
};
exports.SalesModule = SalesModule;
exports.SalesModule = SalesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                sale_entity_1.Sale,
                ingredient_entity_1.Ingredient,
                product_ingredient_entity_1.ProductIngredient,
                purchase_entity_1.Purchase,
                waste_entity_1.Waste,
                import_sales_entity_1.ImportSalesUnmatched,
                csv_mappings_entity_1.CsvMappings,
            ]),
            (0, common_1.forwardRef)(() => products_module_1.ProductsModule),
            users_module_1.UsersModule,
            stock_module_1.StockModule,
            waste_module_1.WasteModule, // Add this to import WasteRepository
            csv_mappings_module_1.CsvMappingsModule,
        ],
        controllers: [sales_controller_1.SalesController],
        providers: [sales_service_1.SalesService],
        exports: [sales_service_1.SalesService],
    })
], SalesModule);
//# sourceMappingURL=sales.module.js.map