# Guía de replicación de CRMProyecto

Esta guía permite levantar el mismo proyecto en la computadora de cada compañero.
Los comandos de instalación parten de la raíz CRMProyecto, salvo cuando se indica otra carpeta.
No hace falta crear un nuevo proyecto React ni instalar dependencias una por una.

## 1. Requisitos

- Git.
- Node.js 24 con npm. También es compatible Node.js 22.13 o posterior de la rama 22 según los requisitos de las dependencias instaladas.
- Editor de código y conexión a Internet para instalar paquetes.
- Acceso a Firebase solo para la comprobación real de Firestore.

El setup fue trabajado con Node.js 24.18.0 y npm 11.16.0.
Comprobar:

```bash
git --version
node --version
npm --version
```

Firebase Admin exige Node.js 22 o posterior y ESLint exige al menos 22.13 en esa rama.
Si una terminal no reconoce los comandos después de instalar Node, cerrarla y abrirla nuevamente.

## 2. Obtener la revisión correcta

El repositorio del proyecto es:

```bash
git clone https://github.com/GonzaloAPU/CRMProyecto.git CRMProyecto
cd CRMProyecto
git status
git branch --show-current
```

Si el equipo usa un fork, reemplazar la URL por la correspondiente.
Si ya se clonó el proyecto, entrar en esa carpeta; no clonar dentro de otra copia.

Antes de repartir la guía, el responsable debe subir los cambios a la rama elegida
y compartir su nombre o commit. Clonar solo descarga los cambios que ya están publicados.
Esta guía no publica ni hace push por sí misma.

La rama de trabajo del equipo es develop. Para obtenerla:

```bash
git fetch origin
git switch develop
git pull --ff-only
```

Crear las ramas de cada tarea desde develop y abrir sus Pull Requests hacia develop. main conserva la entrega estable.
Si existen cambios locales, revisarlos antes de actualizar; no borrarlos para resolver conflictos.
Para reproducir exactamente una entrega, el equipo también puede compartir su SHA y usar git checkout SHA_DEL_COMMIT.
Esa opción deja HEAD separado; crear una rama antes de trabajar.

## 3. Instalar las mismas dependencias

Desde la raíz, donde está package-lock.json:

```bash
npm ci
```

Este comando instala client y server con npm workspaces usando las versiones bloqueadas.
Reemplaza las dependencias instaladas localmente, por lo que es adecuado para una copia recién clonada.
No copiar node_modules de otra computadora.

La alternativa solicitada para trabajar dentro del servidor es:

```bash
cd server
npm install
npm run dev
```

npm install puede actualizar el lockfile. Para una replicación exacta, preferir npm ci desde la raíz.
No crear un segundo lockfile manualmente en server.
No usar npm audit fix --force como paso de instalación.

## 4. Arrancar el backend sin Firebase

Desde la raíz:

```bash
npm run dev:server
```

O, dentro de server después de instalar:

```bash
npm run dev
```

Ejecutar solo una de las dos opciones. Debería aparecer:

```text
Servidor funcionando en http://localhost:3000
```

Las rutas básicas funcionan sin .env ni credenciales. Al arrancar se informa que Firebase no está configurado. Una configuración Firebase parcialmente completada o inválida impide el inicio con un mensaje claro; completar las tres variables o dejarlas todas vacías para probar sin Firebase.
Mantener esta terminal abierta. Detener con Ctrl+C.

## 5. Probar la API

Abrir estas direcciones directamente en el navegador:

| Dirección | Respuesta esperada |
| --- | --- |
| http://localhost:3000/ | {"message":"API CRM funcionando correctamente"} |
| http://localhost:3000/api/test | {"ok":true,"message":"Backend CRM operativo"} |
| http://localhost:3000/api/health | {"status":"ok","service":"crm-server"} |

En PowerShell:

```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/'
Invoke-RestMethod -Uri 'http://localhost:3000/api/test'
Invoke-RestMethod -Uri 'http://localhost:3000/api/health'
```

En una terminal que tenga curl:

```bash
curl http://localhost:3000/api/test
```

Una ruta inexistente, por ejemplo /api/clientes, devuelve 404.
Esto es esperado: el CRUD de clientes aún no existe.

GET /api/test confirma que funcionan ruta, controlador y servicio.
No demuestra conectividad, permisos ni datos en Firestore.

## 6. Arrancar el frontend

En otra terminal, desde la raíz:

```bash
npm run dev:client
```

Abrir la URL que muestra Vite, normalmente http://localhost:5173.
Las vistas tienen estados sin datos y no hay un login operativo. Esto corresponde al estado actual del proyecto.

### Resolver la diferencia de puertos sin editar client

