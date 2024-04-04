import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { signJwtToken } from "@/lib/jwt";

export const authOptions = {
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {},
            async authorize(credentials) {
                await connectDB();

                const { email, password } = credentials;

                try {
                    const user = await User.findOne({ email });
                    if(!user) {
                        throw new Error('Invalid input')
                    }

                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if(!passwordMatch) {
                        throw new Error('Password do not match')
                    } else {
                        const { password, ...currentUser} = user._doc;
                        const accessToken = signJwtToken(currentUser, { expiresIn: '7d'})

                        return {
                            ...currentUser,
                            accessToken
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        })
    ],

    pages: {
        signIn: '/login'
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if(user) {
                token.accessToken = user.accessToken;
                token._id = user._id;
            }

            return token;
        },

        async session({ session, token }) {
            if(token) {
                session.user._id = token._id;
                session.user.accessToken = token.accessToken;
            }

            return session;
        }
    }
}

const hadler = NextAuth(authOptions);

export { hadler as GET, hadler as POST };