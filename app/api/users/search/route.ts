import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Search users by email or name
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json([]);
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { email: { contains: query } },
              { name: { contains: query } }
            ]
          },
          { id: { not: session.user.id } } // Exclude current user
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      },
      take: 10
    });

    // Check friendship status for each user
    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const friendship = await prisma.friend.findFirst({
          where: {
            OR: [
              { userId: session.user.id, friendId: user.id },
              { userId: user.id, friendId: session.user.id }
            ]
          }
        });

        return {
          ...user,
          friendshipStatus: friendship?.status || null,
          friendshipId: friendship?.id || null
        };
      })
    );

    return NextResponse.json(usersWithStatus);
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}