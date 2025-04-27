/*
  Warnings:

  - Added the required column `id_uni_medida` to the `Ingrediente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ingrediente" ADD COLUMN     "id_uni_medida" INTEGER NOT NULL,
ADD COLUMN     "quantidade" DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Ingrediente" ADD CONSTRAINT "Ingrediente_id_uni_medida_fkey" FOREIGN KEY ("id_uni_medida") REFERENCES "UnidadeMedida"("id_uni_medida") ON DELETE RESTRICT ON UPDATE CASCADE;
