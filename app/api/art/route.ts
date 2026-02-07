import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { writeFile } from "fs/promises";
import { mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    
    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string | null;
    const description = formData.get("description") as string | null;
    const location = formData.get("location") as string | null;
    const status = formData.get("status") as "OWNED" | "INTERESTED";
    const imageFile = formData.get("image") as File;

    if (!title || !imageFile) {
      return NextResponse.json(
        { error: "Title and image are required" },
        { status: 400 }
      );
    }

    // Save image
    const uploadsDir = path.join(process.cwd(), "uploads");
    await mkdir(uploadsDir, { recursive: true });
    
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = path.join(uploadsDir, fileName);
    
    const bytes = await imageFile.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));
    
    const imageUrl = `/uploads/${fileName}`;

    // Create art record with userId
    const art = await prisma.art.create({
      data: {
        userId: session.user.id,
        title,
        artist,
        description,
        location,
        imageUrl,
        status,
      },
    });

    return NextResponse.json(art, { status: 201 });
  } catch (error) {
    console.error("Error creating art:", error);
    return NextResponse.json(
      { error: "Failed to create art" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const art = await prisma.art.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(art);
  } catch (error) {
    console.error("Error fetching art:", error);
    return NextResponse.json(
      { error: "Failed to fetch art" },
      { status: 500 }
    );
  }
}
