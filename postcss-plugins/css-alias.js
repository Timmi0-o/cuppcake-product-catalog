const path = require('path');

const PARAM_RE = /^(\s*)(['"])(.+?)\2(.*)$/s;
const TARGET_RULES = new Set(['import', 'reference', 'source']);

const matchesAlias = (importPath, aliasKey) =>
  importPath === aliasKey ||
  (aliasKey.endsWith('/')
    ? importPath.startsWith(aliasKey)
    : importPath.startsWith(`${aliasKey}/`));

module.exports = (opts = {}) => {
  const aliases = Object.entries(opts.aliases || {}).sort(
    ([a], [b]) => b.length - a.length,
  );

  return {
    postcssPlugin: 'postcss-css-alias',
    Once(root) {
      root.walkAtRules((atRule) => {
        if (!TARGET_RULES.has(atRule.name)) return;

        const match = atRule.params.match(PARAM_RE);
        if (!match) return;

        const [, leading, quote, importPath, rest] = match;

        const matched = aliases.find(([key]) => matchesAlias(importPath, key));
        if (!matched) return;

        const [aliasKey, aliasTarget] = matched;
        const fromFile = atRule.source?.input.from;
        if (!fromFile) return;

        const absolute = path.resolve(
          aliasTarget,
          importPath.slice(aliasKey.length),
        );
        let rel = path.relative(path.dirname(fromFile), absolute);
        if (!rel.startsWith('.')) rel = `./${rel}`;

        atRule.params = `${leading}${quote}${rel}${quote}${rest}`;
      });
    },
  };
};

module.exports.postcss = true;
