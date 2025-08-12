import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodbClientPromise';
import User from '@/lib/models/User'; // Assuming this is the Mongoose model
import { compare } from 'bcryptjs';
import { dbConnect } from '@/lib/mongodb';
import { JWT } from 'next-auth/jwt';
import { Session, DefaultSession } from 'next-auth';

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface AdapterUser {
    role?: string;
  }
  interface Session {
    user: {
      role?: string;
    } & DefaultSession["user"];
  }
}

// Define a type for the user object returned by authorize
interface AuthorizedUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Define a type for session.user
interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', required: true },
        password: { label: 'Password', type: 'password', required: true },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;
        if (!user.password) return null;
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        } as AuthorizedUser; // Cast to AuthorizedUser
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user, account, profile, trigger, isNewUser, session }: any) {
      if (user) {
        token.role = (user as AuthorizedUser).role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        (session.user as SessionUser).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };