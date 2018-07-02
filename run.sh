#!/bin/bash

TAG="${TAG:-latest}"
NETWORK="${NETWORK:-shingo-net}"
CONT_NAME="shingo-website"

if [[ "$TAG" = "test" ]]; then
  CONT_NAME+="-test"
fi

NAME="${NAME:=CONT_NAME}"

docker run -itd                     \
    --name "$NAME"                  \
    --network "$NETWORK"            \
    --publish 80:80                 \
    docker.shingo.org/shingo-website:"$TAG"
