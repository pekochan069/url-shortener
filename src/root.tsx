// @refresh reload
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
  Link,
} from "solid-start";
import { trpc, queryClient } from "~/utils/trpc";
import "@unocss/reset/tailwind.css";
import "virtual:uno.css";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>Url Shortener</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta name="description" content="url shortener" />
        <Link rel="icon" href="/favicon.ico" />
      </Head>
      <Body class="">
        <trpc.Provider queryClient={queryClient}>
          <Suspense>
            <ErrorBoundary>
              <Routes>
                <FileRoutes />
              </Routes>
            </ErrorBoundary>
          </Suspense>
        </trpc.Provider>
        <Scripts />
      </Body>
    </Html>
  );
}
