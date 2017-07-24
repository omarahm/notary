import Ajv from 'ajv';
import { VError } from 'verror';

import parser from './parser';
import configParser from './config_parser';

const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  v5: true
});

/**
 * Cross-checks producer promises with consumer expectations.
 *
 * @param {ProjectRevision} producerProjectRevision
 * @param {ProjectRevision} consumerProjectRevision
 * @param {Contract} promiseContract
 * @param {Contract} expectationContract
 * @returns {Promise.<void>}
 */
async function validate(
  producerProjectRevision,
  consumerProjectRevision,
  promiseContract,
  expectationContract
) {}

/**
 * Validates only the contract schema.
 *
 * @param {ProjectRevision} projectRevision
 * @param {Contract} contract
 * @returns {Promise.<void>}
 */
async function validateContractSchema(projectRevision, contract) {
  const contractContent =
      await parser.parse(projectRevision.workspace.resolveContractsPath(contract.dir));

  if (!contract.meta.prototypeName) {
    throw new VError('Contract definitions of type "schema" needs a meta.prototypeName field defined.')
  }

  const proto = configParser.prototypeByName(contract.meta.prototypeName);
  if (!configParser.prototypeByName(contract.meta.prototypeName)) {
    throw new VError(`Invalid prototype ${contract.meta.prototypeName}, contact your administrator to get the correct prototype name.`)
  }

  const matchesPrototype = ajv.validate(proto.compiledSchema, contractContent);

  if (!matchesPrototype) {
    throw new VError(`Contract doesn't match the prototype: ${ajv.errorsText()}`);
  }
}

/**
 * Renders a contract to an HTML string.
 *
 * @param {ProjectRevision} projectRevision
 * @param {Contract} contract
 *
 * @returns {Promise.<string>} HTML rendered contract
 */
async function renderToHtml(projectRevision, contract) {}

module.exports = {
  validate,
  validateContractSchema,
  renderToHtml
};
