# Status

**! Development pre-release phase. !**

# Purpose

Command Line Interface Framework.  
*(Based on [commander](https://www.npmjs.com/package/commander))*

### Features:
- Logger & verbosity by default
- Debuggable pretty errors
- Handy CLI kit
  - Common options
- CLI bin setup

# Quick Start

Install (TODO: publish)
```shell
pnpm install <local-path-to-comly>
```

Setup CLI app
```typescript
// src/index.ts

import { comly, ComlyCommand } from 'comly';

const fooCommand = ComlyCommand('foo');

comly().addCommand(fooCommand).run();
```

Setup TS compiler & CLI bin
```shell
pnpm install typescript -D

# Configure tsconfig.json to output into ./dist

pnpm comly # This will setup comly bin into ./cli
```
