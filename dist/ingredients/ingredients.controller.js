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
exports.IngredientsController = void 0;
const common_1 = require("@nestjs/common");
const ingredients_service_1 = require("./ingredients.service");
const create_ingredient_dto_1 = require("./dto/create-ingredient.dto");
const update_ingredient_dto_1 = require("./dto/update-ingredient.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_entity_1 = require("../users/user.entity");
const platform_express_1 = require("@nestjs/platform-express");
const multer = require("multer");
const path = require("path");
let IngredientsController = class IngredientsController {
    ingredientsService;
    constructor(ingredientsService) {
        this.ingredientsService = ingredientsService;
    }
    async create(createIngredientDto, req) {
        return await this.ingredientsService.create(createIngredientDto, req.user.sub);
    }
    async bulkCreate(createIngredientDtos, req) {
        return await this.ingredientsService.bulkCreate(createIngredientDtos, req.user.sub);
    }
    async importCsv(file, req) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        return await this.ingredientsService.importCsv(file, req.user.sub);
    }
    async findAll(req) {
        return await this.ingredientsService.findAll(req.user.sub);
    }
    async findOne(id, req) {
        return await this.ingredientsService.findOne(id, req.user.sub);
    }
    async update(id, updateIngredientDto, req) {
        return await this.ingredientsService.update(id, updateIngredientDto, req.user.sub);
    }
    async remove(id, req) {
        await this.ingredientsService.remove(id, req.user.sub);
    }
};
exports.IngredientsController = IngredientsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new ingredient' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Ingredient created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiBody)({ type: create_ingredient_dto_1.CreateIngredientDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ingredient_dto_1.CreateIngredientDto, Object]),
    __metadata("design:returntype", Promise)
], IngredientsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Create multiple ingredients in bulk' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Ingredients created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiBody)({ type: [create_ingredient_dto_1.CreateIngredientDto] }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], IngredientsController.prototype, "bulkCreate", null);
__decorate([
    (0, common_1.Post)('import-csv'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                const uploadDir = path.join(__dirname, '..', '..', 'uploads');
                cb(null, uploadDir);
            },
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (path.extname(file.originalname).toLowerCase() !== '.csv') {
                return cb(new common_1.BadRequestException('Only .csv files are allowed'), false);
            }
            cb(null, true);
        },
    })),
    (0, swagger_1.ApiOperation)({ summary: 'Import ingredients from CSV' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Ingredients imported successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IngredientsController.prototype, "importCsv", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all ingredients' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all ingredients' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IngredientsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an ingredient by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ingredient details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ingredient not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IngredientsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Update an ingredient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Updated ingredient' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ingredient not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiBody)({ type: update_ingredient_dto_1.UpdateIngredientDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ingredient_dto_1.UpdateIngredientDto, Object]),
    __metadata("design:returntype", Promise)
], IngredientsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an ingredient' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Ingredient deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ingredient not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IngredientsController.prototype, "remove", null);
exports.IngredientsController = IngredientsController = __decorate([
    (0, swagger_1.ApiTags)('ingredients'),
    (0, common_1.Controller)('ingredients'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __metadata("design:paramtypes", [ingredients_service_1.IngredientsService])
], IngredientsController);
//# sourceMappingURL=ingredients.controller.js.map