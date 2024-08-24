#!/bin/bash

NODE_VERSION=$(cat package.json | jq -r .engines.node)
PNPM_VERSION=$(cat package.json | jq -r .engines.pnpm)

echo "node version: ${NODE_VERSION}"
echo "pnpm version: ${PNPM_VERSION}"
echo "home: $HOME"

# install and activate specified node version
nvm install ${NODE_VERSION}
nvm use ${NODE_VERSION}

# install and activate specified pnpm version
pnpm setup
source $HOME/.bashrc
pnpm i -g pnpm@${PNPM_VERSION}
source $HOME/.bashrc

pnpm i
./build-scripts/generate-env.sh
