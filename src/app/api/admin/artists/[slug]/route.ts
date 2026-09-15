import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: { slug: string } };

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slug = params.slug;
  const existing = await prisma.artist.findUnique({ where: { slug } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.artist.delete({ where: { slug } });
  return NextResponse.json({ ok: true });
}
