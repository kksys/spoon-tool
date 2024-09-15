import { Linter, Rule } from 'eslint'

declare module 'eslint-plugin-react' {
  interface EsLintPluginReact {
    deprecatedRules: Record<string | number | symbol, unknown>
    rules: Record<string, Rule.RuleModule>
    configs: {
      recommended: {
        plugins: { react: EsLintPluginReact }
        parserOptions: EsLintPluginReact['rules']['parserOptions']
        rules: Record<string, Linter.RuleEntry>
      }
      all: {
        plugins: { react: EsLintPluginReact }
        parserOptions: EsLintPluginReact['rules']['parserOptions']
        rules: Record<string, 2>
      }
      'jsx-runtime': {
        plugins: { react: EsLintPluginReact }
        parserOptions: EsLintPluginReact['rules']['parserOptions']
        rules: Record<string, Linter.RuleEntry>
      }
      flat: {
        recommended: {
          plugins: { react: EsLintPluginReact }
          rules: EsLintPluginReact['configs']['recommended']['rules']
          languageOptions: {
            parserOptions: EsLintPluginReact['configs']['recommended']['parserOptions']
          }
        }
        all: {
          plugins: { react: EsLintPluginReact }
          rules: EsLintPluginReact['configs']['all']['rules']
          languageOptions: {
            parserOptions: EsLintPluginReact['configs']['all']['parserOptions']
          }
        }
        'jsx-runtime': {
          plugins: { react: EsLintPluginReact }
          rules: EsLintPluginReact['configs']['jsx-runtime']['rules']
          languageOptions: {
            parserOptions: EsLintPluginReact['configs']['jsx-runtime']['parserOptions']
          }
        }
      }
    }
  }

  declare const plugin: EsLintPluginReact
  export default plugin
}
