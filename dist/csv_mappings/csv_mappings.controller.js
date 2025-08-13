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
exports.SalesDailyController = exports.CsvMappingsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const csv_mappings_service_1 = require("./csv_mappings.service");
const save_mapping_dto_1 = require("./dto/save-mapping.dto");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
let CsvMappingsController = class CsvMappingsController {
    csvService;
    constructor(csvService) {
        this.csvService = csvService;
    }
    // ------------------ Upload CSV Temporarily ------------------
    async uploadTemp(file) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        return this.csvService.getCsvHeaders(file.path);
    }
    // ------------------ Save CSV Mapping ------------------
    async saveMapping(body) {
        // DTO will validate mapping shape if you have class-validator on SaveMappingDto
        return this.csvService.saveMapping(body.userId, body.mappings);
    }
    // ------------------ Import Sales from CSV/XLSX ------------------
    async importSales(file, body) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        if (!body || !body.userId)
            throw new common_1.BadRequestException('userId is required');
        // Coerce userId (strip quotes if user pasted string with quotes)
        let userId = String(body.userId).trim();
        if (userId.startsWith('"') && userId.endsWith('"'))
            userId = userId.slice(1, -1);
        // Coerce confirm to boolean (multipart/form-data sends strings)
        let confirm = false;
        if (typeof body.confirm === 'string') {
            confirm = ['true', '1', 'yes'].includes(body.confirm.toLowerCase());
        }
        else {
            confirm = !!body.confirm;
        }
        return this.csvService.importSales(file.path, userId, confirm);
    }
    // ------------------ Import Daily Sales (filename date fallback) ------------------
    async importDailySales(file, body) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        if (!body || !body.userId)
            throw new common_1.BadRequestException('userId is required');
        let userId = String(body.userId).trim();
        if (userId.startsWith('"') && userId.endsWith('"'))
            userId = userId.slice(1, -1);
        let confirm = false;
        if (typeof body.confirm === 'string') {
            confirm = ['true', '1', 'yes'].includes(body.confirm.toLowerCase());
        }
        else {
            confirm = !!body.confirm;
        }
        return this.csvService.importDailySales(file.path, userId, confirm);
    }
};
exports.CsvMappingsController = CsvMappingsController;
__decorate([
    (0, common_1.Post)('upload-temp'),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload a CSV/XLSX temporarily to extract headers',
        description: 'Uploads a CSV or Excel file to extract headers so the user can map POS columns to BusyFool fields.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'CSV or XLSX file',
                },
            },
            required: ['file'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'CSV/XLSX headers extracted',
        type: [String],
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/temp',
            filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CsvMappingsController.prototype, "uploadTemp", null);
__decorate([
    (0, common_1.Post)('save-mapping'),
    (0, swagger_1.ApiOperation)({ summary: 'Save CSV -> BusyFool mappings for a user' }),
    (0, swagger_1.ApiBody)({
        type: save_mapping_dto_1.SaveMappingDto,
        description: 'userId and mappings array mapping POS headers -> busyfool fields',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Mapping saved successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [save_mapping_dto_1.SaveMappingDto]),
    __metadata("design:returntype", Promise)
], CsvMappingsController.prototype, "saveMapping", null);
__decorate([
    (0, common_1.Post)('import-sales'),
    (0, swagger_1.ApiOperation)({
        summary: 'Import sales from CSV/XLSX (preview or confirm)',
        description: 'Upload CSV/XLSX with per-row total amount (Amount). confirm=false => dry-run, confirm=true => saves Sale rows.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string', example: 'uuid-of-user' },
                confirm: {
                    type: 'boolean',
                    example: false,
                    description: 'If false, dry-run (preview) only',
                },
                file: { type: 'string', format: 'binary' },
            },
            required: ['userId', 'file'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Sales import insights (per-row + totals)',
        schema: {
            example: {
                totalSales: 489.3,
                totalProfit: 0,
                avgProfitMargin: 0,
                rows: [
                    {
                        productName: 'Banana Bread',
                        quantitySold: 4,
                        amount: 15.2,
                        unitPrice: 3.8,
                        saleDate: '2025-08-06T00:00:00.000Z',
                        profit: 0,
                        profitMargin: 0,
                    },
                ],
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/csv',
            filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CsvMappingsController.prototype, "importSales", null);
__decorate([
    (0, common_1.Post)('import-daily-sales'),
    (0, swagger_1.ApiOperation)({
        summary: 'Import daily sales (filename date fallback)',
        description: 'Similar to import-sales but will use date from filename (e.g. items-report-YYYY-MM-DD_YYYY-MM-DD.csv) when sale_date column missing.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string' },
                confirm: { type: 'boolean' },
                file: { type: 'string', format: 'binary' },
            },
            required: ['userId', 'file'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Daily import preview or saved results',
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/csv',
            filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CsvMappingsController.prototype, "importDailySales", null);
exports.CsvMappingsController = CsvMappingsController = __decorate([
    (0, swagger_1.ApiTags)('CSV Mappings'),
    (0, common_1.Controller)('csv-mappings'),
    __metadata("design:paramtypes", [csv_mappings_service_1.CsvMappingsService])
], CsvMappingsController);
// ------------------ Lightweight Sales controller for daily summary ------------------
const common_2 = require("@nestjs/common");
const swagger_2 = require("@nestjs/swagger");
let SalesDailyController = class SalesDailyController {
    csvService;
    constructor(csvService) {
        this.csvService = csvService;
    }
    async getDailySales(userId, startDate, endDate) {
        return this.csvService.getDailySales(userId, startDate, endDate);
    }
};
exports.SalesDailyController = SalesDailyController;
__decorate([
    (0, common_2.Get)('daily'),
    (0, swagger_2.ApiOperation)({
        summary: 'Get daily sales summary',
        description: 'Returns aggregated daily sales for a user and optional date range',
    }),
    (0, swagger_2.ApiQuery)({ name: 'userId', required: true, type: String }),
    (0, swagger_2.ApiQuery)({ name: 'startDate', required: false, type: String }),
    (0, swagger_2.ApiQuery)({ name: 'endDate', required: false, type: String }),
    (0, swagger_2.ApiResponse)({
        status: 200,
        description: 'Daily sales summary array',
        schema: {
            example: [
                {
                    date: '2025-08-06',
                    totalSales: 489.3,
                    totalProfit: 0,
                    itemsSold: 127,
                },
            ],
        },
    }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], SalesDailyController.prototype, "getDailySales", null);
exports.SalesDailyController = SalesDailyController = __decorate([
    (0, swagger_2.ApiTags)('Sales'),
    (0, common_2.Controller)('sales'),
    __metadata("design:paramtypes", [csv_mappings_service_1.CsvMappingsService])
], SalesDailyController);
//# sourceMappingURL=csv_mappings.controller.js.map