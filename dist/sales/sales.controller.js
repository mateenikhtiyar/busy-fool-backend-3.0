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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesController = void 0;
const common_1 = require("@nestjs/common");
const sales_service_1 = require("./sales.service");
const create_sale_dto_1 = require("./dto/create-sale.dto");
const update_sale_dto_1 = require("./dto/update-sale.dto");
const swagger_1 = require("@nestjs/swagger");
const sale_entity_1 = require("./entities/sale.entity");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_entity_1 = require("../users/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const csv_mappings_entity_1 = require("../csv_mappings/entities/csv-mappings.entity");
const typeorm_2 = require("typeorm");
let SalesController = class SalesController {
    salesService;
    csvMappingRepository;
    constructor(salesService, csvMappingRepository) {
        this.salesService = salesService;
        this.csvMappingRepository = csvMappingRepository;
    }
    // ------------------ Create Sale ------------------
    async create(createSaleDto, req) {
        return this.salesService.create(createSaleDto, req.user.sub);
    }
    // ------------------ Get All Sales ------------------
    async findAll(req) {
        return this.salesService.findAll(req.user.sub);
    }
    // ------------------ Delete Sale ------------------
    async remove(id, req) {
        return this.salesService.remove(id, req.user.sub);
    }
    // ------------------ Update Sale ------------------
    async update(id, updateSaleDto, req) {
        return this.salesService.update(id, updateSaleDto, req.user.sub);
    }
    // ------------------ Dashboard ------------------
    async getDashboard(startDate, endDate, req) {
        return this.salesService.getDashboard(new Date(startDate), new Date(endDate), req.user.sub);
    }
    // ------------------ Monthly Reality Check ------------------
    async getMonthlyRealityCheck(startDate, endDate, req) {
        return this.salesService.getMonthlyRealityCheck(new Date(startDate), new Date(endDate), req.user.sub);
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({
        summary: 'Record a new sale',
        description: "Records a new sale transaction and automatically updates the product's quantity_sold.",
    }),
    (0, swagger_1.ApiBody)({ type: create_sale_dto_1.CreateSaleDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Sale successfully recorded and product quantity_sold updated.',
        type: sale_entity_1.Sale,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sale_dto_1.CreateSaleDto, Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Get all sales' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of sales',
        type: [sale_entity_1.Sale],
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a sale by ID',
        description: "Deletes a sale transaction and automatically decrements the product's quantity_sold.",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Sale successfully deleted and product quantity_sold decremented.',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a sale by ID',
        description: "Updates an existing sale transaction and automatically adjusts the product's quantity_sold.",
    }),
    (0, swagger_1.ApiBody)({ type: update_sale_dto_1.UpdateSaleDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Sale successfully updated and product quantity_sold adjusted.',
        type: sale_entity_1.Sale,
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Sale not found.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data.',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_sale_dto_1.UpdateSaleDto, Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Get reality check dashboard data' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('monthly-reality-check'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Get monthly reality check report' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getMonthlyRealityCheck", null);
exports.SalesController = SalesController = __decorate([
    (0, swagger_1.ApiTags)('Sales'),
    (0, common_1.Controller)('sales'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __param(1, (0, typeorm_1.InjectRepository)(csv_mappings_entity_1.CsvMappings)),
    __metadata("design:paramtypes", [sales_service_1.SalesService,
        typeorm_2.Repository])
], SalesController);
//# sourceMappingURL=sales.controller.js.map