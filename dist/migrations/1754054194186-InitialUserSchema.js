"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialUserSchema1754054194186 = void 0;
class InitialUserSchema1754054194186 {
    name = 'InitialUserSchema1754054194186';
    async up(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "user" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."user_role_enum" CASCADE`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('owner', 'staff')`);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "role" "public"."user_role_enum" NOT NULL DEFAULT 'owner',
                "profilePicture" character varying,
                "phoneNumber" character varying,
                "address" text,
                "bio" text,
                "dateOfBirth" date,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "last_updated" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }
}
exports.InitialUserSchema1754054194186 = InitialUserSchema1754054194186;
//# sourceMappingURL=1754054194186-InitialUserSchema.js.map