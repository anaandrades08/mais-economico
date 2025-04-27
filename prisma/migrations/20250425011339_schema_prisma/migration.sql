-- DropForeignKey
ALTER TABLE "Ingrediente" DROP CONSTRAINT "Ingrediente_id_uni_medida_fkey";

-- AlterTable
ALTER TABLE "Ingrediente" ALTER COLUMN "id_uni_medida" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Ingrediente" ADD CONSTRAINT "Ingrediente_id_uni_medida_fkey" FOREIGN KEY ("id_uni_medida") REFERENCES "UnidadeMedida"("id_uni_medida") ON DELETE SET NULL ON UPDATE CASCADE;
