#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * 
 * Validates that all required environment variables are present
 * for both development and production environments.
 * 
 * Usage:
 *   pnpm check:env
 *   node scripts/check-env.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Required environment variables by category
const requiredEnvVars = {
  supabase: {
    title: 'Supabase Configuration',
    vars: [
      {
        name: 'VITE_SUPABASE_URL',
        description: 'Supabase project URL',
        example: 'https://your-project.supabase.co',
        required: true
      },
      {
        name: 'VITE_SUPABASE_ANON_KEY',
        description: 'Supabase anonymous/public key',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        required: true
      },
      {
        name: 'SUPABASE_PROJECT_ID',
        description: 'Supabase project ID (for type generation)',
        example: 'abcdefghijklmnopqrst',
        required: false,
        note: 'Required for pnpm supabase:types command'
      }
    ]
  },
  development: {
    title: 'Development & Debugging',
    vars: [
      {
        name: 'VITE_APP_ENV',
        description: 'Application environment',
        example: 'development',
        required: false,
        allowedValues: ['development', 'staging', 'production']
      },
      {
        name: 'VITE_ROUTES_DEBUG',
        description: 'Enable route debugging',
        example: 'true',
        required: false,
        allowedValues: ['true', 'false']
      }
    ]
  }
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function loadEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const env = {};
    
    content.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#') && line.includes('=')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        env[key.trim()] = value;
      }
    });
    
    return env;
  } catch (error) {
    return null;
  }
}

function checkEnvironment() {
  console.log(colorize('\n🔍 Verde Environment Validation\n', 'cyan'));
  
  // Check for .env files
  const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
  const foundEnvFiles = [];
  
  envFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      foundEnvFiles.push(file);
    }
  });
  
  if (foundEnvFiles.length === 0) {
    console.log(colorize('⚠️  No .env files found!', 'yellow'));
    console.log(colorize('   Copy .env.example to .env and configure your environment variables.\n', 'white'));
  } else {
    console.log(colorize(`📁 Found env files: ${foundEnvFiles.join(', ')}\n`, 'blue'));
  }
  
  // Load environment variables from all sources
  const allEnvVars = { ...process.env };
  
  // Also load from .env files for validation
  foundEnvFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    const fileEnv = loadEnvFile(filePath);
    if (fileEnv) {
      Object.assign(allEnvVars, fileEnv);
    }
  });
  
  let hasErrors = false;
  let hasWarnings = false;
  
  // Validate each category
  Object.entries(requiredEnvVars).forEach(([categoryKey, category]) => {
    console.log(colorize(`📋 ${category.title}`, 'magenta'));
    console.log(colorize('─'.repeat(category.title.length + 3), 'magenta'));
    
    category.vars.forEach(varConfig => {
      const value = allEnvVars[varConfig.name];
      const hasValue = value && value.trim() !== '';
      
      if (varConfig.required && !hasValue) {
        console.log(colorize(`❌ ${varConfig.name}`, 'red'));
        console.log(colorize(`   Missing required variable: ${varConfig.description}`, 'white'));
        console.log(colorize(`   Example: ${varConfig.example}`, 'white'));
        if (varConfig.note) {
          console.log(colorize(`   Note: ${varConfig.note}`, 'yellow'));
        }
        hasErrors = true;
      } else if (!hasValue) {
        console.log(colorize(`⚠️  ${varConfig.name}`, 'yellow'));
        console.log(colorize(`   Optional: ${varConfig.description}`, 'white'));
        if (varConfig.note) {
          console.log(colorize(`   Note: ${varConfig.note}`, 'yellow'));
        }
        hasWarnings = true;
      } else {
        // Check allowed values if specified
        if (varConfig.allowedValues && !varConfig.allowedValues.includes(value)) {
          console.log(colorize(`⚠️  ${varConfig.name}`, 'yellow'));
          console.log(colorize(`   Invalid value "${value}". Allowed: ${varConfig.allowedValues.join(', ')}`, 'white'));
          hasWarnings = true;
        } else {
          console.log(colorize(`✅ ${varConfig.name}`, 'green'));
          // Mask sensitive values
          const displayValue = varConfig.name.includes('KEY') || varConfig.name.includes('SECRET')
            ? `${value.substring(0, 8)}...`
            : value;
          console.log(colorize(`   ${displayValue}`, 'white'));
        }
      }
    });
    
    console.log('');
  });
  
  // Additional checks
  console.log(colorize('🔧 Additional Checks', 'magenta'));
  console.log(colorize('─'.repeat(18), 'magenta'));
  
  // Check for NEXT_PUBLIC_ alternative variables
  const hasViteSupabaseUrl = allEnvVars['VITE_SUPABASE_URL'];
  const hasNextSupabaseUrl = allEnvVars['NEXT_PUBLIC_SUPABASE_URL'];
  const hasViteSupabaseAnon = allEnvVars['VITE_SUPABASE_ANON_KEY'];
  const hasNextSupabaseAnon = allEnvVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  
  if (!hasViteSupabaseUrl && hasNextSupabaseUrl) {
    console.log(colorize('ℹ️  Using NEXT_PUBLIC_SUPABASE_URL as fallback', 'blue'));
  }
  
  if (!hasViteSupabaseAnon && hasNextSupabaseAnon) {
    console.log(colorize('ℹ️  Using NEXT_PUBLIC_SUPABASE_ANON_KEY as fallback', 'blue'));
  }
  
  // Check .env.example existence
  const envExamplePath = path.join(rootDir, '.env.example');
  if (fs.existsSync(envExamplePath)) {
    console.log(colorize('✅ .env.example exists', 'green'));
  } else {
    console.log(colorize('⚠️  .env.example not found', 'yellow'));
    hasWarnings = true;
  }
  
  // Summary
  console.log(colorize('\n📊 Summary', 'cyan'));
  console.log(colorize('─'.repeat(9), 'cyan'));
  
  if (hasErrors) {
    console.log(colorize('❌ Environment validation failed!', 'red'));
    console.log(colorize('   Fix the missing required variables above.', 'white'));
    process.exit(1);
  } else if (hasWarnings) {
    console.log(colorize('⚠️  Environment validation passed with warnings', 'yellow'));
    console.log(colorize('   Consider addressing the warnings above.', 'white'));
    process.exit(0);
  } else {
    console.log(colorize('✅ Environment validation passed!', 'green'));
    console.log(colorize('   All required variables are properly configured.', 'white'));
    process.exit(0);
  }
}

// Additional utility: Check if Supabase CLI is available
async function checkSupabaseCLI() {
  try {
    const { execSync } = await import('child_process');
    execSync('supabase --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Help command
function showHelp() {
  console.log(colorize('\n🌿 Verde Environment Checker', 'green'));
  console.log(colorize('\nUsage:', 'cyan'));
  console.log('  pnpm check:env          # Validate environment variables');
  console.log('  node scripts/check-env.mjs --help  # Show this help\n');
  
  console.log(colorize('About:', 'cyan'));
  console.log('  This script validates that all required environment variables');
  console.log('  are properly configured for Verde development and deployment.\n');
  
  console.log(colorize('Environment Files:', 'cyan'));
  console.log('  The script checks for: .env, .env.local, .env.development, .env.production');
  console.log('  Variables can use either VITE_ or NEXT_PUBLIC_ prefixes.\n');
  
  console.log(colorize('Exit Codes:', 'cyan'));
  console.log('  0 - All checks passed');
  console.log('  1 - Required variables missing (build will fail)\n');
}

// Command line handling
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  showHelp();
} else {
  checkEnvironment();
}