import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <footer class="w-full border-t py-6 bg-background">
      <div class="container mx-auto px-4">
        <div class="mt-4 text-center space-y-2">
          <p class="text-sm font-medium">
            Made with <span class="text-red-500">❤️</span> by{' '}
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
            © {new Date().getFullYear()} QwikRaffle. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
});