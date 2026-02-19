-- CreateEnum
CREATE TYPE "ModuleStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "status" "ModuleStatus" NOT NULL DEFAULT 'DRAFT';
