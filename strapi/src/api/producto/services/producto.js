'use strict';

const { factories } = require('@strapi/strapi');

module.exports = factories.createCoreService('api::producto.producto', ({ strapi }) => ({
  async findPublished({ page = 1, pageSize = 20, categoria, search } = {}) {
    const params = {
      status: 'published',
      fields: ['nombre', 'slug', 'descripcion', 'precio', 'categoria', 'destacado', 'activo'],
      populate: ['imagen'],
      pagination: {
        page,
        pageSize,
      },
      sort: ['categoria:asc', 'nombre:asc'],
    };

    if (categoria) {
      params.filters = { categoria };
    }

    if (search) {
      params.filters = {
        ...params.filters,
        nombre: { $containsi: search },
      };
    }

    return strapi.documents('api::producto.producto').findMany(params);
  },

  async findCategorias() {
    const productos = await strapi.documents('api::producto.producto').findMany({
      status: 'published',
      fields: ['categoria'],
    });

    const results = Array.isArray(productos) ? productos : productos.results;
    return [...new Set(results.map((p) => p.categoria).filter(Boolean))].sort();
  },

  async findDestacados(limit = 6) {
    return strapi.documents('api::producto.producto').findMany({
      status: 'published',
      filters: { destacado: true, activo: true },
      populate: ['imagen'],
      pagination: { pageSize: limit },
      sort: ['createdAt:desc'],
    });
  },
}));
