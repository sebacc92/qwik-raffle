import { component$, Slot } from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';
import {guessLocale} from 'compiled-i18n'
import { Toaster } from 'qwik-sonner';
import Header from '~/components/Header';
import Footer from '~/components/Footer';

// import { useServerSession } from "~/shared/loaders";

export { useServerSession } from "~/shared/loaders";

export const onRequest: RequestHandler = async ({query, headers, locale}) => {
	// Allow overriding locale with query param `locale`
	const maybeLocale = query.get('locale') || headers.get('accept-language')
	locale(guessLocale(maybeLocale))
}

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
  // const user = useServerSession();
  // console.log('user', user.value)
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
