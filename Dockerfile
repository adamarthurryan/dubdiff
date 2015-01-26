# start with docker's base ubuntu image
FROM ubuntu:14.04
MAINTAINER Adam Brown "adamarthurryan@gmail.com"

# add a volume from the current folder
# ADD . /data

EXPOSE 8000
EXPOSE 9000
EXPOSE 3000
EXPOSE 35729

# add a user
RUN useradd -ms /bin/bash docker

# update package sources
RUN apt-get -y update

# get some basics 
RUN apt-get -y install build-essential libssl-dev curl
RUN apt-get install -y git

# install mongo db
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
RUN echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | tee /etc/apt/sources.list.d/mongodb.list
RUN apt-get update
RUN apt-get install -y mongodb-org


# install node.js
RUN apt-get -y install curl
RUN curl -sL https://deb.nodesource.com/setup | bash -
RUN apt-get install -y nodejs

# install ruby and the SASS rubygem
RUN apt-get install -y ruby
RUN gem install sass



# switch to the docker user
ENV HOME /home/docker
USER docker

RUN mkdir "${HOME}/.npm-packages"

RUN echo 'prefix=${HOME}/.npm-packages' >> ${HOME}/.npmrc

RUN echo '### Begin NPM config:'>> ${HOME}/.bashrc

RUN echo 'NPM_PACKAGES="${HOME}/.npm-packages"' >> ${HOME}/.bashrc
RUN echo 'NODE_PATH="$NPM_PACKAGES/lib/node_modules:$NODE_PATH"' >> ${HOME}/.bashrc
RUN echo 'PATH="$NPM_PACKAGES/bin:$PATH"' >> ${HOME}/.bashrc
RUN echo 'MANPATH="$NPM_PACKAGES/share/man:$(manpath)"' >> ${HOME}/.bashrc

RUN echo '### End NPM config:'>> ${HOME}/.bashrc

# install yeoman tooling and other npm packages
# !!! this should be done for the docker user?
# !!! should configure npm to install to the user folder?
RUN npm install -g node-gyp
RUN npm install -g yo bower grunt-cli
RUN npm install -g generator-webapp generator-angular generator-angular-fullstack

