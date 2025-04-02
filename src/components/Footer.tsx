import { component$ } from '@builder.io/qwik';
import { _ } from 'compiled-i18n';

export default component$(() => {
  return (
    <footer class="w-full border-t py-4 bg-background">
      <div class="container mx-auto px-4">
        <div class="mt-4 text-center space-y-2">
          <p class="text-sm font-medium">
            {_`Made with `}<span class="text-red-500">❤️</span> {_`by`}{' '}
            <a 
              href="https://sebastiancardoso.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="text-primary hover:underline transition-colors"
            >
              Sebastian Cardoso
            </a>
          </p>
          <p class="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {_`QwikRaffle. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
});