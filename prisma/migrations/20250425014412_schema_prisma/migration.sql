/*
  Warnings:

  - You are about to drop the column `descrição` on the `Dica` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Dica" DROP COLUMN "descrição",
ADD COLUMN     "descricao" TEXT;
