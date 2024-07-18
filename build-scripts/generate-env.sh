#!/bin/bash

BACKEND_PORT='8787'
FRONTEND_PORT='5173'

function print_envs() {
  if [ "${CODESPACES}" == 'true' ]; then
    echo "VITE_BACKEND_HOST=${CODESPACE_NAME}-${BACKEND_PORT}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
    echo "VITE_FRONTEND_HOST=${CODESPACE_NAME}-${FRONTEND_PORT}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
  else
    echo "VITE_BACKEND_HOST=localhost:${BACKEND_PORT}"
    echo "VITE_FRONTEND_HOST=localhost:${FRONTEND_PORT}"
  fi
}

function print_devvars() {
  if [ "${CODESPACES}" == 'true' ]; then
    echo "BACKEND_HOST=localhost:${BACKEND_PORT}"
    echo "FRONTEND_HOST=${CODESPACE_NAME}-${FRONTEND_PORT}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
  else
    echo "BACKEND_HOST=localhost:${BACKEND_PORT}"
    echo "FRONTEND_HOST=localhost:${FRONTEND_PORT}"
  fi
}

print_envs > ./packages/frontend/.env
print_devvars > ./packages/backend/.dev.vars
