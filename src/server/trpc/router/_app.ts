import { router } from "../utils";
import query from "./query";

export const appRouter = router({
  query,
});

export type IAppRouter = typeof appRouter;
