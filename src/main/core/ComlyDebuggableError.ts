export class ComlyDebuggableError<D extends Object> extends Error {
  constructor(message: string, debug?: D) {
    super(message);
    Object.setPrototypeOf(this, ComlyDebuggableError.prototype);
    this.name = ComlyDebuggableError.name;
    this.debug = debug;
  }

  public readonly debug?: D;
}
