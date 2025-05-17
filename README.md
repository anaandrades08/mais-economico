This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# mais-economico
+EconomicoReceitas - Projeto Integrador I, II e III

Projeto de [breve descrição].  

## versão site estatico
1. version: "0.1.0"
## Como Executar  
1. Clone o repositório:  
   ```bash  
   git clone https://github.com/anaandrades08/mais-economico.git
2. Add README.md  
   ```bash  
   git add README.md
   git commit -m "Edita README inicial"
   git push  

## 🔄 Atualização para versão dinâmica

Este projeto foi atualizado para utilizar banco de dados PostgreSQL. 
Scripts de criação de tabelas e dados iniciais estão na pasta `/database`.

### ✅ Como rodar o banco
1. Crie um banco de dados local
2. Execute o script `estrutura.sql`
3. Popule com `dados_iniciais.sql` (opcional)

### GIT
1. Atualize no git
git status
git add .
git commit -m "feat: adiciona suporte a banco de dados com scripts SQL e api"
git remote add origin https://github.com/anaandrades08/mais-economico.git
# use a branch de desenvolvimento:
git checkout -b dev-banco-dados
git push -u origin dev-banco-dados

## versão site com banco de dados
1. version: "1.1.0"


## para usar o prisma
1. No seu projeto (na raiz), abra o arquivo .env e atualize a variável assim:
DATABASE_URL="postgresql://postgres:suasenha@localhost:5432/mais-economico"
2. depois inicie o prisma
npx prisma generate
npx prisma migrate dev
# para ver as tabelas e registros
npx prisma studio
# para atualizar tabelas no prisma 
npx prisma migrate dev --name schema.prisma     

# executar esses comandos para criar exemplos de dados
node prisma/exemplos/usuario.js 
node prisma/exemplos/categoria.js 
node prisma/exemplos/unidade.js 
node prisma/exemplos/receita.js 
node prisma/exemplos/ingrediente.js
node prisma/exemplos/dica.js

# desenvolvimento dos itens do api/
api/auth/
api/dicas
api/usuarios

# uso de bcrypt para comparar senhas no login
npm install next-auth @prisma/client prisma bcryptjs



# No seu Dockerfile ou script de deploy
RUN mkdir -p /app/public/uploads/usuarios && \
    chown -R node:node /app/public/uploads && \
    chmod -R 755 /app/public/uploads