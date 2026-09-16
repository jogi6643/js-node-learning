// ==========================================================================
// In-Browser Code Sandbox & Output Console
// Safely captures console.log and errors for real-time snippet evaluation
// ==========================================================================

export class CodeSandbox {
  static run(codeString) {
    const logs = [];
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    try {
      console.log = (...args) => {
        logs.push(args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg))).join(' '));
      };
      console.error = (...args) => {
        logs.push('[Error] ' + args.map(arg => String(arg)).join(' '));
      };
      console.warn = (...args) => {
        logs.push('[Warn] ' + args.map(arg => String(arg)).join(' '));
      };

      // Strip ES6 import/export syntax for safe eval in sandbox context
      const cleanCode = codeString
        .replace(/import\s+.*?from\s+['"].*?['"];?/g, '// import bypassed in sandbox')
        .replace(/export\s+(default\s+)?/g, '');

      // Execute code in function scope
      const runner = new Function(cleanCode);
      const result = runner();
      if (result !== undefined) {
        logs.push('[Return] ' + (typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)));
      }
    } catch (err) {
      logs.push('[Runtime Exception] ' + err.name + ': ' + err.message);
    } finally {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    }

    return logs.length > 0 ? logs.join('\n') : '// Code executed with no console output';
  }
}
