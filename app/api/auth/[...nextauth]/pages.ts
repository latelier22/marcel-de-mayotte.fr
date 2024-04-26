import NextAuth from "next-auth"
import { ZodError } from "zod"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "../../../lib/zod"
import bcrypt from 'bcryptjs'; // Assurez-vous d'importer bcryptjs
import { getUserFromDb } from "@/utils/db"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../../prisma/prisma"
import Providers from "next-auth/providers"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "text", placeholder: "your-email@example.com" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                try {
                    if (!credentials) return null;
                    const { email, password } = await signInSchema.parseAsync(credentials);

                    // Récupérer l'utilisateur et son mot de passe haché de la base de données
                    const user = await getUserFromDb(email);

                    // Vérifier si le mot de passe correspond au hash stocké
                    if (user && await bcrypt.compare(password, user.password)) {
                        return user; // Authentification réussie, retourner les données de l'utilisateur
                    } else {
                        throw new Error("Invalid credentials.");
                    }
                } catch (error) {
                    if (error instanceof ZodError) {
                        return null; // Retourner `null` si les données du formulaire sont invalides
                    }
                    throw error;
                }
            },
        }),
    ],
});
