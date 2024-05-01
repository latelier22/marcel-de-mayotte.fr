// pages/api/upload.ts
import { NextRequest, NextResponse } from "next/server";
import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || typeof file !== "object") {
    return NextResponse.redirect(new URL('/error', req.url));
  }

  const destinationDirPath = path.join(process.cwd(), "public/uploads");
  const filePath = path.join(destinationDirPath, file.name);

  const fileArrayBuffer = await file.arrayBuffer();

  if (!existsSync(destinationDirPath)) {
    await fs.mkdir(destinationDirPath, { recursive: true });
  }
  await fs.writeFile(filePath, Buffer.from(fileArrayBuffer));

  const imageUrl = `/uploads/${file.name}`;
  return NextResponse.redirect(new URL(`/create-photo?imageUrl=${imageUrl}`, req.url));
}
