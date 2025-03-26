import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    plugins: [
        require("tailwindcss-animate"),
        plugin(function ({ addUtilities }) {
            addUtilities({
                ".press": {
                    transform: "var(--transform-press)",
                },
            });
        }),
    ],
};
