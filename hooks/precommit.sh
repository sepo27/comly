#!/usr/bin/env bash

### Functions ###

println() {
  printf "$1\n" "${@:2}"
}

msg() {
  printf "[precommit] $1: $2" "${@:3}"
}

infom() {
  msg "info" "${@:1}"
}

info() {
  infom "$1\n" "${@:2}"
}

gitDiff() {
  git diff-index --name-only HEAD --diff-filter ACMRTUXB
}

grepFiles() {
  res=`gitDiff | grep -E "$1"`
  echo "$res"
}

grepSrcFiles() {
  grepFiles "^src/.*\.($1)$"
}

### Main ###

# Lint

if [[ `grepSrcFiles "tsx?"` ]]; then
  infom "Linting src ... "
  pnpm run --silent lint --quiet `grepSrcFiles "ts"` || exit 1
  println "🮱"
fi

# Type check

if [[ `grepSrcFiles "tsx?"` ]]; then
  infom "Type checking src ... "
  pnpm run --silent typecheck || exit 1
  println "🮱"
fi
