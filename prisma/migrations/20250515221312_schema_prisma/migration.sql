/*
  Warnings:

  - You are about to drop the column `id_ingrediente_original` on the `Substituicao` table. All the data in the column will be lost.
  - You are about to drop the column `id_ingrediente_substituto` on the `Substituicao` table. All the data in the column will be lost.
  - Added the required column `id_ingrediente` to the `Substituicao` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Substituicao" DROP CONSTRAINT "Substituicao_id_ingrediente_original_fkey";

-- DropForeignKey
ALTER TABLE "Substituicao" DROP CONSTRAINT "Substituicao_id_ingrediente_substituto_fkey";

-- AlterTable
ALTER TABLE "Substituicao" DROP COLUMN "id_ingrediente_original",
DROP COLUMN "id_ingrediente_substituto",
ADD COLUMN     "id_ingrediente" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Substituicao" ADD CONSTRAINT "Substituicao_id_ingrediente_fkey" FOREIGN KEY ("id_ingrediente") REFERENCES "Ingrediente"("id_ingrediente") ON DELETE RESTRICT ON UPDATE CASCADE;
