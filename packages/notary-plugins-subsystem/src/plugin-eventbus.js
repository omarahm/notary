import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

export default class PluginEventBus {
  expressServer;
  masterUrl;
  pluginName;
  subscriptions = {};

  constructor({pluginName, pluginUrl, expressPort, masterUrl}) {
    this.masterUrl = masterUrl;
    this.expressServer = express();
    this.pluginName = pluginName;
    this.pluginUrl = pluginUrl;
    this.initServer(expressPort);
    this.initSubscriptionSync();
  }

  async _publish(name, data, async) {
    return axios.post(this.masterUrl + '/events', {
      publisher: this.pluginName,
      event: name,
      async,
      data
    })
    .then((response) => {
      console.log(response);
    });
  }

  async publish(name, data) {
    return this._publish(name, data, false);
  }

  async publishAsync(name, data) {
    return this._publish(name, data, true);
  }

  subscribe(name, callback) {
    if (!this.subscriptions[name]) {
      this.subscriptions[name] = [];
    }

    this.subscriptions[name].push(callback);
  }

  executeCallbacks({name, publisher, data}) {
    if (!this.subscriptions[name]) {
      console.info('No callbacks registered!');
      return Promise.resolve('{}');
    }

    return Promise.all(
      this.subscriptions[name].map(cb => {
        return cb({name, publisher, data});
      })
    );
  }

  initServer(port) {
    this.expressServer.use(bodyParser.json());
    this.expressServer.post('/events', (req, res) => {
      const { async, name, publisher, data } = req.body;

      console.info(`Got ${async ? 'async ' : ''}event ${name} from ${publisher} with data: ${data}`);

      this.executeCallbacks({name, publisher, data})
        .then(responses => {
          res.send(responses);
        })
        .catch(e => {
          console.log(e);
          res.status(500).send(e);
        })
    });

    this.expressServer.listen(port, () => {
      console.info(`notary's plugins sub-system: plugin ${this.pluginName} listening at ${port}`);
    })
  }

  initSubscriptionSync() {
    setInterval(() => {
      axios.post(this.masterUrl+'/plugins', {
        name: this.pluginName,
        url: this.pluginUrl,
        subscriptions: Object.keys(this.subscriptions)
      }).catch(e => {
        console.log(e);
      });
    }, 1000);
  }
}