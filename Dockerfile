FROM node:8.1-slim

EXPOSE 3000 4000
WORKDIR /opt/app

ENV NPM_CONFIG_LOGLEVEL warn

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app/dist && cp -a /tmp/node_modules /opt/app/ && cp /tmp/package.json /opt/app/

COPY dist /opt/app/dist

CMD npm start