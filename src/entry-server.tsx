import {
  StartServer,
  createHandler,
  renderAsync,
} from "solid-start/entry-server";
import { redirect } from "solid-start";

export default createHandler(
  ({ forward }) => {
    return async (event) => {
      const url = new URL(event.request.url);

      if (url.pathname.startsWith("/api") || url.pathname === "/") {
        return forward(event);
      }

      const slug = url.pathname.split("/").pop();
      const fetchSlug = await fetch(`${url.origin}/api/get-link/${slug}`);

      console.log(fetchSlug.status);
      if (fetchSlug.status === 404) {
        return redirect(url.origin);
      }

      const data = await fetchSlug.json();

      if (!data.url) {
        return redirect(url.origin);
      }

      return redirect(data.url);
    };
  },
  renderAsync((event) => <StartServer event={event} />)
);