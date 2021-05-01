import { createApp, ref } from 'https://unpkg.com/vue@next/dist/vue.esm-browser.js';

const parser = ref(null);

const { log } = console;

// Ironically, we’re using 'template' instead of a Vue SFC for simplicity :D
const app = createApp({

  setup () {
    return {
      parser,
    };
  },

  template:  `<section class="js-file">
                <p><strong>Paste your .js file here</strong></p>
                <textarea
                  v-model="inputString"
                  :placeholder="inputPlaceholder"
                ></textarea>
              </section>

              <section class="vue-file">
                <p><strong>...and your .vue file will appear here <img src="https://openmoji.org/data/color/svg/1F916.svg" height="34"/></strong></p>
                <textarea
                  readonly
                  v-model="outputString"
                  :placeholder="outputPlaceholder"
                ></textarea>
              </section>`,

  data () {
    return {
      inputString: '',
      outputString: '',
      inputPlaceholder: '',
      outputPlaceholder: '',
    };
  },

  computed: {
    parserAvailable () {
      return this.parser != null;
    },
  },

  async created () {
    try {
      const res = await fetch('example-file.js'),
            text = await res.text();

      this.inputPlaceholder = text;
      this.outputPlaceholder = this.convert(text);
    }
    catch {
      // Do absolutely nothing
    }
  },

  watch: {
    inputString () {
      this.outputString = this.convert(this.inputString);
    },

    parserAvailable: {
      immediate: true,
      handler (newVal) {
        switch (newVal) {
          case false:
            log('Downloading parser');
            break;
          case true:
            log('Parser available:', this.parser);
            break;
        }
      },
    },
  },

  methods: {
    convert (jsFileText) {
      // log(this.parser.parseScript, this.parser.parseModule);
      // log(this.parser.parseScript(jsFileText)); // TODO: Experiment with parsing with kataw.
      // log(this.parser.parseModule(jsFileText)); // TODO: Experiment with parsing with kataw.

      let outputString = jsFileText;

      let template = outputString.match(/(template)\s*\:\s+(\`(.|[\r\n])+\`\s*,[\r\n\s]*)/gm);

      if (template !== null) {
        // Always just use the first match
        template = template[0];

        outputString = outputString.replace(template, '');

        // log({ template, outputString });

        // Get rid of “template:”
        template = template.replace(/(template)\s*\:\s*/gm, '');

        // Get rid of whitespace
        template = template.trim();

        if (template.endsWith(',')) {
          // Get rid of comma at the end
          template = template.slice(0, -1);
        }

        // Get rid of template literal quotes
        template = template.slice(1, -1);

        // Indent every line with 2 spaces
        template = template.split('\n').map(line => `  ${line}`).join('\n');

        // TIL: putting a <script> closing inside a comment/string is actually interpreted as the parent script’s closing tag o_O
        outputString = `<template>\n${template}\n</template>\n\n<script>\n${outputString.trim().split('\n').map(line => `  ${line}`).join('\n')}\n</scr` + `ipt>`;

        // Find “export default someWord”
        const exportNames = Array.from(outputString.matchAll(/[\r\n\s]*export default (?<name>\w+);/gm));

        if (exportNames.length) {
          const exportName = exportNames[0]?.groups?.name;

          if (exportName) {
            // Remove export statement
            outputString = outputString.replace(exportNames[0][0], '');

            const re = new RegExp(`(const|let|var)[\\s\\r\\n]+(${exportName})[\\s\\r\\n]*\=[\\s\\r\\n]*`, 'gm');
            outputString = outputString.replace(re, 'export default ');
          }
        }
      }

      // Use prettier functions notation, but actually a bit out of scope for this tool.
      // outputString = outputString.replaceAll(/\:\s*(function)\s*\(\)\s*\{/g, ' () {');

      return outputString;
    },
  },

});

app.mount('#app');

await import('https://cdn.skypack.dev/kataw').then(mod => {
  parser.value = mod;
}).default;