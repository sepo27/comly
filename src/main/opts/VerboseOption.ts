import { Option } from 'commander';

export class VerboseOption extends Option {
  constructor() {
    super('-v,--verbose', 'Verbose (useful with Nodelog)');
    this.default(0);
    this.argParser(this.parse.bind(this));
  }

  private parse(_: number, prevVal: number): number {
    return prevVal + 1;
  }
}
