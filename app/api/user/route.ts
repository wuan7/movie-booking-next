import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const { name, email } = await req.json();
  const user = await prisma.user.create({ data: { name, email } });
  return NextResponse.json(user);
}