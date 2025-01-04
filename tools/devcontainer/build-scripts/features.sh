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

FEATURE_ID=$(cat ${WORKSPACE_DIR}/devcontainer-feature.json | jq -r '.id')
FEATURE_VERSION=$(cat ${WORKSPACE_DIR}/devcontainer-feature.json | jq -r '.version')
IMAGE_ID=ghcr.io/kksys/spoon-tool/${FEATURE_ID}
VERSION_PATCH=$(echo $FEATURE_VERSION | sed -E 's/^[0-9]+\.[0-9]+\.([0-9]+).*$/\1/')
VERSION_MINOR=$(echo $FEATURE_VERSION | sed -E 's/^[0-9]+\.([0-9]+)\..*$/\1/')
VERSION_MAJOR=$(echo $FEATURE_VERSION | sed -E 's/^([0-9]+)\..*$/\1/')

TAG_LIST=(
  ${IMAGE_ID}:${VERSION_MAJOR}.${VERSION_MINOR}.${VERSION_PATCH}
  ${IMAGE_ID}:${VERSION_MAJOR}.${VERSION_MINOR}
  ${IMAGE_ID}:${VERSION_MAJOR}
  ${IMAGE_ID}:latest
)

for TAG in ${TAG_LIST[@]}; do
  echo $TAG
done

docker pull "${IMAGE_ID}:${FEATURE_VERSION}"

for TAG in ${TAG_LIST[@]}; do
  if [  "${TAG}" == "${IMAGE_ID}:${FEATURE_VERSION}" ]; then
    echo "Skipping ${TAG} due to this is original one..."
    continue
  fi

  docker tag "${IMAGE_ID}:${FEATURE_VERSION}" "${TAG}"
  docker push "${TAG}"
  docker image rm "${TAG}"
done

docker image rm "${IMAGE_ID}:${FEATURE_VERSION}"
