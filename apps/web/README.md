# Sprint Ecommerce — Frontend

Frontend de la tienda online de productos personalizados.

## Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=flat&logo=shadcnui&logoColor=white)

## Decisiones técnicas

| Herramienta           | Uso                           |
| --------------------- | ----------------------------- |
| Next.js 14 App Router | Framework principal           |
| Tailwind CSS          | Estilos                       |
| shadcn/ui             | Componentes UI                |
| TanStack Query        | Fetching y caché              |
| Zustand               | Estado global (carrito, auth) |
| React Hook Form + Zod | Formularios y validación      |

## Estructura

```
apps/web/
├── app/
│   ├── (public)/
│   │   ├── page.tsx               ← Home / catálogo
│   │   ├── products/
│   │   │   └── [id]/page.tsx      ← Detalle de producto
│   │   └── designs/page.tsx       ← Catálogo de diseños
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (shop)/
│   │   ├── cart/page.tsx
│   │   └── orders/
│   │       ├── page.tsx           ← Mis órdenes
│   │       └── [id]/page.tsx      ← Detalle de orden
│   └── (admin)/
│       ├── dashboard/page.tsx
│       ├── products/page.tsx
│       └── orders/page.tsx
├── components/
│   ├── ui/                        ← shadcn/ui
│   ├── layout/                    ← Navbar, Footer
│   ├── products/                  ← ProductCard, ProductList
│   ├── cart/                      ← CartDrawer, CartItem
│   └── orders/                    ← OrderCard, OrderStatus
├── lib/
│   ├── api.ts                     ← Cliente HTTP
│   └── utils.ts
├── hooks/                         ← Custom hooks TanStack Query
├── store/                         ← Zustand stores
└── types/                         ← Tipos compartidos
```

## Fases

### Fase 1 — Setup y catálogo ⬜

- [x] Configuración Tailwind + shadcn/ui
- [x] Cliente HTTP hacia el backend
- [x] Instalación Next.js 14 con App Router
- [x] Página Home con catálogo de productos
- [x] Página detalle de producto con diseños disponibles

### Fase 2 — Autenticación ⬜

- [x] Página Login
- [x] Página Register
- [x] Zustand store para auth (token, usuario)
- [x] Middleware de protección de rutas
- [x] Redirección por rol (ADMIN/CLIENT)

### Fase 3 — Flujo de compra ⬜

- [x] Carrito con drawer lateral
- [x] Zustand store para carrito
- [x] Página checkout
- [x] Integración con MercadoPago (redirect)
- [x] Página mis órdenes
- [x] Página detalle de orden

### Fase 4 — Panel Admin ⬜

- [x] Dashboard con métricas
- [x] Gestión de productos y variantes
- [x] Gestión de diseños con upload de imagen
- [x] Gestión de órdenes con cambio de status
- [x] Exportación de órdenes CSV

## Variables de entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Instalación

```bash
cd apps/web
npm install
cp .env.example .env.local
npm run dev
```

## Notas de diseño

- App Router de Next.js 14
- Route Groups para separar layouts por rol
- Server Components por defecto, Client Components solo cuando se necesita interactividad
- TanStack Query para caché de datos del servidor
- Zustand solo para estado del cliente (carrito, auth token)

## Autor

**Miguel Angel Cervantes González**
Backend Developer | NestJS · TypeScript · PostgreSQL

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/miguel-cervantes-g)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/MCervantesGonzalez)
