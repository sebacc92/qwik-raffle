import { component$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { isDev } from "@builder.io/qwik";

import "./global.css";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <script
          dangerouslySetInnerHTML={`
            (function() {
              function setTheme(theme) {
                document.documentElement.className = theme;
                localStorage.setItem('theme', theme);
              }
              const theme = localStorage.getItem('theme');
    
              if (theme) {
                setTheme(theme);
              } else {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  setTheme('dark');}
                  else {
                    setTheme('light');}}
            })();
            window.addEventListener('load', function() {
              const themeSwitch = document.getElementById('hide-checkbox');
              if (themeSwitch) {
                themeSwitch.checked = localStorage.getItem('theme') === 'light'? true: false;
              }
            }
            );
          `}
        ></script>
        <RouterHead />
      </head>
      <body lang="en">
        <RouterOutlet />
        {!isDev && <ServiceWorkerRegister />}
      </body>
    </QwikCityProvider>
  );
});
