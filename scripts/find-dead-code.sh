#!/bin/bash

show_file() {

    local file=${1}

    if [ -e ${file} ]; then
        readlink -f ${file} | sed 's/\.\(js\|ts\|tsx\)//g'
    #else
    #    echo DEBUG: file missing ${file}
    fi

}

find_required_javascript() {

    local file=${1}

    local requires=`grep -Eo "require\(['\"]\.[^'\"]+" ${file} | grep -Eo "[\"'].*" | grep -Eo "\..*"`

    for require in ${requires}; do

        local full_file=$(dirname $file)/${require}
        local js_file=$(dirname $file)/${require}.js
        local ts_file=$(dirname $file)/${require}.ts

        show_file ${full_file}
        show_file ${ts_file}
        show_file ${js_file}

    done

}

find_imported_typescript() {
    local file=${1}

    # echo ${file}

    # import {isPresent, Preconditions} from '../Preconditions';

    local imports=`cat ${file} | grep -Eo "import .* from .*" | grep -Eo "[\"'].*" | grep -Eo "[^'\"]+.*$" | grep -Eo "^[^'\"]+"`

    # echo ${imported}

    for imported in ${imports}; do

        #echo ${imported}

        local js_file=$(dirname $file)/${imported}.js
        local ts_file=$(dirname $file)/${imported}.ts

        show_file ${imported}
        show_file ${ts_file}
        show_file ${js_file}

    done

}

find_used_javascript() {

    # TODO: I actually think we have to start from our entry points.. and
    # resolve that way.  We have a lot of old apps that aren't being used but
    # their code has connectivity in a local cluster.

    # FIXME: I have to look in apps directory too. too ...

    # NOTES:
    # - it's important to NOT use Test*.ts|js files here because these are
    #   fake references.


    for file in `find web/js -regex '.*\.\(js\|ts\|tsx\)' | grep -v -E 'Test.(js|ts|tsx)$'`; do
        find_required_javascript ${file}
    done

    ## now test the imports in our typescript.

    for file in `find web/js -regex '.*\.\(ts\|tsx\)' | grep -v -E 'Test.(js|ts|tsx)$'`; do
        find_imported_typescript ${file}
    done

}

find_all_javascript() {

    find web/js -regex '.*\.\(js\|ts\|tsx\)' -exec readlink -f "{}" ";" | sed 's/\.\(js\|ts\|tsx\)//g' > /tmp/all-javascript.txt
    find apps -regex '.*\.\(js\|ts\|tsx\)' -exec readlink -f "{}" ";" | sed 's/\.\(js\|ts\|tsx\)//g' >> /tmp/all-javascript.txt

}

find_used_javascript | sort | uniq > /tmp/used-javascript.txt
find_all_javascript

cat /tmp/used-javascript.txt /tmp/all-javascript.txt | sort | uniq -c | grep -E "      1" | grep -v -E "Test$" > /tmp/dead-javascript.txt

cat /tmp/dead-javascript.txt
