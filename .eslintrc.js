module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@fonkel/eslint-config-fonkel',
  ],
  rules: {
    'vue/attribute-hyphenation': ['warn', 'never', {}],
    'vue/html-self-closing': ['error', {
      html: {
        void: 'always',
        normal: 'never',
        component: 'always',
      },
      svg: 'any',
    }],
    'vue/html-closing-bracket-spacing': ['warn', {
      selfClosingTag: 'never',
    }],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: 2,
      multiline: {
        max: 1,
        allowFirstLine: false,
      },
    }],
    'vue/script-indent': ['error', 2, {
      baseIndent: 1,
      switchCase: 1,
      ignores: [],
    }],
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'off',
      },
    },
  ],
};
