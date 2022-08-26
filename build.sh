#!/bin/bash

export JAVAVER=jdk-12.0.2

which java
java -version

cd $(dirname $0)

ARGS="$ARGS -Dmaven.repo.local=$PWD/.m2"
ARGS="$ARGS -DskipTests -Dgpg.skip"
ARGS="$ARGS -Dmaven.compiler.failOnError=false"
ARGS="$ARGS -Dmaven.javadoc.skip=true"
#ARGS="$ARGS install"
#ARGS="$ARGS -X"

MVN=../apache-maven-3.8.6/bin/mvn

pushd log-viewer-frontend
  export PATH=$PWD/log-viewer-frontend/target/npmWd/node:$PATH
  npm install
popd

if [ ! -f $PWD/log-viewer-frontend/target/npmWd/node ]; then
  $MVN $ARGS compile $@
  pushd log-viewer-frontend
    PATH=$PATH:$PWD/target/npmWd/node
  popd
fi

$MVN $ARGS package $@
