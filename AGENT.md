# CREDIEXPRESS - Documentación del Proyecto

## 📋 Resumen Ejecutivo

**CREDIEXPRESS - PAGO DIARIO** es una plataforma digital de financiación flexible para comercios. La empresa vende productos (balanzas, heladeras, freezers, estanterías, cortadoras de fiambre, etc.) con planes de cuotas semanales o diarias personalizados según la capacidad de pago de cada cliente.

**Objetivo:** Crear una landing page + catálogo online integrado con Strapi CMS para expandir el negocio y permitir que los clientes consulten productos y planes de financiación de forma digital.

---

## 🏢 Información de la Empresa

### Antecedentes
- **Fundación:** 2005 (trabajando para empresas del rubro)
- **Negocio propio desde:** 2014
- **Modelo:** Financiación de productos para comercios con pagos diarios/semanales
- **Clientes actuales:** ~95% por relación de confianza y recomendaciones
- **Ubicación:** Argentina (Zona Buenos Aires)

### Propuesta de Valor
1. **Planes 100% personalizados** — Cada cliente tiene una capacidad de pago distinta, adaptamos el plan
2. **Relación de confianza** — Trato cercano, visitas regulares, conocimiento de la vida del cliente
3. **Postventa excepcional** — Seguimiento post-compra, consulta de satisfacción
4. **Servicio técnico rápido** — Técnicos recomendados sin esperar al servicio oficial
5. **Devoluciones y cambios** — Si el producto no es lo esperado, se cambia
6. **Experiencia de 10+ años** — Asesoramiento experto en qué producto necesita realmente el cliente

### Estructura Actual
- **Dueño:** Trabaja solo
- **Equipo:** 1 cobrador de confianza
- **Expansión planificada:** Contratar cobradores con motos que repliquen el modelo de atención personalizada

---

## 🎨 Identidad Visual

