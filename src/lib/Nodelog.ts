import { Console } from 'console';
import { styleText } from 'node:util';

enum Level {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  LOG = 'log',
  DEBUG = 'debug',
}
export { Level as NodelogLevel };

type VerbosityScale = (Level | Level[])[];

interface Options {
  prefix?: string
  verbosityScale?: VerbosityScale
}

const styles = {
  [Level.INFO]: message => styleText('green', message),
  [Level.WARN]: message => styleText('yellow', message),
  [Level.ERROR]: message => styleText('red', message),
  [Level.LOG]: message => styleText('gray', message),
  [Level.DEBUG]: message => styleText('dim', message),
};

const defaultVerbosityScale: VerbosityScale = [Level.LOG, Level.DEBUG];

export class Nodelog extends Console implements Console {
  constructor(opts: Options = {}) {
    super(process.stdout, process.stderr);

    // Wrap log levels to support respective features
    const allLevels = Object.values(Level);
    for (let i = 0; i < allLevels.length; i++) {
      const
        level = allLevels[i],
        levelMethod = this[level];

      Object.assign(this, {
        [level]: function(this: Nodelog, ...args) { // eslint-disable-line object-shorthand
          // Support for verbosity
          if (!this.isLevelVerbose(level)) {
            return;
          }

          const
            [origMessage, ...restArgs] = args,
            messageParts = [`[${level.toUpperCase()}]`];

          if (opts.prefix) {
            messageParts.push(`[${opts.prefix}]`);
          }

          messageParts.push(origMessage);

          const
            styleMessage = styles[level] ? styles[level](messageParts.join(' ')) : messageParts.join(' '),
            methodArgs = [styleMessage, ...restArgs];

          levelMethod.apply(this, methodArgs);
        },
      });
    }

    this.verbosityScale = opts.verbosityScale || defaultVerbosityScale;
  }

  /*** Public ***/

  // TODO: use stdout ?
  public println() {
    console.log();
  }

  // TODO: use stdout ?
  public print(...args: string[]) {
    console.log(...args);
  }

  /**
   * @experimental
   */
  public separator() {
    if ((this.isLevelVerbose(Level.INFO) || this.isLevelVerbose(Level.WARN)) && this.verbosityLevel) {
      this.println();
    }
  }

  public setVerbosityMask(mask: Level[]): this {
    this.verbosityMask = mask;
    return this;
  }

  public setVerbosityLevel(level: number): this {
    this.verbosityLevel = level;
    return this;
  }

  public getVerbosityLevel(): number { return this.verbosityLevel; }

  public mute() { this.isMuted = true; }
  public unmute() { this.isMuted = false; }

  /*** Private ***/

  private verbosityMask: Level[] = [];
  private readonly verbosityScale: VerbosityScale = [];
  private verbosityLevel: number = 0;
  private isMuted: boolean = false;

  private isLevelVerbose(level: Level): boolean {
    if (this.verbosityMask.length) {
      return this.verbosityMask.includes(level);
    }

    if (this.verbosityScale.length) {
      const verbosityIdx = this.verbosityScale.findIndex(
        val => (Array.isArray(val) ? val.includes(level) : val === level),
      );
      return verbosityIdx < this.verbosityLevel;
    }

    return true;
  }
}
