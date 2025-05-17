// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "text", placeholder: "seu@email.com" },
        senha: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        try {
          const { email, senha } = credentials;
          const user = await prisma.usuario.findUnique({
            where: { email, senha },
            select: {
              id: true,
              nome: true,
              email: true,
              senha: true,
              img_usuario: true,
              endereco: true,
              numero: true,
              cidade: true,
              estado: true,
              cep: true,
              tipo: true,
              ativo: true,
              data_cadastro: true,
              aceito_termo: true
            }
          });

          if (!user) {
            throw new Error("E-mail não encontrado");
          }

          if (user.ativo === 0) {
            throw new Error("Conta inativa - fale com o administrador");
          }

          if (user.ativo === null || user.ativo === 2) {
            throw new Error("Cadastro aguardando aprovação");
          }

        //  const senhaValida = await bcrypt.compare(senha, user.senha);
         // if (!senhaValida) {
         //   throw new Error("Senha incorreta");
         // }

          return {
            id: user.id.toString(),
            nome: user.nome,
            email: user.email,
            image: user.img_usuario,
            endereco: user.endereco,
            numero: user.numero,
            cidade: user.cidade,
            estado: user.estado,
            cep: user.cep,
            tipo: user.tipo,
            ativo: user.ativo,
            dataCadastro: user.data_cadastro,
            aceitoTermo: user.aceito_termo
          };
        } catch (error) {
          throw error;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login?error=1'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
    updateAge: 24 * 60 * 60 // 24 horas
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nome = user.nome;
        token.email = user.email;
        token.image = user.image;
        token.endereco = user.endereco;
        token.numero = user.numero;
        token.cidade = user.cidade;
        token.estado = user.estado;
        token.cep = user.cep;
        token.tipo = user.tipo;
        token.ativo = user.ativo;
        token.dataCadastro = user.dataCadastro;
        token.aceitoTermo = user.aceitoTermo;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.nome = token.nome;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.endereco = token.endereco;
        session.user.numero = token.numero;
        session.user.cidade = token.cidade;
        session.user.estado = token.estado;
        session.user.cep = token.cep;
        session.user.tipo = token.tipo;
        session.user.ativo = token.ativo;
        session.user.dataCadastro = token.dataCadastro;
        session.user.aceitoTermo = token.aceitoTermo;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  events: {
    async signIn({ user }) {
      console.log(`Usuário ${user.email} fez login`);
    },
    async signOut({ token }) {
      console.log(`Usuário ${token.email} fez logout`);
    }
  }
});

export { handler as GET, handler as POST };