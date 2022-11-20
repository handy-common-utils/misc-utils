/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// These types are copied from @types/log, see: https://github.com/medikoo/log
interface MedikooLogFunction {
  (...args: any[]): void;
}
interface MedikooLogger {
  debug: MedikooLogFunction;
  notice: MedikooLogFunction;
  warning: MedikooLogFunction;
  error: MedikooLogFunction;
}

// eslint-disable-next-line valid-jsdoc
/**
 * A LineLogger logs/prints one entire line of text before advancing to another line.
 * This class is useful for encapsulating console.log/info/warn/error functions.
 * By having an abstraction layer, your code can switching to a different output with nearly no change.
 *
 * Please note that although the name contains "Logger", this class is not intended to be used as a generic logger.
 * It is intended for "logging for humans to read" scenario.
 *
 * `LineLogger.console()` and `LineLogger.consoleWithColour()` are ready to use convenient functions.
 * Or you can use the constructor to build your own wrappers.
 *
 * @example
 *
 * // Just a wrapper of console.log/info/warn/error
 * const consoleLogger = LineLogger.console();
 *
 * // Wrapper of console.log/info/warn/error but it mutes console.log
 * const lessVerboseConsoleLogger = LineLogger.console({debug: false});
 *
 * // Wrapper of console.log/info/warn/error but it mutes console.log and console.info
 * const lessVerboseConsoleLogger = LineLogger.console({quiet: true});
 *
 * // use chalk (chalk is not a dependency of this package, you need to add chalk as a dependency separately)
 * import chalk from 'chalk';
 * // this.flags is an object with properties "debug" and "quiet"
 * this.output = LineLogger.consoleWithColour(this.flags, chalk);
 * this.output.warn('Configuration file not found, default configuration would be used.');  // it would be printed out in yellow
 */
export class LineLogger<DEBUG_FUNC extends Function, INFO_FUNC extends Function, WARN_FUNC extends Function, ERROR_FUNC extends Function> {
  protected static NO_OP_FUNC = function () {};

  /**
   * Build an instance with console.log/info/warn/error.
   * @param flags           The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled.
   * Values of those fields are evaluated only once within this function.
   * They are not evaluated when debug/info/warn/error functions are called.
   * @param debugFlagName   Name of the debug field in the flags object
   * @param quietFlagName   Name of the quiet field in the flags object
   * @returns An instance that uses console.log/info/warn/error.
   */
  static console<FLAGS extends Record<string, any>>(flags: FLAGS = {} as any, debugFlagName: keyof FLAGS = 'debug', quietFlagName: keyof FLAGS = 'quiet') {
    return new LineLogger(console.log, console.info, console.warn, console.error, flags[debugFlagName], flags[quietFlagName]);
  }

  /**
   * Build an instance with console.log/info/warn/error and chalk/colors/cli-color.
   * This package does not depend on chalk or colors or cli-color,
   * you need to add them as dependencies separately.
   *
   * @param flags           The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled.
   * Values of those fields are evaluated only once within this function.
   * They are not evaluated when debug/info/warn/error functions are called.
   * @param colourer              Supplier of the colouring function, such as chalk or colors or cli-color
   * @param debugColourFuncName   Name of the function within colourer that will be used to add colour to debug messages, or null if colouring is not desired.
   * @param infoColourFuncName    Name of the function within colourer that will be used to add colour to info messages, or null if colouring is not desired.
   * @param warnColourFuncName    Name of the function within colourer that will be used to add colour to warn messages, or null if colouring is not desired.
   * @param errorColourFuncName   Name of the function within colourer that will be used to add colour to error messages, or null if colouring is not desired.
   * @param debugFlagName   Name of the debug field in the flags object
   * @param quietFlagName   Name of the quiet field in the flags object
   * @returns An instance that uses console.log/info/warn/error and also adds colour to the messages using chalk/colors/cli-color.
   */
  static consoleWithColour<FLAGS extends Record<string, any>, COLOURER extends Record<string, any>>(flags: FLAGS,
    // eslint-disable-next-line default-param-last
    colourer: COLOURER, debugColourFuncName: keyof COLOURER = 'grey', infoColourFuncName?: keyof COLOURER | undefined, warnColourFuncName: keyof COLOURER = 'yellow', errorColourFuncName: keyof COLOURER = 'red',
    debugFlagName: keyof FLAGS = 'debug', quietFlagName: keyof FLAGS = 'quiet',
  ) {
    return new LineLogger(
      // debug
      (message?: any, ...optionalParams: any[]) => {
        console.log(debugColourFuncName == null || typeof message !== 'string' ? message : (colourer[debugColourFuncName] as any as Function)(message), ...optionalParams);
      },
      // info
      (message?: any, ...optionalParams: any[]) => {
        console.info(infoColourFuncName == null || typeof message !== 'string' ? message : (colourer[infoColourFuncName] as any as Function)(message), ...optionalParams);
      },
      // warn
      (message?: any, ...optionalParams: any[]) => {
        console.warn(warnColourFuncName == null || typeof message !== 'string' ? message : (colourer[warnColourFuncName] as any as Function)(message), ...optionalParams);
      },
      // error
      (message?: any, ...optionalParams: any[]) => {
        console.error(errorColourFuncName == null || typeof message !== 'string' ? message : (colourer[errorColourFuncName] as any as Function)(message), ...optionalParams);
      },
      flags[debugFlagName],
      flags[quietFlagName],
    );
  }

