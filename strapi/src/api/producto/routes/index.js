'use strict';

const coreRoutes = require('./producto');
const customRoutes = require('./custom');

module.exports = {
  routes: [...coreRoutes.routes, ...customRoutes.routes],
};
