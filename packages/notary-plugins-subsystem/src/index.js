import MasterEventBus from './master-eventbus';
import PluginEventBus from './plugin-eventbus';

// const plugin = new PluginEventBus({
//   masterUrl: 'http://127.0.0.1:4000',
//   pluginName: 'test-plugin',
//   expressPort: 4002,
//   pluginUrl: 'http://127.0.0.1:4002'
// });
//
// plugin.subscribe('AVAILABLE_ACTIONS_REST', async ({name, publisher, data}) => {
//   return {
//     'promiseActions': ['rest-completeSwagger', 'omar-is-awesome'],
//     'expectationActions': ['rest-completeSwagger']
//   };
// });

export { MasterEventBus, PluginEventBus }