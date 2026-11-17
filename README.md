# Status

**! Development pre-release phase. !**

# Purpose

Command Line Interface Framework.  
*(Based on [commander](https://www.npmjs.com/package/commander))*

### Features:
- Logger & verbosity
- Debuggable errors
- Handy CLI kit
  - Common options for commands
- CLI bin compilation kit
  - compile app into distributable bin file (javascript)

# Quick Start

Install
```shell
pnpm install @sepo27/comly
```

Setup CLI app
```typescript
// src/index.ts

import { comly, ComlyCommand } from 'comly';

// ComlyCommand is a wrapper over commander.Command; so use its API normaly
const fooCommand = ComlyCommand('foo');

comly().addCommand(fooCommand).run();
```

Make distributable bin file of your CLI app
```shell
# Install peers (from comly package.json)

# Make bin file
pnpm comly bin make -h
```
