import { loadConfig } from './config';
import { execCommand } from '../../utils/common';

export async function showHelp(
  log: (..._args: unknown[]) => unknown = console.log
): Promise<string> {
  const helpText = `Claude LSP CLI - File-based diagnostics for Claude Code

Usage: claude-lsp-cli <command> [args]

Commands:
  hook <event>             Handle Claude Code hook events
  check <file>             Check individual file for errors/warnings
  disable <language>       Disable language checking globally (e.g. disable scala)
  enable <language>        Enable language checking globally (e.g. enable scala)
  help                     Show this help message
`;
  const status = await showStatus();
  const fullMessage = helpText + status;

  if (log) {
    log(fullMessage);
  }
  return fullMessage;
}

export async function showStatus(
  log: (..._args: unknown[]) => unknown = console.log
): Promise<string> {
  // Check if there's a config file and read disabled languages
  const disabledLanguages = new Set<string>();
  let globalDisabled = false;

  try {
    const config = loadConfig();
    globalDisabled = config.disable === true;
    if (config.disableScala === true) disabledLanguages.add('Scala');
    if (config.disableTypeScript === true) disabledLanguages.add('TypeScript');
    if (config.disablePython === true) disabledLanguages.add('Python');
    if (config.disableGo === true) disabledLanguages.add('Go');
    if (config.disableRust === true) disabledLanguages.add('Rust');
    if (config.disableJava === true) disabledLanguages.add('Java');
    if (config.disableCpp === true) disabledLanguages.add('C/C++');
    if (config.disablePhp === true) disabledLanguages.add('PHP');
    if (config.disableLua === true) disabledLanguages.add('Lua');
    if (config.disableElixir === true) disabledLanguages.add('Elixir');
    if (config.disableTerraform === true) disabledLanguages.add('Terraform');
    if (config.disableZig === true) disabledLanguages.add('Zig');
  } catch {
    // Ignore config parsing errors
  }

  const messages: string[] = [];
  messages.push(`
Current Status:
`);

  if (globalDisabled) {
    messages.push('  🚫 All language checking is DISABLED via config');
  }

  // Check which language tools are available (matching actual file checker commands)
  const languages = [
    {
      name: 'TypeScript',
      code: 'typescript',
      command: 'tsc',
      versionArg: '--version',
      install: 'npm install -g typescript',
    },
    {
      name: 'Python',
      code: 'python',
      command: 'pyright',
      versionArg: '--version',
      install: 'npm install -g pyright',
    },
    {
      name: 'Go',
      code: 'go',
      command: 'go',
      versionArg: 'version',
      install: 'Install Go from https://golang.org',
    },
    {
      name: 'Rust',
      code: 'rust',
      command: 'rustc',
      versionArg: '--version',
      install: 'Install Rust from https://rustup.rs',
    },
    {
      name: 'Java',
      code: 'java',
      command: 'javac',
      versionArg: '-version',
      install: 'Install Java JDK',
    },
    {
      name: 'C/C++',
      code: 'cpp',
      command: 'gcc',
      versionArg: '--version',
      install: 'Install GCC or Clang',
    },
    { name: 'PHP', code: 'php', command: 'php', versionArg: '--version', install: 'Install PHP' },
    {
      name: 'Scala',
      code: 'scala',
      command: 'scalac',
      versionArg: '-version',
      install: 'Install Scala',
    },
    { name: 'Lua', code: 'lua', command: 'luac', versionArg: '-v', install: 'Install Lua' },
    {
      name: 'Elixir',
      code: 'elixir',
      command: 'elixir',
      versionArg: '--version',
      install: 'Install Elixir',
    },
    {
      name: 'Terraform',
      code: 'terraform',
      command: 'terraform',
      versionArg: 'version',
      install: 'Install Terraform',
    },
    {
      name: 'Zig',
      code: 'zig',
      command: 'zig',
      versionArg: 'version',
      install: 'Install Zig from https://ziglang.org',
    },
  ];

  // Check all languages in parallel, then display in order
  const checks = languages.map(async (lang) => {
    try {
      // Use utility function to prevent zombies
      const { exitCode } = await execCommand([lang.command, lang.versionArg]);
      return {
        name: lang.name,
        code: lang.code,
        available: exitCode === 0,
        install: lang.install,
      };
    } catch {
      return {
        name: lang.name,
        code: lang.code,
        available: false,
        install: lang.install,
      };
    }
  });

  const results = await Promise.all(checks);

  // Display results in original order
  for (const result of results) {
    const isDisabled = globalDisabled || disabledLanguages.has(result.name);

    if (isDisabled) {
      messages.push(`  🚫 ${result.name} (${result.code}): DISABLED via config`);
    } else if (result.available) {
      messages.push(`  ✅ ${result.name} (${result.code}): Available`);
    } else {
      messages.push(`  ❌ ${result.name} (${result.code}): Not found - ${result.install}`);
    }
  }

  const fullMessage = messages.join('\n');
  if (log) {
    log(fullMessage);
  }
  return fullMessage;
}
