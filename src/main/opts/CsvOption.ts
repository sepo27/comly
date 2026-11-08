import { InvalidOptionArgumentError, Option } from 'commander';

export class CsvOption<T = string[]> extends Option {
  constructor(flags: string, description?: string) {
    const finalDescription = description ? `${description} (type: CSV)` : undefined;
    super(flags, finalDescription);
    this.argParser(this.parse.bind(this));
  }

  // Overwrite parent choices() as it resets parser by calling argParser()
  public choices(values: string[]): this {
    this.argChoices = values;
    return this;
  }

  private parse(input: any): T {
    const values = input.split(',');

    if (this.argChoices && values.some(val => !this.argChoices!.includes(val))) {
      throw new InvalidOptionArgumentError(`Allowed values: ${this.argChoices}`);
    }

    return values;
  }
}
