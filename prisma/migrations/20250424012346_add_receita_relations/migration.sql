-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT,
    "cep" TEXT,
    "endereco" TEXT,
    "numero" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "img_usuario" TEXT,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo" INTEGER,
    "ativo" INTEGER,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogUser" (
    "id_log" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "ip_usuario_log" TEXT,
    "descricao_atividade_log" TEXT,
    "data_hora_inicio_log" TIMESTAMP(3),
    "data_hora_fim_log" TIMESTAMP(3),

    CONSTRAINT "LogUser_pkey" PRIMARY KEY ("id_log")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id_categoria" SERIAL NOT NULL,
    "nome" TEXT,
    "link_categoria" TEXT,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "Receita" (
    "id_receita" SERIAL NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "titulo_receita" TEXT,
    "descricao_receita" TEXT,
    "tempo_preparo" TIMESTAMP(3),
    "tempo_total" TIMESTAMP(3),
    "rendimento" TEXT,
    "custo" DOUBLE PRECISION,
    "dificuldade" TEXT,
    "img_receita" TEXT,
    "ativo" INTEGER,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Receita_pkey" PRIMARY KEY ("id_receita")
);

-- CreateTable
CREATE TABLE "UnidadeMedida" (
    "id_uni_medida" SERIAL NOT NULL,
    "unidade_medida" TEXT NOT NULL,
    "sigla" TEXT,

    CONSTRAINT "UnidadeMedida_pkey" PRIMARY KEY ("id_uni_medida")
);

-- CreateTable
CREATE TABLE "TipoIngrediente" (
    "id_tipo_ingrediente" SERIAL NOT NULL,
    "tipo_ingrediente" TEXT NOT NULL,

    CONSTRAINT "TipoIngrediente_pkey" PRIMARY KEY ("id_tipo_ingrediente")
);

-- CreateTable
CREATE TABLE "Ingrediente" (
    "id_ingrediente" SERIAL NOT NULL,
    "id_tipo_ingrediente" INTEGER NOT NULL,
    "descricao_ingrediente" TEXT,
    "valor" DOUBLE PRECISION,

    CONSTRAINT "Ingrediente_pkey" PRIMARY KEY ("id_ingrediente")
);

-- CreateTable
CREATE TABLE "TituloIngredientesReceita" (
    "id_titulo_ingrediente_receita" SERIAL NOT NULL,
    "titulo_ingrediente_receita" TEXT,
    "id_receita" INTEGER NOT NULL,

    CONSTRAINT "TituloIngredientesReceita_pkey" PRIMARY KEY ("id_titulo_ingrediente_receita")
);

-- CreateTable
CREATE TABLE "IngredienteReceita" (
    "id_ingrediente_receita" SERIAL NOT NULL,
    "id_ingrediente" INTEGER NOT NULL,
    "id_titulo_ingrediente_receita" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "id_uni_medida" INTEGER NOT NULL,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IngredienteReceita_pkey" PRIMARY KEY ("id_ingrediente_receita")
);

-- CreateTable
CREATE TABLE "TituloPreparo" (
    "id_titulo_preparo" SERIAL NOT NULL,
    "titulo_preparo" TEXT,
    "id_receita" INTEGER NOT NULL,

    CONSTRAINT "TituloPreparo_pkey" PRIMARY KEY ("id_titulo_preparo")
);

-- CreateTable
CREATE TABLE "ModoPreparo" (
    "id_preparo" SERIAL NOT NULL,
    "id_titulo_preparo" INTEGER NOT NULL,
    "descricao_preparo" TEXT,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModoPreparo_pkey" PRIMARY KEY ("id_preparo")
);

-- CreateTable
CREATE TABLE "Favorito" (
    "id_favorito" SERIAL NOT NULL,
    "id_receita" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorito_pkey" PRIMARY KEY ("id_favorito")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id_feedback" SERIAL NOT NULL,
    "id_receita" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "feedback" TEXT,
    "total_estrela" INTEGER NOT NULL,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id_feedback")
);

-- CreateTable
CREATE TABLE "Substituicao" (
    "id_substituicao" SERIAL NOT NULL,
    "id_receita" INTEGER NOT NULL,
    "id_ingrediente" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "descricao_preparo" TEXT,
    "quantidade" INTEGER NOT NULL,
    "id_uni_medida" INTEGER NOT NULL,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Substituicao_pkey" PRIMARY KEY ("id_substituicao")
);

-- CreateTable
CREATE TABLE "Dica" (
    "id_dica" SERIAL NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "titulo" TEXT,
    "descrição" TEXT,
    "cta_text" TEXT,
    "img_dica" TEXT,
    "id_usuario" INTEGER NOT NULL,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dica_pkey" PRIMARY KEY ("id_dica")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "LogUser" ADD CONSTRAINT "LogUser_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receita" ADD CONSTRAINT "Receita_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receita" ADD CONSTRAINT "Receita_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "Categoria"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingrediente" ADD CONSTRAINT "Ingrediente_id_tipo_ingrediente_fkey" FOREIGN KEY ("id_tipo_ingrediente") REFERENCES "TipoIngrediente"("id_tipo_ingrediente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TituloIngredientesReceita" ADD CONSTRAINT "TituloIngredientesReceita_id_receita_fkey" FOREIGN KEY ("id_receita") REFERENCES "Receita"("id_receita") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredienteReceita" ADD CONSTRAINT "IngredienteReceita_id_ingrediente_fkey" FOREIGN KEY ("id_ingrediente") REFERENCES "Ingrediente"("id_ingrediente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredienteReceita" ADD CONSTRAINT "IngredienteReceita_id_titulo_ingrediente_receita_fkey" FOREIGN KEY ("id_titulo_ingrediente_receita") REFERENCES "TituloIngredientesReceita"("id_titulo_ingrediente_receita") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredienteReceita" ADD CONSTRAINT "IngredienteReceita_id_uni_medida_fkey" FOREIGN KEY ("id_uni_medida") REFERENCES "UnidadeMedida"("id_uni_medida") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TituloPreparo" ADD CONSTRAINT "TituloPreparo_id_receita_fkey" FOREIGN KEY ("id_receita") REFERENCES "Receita"("id_receita") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModoPreparo" ADD CONSTRAINT "ModoPreparo_id_titulo_preparo_fkey" FOREIGN KEY ("id_titulo_preparo") REFERENCES "TituloPreparo"("id_titulo_preparo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_id_receita_fkey" FOREIGN KEY ("id_receita") REFERENCES "Receita"("id_receita") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_id_receita_fkey" FOREIGN KEY ("id_receita") REFERENCES "Receita"("id_receita") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Substituicao" ADD CONSTRAINT "Substituicao_id_receita_fkey" FOREIGN KEY ("id_receita") REFERENCES "Receita"("id_receita") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Substituicao" ADD CONSTRAINT "Substituicao_id_ingrediente_fkey" FOREIGN KEY ("id_ingrediente") REFERENCES "Ingrediente"("id_ingrediente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Substituicao" ADD CONSTRAINT "Substituicao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Substituicao" ADD CONSTRAINT "Substituicao_id_uni_medida_fkey" FOREIGN KEY ("id_uni_medida") REFERENCES "UnidadeMedida"("id_uni_medida") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dica" ADD CONSTRAINT "Dica_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "Categoria"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dica" ADD CONSTRAINT "Dica_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
