import { component$, getLocale, useSignal } from '@builder.io/qwik'
import { LuChevronDown, LuLanguages } from '@qwikest/icons/lucide';
import { _, locales } from 'compiled-i18n'

export const LocaleSelector = component$(() => {
	const currentLocale = getLocale()
    const showLanguageDropdown = useSignal<boolean>(false);
    const languageNamesShort: Record<string, string> = {
        'es_AR': 'ES',
        'en_US': 'EN',
    };
    const languageNames: Record<string, string> = {
        'es_AR': 'Español',
        'en_US': 'English',
    };
    return (
        <div class="relative">
            <button 
                onClick$={() => showLanguageDropdown.value = !showLanguageDropdown.value}
                class="flex items-center justify-center p-2 text-foreground hover:bg-foreground/10 rounded-lg transition-colors cursor-pointer"
                aria-label={_`Change language`}
            >
                <LuLanguages class="w-5 h-5" />
                <span class="ml-1 text-sm hidden sm:inline">{languageNamesShort[currentLocale] || currentLocale}</span>
                <LuChevronDown 
                    class={`w-5 h-5 transition-transform duration-200 ${showLanguageDropdown.value ? "rotate-180" : "rotate-0"}`}
                />
            </button>
            
            {showLanguageDropdown.value && (
                <div class="absolute right-0 mt-2 py-2 w-48 bg-card border border-border rounded-md shadow-xl z-20 animate-fadeIn">
                    {locales.map((locale) => (
                        <a
                            key={locale}
                            href={`?locale=${locale}`}
                            class={`block px-4 py-2 text-sm ${locale === currentLocale ? 
                                'bg-primary/10 text-primary font-medium' : 
                                'text-foreground hover:bg-foreground/5'}`}
                        >
                            {languageNames[locale] || locale}
                            {locale === currentLocale && (
                                <span class="ml-2">✓</span>
                            )}
                        </a>
                    ))}
                </div>
            )}
        </div>
    )
})