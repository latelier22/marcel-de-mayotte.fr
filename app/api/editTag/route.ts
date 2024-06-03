import { NextResponse } from "next/server";
import prisma from "../../../prisma/prisma";

export async function POST(request) {
  const { oldTagName, updatedTag} = await request.json();
console.log("oldTagName, newTagName",oldTagName, updatedTag)
  try {
    // Trouver le tag par son ancien nom
    const tag = await prisma.tag.findUnique({
      where: {
        name: oldTagName
      }
    });

    if (!tag) {
      return NextResponse.json({ success: false, error: "Tag not found", message: `No tag found with the name '${oldTagName}'` });
    }

    // // Vérifier si le nouveau nom de tag existe déjà pour éviter les doublons
    // const existingTag = await prisma.tag.findUnique({
    //   where: {
    //     name: newTagName
    //   }
    // });

    // if (existingTag) {
    //   return NextResponse.json({ success: false, error: "Tag name already exists", message: `Tag name '${newTagName}' already exists.` });
    // }

    // Mettre à jour le nom du tag
    await prisma.tag.update({
      where: {
        id: tag.id
      },
      data: {
        name: updatedTag.name, 
        mainTag : updatedTag.mainTag
      }
    });

    return NextResponse.json({ success: true, message: `Tag name updated from '${oldTagName}' to '${updatedTag.name}' successfully.` });
  } catch (error) {
    console.error("Error in updating tag name:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to update tag name",
      message: error.message
    });
  }
}
