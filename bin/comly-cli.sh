#!/usr/bin/env bash

set -e -o pipefail
shopt -s extglob # Enable extended bash pattern

### FN ###

function info() {
  echo "[cli] $1"
}

function error_out() {
  echo "[cli] $1"
  exit 1
}

# Setting node version according to the .nvmrc
# (NOTE: this will only affect local shell context)
# (NOTE2: the approach might not be as robust as when using nvm itself; but much faster (20m vs 500ms))
function use-node {
  local node_version

  if [[ -f "./.nvmrc" ]]; then
    node_version="v`cat "./.nvmrc"`"
  else
    node_version="`node -v`"
  fi

  if [[ -z "$node_version" ]]; then
    error_out "Unable to define NodeJS version"
  fi

  export PATH="${PATH//node\/v+([0-9]).+([0-9]).+([0-9])/node\/$node_version}"
}

#function install-modules() {
#  info "(Installing modules ...)"
#  pnpm install
#}

function make() {
  info "(Making ...)"
  pnpm tsc -p ./tsconfig.json
}

### Main ###

args=($@)

use-node

#if [[ ! -d "./node_modules" ]]; then
#  install-modules
#  echo
#fi

if [[ "${args[0]}" == "@make" ]] || [[ "${args[0]}" == "-r" ]] || [[ ! -d "./dist" ]]; then
  make

  if [[ "${args[0]}" == "@make" ]]; then
      exit 0
  fi

  if [[ "${args[0]}" == "-r" ]]; then
    args=(${@:2})
  fi

  echo
fi

node ./dist/src "${args[@]}"
