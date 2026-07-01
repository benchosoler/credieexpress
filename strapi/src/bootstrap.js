'use strict';

async function setupPublicPermissions(strapi) {
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (!publicRole) {
    strapi.log.warn('No se encontró el rol público. Saltando configuración de permisos.');
    return;
  }

  const actionsToEnable = [
    'api::producto.producto.find',
    'api::producto.producto.findOne',
    'api::producto.producto.categorias',
    'plugin::upload.content-api.find',
    'plugin::upload.content-api.findOne',
    'api::categoria.categoria.find',
    'api::categoria.categoria.findOne',
    'api::subcategoria.subcategoria.find',
    'api::subcategoria.subcategoria.findOne',
  ];

  for (const action of actionsToEnable) {
    try {
      let permission = await strapi.query('plugin::users-permissions.permission').findOne({
        where: { action },
      });

      if (!permission) {
        permission = await strapi.query('plugin::users-permissions.permission').create({
          data: { action },
        });
      }

      const existingLinks = await strapi.db
        .connection
        .select('*')
        .from('up_permissions_role_lnk')
        .where('role_id', publicRole.id)
        .where('permission_id', permission.id);

      if (!existingLinks || existingLinks.length === 0) {
        const maxOrd = await strapi.db
          .connection
          .select(strapi.db.connection.raw('MAX(permission_ord) as max_ord'))
          .from('up_permissions_role_lnk')
          .where('role_id', publicRole.id);

        const nextOrd = (maxOrd[0]?.max_ord || 0) + 1;

        await strapi.db
          .connection
          .insert({
            permission_id: permission.id,
            role_id: publicRole.id,
            permission_ord: nextOrd,
          })
          .into('up_permissions_role_lnk');

        strapi.log.info(`Permiso público habilitado: ${action}`);
      }
    } catch (error) {
      strapi.log.warn(`No se pudo habilitar permiso ${action}: ${error.message}`);
    }
  }
}

// Image URL per subcategoria. Used to populate producto.imagenUrl during seed.
const IMAGEN_POR_CATEGORIA = {
  'Balanzas':              '/uploads/products/balanza-comercial.png',
  'Freezers':              '/uploads/products/freezer-1.jpg',
  'Cortadoras de fiambre': '/uploads/products/slicer-prosciutto.jpg',
  'Heladeras':             '/uploads/products/heladera.svg',
  'Estanterías':           '/uploads/products/estanteria.svg',
  'Góndolas':              '/uploads/products/gondola.svg',
  'Accesorios':            '/uploads/products/accesorio.svg',
  'Otros':                 '/uploads/products/accesorio.svg',
};

