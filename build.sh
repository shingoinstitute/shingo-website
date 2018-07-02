#!/bin/bash

TAG="${TAG:-latest}"

HELP="USAGE: build.sh [OPTIONS]
Build and optionally push an image
Accepts all arguments that 'docker build' accepts

OPTIONS:
    --push      Push image to registry after build
    -h|--help   Show this
"

build() {
    docker build --tag docker.shingo.org/shingo-website:"$TAG" "$@" .
    if [[ "$PUSH" = true ]]; then
        docker login docker.shingo.org
        docker push docker.shingo.org/shingo-website:"$TAG"
    fi
}

PUSH=false
BUILD_ARGS=()
while [[ $# -gt 0 ]]; do
    arg="$1"
    case $arg in
        --push)
            PUSH=true
            ;;
        -h|--help)
            echo "$HELP"
            exit 0
            ;;
        *)
            BUILD_ARGS+=("$arg")
            ;;
    esac
    shift
done

build "${BUILD_ARGS[@]}"
