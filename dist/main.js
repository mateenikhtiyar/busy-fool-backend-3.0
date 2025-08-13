"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const fs = require("fs");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const ingredients_module_1 = require("./ingredients/ingredients.module");
const products_module_1 = require("./products/products.module");
const sales_module_1 = require("./sales/sales.module");
const purchases_module_1 = require("./purchases/purchases.module");
const stock_module_1 = require("./stock/stock.module");
const analytics_module_1 = require("./analytics/analytics.module");
const waste_module_1 = require("./waste/waste.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const csv_mappings_module_1 = require("./csv_mappings/csv_mappings.module");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("./users/user.entity");
// Keep a cached instance of the application
let cachedServer;
async function bootstrap() {
    if (cachedServer) {
        return cachedServer;
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Enable global validation pipe
    app.useGlobalPipes(new common_1.ValidationPipe());
    // Swagger configuration
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Busy Fool API')
        .setDescription('Coffee Shop Management System')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config, {
        include: [
            app_module_1.AppModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            ingredients_module_1.IngredientsModule,
            products_module_1.ProductsModule,
            sales_module_1.SalesModule,
            purchases_module_1.PurchasesModule,
            stock_module_1.StockModule,
            analytics_module_1.AnalyticsModule,
            waste_module_1.WasteModule,
            dashboard_module_1.DashboardModule,
            csv_mappings_module_1.CsvMappingsModule,
        ],
        extraModels: [user_entity_1.User],
    });
    swagger_1.SwaggerModule.setup('api', app, document, {
        swaggerOptions: { persistAuthorization: true },
    });
    // IMPORTANT: Vercel has a read-only filesystem, except for the /tmp directory.
    // The file upload logic has been pointed to '/tmp/uploads', but this is not persistent storage.
    // Files stored here will be lost. For persistent file uploads, you must use a cloud storage service like AWS S3.
    const uploadDir = '/tmp/uploads';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    app.useStaticAssets(uploadDir, { prefix: '/uploads' });
    // Enable CORS
    app.enableCors();
    const configService = app.get(config_1.ConfigService);
    console.log(`DB_HOST: ${configService.get('DB_HOST')}`);
    console.log(`DB_PORT: ${configService.get('DB_PORT')}`);
    console.log(`DB_USER: ${configService.get('DB_USER')}`);
    console.log(`DB_NAME: ${configService.get('DB_NAME')}`);
    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
    return cachedServer;
}
exports.default = async (req, res) => {
    const server = await bootstrap();
    server(req, res);
};
//# sourceMappingURL=main.js.map