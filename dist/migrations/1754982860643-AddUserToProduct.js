"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserToProduct1754982860643 = void 0;
class AddUserToProduct1754982860643 {
    name = 'AddUserToProduct1754982860643';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "product" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_329b8ae12068b23da547d3b4798" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_329b8ae12068b23da547d3b4798"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "userId"`);
    }
}
exports.AddUserToProduct1754982860643 = AddUserToProduct1754982860643;
//# sourceMappingURL=1754982860643-AddUserToProduct.js.map