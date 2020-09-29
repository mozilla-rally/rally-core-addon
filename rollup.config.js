import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn(
        "npm",
        ["run", "start", "--", "--dev"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    replace({
      __STORE_IMPLEMENTATION__: production
        ? "{}"
        : `{
			enrolled: true,
			activeStudies: [],
			availableStudies: [
			  {
				name: "Demo Study",
				icons: {
				  32: "https://addons.cdn.mozilla.net/user-media/addon_icons/2644/2644632-32.png?modified=4a64e2bc",
				  64: "https://addons.cdn.mozilla.net/user-media/addon_icons/2644/2644632-64.png?modified=4a64e2bc",
				  128: "https://addons.cdn.mozilla.net/user-media/addon_icons/2644/2644632-128.png?modified=4a64e2bc",
				},
				schema: 1597266497978,
				authors: {
				  url:
					"https://addons.mozilla.org/en-US/firefox/addon/pioneer-v2-example/",
				  name: "Pioneer Developers",
				},
				version: "1.0",
				addon_id: "pioneer-v2-example@mozilla.org",
				moreInfo: {
				  spec:
					"https://addons.mozilla.org/en-US/firefox/addon/pioneer-v2-example/",
				},
				isDefault: false,
				sourceURI: {
				  spec:
					"https://addons.mozilla.org/firefox/downloads/file/3579857/pioneer_v2-1.0-fx.xpi",
				},
				studyType: "extension",
				studyEnded: false,
				description: "Study purpose: Testing Pioneer.",
				privacyPolicy: {
				  spec:
					"https://addons.mozilla.org/en-US/firefox/addon/pioneer-v2-example/",
				},
				joinStudyConsent:
				  "This study will send an encrypted ping, only when the toolbar icon is clicked.",
				leaveStudyConsent: "This study cannot be re-joined.",
				dataCollectionDetails: ["The date and time"],
			  },
			],
		  }`,
    }),
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: (css) => {
        css.write("bundle.css");
      },
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
