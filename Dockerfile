FROM ruphin/webserve

COPY ./src /usr/share/nginx/html
COPY index.html /usr/share/nginx/html
COPY DAI.png /usr/share/nginx/html
COPY ./node_modules/lit-html /usr/share/nginx/html/node_modules/lit-html
COPY ./node_modules/gluonjs /usr/share/nginx/html/node_modules/gluonjs
COPY ./node_modules/gluon-router /usr/share/nginx/html/node_modules/gluon-router
