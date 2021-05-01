<template>
  <section class="js-file">
    <p><strong>Paste your .js file here</strong></p>
    <textarea
      v-model="input"
      :placeholder="inputPlaceholder"
    ></textarea>
  </section>

  <section class="vue-file">
    <p><strong>...and your .vue file will appear here <img src="https://openmoji.org/data/color/svg/1F916.svg" height="34"/></strong></p>
    <textarea
      readonly
      v-model="output"
      :placeholder="outputPlaceholder"
    ></textarea>
  </section>
</template>

<script setup>
  import { useParser } from './modules/parser.js';
  const { parser, parserAvailable } = useParser();
</script>

<script>
  import exampleFile from './assets/example-file.js?raw';

  export default {

    data () {
      return {
        input: '',
        inputPlaceholder: exampleFile,
        output: '',
        outputPlaceholder: this.convert(exampleFile),
      };
    },

    watch: {
      input () {
        this.output = this.convert(this.input);
      },
    },

    methods: {
      convert (jsFileText) {
        // log(this.parser.parseScript, this.parser.parseModule);
        // log(this.parser.parseScript(jsFileText)); // TODO: Experiment with parsing with kataw.
        // log(this.parser.parseModule(jsFileText)); // TODO: Experiment with parsing with kataw.

        let output = jsFileText;

        let template = output.match(/(template)\s*\:\s+(\`(.|[\r\n])+\`\s*,[\r\n\s]*)/gm);

        if (template !== null) {
          // Always just use the first match
          template = template[0];

          output = output.replace(template, '');

          // log({ template, output });

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
          output = `<template>\n${template}\n</template>\n\n<script>\n${output.trim().split('\n').map(line => `  ${line}`).join('\n')}\n</scr` + `ipt>`;

          // Find “export default someWord”
          const exportNames = Array.from(output.matchAll(/[\r\n\s]*export default (?<name>\w+);/gm));

          if (exportNames.length) {
            const exportName = exportNames[0]?.groups?.name;

            if (exportName) {
              // Remove export statement
              output = output.replace(exportNames[0][0], '');

              const re = new RegExp(`(const|let|var)[\\s\\r\\n]+(${exportName})[\\s\\r\\n]*\=[\\s\\r\\n]*`, 'gm');
              output = output.replace(re, 'export default ');
            }
          }
        }

        // Use prettier functions notation, but actually a bit out of scope for this tool.
        // output = output.replaceAll(/\:\s*(function)\s*\(\)\s*\{/g, ' () {');

        return output;
      },
    },
  };
</script>

<style>
  * {
    box-sizing: border-box;
  }

  :root {
    --color-1-h: 153;
    --color-1-s: 48%;
    --color-1-l: 49%;
    --color-2-h: 210;
    --color-2-s: 29%;
    --color-2-l: 29%;
  }

  html, body {
    height: 100%;
  }

  body {
    padding: 90px 40px 40px;
    margin: 0;
    font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
    background-color: hsl(240, 4%, 11%);
    /* background-color: hsl(var(--color-2-h), 3%, 6%); */
    color: hsl(var(--color-1-h), var(--color-1-s), var(--color-1-l));
  }

  #app {
    margin: 0 auto;
    min-height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 50px;
    width: 100%;
  }

  section {
    display: flex;
    align-items: stretch;
    position: relative;
  }

  section p {
    position: absolute;
    bottom: calc(100% + 16px);
    margin: 0;
    font-size: 23px;
  }

  section p img {
    position: absolute;
    transform: translate(4px, -1px);
  }

  textarea {
    width: 100%;
    flex: 1 1 auto;
    font-family: "Droid Sans Mono", Consolas, "SF Mono", monospace;
    line-height: 1.3;
    padding: 12px 9px;
    background-color: #222225;
    color: white;
    border-radius: 4px;
    border: 2px solid hsla(var(--color-1-h), 100%, 90%, 0.2);
    transition: all .15s cubic-bezier(0.340, -0.015, 0.115, 0.945);
    box-shadow: inset 0 0 5px -1px rgba(0, 0, 0, 0.2);
  }

  textarea:focus {
    border: 2px solid hsla(var(--color-1-h), 100%, 84%, 0.6);
    outline: none;
    box-shadow: inset 0 0 5px -1px rgba(0, 0, 0, 0.2), 0 0 30px 0 hsla(var(--color-1-h), 100%, 60%, 0.4);
  }
</style>
