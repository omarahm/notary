import _ from 'lodash';

import config from './config';

export default {
  toProject(project) {
    const encodedId = this.toEncodedProjectId(project);
    return {
      repositoryName: project.repo,
      repositoryOwner: project.owner,
      contractsDirectory: project.dir,
      _links: {
        self: {
          href: `/projects/${encodedId}`
        },
        revision: {
          href: `/projects/${encodedId}/revisions/{revision}`,
          templated: true
        },
        masterRevision: {
          href: `/projects/${encodedId}/revisions/master`
        }
      }
    };
  },

  async toProjectRevision(project, revision) {
    const encodedId = this.toEncodedProjectId(project);

    //TODO: refactor
    const uniqIntegrationTypes = _.uniq(_.map(revision.contracts, 'integrationType'));
    const pluginsActions = {};
    await Promise.all(uniqIntegrationTypes.map(async (t) => {
      pluginsActions[t] = await this.actionsPerIntegrationType(t);
    }));

    return {
      revision: revision.rev(),
      contractsDirectory: project.dir,
      manifest: {
        annotations: {
          name: revision.info.name,
          ...revision.info.meta
        }
      },
      _embedded: {
        promises: revision.contracts.filter(c => c.type === 'promise').map(c => this.toContract(c, project, revision, pluginsActions)),
        expectations: revision.contracts.filter(c => c.type === 'expectation').map(c => this.toContract(c, project, revision, pluginsActions))
      },
      _links: {
        self: {
          href: `/projects/${encodedId}/revision/${revision.rev()}`
        }
      }
    };
  },

  toContract(contract, project, revision, pluginsActions) {
    const encodedProjectId = this.toEncodedProjectId(project);
    const baseUri = `/projects/${encodedProjectId}/revisions/${revision.rev()}`;

    const base = {
      name: contract.name,
      type: contract.type,
      dir: contract.dir,
      integrationType: contract.integrationType,
      annotations: contract.meta,
      _links: {
        rawContent: {
          href: `${baseUri}/contracts/${contract.name}/raw-content`
        },
        ...this.extraContractActions(contract, pluginsActions, `${baseUri}/contracts/${contract.name}`)
      }
    };

    if (contract.type === 'expectation') {
      return {
        ...base,
        upstream: contract.upstream
      };
    }

    //It's a promise contract
    return {
      ...base,
      // _links: {
      //   ...base._links,
      //   consumers: {
      //     href: `${baseUri}/contracts/${contract.name}/consumers`
      //   }
      // }
    };
  },

  async actionsPerIntegrationType(integrationType) {
    const actionsPerPlugin = await config.pluginsBus.publish('AVAILABLE_ACTIONS_' + integrationType.toUpperCase(), {}, false, 'notary-core');
    let actions = {promiseActions: [], expectationActions: []};
    actionsPerPlugin.forEach((a) => {
      actions.promiseActions = actions.promiseActions.concat(...a.promiseActions);
    });

    return actions;
  },

  extraContractActions(contract, pluginsActions, actionBaseUri) {
    let actions = {};
    const actionNames = pluginsActions[contract.integrationType][`${contract.type}Actions`];

    if (!actionNames) {
      return {};
    }

    actionNames.forEach((n) => {
      actions[n] = {
        href: `${actionBaseUri}/${n}`
      }
    });

    return actions;
  },

  toEncodedProjectId(project) {
    return Buffer.from(`${project.repo}|${project.dir}`).toString('base64')
  }
}