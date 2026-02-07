import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { writeFile } from "fs/promises";
import { mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string | null;
    const description = formData.get("description") as string | null;
    const location = formData.get("location") as string | null;
    const status = formData.get("status") as "OWNED" | "INTERESTED";
    const imageFile = formData.get("image") as File | null;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const existingArt = await prisma.art.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingArt) {
      return NextResponse.json({ error: "Art not found" }, { status: 404 });
    }

    let imageUrl = existingArt.imageUrl;

    // If new image uploaded, save it
    if (imageFile && imageFile.size > 0) {
      const uploadsDir = path.join(process.cwd(), "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = path.join(uploadsDir, fileName);

      const bytes = await imageFile.arrayBuffer();
      await writeFile(filePath, Buffer.from(bytes));

      imageUrl = `/uploads/${fileName}`;
    }

    const updatedArt = await prisma.art.update({
      where: { id },
      data: {
        title,
        artist,
        description,
        location,
        imageUrl,
        status,
      },
    });

    return NextResponse.json(updatedArt);
  } catch (error) {
    console.error("Error updating art:", error);
    return NextResponse.json(
      { error: "Failed to update art" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    const existingArt = await prisma.art.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingArt) {
      return NextResponse.json({ error: "Art not found" }, { status: 404 });
    }

    await prisma.art.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting art:", error);
    return NextResponse.json(
      { error: "Failed to delete art" },
      { status: 500 }
    );
  }
}
