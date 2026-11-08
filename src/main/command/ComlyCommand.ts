import { Command } from 'commander';
import { Nodelog } from '../../lib/Nodelog.js';
import { CommandAction } from '../types.js';
import { VerboseOpt } from '../opts/VerboseOpt.js';
import { ComlyCommandOpts } from './types.js';

export class ComlyCommand extends Command {
  constructor(name?: string) {
    super(name);
    this.log = new Nodelog();
    this.addOption(new VerboseOpt());
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

    await action.call(this, args);
  }
  return actionWrap;
}
