#!/bin/bash

TAG="${TAG:-latest}"
IMG_NAME="shingo-website"

HELP="USAGE: $(basename "$0") [OPTIONS] [-- DOCKER_ARGS]
Build and optionally push an image

POSITIONAL ARGUMENTS:
    DOCKER_ARGS     Arguments to be passed to the docker build command
                      Must be separated from the other arguments by --

OPTIONS:
    -p|--push       Push image to registry after build
    -t|--tag TAG    Set image tag
    -h|--help       Show this help
"

build() {
    docker build --tag docker.shingo.org/"$IMG_NAME":"$TAG" "$@" .
    if [[ "$PUSH" = true ]]; then
        docker login docker.shingo.org
        docker push docker.shingo.org/"$IMG_NAME":"$TAG"
    fi
}

read_build_args() {
    while [[ $# -gt 0 ]]; do
        BUILD_ARGS+=("$1")
        shift
    done
}

PUSH=false
BUILD_ARGS=()
while [[ $# -gt 0 ]]; do
    arg="$1"
    case $arg in
        -p|--push)
            PUSH=true
            ;;
        -t|--tag)
            shift
            TAG="$1"
            ;;
        -h|--help)
            echo "$HELP"
            exit 0
            ;;
        --)
            shift
            read_build_args "$@"
            shift $#
            ;;
        *)
            echo "$HELP"
            exit 1
            ;;
    esac
    shift
done

build "${BUILD_ARGS[@]}"
