"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCsvMappingsChanges1754721520026 = void 0;
class AddCsvMappingsChanges1754721520026 {
    name = 'AddCsvMappingsChanges1754721520026';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "csv_mappings" ("id" SERIAL NOT NULL, "ourSystemColumn" character varying NOT NULL, "posColumnName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_d80a9d261a2a39cc3885fb7f08f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "csv_mappings" ADD CONSTRAINT "FK_2b4da2f369119196bc5a18fd308" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "csv_mappings" DROP CONSTRAINT "FK_2b4da2f369119196bc5a18fd308"`);
        await queryRunner.query(`DROP TABLE "csv_mappings"`);
    }
}
exports.AddCsvMappingsChanges1754721520026 = AddCsvMappingsChanges1754721520026;
//# sourceMappingURL=1754721520026-AddCsvMappingsChanges.js.map