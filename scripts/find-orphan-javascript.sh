#!/usr/bin/env bash

# find .js and .js.map files that are actually in version control still and
# can be removed.

test_orphan() {
    path=$1

    if [ -e ${path} ] && [ "$(git ls-files ${path})" != "" ]; then
        echo ${path}
    fi

}

test_dir() {
    dir=$1

    for file in `find ${dir} -name '*.ts'`; do
        #echo ${file}
        id=$(dirname ${file})/$(basename -s '.ts' ${file})
        #echo ${id}

        test_orphan ${id}.js
        test_orphan ${id}.js.map

    done

}

test_dir web
test_dir apps
