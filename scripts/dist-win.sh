#!/usr/bin/env bash

# TODO- if I can pass a custom artifact name on the command line I could get this to work.

WINDOWS_CSC_DIR=$(readlink -m ../polar-bookshelf-secrets/windows-csc)

source ${WINDOWS_CSC_DIR}/windows.sh

if [ "${CSC_KEY_PASSWORD}" == "" ]; then
    echo "CSC_KEY_PASSWORD not set" > /dev/stderr
    exit 1
fi

#export CSC_LINK=${WINDOWS_CSC_DIR}/spinn3r.p12
export CSC_LINK=/root/windows-csc/spinn3r.p12

# Error: Cannot extract publisher name from code signing certificate, please
# file issue. As workaround, set win.publisherName: Error: Exit code: 1. Command
# failed: openssl pkcs12 -nokeys -nodes -passin pass: -nomacver -clcerts -in
# /root/windows-csc/00C8406FA14CAD991724834F1B0D25C4D3.crt

shell() {

       #-v ${PWD##*/}-node-modules:/project/node_modules \

    docker run --rm -ti \
       --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
       --env ELECTRON_CACHE="/root/.cache/electron" \
       --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
       -v ${PWD}:/project \
       -v ~/.cache/electron:/root/.cache/electron \
       -v ~/.cache/electron-builder:/root/.cache/electron-builder \
       -v ${WINDOWS_CSC_DIR}:/root/windows-csc \
       electronuserland/builder:wine bash

    # ./node_modules/.bin/electron-builder --config=electron-builder.yml --config.nsis.artifactName=\${name}-\${version}-x64.\${ext} --x64 --win nsis --publish always

}

build_for_arch() {
    arch=${1}
    target=${2}

   # -v ${PWD##*/}-node-modules:/project/node_modules \
   #
   # NOTE:
   # using a channel didn't work because the client itself needs to know that
   # we're using a specific channel.
   #
   # --config.publish.channel=latest-win-'${arch}'

    docker run --rm -ti \
       --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
       --env ELECTRON_CACHE="/root/.cache/electron" \
       --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
       -v ${PWD}:/project \
       -v ~/.cache/electron:/root/.cache/electron \
       -v ~/.cache/electron-builder:/root/.cache/electron-builder \
       -v ${WINDOWS_CSC_DIR}:/root/windows-csc \
       electronuserland/builder:wine bash -c 'npm install && ./node_modules/.bin/electron-builder --config=electron-builder.yml --config.'${target}'.artifactName=\${name}-\${version}-'${target}'-'${arch}'.\${ext} --'${arch}' --win '${target}' --publish always'
}

build_for_arch x64 portable
build_for_arch x64 nsis
build_for_arch ia32 nsis


