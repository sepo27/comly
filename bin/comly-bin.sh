#!/usr/bin/env bash

set -e -o pipefail
shopt -s extglob # Enable extended bash pattern

__FILE=`bs="$BASH_SOURCE" && test -L "$bs" && readlink "$bs" || echo "$bs"`
__DIR="`dirname "$__FILE"`"

### Settings ###

COMLY_CLI_PATH="${__DIR}/comly-cli.sh"

### Main ###

echo "[Comly] Copying CLI bin"

cp -f "${COMLY_CLI_PATH}" "./cli"
