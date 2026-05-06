'use strict';

const { factories } = require('@strapi/strapi');

module.exports = factories.createCoreController('api::producto.producto', ({ strapi }) => ({
  async find(ctx) {
    const response = await strapi.documents('api::producto.producto').findMany({
      ...ctx.query,
      status: 'published',
    });

    const results = Array.isArray(response) ? response : response.results;
    const pagination = Array.isArray(response) ? null : response.pagination;

    const sanitizedResults = await this.sanitizeOutput(results, ctx);

    return this.transformResponse(sanitizedResults, pagination ? { pagination } : undefined);
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    const result = await strapi.documents('api::producto.producto').findOne({
      documentId: id,
      ...ctx.query,
      status: 'published',
    });

    if (!result) {
      return ctx.notFound('Producto no encontrado');
    }

    const sanitizedResult = await this.sanitizeOutput(result, ctx);

    return this.transformResponse(sanitizedResult);
  },

  async create(ctx) {
    const { body } = ctx.request;

    const result = await strapi.documents('api::producto.producto').create({
      data: body.data,
      status: body.data?.publishedAt ? 'published' : 'draft',
    });

    const sanitizedResult = await this.sanitizeOutput(result, ctx);

    return this.transformResponse(sanitizedResult);
  },

  async update(ctx) {
    const { id } = ctx.params;
    const { body } = ctx.request;

    const result = await strapi.documents('api::producto.producto').update({
      documentId: id,
      data: body.data,
    });

    const sanitizedResult = await this.sanitizeOutput(result, ctx);

    return this.transformResponse(sanitizedResult);
  },

  async delete(ctx) {
    const { id } = ctx.params;

    await strapi.documents('api::producto.producto').delete({
      documentId: id,
    });

    return this.transformResponse(null);
  },

  async categorias(ctx) {
    const productos = await strapi.documents('api::producto.producto').findMany({
      status: 'published',
      fields: ['categoria'],
    });

    const results = Array.isArray(productos) ? productos : productos.results;
    const categorias = [
      ...new Set(results.map((p) => p.categoria).filter(Boolean)),
    ].sort();

    return this.transformResponse(categorias);
  },
}));
