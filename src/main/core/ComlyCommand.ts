import { Command } from 'commander';
import { Nodelog } from '../../lib/Nodelog.js';
import { CommandAction } from '../types.js';
import { VerboseOption } from '../opts/VerboseOption.js';
import { ComlyCommandOpts } from './types.js';

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
