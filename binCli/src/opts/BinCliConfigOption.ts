import { FileOption } from '../../../src/index.js';
import { validateBinCliConfig } from '../config/validateBinCliConfig.js';
import { InvalidOptionArgumentError } from 'commander';
import { BinCliConfig } from '../config/binCliConfigType.js';

export interface BinCliConfigOptionParsed {
  filepath: string
  config: BinCliConfig
}

export class BinCliConfigOption extends FileOption {
  constructor(flags: string) {
    super(flags, 'Config file path (adheres to JDT schema)');
  }

  protected parse(val: any): BinCliConfigOptionParsed {
    super.parse(val);

    const { valid, errors, config } = validateBinCliConfig(val);

    if (!valid) {
      throw new InvalidOptionArgumentError(JSON.stringify(errors, null, 2));
    }

    return { filepath: val, config };
  }
}
