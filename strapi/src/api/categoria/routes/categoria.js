'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/categorias',
      handler: 'categoria.find',
    },
    {
      method: 'GET',
      path: '/categorias/:id',
      handler: 'categoria.findOne',
    },
    {
      method: 'POST',
      path: '/categorias',
      handler: 'categoria.create',
    },
    {
      method: 'PUT',
      path: '/categorias/:id',
      handler: 'categoria.update',
    },
    {
      method: 'DELETE',
      path: '/categorias/:id',
      handler: 'categoria.delete',
    },
  ],
};
