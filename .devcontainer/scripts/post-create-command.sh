#!/bin/bash

NODE_VERSION=$(cat package.json | jq -r .engines.node)
PNPM_VERSION=$(cat package.json | jq -r .engines.pnpm)

echo "node version: ${NODE_VERSION}"
echo "pnpm version: ${PNPM_VERSION}"
echo "home: $HOME"

# setup nvm
source $NVM_DIR/nvm.sh

# install and activate specified node version
nvm install ${NODE_VERSION}
nvm use ${NODE_VERSION}

# install and activate specified pnpm version
npm i -g pnpm@${PNPM_VERSION}

# setup pnpm
pnpm setup
source $HOME/.bashrc

# install dependencies
pnpm i --frozen-lockfile
./build-scripts/generate-env.sh
