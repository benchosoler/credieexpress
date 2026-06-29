'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/subcategorias',
      handler: 'subcategoria.find',
    },
    {
      method: 'GET',
      path: '/subcategorias/:id',
      handler: 'subcategoria.findOne',
    },
    {
      method: 'POST',
      path: '/subcategorias',
      handler: 'subcategoria.create',
    },
    {
      method: 'PUT',
      path: '/subcategorias/:id',
      handler: 'subcategoria.update',
    },
    {
      method: 'DELETE',
      path: '/subcategorias/:id',
      handler: 'subcategoria.delete',
    },
  ],
};
