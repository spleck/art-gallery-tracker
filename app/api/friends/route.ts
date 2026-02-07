import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Get all friends (pending and accepted)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [sentFriends, receivedFriends] = await Promise.all([
      prisma.friend.findMany({
        where: { userId: session.user.id },
        include: {
          friend: {
            select: { id: true, name: true, email: true, image: true }
          }
        }
      }),
      prisma.friend.findMany({
        where: { friendId: session.user.id },
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true }
          }
        }
      })
    ]);

    // Normalize the data
    const friends = [
      ...sentFriends.map(f => ({
        id: f.id,
        status: f.status,
        user: f.friend,
        direction: "sent"
      })),
      ...receivedFriends.map(f => ({
        id: f.id,
        status: f.status,
        user: f.user,
        direction: "received"
      }))
    ];

    return NextResponse.json(friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json(
      { error: "Failed to fetch friends" },
      { status: 500 }
    );
  }
}

// Send friend request
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { friendId } = await request.json();

    if (!friendId) {
      return NextResponse.json(
        { error: "Friend ID is required" },
        { status: 400 }
      );
    }

    // Can't friend yourself
    if (friendId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot friend yourself" },
        { status: 400 }
      );
    }

    // Check if user exists
    const friendUser = await prisma.user.findUnique({
      where: { id: friendId }
    });

    if (!friendUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if already friends or pending
    const existing = await prisma.friend.findFirst({
      where: {
        OR: [
          { userId: session.user.id, friendId },
          { userId: friendId, friendId: session.user.id }
        ]
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: "Friend request already exists" },
        { status: 400 }
      );
    }

    // Create friend request
    const friendRequest = await prisma.friend.create({
      data: {
        userId: session.user.id,
        friendId,
        status: "PENDING"
      },
      include: {
        friend: {
          select: { id: true, name: true, email: true, image: true }
        }
      }
    });

    return NextResponse.json(friendRequest, { status: 201 });
  } catch (error) {
    console.error("Error sending friend request:", error);
    return NextResponse.json(
      { error: "Failed to send friend request" },
      { status: 500 }
    );
  }
}