#!/bin/bash
MYSQL_PASS=$(cat .env | grep -E "(MYSQL_PASS|MYSQL_PASSWORD|MYSQL_ROOT_PASSWORD)" | cut -d'=' -f 2)
TAG=$1
HTTP=$2
HTTPS=$3
MYSQL_PATH=$4

if [ -z "$1" ] || [ "${TAG}" = '--log' ]; then
    TAG="local"
fi
if [ -z "$2" ]; then
    HTTP="80"
fi
if [ -z "$3" ]; then
    HTTPS="443"
fi
if [ -z "$4" ]; then
    MYSQL_PATH="/var/lib"
fi

docker network create shingo-dev-net
docker kill shingo-mysql-local
docker rm shingo-mysql-local
docker run -itd                                             \
    --name shingo-mysql-local                               \
    -e MYSQL_ROOT_PASSWORD=${MYSQL_PASS}                    \
    --volume ${MYSQL_PATH}/mysql:/var/lib/mysql:rw          \
    --network shingo-dev-net                                \
    mysql:5.7

sleep 3

docker exec -it shingo-mysql-local mysql -p${MYSQL_PASS} -e "GRANT ALL ON *.* TO root@'172.%.%.%' IDENTIFIED BY '${MYSQL_PASS}'; FLUSH PRIVILEGES;"

docker kill shingo-website-local
docker rm shingo-website-local

docker build --tag shingo-website:${TAG} .
docker run -itd                                             \
    --volume $(pwd):/shingo-website                         \
    --name shingo-website-local                             \
    --publish ${HTTP}:80                                    \
    --publish ${HTTPS}:443                                  \
    --network shingo-dev-net                                \
    shingo-website:${TAG}

if [ "${1}" = '--log' ]; then
    docker logs -f shingo-website-local;
fi