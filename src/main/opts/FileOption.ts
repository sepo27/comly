import { InvalidOptionArgumentError, Option } from 'commander';
import fs from 'node:fs';

export class FileOption extends Option {
  constructor(flags: string, description?: string) {
    super(flags, description);
    this.argParser(this.parse.bind(this));
  }

  protected parse(val: any): any {
    if (val && typeof val === 'string') {
      let errMessage;

      if (!fs.existsSync(val)) {
        errMessage = 'File does not exist';
      } else if (!fs.statSync(val).isFile()) {
        errMessage = 'Not a file';
      }

      if (errMessage) {
        throw new InvalidOptionArgumentError(errMessage);
      }

      return val;
    }

    throw new InvalidOptionArgumentError('invalid value');
  }
}
