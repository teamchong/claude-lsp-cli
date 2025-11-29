/**
 * Language Checker Registry Initialization
 *
 * This file registers all language configurations with the registry
 */

import { registerLanguage } from '../language-checker-registry';
import { typescriptConfig } from './typescript';
import { pythonConfig } from './python';
import { goConfig } from './go';
import { rustConfig } from './rust';
import { javaConfig } from './java';
import { cppConfig } from './cpp';
import { phpConfig } from './php';
import { scalaConfig } from './scala';
import { luaConfig } from './lua';
import { elixirConfig } from './elixir';
import { terraformConfig } from './terraform';
import { zigConfig } from './zig';

// Register all language configurations
registerLanguage(typescriptConfig.extensions, typescriptConfig);
registerLanguage(pythonConfig.extensions, pythonConfig);
registerLanguage(goConfig.extensions, goConfig);
registerLanguage(rustConfig.extensions, rustConfig);
registerLanguage(javaConfig.extensions, javaConfig);
registerLanguage(cppConfig.extensions, cppConfig);
registerLanguage(phpConfig.extensions, phpConfig);
registerLanguage(scalaConfig.extensions, scalaConfig);
registerLanguage(luaConfig.extensions, luaConfig);
registerLanguage(elixirConfig.extensions, elixirConfig);
registerLanguage(terraformConfig.extensions, terraformConfig);
registerLanguage(zigConfig.extensions, zigConfig);

// Export registry for use in file-checker
export { LANGUAGE_REGISTRY } from '../language-checker-registry';
