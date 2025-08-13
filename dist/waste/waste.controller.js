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
exports.WasteController = void 0;
const common_1 = require("@nestjs/common");
const waste_service_1 = require("./waste.service");
const create_waste_dto_1 = require("./dto/create-waste.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_entity_1 = require("../users/user.entity");
let WasteController = class WasteController {
    wasteService;
    constructor(wasteService) {
        this.wasteService = wasteService;
    }
    async create(createWasteDto, req) {
        return this.wasteService.create(createWasteDto);
    }
    async findAll() {
        return this.wasteService.findAll();
    }
};
exports.WasteController = WasteController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Record waste' }),
    (0, swagger_1.ApiBody)({ type: create_waste_dto_1.CreateWasteDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Waste recorded successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Stock not found.' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input or insufficient stock.',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_waste_dto_1.CreateWasteDto, Object]),
    __metadata("design:returntype", Promise)
], WasteController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Get all waste records' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of waste records retrieved.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WasteController.prototype, "findAll", null);
exports.WasteController = WasteController = __decorate([
    (0, swagger_1.ApiTags)('waste'),
    (0, common_1.Controller)('waste'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __metadata("design:paramtypes", [waste_service_1.WasteService])
], WasteController);
//# sourceMappingURL=waste.controller.js.map