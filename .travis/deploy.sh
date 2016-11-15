#!/usr/bin/env bash

# Exit with nonzero exit code if anything fails
set -e

# Deploy for hybrid app
cd /home/travis/build/Manduro/onontdekt
rm -f ./.gitkeep
rm -f ./www/build/main.js.map
ionic upload --email $IONIC_EMAIL --password $IONIC_PASSWORD --note "Travis deploy $TRAVIS_BUILD_NUMBER" --deploy=staging

# Get the deploy key
cd .travis
ENCRYPTED_KEY_VAR="encrypted_40378fca9f07_key"
ENCRYPTED_IV_VAR="encrypted_40378fca9f07_iv"
ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}
openssl aes-256-cbc -K $ENCRYPTED_KEY -iv $ENCRYPTED_IV -in deploy_key.enc -out deploy_key -d
chmod 600 deploy_key
eval `ssh-agent -s`
ssh-add deploy_key

# Deploy for web app
cd /home/travis/build
git config --global user.email "travis@travis-ci.com"
git config --global user.name "Travis CI"
git clone --quiet --branch=master git@github.com:csrdelft/lustrum.git www > /dev/null
rm -rf ./www/*
cp -Rf /home/travis/build/Manduro/onontdekt/www ./
cd www
git add --all .
git commit -m "Travis deploy $TRAVIS_BUILD_NUMBER"
git push --force --quiet git@github.com:csrdelft/lustrum.git master > /dev/null
