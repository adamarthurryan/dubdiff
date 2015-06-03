# wdiff-markdown/docker

A docker container for deploying the wdiff-markdown application

Usage
======

Build the container with `docker build -t 'adamarthurryan/wdiff-markdown'`.

Run the script `prepare.sh` from this folder.

To launch the application in development mode, run `../launch-devel.sh`.

To launch the application in production mode, run `../launch-prod.sh`.


Note on DigitalOcean deployment
===============================

The DigitalOcean 512MB RAM option is not able to fully support dubdiff. In order to run dubdiff on this size of "droplet" one must enable a swapfile as described in this article:
  (https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-ubuntu-12-04)

1024K of swap works well.
