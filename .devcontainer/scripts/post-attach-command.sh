#!/bin/bash

# launch the backend port service (this is only needed in codespaces)
if [ "$CODESPACE" == 'true' ]; then
  ${CODESPACE_VSCODE_FOLDER}/.devcontainer/scripts/backend-port-service
else
  echo "Not in a codespace, skipping backend port service setup"
fi
