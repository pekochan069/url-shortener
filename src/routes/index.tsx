import { type VoidComponent } from "solid-js";
import { createEffect, createSignal, Match, Switch } from "solid-js";
import { trpc } from "~/utils/trpc";
import CopyIcon from "~/components/copy";

const Home: VoidComponent = () => {
  const [url, setUrl] = createSignal("");
  const [slug, setSlug] = createSignal("");
  const shortLink = () => `${location.origin}/${slug()}`;

  const createShortLink = trpc.query.createShortLink.useMutation();

  const onFormSubmit = (e: Event) => {
    e.preventDefault();

    if (url() === "") {
      return;
    }

    let tmpUrl = url();
    tmpUrl = tmpUrl.replace(/\/$/, "");

    createShortLink.reset();

    createShortLink.mutateAsync({ url: tmpUrl }).then((data) => {
      setSlug(data.slug);
    });
  };

  return (
    <div class="grid min-h-screen w-full place-items-center bg-slate-300 md:bg-none">
      <main class="container mx-auto grid place-items-center gap-10 px-2">
        <div class="bg:none w-full max-w-3xl rounded-lg md:bg-slate-200 md:px-20 md:py-5">
          <form
            onSubmit={(e) => {
              onFormSubmit(e);
            }}
            class="grid w-full place-items-end gap-4"
          >
            <div class="flex w-full flex-col gap-1">
              <label for="url-input" class="ml-1 text-sm">
                Enter a URL
              </label>
              <input
                id="url-input"
                type="url"
                value={url()}
                onChange={(e) => setUrl(e.currentTarget.value)}
                placeholder="https://example.com"
                class="delay-8 placeholder-text-slate-300 w-full rounded-md px-2 px-2 py-2 text-lg outline-none ring-1 ring-slate-900/5 transition focus:ring-2 focus:ring-slate-900/30 md:text-xl"
              />
            </div>
            <div class="flex gap-2">
              <button
                type="reset"
                class="delay-8 rounded-md bg-slate-500 px-4 py-2 text-white outline-none  ring-slate-900/10 transition hover:bg-slate-400 focus:ring-2 focus:ring-slate-900/50 focus:ring-offset-2 active:bg-slate-600"
              >
                Clear
              </button>
              <button
                type="submit"
                class="delay-8 rounded-md bg-violet-500 px-4 py-2 text-white outline-none transition hover:bg-violet-400 focus:ring-2 focus:ring-violet-900/50 focus:ring-offset-2 active:bg-violet-600"
              >
                Create
              </button>
            </div>
          </form>
          <hr class="h-3px my-8 bg-slate-900/20 md:my-12" />
          <div class="h-30 flex w-full flex-col">
            <h3 class="text-center text-3xl font-thin md:text-3xl">
              Shortened URL
            </h3>
            <div class="grid flex-1 place-items-center">
              <Switch>
                <Match when={createShortLink.isPending}>
                  <p class="text-center text-lg md:text-2xl">...</p>
                </Match>
                <Match when={createShortLink.isSuccess}>
                  <div class="flex gap-4">
                    <h1 class="inline-block text-center text-lg">
                      {shortLink()}
                    </h1>
                    <button
                      class="delay-8 transform rounded-lg bg-white p-1 text-black outline-none transition hover:-translate-y-0.5 focus:ring-1 focus:ring-gray-900/30 focus:ring-offset-2 active:bg-gray-300"
                      onClick={() => navigator.clipboard.writeText(shortLink())}
                    >
                      <CopyIcon />
                    </button>
                  </div>
                </Match>
              </Switch>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
