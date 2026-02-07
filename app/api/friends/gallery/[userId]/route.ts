import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Get a friend's public art
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;

    // Check if they are friends
    const friendship = await prisma.friend.findFirst({
      where: {
        OR: [
          { userId: session.user.id, friendId: userId },
          { userId: userId, friendId: session.user.id }
        ],
        status: "ACCEPTED"
      }
    });

    if (!friendship) {
      return NextResponse.json(
        { error: "Not friends with this user" },
        { status: 403 }
      );
    }

    // Get friend's art
    const art = await prisma.art.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    // Get friend info
    const friend = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true }
    });

    return NextResponse.json({ friend, art });
  } catch (error) {
    console.error("Error fetching friend's gallery:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}