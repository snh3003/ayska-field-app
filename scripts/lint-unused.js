#!/usr/bin/env node

const { execSync } = require('child_process');

const _fs = require('fs');

const _path = require('path');

function checkUnusedImports() {
  // eslint-disable-next-line no-console
  console.log('🔍 Checking for unused imports...');
  try {
    execSync(
      'npx eslint . --ext .js,.jsx,.ts,.tsx --rule "unused-imports/no-unused-imports: error" --format=compact',
      {
        stdio: 'inherit',
        cwd: process.cwd(),
      }
    );
    // eslint-disable-next-line no-console
    console.log('✅ No unused imports found');
    return true;
  } catch {
    // eslint-disable-next-line no-console
    console.log('❌ Unused imports found. Please fix them before committing.');
    return false;
  }
}

function checkUnusedVariables() {
  // eslint-disable-next-line no-console
  console.log('🔍 Checking for unused variables...');
  try {
    execSync(
      'npx eslint . --ext .js,.jsx,.ts,.tsx --rule "unused-imports/no-unused-vars: warn" --format=compact',
      {
        stdio: 'inherit',
        cwd: process.cwd(),
      }
    );
    // eslint-disable-next-line no-console
    console.log('✅ No unused variables found');
    return true;
  } catch {
    // eslint-disable-next-line no-console
    console.log(
      '❌ Unused variables found. Please fix them before committing.'
    );
    return false;
  }
}

function checkUnusedExports() {
  // eslint-disable-next-line no-console
  console.log('🔍 Checking for unused exports...');
  try {
    execSync(
      'npx eslint . --ext .js,.jsx,.ts,.tsx --rule "import/no-unused-modules: error" --format=compact',
      {
        stdio: 'inherit',
        cwd: process.cwd(),
      }
    );
    // eslint-disable-next-line no-console
    console.log('✅ No unused exports found');
    return true;
  } catch {
    // eslint-disable-next-line no-console
    console.log('❌ Unused exports found. Please fix them before committing.');
    return false;
  }
}

function main() {
  // eslint-disable-next-line no-console
  console.log('🚀 Starting comprehensive unused items check...\n');

  const results = [
    checkUnusedImports(),
    checkUnusedVariables(),
    checkUnusedExports(),
  ];

  const allPassed = results.every(result => result);

  if (allPassed) {
    // eslint-disable-next-line no-console
    console.log('\n✅ All unused items checks passed!');
    process.exit(0);
  } else {
    // eslint-disable-next-line no-console
    console.log(
      '\n❌ Some unused items found. Please fix them before committing.'
    );
    process.exit(1);
  }
}

main();
