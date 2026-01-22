import { getUserId } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";
import { IdeaStatus } from "@prisma/client";


export async function PATCH(req: Request, { params }: { params: { id: string }}){

    const userId = await  getUserId();


    if(!userId){
         return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
    }

    const ideaId = await params.id;

    const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
  });

   if (!idea) {
    return Response.json(
      { error: "Idea not found" },
      { status: 404 }
    );
  }

    if (idea.userId !== userId) {
    return Response.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

   const { status } = await req.json();

   if (!Object.values(IdeaStatus).includes(status)) {
    return Response.json(
      { error: "Invalid status" },
      { status: 400 }
    );
  }

   let closedAt = idea.closedAt;

    if (status === "DEAD") {
    closedAt = new Date();
  }

  
  if (status === "ALIVE") {
    closedAt = null;
  }

  const updatedIdea = await prisma.idea.update({
     where: { id: ideaId },
    data: {
      status,
      closedAt,
    },
  })

  return Response.json(updatedIdea);
  
}

export async function DELETE(req: Request,   { params }: { params: { id: string } }){
   
  const userId = await getUserId();

  if(!userId){
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

    const ideaId = params.id;

     const idea = await prisma.idea.findUnique({
      where: {id: ideaId},
     });

      if (!idea) {
    return Response.json(
      { error: "Idea not found" },
      { status: 404 }
    );
  }

    if (idea.userId !== userId) {
    return Response.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

   await prisma.idea.delete({
    where: { id: ideaId },
  });

    return Response.json({ success: true });

}