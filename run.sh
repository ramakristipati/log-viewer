#!/bin/bash

export JAVAVER=jdk-12.0.2

cd $(dirname $0)

VERSION=1.0.4-SNAPSHOT

if [ ! -d log-viewer-${VERSION} ]; then
    tar -zxvf log-viewer-cli/target/log-viewer-${VERSION}.tar.gz
fi

HOME=/projects/scid/private/rp_sync_daily
if [ ! -d $HOME ]; then
    HOME=/projects/TAMdata/scid/devtest_latest/runs/dry_run_logs
fi

java -ea \
   -Duser.home=$HOME \
   -Dlog-viewer.config-file=$PWD/spytest.conf \
   -jar $PWD/log-viewer-${VERSION}/lib/log-viewer-cli-${VERSION}.jar startup
