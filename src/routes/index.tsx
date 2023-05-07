import { type VoidComponent } from "solid-js";
import {
  createEffect,
  createSignal,
  Match,
  Show,
  Switch,
  untrack,
} from "solid-js";
import { trpc } from "~/utils/trpc";
import CopyIcon from "~/components/copy";

const Home: VoidComponent = () => {
  const [url, setUrl] = createSignal("");
  const [slug, setSlug] = createSignal("");
  const [counter, setCounter] = createSignal(0);
  const [timer, setTimer] = createSignal<NodeJS.Timeout>();
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

  createEffect(() => {
    if (untrack(timer)) {
      clearTimeout(untrack(timer));
    }

    if (counter() > 0) {
      const currentTimer = setTimeout(() => {
        setCounter(counter() - 1);
      }, 1000);

      setTimer(currentTimer);
    }
  });

  return (
    <div class="grid min-h-screen w-full place-items-center bg-slate-300 md:bg-none">
      <main class="container mx-auto grid place-items-center gap-10 px-2">
        <div class="bg:none w-full max-w-3xl rounded-lg md:bg-slate-200 md:px-20 md:py-7">
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
          <hr class="h-3px mb-4 mt-8 bg-slate-900/20 md:mb-6 md:mt-12" />
          <div class="h-30 flex w-full flex-col gap-5">
            <h3 class="text-center text-3xl font-thin md:text-4xl">
              Shortened URL
            </h3>
            <div class="flex flex-1 flex-col items-center gap-2">
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
                      onClick={() => {
                        navigator.clipboard.writeText(shortLink());
                        setCounter(3);
                      }}
                    >
                      <CopyIcon />
                    </button>
                  </div>
                </Match>
              </Switch>
              <Show when={counter() > 0}>
                <p class="text-sm text-slate-600">Copied to clipboard!</p>
              </Show>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
