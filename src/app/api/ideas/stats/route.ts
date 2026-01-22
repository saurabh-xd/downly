import { IdeaStatus } from "@prisma/client";
import { getUserId } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

export async function GET(){

    const userId = await getUserId();

   if(!userId){
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

 const ideas =  await prisma.idea.findMany({
        where: { userId },
        select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      closedAt: true,
    },
    })

      const totalIdeas = ideas.length;

       if (totalIdeas === 0) {
    return Response.json({
      totalIdeas: 0,
      aliveCount: 0,
      deadCount: 0,
      onHoldCount: 0,
      averageLifespanDays: 0,
      longestIdea: null,
      shortestIdea: null,
      statusDistribution: {
        alive: 0,
        dead: 0,
        onHold: 0,
      },
    });
  }

   // 3️⃣ Status counts
  const aliveCount = ideas.filter(
    (i) => i.status === IdeaStatus.ALIVE
  ).length;

  const deadCount = ideas.filter(
    (i) => i.status === IdeaStatus.DEAD
  ).length;

  const onHoldCount = ideas.filter(
    (i) => i.status === IdeaStatus.ON_HOLD
  ).length;

  
  
  // 4️⃣ Lifespan calculations
  const now = new Date();

  const lifespans = ideas.map((idea) => {
    const endDate =
      idea.status === IdeaStatus.DEAD && idea.closedAt
        ? idea.closedAt
        : now;

    const lifespanMs =
      endDate.getTime() - idea.createdAt.getTime();

    const lifespanDays = Math.floor(
      lifespanMs / (1000 * 60 * 60 * 24)
    );

    return {
      id: idea.id,
      title: idea.title,
      lifespanDays,
    };
  });

    // 5️⃣ Average lifespan
  const totalLifespan = lifespans.reduce(
    (sum, i) => sum + i.lifespanDays,
    0
  );

  const averageLifespanDays = Math.round(
    totalLifespan / lifespans.length
  );

   // 6️⃣ Longest & shortest idea
  const longestIdea = lifespans.reduce((max, cur) =>
    cur.lifespanDays > max.lifespanDays ? cur : max
  );

  const shortestIdea = lifespans.reduce((min, cur) =>
    cur.lifespanDays < min.lifespanDays ? cur : min
  );

    // 7️⃣ Status distribution (percentage)
  const statusDistribution = {
    alive: Math.round((aliveCount / totalIdeas) * 100),
    dead: Math.round((deadCount / totalIdeas) * 100),
    onHold: Math.round((onHoldCount / totalIdeas) * 100),
  };

    // 8️⃣ Final response
  return Response.json({
    totalIdeas,
    aliveCount,
    deadCount,
    onHoldCount,
    averageLifespanDays,
    longestIdea,
    shortestIdea,
    statusDistribution,
  });
    

}