async function seedProductos(strapi) {
  const count = await strapi.query('api::producto.producto').count();

  if (count > 0) {
    strapi.log.info('Ya existen productos. Saltando seed.');
    return;
  }

  const productos = [
    {
      nombre: 'Balanza Digital Premium 30kg',
      slug: 'balanza-digital-premium-30kg',
      descripcion: 'Balanza digital de alta precisión con plataforma de acero inoxidable. Ideal para comercios de alimentos. Capacidad 30kg, resolución 5g.',
      precio: 85000,
      categoria: 'Balanzas',
      destacado: true,
      activo: true,
      publishedAt: new Date(),
    },
    {
      nombre: 'Balanza Electrónica Standard 15kg',
      slug: 'balanza-electronica-standard-15kg',
      descripcion: 'Balanza electrónica compacta con display LED. Perfecta para verdulerías y almacenes. Capacidad 15kg.',
      precio: 55000,
      categoria: 'Balanzas',
      destacado: false,
      activo: true,
      publishedAt: new Date(),
    },
    {
      nombre: 'Balanza de Columna 50kg',
      slug: 'balanza-de-columna-50kg',
      descripcion: 'Balanza de columna con torre de visualización para el cliente. Doble display. Capacidad 50kg.',
      precio: 120000,
      categoria: 'Balanzas',
      destacado: false,
      activo: true,
      publishedAt: new Date(),
    },
    {
      nombre: 'Heladera Comercial Exhibidora 500L',
      slug: 'heladera-comercial-exhibidora-500l',
      descripcion: 'Heladera exhibidora con puerta de vidrio, iluminación LED interior. Ideal para bebidas y lácteos. 500 litros.',
      precio: 450000,
      categoria: 'Heladeras',
      destacado: true,
      activo: true,
      publishedAt: new Date(),
    },
    {
      nombre: 'Heladera Comercial Acero 400L',
      slug: 'heladera-comercial-acero-400l',
      descripcion: 'Heladera comercial de acero inoxidable con 2 puertas. Interior de aluminio. 400 litros de capacidad.',
      precio: 380000,
      categoria: 'Heladeras',
      destacado: false,
      activo: true,
      publishedAt: new Date(),
    },
    {
      nombre: 'Heladera Pizzera Exhibidora',
      slug: 'heladera-pizzera-exhibidora',
      descripcion: 'Heladera exhibidora para pizzerías con balcón superior. Conserva masa y toppings. Temperatura controlada.',
      precio: 520000,
      categoria: 'Heladeras',
      destacado: true,
      activo: true,
      publishedAt: new Date(),
    },
    {
      nombre: 'Freezer Horizontal 300L',
      slug: 'freezer-horizontal-300l',
      descripcion: 'Freezer horizontal con tapa de vidrio. Gran capacidad de almacenamiento. 300 litros.',
      precio: 320000,
      categoria: 'Freezers',
      destacado: true,
      activo: true,
      publishedAt: new Date(),
    },
    {
      nombre: 'Freezer Vertical 250L',
      slug: 'freezer-vertical-250l',
      descripcion: 'Freezer vertical con 4 cajones interiores. Puerta con cierre hermético. 250 litros.',
      precio: 290000,
      categoria: 'Freezers',
      destacado: false,
      activo: true,
      publishedAt: new Date(),
    },
    {
      nombre: 'Freezer Conservador 500L',
      slug: 'freezer-conservador-500l',
      descripcion: 'Freezer conservador de gran capacidad para negocios de alimentos congelados. 500 litros.',
      precio: 480000,
      categoria: 'Freezers',
      destacado: false,
      activo: true,
      publishedAt: new Date(),
    },
    {
      nombre: 'Estantería Metálica 180x90x40',
      slug: 'estanteria-metalica-180x90x40',
      descripcion: 'Estantería metálica de 5 estantes reforzados. Medidas: 180cm alto x 90cm ancho x 40cm profundo.',
      precio: 45000,
      categoria: 'Estanterías',
      destacado: false,
      activo: true,
      publishedAt: new Date(),
    },
    {
      nombre: 'Estantería Reforzada 200x100x50',
      slug: 'estanteria-reforzada-200x100x50',
      descripcion: 'Estantería reforzada para carga pesada. 6 estantes. Ideal para depósitos y almacenes.',
      precio: 65000,
      categoria: 'Estanterías',
      destacado: false,
      activo: true,
      publishedAt: new Date(),
    },
    {
      nombre: 'Góndola Central 160x120x35',
      slug: 'gondola-central-160x120x35',
      descripcion: 'Góndola central de exhibición con 4 estantes reforzados y base con zócalo. Medidas: 160cm alto x 120cm ancho x 35cm profundo.',
      precio: 180000,
      categoria: 'Góndolas',
      destacado: true,
      activo: true,
      publishedAt: new Date(),
    },
    {
      nombre: 'Góndola Pared 180x100x40',
      slug: 'gondola-pared-180x100x40',
      descripcion: 'Góndola de pared con ganchos y estantes regulables. Perfecta para maximizar espacio.',
      precio: 150000,
      categoria: 'Góndolas',
      destacado: false,
      activo: true,
      publishedAt: new Date(),
    },
    {
      nombre: 'Góndola Isla Doble Faz',
      slug: 'gondola-isla-doble-faz',
      descripcion: 'Góndola isla de doble faz para exhibición central. 5 estantes por lado. Incluye cabezal publicitario.',
      precio: 250000,
      categoria: 'Góndolas',
      destacado: true,
      activo: true,
      publishedAt: new Date(),
    },
    {
      nombre: 'Cortadora de Fiambre Profesional 250mm',
      slug: 'cortadora-de-fiambre-profesional-250mm',
      descripcion: 'Cortadora de fiambre profesional con cuchilla de 250mm. Motor de alta potencia. Base de aluminio.',
      precio: 195000,
      categoria: 'Cortadoras de fiambre',
      destacado: true,
      activo: true,
      publishedAt: new Date(),
    },
    {
      nombre: 'Cortadora de Fiambre Semi 220mm',
      slug: 'cortadora-de-fiambre-semi-220mm',
      descripcion: 'Cortadora semi-profesional con cuchilla de 220mm. Ideal para almacenes y minimercados.',
      precio: 140000,
      categoria: 'Cortadoras de fiambre',
      destacado: false,
      activo: true,
      publishedAt: new Date(),
    },
    {
      nombre: 'Cortadora Industrial 300mm',
      slug: 'cortadora-industrial-300mm',
      descripcion: 'Cortadora industrial de alto rendimiento. Cuchilla de 300mm templada. Motor trifásico.',
      precio: 350000,
      categoria: 'Cortadoras de fiambre',
      destacado: false,
      activo: true,
      publishedAt: new Date(),
    },
    {
      nombre: 'Canasto Metálico Reforzado',
      slug: 'canasto-metalico-reforzado',
      descripcion: 'Canasto metálico reforzado para exhibición de productos. Con ruedas. Capacidad 80kg.',
      precio: 25000,
      categoria: 'Accesorios',
      destacado: false,
      activo: true,
      publishedAt: new Date(),
    },
    {
      nombre: 'Etiquetadora de Precios',
      slug: 'etiquetadora-de-precios',
      descripcion: 'Etiquetadora manual de precios con 2 líneas de texto. Incluye 5 rollos de etiquetas.',
      precio: 15000,
      categoria: 'Accesorios',
      destacado: false,
      activo: true,
      publishedAt: new Date(),
    },
    {
      nombre: 'Dispenser de Bolsas',
      slug: 'dispenser-de-bolsas',
      descripcion: 'Dispenser de bolsas para frutas y verduras. Acero inoxidable. Incluye 1000 bolsas.',
      precio: 12000,
      categoria: 'Accesorios',
      destacado: false,
      activo: true,
      publishedAt: new Date(),
    },
  ];

  for (const producto of productos) {
    const dataWithImage = {
      ...producto,
      imagenUrl: IMAGEN_POR_CATEGORIA[producto.categoria] || null,
    };
    await strapi.documents('api::producto.producto').create({
      data: dataWithImage,
      status: 'published',
    });
  }

  strapi.log.info(`Seed completado: ${productos.length} productos creados.`);
}

