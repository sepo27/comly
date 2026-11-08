import { Command, ParseOptionsResult } from 'commander';
import { Nodelog } from '../../lib/Nodelog.ts';
import { CommandAction } from '../types.ts';
import { VerboseOption } from '../opts/VerboseOption.ts';
import { ComlyCommandOpts } from './types.ts';

export class ComlyCommand extends Command {
  constructor(name?: string) {
    super(name);
    this.log = new Nodelog();
    this.addOption(new VerboseOption());
  }

  /*** Public ***/

  public readonly log: Nodelog;

  public action(fn: CommandAction<this>): this {
    super.action(makeActionWrap(fn).bind(this));
    return this;
  }

  /**
   * Overwrite to fix problem with options applied to both parent and child.
   * TODO: This fix needs to be proven.
   *
   * @param argv
   */
  public parseOptions(argv: string[]): ParseOptionsResult {
    const res = super.parseOptions(argv);
    // @ts-ignore
    this._optionValues = { ...this._optionValues, ...this.parent._optionValues };
    return res;
  }
}

/*** Private ***/

function makeActionWrap(action: CommandAction<typeof this>): CommandAction<ComlyCommand> {
  async function actionWrap(this: ComlyCommand, args: any[]) {
    const commonOpts = this.opts<ComlyCommandOpts>();
    this.log.setVerbosityLevel(commonOpts.verbose);

    try {
      await action.call(this, args);
    } catch (err) {
      this.log.error(err.message);
      this.log.debug(err.stack);
    }
  }
  return actionWrap;
}
