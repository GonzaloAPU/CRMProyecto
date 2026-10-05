# CRMProyecto

Panel de control de clientes con frontend React/Vite y backend Node.js/Express, preparado para Cloud Firestore mediante Firebase Admin SDK.

## Estado actual

- Frontend con vistas de dashboard, clientes, detalle y login.
- Backend Express con CORS, JSON, rutas de prueba y manejo de errores.
- Configuración de Firebase mediante variables de entorno.
- Sin CRUD de clientes, autenticación ni permisos implementados.
- Sin FakeStoreAPI ni persistencia en localStorage/sessionStorage.
- Las vistas muestran estados sin datos; la creación de clientes está deshabilitada.
- El frontend todavía no consume el nuevo backend.

## Documentación

- [Guía de replicación para compañeros](server/documents/GUIA_REPLICACION.md): instalación desde cero, Firebase, comprobaciones y solución de problemas.
- [Referencia técnica del backend](server/documents/README.md): archivos, arquitectura, rutas y decisiones.
- [Variables de entorno](server/.env.example): plantilla sin credenciales.

## Estructura

```text
CRMProyecto/
├── client/
│   ├── src/
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── package.json
├── server/
│   ├── config/
│   ├── controllers/
│   ├── documents/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── .env.example
│   ├── eslint.config.js
│   ├── index.js
│   └── package.json
├── .gitignore
├── package.json
└── package-lock.json
```

npm workspaces administra ambos paquetes. El archivo de bloqueo compartido está en la raíz. Las carpetas node_modules y dist se generan localmente y no se versionan.

## Inicio rápido

Usar Node.js 24 y npm. Desde la raíz:

```bash
npm ci
npm run dev:server
```

Abrir [http://localhost:3000/](http://localhost:3000/) y [http://localhost:3000/api/test](http://localhost:3000/api/test). Estas rutas funcionan sin credenciales.

En otra terminal, desde la raíz:

```bash
npm run dev:client
```

Vite muestra la URL del frontend en la terminal, normalmente http://localhost:5173.

El backend usa 3000 y el proxy actual de Vite usa 3001. Para probar el proxy sin editar el frontend, usar PORT=3001 en server/.env y reiniciar el backend. La guía explica ambas opciones.

## Comandos desde la raíz

| Comando | Resultado |
| --- | --- |
| npm ci | Instala las versiones del package-lock.json |
| npm run dev / npm run dev:client | Frontend en desarrollo |
| npm run dev:server | Backend con recarga automática |
| npm run start:server | Backend sin recarga automática |
| npm run lint | ESLint de ambos paquetes |
| npm run build | Compilación del frontend en client/dist |
| npm run preview | Revisión local de la compilación; no inicia el backend |

También se puede ejecutar el backend con cd server, npm install y npm run dev. Para replicar las mismas versiones, preferir npm ci desde la raíz.

## Trabajo en equipo

Este repositorio es una base de práctica profesional. Seguir las instrucciones del TP01 cuando correspondan.

1. Hacer fork o clonar el repositorio indicado por el equipo.
2. Crear una rama: git switch -c codex/nombre-mejora.
3. Mantener las credenciales fuera del repositorio.
4. Ejecutar lint y build antes de entregar cambios.
5. Crear commits con un propósito claro y abrir un Pull Request.
6. Incluir package-lock.json si se modifican dependencias.

La guía contiene los comandos de clonación y explica cómo compartir una revisión reproducible.

## Licencia de uso

El código fuente está bajo licencia MIT.

La documentación y material pedagógico están bajo Creative Commons Attribution 4.0.

© 2026 — Cátedra Legislación y Ejercicio Profesional - Carrera Analista Programador Universitario - FI UNJu
