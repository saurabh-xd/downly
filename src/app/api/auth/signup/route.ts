
import bcrypt from "bcryptjs";
import { prisma } from "../../../../../lib/prisma";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  // 1. Check user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return Response.json(
      { error: "User already exists" },
      { status: 400 }
    );
  }

  // 2. Hash password (MongoDB-style)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return Response.json({
    message: "Signup successful",
    userId: user.id,
  });
}
