"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvMappingsModule = void 0;
const common_1 = require("@nestjs/common");
const csv_mappings_service_1 = require("./csv_mappings.service");
const csv_mappings_controller_1 = require("./csv_mappings.controller");
const typeorm_1 = require("@nestjs/typeorm");
const csv_mappings_entity_1 = require("./entities/csv-mappings.entity");
const sale_entity_1 = require("../sales/entities/sale.entity");
const product_entity_1 = require("../products/entities/product.entity");
let CsvMappingsModule = class CsvMappingsModule {
};
exports.CsvMappingsModule = CsvMappingsModule;
exports.CsvMappingsModule = CsvMappingsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([csv_mappings_entity_1.CsvMappings, sale_entity_1.Sale, product_entity_1.Product])],
        controllers: [csv_mappings_controller_1.CsvMappingsController],
        providers: [csv_mappings_service_1.CsvMappingsService],
    })
], CsvMappingsModule);
//# sourceMappingURL=csv_mappings.module.js.map