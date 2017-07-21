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
  // 1. Combine all ya?ml files
  // 2. Check meta.prototype and fetch prototype definition from notary config
  // 3. Check that the contract satisfies the prototype definition
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
