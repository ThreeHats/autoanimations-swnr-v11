// vite.config.js
import { svelte } from "file:///C:/Users/tspla/Documents/GitHub/autoanimations/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import {
  postcssConfig,
  terserConfig
} from "file:///C:/Users/tspla/Documents/GitHub/autoanimations/node_modules/@typhonjs-fvtt/runtime/.rollup/remote/index.js";
import { sveltePreprocess } from "file:///C:/Users/tspla/Documents/GitHub/autoanimations/node_modules/svelte-preprocess/dist/index.js";

// module.json
var module_default = {
  id: "autoanimations",
  title: "Automated Animations",
  description: "This will automatically run most JB2A Animations such as Melee/Ranged Attacks, Spell Attacks, and Instant Spells",
  authors: [
    {
      name: "theripper93",
      email: "tsplab@gmail.com",
      url: "https://www.patreon.com/theripper93"
    },
    {
      name: "Otigon (Otigon#2010)",
      discord: "Otigon#2010"
    }
  ],
  url: "https://github.com/theripper93/autoanimations",
  version: "5.0.0",
  compatibility: {
    minimum: "11",
    verified: "12"
  },
  minimumCoreVersion: "11",
  compatibleCoreVersion: "12",
  scripts: [],
  esmodules: [
    "dist/autoanimations.js"
  ],
  styles: [
    "dist/autoanimations.css"
  ],
  flags: {
    hotReload: {
      extensions: ["json"],
      paths: ["lang"]
    }
  },
  languages: [
    {
      lang: "en",
      name: "English",
      path: "lang/en.json"
    },
    {
      lang: "es",
      name: "Espa\xF1ol",
      path: "lang/es.json"
    },
    {
      lang: "it",
      name: "Italiano",
      path: "lang/it.json"
    },
    {
      lang: "ko",
      name: "Korean",
      path: "lang/ko.json"
    },
    {
      lang: "ja",
      name: "\u65E5\u672C\u8A9E",
      path: "lang/ja.json"
    },
    {
      lang: "fr",
      name: "Fran\xE7ais",
      path: "lang/fr.json"
    },
    {
      lang: "pt-BR",
      name: "Portugu\xEAs (Brasil)",
      path: "lang/pt-br.json"
    },
    {
      lang: "de",
      name: "Deutsch",
      path: "lang/de.json"
    },
    {
      lang: "zh-tw",
      name: "\u6B63\u9AD4\u4E2D\u6587",
      path: "lang/zh-tw.json"
    },
    {
      lang: "cn",
      name: "\u4E2D\u6587\uFF08\u7B80\u4F53\uFF09",
      path: "lang/zh_Hans.json"
    },
    {
      lang: "pt-BR",
      name: "Portugu\xEAs (Brasil)",
      path: "lang/pt_BR.json"
    }
  ],
  relationships: {
    requires: [
      {
        id: "sequencer",
        type: "module",
        manifest: "https://github.com/fantasycalendar/FoundryVTT-Sequencer/releases/latest/download/module.json"
      },
      {
        id: "socketlib",
        type: "module"
      }
    ]
  },
  socket: true,
  manifest: "https://github.com/otigon/automated-jb2a-animations/releases/latest/download/module.json",
  download: "https://github.com/otigon/automated-jb2a-animations/releases/download/0.6.71/module.zip"
};

