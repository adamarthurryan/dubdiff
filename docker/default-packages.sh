#!/bin/bash


# default package installations
echo "run this script with 'mean bash default-packages.sh'"



# install some ruby gems 
gem install --user-install sass
gem install --user-install compass

# install yeoman tooling and other npm packages
npm install -g node-gyp
npm install -g yo bower grunt-cli
npm install -g generator-webapp generator-angular generator-angular-fullstack generator-polymer