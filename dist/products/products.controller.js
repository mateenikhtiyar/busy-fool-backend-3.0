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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const maxProducible_quantity_response_dto_1 = require("./dto/maxProducible-quantity-response.dto");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const what_if_dto_1 = require("./dto/what-if.dto");
const milk_swap_dto_1 = require("./dto/milk-swap.dto");
const quick_action_dto_1 = require("./dto/quick-action.dto");
const swagger_1 = require("@nestjs/swagger");
const product_entity_1 = require("./entities/product.entity");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_entity_1 = require("../users/user.entity");
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    async create(createProductDto, req) {
        return this.productsService.create(createProductDto, req.user.sub);
    }
    async findAll(req) {
        return this.productsService.findAll(req.user.sub);
    }
    async findOne(id, req) {
        return this.productsService.findOne(id, req.user.sub);
    }
    async update(id, updateProductDto, req) {
        return this.productsService.update(id, updateProductDto, req.user.sub);
    }
    async remove(id, req) {
        return this.productsService.remove(id, req.user.sub);
    }
    async whatIf(whatIfDto, req) {
        return this.productsService.whatIf(whatIfDto, req.user.sub);
    }
    async milkSwap(milkSwapDto, req) {
        return this.productsService.milkSwap(milkSwapDto, req.user.sub);
    }
    async getMaxProducibleQuantity(productId, req) {
        return this.productsService.getMaxProducibleQuantity(productId, req.user.sub);
    }
    async quickAction(id, quickActionDto, req) {
        if (quickActionDto.new_sell_price <= 0) {
            throw new common_1.BadRequestException('New sell price must be positive');
        }
        return this.productsService.quickAction(id, quickActionDto, req.user.sub);
    }
    async recalculateQuantities() {
        await this.productsService.recalculateAllProductQuantities();
        return { message: 'Product quantities recalculated successfully.' };
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new product',
        description: 'Creates a new product with associated ingredients.',
    }),
    (0, swagger_1.ApiBody)({ type: create_product_dto_1.CreateProductDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Product successfully created.',
        type: product_entity_1.Product,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data or ingredient not found.',
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
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all products',
        description: 'Retrieves a list of all products with their ingredients.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved list of products.',
        type: [product_entity_1.Product],
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No products found.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized (missing or invalid JWT)',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Forbidden (non-owner role)',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a product by ID',
        description: 'Retrieves details of a specific product by its ID.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved product details.',
        type: product_entity_1.Product,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product not found.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized (missing or invalid JWT)',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Forbidden (non-owner role)',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a product',
        description: 'Updates an existing product and its ingredients.',
    }),
    (0, swagger_1.ApiBody)({ type: update_product_dto_1.UpdateProductDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Product successfully updated.',
        type: product_entity_1.Product,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product not found.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data or ingredient not found.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized (missing or invalid JWT)',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Forbidden (non-owner role)',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a product',
        description: 'Deletes a product and its associated ingredients.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Product successfully deleted.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product not found.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized (missing or invalid JWT)',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Forbidden (non-owner role)',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('what-if'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({
        summary: 'Simulate price change impact',
        description: 'Simulates the impact of price adjustments on multiple products.',
    }),
    (0, swagger_1.ApiBody)({ type: what_if_dto_1.WhatIfDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully calculated price change impacts.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'One or more products not found.',
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
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [what_if_dto_1.WhatIfDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "whatIf", null);
__decorate([
    (0, common_1.Post)('milk-swap'),
    (0, swagger_1.ApiOperation)({
        summary: 'Calculate margin impact of swapping an ingredient',
        description: 'Calculates the margin impact of replacing an ingredient.',
    }),
    (0, swagger_1.ApiBody)({ type: milk_swap_dto_1.MilkSwapDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully calculated margin impact.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product or ingredient not found.',
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
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [milk_swap_dto_1.MilkSwapDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "milkSwap", null);
__decorate([
    (0, common_1.Post)('max-producible'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get maximum producible quantity for a product based on stock',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns max producible quantity and stock updates',
        type: maxProducible_quantity_response_dto_1.GetMaxProducibleQuantityResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Invalid product ID or insufficient stock',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - JWT token required',
    }),
    __param(0, (0, common_1.Body)('productId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getMaxProducibleQuantity", null);
__decorate([
    (0, common_1.Post)(':id/quick-action'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({
        summary: 'Apply quick action (e.g., price change)',
        description: 'Applies a quick price change to a product.',
    }),
    (0, swagger_1.ApiBody)({ type: quick_action_dto_1.QuickActionDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully applied quick action.',
        type: product_entity_1.Product,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product not found.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid new sell price.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized (missing or invalid JWT)',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Forbidden (non-owner role)',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, quick_action_dto_1.QuickActionDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "quickAction", null);
__decorate([
    (0, common_1.Post)('recalculate-quantities'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER) // Assuming only owner can trigger this
    ,
    (0, swagger_1.ApiOperation)({
        summary: 'Recalculate all product quantities sold',
        description: 'Aggregates sales data to correct quantity_sold for all products.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Product quantities recalculated successfully.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized (missing or invalid JWT)',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Forbidden (non-owner role)',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "recalculateQuantities", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('products'),
    (0, common_1.Controller)('products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map