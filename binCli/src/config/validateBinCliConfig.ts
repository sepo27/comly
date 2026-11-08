import * as fs from 'node:fs';
import { Ajv, ErrorObject } from 'ajv/dist/jtd.js';
import { BinCliConfig, comlyConfigSchema } from './binCliConfigType.js';

type ResultError = { [key: string]: string }

interface Result {
  valid: boolean
  errors: ResultError | null
  config: BinCliConfig
}

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(comlyConfigSchema);

export const validateBinCliConfig = (configFile: string): Result => {
  if (!fs.existsSync(configFile)) {
    throw new Error(`Config file "${configFile}" does not exist`);
  }

  let config: BinCliConfig;

  try {
    config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  } catch (err) {
    if (err instanceof SyntaxError) {
      // eslint-disable-next-line preserve-caught-error
      throw new SyntaxError(`Config file "${configFile}" is invalid.\n${err.message}`);
    }
    throw err;
  }
  const valid = validate(config);

  let errors: ResultError | null = null;

  if (!valid && validate.errors) {
    errors = validate.errors.reduce((acc, err) => Object.assign(acc, formatValidateError(err)), {} as ResultError);
  }

  return { valid, errors, config };
};

/*** Private ***/

function formatValidateError(error: ErrorObject): ResultError {
  const key = error.instancePath.split('/').filter(v => Boolean(v));
  let message;

  if (error.params?.error === 'missing') {
    key.push(error.params.missingProperty);
    message = 'missing';
  } else {
    message = error.message;
  }

  return { [key.join('.')]: message };
}
