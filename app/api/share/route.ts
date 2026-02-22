import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ArtStatus, ShareType } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { type, slug } = await request.json();

    if (!type || !slug) {
      return NextResponse.json(
        { error: "Type and slug are required" },
        { status: 400 }
      );
    }

    // Validate type is one of the allowed values
    if (!Object.values(ShareType).includes(type)) {
      return NextResponse.json(
        { error: "Invalid share type" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Get art items based on type - ONLY for the current user
    let artIds: string[] = [];
    if (type === ShareType.OWNED || type === ShareType.BOTH) {
      const owned = await prisma.art.findMany({
        where: { status: ArtStatus.OWNED, userId },
        select: { id: true },
      });
      artIds.push(...owned.map((a) => a.id));
    }
    if (type === ShareType.INTERESTED || type === ShareType.BOTH) {
      const interested = await prisma.art.findMany({
        where: { status: ArtStatus.INTERESTED, userId },
        select: { id: true },
      });
      artIds.push(...interested.map((a) => a.id));
    }

    // Create share link with userId
    const shareLink = await prisma.shareLink.create({
      data: {
        type,
        slug,
        userId,
        artItems: {
          connect: artIds.map((id) => ({ id })),
        },
      },
    });

    return NextResponse.json(shareLink, { status: 201 });
  } catch (error) {
    console.error("Error creating share link:", error);
    return NextResponse.json(
      { error: "Failed to create share link" },
      { status: 500 }
    );
  }
}
