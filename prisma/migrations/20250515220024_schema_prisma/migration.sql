/*
  Warnings:

  - You are about to drop the column `id_ingrediente` on the `Substituicao` table. All the data in the column will be lost.
  - Added the required column `id_ingrediente_original` to the `Substituicao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_ingrediente_substituto` to the `Substituicao` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Substituicao" DROP CONSTRAINT "Substituicao_id_ingrediente_fkey";

-- AlterTable
ALTER TABLE "Substituicao" DROP COLUMN "id_ingrediente",
ADD COLUMN     "id_ingrediente_original" INTEGER NOT NULL,
ADD COLUMN     "id_ingrediente_substituto" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Substituicao" ADD CONSTRAINT "Substituicao_id_ingrediente_original_fkey" FOREIGN KEY ("id_ingrediente_original") REFERENCES "Ingrediente"("id_ingrediente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Substituicao" ADD CONSTRAINT "Substituicao_id_ingrediente_substituto_fkey" FOREIGN KEY ("id_ingrediente_substituto") REFERENCES "Ingrediente"("id_ingrediente") ON DELETE RESTRICT ON UPDATE CASCADE;
