# pi-serve
RPI Server and site

Just a foundation for spinning up a server on my local Raspberry Pi.

## Configure with Proxy

Ideally we want to configure the nodejs server to be setup behind a proxy on the domain rather than running it as admin on port 80. Being a linux machine, we have Apache available to us to poxy the root/domain to the nodejs server making it appear as though it is the only server running on the domain at port 80 when really it is running on another port of our choice.

> NOTE: I think this is how you do something like this. Im not entirely sure that this is the best solution for securely running the node server. I was learning as I went through this.

### Enable Apache's Modules for Proxy
``` bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_html
sudo systemctl restart apache2
```

### Copy the template for Sites Available

1. Navigate to `/etc/apache2/sites-available/`
2. Copy the template in that folder for our new vhost file:
   1. `cp 000-default.conf pi-serve.conf`
3. Open the file we just created. `sudo nano pi-serve.conf`
4. Remove the comment from the ServerName and make sure it matches the domain ex: `ubuntupi.local`
5. Add the following line under `<VirtualHosts *:80>` section.
   1. `ProxyPass / http://ubuntupi.local:8080/` (assuming we are running the node server on port 8080)
   2. (Optional): If we had the server at a subdomain or directory we would want to add the [reverse proxy](https://serverfault.com/questions/774041/what-is-the-use-of-proxypassreverse-directive) line in addition like: `ProxyPassReverse / http://ubuntupi.local:8080/`



## Great StackOverflow Article on Services

From [StackOverflow](https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service)

Copying my own answer from [How do I run a Node.js application as its own process?](https://stackoverflow.com/questions/4681067/how-to-run-a-node-js-application-as-its-own-process/28542093#28542093)

2015 answer: nearly every Linux distro comes with systemd, which means forever, monit, PM2, etc are no longer necessary - your OS already handles these tasks.

Make a `myapp.service` file (replacing 'myapp' with your app's name, obviously):

```bash
[Unit]
Description=My app

[Service]
ExecStart=/var/www/myapp/app.js
Restart=always
User=nobody
# Note Debian/Ubuntu uses 'nogroup', RHEL/Fedora uses 'nobody'
Group=nogroup
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
WorkingDirectory=/var/www/myapp

[Install]
WantedBy=multi-user.target
```

**Note if you're new to Unix:** `/var/www/myapp/app.js` should have `#!/usr/bin/env node` on the very first line and have the executable mode turned on `chmod +x myapp.js`.

Copy your service file into the `/etc/systemd/system`.

Start it with `systemctl start myapp`.

Enable it to run on boot with `systemctl enable myapp`.

See logs with `journalctl -u myapp`

This is taken from [How we deploy node apps on Linux, 2018 edition](https://expeditedsecurity.com/blog/deploy-node-on-linux#-a-name-node-linux-service-systemd-a-create-services), which also includes commands to generate an AWS/DigitalOcean/Azure CloudConfig to build Linux/node servers (including the .service file).
