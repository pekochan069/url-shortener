import type { APIEvent } from "solid-start/api";
import { json } from "solid-start/api";
import { prisma } from "~/server/db";

export async function GET({ params }: APIEvent) {
  const slug = params.slug;

  if (!slug || typeof slug !== "string") {
    return new Response("No slug found!", { status: 404 });
  }

  const data = await prisma.shortLink.findFirst({
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  if (!data) {
    return new Response("Invalid slug", { status: 404 });
  }

  return json(data, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
