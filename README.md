# Sprint Ecommerce

API REST para tienda online de productos personalizados (tazas, playeras, hoodies y más).
Los clientes eligen un diseño del catálogo y lo aplican al producto de su elección.

> Proyecto personal real — construido para digitalizar mi emprendimiento de productos personalizados.

## Stack

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=flat&logo=typeorm&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![MercadoPago](https://img.shields.io/badge/MercadoPago-00B1EA?style=flat&logo=mercadopago&logoColor=white)

## Features

### Fase 1 — Catálogo ✅ / 🔄 / ⬜

- [ ] Autenticación JWT con roles (Admin, Cliente)
- [ ] Gestión de productos con variantes (talla, color, stock)
- [ ] Catálogo de diseños con imágenes (Cloudinary)
- [ ] Asignación de diseños a productos con precio extra
- [ ] Documentación Swagger

### Fase 2 — Flujo de compra ⬜

- [ ] Carrito de compras persistente
- [ ] Gestión de órdenes con estados
- [ ] Integración con MercadoPago
- [ ] Webhook de confirmación de pago
- [ ] Actualización automática de stock

### Fase 3 — Operación ⬜

- [ ] Notificaciones por email al confirmar orden
- [ ] Panel Admin con reportes de ventas
- [ ] Exportación de órdenes
- [ ] Gestión de stock desde Admin

## Estructura del proyecto

```
sprint-ecommerce/
├── apps/
│   ├── api/          ← Backend NestJS
│   └── web/          ← Frontend Next.js (próximamente)
├── packages/
│   └── shared/       ← Tipos compartidos entre api y web
├── docker-compose.yml
├── DESIGN.md         ← Arquitectura y decisiones de diseño
└── README.md
```

## Requisitos

- Node.js 20+
- Docker y Docker Compose
- Cuenta de MercadoPago (para pagos)
- Cuenta de Cloudinary (para imágenes)

## Instalación y uso local

```bash
# Clonar el repositorio
git clone https://github.com/MCervantesGonzalez/sprint-ecommerce.git
cd sprint-ecommerce

# Instalar dependencias
cd apps/api
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Levantar base de datos con Docker
docker-compose up -d

# Correr migraciones
npm run migration:run

# Iniciar en modo desarrollo
npm run start:dev
```

## Variables de entorno

```env
# App
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=sprint_ecommerce

# JWT
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# MercadoPago
MP_ACCESS_TOKEN=
MP_WEBHOOK_SECRET=

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:3001
```

## Documentación de la API

Una vez corriendo, la documentación Swagger está disponible en:

```
http://localhost:3000/api/docs
```

## Flujo de pago

```
Cliente confirma orden
       ↓
Backend crea preferencia en MercadoPago
       ↓
Cliente es redirigido a MercadoPago
       ↓
Cliente paga
       ↓
MercadoPago llama al webhook
       ↓
Backend actualiza orden → PAID
       ↓
Email de confirmación al cliente
```

## Autor

**Miguel Angel Cervantes González**
Backend Developer | NestJS · TypeScript · PostgreSQL

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/miguel-cervantes-g)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/MCervantesGonzalez)
