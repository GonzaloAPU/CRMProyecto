# Referencia técnica del backend CRM

## Tecnologías y alcance

Node.js, Express, CORS, dotenv, Firebase Admin SDK y Cloud Firestore.
JavaScript con ES Modules: import/export y extensiones .js en imports locales.
Los scripts existentes se conservan. No se usa Sequelize, SQL, MongoDB ni TypeScript.

[Guía de instalación y replicación](GUIA_REPLICACION.md).

## Arquitectura

```text
Solicitud HTTP
    ↓
routes       Selecciona la operación
    ↓
controllers  Construye la respuesta HTTP
    ↓
services     Ejecuta la lógica de negocio
    ↓
Firestore    Lectura de diagnóstico y acceso futuro mediante config/firebase.js → db
```

El flujo actual de /api/test termina en test.service.js y devuelve un estado estático.
GET /api/test/firestore consulta Firestore mediante el servicio, sin escribir datos.
La ruta raíz es una comprobación sencilla definida en index.js.
La ruta /api/health conserva el controlador de disponibilidad anterior.

## Responsabilidades por archivo

| Archivo | Responsabilidad |
| --- | --- |
| index.js | Carga server/.env, crea Express, registra CORS/JSON/rutas/errores y escucha el puerto |
| config/env.js | Valida PORT y la configuración Firebase sin conectarse a la base |
| config/firebase.js | Carga el entorno, valida credenciales al importar, inicializa Firebase y exporta db |
| routes/test.routes.js | Router GET /, montado en /api/test |
| controllers/test.controller.js | Llama al servicio y devuelve JSON |
| services/test.service.js | Estado básico y comprobación de Firestore con una lectura de clientes limitada a 1 |
| routes/index.js | Router de GET /api/health |
| controllers/healthController.js | Devuelve el estado del servicio |
| middleware/errorHandler.js | Devuelve JSON para errores y delega si ya se enviaron cabeceras |
| models/README.md | Espacio reservado para estructuras y validaciones de datos |
| .env.example | Plantilla de configuración sin secretos |
| package.json | Dependencias y scripts del workspace crm-server |
| eslint.config.js | Reglas de JavaScript para el entorno Node.js |
| documents/ | Documentación técnica y guía de replicación |

Los modelos describirán los datos; los servicios concentrarán el acceso a Firestore.
No hay una base de datos local simulada.

## Arranque y middlewares

index.js exporta createApp(), lo que permite crear la aplicación para pruebas.
app.listen() se ejecuta solo al iniciar ese archivo directamente.

Orden actual:

1. cors(): permite solicitudes entre orígenes; no autentica usuarios.
2. express.json(): interpreta cuerpos JSON.
3. GET /.
4. Router /api/test.
5. Router /api/health.
6. Respuesta 404 para rutas no registradas.
7. Middleware de errores.

PORT usa 3000 cuando no está definida. Si se define, debe ser un entero entre 1 y 65535; valores vacíos o inválidos impiden iniciar el servidor con un mensaje claro y código de salida 1.
dotenv carga server/.env usando una ruta relativa al archivo, incluso si se inicia desde la raíz.
Las variables que ya existan en el proceso tienen precedencia sobre el archivo.

## Contrato HTTP

| Método y ruta | Estado | Respuesta |
| --- | --- | --- |
| GET / | 200 | {"message":"API CRM funcionando correctamente"} |
| GET /api/test | 200 | {"ok":true,"message":"Backend CRM operativo"} |
| GET /api/test/firestore | 200 | {"ok":true,"message":"Conexión a Firestore verificada","documentsRead":0} |
| Fallo en GET /api/test/firestore | 503 | {"ok":false,"message":"No se pudo conectar a Firestore. Revise las credenciales, los permisos y la conexión."} |
| GET /api/health | 200 | {"status":"ok","service":"crm-server"} |
| Ruta o método sin registrar | 404 | {"error":"Ruta no encontrada"} |
| Error con status 400, como JSON inválido | 400 | {"error":"Solicitud inválida"} |
| Otros errores manejados | 500 | {"error":"Error interno del servidor"} |

Las respuestas normales usan JSON. El middleware registra el error en consola sin enviar la traza al cliente.
Actualmente solo distingue status 400 y los demás errores como 500; ampliar ese criterio cuando se agreguen validaciones.

## Variables de entorno

| Variable | Uso |
| --- | --- |
| PORT | Entero entre 1 y 65535; 3000 si no está definida |
| FIREBASE_PROJECT_ID | project_id de la cuenta de servicio |
| FIREBASE_CLIENT_EMAIL | client_email de la cuenta de servicio |
| FIREBASE_PRIVATE_KEY | private_key completa, con cabeceras PEM y saltos de línea |

