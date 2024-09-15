import { Linter, Rule } from 'eslint'

declare const configs: Linter.Config[]
declare const rules: Record<string, Rule.RuleModule>

export default { configs, rules }
