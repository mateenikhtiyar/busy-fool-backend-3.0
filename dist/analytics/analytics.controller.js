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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("./analytics.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_entity_1 = require("../users/user.entity");
let AnalyticsController = class AnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getDashboard(startDate, endDate) {
        console.log('Dashboard request params:', { startDate, endDate });
        if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
            throw new common_1.BadRequestException('Invalid date range. Start date must be before end date.');
        }
        return this.analyticsService.getDashboard(new Date(startDate), new Date(endDate));
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({
        summary: 'Get reality check dashboard data',
        description: 'Provides financial insights for a given date range. This endpoint does not require a product ID.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        type: String,
        required: true,
        description: 'Start date (YYYY-MM-DD)',
        example: '2025-07-01',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        type: String,
        required: true,
        description: 'End date (YYYY-MM-DD)',
        example: '2025-07-23',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved dashboard data.',
        schema: {
            type: 'object',
            properties: {
                revenue: { type: 'string', example: '100.00' },
                costs: { type: 'string', example: '60.00' },
                profit: { type: 'string', example: '40.00' },
                profitMargin: { type: 'string', example: '40.00' },
                losingMoney: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string', example: 'Lossy Product' },
                            margin_amount: { type: 'number', example: -5.0 },
                        },
                    },
                },
                winners: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string', example: 'Winner Product' },
                            margin_amount: { type: 'number', example: 10.0 },
                        },
                    },
                },
                quickWins: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string', example: 'Lossy Product' },
                            suggestion: { type: 'string', example: 'Raise price by £5.50' },
                        },
                    },
                },
            },
            example: {
                revenue: '100.00',
                costs: '60.00',
                profit: '40.00',
                profitMargin: '40.00',
                losingMoney: [{ name: 'Lossy Product', margin_amount: -5.0 }],
                winners: [{ name: 'Winner Product', margin_amount: 10.0 }],
                quickWins: [
                    { name: 'Lossy Product', suggestion: 'Raise price by £5.50' },
                ],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid date range or missing query parameters.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error due to database query failure.',
    }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboard", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('analytics'),
    (0, common_1.Controller)('products/analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map