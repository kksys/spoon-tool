#!/usr/bin/env bash

DEVCONTAINER_IMAGE_NAME='ghcr.io/kksys/spoon-tool/devcontainer'
PLATFORM=$1

if [ -z "${PLATFORM}" ]; then
  PLATFORM='linux/amd64'
fi

GIT_COMMIT_SHA_SHORT=$(git rev-parse --short HEAD)

devcontainer build \
  --push true \
  --workspace-folder . \
  --image-name ${DEVCONTAINER_IMAGE_NAME}:main \
  --image-name ${DEVCONTAINER_IMAGE_NAME}:sha-${GIT_COMMIT_SHA_SHORT} \
  --platform ${PLATFORM} \
  --cache-from ${DEVCONTAINER_IMAGE_NAME} \
  --cache-from ${DEVCONTAINER_IMAGE_NAME}:main
