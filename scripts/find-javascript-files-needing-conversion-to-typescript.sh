#!/bin/bash

# ./scripts/find-javascript-files-needing-conversion-to-typescript.sh  | xargs wc -l |grep -v total  |sort -n

# ./scripts/find-javascript-files-needing-conversion-to-typescript.sh  | xargs wc -l |grep -v total  |sort -n |grep -v web/test |grep -v web/spectron | tail -n +6

git ls-tree -r master --name-only web |grep -E "\.js$"
