# dubdiff

A diff viewer for markdown-formatted and plaintext documents.

These diffs are intended for use in copy-editing. The diffs are performed word-by-word, similarly to how the [GNU `wdiff`](http://www.gnu.org/software/wdiff/) tool works. This produces a more meaningful diff for English-language editing. 

The diff may be further processed in a way that is aware of markdown formatting. The resulting output attempts to show differences of copy within the final document format (rather than differences of format).

The markdown-sensitive processing of the wdiff comparison is at `...`, for the curious.


## Version 2

This is a complete rewrite of Dubdiff with:

  - simpler project architecture
  - client-side diffing engine and simplified server
  - server-side rendering
  - switch to React from Angular
  - clean up of diffing engine
  - goal of implementing a HTML diff viewer

Basically I'm rewriting it for fun.


## Live Server

The tool is live at http://dubdiff.com, feel free to use it there.

## Provisioning

You'll need node & npm. Then install dependencies with 

    npm install


To build and launch a dev server:

    npm start
    npm run server

To build and launch the production server:

    npm run build:prod
    npm run server:prod



Data is saved to a simple flat file db in the `data` folder. If this folder doesn't exist, create it.

    mkdir data


### Low-memory environments

On a low-memory machine, eg. a DigitalOcean 512MB instance, you will need to enable virtual memory. Use this guide:

[How To Configure Virtual Memory (Swap File) on a VPS](https://www.digitalocean.com/community/tutorials/how-to-configure-virtual-memory-swap-file-on-a-vps#2)


### Start on boot

To make the application start on boot, run the following:

    # initialize pm2 to start on boot with the systemd boot manager
    pm2 startup systemd
    
    # start the app with pm2
    pm2 start npm --name dubdiff -- run serve:prod
    
    # save the current pm2 config so that it can be reloaded on boot
    pm2 save

 [Digital Ocean: How To Set Up a Node.js Application for Production on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04)