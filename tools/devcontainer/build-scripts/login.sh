#!/usr/bin/env bash

source $(dirname $0)/.env

echo $PAT | docker login $REGISTRY -u $USERNAME --password-stdin