async function migrateTaxonomia(strapi) {
  const PARENTS = [
    { nombre: 'Electrodomésticos',        slug: 'electrodomesticos',        orden: 1 },
    { nombre: 'Artículos del Hogar',      slug: 'articulos-del-hogar',      orden: 2 },
    { nombre: 'Artículos Gastronómicos',  slug: 'articulos-gastronomicos',  orden: 3 },
  ];

  const MAPPING = {
    'Balanzas':              { parent: 'articulos-gastronomicos', sub: 'balanzas' },
    'Cortadoras de fiambre': { parent: 'articulos-gastronomicos', sub: 'cortadoras-de-fiambre' },
    'Heladeras':             { parent: 'electrodomesticos',        sub: 'heladeras' },
    'Freezers':              { parent: 'electrodomesticos',        sub: 'freezers' },
    'Estanterías':           { parent: 'articulos-del-hogar',      sub: 'estanterias' },
    'Góndolas':              { parent: 'articulos-del-hogar',      sub: 'gondolas' },
    'Accesorios':            { parent: 'articulos-del-hogar',      sub: 'accesorios' },
    'Otros':                 { parent: 'articulos-del-hogar',      sub: 'otros' },
  };

  strapi.log.info('Iniciando migración de taxonomía…');

  // Phase 1: upsert parent categories
  for (const p of PARENTS) {
    try {
      const result = await strapi.documents('api::categoria.categoria').findMany({
        filters: { slug: p.slug },
      });
      const existing = Array.isArray(result) ? result[0] : (result?.results?.[0] || null);
      if (!existing) {
        await strapi.documents('api::categoria.categoria').create({
          data: p,
        });
        strapi.log.info(`Categoría creada: ${p.nombre}`);
      }
    } catch (e) {
      strapi.log.warn(`Error creando categoría ${p.nombre}: ${e.message}`);
    }
  }

  // Phase 2: upsert subcategories and link products
  for (const [legacyEnum, { parent, sub }] of Object.entries(MAPPING)) {
    try {
      const catRes = await strapi.documents('api::categoria.categoria').findMany({
        filters: { slug: parent },
      });
      const catDoc = Array.isArray(catRes) ? catRes[0] : (catRes?.results?.[0] || null);
      if (!catDoc) {
        strapi.log.warn(`Categoría padre ${parent} no encontrada para ${legacyEnum}`);
        continue;
      }

      const subRes = await strapi.documents('api::subcategoria.subcategoria').findMany({
        filters: { slug: sub },
      });
      let subDoc = Array.isArray(subRes) ? subRes[0] : (subRes?.results?.[0] || null);

      if (!subDoc) {
        subDoc = await strapi.documents('api::subcategoria.subcategoria').create({
          data: {
            nombre: legacyEnum,
            slug: sub,
            categoria: { connect: [catDoc.documentId] },
          },
        });
        strapi.log.info(`Subcategoría creada: ${legacyEnum}`);
      }

      // Phase 3: link products that still have empty subcategorias
      const response = await strapi.documents('api::producto.producto').findMany({
        filters: { categoria: legacyEnum },
        populate: { subcategorias: true },
      });
      const prods = Array.isArray(response) ? response : (response?.results || []);

      strapi.log.info(`Migración: ${legacyEnum} → ${prods.length} productos`);

      for (const prod of prods) {
        if (!prod.subcategorias || prod.subcategorias.length === 0) {
          try {
            await strapi.documents('api::producto.producto').update({
              documentId: prod.documentId,
              data: {
                subcategorias: { connect: [subDoc.documentId] },
              },
            });
            strapi.log.info(`Producto ${prod.documentId} vinculado a ${sub}`);
          } catch (e) {
            strapi.log.warn(`Producto ${prod.documentId}: ${e.message}`);
          }
        }
      }
    } catch (e) {
      strapi.log.warn(`Error procesando ${legacyEnum}: ${e.message}`);
    }
  }

  strapi.log.info('Migración de taxonomía completada.');
}

