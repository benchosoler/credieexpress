'use strict';

const coreRoutes = require('./categoria');

module.exports = {
  routes: [...coreRoutes.routes],
};
