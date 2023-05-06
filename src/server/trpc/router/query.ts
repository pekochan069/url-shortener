import { z } from "zod";
import { procedure, router } from "../utils";
import { prisma } from "~/server/db";
import { createNewSlug } from "~/utils/createSlug";

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
    .input(z.object({ url: z.string() }))
    .mutation(async ({ input }) => {
      let slug = createNewSlug(12);

      while (true) {
        const query = await prisma.shortLink.findFirst({
          where: {
            OR: [
              {
                slug: {
                  equals: slug,
                },
              },
              {
                url: {
                  equals: input.url,
                },
              },
            ],
          },
        });

        if (!query) {
          break;
        }

        if (query?.slug === slug) {
          slug = createNewSlug(12);
          continue;
        }

        if (query?.url === input.url) {
          return query;
        }
      }

      return await prisma.shortLink.create({
        data: {
          slug: slug,
          url: input.url,
        },
      });
    }),
});
