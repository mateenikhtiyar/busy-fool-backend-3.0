"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FillMissingProductUserIds1755066320817 = void 0;
class FillMissingProductUserIds1755066320817 {
    async up(queryRunner) {
        await queryRunner.query(`
            UPDATE product p
            SET "userId" = s."userId"
            FROM sale s
            WHERE s."productId" = p.id AND p."userId" IS NULL;
        `);
    }
    async down(queryRunner) { }
}
exports.FillMissingProductUserIds1755066320817 = FillMissingProductUserIds1755066320817;
//# sourceMappingURL=1755066320817-FillMissingProductUserIds.js.map