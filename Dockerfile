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

# install ruby and the SASS rubygem
RUN apt-get install -y ruby
RUN gem install sass


# add a user
RUN useradd -ms /bin/bash docker


# switch to the docker user
ENV HOME /home/docker
USER docker

# configure npm to run without sudo permissions
RUN echo 'prefix=${HOME}/.npm-packages' >> $HOME/.npmrc

ENV NPM_PACKAGES $HOME/.npm-packages
ENV NODE_PATH $NPM_PACKAGES/lib/node_modules:$NODE_PATH
ENV PATH $NPM_PACKAGES/bin:$PATH
ENV MANPATH $NPM_PACKAGES/share/man:$(manpath)

# install yeoman tooling and other npm packages
RUN npm install -g node-gyp
RUN npm install -g yo bower grunt-cli
RUN npm install -g generator-webapp generator-angular generator-angular-fullstack generator-polymer

# #create a data volume
# actually, let's just leave this to the command line
# VOLUME /data

# #expose the ports
# actually, let's just leave this to the command line
# EXPOSE 8000
# EXPOSE 9000
# EXPOSE 3000
# EXPOSE 35729

# configure git
RUN git config --global push.default simple
RUN git config --global credential.helper cache
RUN git config --global credential.helper 'cache --timeout=43200'

# it would be nice if npm packages could be shared between instances...
# however it is difficult to both: add global packages from the Dockerfile
# and at the same time have the packages saved in a volume
