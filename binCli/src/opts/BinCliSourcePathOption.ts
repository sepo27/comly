import { PathOption } from '../../../src/index.js';

export class BinCliSourcePathOption extends PathOption {
  constructor() {
    super('-s,--source-path <path>', 'Source path (directory or file). Falls back to "index.ts" in case of directory.');
    this.argParser(this.parse.bind(this));
  }
}
