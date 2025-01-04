#!/usr/bin/env bash

WORKSPACE_DIR=$1

# Validate required arguments
if [ -z "${WORKSPACE_DIR}" ]; then
  echo "Error: WORKSPACE_DIR is required"
  exit 1
fi

devcontainer features publish \
  --registry ghcr.io \
  --namespace kksys/spoon-tool \
  ${WORKSPACE_DIR}
