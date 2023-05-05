import { z } from "zod";
import { procedure, router } from "../utils";
import { prisma } from "~/server/db";

export default router({
  checkSlug: procedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      if (input.slug === "") {
        return {
          exists: false,
          url: "",
        };
      }

      const res = await prisma.shortLink.findFirst({
        where: {
          slug: {
            equals: input.slug,
          },
        },
      });

      return {
        exists: !!res,
        url: res?.url,
      };
    }),
  createShortLink: procedure
    .input(z.object({ slug: z.string(), url: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.shortLink.create({
        data: {
          slug: input.slug,
          url: input.url,
        },
      });
    }),
});
