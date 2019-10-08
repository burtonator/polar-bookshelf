#!/bin/bash

DEST=save-to-polar

mkdir -p ${DEST}
cp icon* ${DEST}
cp *.js ${DEST}
cp *.html ${DEST}
cp manifest.json ${DEST}

cp --parents ./node_modules/bootstrap/dist/css/bootstrap.min.css ${DEST}
cp --parents ./node_modules/bootstrap/dist/css/bootstrap-grid.min.css ${DEST}
cp --parents ./node_modules/bootstrap/dist/css/bootstrap-reboot.min.css ${DEST}
cp --parents ./node_modules/@fortawesome/fontawesome-free/css/all.min.css ${DEST}

zip -r save-to-polar.zip save-to-polar
