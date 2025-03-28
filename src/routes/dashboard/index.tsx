import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="min-h-screen flex flex-col bg-background text-foreground">
      Dashboard
    </div>
  );
});

export const head: DocumentHead = {
  title: 'QwikRaffle - Dashboard',
  meta: [
    {
      name: 'description',
      content: 'Easy, fast, and customizable. Ideal for events, promotions, and much more.',
    },
  ],
};