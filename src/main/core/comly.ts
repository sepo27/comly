import { Command } from 'commander';
import { styleText } from 'node:util';
import * as process from 'node:process';

export const comly = (): ComlyRootCommand => new ComlyRootCommand()
  .name(styleText(['bold'], './cli'))
  .usage(styleText('bold', '[command] [opts...]'));

/*** Private ***/

/**
 * Separate class for root command to resolve options propertly.
 * (I.e. if same ComlyCommand with default VerboseOption added in booth root and as sub-command, verbose option parsing doesn't work).
 */
class ComlyRootCommand extends Command {
  public run() {
    if (process.argv.length < 3) {
      this.help();
    }
    this.parse(process.argv);
  }
}
