import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "url";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { query } = parse(req.url, true);
  const page = parseInt(query.page as string) || 1;
  const search = query.search as string;
  const limit = 20;
  const skip = (page - 1) * limit;

  const data = await prisma.study.findMany({
    where: {
      title: {
        contains: search,
      },
      categories: {
        some: {
          category: {
            name: "Intervention",
          },
        },
      },
    },
    take: limit,
    skip: skip,
    include: {
      categories: true,
      topic: true,
    },
  });

  return NextResponse.json(data);
}
