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

# install node.js
RUN curl -sL https://deb.nodesource.com/setup | bash -
RUN apt-get install -y nodejs

# install ruby
RUN apt-get install -y ruby1.9.1 ruby1.9.1-dev

# install wdiff
RUN apt-get install -y wdiff

# add a user
# and make them a sudoer
RUN useradd -ms /bin/bash docker && echo "docker:docker" | chpasswd && adduser docker sudo

# switch to the docker user
ENV HOME /home/docker
USER docker

# configure ruby gems to run from the home directory
ENV PATH $PATH:/home/docker/.gem/ruby/1.9.1/bin

# configure npm to run without sudo permissions
RUN echo 'prefix=${HOME}/.npm-packages' >> $HOME/.npmrc

ENV NPM_PACKAGES $HOME/.npm-packages
ENV NODE_PATH $NPM_PACKAGES/lib/node_modules:$NODE_PATH
ENV PATH $PATH:$NPM_PACKAGES/bin
ENV MANPATH $(manpath):$NPM_PACKAGES/share/man

# the home folder is a volume
# we can mount it to a data volume and then it will be shared with all instances
VOLUME /home/docker
  
# expose the ports
# EXPOSE 8000
# EXPOSE 9000
# EXPOSE 3000
# EXPOSE 35729