  /**
   * Build an instance from 'log' (https://github.com/medikoo/log).
   * `info` of the LineLogger is mapped to `notice` of the medikoo log.
   * @param log instance of the logger
   * @returns instance of LineLogger that is actually ConsoleLineLogger type
   */
  static consoleLike(log: MedikooLogger) {
    return new LineLogger(
      // debug
      (message?: any, ...optionalParams: any[]) => {
        log.debug(message, ...optionalParams);
      },
      // info
      (message?: any, ...optionalParams: any[]) => {
        log.notice(message, ...optionalParams);
      },
      // warn
      (message?: any, ...optionalParams: any[]) => {
        log.warning(message, ...optionalParams);
      },
      // error
      (message?: any, ...optionalParams: any[]) => {
        log.error(message, ...optionalParams);
      },
      true,
      false,
    );
  }

  info: INFO_FUNC = LineLogger.NO_OP_FUNC as any;
  debug: DEBUG_FUNC = LineLogger.NO_OP_FUNC as any;
  warn: WARN_FUNC = LineLogger.NO_OP_FUNC as any;
  error: ERROR_FUNC = LineLogger.NO_OP_FUNC as any;

  /**
   * Constructor
   * @param debugFunction   function for outputting debug information
   * @param infoFunction    function for outputting info information
   * @param warnFunction    function for outputting warn information
   * @param errorFunction   function for outputting error information
   * @param isDebug         is debug output enabled or not, it could be overriden by isQuiet
   * @param isQuiet         is quiet mode enabled or not. When quiet mode is enabled, both debug and info output would be discarded.
   */
  constructor(debugFunction: DEBUG_FUNC, infoFunction: INFO_FUNC, warnFunction: WARN_FUNC, errorFunction: ERROR_FUNC,
              public isDebug: boolean = false, public isQuiet: boolean = false,
  ) {
    if (isDebug === true && isQuiet !== true) {
      this.debug = debugFunction;
    }
    if (isQuiet !== true) {
      this.info = infoFunction;
    }
    this.warn = warnFunction;
    this.error = errorFunction;
  }
}

/**
 * Type of the object returned by `LineLogger.console()` or `LineLogger.consoleWithColour()`.
 * It has the same function signatures as console.log/info/warn/error.
 */
export type ConsoleLineLogger = ReturnType<typeof LineLogger.console>;

/**
 * Build an encapsulation of console output functions with console.log/info/warn/error.
 * @param flags           The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled.
 * Values of those fields are evaluated only once within this function.
 * They are not evaluated when debug/info/warn/error functions are called.
 * @param debugFlagName   Name of the debug field in the flags object
 * @param quietFlagName   Name of the quiet field in the flags object. Quiet flag can override debug flag.
 * @returns An LineLogger instance that uses console.log/info/warn/error.
 */
export const consoleWithoutColour = LineLogger.console;

/**
 * Build an encapsulation of console output functions with console.log/info/warn/error and chalk/colors/cli-color.
 * @param flags           The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled.
 * Values of those fields are evaluated only once within this function.
 * They are not evaluated when debug/info/warn/error functions are called.
 * @param colourer              Supplier of the colouring function, such as chalk or colors or cli-color
 * @param debugColourFuncName   Name of the function within colourer that will be used to add colour to debug messages, or null if colouring is not desired.
 * @param infoColourFuncName    Name of the function within colourer that will be used to add colour to info messages, or null if colouring is not desired.
 * @param warnColourFuncName    Name of the function within colourer that will be used to add colour to warn messages, or null if colouring is not desired.
 * @param errorColourFuncName   Name of the function within colourer that will be used to add colour to error messages, or null if colouring is not desired.
 * @param debugFlagName   Name of the debug field in the flags object
 * @param quietFlagName   Name of the quiet field in the flags object. Quiet flag can override debug flag.
 * @returns An LineLogger instance that uses console.log/info/warn/error and also adds colour to the messages using chalk/colors/cli-color.
*/
export const consoleWithColour = LineLogger.consoleWithColour;

/**
 * Build an instance from 'log' (https://github.com/medikoo/log).
 * `info` of the LineLogger is mapped to `notice` of the medikoo log.
 * @param log instance of the logger
 * @returns instance of LineLogger that is actually ConsoleLineLogger type
 */
export const consoleLike = LineLogger.consoleLike;