### Logo
- **Nombre:** CREDIEXPRESS
- **Subtítulo:** PAGO DIARIO
- **Diseño:** CE en azul (#1E90FF) y verde (#00C853)
- **Estilo:** Moderno, neon/vibrante (basado en referencias del cliente)

### Colores
- **Primario:** Azul (#1E90FF)
- **Secundario:** Verde (#00C853)
- **Fondo:** Blanco o gris muy claro
- **Acentos:** Amarillo/dorado (para promociones/destacados)
- **Paleta alternativa:** Posibilidad de usar tonos neon/magenta (estilo del material de referencia)

### Tipografía
- Sin especificar aún — usar defaults de Tailwind (Sans moderna)

---

## 🛍️ Catálogo de Productos

### Categorías Disponibles
- Balanzas (múltiples modelos por calidad)
- Heladeras
- Freezers
- Estanterías
- Cortadoras de fiambre
- Gondrolas
- Accesorios
- Otros

### Estructura de Productos (Strapi)
```
{
  "nombre": "Gondola Central 160x120x35",
  "precio": 45000,
  "descripcion": "Estantería comercial con 4 estantes reforzados...",
  "imagen": "url_imagen",
  "categoria": "Estanterías",
  "variantes": "Se cargan como productos separados"
}
```

### Notas Importantes
- **Variantes:** Se cargan como productos distintos dentro de la misma categoría
  - Ej: "Balanza A - Modelo Premium", "Balanza A - Modelo Standard"
- **No hay carrito:** Solo consulta por WhatsApp
- **Filtros:** Por categoría

---

## 🌐 Landing Page - Estructura

### 1. Navbar
- Logo CREDIEXPRESS + PAGO DIARIO
- Links a secciones: Por qué elegirnos, Cómo funciona, Catálogo, Contacto
- Botón WhatsApp destacado (verde)
- Responsive (menú hamburguesa en mobile)

### 2. Hero Section
- Título: "Financiación Flexible para tu Comercio"
- Subtítulo: "Productos de calidad con cuotas adaptadas a tu capacidad de pago"
- Imagen de fondo o patrón moderno
- 2 CTAs:
  - "Ver Catálogo" (lleva a #catalogo)
  - "Consultar por WhatsApp" (abre chat)

### 3. Por qué Elegirnos (SECCIÓN MÁS IMPORTANTE)
Destacar los 6 pilares del negocio:
- ✅ Planes de cuotas personalizados (no hay dos clientes iguales)
- ✅ Atención cercana y de confianza (trato humano, no corporativo)
- ✅ Seguimiento post-compra (nos importa que estés satisfecho)
- ✅ Servicio técnico rápido (sin esperar semanas)
- ✅ Cambios y devoluciones sin problema
- ✅ 10+ años de experiencia (sabemos qué producto necesitas)

Formato: Tarjetas con icono, título y descripción breve

### 4. Cómo Funciona
3 pasos simples:
1. **Elegís el producto** — Explorá nuestro catálogo
2. **Armamos tu plan** — Cuotas adaptadas a ti
3. **Recibís y listo** — Entrega rápida, nosotros cuidamos todo

### 5. Catálogo
- Grilla de productos traídos de Strapi
- Cada tarjeta: imagen, nombre, categoría, precio, botón "Consultar"
- Filtros por categoría (dropdown o tabs)
- Loading state mientras trae datos
- Error state si falla la API

### 6. Contacto
- Número: **11-6466-5339** (WhatsApp)
- Botón directo a chat de WhatsApp
- Sin formulario (todo por WhatsApp)

### 7. Footer
- Logo + nombre
- Links rápidos
- WhatsApp
- Frase corta del negocio

---

## 💻 Stack Tecnológico

### Frontend
- **Framework:** Astro
- **Estilos:** Tailwind CSS
- **Animations:** CSS suave (fade-in, slide-up)
- **Estructura:** Astro con componentes reutilizables

### Backend / CMS
- **CMS:** Strapi
- **Ambiente inicial:** Local (`http://localhost:1337`)
- **Hosting final:** Strapi Cloud (sin cambios de código, solo variable de entorno)
- **Base de datos inicial:** SQLite
- **Base de datos final:** PostgreSQL (en Strapi Cloud)

### Variables de Entorno
```
PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=token_aqui (si es necesario autenticación)
```

### Integración Strapi - API
- **Endpoint:** `GET /api/productos?populate=imagen`
- **Formato respuesta:** REST JSON
- **Construcción URL imagen:** `${PUBLIC_STRAPI_URL}${producto.imagen.url}`

---

## 📱 Responsividad & UX

- **Mobile First:** Diseño pensado para celular primero
- **Breakpoints:** Tailwind estándar (sm, md, lg, xl)
- **Navegación mobile:** Menú hamburguesa
- **Botón WhatsApp:** Fijo en mobile (sticky)
- **Imágenes:** Lazy loading, optimizadas

---

## 🚀 Fases de Desarrollo

### Fase 1: Setup Local
- [ ] Crear proyecto Astro
- [ ] Instalar Tailwind CSS
- [ ] Instalar Strapi localmente
- [ ] Crear Content Type `producto`
- [ ] Cargar productos de prueba

### Fase 2: Landing Page
- [ ] Navbar + Footer
- [ ] Hero Section
- [ ] Sección "Por qué elegirnos"
- [ ] Sección "Cómo funciona"
- [ ] Sección Contacto

### Fase 3: Catálogo
- [ ] Componente ProductGrid
- [ ] Integración con API Strapi
- [ ] Filtros por categoría
- [ ] Loading & Error states
- [ ] Responsive design

### Fase 4: Testing & Migración
- [ ] Testing local
- [ ] Deploy a Strapi Cloud
- [ ] Cambiar variable de entorno
- [ ] Testing en producción
- [ ] Optimizaciones finales

---

## 📞 Contacto & Datos Importantes

- **WhatsApp:** 11-6466-5339
- **Ubicación:** Buenos Aires, Argentina
- **Horario:** Laboral (lunes a viernes, presumiblemente)
- **Persona de contacto:** El dueño del negocio

---

## 🔐 Consideraciones de Seguridad & Performance

- **CORS:** Configurar Strapi para permitir solicitudes desde el dominio
- **Optimización:** Lazy load de imágenes, caché de API
- **Mobile:** Diseño responsivo, peso de imágenes optimizado
- **Escalabilidad:** Estructura lista para miles de productos

---

## 📝 Próximos Pasos

1. ✅ Crear estructura Astro + Strapi
2. ✅ Configurar ambiente local
3. ✅ Diseñar y maquetar landing
4. ✅ Integrar catálogo con API
5. ✅ Testing completo
6. ✅ Deploy a Strapi Cloud
7. ✅ Configurar dominio final
8. ✅ Capacitación al cliente para gestionar productos en Strapi

---

## 📚 Referencias & Recursos

- **Astro Docs:** https://docs.astro.build
- **Tailwind CSS:** https://tailwindcss.com
- **Strapi Docs:** https://docs.strapi.io
- **WhatsApp API:** https://www.whatsapp.com/business/

---

**Última actualización:** Mayo 2026
**Estado:** En desarrollo
**Responsable:** Benicio (Desarrollador)
