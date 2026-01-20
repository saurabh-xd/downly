import bcrypt from "bcryptjs";
import { prisma } from "../../../../../lib/prisma";
import jwt from "jsonwebtoken"


export async function POST(req: Request){

const { email, password} = await req.json();

 const user = await prisma.user.findUnique({
    where: { email },
  });

    if (!user) {
    return Response.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return Response.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

      return new Response(
    JSON.stringify({ message: "Signin successful" }),
    {
      headers: {
        "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=604800`,
      },
    }
  );
}