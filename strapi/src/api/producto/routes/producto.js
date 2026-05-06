'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/productos',
      handler: 'producto.find',
    },
    {
      method: 'GET',
      path: '/productos/:id',
      handler: 'producto.findOne',
    },
    {
      method: 'POST',
      path: '/productos',
      handler: 'producto.create',
    },
    {
      method: 'PUT',
      path: '/productos/:id',
      handler: 'producto.update',
    },
    {
      method: 'DELETE',
      path: '/productos/:id',
      handler: 'producto.delete',
    },
  ],
};
