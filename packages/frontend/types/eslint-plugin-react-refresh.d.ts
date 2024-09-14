import { Linter } from 'eslint'

declare module 'eslint-plugin-react-refresh' {
  const rules: Record<string, Linter.RuleModule>

  export { rules }
}
