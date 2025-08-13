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
var CsvMappingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvMappingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const csv_mappings_entity_1 = require("./entities/csv-mappings.entity");
const sale_entity_1 = require("../sales/entities/sale.entity");
const product_entity_1 = require("../products/entities/product.entity");
const csvParser = require("fast-csv");
const XLSX = require("xlsx");
let CsvMappingsService = CsvMappingsService_1 = class CsvMappingsService {
    csvMappingRepository;
    saleRepository;
    productRepository;
    logger = new common_1.Logger(CsvMappingsService_1.name);
    constructor(csvMappingRepository, saleRepository, productRepository) {
        this.csvMappingRepository = csvMappingRepository;
        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
    }
    // -------------------------
    // Helpers
    // -------------------------
    parseNumber(value) {
        if (value === null || value === undefined || value === '')
            return 0;
        if (typeof value === 'number')
            return value;
        const s = String(value).trim();
        // Remove currency symbols, spaces and thousands separators
        const cleaned = s.replace(/[^\d.-]/g, '');
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
    }
    normalizeHeader(header) {
        return header ? header.trim().toLowerCase() : header;
    }
    // -------------------------
    // Read headers (CSV or XLSX)
    // -------------------------
    async getCsvHeaders(filePath) {
        const fileExt = filePath.split('.').pop()?.toLowerCase();
        if (fileExt === 'csv') {
            return new Promise((resolve, reject) => {
                csvParser
                    .parseFile(filePath, { headers: true })
                    .on('headers', (hdrs) => {
                    resolve(hdrs.map((h) => this.normalizeHeader(h)));
                })
                    .on('error', reject);
            });
        }
        else if (fileExt === 'xlsx' || fileExt === 'xls') {
            try {
                const workbook = XLSX.readFile(filePath);
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const rawRows = XLSX.utils.sheet_to_json(worksheet, {
                    header: 1,
                });
                if (!rawRows || rawRows.length === 0)
                    throw new common_1.BadRequestException('No data found in Excel file.');
                const headers = rawRows[0].map((h) => this.normalizeHeader(String(h || '')));
                return headers;
            }
            catch (err) {
                throw new common_1.BadRequestException('Failed to read Excel file: ' + (err?.message || err));
            }
        }
        else {
            throw new common_1.BadRequestException('Unsupported file format. Please upload .csv or .xlsx');
        }
    }
    // -------------------------
    // Save mapping
    // -------------------------
    async saveMapping(userId, mappings) {
        await this.csvMappingRepository.delete({ user: { id: userId } });
        const newMappings = mappings.map((m) => this.csvMappingRepository.create({
            user: { id: userId },
            ourSystemColumn: m.busyfoolColumn,
            posColumnName: this.normalizeHeader(m.posColumnName),
        }));
        return this.csvMappingRepository.save(newMappings);
    }
    // -------------------------
    // Parse file into normalized rows (lowercase headers)
    // -------------------------
    async parseFileToRows(filePath) {
        const fileExt = filePath.split('.').pop()?.toLowerCase();
        if (fileExt === 'csv') {
            return new Promise((resolve, reject) => {
                const rows = [];
                csvParser
                    .parseFile(filePath, { headers: true })
                    .on('data', (row) => {
                    const normalized = {};
                    Object.entries(row).forEach(([k, v]) => {
                        const key = this.normalizeHeader(String(k || ''));
                        normalized[key] = v;
                    });
                    rows.push(normalized);
                })
                    .on('end', () => resolve(rows))
                    .on('error', reject);
            });
        }
        else if (fileExt === 'xlsx' || fileExt === 'xls') {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const rawRows = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
            });
            if (!rawRows || rawRows.length < 1)
                return [];
            const headers = rawRows[0].map((h) => this.normalizeHeader(String(h || '')));
            const dataRows = rawRows.slice(1).map((r) => {
                const obj = {};
                headers.forEach((h, i) => {
                    obj[h] = r?.[i];
                });
                return obj;
            });
            return dataRows;
        }
        else {
            throw new common_1.BadRequestException('Unsupported file format.');
        }
    }
    // -------------------------
    // Import generic CSV sales (per-row Amount used)
    // -------------------------
    async importSales(filePath, userId, confirm = false) {
        const mappings = await this.csvMappingRepository.find({
            where: { user: { id: userId } },
        });
        if (!mappings || mappings.length === 0) {
            throw new common_1.BadRequestException('No CSV mapping found for this user.');
        }
        const mappingDict = mappings.reduce((acc, m) => ({ ...acc, [m.ourSystemColumn]: m.posColumnName }), {});
        const dataRows = await this.parseFileToRows(filePath);
        return this._processData(dataRows, mappingDict, userId, confirm, filePath);
    }
    // -------------------------
    // Import daily sales (uses filename date fallback)
    // -------------------------
    async importDailySales(filePath, userId, confirm = false) {
        const mappings = await this.csvMappingRepository.find({
            where: { user: { id: userId } },
        });
        if (!mappings || mappings.length === 0) {
            throw new common_1.BadRequestException('No CSV mapping found for this user.');
        }
        const mappingDict = mappings.reduce((acc, m) => ({ ...acc, [m.ourSystemColumn]: m.posColumnName }), {});
        const dataRows = await this.parseFileToRows(filePath);
        return this._processDailyData(dataRows, mappingDict, userId, confirm, filePath);
    }
    // -------------------------
    // Daily aggregation endpoint helper
    // -------------------------
    async getDailySales(userId, startDate, endDate) {
        // Use repository query builder to aggregate by sale_date
        const qb = this.saleRepository
            .createQueryBuilder('sale')
            .leftJoin('sale.product', 'product')
            .select('DATE(sale.sale_date)', 'date')
            .addSelect('SUM(sale.total_amount)', 'totalSales')
            .addSelect('SUM(sale.total_amount - (COALESCE(product.total_cost,0) * sale.quantity))', 'totalProfit')
            .addSelect('SUM(sale.quantity)', 'itemsSold')
            .where('sale.userId = :userId', { userId })
            .groupBy('DATE(sale.sale_date)');
        if (startDate)
            qb.andWhere('sale.sale_date >= :startDate', {
                startDate: new Date(startDate),
            });
        if (endDate)
            qb.andWhere('sale.sale_date <= :endDate', { endDate: new Date(endDate) });
        const rows = await qb.getRawMany();
        return rows.map((r) => ({
            date: r.date,
            totalSales: parseFloat(r.totalsales) || 0,
            totalProfit: parseFloat(r.totalprofit) || 0,
            itemsSold: parseInt(r.itemssold, 10) || 0,
        }));
    }
    // -------------------------
    // Core processing (generic importSales)
    // -------------------------
    async _processData(dataRows, mappingDict, userId, confirm, filePath) {
        const insights = {
            totalSales: 0,
            totalProfit: 0,
            avgProfitMargin: 0,
            rows: [],
        };
        const filenameMatch = filePath.match(/(\d{4}-\d{2}-\d{2})/);
        const defaultSaleDate = filenameMatch ? new Date(filenameMatch[1]) : null;
        for (const row of dataRows) {
            // mappingDict keys like mappingDict['product_name'] => 'item name' (lowercase)
            const productKey = mappingDict['product_name'];
            const qtyKey = mappingDict['quantity_sold'] ||
                mappingDict['quantity'] ||
                mappingDict['qty'];
            const priceKey = mappingDict['sale_price'] ||
                mappingDict['amount'] ||
                mappingDict['price'];
            const dateKey = mappingDict['sale_date'] || mappingDict['date'];
            // row keys are normalized to lowercase headers
            const productName = productKey
                ? String(row[this.normalizeHeader(productKey)] || '').trim()
                : row['item name'] || row['item'] || row['product'] || '';
            if (!productName) {
                this.logger.warn(`Skipping row due to empty productName. Row data: ${JSON.stringify(row)}`);
                continue;
            }
            const qtyRaw = qtyKey
                ? row[this.normalizeHeader(qtyKey)]
                : row['quantity'] || row['qty'] || '1';
            const amountRaw = priceKey
                ? row[this.normalizeHeader(priceKey)]
                : row['amount'] || row['price'] || '0';
            const quantitySold = Number.isFinite(qtyRaw)
                ? Number(qtyRaw)
                : this.parseNumber(qtyRaw);
            const amount = Number.isFinite(amountRaw)
                ? Number(amountRaw)
                : this.parseNumber(amountRaw);
            if (!quantitySold || quantitySold <= 0) {
                this.logger.warn(`Skipping row due to invalid quantity. Row data: ${JSON.stringify(row)}`);
                continue;
            }
            // unit price = amount / quantity
            const unitPrice = amount / quantitySold;
            const saleDate = dateKey && row[this.normalizeHeader(dateKey)]
                ? new Date(row[this.normalizeHeader(dateKey)])
                : defaultSaleDate;
            // Find product case-insensitively
            let productRecord = await this.productRepository
                .createQueryBuilder('p')
                .where('LOWER(p.name) = LOWER(:name)', { name: productName })
                .andWhere('p.userId = :userId', { userId })
                .getOne();
            if (!productRecord) {
                productRecord = this.productRepository.create({
                    name: productName,
                    total_cost: 0,
                    category: 'uncategorized',
                    status: 'new',
                    user: { id: userId }, // Associate with the current user
                    sell_price: 0, // Default sell price to 0
                });
                await this.productRepository.save(productRecord);
            }
            // Ensure productRecord is not null for subsequent operations
            if (!productRecord) {
                throw new Error('Product record should not be null at this point.');
            }
            // Profit = amount (CSV total) - product.total_cost * quantity
            const productTotalCost = this.parseNumber(productRecord.total_cost);
            const profit = amount - productTotalCost * quantitySold;
            const profitMargin = amount > 0 ? (profit / amount) * 100 : 0;
            // If confirm true, save Sale row
            if (confirm) {
                const sale = this.saleRepository.create({
                    user: { id: userId },
                    product: { id: productRecord.id },
                    product_name: productRecord.name,
                    quantity: quantitySold,
                    total_amount: amount,
                    sale_date: saleDate,
                });
                await this.saleRepository.save(sale);
                // Manually update quantity_sold for the product
                productRecord.quantity_sold =
                    Number(productRecord.quantity_sold) + Number(quantitySold);
                await this.productRepository.save(productRecord);
            }
            insights.totalSales += amount;
            insights.totalProfit += profit;
            insights.rows.push({
                productName: productRecord.name,
                quantitySold,
                amount,
                unitPrice,
                saleDate,
                profit,
                profitMargin,
            });
        }
        insights.avgProfitMargin =
            insights.totalSales > 0
                ? (insights.totalProfit / insights.totalSales) * 100
                : 0;
        return insights;
    }
    // -------------------------
    // Core processing for daily files (prefers filename date)
    // -------------------------
    async _processDailyData(dataRows, mappingDict, userId, confirm, filePath) {
        // This reuses the same logic but forces saleDate = filename date (if present),
        // which is typical for reports named like items-report-YYYY-MM-DD_YYYY-MM-DD.csv
        const filenameMatch = filePath.match(/(\d{4}-\d{2}-\d{2})/);
        const defaultSaleDate = filenameMatch ? new Date(filenameMatch[1]) : null;
        // Call the generic processor but override date usage:
        // We'll copy/paste similar logic but set saleDate = defaultSaleDate always (unless mapping gives explicit date).
        const insights = {
            totalSales: 0,
            totalProfit: 0,
            avgProfitMargin: 0,
            rows: [],
        };
        for (const row of dataRows) {
            const productKey = mappingDict['product_name'];
            const qtyKey = mappingDict['quantity_sold'] ||
                mappingDict['quantity'] ||
                mappingDict['qty'];
            const priceKey = mappingDict['sale_price'] ||
                mappingDict['amount'] ||
                mappingDict['price'];
            const dateKey = mappingDict['sale_date'] || mappingDict['date'];
            const productName = productKey
                ? String(row[this.normalizeHeader(productKey)] || '').trim()
                : row['item name'] || row['item'] || row['product'] || '';
            if (!productName) {
                this.logger.warn(`Skipping row due to empty productName. Row data: ${JSON.stringify(row)}`);
                continue;
            }
            const qtyRaw = qtyKey
                ? row[this.normalizeHeader(qtyKey)]
                : row['quantity'] || row['qty'] || '1';
            const amountRaw = priceKey
                ? row[this.normalizeHeader(priceKey)]
                : row['amount'] || row['price'] || '0';
            const quantitySold = Number.isFinite(qtyRaw)
                ? Number(qtyRaw)
                : this.parseNumber(qtyRaw);
            const amount = Number.isFinite(amountRaw)
                ? Number(amountRaw)
                : this.parseNumber(amountRaw);
            if (!quantitySold || quantitySold <= 0) {
                this.logger.warn(`Skipping row due to invalid quantity. Row data: ${JSON.stringify(row)}`);
                continue;
            }
            const unitPrice = amount / quantitySold;
            // prefer filename date, but if user mapping provides explicit date value, use that
            const mappedDateVal = dateKey && row[this.normalizeHeader(dateKey)]
                ? new Date(row[this.normalizeHeader(dateKey)])
                : null;
            const saleDate = mappedDateVal || defaultSaleDate;
            let productRecord = await this.productRepository
                .createQueryBuilder('p')
                .where('LOWER(p.name) = LOWER(:name)', { name: productName })
                .andWhere('p.userId = :userId', { userId })
                .getOne();
            if (!productRecord) {
                productRecord = this.productRepository.create({
                    name: productName,
                    total_cost: 0,
                    category: 'uncategorized',
                    status: 'new',
                    user: { id: userId }, // Associate with the current user
                    sell_price: 0, // Default sell price to 0
                });
                await this.productRepository.save(productRecord);
            }
            // Ensure productRecord is not null for subsequent operations
            if (!productRecord) {
                throw new Error('Product record should not be null at this point.');
            }
            const productTotalCost = this.parseNumber(productRecord.total_cost);
            const profit = amount - productTotalCost * quantitySold;
            const profitMargin = amount > 0 ? (profit / amount) * 100 : 0;
            if (confirm) {
                const sale = this.saleRepository.create({
                    user: { id: userId },
                    product: { id: productRecord.id },
                    product_name: productRecord.name,
                    quantity: quantitySold,
                    total_amount: amount,
                    sale_date: saleDate,
                });
                await this.saleRepository.save(sale);
                // Manually update quantity_sold for the product
                productRecord.quantity_sold =
                    Number(productRecord.quantity_sold) + Number(quantitySold);
                await this.productRepository.save(productRecord);
            }
            insights.totalSales += amount;
            insights.totalProfit += profit;
            insights.rows.push({
                productName: productRecord.name,
                quantitySold,
                amount,
                unitPrice,
                saleDate,
                profit,
                profitMargin,
            });
        }
        insights.avgProfitMargin =
            insights.totalSales > 0
                ? (insights.totalProfit / insights.totalSales) * 100
                : 0;
        return insights;
    }
};
exports.CsvMappingsService = CsvMappingsService;
exports.CsvMappingsService = CsvMappingsService = CsvMappingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(csv_mappings_entity_1.CsvMappings)),
    __param(1, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CsvMappingsService);
// Note: This service assumes that the CSV/XLSX files have been pre-validated and contain the necessary columns.
// It does not handle file uploads directly; that should be managed by the controller.
// The service focuses on processing the data, saving mappings, and importing sales based on user-defined mappings.
// The methods are designed to be reusable and modular, allowing for easy testing and maintenance.
// The service also includes detailed logging for debugging purposes, especially when skipping rows due to missing or invalid data.
// The use of TypeORM repositories allows for efficient database interactions, leveraging the power of query builders for complex queries.
// The service is structured to handle both generic CSV imports and daily sales reports, providing flexibility for different use cases.
// The methods are designed to be reusable and modular, allowing for easy testing and maintenance.
// The service also includes detailed logging for debugging purposes, especially when skipping rows due to missing or invalid data.
// The use of TypeORM repositories allows for efficient database interactions, leveraging the power of query builders for complex queries.
//# sourceMappingURL=csv_mappings.service.js.map