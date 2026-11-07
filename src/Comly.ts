import { Command } from 'commander';

export class Comly extends Command {
  public run() {
    this.parse(process.argv);
  }
}
