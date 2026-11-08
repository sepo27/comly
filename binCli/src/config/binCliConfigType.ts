import { JTDSchemaType } from 'ajv/dist/types/jtd-schema.js';

export interface BinCliConfig {
  sourcePath?: string
  distFilepath?: string
  meta?: {
    usage?: string
    // version?: string
    branch?: string
  }
}

export const comlyConfigSchema: JTDSchemaType<BinCliConfig> = {
  optionalProperties: {
    sourcePath: { type: 'string' },
    distFilepath: { type: 'string' },
    meta: {
      optionalProperties: {
        usage: { type: 'string' },
        branch: { type: 'string' },
      },
    },
  },
};
