# pro.rusoft.rsd.backend

> Ople Alpha

## Prerequisites

1. Install node v8.4.0+, install npm 5.2.0+

2. Install and launch mongodb service

3. Update these config files:


- config/default.json
- config/production.json

## Setup & Run

``` bash
# install dependencies
yarn install

# startapp using development settings (use together with `npm run dev` from shell.ople.ai)
pm2 start ecosystem.config.js

# startapp using production settings
pm2 start ecosystem.config.js --env production

# stop app
pm2 stop ecosystem.config.js

```

## Example building automation
```
#!/bin/bash

SERVICE='pro.rusoft.rsd.backend'
PROJECT_DIR="/var/projects/$SERVICE"
WEBAPP_DIR="/opt/$SERVICE"

cd $PROJECT_DIR
git reset --hard
git pull
rm -rf $PROJECT_DIR/node_modules
npm i
npm run build

chmod -R 775 $PROJECT_DIR

cd $WEBAPP_DIR
pm2 stop ecosystem.config.js --env production
cd ..

rm -rf $WEBAPP_DIR/*
mkdir -p $WEBAPP_DIR
chmod 775 $WEBAPP_DIR
cp -R $PROJECT_DIR/. $WEBAPP_DIR
rm -rf $WEBAPP_DIR/.git
cd $WEBAPP_DIR
chgrp -R developers .

npm run setup
pm2 start ecosystem.config.js --env production
```

## Example proxy (Nginx) configuration
```
server {
    listen          *:80;
    server_name     ople.tp.ntr1x.com;

    access_log      /var/log/nginx/pro.rusoft.rsd.backend.access.log;
    error_log       /var/log/nginx/pro.rusoft.rsd.backend.error.log;

    gzip            on;
    gzip_static     on;
    gzip_disable    "MSIE [1-6]\.(?!.*SV1)";

    location / {
        proxy_pass              http://127.0.0.1:3008;
        proxy_set_header        X-Forwarded-Host        $host;
        proxy_set_header        X-Forwarded-Server      $host;
        proxy_set_header        X-Forwarded-For         $proxy_add_x_forwarded_for;
    }
}
```
