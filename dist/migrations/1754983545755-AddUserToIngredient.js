"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserToIngredient1754983545755 = void 0;
class AddUserToIngredient1754983545755 {
    name = 'AddUserToIngredient1754983545755';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "ingredient" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "ingredient" ADD CONSTRAINT "FK_d621784b59b05016938180fb3bb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "ingredient" DROP CONSTRAINT "FK_d621784b59b05016938180fb3bb"`);
        await queryRunner.query(`ALTER TABLE "ingredient" DROP COLUMN "userId"`);
    }
}
exports.AddUserToIngredient1754983545755 = AddUserToIngredient1754983545755;
//# sourceMappingURL=1754983545755-AddUserToIngredient.js.map