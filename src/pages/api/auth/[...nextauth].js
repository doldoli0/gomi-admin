import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import apiController from "../../../lib/ApiController";


export default NextAuth({
    secret: process.env.SECRET,
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            id: "email-password-credential",
            name: "Credentials",
            type: 'credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.

            // credentials: {
            //     username: { label: "Username", type: "text"},
            //     password: { label: "Password", type: "password" }
            // },
            async authorize(credentials, req) {
                const payload = {
                    email: credentials.email,
                    password: credentials.password,
                };

                const res = await fetch(`${process.env.NEXT_PUBLIC_END_POINT}/api/login`, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                        "Accept": "application/json"
                    },
                });

                const user = await res.json();

                if (!res.ok) {
                    throw new Error('일치하는 정보가 없습니다.');
                }
                // If no error and we have user data, return it
                if (res.ok && user) {
                    return user.user;
                }

                // Return null if user data could not be retrieved
                return null;
            }
        }),
    ],
    // callbacks: {
    //     async jwt({ token, user, account }) {
    //         if (account && user) {
    //             return {
    //                 ...token,
    //                 accessToken: user.data.token,
    //                 refreshToken: user.data.refreshToken,
    //             };
    //         }
    //
    //         return token;
    //     },
    //
    //     async session({ session, token }) {
    //         session.user.accessToken = token.accessToken;
    //         session.user.refreshToken = token.refreshToken;
    //         session.user.accessTokenExpires = token.accessTokenExpires;
    //
    //         return session;
    //     },
    // },
    debug: process.env.NODE_ENV === 'development',
    pages: {
        signIn: '/login',
    }
})