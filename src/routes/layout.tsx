import { component$, Slot } from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';
import { Toaster } from 'qwik-sonner';
import Header from '~/components/Header';
import Footer from '~/components/Footer';

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  return (
    <div class="min-h-screen flex flex-col bg-background text-foreground">
      <Toaster position="top-center" richColors />
      <Header />
      <main class="flex-grow">
        <Slot />
      </main>
      <Footer />
    </div>
  );
});
