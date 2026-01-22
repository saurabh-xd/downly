import { getUserId } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";



export async function POST(req: Request){

    const userId = await getUserId();

     if (!userId) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

    const { title, description } = await req.json();

  if (!title || title.trim() === "") {
    return Response.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

    const idea = await prisma.idea.create({
        data: {
            title,
            description,
            userId
        }
    })

    return Response.json(idea, {status: 201});

}

export async function GET(req: Request){

    const userId = await getUserId();

    if (!userId) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

    const ideas =  await prisma.idea.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    })

     return Response.json(ideas);

}