config/firebase.js convierte los caracteres literales `\n` de la clave en saltos de línea reales.
Reutiliza la aplicación Firebase [DEFAULT] existente, evitando inicializaciones duplicadas.
getFirestore() usa la base (default).

Al arrancar, se permiten las tres variables Firebase ausentes o vacías para probar las rutas básicas. Si se completa alguna, deben completarse las tres: de lo contrario el servidor no inicia y enumera los nombres faltantes. También valida el formato del correo y que la clave sea RSA/PEM, sin imprimir sus valores. Al usar Firestore, las tres variables son obligatorias.
La validación comprueba el formato local. Los permisos IAM, el proyecto y la conectividad se comprueban únicamente con una lectura real.
Obtener db no demuestra que las credenciales tengan acceso remoto: hace falta una operación real.

La configuración se importa bajo demanda al solicitar /api/test/firestore. Las rutas básicas siguen funcionando sin credenciales.
Los servicios pueden usar:

```js
import { db } from '../config/firebase.js'
```

Las credenciales pertenecen al servidor. No deben copiarse a client ni a variables VITE_*.
No subir server/.env ni el JSON de la cuenta de servicio. .gitignore ignora .env, node_modules, dist y logs; no ignora automáticamente todos los JSON de credenciales.
Guardar esos JSON fuera del repositorio.

## Scripts

Dentro de server:

```bash
npm install
npm run dev
npm start
npm run lint
```

- dev: node --watch index.js.
- start: node index.js.
- lint: `eslint .`.

Instalar versiones reproducibles con npm ci desde la raíz. El lockfile es compartido por los workspaces.

## Extensión futura

Cuando se autorice el CRUD:

1. Crear clientes.routes.js y registrar su router en index.js.
2. Crear clientes.controller.js para traducir HTTP a llamadas de servicio.
3. Crear clientes.service.js para la lógica y consultas de Firestore mediante db.
4. Definir estructuras y validaciones en models.
5. Incorporar autenticación y autorización antes de exponer datos privados.
6. Documentar contratos y probar resultados y errores.

Estos archivos de clientes aún no existen y no se implementó CRUD.

## Frontend y puertos

El frontend muestra vistas sin datos. No hay un login activo ni protección de rutas.
Su proxy de desarrollo /api apunta a http://127.0.0.1:3001; Express usa 3000 por defecto.
Se puede configurar PORT=3001 localmente para probar el proxy, sin modificar client.
Ese proxy solo existe en desarrollo. La configuración de despliegue todavía está pendiente.

## Verificación realizada

Durante el setup se comprobaron:

- ESLint del servidor.
- Respuestas HTTP de /, /api/test y /api/health.
- Cabecera CORS, respuesta 404 y manejo de JSON inválido.
- Inicialización de Firebase con una clave temporal en memoria y reutilización de la aplicación, sin acceso remoto.

No se verificó una conexión real al proyecto Firebase del equipo.
La instalación informó tres vulnerabilidades de dependencias en ese momento; consultar npm audit para conocer el estado actual. No se aplicó una corrección automática.

## Referencias oficiales

- [Configuración de Firebase Admin SDK](https://firebase.google.com/docs/admin/setup).
- [Inicio de Firestore con bibliotecas de servidor](https://firebase.google.com/docs/firestore/quickstart-server).
- [Bases de datos y base predeterminada](https://firebase.google.com/docs/firestore/manage-databases).
- [API de Express](https://expressjs.com/en/5x/api.html).

## Prueba HTTP de Firestore

GET /api/test/firestore realiza una lectura real y devuelve documentsRead (0 o 1). Una colección vacía también confirma acceso. No devuelve datos de clientes ni escribe documentos. Un fallo devuelve 503 sin incluir detalles internos. La ruta es de diagnóstico de desarrollo: no usarla como monitor continuo; cada llamada puede contabilizar lecturas. Antes de un despliegue público, restringir su acceso mediante la futura autenticación.

Pruebas locales sin acceso remoto: desde server, ejecutar `node --test tests/*.test.js`.


## Pruebas de validación

Desde server: `node --test tests/*.test.js`. Incluyen puertos válidos e inválidos, credenciales ausentes o parciales, correo, clave RSA y saltos de línea, lectura vacía y errores de Firestore. Las pruebas usan objetos de prueba y claves generadas en memoria; no acceden al Firebase real. Los mensajes de validación nunca incluyen la clave privada.
