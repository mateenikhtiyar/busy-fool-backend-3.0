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
exports.PurchasesController = void 0;
const common_1 = require("@nestjs/common");
const purchases_service_1 = require("./purchases.service");
const create_purchase_dto_1 = require("./dto/create-purchase.dto");
const swagger_1 = require("@nestjs/swagger");
const purchase_entity_1 = require("./entities/purchase.entity");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_entity_1 = require("../users/user.entity");
let PurchasesController = class PurchasesController {
    purchasesService;
    constructor(purchasesService) {
        this.purchasesService = purchasesService;
    }
    async create(createPurchaseDto, req) {
        return this.purchasesService.create(createPurchaseDto, req.user.sub);
    }
    async remove(id, req) {
        return this.purchasesService.remove(id, req.user.sub);
    }
    async findAll(req) {
        return this.purchasesService.findAll(req.user.sub);
    }
};
exports.PurchasesController = PurchasesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({
        summary: 'Record a new purchase',
        description: 'Records a new purchase transaction for an ingredient.',
    }),
    (0, swagger_1.ApiBody)({
        type: create_purchase_dto_1.CreatePurchaseDto,
        description: 'Purchase data including ingredient ID and quantity',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Purchase recorded successfully.',
        type: purchase_entity_1.Purchase,
        content: {
            'application/json': {
                example: {
                    id: '123e4567-e89b-12d3-a456-426614174009',
                    ingredientId: '123e4567-e89b-12d3-a456-426614174010',
                    quantity: 10,
                    unit: 'L',
                    purchasePrice: 2.5, // Per unit price
                    total_cost: 25.0, // quantity * purchasePrice
                    purchase_date: '2025-07-28T16:29:00Z',
                    userId: 'user-uuid-here',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Ingredient not found.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized (missing or invalid JWT)',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Forbidden (non-owner role)',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_purchase_dto_1.CreatePurchaseDto, Object]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a purchase by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Purchase deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Purchase not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all purchases',
        description: 'Retrieves a list of all recorded purchases.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of purchases retrieved successfully.',
        type: [purchase_entity_1.Purchase],
        content: {
            'application/json': {
                example: [
                    {
                        id: '123e4567-e89b-12d3-a456-426614174009',
                        ingredientId: '123e4567-e89b-12d3-a456-426614174010',
                        quantity: 10,
                        unit: 'L',
                        purchasePrice: 25.0,
                        created_at: '2025-07-28T16:29:00Z',
                        userId: 'user-uuid-here',
                    },
                    {
                        id: '123e4567-e89b-12d3-a456-426614174011',
                        ingredientId: '123e4567-e89b-12d3-a456-426614174012',
                        quantity: 5,
                        unit: 'kg',
                        purchasePrice: 15.0,
                        created_at: '2025-07-28T16:30:00Z',
                        userId: 'user-uuid-here',
                    },
                ],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No purchases found.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized (missing or invalid JWT)',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Forbidden (non-owner role)',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "findAll", null);
exports.PurchasesController = PurchasesController = __decorate([
    (0, swagger_1.ApiTags)('purchases'),
    (0, swagger_1.ApiTags)('purchases'),
    (0, common_1.Controller)('purchases'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __metadata("design:paramtypes", [purchases_service_1.PurchasesService])
], PurchasesController);
//# sourceMappingURL=purchases.controller.js.map