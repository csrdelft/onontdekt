#! /usr/bin/env sh
#
# Helper script run from travis to deploy the app
#
ionic upload --email $IONIC_EMAIL --password $IONIC_PASSWORD