module.exports = async ({ strapi }) => {
  await setupPublicPermissions(strapi);
  await seedProductos(strapi);
  await migrateTaxonomia(strapi);
  await linkMissingProducts(strapi);
};

// Idempotent fallback: link ALL products to the subcategoria matching their
// legacy `categoria` enum, regardless of current state. Strapi v5's M2M
// `connect` is idempotent — adding the same relation twice is a no-op.
async function linkMissingProducts(strapi) {
  const MAPPING = {
    'Balanzas':              'balanzas',
    'Cortadoras de fiambre': 'cortadoras-de-fiambre',
    'Heladeras':             'heladeras',
    'Freezers':              'freezers',
    'Estanterías':           'estanterias',
    'Góndolas':              'gondolas',
    'Accesorios':            'accesorios',
    'Otros':                 'otros',
  };

  strapi.log.info('Vinculando productos a subcategorías (forzar)…');

  // Use pagination explicitly because Document Service findMany has a default
  // page size that can leave products unprocessed.
  const allProds = [];
  let page = 1;
  const pageSize = 100;
  while (true) {
    const result = await strapi.documents('api::producto.producto').findMany({
      page,
      pageSize,
    });
    if (!Array.isArray(result) || result.length === 0) break;
    allProds.push(...result);
    if (result.length < pageSize) break;
    page++;
  }
  strapi.log.info(`  Total productos encontrados: ${allProds.length}`);

  // Build subcategoria cache
  const subCache = new Map();
  for (const [legacy, subSlug] of Object.entries(MAPPING)) {
    const subRes = await strapi.documents('api::subcategoria.subcategoria').findMany({
      filters: { slug: subSlug },
    });
    const subDoc = Array.isArray(subRes) ? subRes[0] : null;
    if (subDoc) subCache.set(legacy, subDoc);
  }
  strapi.log.info(`  Cache de subcategorías: ${subCache.size} entradas`);

  let ok = 0;
  let fail = 0;
  let unmapped = 0;

  for (const prod of allProds) {
    const subDoc = subCache.get(prod.categoria);
    if (!subDoc) {
      unmapped++;
      continue;
    }
    try {
      // Try the Strapi v5 Document Service syntax for setting relations
      await strapi.documents('api::producto.producto').update({
        documentId: prod.documentId,
        data: { subcategorias: [subDoc.documentId] },
      });
      ok++;
    } catch (e) {
      strapi.log.warn(`  ✗ ${prod.nombre} (${prod.documentId}): ${e.message}`);
      fail++;
    }
  }

  strapi.log.info(
    `linkMissingProducts: ${ok} OK, ${fail} fallaron, ${unmapped} sin mapeo (de ${allProds.length} total).`
  );
}

// (module.exports at line 389)