El backend usa 3000 por defecto, pero client/vite.config.js redirige /api al puerto 3001.
Para probar ambas partes por separado, mantener 3000 y usar las URLs directas anteriores.

Para probar el proxy sin cambiar el frontend, crear server/.env desde la plantilla y
cambiar solo PORT=3001. Detener y volver a iniciar el backend.
Entonces las URLs directas usan 3001 y http://localhost:5173/api/test debería devolver el JSON a través de Vite.
Si Vite eligió otro puerto, usar ese puerto en la URL.

El frontend todavía no realiza operaciones del CRM contra esa API.
npm run preview no configura este proxy de desarrollo ni inicia el backend.

## 7. Configurar Firebase cuando sea necesario

Este paso es opcional para levantar la API básica.
El equipo debe decidir si trabaja en un proyecto Firebase compartido de desarrollo
o en un proyecto independiente por compañero. Usar el mismo código no copia los datos de la base.

### Preparar el proyecto y la base

1. Abrir la [consola de Firebase](https://console.firebase.google.com/).
2. Seleccionar el proyecto del equipo o crear uno destinado al desarrollo.
3. En Firestore Database, crear la base de datos si aún no existe.
4. Usar la base (default), que es la que utiliza el código actual.
5. Seleccionar la ubicación acordada por el equipo y el modo de producción para el acceso de servidor.

Estos pasos siguen la [guía oficial de Firestore](https://firebase.google.com/docs/firestore/quickstart-server)
y la [documentación de bases de datos](https://firebase.google.com/docs/firestore/manage-databases).
No recrear una base que ya está configurada por el equipo.

### Obtener las credenciales del servidor

Desde Configuración del proyecto → Cuentas de servicio → Firebase Admin SDK,
generar una nueva clave privada cuando tengas autorización para ese proyecto.
El archivo JSON contiene project_id, client_email y private_key.
Guardar el archivo fuera de CRMProyecto.
La [documentación oficial de Firebase Admin](https://firebase.google.com/docs/admin/setup)
explica el procedimiento y los permisos necesarios.

Si no tenés permisos o la organización bloquea la creación de claves, solicitar acceso al responsable.
No usar la configuración web de Firebase ni una API key como reemplazo de la cuenta de servicio.

### Crear el archivo local de entorno

Desde la raíz, en PowerShell:

```powershell
Copy-Item -LiteralPath 'server/.env.example' -Destination 'server/.env'
```

En macOS o Linux:

```bash
cp server/.env.example server/.env
```

Hacer la copia solo si server/.env todavía no existe; si existe, editarlo conservando su configuración.

Completar localmente:

```dotenv
PORT=3000
FIREBASE_PROJECT_ID=ID_DEL_PROYECTO
FIREBASE_CLIENT_EMAIL=EMAIL_DE_LA_CUENTA_DE_SERVICIO
FIREBASE_PRIVATE_KEY="CLAVE_PRIVADA_COMPLETA_DEL_JSON"
```

Los valores anteriores son marcadores, no credenciales válidas.
Copiar la clave completa incluyendo BEGIN PRIVATE KEY y END PRIVATE KEY.
Se puede conservar en una sola línea con los caracteres literales \n del JSON:
dotenv y config/firebase.js contemplan los saltos de línea.
No agregar comas ni las llaves del JSON al archivo .env.

Comprobar que Git lo ignora:

```bash
git check-ignore server/.env
```

Debe mostrar server/.env. No publicar el contenido del archivo ni el JSON de la cuenta.
Nunca copiar estos valores a client o a variables VITE_*.
El .gitignore actual no protege automáticamente cualquier JSON descargado: guardarlo fuera del repositorio.

Reiniciar el servidor después de cambiar .env; node --watch observa el código y no garantiza recargar este archivo.
Una variable PORT ya definida en la terminal tiene precedencia sobre .env. PORT debe ser un entero entre 1 y 65535; si está definida pero vacía, también se rechaza. El correo debe tener formato válido y la clave debe ser RSA/PEM. Si falta alguna variable Firebase, el mensaje enumera sus nombres sin mostrar secretos.

## 8. Comprobar Firestore con una lectura

Solo después de completar el entorno y crear la base.
Este comando consulta como máximo un documento de clientes y no crea, actualiza ni elimina datos.
La ruta de diagnóstico GET /api/test/firestore realiza esa lectura. Abrir http://localhost:3000/api/test/firestore o usar Invoke-RestMethod con esa URL. Devuelve 200 con ok=true, message y documentsRead (0 o 1); si falla, devuelve 503 con un mensaje general. No devuelve documentos. También se puede usar el comando siguiente como alternativa.

Desde server:

```bash
node --input-type=module -e "import { db } from './config/firebase.js'; try { const result = await db.collection('clientes').limit(1).get(); console.log('Firestore conectado. Documentos leídos:', result.size); } catch (error) { console.error('No se pudo consultar Firestore:', error.message); process.exitCode = 1; } finally { await db.terminate(); }"
```

Un resultado de 0 documentos también confirma una lectura correcta; la colección puede no existir.
Esta consulta requiere acceso de la cuenta de servicio y puede contabilizar una lectura.
No usarla como un monitor continuo.

Inicializar db por sí solo no comprueba acceso remoto.
No se ejecutó esta lectura contra el Firebase del equipo durante el setup, porque no se proporcionaron credenciales.
Firebase Admin utiliza permisos del servidor; la comprobación no valida las reglas o permisos de usuarios del futuro frontend.

## 9. Comprobar calidad y compilación

Desde la raíz:

```bash
npm run lint
npm run build
```

La compilación se genera en client/dist y no se sube a Git.
El backend es JavaScript y no necesita un paso de compilación.
Para revisar únicamente el servidor:

```bash
npm run lint --workspace server
```

Para ejecutar las pruebas locales sin conexión a Firebase, desde la raíz:

```bash
node --test server/tests/*.test.js
```

Para revisar dependencias:

```bash
npm audit
```

Analizar el resultado antes de cambiar versiones. El informe de instalación del setup
indicó tres vulnerabilidades; el resultado puede cambiar con nuevas versiones o avisos.

## 10. Problemas frecuentes

| Problema | Qué revisar |
| --- | --- |
| node/npm no reconocido | Instalación de Node y nueva terminal |
| EBADENGINE | Usar Node 24 o una versión compatible de Node 22 desde 22.13 |
| npm ci rechaza el lockfile | Compartir package.json y package-lock.json de la misma revisión; no borrar el lockfile como solución |
| Cannot find package | Ejecutar npm ci desde la raíz y verificar que terminó sin errores |
| ENOTFOUND o error de descarga | Acceso a registry.npmjs.org, conexión y proxy de la red |
| EADDRINUSE | Hay otra instancia usando el puerto; detenerla o elegir otro PORT |
| Vite muestra ECONNREFUSED | Revisar el servidor y la diferencia entre 3000 y 3001 |
| API devuelve 404 | Revisar la URL; existen /, /api/test, /api/test/firestore y /api/health |
| Faltan variables Firebase | Completar las tres variables o dejarlas todas vacías para usar solo las rutas básicas |
| PORT inválido | Usar un entero entre 1 y 65535; corregir .env y variables de la terminal |
| /api/test/firestore devuelve 503 | Credenciales completas, clave válida, permisos, base (default) y conexión |
| Invalid PEM o private key | Clave completa, comillas y saltos de línea |
| PERMISSION_DENIED | Cuenta, proyecto y permisos IAM de Firestore |
| NOT_FOUND al consultar Firestore | Existencia de la base (default) y proyecto correcto |
| Cambio de .env no aplicado | Reiniciar y revisar variables definidas en la terminal |
| Login o guardar cliente desactivados | Funcionalidad pendiente, no fallo de instalación |

Si una credencial se publica por error, revocarla y reemplazarla en Firebase; quitar el archivo del último commit no invalida una clave expuesta.

## 11. Forma de trabajar en equipo

- Compartir repositorio, rama y commit de referencia.
- Versionar documentación y lockfile junto con cambios de dependencias.
- Mantener configuraciones reales solo en cada computadora.
- Definir con el equipo los nombres de colecciones antes de implementar servicios.
- Usar rutas → controladores → servicios → Firestore.
- Mantener import/export y no introducir require() ni CommonJS.
- Registrar los contratos HTTP nuevos en la referencia técnica.
- Revisar git diff antes de entregar.

Los futuros archivos clientes.routes.js, clientes.controller.js y clientes.service.js
todavía no están implementados.

## 12. Lista de comprobación para entregar la réplica

- [ ] Estoy en la rama o commit compartido por el equipo.
- [ ] Node y npm tienen versiones compatibles.
- [ ] npm ci terminó correctamente.
- [ ] / y /api/test devuelven el JSON esperado.
- [ ] /api/health responde.
- [ ] Vite muestra el frontend.
- [ ] Entiendo qué puerto usa el backend y cuál usa el proxy.
- [ ] npm run lint y npm run build pasan.
- [ ] Si necesito Firestore, configuré server/.env y comprobé una lectura.
- [ ] Git no incluye credenciales.
- [ ] Comprendo que el CRUD y la autenticación aún están pendientes.

[Volver a la documentación técnica](README.md) · [Volver al README principal](../../README.md)
