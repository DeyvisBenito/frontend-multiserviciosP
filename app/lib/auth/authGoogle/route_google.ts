/*import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!, // necesario
    }),
  ],
  callbacks: {
    // 1️⃣ Aquí recibes el id_token de Google
    async signIn({ account }) {
      if (account?.id_token) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BASE}/v1/Auth/loginConGoogle`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credenciales: account.id_token }),
          });

          if (!res.ok) return false; // rechaza login si backend falla

          const data = await res.json();

          // 2️⃣ Guardamos el token de tu backend para usarlo después
          localStorage.setItem('token', data.token);
        } catch (err) {
          console.error("Error enviando token a backend:", err);
          return false;
        }
      }
      return true;
    },

    // 3️⃣ Inyectamos el token del backend en el JWT de NextAuth
    async jwt({ token, account }) {
      if (account?.backendToken) {
        token.backendToken = account.backendToken;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
*/