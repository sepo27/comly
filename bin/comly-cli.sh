#!/usr/bin/env bash

set -e -o pipefail
shopt -s extglob # Enable extended bash pattern

### FN ###

function info() {
  echo "[cli] $1"
}

# Setting node version according to the .nvmrc
# (NOTE: this will only affect local shell context)
# (NOTE2: the approach might not be as robust as when using nvm itself; but much faster (20m vs 500ms))
function use-node {
  nodeVersion="`cat "./.nvmrc"`"
  export PATH="${PATH//node\/v+([0-9]).+([0-9]).+([0-9])/node\/v$nodeVersion}"
}

function install-modules() {
  info "(Installing modules ...)"
  pnpm install
}

function compile() {
  info "(Making ...)"
  npx tsc -p ./tsconfig.json
}

### Main ###

args=($@)

use-node

if [[ ! -d "./node_modules" ]]; then
  install-modules
  echo
fi

if [[ "${args[0]}" == "@make" ]] || [[ "${args[0]}" == "-r" ]] || [[ ! -d "./cli/dist" ]]; then
  compile

  if [[ "${args[0]}" == "@make" ]]; then
      exit 0
  fi

  if [[ "${args[0]}" == "-r" ]]; then
    args=(${@:2})
  fi

  echo
fi

node ./cli/dist/src "${args[@]}"
