import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import _ from 'lodash';

export default class MasterEventBus {
  server;
  registry = {};

  constructor(port) {
    this.server = express();
    this.initServer(port);
  }

  async publish(name, data, async, publisher) {
    return _.flatten(await Promise.all(
      _.filter(this.registry, (plugin) => {
        return _.includes(plugin.subscriptions, name);
      }).map(plugin => {
        return axios.post(plugin.url+'/events', {
          name,
          async,
          data,
          publisher
        })
        .then(response => {
          return response.data;
        });
      })
    ));
  }

  async publishAsync(name, data, async, publisher) {
    this.publish(name, data, async, publisher);

    return Promise.resolve([]);
  }

  initServer(port) {
    this.server.use(bodyParser.json());

    //register plugin
    this.server.post('/plugins', (req, res) => {
      const { name, url, subscriptions } = req.body;
      this.registry[name] = {
        subscriptions,
        url,
        lastBeat: new Date()
      };

      res.sendStatus(200);
    });

    //publish
    this.server.post('/events', (req, res) => {
      const { event, async, data, publisher } = req.body;
      if (async) {
        res.send('[]');
      }
      return this.publish(event, data, async, publisher)
        .then(responses => {
          let flattened = [];
          responses.filter(r => r.length > 0).forEach(r => flattened = flattened.concat(r));
          if (!async) {
            res.send(flattened);
          }
        })
        .catch(e => {
          console.log(e);
          if (!async) {
            res.status(500).send(e);
          }
        })
    });

    this.server.listen(port)
  }
}