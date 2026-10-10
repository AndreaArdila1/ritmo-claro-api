## DESARROLLO PROGRESIVO

## Parte 2 Preparar el proyecto y la arquitectura

## Propósito

Crear un proyecto NestJS reproducible y una estructura donde cada pieza tenga una responsabilidad clara.

## Conceptos que repasas

NestJS agrupa cada dominio en un módulo. El controller recibe HTTP y delega; el service aplica reglas; los DTO definen entradas; la inyección de dependencias conecta las piezas. Separar estas responsabilidades hace visible dónde diagnosticar un fallo.

## Instrucciones paso a paso

- 1. Comprueba las versiones de Node y npm con node --version y npm --version.

- 2. Crea el proyecto con npx @nestjs/cli@11 new ritmo-claro-api --package-manager npm y confirma que npm run start:dev responde.

- 3. Instala el stack trabajado en clase: Config, Prisma 7 con PostgreSQL, JWT, Passport, bcrypt, class-validator, class-transformer, Swagger y Helmet.

- 4. Genera o crea los módulos prisma, auth y habitos con sus controllers, services y carpetas dto cuando correspondan.

- 5. Importa los módulos funcionales desde AppModule y conserva main.ts como punto de configuración global.

- 6. Apoyo con IA permitido: entrega el árbol de archivos y pide una auditoría de responsabilidades. Prohíbe que escriba contenido de los archivos.

## Responsabilidad de los archivos involucrados

| Archivo o carpeta | Responsabilidad |
| --- | --- |
| src/main.ts | Arranca la aplicación y concentra configuración global. |
| src/app.module.ts | Conecta los módulos que forman la aplicación. |
| src/auth | Agrupa identidad, credenciales, JWT y guards de autenticación. |
| src/habitos | Agrupa el recurso de negocio y su CRUD. |
| src/prisma | Expone el acceso compartido a PostgreSQL mediante Prisma. |

## Resultado esperado

El servidor inicia sin errores y el árbol del proyecto permite localizar cada responsabilidad sin mezclar lógica de negocio en main.ts.

## Lista breve de verificación

- El proyecto arranca en modo desarrollo.

- ☐AppModule importa los módulos necesarios.

- Puedes explicar controller, service, module, DTO e inyección.

## Evidencia que presentas

- Captura o registro de la respuesta inicial local.

- Árbol de src y commit del proyecto base.


## DESARROLLO PROGRESIVO

## Parte 6 Aplicar roles y propiedad

## Propósito

Impedir accesos entre usuarios y reservar la consulta global para el personal autorizado.

## Conceptos que repasas

Autenticación responde quién eres; autorización decide qué puedes hacer. RBAC compara el rol del token con el requerido por la ruta. Ownership compara la identidad autenticada con el dueño del recurso. Son controles distintos y ambos deben probarse.

## Instrucciones paso a paso

- 1. Protege todas las rutas de hábitos con JwtAuthGuard.

- 2. Verifica propiedad antes de entregar, editar o eliminar un hábito por id.

- 3. Define el decorador de roles y un RolesGuard que lea la metadata de la ruta.

- 4. Agrega GET /habitos/admin/todos con guard de JWT y requisito ADMIN. Ubica la ruta para que no sea confundida con /habitos/:id.

- 5. Limita la respuesta administrativa a datos necesarios y excluye siempre passwordHash.

- 6. Prueba con usuario A, usuario B y ADMIN. A crea; B intenta consultar, editar y eliminar; ADMIN consulta el listado global.

- 7. Apoyo con IA permitido: entrega tu matriz de permisos y resultados; pide que identifique huecos de autorización sin generar guards.

## Responsabilidad de los archivos involucrados

| Archivo o carpeta | Responsabilidad |
| --- | --- |
| roles.decorator.ts | Declara los roles permitidos como metadata de una ruta. |
| roles.guard.ts | Compara metadata con el rol de la identidad autenticada. |
| jwt-auth.guard.ts | Exige una identidad válida antes de evaluar permisos. |
| habitos.service.ts | Comprueba propiedad y limita consultas por usuario. |
| habitos.controller.ts | Combina guards y decoradores en cada ruta protegida. |

## Resultado esperado

Los intentos entre usuarios reciben 403, la falta de token recibe 401 y solo ADMIN obtiene el listado global sin datos sensibles.