// vite.config.js
var s_PACKAGE_ID = `modules/${module_default.id}`;
var s_SVELTE_HASH_ID = "auto";
var s_COMPRESS = false;
var s_SOURCEMAPS = true;
var vite_config_default = ({ mode }) => {
  const compilerOptions = mode === "production" ? {
    cssHash: ({ hash, css }) => `svelte-${s_SVELTE_HASH_ID}-${hash(css)}`
  } : {};
  return {
    root: "src/",
    // Source location / esbuild root.
    base: `/${s_PACKAGE_ID}/dist`,
    // Base module path that 30001 / served dev directory.
    publicDir: false,
    // No public resources to copy.
    cacheDir: "../.vite-cache",
    // Relative from root directory.
    resolve: { conditions: ["browser", "import"] },
    esbuild: {
      target: ["es2022"]
    },
    css: {
      // Creates a standard configuration for PostCSS with autoprefixer & postcss-preset-env.
      postcss: postcssConfig({ compress: s_COMPRESS, sourceMap: s_SOURCEMAPS })
    },
    // About server options:
    // - Set to `open` to boolean `false` to not open a browser window automatically. This is useful if you set up a
    // debugger instance in your IDE and launch it with the URL: 'http://localhost:30001/game'.
    //
    // - The top proxy entry redirects requests under the module path for `style.css` and following standard static
    // directories: `assets`, `lang`, and `packs` and will pull those resources from the main Foundry / 30000 server.
    // This is necessary to reference the dev resources as the root is `/src` and there is no public / static
    // resources served with this particular Vite configuration. Modify the proxy rule as necessary for your
    // static resources / project.
    server: {
      port: 30001,
      open: "/game",
      proxy: {
        // Serves static files from main Foundry server.
        [`^(/${s_PACKAGE_ID}/(assets|lang|packs|style.css))`]: "http://localhost:30000",
        // All other paths besides package ID path are served from main Foundry server.
        [`^(?!/${s_PACKAGE_ID}/)`]: "http://localhost:30000",
        // Rewrite incoming `module-id.js` request from Foundry to the dev server `index.js`.
        [`/${s_PACKAGE_ID}/dist/${module_default.id}.js`]: {
          target: `http://localhost:30001/${s_PACKAGE_ID}/dist`,
          rewrite: () => "/index.js"
        },
        // Enable socket.io from main Foundry server.
        "/socket.io": { target: "ws://localhost:30000", ws: true }
      }
    },
    build: {
      outDir: "../dist",
      emptyOutDir: false,
      sourcemap: s_SOURCEMAPS,
      brotliSize: true,
      minify: s_COMPRESS ? "terser" : false,
      target: ["es2022"],
      terserOptions: s_COMPRESS ? { ...terserConfig(), ecma: 2022 } : void 0,
      lib: {
        entry: "./index.js",
        formats: ["es"],
        fileName: module_default.id
      },
      rollupOptions: {
        output: {
          // Rewrite the default style.css to a more recognizable file name.
          assetFileNames: (assetInfo) => assetInfo.name === "style.css" ? `${module_default.id}.css` : assetInfo.name
        }
      }
    },
    // Necessary when using the dev server for top-level await usage inside TRL.
    optimizeDeps: {
      esbuildOptions: {
        target: "es2022"
      }
    },
    plugins: [
      svelte({
        compilerOptions,
        preprocess: sveltePreprocess()
      })
    ]
  };
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAibW9kdWxlLmpzb24iXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx0c3BsYVxcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXGF1dG9hbmltYXRpb25zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx0c3BsYVxcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXGF1dG9hbmltYXRpb25zXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy90c3BsYS9Eb2N1bWVudHMvR2l0SHViL2F1dG9hbmltYXRpb25zL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgc3ZlbHRlIH0gICAgICAgICAgICAgZnJvbSAnQHN2ZWx0ZWpzL3ZpdGUtcGx1Z2luLXN2ZWx0ZSc7XG5cbmltcG9ydCB7XG4gICBwb3N0Y3NzQ29uZmlnLFxuICAgdGVyc2VyQ29uZmlnIH0gICAgICAgICAgICAgZnJvbSAnQHR5cGhvbmpzLWZ2dHQvcnVudGltZS9yb2xsdXAnO1xuXG5pbXBvcnQgeyBzdmVsdGVQcmVwcm9jZXNzIH0gICBmcm9tICdzdmVsdGUtcHJlcHJvY2Vzcyc7XG5cbmltcG9ydCBtb2R1bGVKU09OICAgICAgICAgICAgIGZyb20gJy4vbW9kdWxlLmpzb24nIHdpdGggeyB0eXBlOiAnanNvbicgfTtcblxuLy8gQVRURU5USU9OIVxuLy8gUGxlYXNlIG1vZGlmeSB0aGUgYmVsb3cgdmFyaWFibGVzOiBzX1NWRUxURV9IQVNIX0lEIGFwcHJvcHJpYXRlbHkuXG5cbmNvbnN0IHNfUEFDS0FHRV9JRCA9IGBtb2R1bGVzLyR7bW9kdWxlSlNPTi5pZH1gO1xuXG4vLyBBIHNob3J0IGFkZGl0aW9uYWwgc3RyaW5nIHRvIGFkZCB0byBTdmVsdGUgQ1NTIGhhc2ggdmFsdWVzIHRvIG1ha2UgeW91cnMgdW5pcXVlLiBUaGlzIHJlZHVjZXMgdGhlIGFtb3VudCBvZlxuLy8gZHVwbGljYXRlZCBmcmFtZXdvcmsgQ1NTIG92ZXJsYXAgYmV0d2VlbiBtYW55IFRSTCBwYWNrYWdlcyBlbmFibGVkIG9uIEZvdW5kcnkgVlRUIGF0IHRoZSBzYW1lIHRpbWUuXG5jb25zdCBzX1NWRUxURV9IQVNIX0lEID0gJ2F1dG8nO1xuXG5jb25zdCBzX0NPTVBSRVNTID0gZmFsc2U7ICAvLyBTZXQgdG8gdHJ1ZSB0byBjb21wcmVzcyB0aGUgbW9kdWxlIGJ1bmRsZS5cbmNvbnN0IHNfU09VUkNFTUFQUyA9IHRydWU7IC8vIEdlbmVyYXRlIHNvdXJjZW1hcHMgZm9yIHRoZSBidW5kbGUgKHJlY29tbWVuZGVkKS5cblxuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSB9KSA9Plxue1xuICAgLy8gUHJvdmlkZXMgYSBjdXN0b20gaGFzaCBhZGRpbmcgdGhlIHN0cmluZyBkZWZpbmVkIGluIGBzX1NWRUxURV9IQVNIX0lEYCB0byBzY29wZWQgU3ZlbHRlIHN0eWxlcztcbiAgIC8vIFRoaXMgaXMgcmVhc29uYWJsZSB0byBkbyBhcyB0aGUgZnJhbWV3b3JrIHN0eWxlcyBpbiBUUkwgY29tcGlsZWQgYWNyb3NzIGBuYCBkaWZmZXJlbnQgcGFja2FnZXMgd2lsbFxuICAgLy8gYmUgdGhlIHNhbWUuIFNsaWdodGx5IG1vZGlmeWluZyB0aGUgaGFzaCBlbnN1cmVzIHRoYXQgeW91ciBwYWNrYWdlIGhhcyB1bmlxdWVseSBzY29wZWQgc3R5bGVzIGZvciBhbGxcbiAgIC8vIFRSTCBjb21wb25lbnRzIGFuZCBtYWtlcyBpdCBlYXNpZXIgdG8gcmV2aWV3IHN0eWxlcyBpbiB0aGUgYnJvd3NlciBkZWJ1Z2dlci5cbiAgIGNvbnN0IGNvbXBpbGVyT3B0aW9ucyA9IG1vZGUgPT09ICdwcm9kdWN0aW9uJyA/IHtcbiAgICAgIGNzc0hhc2g6ICh7IGhhc2gsIGNzcyB9KSA9PiBgc3ZlbHRlLSR7c19TVkVMVEVfSEFTSF9JRH0tJHtoYXNoKGNzcyl9YFxuICAgfSA6IHt9O1xuXG4gICAvKiogQHR5cGUge2ltcG9ydCgndml0ZScpLlVzZXJDb25maWd9ICovXG4gICByZXR1cm4ge1xuICAgICAgcm9vdDogJ3NyYy8nLCAgICAgICAgICAgICAgICAgICAgLy8gU291cmNlIGxvY2F0aW9uIC8gZXNidWlsZCByb290LlxuICAgICAgYmFzZTogYC8ke3NfUEFDS0FHRV9JRH0vZGlzdGAsICAgLy8gQmFzZSBtb2R1bGUgcGF0aCB0aGF0IDMwMDAxIC8gc2VydmVkIGRldiBkaXJlY3RvcnkuXG4gICAgICBwdWJsaWNEaXI6IGZhbHNlLCAgICAgICAgICAgICAgICAvLyBObyBwdWJsaWMgcmVzb3VyY2VzIHRvIGNvcHkuXG4gICAgICBjYWNoZURpcjogJy4uLy52aXRlLWNhY2hlJywgICAgICAvLyBSZWxhdGl2ZSBmcm9tIHJvb3QgZGlyZWN0b3J5LlxuXG4gICAgICByZXNvbHZlOiB7IGNvbmRpdGlvbnM6IFsnYnJvd3NlcicsICdpbXBvcnQnXSB9LFxuXG4gICAgICBlc2J1aWxkOiB7XG4gICAgICAgICB0YXJnZXQ6IFsnZXMyMDIyJ11cbiAgICAgIH0sXG5cbiAgICAgIGNzczoge1xuICAgICAgICAgLy8gQ3JlYXRlcyBhIHN0YW5kYXJkIGNvbmZpZ3VyYXRpb24gZm9yIFBvc3RDU1Mgd2l0aCBhdXRvcHJlZml4ZXIgJiBwb3N0Y3NzLXByZXNldC1lbnYuXG4gICAgICAgICBwb3N0Y3NzOiBwb3N0Y3NzQ29uZmlnKHsgY29tcHJlc3M6IHNfQ09NUFJFU1MsIHNvdXJjZU1hcDogc19TT1VSQ0VNQVBTIH0pXG4gICAgICB9LFxuXG4gICAgICAvLyBBYm91dCBzZXJ2ZXIgb3B0aW9uczpcbiAgICAgIC8vIC0gU2V0IHRvIGBvcGVuYCB0byBib29sZWFuIGBmYWxzZWAgdG8gbm90IG9wZW4gYSBicm93c2VyIHdpbmRvdyBhdXRvbWF0aWNhbGx5LiBUaGlzIGlzIHVzZWZ1bCBpZiB5b3Ugc2V0IHVwIGFcbiAgICAgIC8vIGRlYnVnZ2VyIGluc3RhbmNlIGluIHlvdXIgSURFIGFuZCBsYXVuY2ggaXQgd2l0aCB0aGUgVVJMOiAnaHR0cDovL2xvY2FsaG9zdDozMDAwMS9nYW1lJy5cbiAgICAgIC8vXG4gICAgICAvLyAtIFRoZSB0b3AgcHJveHkgZW50cnkgcmVkaXJlY3RzIHJlcXVlc3RzIHVuZGVyIHRoZSBtb2R1bGUgcGF0aCBmb3IgYHN0eWxlLmNzc2AgYW5kIGZvbGxvd2luZyBzdGFuZGFyZCBzdGF0aWNcbiAgICAgIC8vIGRpcmVjdG9yaWVzOiBgYXNzZXRzYCwgYGxhbmdgLCBhbmQgYHBhY2tzYCBhbmQgd2lsbCBwdWxsIHRob3NlIHJlc291cmNlcyBmcm9tIHRoZSBtYWluIEZvdW5kcnkgLyAzMDAwMCBzZXJ2ZXIuXG4gICAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSB0byByZWZlcmVuY2UgdGhlIGRldiByZXNvdXJjZXMgYXMgdGhlIHJvb3QgaXMgYC9zcmNgIGFuZCB0aGVyZSBpcyBubyBwdWJsaWMgLyBzdGF0aWNcbiAgICAgIC8vIHJlc291cmNlcyBzZXJ2ZWQgd2l0aCB0aGlzIHBhcnRpY3VsYXIgVml0ZSBjb25maWd1cmF0aW9uLiBNb2RpZnkgdGhlIHByb3h5IHJ1bGUgYXMgbmVjZXNzYXJ5IGZvciB5b3VyXG4gICAgICAvLyBzdGF0aWMgcmVzb3VyY2VzIC8gcHJvamVjdC5cbiAgICAgIHNlcnZlcjoge1xuICAgICAgICAgcG9ydDogMzAwMDEsXG4gICAgICAgICBvcGVuOiAnL2dhbWUnLFxuICAgICAgICAgcHJveHk6IHtcbiAgICAgICAgICAgIC8vIFNlcnZlcyBzdGF0aWMgZmlsZXMgZnJvbSBtYWluIEZvdW5kcnkgc2VydmVyLlxuICAgICAgICAgICAgW2BeKC8ke3NfUEFDS0FHRV9JRH0vKGFzc2V0c3xsYW5nfHBhY2tzfHN0eWxlLmNzcykpYF06ICdodHRwOi8vbG9jYWxob3N0OjMwMDAwJyxcblxuICAgICAgICAgICAgLy8gQWxsIG90aGVyIHBhdGhzIGJlc2lkZXMgcGFja2FnZSBJRCBwYXRoIGFyZSBzZXJ2ZWQgZnJvbSBtYWluIEZvdW5kcnkgc2VydmVyLlxuICAgICAgICAgICAgW2BeKD8hLyR7c19QQUNLQUdFX0lEfS8pYF06ICdodHRwOi8vbG9jYWxob3N0OjMwMDAwJyxcblxuICAgICAgICAgICAgLy8gUmV3cml0ZSBpbmNvbWluZyBgbW9kdWxlLWlkLmpzYCByZXF1ZXN0IGZyb20gRm91bmRyeSB0byB0aGUgZGV2IHNlcnZlciBgaW5kZXguanNgLlxuICAgICAgICAgICAgW2AvJHtzX1BBQ0tBR0VfSUR9L2Rpc3QvJHttb2R1bGVKU09OLmlkfS5qc2BdOiB7XG4gICAgICAgICAgICAgICB0YXJnZXQ6IGBodHRwOi8vbG9jYWxob3N0OjMwMDAxLyR7c19QQUNLQUdFX0lEfS9kaXN0YCxcbiAgICAgICAgICAgICAgIHJld3JpdGU6ICgpID0+ICcvaW5kZXguanMnLFxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8gRW5hYmxlIHNvY2tldC5pbyBmcm9tIG1haW4gRm91bmRyeSBzZXJ2ZXIuXG4gICAgICAgICAgICAnL3NvY2tldC5pbyc6IHsgdGFyZ2V0OiAnd3M6Ly9sb2NhbGhvc3Q6MzAwMDAnLCB3czogdHJ1ZSB9XG4gICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBidWlsZDoge1xuICAgICAgICAgb3V0RGlyOiAnLi4vZGlzdCcsXG4gICAgICAgICBlbXB0eU91dERpcjogZmFsc2UsXG4gICAgICAgICBzb3VyY2VtYXA6IHNfU09VUkNFTUFQUyxcbiAgICAgICAgIGJyb3RsaVNpemU6IHRydWUsXG4gICAgICAgICBtaW5pZnk6IHNfQ09NUFJFU1MgPyAndGVyc2VyJyA6IGZhbHNlLFxuICAgICAgICAgdGFyZ2V0OiBbJ2VzMjAyMiddLFxuICAgICAgICAgdGVyc2VyT3B0aW9uczogc19DT01QUkVTUyA/IHsgLi4udGVyc2VyQ29uZmlnKCksIGVjbWE6IDIwMjIgfSA6IHZvaWQgMCxcbiAgICAgICAgIGxpYjoge1xuICAgICAgICAgICAgZW50cnk6ICcuL2luZGV4LmpzJyxcbiAgICAgICAgICAgIGZvcm1hdHM6IFsnZXMnXSxcbiAgICAgICAgICAgIGZpbGVOYW1lOiBtb2R1bGVKU09OLmlkXG4gICAgICAgICB9LFxuICAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICAgICAvLyBSZXdyaXRlIHRoZSBkZWZhdWx0IHN0eWxlLmNzcyB0byBhIG1vcmUgcmVjb2duaXphYmxlIGZpbGUgbmFtZS5cbiAgICAgICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvKSA9PlxuICAgICAgICAgICAgICAgIGFzc2V0SW5mby5uYW1lID09PSAnc3R5bGUuY3NzJyA/IGAke21vZHVsZUpTT04uaWR9LmNzc2AgOiBhc3NldEluZm8ubmFtZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvLyBOZWNlc3Nhcnkgd2hlbiB1c2luZyB0aGUgZGV2IHNlcnZlciBmb3IgdG9wLWxldmVsIGF3YWl0IHVzYWdlIGluc2lkZSBUUkwuXG4gICAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICAgICAgICB0YXJnZXQ6ICdlczIwMjInXG4gICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBwbHVnaW5zOiBbXG4gICAgICAgICBzdmVsdGUoe1xuICAgICAgICAgICAgY29tcGlsZXJPcHRpb25zLFxuICAgICAgICAgICAgcHJlcHJvY2Vzczogc3ZlbHRlUHJlcHJvY2VzcygpXG4gICAgICAgICB9KSxcbiAgICAgIF1cbiAgIH07XG59O1xuIiwgIntcblx0XCJpZFwiOiBcImF1dG9hbmltYXRpb25zXCIsXG5cdFwidGl0bGVcIjogXCJBdXRvbWF0ZWQgQW5pbWF0aW9uc1wiLFxuXHRcImRlc2NyaXB0aW9uXCI6IFwiVGhpcyB3aWxsIGF1dG9tYXRpY2FsbHkgcnVuIG1vc3QgSkIyQSBBbmltYXRpb25zIHN1Y2ggYXMgTWVsZWUvUmFuZ2VkIEF0dGFja3MsIFNwZWxsIEF0dGFja3MsIGFuZCBJbnN0YW50IFNwZWxsc1wiLFxuXHRcImF1dGhvcnNcIjogW1xuXHRcdHtcblx0XHRcdFwibmFtZVwiOiBcInRoZXJpcHBlcjkzXCIsXG5cdFx0XHRcImVtYWlsXCI6IFwidHNwbGFiQGdtYWlsLmNvbVwiLFxuXHRcdFx0XCJ1cmxcIjogXCJodHRwczovL3d3dy5wYXRyZW9uLmNvbS90aGVyaXBwZXI5M1wiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRcIm5hbWVcIjogXCJPdGlnb24gKE90aWdvbiMyMDEwKVwiLFxuXHRcdFx0XCJkaXNjb3JkXCI6IFwiT3RpZ29uIzIwMTBcIlxuXHRcdH1cblx0XSxcblx0XCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vdGhlcmlwcGVyOTMvYXV0b2FuaW1hdGlvbnNcIixcblx0XCJ2ZXJzaW9uXCI6IFwiNS4wLjBcIixcblx0XCJjb21wYXRpYmlsaXR5XCI6IHtcblx0XHRcIm1pbmltdW1cIjogXCIxMVwiLFxuXHRcdFwidmVyaWZpZWRcIjogXCIxMlwiXG5cdH0sXG5cdFwibWluaW11bUNvcmVWZXJzaW9uXCI6IFwiMTFcIixcblx0XCJjb21wYXRpYmxlQ29yZVZlcnNpb25cIjogXCIxMlwiLFxuXHRcInNjcmlwdHNcIjogW10sXG5cdFwiZXNtb2R1bGVzXCI6IFtcblx0XHRcImRpc3QvYXV0b2FuaW1hdGlvbnMuanNcIlxuXHRdLFxuXHRcInN0eWxlc1wiOiBbXG5cdFx0XCJkaXN0L2F1dG9hbmltYXRpb25zLmNzc1wiXG5cdF0sXG5cdFwiZmxhZ3NcIjoge1xuXHRcdFwiaG90UmVsb2FkXCI6IHtcblx0XHRcdFwiZXh0ZW5zaW9uc1wiOiBbXCJqc29uXCJdLFxuXHRcdFx0XCJwYXRoc1wiOiBbXCJsYW5nXCJdXG5cdFx0fVxuXHR9LFxuXHRcImxhbmd1YWdlc1wiOiBbXG5cdFx0e1xuXHRcdFx0XCJsYW5nXCI6IFwiZW5cIixcblx0XHRcdFwibmFtZVwiOiBcIkVuZ2xpc2hcIixcblx0XHRcdFwicGF0aFwiOiBcImxhbmcvZW4uanNvblwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRcImxhbmdcIjogXCJlc1wiLFxuXHRcdFx0XCJuYW1lXCI6IFwiRXNwYVx1MDBGMW9sXCIsXG5cdFx0XHRcInBhdGhcIjogXCJsYW5nL2VzLmpzb25cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0XCJsYW5nXCI6IFwiaXRcIixcblx0XHRcdFwibmFtZVwiOiBcIkl0YWxpYW5vXCIsXG5cdFx0XHRcInBhdGhcIjogXCJsYW5nL2l0Lmpzb25cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0XCJsYW5nXCI6IFwia29cIixcblx0XHRcdFwibmFtZVwiOiBcIktvcmVhblwiLFxuXHRcdFx0XCJwYXRoXCI6IFwibGFuZy9rby5qc29uXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdFwibGFuZ1wiOiBcImphXCIsXG5cdFx0XHRcIm5hbWVcIjogXCJcdTY1RTVcdTY3MkNcdThBOUVcIixcblx0XHRcdFwicGF0aFwiOiBcImxhbmcvamEuanNvblwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRcImxhbmdcIjogXCJmclwiLFxuXHRcdFx0XCJuYW1lXCI6IFwiRnJhblx1MDBFN2Fpc1wiLFxuXHRcdFx0XCJwYXRoXCI6IFwibGFuZy9mci5qc29uXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdFwibGFuZ1wiOiBcInB0LUJSXCIsXG5cdFx0XHRcIm5hbWVcIjogXCJQb3J0dWd1XHUwMEVBcyAoQnJhc2lsKVwiLFxuXHRcdFx0XCJwYXRoXCI6IFwibGFuZy9wdC1ici5qc29uXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdFwibGFuZ1wiOiBcImRlXCIsXG5cdFx0XHRcIm5hbWVcIjogXCJEZXV0c2NoXCIsXG5cdFx0XHRcInBhdGhcIjogXCJsYW5nL2RlLmpzb25cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0XCJsYW5nXCI6IFwiemgtdHdcIixcblx0XHRcdFwibmFtZVwiOiBcIlx1NkI2M1x1OUFENFx1NEUyRFx1NjU4N1wiLFxuXHRcdFx0XCJwYXRoXCI6IFwibGFuZy96aC10dy5qc29uXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdFwibGFuZ1wiOiBcImNuXCIsXG5cdFx0XHRcIm5hbWVcIjogXCJcdTRFMkRcdTY1ODdcdUZGMDhcdTdCODBcdTRGNTNcdUZGMDlcIixcblx0XHRcdFwicGF0aFwiOiBcImxhbmcvemhfSGFucy5qc29uXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdFwibGFuZ1wiOiBcInB0LUJSXCIsXG5cdFx0XHRcIm5hbWVcIjogXCJQb3J0dWd1XHUwMEVBcyAoQnJhc2lsKVwiLFxuXHRcdFx0XCJwYXRoXCI6IFwibGFuZy9wdF9CUi5qc29uXCJcblx0XHR9XG5cdF0sXG5cdFwicmVsYXRpb25zaGlwc1wiOiB7XG5cdFx0XCJyZXF1aXJlc1wiOiBbXG5cdFx0XHR7XG5cdFx0XHRcdFwiaWRcIjogXCJzZXF1ZW5jZXJcIixcblx0XHRcdFx0XCJ0eXBlXCI6IFwibW9kdWxlXCIsXG5cdFx0XHRcdFwibWFuaWZlc3RcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZmFudGFzeWNhbGVuZGFyL0ZvdW5kcnlWVFQtU2VxdWVuY2VyL3JlbGVhc2VzL2xhdGVzdC9kb3dubG9hZC9tb2R1bGUuanNvblwiXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRcImlkXCI6IFwic29ja2V0bGliXCIsXG5cdFx0XHRcdFwidHlwZVwiOiBcIm1vZHVsZVwiXG5cdFx0XHR9XG5cdFx0XVxuXHR9LFxuXHRcInNvY2tldFwiOiB0cnVlLFxuXHRcIm1hbmlmZXN0XCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL290aWdvbi9hdXRvbWF0ZWQtamIyYS1hbmltYXRpb25zL3JlbGVhc2VzL2xhdGVzdC9kb3dubG9hZC9tb2R1bGUuanNvblwiLFxuXHRcImRvd25sb2FkXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL290aWdvbi9hdXRvbWF0ZWQtamIyYS1hbmltYXRpb25zL3JlbGVhc2VzL2Rvd25sb2FkLzAuNi43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
