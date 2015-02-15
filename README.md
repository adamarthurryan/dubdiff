# docker-mean-dev

A docker container for developing mean stack applications

Usage
======

Build the container with `docker build -t 'tag name' .`. Install the `mean` and `start-mongodb` to `~/bin` or some other location in the path.

To run commands from the container, use `mean <command>`. For example, to install a new npm package globally:
    mean npm install -g generator-polymer

Or to create a yeoman scaffolding in the current folder:
    mean yo polymer

Some default npm and gem packages are specified in `default-packages.sh`. They can be installed with:
    mean bash default-packages.sh

