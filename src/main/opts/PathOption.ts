import { InvalidOptionArgumentError, Option } from 'commander';
import fs from 'node:fs';

export interface PathOptionParsed {
  path: string
  type: PathOptionType
}

export type PathOptionType = 'file' | 'directory';

export class PathOption extends Option {
  constructor(flags: string, description?: string) {
    super(flags, description);
    this.argParser(this.parse.bind(this));
  }

  protected parse(val: any): PathOptionParsed {
    if (val && typeof val === 'string') {
      if (!fs.existsSync(val)) {
        throw new InvalidOptionArgumentError('Path does not exist');
      }

      let type;
      const stats = fs.statSync(val);

      if (stats.isDirectory()) {
        type = 'directory';
      } else if (stats.isFile()) {
        type = 'file';
      } else {
        throw new InvalidOptionArgumentError('Invalid path type');
      }

      return { path: val, type };
    }

    throw new InvalidOptionArgumentError('invalid value');
  }
}
