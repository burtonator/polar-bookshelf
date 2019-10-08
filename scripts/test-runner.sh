#!/bin/bash

# simple test runner as mocha-parallel-tests didn't work and is braindead.

total=0

terminate() {

    exit_code=${1}

    echo "=========="
    echo "Total test files executed: ${total}"

    exit ${exit_code}

}

# this is what we used to run...

mkdir -p target/test-results/mocha/

for file in `find apps web/js -name '*Test.js' | sort -f`; do

    echo "=========="
    echo "${file}"

    # --reporter-options mochaFile=./path_to_your/file.xml

    parentDir=$(dirname ${file})
    fileName=$(basename ${file} .js).xml

    mochaFile=target/test-results/mocha/${parentDir}/${fileName}

    npx mocha --timeout 20000 --reporter mocha-junit-reporter --reporter spec --reporter-options mochaFile=${mochaFile} --exit ${file}
    exit_code=$?

    total=$(expr ${total} + 1)

    if [ "${exit_code}" != 0 ]; then
        echo "${file} FAILED"
        terminate 1
    fi

done

terminate 0
