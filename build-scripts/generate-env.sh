#!/usr/bin/env bash

BACKEND_PORT='8787'
FRONTEND_PORT='5173'

function print_envs_frontend() {
  if [ "${CODESPACES}" == 'true' ]; then
    echo "VITE_BACKEND_HOST=https://${CODESPACE_NAME}-${BACKEND_PORT}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
    echo "VITE_FRONTEND_HOST=https://${CODESPACE_NAME}-${FRONTEND_PORT}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
  else
    echo "VITE_BACKEND_HOST=http://localhost:${BACKEND_PORT}"
    echo "VITE_FRONTEND_HOST=http://localhost:${FRONTEND_PORT}"
  fi
}

function print_envs_backend() {
  if [ "${CODESPACES}" == 'true' ]; then
    echo "BACKEND_HOST=localhost:${BACKEND_PORT}"
    echo "FRONTEND_HOST=https://${CODESPACE_NAME}-${FRONTEND_PORT}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
  else
    echo "BACKEND_HOST=localhost:${BACKEND_PORT}"
    echo "FRONTEND_HOST=http://localhost:${FRONTEND_PORT}"
  fi
}

function print_envs_restapi() {
  if [ "${CODESPACES}" == 'true' ]; then
    echo "PORT=${BACKEND_PORT}"
    echo "API_URL=https://${CODESPACE_NAME}-${BACKEND_PORT}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
    echo "HOST=${CODESPACE_NAME}-${BACKEND_PORT}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
    echo "ORIGIN=https://${CODESPACE_NAME}-${FRONTEND_PORT}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
  else
    echo "PORT=${BACKEND_PORT}"
    echo "API_URL=http://localhost:${BACKEND_PORT}"
    echo "HOST=localhost:${BACKEND_PORT}"
    echo "ORIGIN=http://localhost:${FRONTEND_PORT}"
  fi
}

print_envs_frontend > ./packages/frontend/.env
print_envs_backend > ./packages/backend/.dev.vars
print_envs_restapi > ./packages/backend/sample/.env
