'use strict';

const bootstrap = require('./bootstrap');

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  bootstrap,

  /**
   * An asynchronous destroy function that runs before
   * your application gets shut down.
   */
  destroy(/*{ strapi }*/) {},
};
