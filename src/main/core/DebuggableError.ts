export class DebuggableError<D extends Object> extends Error {
  constructor(message: string, debug?: D) {
    super(message);

    Object.setPrototypeOf(this, DebuggableError.prototype);

    this.name = DebuggableError.name;
    this.debug = debug;
  }

  public readonly debug?: D;
}
