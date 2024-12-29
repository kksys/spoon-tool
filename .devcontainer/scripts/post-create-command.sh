#!/bin/bash -i

function get_current_shell() {
  if ps -p $$ | grep -qs bash ; then
    echo "bash"
  elif ps -p $$ | grep -qs zsh ; then
    echo "zsh"
  fi
}

if [[ $(get_current_shell) != "$(basename $(echo $SHELL))" ]]; then
  $SHELL "$0"
  exit $?
fi

RCFILE="${HOME}/.$(get_current_shell)rc"

function install_native_deps() {
  local PLATFPORM=$(uname -s)

  case $PLATFPORM in
    "Linux")
      sudo apt update && sudo apt install -y graphviz
      ;;
    "Darwin")
      brew update && brew install graphviz
      ;;
    *)
      echo "Unsupported platform: $PLATFPORM"
      exit 1
      ;;
  esac
}

function set_node_pnpm_versions() {
  export NODE_VERSION=$(cat package.json | jq -r .engines.node)
  export PNPM_VERSION=$(cat package.json | jq -r .engines.pnpm)

  echo "node version: ${NODE_VERSION}"
  echo "pnpm version: ${PNPM_VERSION}"
}

function set_nvm() {
  source "${RCFILE}" > /dev/null 2>&1

  if export | grep NVM_ > /dev/null 2>&1; then
    echo 'nvm'
  elif export | grep FNM_ > /dev/null 2>&1; then
    echo 'fnm'
  else
    echo "nvm is not installed"
    exit 1
  fi
}

function install_node() {
  local NVM=$(set_nvm)

  echo $NVM

  if [[ "$NVM" == "nvm" ]]; then
    which nvm || \
      type -t nvm > /dev/null 2>&1 || \
      source $NVM_DIR/nvm.sh
  fi

  # install and activate specified node version
  ${NVM} install ${NODE_VERSION}
  ${NVM} use ${NODE_VERSION}
}

function setup_pnpm() {
  # install and activate specified pnpm version
  npm i -g pnpm@${PNPM_VERSION}

  # setup pnpm
  pnpm setup
  source "${RCFILE}"
}

function install_dependencies() {
  # install dependencies
  pnpm i --frozen-lockfile
  ./build-scripts/generate-env.sh
}

function main() {
  install_native_deps
  set_node_pnpm_versions
  install_node
  setup_pnpm
  install_dependencies
}

main
