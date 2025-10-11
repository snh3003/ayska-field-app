// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'dist/*',
      'node_modules/*',
      'android/*',
      'ios/*',
      '.expo/*',
      'build/*',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // Unused variables - CRITICAL RULES
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],

      // Unused imports plugin rules
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // React-specific unused props and imports
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'off', // Not needed with React 17+
      'react/react-in-jsx-scope': 'off',

      // Unused destructured props - HELPFUL FOR CLEANUP
      'react/destructuring-assignment': ['warn', 'always'],

      // Unused function parameters
      'no-unused-expressions': 'error',

      // Import organization - AUTOMATIC CLEANUP (simplified)
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        },
      ],

      // Performance optimizations
      'react-hooks/exhaustive-deps': 'warn',

      // Additional strict rules for code quality
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
]);