## Lista breve de verificación

- usuarioId nunca llega desde el body.

- La ruta administrativa exige autenticación y rol.

- a Cambiar un rol requiere iniciar sesión de nuevo para emitir otro token.

## Evidencia que presentas

- Pruebas comparables de usuario A, usuario B y ADMIN.

- Matriz final de permisos con códigos observados.


## DESARROLLO PROGRESIVO

## Parte 7 Validar entradas y unificar errores

## Propósito

Rechazar datos inválidos antes de ejecutar reglas y responder fallos sin exponer detalles internos.

## Conceptos que repasas

Los DTO con class-validator convierten requisitos en validaciones ejecutables. ValidationPipe aplica esas reglas y transforma entradas. Un filtro de excepciones mantiene un contrato estable; un error inesperado se registra en el servidor y responde con un mensaje externo genérico.

## Instrucciones paso a paso

- 1. Valida registro: nombre de mínimo 2 caracteres, email válido y password de mínimo 8.

- 2. Valida hábitos: nombre entre 3 y 120, descripción opcional hasta 500 y enums válidos para frecuencia y estado.

- 3. Configura ValidationPipe global con whitelist y transform. Decide y documenta si rechazas campos adicionales.

- 4. Implementa el formato statusCode, timestamp, path y message para errores conocidos.

- 5. Traduce los casos de negocio a 400, 401, 403, 404 y 409 según el contrato.

- 6. Para fallos inesperados, responde 500 genérico y conserva el detalle solo en logs.

- 7. Activa Helmet y confirma que ningún error devuelve stack, passwordHash, JWT_SECRET o DATABASE_URL.

- 8. Apoyo con IA permitido: entrega respuestas de error anonimizadas y pide detectar inconsistencias o fugas; no solicites el filtro completo.

## Responsabilidad de los archivos involucrados

