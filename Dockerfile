# start with docker's base ubuntu image
FROM ubuntu:14.04
MAINTAINER Adam Brown "adamarthurryan@gmail.com"



# update package sources
# and get some basics
RUN apt-get -y update && apt-get -y install \
  build-essential \
  libssl-dev \
  curl \
  git


# install mongo db
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
RUN echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | tee /etc/apt/sources.list.d/mongodb.list
RUN apt-get update && apt-get install -y \
  mongodb-org

# install node.js
RUN curl -sL https://deb.nodesource.com/setup | bash -
RUN apt-get install -y nodejs

# install ruby and the SASS rubygem
RUN apt-get install -y ruby
RUN gem install sass

# add a user
RUN useradd -ms /bin/bash docker

# switch to the docker user
ENV HOME /home/docker
USER docker

# configure npm to run without sudo permissions
RUN mkdir $HOME/.npm-packages
RUN echo 'prefix=${HOME}/.npm-packages' >> $HOME/.npmrc

ENV NPM_PACKAGES $HOME/.npm-packages
ENV NODE_PATH $NPM_PACKAGES/lib/node_modules:$NODE_PATH
ENV PATH $NPM_PACKAGES/bin:$PATH
ENV MANPATH $NPM_PACKAGES/share/man:$(manpath)


# install yeoman tooling and other npm packages
RUN npm install -g node-gyp
RUN npm install -g yo bower grunt-cli
RUN npm install -g generator-webapp generator-angular generator-angular-fullstack

# setup the mongo path
ENV MONGO_DB $HOME/.mongodb
ENV MONGO_LOG $HOME/.mongodb.log
RUN mkdir $MONGO_DB

# launch mongo
# this just preps the database - it still needs to be launched inside the docker container
RUN mongod --dbpath $MONGO_DB --logpath $MONGO_LOG --fork --journal

# create a script for launching mongo from the docker container
# this could go in .bashrc or something
# perhaps mongo should use the /data volume for its database?
RUN mkdir $HOME/bin 
RUN echo 'mongod --dbpath $MONGO_DB --logpath $MONGO_LOG --fork --journal' > $HOME/bin/mongod-start
RUN chmod +x $HOME/bin/mongod-start
ENV PATH $PATH:$HOME/bin

# create a data volume
VOLUME /data

# expose the ports
EXPOSE 8000
EXPOSE 9000
EXPOSE 3000
EXPOSE 35729


