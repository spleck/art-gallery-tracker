import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { type, slug } = await request.json();
    
    if (!type || !slug) {
      return NextResponse.json(
        { error: "Type and slug are required" },
        { status: 400 }
      );
    }

    // Get art items based on type
    let artIds: string[] = [];
    if (type === "OWNED" || type === "BOTH") {
      const owned = await prisma.art.findMany({
        where: { status: "OWNED" },
        select: { id: true },
      });
      artIds.push(...owned.map((a) => a.id));
    }
    if (type === "INTERESTED" || type === "BOTH") {
      const interested = await prisma.art.findMany({
        where: { status: "INTERESTED" },
        select: { id: true },
      });
      artIds.push(...interested.map((a) => a.id));
    }

    // Create share link
    const shareLink = await prisma.shareLink.create({
      data: {
        type,
        slug,
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
