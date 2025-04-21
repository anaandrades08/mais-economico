// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "text" },
        senha: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        const { email, senha } = credentials;

        // Aqui você importa os dados dos usuários (mockado ou de banco)
        const { Users } = await import('../../../(site)/data/UserData.js');

        const user = Users.find(
          u => u.email === email && u.senha ===  senha && u.ativo === 1
        );

        if (user) {
          return {
            id: user.id,
            name: user.nome,
            email: user.email,
            tipo: user.tipo,
          };
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: '/login' // Redireciona para sua página customizada
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nome = user.nome;
        token.email = user.email;
        token.tipo = user.tipo;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.nome = token.nome;
        session.user.email = token.email;
        session.user.tipo = token.tipo;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };
