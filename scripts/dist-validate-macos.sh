#!/bin/bash

# validate MacOS packages by:
#
# - Installing the lastest stable version on the OS
#
# - Make sure it starts and that documents are loaded in the app repository
#
#    - TODO: how do we do this reliably without full e2e tests now?
#      I could have POLAR_INSTRUMENT_STARTUP which just records the version number
#      we are running with, the installation directory, whether we started up
#      successfully.
#
#    - make sure the port opened up properly
#    - make sure the document repo was loaded
#    - make sure the version number was correct
#
# - Then install the update via auto-update targeting the pre-release version
#
# - Then make sure it works after re-install and that the correct version was
#   loaded
#
# - Then install the pre-release version directly and make sure that works
#
# - on macos we can install the package with hdutil and then copy the files into
#   the local /Applications dir or just run them right in place I think..
#
# - make sure to kill off any copies that are currently running

# get the browswer download URL for a given rlease

#curl https://api.github.com/repos/burtonator/polar-bookshelf/releases


#curl https://api.github.com/repos/burtonator/polar-bookshelf/releases | jq .[0]

# prerelease | true would be set here...

#curl -s https://api.github.com/repos/burtonator/polar-bookshelf/releases | jq ".[] | select(.prerelease==false) "

# Get the first non pre-release
#curl -s https://api.github.com/repos/burtonator/polar-bookshelf/releases | jq "[.[] | select(.prerelease==false)][0] "

#curl -s https://api.github.com/repos/burtonator/polar-bookshelf/releases | jq "[.[] | select(.prerelease==false)][0] | .assets[].browser_download_url "

#curl -s https://api.github.com/repos/burtonator/polar-bookshelf/releases | jq -r "[.[] | select(.prerelease==false)][0] | .assets[].browser_download_url " |grep -E "\.dmg$"


###
# Get the URL to a release by querying github for releases:
#
# params:
#   prerelease: true or false.  When true we return the most recent prerelease
#               or an empty string if non is found.
#   type: The binary type (.dmg, .deb, etc).  This is just the ending suffix.
#         For windows we can use "x64.exe" or "ia32.exe"

err() {

    msg=${1}
    echo ${msg} > /dev/stderr
    exit 1
}

terminate_running_app() {

    killall "Polar Bookshelf"

}

require_var() {
    name=${1}
    msg=${2}

}

get_release() {

    prerelease=${1}
    type=${2}

    curl -s https://api.github.com/repos/burtonator/polar-bookshelf/releases | \
        jq -r "[.[] | select(.prerelease==${prerelease})][0] | .assets[].browser_download_url" |grep -E "${type}$"

}

prerelease_url=$(get_release true .dmg)
stable_url=$(get_release false .dmg)

if [ "${prerelease_url}" == "" ]; then
    err "No prerelease url"

fi

if [ "${stable_url}" == "" ]; then
    err "No stable url"
fi

echo "Found prerelease: ${prerelease_url}"
echo "Found stable: ${stable_url}"

# https://apple.stackexchange.com/questions/73926/is-there-a-command-to-install-a-dmg

terminate_running_app