| Archivo o carpeta | Responsabilidad |
| --- | --- |
| dto/*.dto.ts | Ejecutan reglas de forma, longitud, obligatoriedad y enum. |
| http-exception.filter.ts | Normaliza el contrato y oculta detalles internos. |
| src/main.ts | Registra pipe, filtro, Helmet y configuración global. |
| habitos.service.ts y auth.service.ts | Lanzan errores de negocio con el código adecuado. |

## Resultado esperado

Entradas inválidas no llegan a la lógica; todos los errores conservan la misma forma y un fallo interno no revela información

sensible.

## Lista breve de verificación

- ☐Nombre corto, email inválido y enum inventado producen 400.

- oo Email repetido produce 409.

- La respuesta 500 es genérica y el log conserva el diagnóstico.

## Evidencia que presentas

- Muestra de errores 400, 401, 403, 404, 409 y 500 controlado.

- Explicación de la diferencia entre validación, regla de negocio y fallo inesperado.


## DESARROLLO PROGRESIVO

## Parte 9 Preparar GitHub y Docker

## Propósito

Dejar un proyecto reproducible, sin secretos y listo para ejecutarse igual en otra máquina.

## Conceptos que repasas

Una variable de entorno separa configuración y código. Una imagen Docker es la plantilla inmutable; un contenedor es una instancia en ejecución. El repositorio debe incluir lo necesario para reconstruir la app, pero excluir dependencias generadas, compilados y secretos.

## Instrucciones paso a paso

- 1. Completa .env.example con DATABASE_URL, JWT_SECRET y PORT usando valores ficticios o instrucciones, nunca credenciales.

- 2. Confirma que .gitignore excluye .env, node_modules y dist, pero conserva prisma/migrations.

- 3. Ejecuta npm run build y corrige errores antes de crear la imagen.

- 4. Crea un Dockerfile que instale de forma reproducible, genere Prisma, compile, aplique migraciones de producción al arrancar y ejecute el build.

- 5. Crea .dockerignore para excluir .env, .git, node_modules, dist y logs.

- 6. Si tienes Docker local, prueba docker build -t ritmo-claro-api . y ejecuta la imagen con --env-file .env.

- 7. Revisa git status, el historial y el repositorio remoto para confirmar que no existe .env.

- 8. Apoyo con IA permitido: comparte el árbol y las instrucciones Docker; pide detectar archivos ausentes, secretos o pasos no reproducibles, sin solicitar un Dockerfile completo.

## Responsabilidad de los archivos involucrados

| Archivo o carpeta | Responsabilidad |
| --- | --- |
| .env y .env.example | Separan valores privados del contrato público de configuración. |
| .gitignore y .dockerignore | Evitan publicar o empaquetar archivos innecesarios y secretos. |
| Dockerfile | Describe instalación, generación, build, migración y arranque. |
| package.json y package-lock.json | Fijan scripts y dependencias reproducibles. |
| README.md | Documenta instalación local, variables, build y ejecución. |

## Resultado esperado

Otra persona puede clonar, configurar y ejecutar el proyecto; el build pasa y la imagen no contiene el archivo .env.

## Lista breve de verificación

- ooo npm run build termina sin errores.

- El repositorio incluye migraciones y excluye secretos.

- La imagen arranca con configuración externa.

## Evidencia que presentas

- URL del repositorio e historial de commits.

- Salida del build y, si aplica, prueba local del contenedor.


## Rúbrica de evaluación

La calificación se basa en comportamiento comprobable, calidad técnica y capacidad de explicar las decisiones. Esta primera página reúne 70 puntos.

| Criterio | Pts | Desempeño completo | Descuentos frecuentes |
| --- | --- | --- | --- |
|   |   | Historia, alcance y contratos | Campos sin propósito; relación |
| Dominio y modelo de datos | 15 | coherentes; relación Usuario-Habito; | incorrecta; datos en memoria; schema |
|   |   | enums, unicidad y migración | sin migración. |
|   |   | versionada. |   |
|   |   | Módulos claros; controllers delgados; | Prisma en controllers; rutas |
| Arquitectura y CRUD REST | 15 | services con reglas; cinco operaciones | incompletas; PATCH destructivo; |
|   |   | CRUD persistentes y status | responsabilidades mezcladas. |
|   |   | coherentes. |   |
|   |   | Registro sin rol; hash bcrypt; login | Password en texto o respuesta; secreto |
| Autenticación | 15 | seguro; JWT con expiración; Passport | en código; mensajes que revelan |
|   |   | y guard funcionales; datos sensibles | usuarios; token sin validar. |
|   |   | ausentes. |   |
|   |   | Rutas protegidas; dueño obtenido del | usuarioId desde body; fugas entre |
| Autorización y propiedad | 15 | JWT; aislamiento entre usuarios; | usuarios; ruta administrativa abierta; |
|   |   | RBAC y listado global solo ADMIN. | roles confiados al cliente. |
|   |   | DTO ejecutables; ValidationPipe; | Types sin validación; errores crudos; |
| Validación errores y seguridad | 10 | contrato uniforme; 500 genérico; | códigos incoherentes; datos internos |
|   |   | Helmet; códigos 400, 401, 403, 404 y | expuestos. |
|   |   | 409 correctos. |   |

## 30 PUNTOS RESTANTES

## Rúbrica de evaluación

Los nueve criterios suman exactamente 100 puntos.

| Criterio | Pts | Desempeño completo | Descuentos frecuentes |
| --- | --- | --- | --- |
|   |   | Ocho endpoints documentados; |   |
|   |   | Bearer; contratos claros; colección con | Docs desactualizadas; solo camino |
| Swagger pruebas y accesibilidad | 10 | casos positivos, negativos, dos | feliz; sin prueba de ownership; |
|   |   | usuarios y ADMIN; evidencia | capturas ambiguas. |
|   |   | comprensible sin depender del color. |   |
|   |   | Commits identificables; README | Un solo commit; instalación |
| Git README e IA | 10 | reproducible; .env.example; decisiones | incompleta; código no explicado; |
|   |   | registradas; uso de IA limitado a | prompts que generan la solución. |
|   |   | comprensión, revisión o diagnóstico. |   |
|   |   | Build limpio; imagen reproducible; | Solo localhost; puerto fijo; base |
| Docker y despliegue | 10 | migraciones; Supabase; Render; | efímera; secretos publicados; |
|   |   | variables privadas; URL pública | Dockerfile incompleto. |
|   |   | persistente. |   |

## Cómo se asignan los puntos

- Completo: cumple el comportamiento y lo demuestra con evidencia reproducible.

- Parcial: funciona de forma incompleta, depende de datos manuales o falta evidencia importante.

- No verificable: el código existe, pero no compila, no se puede ejecutar o no se puede explicar.
