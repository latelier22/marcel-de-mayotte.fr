import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from "../../../../prisma/prisma";

export async function POST(request: Request) {


  try {
    const { email, password } = await request.json();
    // validate email and password
    console.log({ email, password });

    const hashedPassword = await hash(password, 10);

    // Utiliser Prisma pour insérer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role : "visit"
      }
    });

    console.log({ user }); // Log pour vérifier que l'utilisateur a été créé

  } catch (e) {
    console.log({ e });
    return NextResponse.json({ error: e.message });
  }

  return NextResponse.json({ message: 'success' });
}
