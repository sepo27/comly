# Status

**! Development pre-release phase. !**

# Purpose

Command Line Interface Framework.  
*(Based on [commander](https://www.npmjs.com/package/commander))*

### Features:
- Logger & verbosity
- Debuggable errors
- Handy CLI kit
  - Common options
- CLI bin compilation kit
  - compile app into distributable bin file (javascript)

# Quick Start

Install (TODO: publish package)
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

Make distributable bin file
```shell
# Install peers ...

# Make fine file
pnpm comly bin make -h
```
