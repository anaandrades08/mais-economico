/*
  Warnings:

  - Made the column `id_uni_medida` on table `Ingrediente` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Ingrediente" DROP CONSTRAINT "Ingrediente_id_uni_medida_fkey";

-- AlterTable
ALTER TABLE "Ingrediente" ALTER COLUMN "id_uni_medida" SET NOT NULL;

-- AlterTable
ALTER TABLE "IngredienteReceita" ALTER COLUMN "quantidade" DROP NOT NULL,
ALTER COLUMN "quantidade" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Substituicao" ALTER COLUMN "quantidade" DROP NOT NULL,
ALTER COLUMN "quantidade" SET DATA TYPE DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Ingrediente" ADD CONSTRAINT "Ingrediente_id_uni_medida_fkey" FOREIGN KEY ("id_uni_medida") REFERENCES "UnidadeMedida"("id_uni_medida") ON DELETE RESTRICT ON UPDATE CASCADE;
