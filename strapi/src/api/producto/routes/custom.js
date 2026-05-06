'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/productos/categorias',
      handler: 'producto.categorias',
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
