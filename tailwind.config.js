import plugin from "tailwindcss/plugin";
import animatePlugin from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border-color))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--bg-primary))",
                foreground: "hsl(var(--text-primary))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                    hover: "hsl(var(--primary-hover))"
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card-bg))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                alert: {
                    DEFAULT: "hsl(var(--alert))",
                    foreground: "hsl(var(--alert-foreground))",
                },
                danger: {
                    DEFAULT: "hsl(var(--danger))",
                    foreground: "hsl(var(--danger-foreground))",
                },
                success: {
                    DEFAULT: "hsl(var(--button-success))",
                    foreground: "hsl(var(--button-success-foreground))",
                },
                cancel: {
                    DEFAULT: "hsl(var(--button-cancel))",
                    foreground: "hsl(var(--button-cancel-foreground))",
                },
                'poll-option-hover': 'rgba(var(--color-primary-rgb), 0.05)',
            },
            borderRadius: {
                base: "var(--border-radius)",
                sm: "calc(var(--border-radius) + 0.125rem)",
                DEFAULT: "calc(var(--border-radius) + 0.25rem)",
                md: "calc(var(--border-radius) + 0.375rem)",
                lg: "calc(var(--border-radius) + 0.5rem)",
                xl: "calc(var(--border-radius) + 0.75rem)",
                "2xl": "calc(var(--border-radius) + 1rem)",
                "3xl": "calc(var(--border-radius) + 1.5rem)",
            },
            borderWidth: {
                base: "var(--border-width)",
                DEFAULT: "calc(var(--border-width) + 1px)",
                2: "calc(var(--border-width) + 2px)",
                4: "calc(var(--border-width) + 4px)",
                8: "calc(var(--border-width) + 8px)",
            },
            boxShadow: {
                base: "var(--shadow-base)",
                sm: "var(--shadow-sm)",
                DEFAULT: "var(--shadow)",
                md: "var(--shadow-md)",
                lg: "var(--shadow-lg)",
                xl: "var(--shadow-xl)",
                "2xl": "var(--shadow-2xl)",
                inner: "var(--shadow-inner)",
            },
            strokeWidth: {
                0: "0",
                base: "var(--stroke-width)",
                1: "calc(var(--stroke-width) + 1px)",
                2: "calc(var(--stroke-width) + 2px)",
            },
            animation: {
                "accordion-up": "collapsible-up 0.2s ease-out 0s 1 normal forwards",
                "accordion-down": "collapsible-down 0.2s ease-out 0s 1 normal forwards",
                'fadeIn': 'fadeIn 0.3s ease-in-out',
            },
            keyframes: {
                "collapsible-down": {
                    from: { height: "0" },
                    to: { height: "var(--qwikui-collapsible-content-height)" },
                },
                "collapsible-up": {
                    from: { height: "var(--qwikui-collapsible-content-height)" },
                    to: { height: "0" },
                },
                fadeIn: {
                    '0%': { opacity: 0, transform: 'translateY(-5px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                }
            },
        },
    },
    plugins: [
        animatePlugin,
        plugin(function ({ addUtilities }) {
            addUtilities({
                ".press": {
                    transform: "var(--transform-press)",
                },
            });
        }),
        require('tailwind-scrollbar'),
    ],
};
