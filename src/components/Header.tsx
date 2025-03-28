import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { LuGift } from '@qwikest/icons/lucide';

export default component$(() => {
  return (
    <header class="w-full py-4 px-4 md:px-6 flex items-center justify-between border-b border-border shadow-sm sticky top-0 z-30 bg-background/95 backdrop-blur-sm">
      <div class="flex items-center">
        <Link href="/" class="flex items-center">
          <LuGift class="h-8 w-8 text-primary animate-pulse" />
          <span class="ml-2 text-xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">QwikRaffle</span>
        </Link>
      </div>
      <Link 
        href="/app" 
        class="inline-flex h-9 items-center justify-center rounded-base bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary-hover press"
      >
        Sign In
      </Link>
    </header>
  );
});