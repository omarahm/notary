const types = {
  rest: {},
  schema: {},
  localstorage: {}
};

export default {
  exists: integration => !!types[integration],
  get: integration => types[integration]
};
