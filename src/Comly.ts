import { Command } from 'commander';

export class Comly extends Command {
  public run() {
    // @ts-ignore
    console.log('===_name', this._name);
    this.parse(process.argv);
  }
}
