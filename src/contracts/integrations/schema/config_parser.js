import Ajv from 'ajv';

import config from '../../../config';
import Prototype from './prototype';

const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  v5: true
});

export default {
  /**
   * Return a specific prototype by name
   */
  prototypeByName(name) {
    return this.prototypes().find(p => p.name === name);
  },

  /**
   * Returns a list of registered prototypes from the notary configuration.
   */
  prototypes() {
    if (!config.modules.schema.prototypes) {
      return [];
    }

    return config.modules.schema.prototypes.map(rawPrototype => {
      return new Prototype({
        name: rawPrototype.name,
        schema: rawPrototype.schema,
        compiledSchema: ajv.compile(rawPrototype.schema)
      });
    });
  }
};
