#!/usr/bin/env bash
test_dir() {
    dir=$1

    for file in `find ${dir} -name '*.ts'`; do

        #grep -l 'require(' ${file}

        requires=`grep -Eo "require\(['\"]\.[^'\"]+" ${file} | grep -Eo "[\"'].*" | grep -Eo "\..*"`

        for require in ${requires}; do
            require_file=$(dirname $file)/${require}.ts

            if [ -e ${require_file} ]; then
                echo ${file} requires ${require_file} which has a TS version.
            fi

            #echo ${require}
        done

    done

}

test_dir web
test_dir apps
