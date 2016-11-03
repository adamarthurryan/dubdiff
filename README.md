# dubdiff

A diff viewer for markdown-formatted documents. 

Uses the [`wdiff`](http://www.gnu.org/software/wdiff/) tool as a diffing engine. This produces an output that is more useful for copy-editing tasks. This wdiff comparison is then processed in a way that is aware of markdown formatting. The resulting output attempts to show differences of copy within the final document format (rather than differences of format).

The markdown-sensitive processing of the wdiff comparison is at `server/components/wdiff/index.js`, for the curious.


## Live Version

The tool is live at http://dubdiff.com, feel free to use it there.

## Provisioning

You'll need the following:
  - node & npm
  - grunt and bower (`npm install -g grunt bower`)
  - ruby (`apt install ruby`)
  - sass (`gem install sass`)
  - wdiff (`apt install wdiff`)

The wdiff binary should be placed in the `bin` subfolder, or a link should be made to the binary. Eg. `ln -s /usr/bin/wdiff bin/wdiff`.

    npm install && bower install
    mkdir data

### Low-memory environments

On a low-memory machine, eg. a DigitalOcean 512MB instance, you will need to enable virtual memory. Use this guide:

 - [https://www.digitalocean.com/community/tutorials/how-to-configure-virtual-memory-swap-file-on-a-vps#2]

### Start on boot


To make the application start on boot, run the following:

    pm2 start grunt --name dubdiff -- serve:dist
    pm2 startup systemd
    pm2 save

[Digital Ocean: How To Set Up a Node.js Application for Production on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04)

