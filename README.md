# docker-mean-dev

A docker container for developing mean stack applications

Useage
======

Build the container with `sudo docker build -t 'tag name' .` and run with `sudo ./docker-run`.

The run script will attempt to mount a data volume from the host os from `~/docker/data`.

Finally, from the docker container, launch mongod with `mongod-start`