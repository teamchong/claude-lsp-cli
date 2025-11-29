/**
 * Zig Language Checker Configuration
 */

import { existsSync } from 'fs';
import { join } from 'path';
import type { LanguageConfig } from '../language-checker-registry';
import type { DiagnosticResult } from '../types/DiagnosticResult';

export const zigConfig: LanguageConfig = {
  name: 'Zig',
  tool: 'zig',
  extensions: ['.zig'],
  localPaths: [], // Zig is usually system-installed

  detectConfig: (_projectRoot: string) => {
    return existsSync(join(_projectRoot, 'build.zig'));
  },

  buildArgs: (file: string, _projectRoot: string, _toolCommand: string, _context?: any) => {
    // Use zig ast-check for fast syntax/semantic checking without full compilation
    return ['ast-check', file];
  },

  parseOutput: (_stdout: string, stderr: string, _file: string, _projectRoot: string) => {
    const diagnostics: DiagnosticResult[] = [];
    const lines = stderr.split('\n');

    for (const line of lines) {
      // Zig error format: file.zig:line:column: error: message
      const match = line.match(/^.+?:(\d+):(\d+): (error|warning|note): (.+)$/);
      if (match && match[1] && match[2] && match[3] && match[4]) {
        const severityStr = match[3];
        let severity: 'error' | 'warning' | 'info' = 'error';
        if (severityStr === 'warning') severity = 'warning';
        if (severityStr === 'note') severity = 'info';

        diagnostics.push({
          line: parseInt(match[1]),
          column: parseInt(match[2]),
          severity,
          message: match[4],
        });
      }
    }

    return diagnostics;
  },
};
