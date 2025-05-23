// src/data/sections/http-methods.ts
import type { Seccion } from '../../types';

/**
 * Datos sobre métodos HTTP utilizados en APIs
 * Incluye GET, POST, PUT, PATCH, DELETE y otros
 */
export const httpMethodsData: Seccion = {
  id: 'http-methods',
  titulo: 'Métodos HTTP en APIs',
  descripcion: 'Guía completa de métodos HTTP, sus diferencias, usos correctos y ejemplos prácticos',
  icono: '🔀',
  subtemas: [
    {
      id: 'metodos-principales',
      titulo: 'Métodos Principales',
      icono: '📋',
      items: [
        {
          subtitulo: 'GET - Obtener recursos',
          texto: 'Método para recuperar información sin causar efectos secundarios. Debe ser idempotente y seguro.',
          items: [
            'Solo lectura, no modifica el estado del servidor',
            'Puede ser cacheado por navegadores y proxies',
            'Los parámetros van en la URL (query string)',
            'Idempotente: múltiples llamadas = mismo resultado',
            'Límite de longitud en URL (~2048 caracteres)'
          ],
          codigo: `// Ejemplos de GET
GET /api/users                    // Obtener todos los usuarios
GET /api/users/123               // Obtener usuario específico
GET /api/users?role=admin        // Filtrar por rol
GET /api/users?page=2&limit=20   // Paginación
GET /api/users/123/posts         // Recursos relacionados

// Respuesta típica
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "name": "Juan Pérez",
  "email": "juan@example.com"
}`,
          lenguaje: 'http'
        },
        {
          subtitulo: 'POST - Crear recursos',
          texto: 'Método para crear nuevos recursos en el servidor. No es idempotente.',
          items: [
            'Crea un nuevo recurso en la colección',
            'El servidor asigna el ID del nuevo recurso',
            'No es idempotente: cada llamada crea un nuevo recurso',
            'Datos van en el body de la petición',
            'Retorna 201 Created con la ubicación del nuevo recurso'
          ],
          codigo: `// Ejemplo POST
POST /api/users
Content-Type: application/json

{
  "name": "María García",
  "email": "maria@example.com",
  "role": "user"
}

// Respuesta exitosa
HTTP/1.1 201 Created
Location: /api/users/124
Content-Type: application/json

{
  "id": 124,
  "name": "María García",
  "email": "maria@example.com",
  "role": "user",
  "created_at": "2024-03-20T10:30:00Z"
}`,
          lenguaje: 'http'
        },
        {
          subtitulo: 'PUT - Actualización completa',
          texto: 'Método para reemplazar completamente un recurso existente. Es idempotente.',
          items: [
            'Reemplaza TODO el recurso con los datos enviados',
            'Si falta un campo, se elimina o pone en null',
            'Idempotente: múltiples llamadas = mismo resultado',
            'Puede crear el recurso si no existe (opcional)',
            'Requiere enviar el objeto completo'
          ],
          codigo: `// Ejemplo PUT - Actualización completa
PUT /api/users/123
Content-Type: application/json

{
  "name": "Juan Pérez Actualizado",
  "email": "juan.nuevo@example.com",
  "role": "admin",
  "phone": "+1234567890"  // Todos los campos requeridos
}

// Respuesta
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "name": "Juan Pérez Actualizado",
  "email": "juan.nuevo@example.com",
  "role": "admin",
  "phone": "+1234567890",
  "updated_at": "2024-03-20T11:00:00Z"
}

// ⚠️ Si olvidas un campo:
PUT /api/users/123
{
  "name": "Juan",
  "email": "juan@example.com"
  // Falta "role" y "phone" - serán eliminados!
}`,
          lenguaje: 'http'
        },
        {
          subtitulo: 'PATCH - Actualización parcial',
          texto: 'Método para actualizar parcialmente un recurso. Solo modifica los campos enviados.',
          items: [
            'Actualiza SOLO los campos enviados',
            'Los campos no mencionados permanecen sin cambios',
            'Más eficiente para cambios pequeños',
            'Idempotente cuando se usa correctamente',
            'Puede usar JSON Patch (RFC 6902) o merge patch'
          ],
          codigo: `// Ejemplo PATCH - Actualización parcial
PATCH /api/users/123
Content-Type: application/json

{
  "email": "nuevo.email@example.com"  // Solo cambiar email
}

// Respuesta - otros campos sin cambios
HTTP/1.1 200 OK
{
  "id": 123,
  "name": "Juan Pérez",           // Sin cambios
  "email": "nuevo.email@example.com",  // Actualizado
  "role": "admin",                // Sin cambios
  "phone": "+1234567890"          // Sin cambios
}

// JSON Patch (RFC 6902) - Más preciso
PATCH /api/users/123
Content-Type: application/json-patch+json

[
  { "op": "replace", "path": "/email", "value": "nuevo@example.com" },
  { "op": "add", "path": "/tags/0", "value": "premium" },
  { "op": "remove", "path": "/temporaryFlag" }
]`,
          lenguaje: 'http'
        },
        {
          subtitulo: 'DELETE - Eliminar recursos',
          texto: 'Método para eliminar recursos del servidor. Es idempotente.',
          items: [
            'Elimina el recurso especificado',
            'Idempotente: eliminar algo ya eliminado = mismo resultado',
            'Puede retornar 204 No Content o 200 OK',
            'Algunos APIs hacen "soft delete" (marcan como eliminado)',
            'Puede incluir body para opciones adicionales'
          ],
          codigo: `// Ejemplo DELETE simple
DELETE /api/users/123

// Respuesta sin contenido
HTTP/1.1 204 No Content

// O con confirmación
HTTP/1.1 200 OK
{
  "message": "Usuario eliminado exitosamente",
  "deleted_at": "2024-03-20T12:00:00Z"
}

// DELETE con opciones
DELETE /api/users/123
Content-Type: application/json

{
  "mode": "soft",           // Soft delete
  "reason": "Cuenta inactiva",
  "notify_user": true
}`,
          lenguaje: 'http'
        }
      ]
    },
    {
      id: 'put-vs-patch',
      titulo: 'PUT vs PATCH - Diferencias clave',
      icono: '⚖️',
      items: [
        {
          subtitulo: 'Comparación directa',
          texto: 'Entendiendo cuándo usar PUT y cuándo usar PATCH en tu API.',
          codigo: `// Recurso original
{
  "id": 1,
  "name": "Producto Original",
  "price": 100,
  "stock": 50,
  "category": "electronics",
  "active": true
}

// ❌ PUT - Debe enviar TODO
PUT /api/products/1
{
  "name": "Producto Actualizado",
  "price": 120
  // ⚠️ Faltan stock, category, active - serán null/default!
}

// ✅ PATCH - Solo envía lo que cambia
PATCH /api/products/1
{
  "name": "Producto Actualizado",
  "price": 120
  // ✅ stock, category, active permanecen sin cambios
}`,
          lenguaje: 'javascript'
        },
        {
          subtitulo: 'Casos de uso recomendados',
          texto: 'Guía práctica para elegir entre PUT y PATCH.',
          items: [
            'PUT: Cuando el cliente tiene el objeto completo',
            'PUT: Formularios que cargan todos los campos',
            'PUT: Reemplazar configuraciones completas',
            'PATCH: Actualizar un solo campo (ej: cambiar estado)',
            'PATCH: Operaciones específicas (ej: incrementar contador)',
            'PATCH: Cuando el ancho de banda es limitado',
            'PATCH: APIs móviles con datos costosos'
          ]
        },
        {
          subtitulo: 'Implementación con validación',
          texto: 'Ejemplo de implementación que muestra la diferencia en validación.',
          codigo: `// Express.js - Manejo de PUT vs PATCH

// PUT - Validación estricta, todos los campos requeridos
app.put('/api/users/:id', validateFullUser, async (req, res) => {
  const { id } = req.params;
  const userData = req.body;
  
  // Validar que TODOS los campos estén presentes
  const requiredFields = ['name', 'email', 'role', 'phone'];
  const missingFields = requiredFields.filter(field => !userData[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: Campos faltantes: {missingFields.join(', ')}
    });
  }
  
  // Reemplazar TODO el documento
  const updatedUser = await User.findByIdAndUpdate(
    id,
    userData,
    { new: true, overwrite: true }  // overwrite: true para PUT
  );
  
  res.json(updatedUser);
});

// PATCH - Validación flexible, solo campos enviados
app.patch('/api/users/:id', validatePartialUser, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  // Validar solo los campos enviados
  const allowedUpdates = ['name', 'email', 'role', 'phone'];
  const updateKeys = Object.keys(updates);
  const isValidOperation = updateKeys.every(key => 
    allowedUpdates.includes(key)
  );
  
  if (!isValidOperation) {
    return res.status(400).json({
      error: 'Campos no permitidos en la actualización'
    });
  }
  
  // Actualizar SOLO los campos enviados
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: updates },  // $set para actualización parcial
    { new: true, runValidators: true }
  );
  
  res.json(updatedUser);
});`,
        }
      ]
    },
    {
      id: 'otros-metodos',
      titulo: 'Otros Métodos HTTP',
      icono: '🔧',
      items: [
        {
          subtitulo: 'HEAD - Metadatos sin body',
          texto: 'Similar a GET pero solo retorna headers, sin el body. Útil para verificar existencia o metadata.',
          items: [
            'Idéntico a GET pero sin body en respuesta',
            'Útil para verificar si un recurso existe',
            'Comprobar si un archivo fue modificado',
            'Obtener tamaño de archivo antes de descargarlo',
            'Verificar headers de CORS'
          ],
          codigo: `// Verificar si un recurso existe
HEAD /api/users/123

// Respuesta (solo headers, sin body)
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 1547
Last-Modified: Mon, 20 Mar 2024 10:30:00 GMT
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

// Verificar archivo antes de descargar
HEAD /api/files/report.pdf

HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Length: 5242880  // 5MB
Accept-Ranges: bytes     // Soporta descargas parciales`,
          lenguaje: 'http'
        },
        {
          subtitulo: 'OPTIONS - Opciones disponibles',
          texto: 'Descubre qué métodos y opciones están disponibles para un recurso. Crucial para CORS.',
          items: [
            'Retorna métodos HTTP permitidos',
            'Usado en CORS preflight requests',
            'Puede incluir información de autenticación requerida',
            'Describe opciones de comunicación',
            'No cacheable por defecto'
          ],
          codigo: `// Consultar opciones disponibles
OPTIONS /api/users

// Respuesta
HTTP/1.1 200 OK
Allow: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400

// CORS Preflight para petición compleja
OPTIONS /api/users
Origin: https://example.com
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: Authorization`,
          lenguaje: 'http'
        },
        {
          subtitulo: 'CONNECT y TRACE',
          texto: 'Métodos menos comunes pero parte del estándar HTTP.',
          items: [
            'CONNECT: Establece túnel TCP/IP (usado en proxies HTTPS)',
            'TRACE: Debug, retorna la petición recibida (generalmente deshabilitado)',
            'Raramente usados en APIs REST modernas',
            'TRACE puede ser un riesgo de seguridad (XST attacks)',
            'CONNECT usado internamente por navegadores para HTTPS'
          ]
        }
      ]
    },
    {
      id: 'idempotencia',
      titulo: 'Idempotencia y Seguridad',
      icono: '🔒',
      items: [
        {
          subtitulo: 'Métodos Idempotentes',
          texto: 'Un método es idempotente si múltiples peticiones idénticas tienen el mismo efecto que una sola.',
          items: [
            'GET: Siempre retorna el mismo recurso',
            'PUT: Reemplaza con el mismo contenido',
            'DELETE: Eliminar algo ya eliminado = mismo estado',
            'HEAD: Como GET, siempre idempotente',
            'PATCH: Idempotente si se implementa correctamente',
            'POST: NO es idempotente (crea nuevos recursos)'
          ]
        },
        {
          subtitulo: 'Métodos Seguros',
          texto: 'Un método es seguro si no modifica el estado del servidor.',
          codigo: `// Métodos seguros (no modifican estado)
✅ GET     - Solo lectura
✅ HEAD    - Solo headers
✅ OPTIONS - Solo información

// Métodos no seguros (modifican estado)
❌ POST    - Crea recursos
❌ PUT     - Modifica recursos
❌ PATCH   - Modifica parcialmente
❌ DELETE  - Elimina recursos

// Tabla resumen
| Método  | Seguro | Idempotente | Cacheable |
|---------|--------|-------------|-----------|
| GET     | ✅     | ✅          | ✅        |
| HEAD    | ✅     | ✅          | ✅        |
| POST    | ❌     | ❌          | ⚠️        |
| PUT     | ❌     | ✅          | ❌        |
| PATCH   | ❌     | ✅*         | ❌        |
| DELETE  | ❌     | ✅          | ❌        |
| OPTIONS | ✅     | ✅          | ❌        |

* PATCH puede ser idempotente según implementación`,
          lenguaje: 'markdown'
        }
      ]
    },
    {
      id: 'mejores-practicas',
      titulo: 'Mejores Prácticas',
      icono: '✨',
      items: [
        {
          subtitulo: 'Uso correcto de métodos',
          texto: 'Guía de mejores prácticas para diseñar APIs RESTful correctamente.',
          items: [
            'Usa GET solo para lectura, nunca para modificar datos',
            'POST para crear, retorna 201 con Location header',
            'PUT cuando tienes el objeto completo',
            'PATCH para actualizaciones parciales y eficientes',
            'DELETE debe ser idempotente (no fallar si ya está eliminado)',
            'Respeta la semántica HTTP para mejor interoperabilidad'
          ]
        },
        {
          subtitulo: 'Códigos de respuesta apropiados',
          texto: 'Usa los códigos HTTP correctos según el método y resultado.',
          codigo: `// GET
200 OK                    - Recurso encontrado
404 Not Found            - Recurso no existe
304 Not Modified         - Para caché

// POST  
201 Created              - Recurso creado exitosamente
400 Bad Request          - Datos inválidos
409 Conflict             - Recurso ya existe

// PUT/PATCH
200 OK                   - Actualizado y retorna recurso
204 No Content           - Actualizado sin retornar
400 Bad Request          - Datos inválidos
404 Not Found            - Recurso a actualizar no existe

// DELETE
204 No Content           - Eliminado sin respuesta
200 OK                   - Eliminado con confirmación
404 Not Found            - No existe (¿o 204?)
409 Conflict             - No se puede eliminar (dependencias)`,
          lenguaje: 'http'
        }
      ]
    }
  ]
};