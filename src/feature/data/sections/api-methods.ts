// src/data/sections/api-methods.ts
import type { Seccion } from '../../types';

/**
 * Datos sobre métodos de API y protocolos de comunicación
 * Incluye REST, SOAP, GraphQL, gRPC y más
 */
export const apiMethodsData: Seccion = {
  id: 'api-methods',
  titulo: 'Métodos de API y Protocolos',
  descripcion: 'Guía completa sobre diferentes métodos de API, sus diferencias, ventajas y casos de uso',
  icono: '🌐',
  subtemas: [
    {
      id: 'rest-api',
      titulo: 'REST API',
      icono: '🔄',
      items: [
        {
          subtitulo: '¿Qué es REST?',
          texto: 'REST (Representational State Transfer) es un estilo arquitectónico para diseñar servicios web que se basa en el protocolo HTTP.',
          items: [
            'Arquitectura sin estado (stateless)',
            'Orientado a recursos con URIs únicos',
            'Usa métodos HTTP estándar (GET, POST, PUT, DELETE)',
            'Formato de datos flexible (JSON, XML, HTML)',
            'Cacheable para mejorar rendimiento'
          ]
        },
        {
          subtitulo: 'Ejemplo REST básico',
          texto: 'Estructura típica de endpoints REST para un recurso de usuarios.',
          codigo: `// Endpoints REST típicos
GET    /api/users       // Obtener todos los usuarios
GET    /api/users/123   // Obtener usuario específico
POST   /api/users       // Crear nuevo usuario
PUT    /api/users/123   // Actualizar usuario completo
PATCH  /api/users/123   // Actualizar parcialmente
DELETE /api/users/123   // Eliminar usuario

// Ejemplo de respuesta REST
{
  "id": 123,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "created_at": "2024-01-15T10:30:00Z"
}`,
          lenguaje: 'javascript'
        },
        {
          subtitulo: 'Ventajas y Desventajas',
          texto: 'Cuándo usar REST y cuándo considerar otras alternativas.',
          items: [
            '✅ Simple y fácil de entender',
            '✅ Amplio soporte en todos los lenguajes',
            '✅ Cacheable y escalable',
            '❌ Over-fetching/Under-fetching de datos',
            '❌ Múltiples llamadas para datos relacionados',
            '📍 Ideal para: APIs públicas, CRUD simple'
          ]
        }
      ]
    },
    {
      id: 'soap-api',
      titulo: 'SOAP',
      icono: '📦',
      items: [
        {
          subtitulo: '¿Qué es SOAP?',
          texto: 'SOAP (Simple Object Access Protocol) es un protocolo de mensajería basado en XML para intercambiar información estructurada.',
          items: [
            'Protocolo basado en XML con estructura estricta',
            'Independiente del transporte (HTTP, SMTP, TCP)',
            'Soporta WS-Security para seguridad avanzada',
            'WSDL para describir servicios',
            'Transacciones ACID completas'
          ]
        },
        {
          subtitulo: 'Estructura SOAP',
          texto: 'Ejemplo básico de request y response SOAP.',
          codigo: `<!-- Request SOAP -->
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header>
    <auth:Authentication xmlns:auth="http://example.com">
      <auth:Username>usuario</auth:Username>
      <auth:Password>contraseña</auth:Password>
    </auth:Authentication>
  </soap:Header>
  <soap:Body>
    <GetUser xmlns="http://example.com/users">
      <UserId>123</UserId>
    </GetUser>
  </soap:Body>
</soap:Envelope>

<!-- Response SOAP -->
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetUserResponse xmlns="http://example.com/users">
      <User>
        <Id>123</Id>
        <Name>Juan Pérez</Name>
        <Email>juan@example.com</Email>
      </User>
    </GetUserResponse>
  </soap:Body>
</soap:Envelope>`,
          lenguaje: 'xml'
        },
        {
          subtitulo: 'SOAP vs REST',
          texto: 'Diferencias clave para tomar decisiones arquitectónicas.',
          items: [
            '📋 SOAP es un protocolo, REST es un estilo',
            '📄 SOAP solo XML, REST soporta JSON/XML/etc',
            '🔒 SOAP tiene WS-Security, REST usa HTTPS/OAuth',
            '📊 REST más ligero, SOAP más robusto',
            '💼 SOAP ideal para: Banca, seguros, transacciones críticas',
            '🌐 REST ideal para: APIs web, móviles, microservicios'
          ]
        }
      ]
    },
    {
      id: 'graphql-api',
      titulo: 'GraphQL',
      icono: '🔷',
      items: [
        {
          subtitulo: '¿Qué es GraphQL?',
          texto: 'GraphQL es un lenguaje de consulta para APIs que permite solicitar exactamente los datos necesarios.',
          items: [
            'Desarrollado por Facebook en 2012',
            'Un único endpoint para todas las operaciones',
            'Sistema de tipos fuertemente tipado',
            'Evita over-fetching y under-fetching',
            'Introspección del esquema'
          ]
        },
        {
          subtitulo: 'Query GraphQL',
          texto: 'Ejemplo de consulta GraphQL vs REST.',
          codigo: `# GraphQL Query - Un solo request
query GetUserWithPosts {
  user(id: "123") {
    name
    email
    posts {
      title
      content
      comments {
        text
        author {
          name
        }
      }
    }
  }
}

# Equivalente en REST - Múltiples requests
GET /api/users/123
GET /api/users/123/posts
GET /api/posts/1/comments
GET /api/posts/2/comments
GET /api/users/456  # Para cada autor de comentario`,
          lenguaje: 'graphql'
        },
        {
          subtitulo: 'Schema básico',
          texto: 'Definición de tipos en GraphQL.',
          codigo: `type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
}

type Query {
  user(id: ID!): User
  users: [User!]!
  post(id: ID!): Post
}

type Mutation {
  createUser(name: String!, email: String!): User!
  updateUser(id: ID!, name: String): User!
}`,
          lenguaje: 'graphql'
        },
        {
          subtitulo: 'Ventajas de GraphQL',
          texto: 'Por qué elegir GraphQL sobre REST.',
          items: [
            '✅ Obtén exactamente los datos que necesitas',
            '✅ Reduce el número de requests',
            '✅ Fuertemente tipado con auto-documentación',
            '✅ Evolución sin versionado',
            '❌ Curva de aprendizaje más alta',
            '❌ Complejidad en caché',
            '📍 Ideal para: Apps móviles, dashboards complejos'
          ]
        }
      ]
    },
    {
      id: 'grpc-api',
      titulo: 'gRPC',
      icono: '⚡',
      items: [
        {
          subtitulo: '¿Qué es gRPC?',
          texto: 'gRPC es un framework RPC moderno y de alto rendimiento desarrollado por Google.',
          items: [
            'Basado en HTTP/2 para mejor performance',
            'Usa Protocol Buffers (protobuf) para serialización',
            'Soporta streaming bidireccional',
            'Generación automática de código cliente/servidor',
            'Ideal para comunicación entre microservicios'
          ]
        },
        {
          subtitulo: 'Protocol Buffers',
          texto: 'Definición de servicios con protobuf.',
          codigo: `// user.proto
syntax = "proto3";

package user;

service UserService {
  rpc GetUser (GetUserRequest) returns (User);
  rpc ListUsers (Empty) returns (UserList);
  rpc CreateUser (CreateUserRequest) returns (User);
  rpc StreamUsers (Empty) returns (stream User);
}

message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
}

message GetUserRequest {
  int32 id = 1;
}

message CreateUserRequest {
  string name = 1;
  string email = 2;
}

message UserList {
  repeated User users = 1;
}

message Empty {}`,
          lenguaje: 'protobuf'
        },
        {
          subtitulo: 'gRPC vs REST',
          texto: 'Comparación de rendimiento y casos de uso.',
          items: [
            '⚡ gRPC 7-10x más rápido que REST/JSON',
            '📦 Protobuf más eficiente que JSON',
            '🔄 Streaming bidireccional nativo',
            '🔧 Generación automática de SDKs',
            '❌ No funciona directamente en navegadores',
            '❌ Menos herramientas de debugging',
            '📍 Ideal para: Microservicios, sistemas distribuidos'
          ]
        }
      ]
    },
    {
      id: 'websockets',
      titulo: 'WebSockets',
      icono: '🔌',
      items: [
        {
          subtitulo: '¿Qué son WebSockets?',
          texto: 'WebSocket es un protocolo que permite comunicación bidireccional en tiempo real entre cliente y servidor.',
          items: [
            'Conexión persistente full-duplex',
            'Comunicación en tiempo real',
            'Menor latencia que HTTP polling',
            'Ideal para chats, notificaciones, actualizaciones en vivo',
            'Soportado por todos los navegadores modernos'
          ]
        },
        {
          subtitulo: 'Ejemplo WebSocket',
          texto: 'Implementación básica cliente-servidor.',
          codigo: `// Cliente WebSocket
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  console.log('Conectado');
  ws.send(JSON.stringify({ type: 'greeting', data: 'Hola servidor!' }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Mensaje recibido:', message);
};

ws.onerror = (error) => {
  console.error('Error:', error);
};

// Servidor WebSocket (Node.js)
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Cliente conectado');
  
  ws.on('message', (data) => {
    const message = JSON.parse(data);
    console.log('Recibido:', message);
    
    // Broadcast a todos los clientes
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'broadcast',
          data: message.data
        }));
      }
    });
  });
});`,
          lenguaje: 'javascript'
        }
      ]
    },
    {
      id: 'comparacion-general',
      titulo: 'Comparación General',
      icono: '📊',
      items: [
        {
          subtitulo: 'Cuándo usar cada método',
          texto: 'Guía rápida para elegir el método de API apropiado según el caso de uso.',
          items: [
            'REST: APIs públicas, CRUD simple, aplicaciones web',
            'SOAP: Sistemas empresariales, transacciones financieras, seguridad crítica',
            'GraphQL: Apps móviles, dashboards complejos, cuando necesitas flexibilidad',
            'gRPC: Microservicios internos, alta performance, streaming',
            'WebSockets: Chat en tiempo real, notificaciones push, colaboración en vivo'
          ]
        },
        {
          subtitulo: 'Tabla comparativa',
          texto: 'Resumen de características principales.',
          codigo: `| Característica    | REST  | SOAP  | GraphQL | gRPC   | WebSocket |
|-------------------|-------|-------|---------|--------|-----------|
| Protocolo         | HTTP  | Any   | HTTP    | HTTP/2 | WS        |
| Formato           | Any   | XML   | JSON    | Binary | Any       |
| Tipado            | No    | Sí    | Sí      | Sí     | No        |
| Tiempo real       | No    | No    | Sub.    | Stream | Sí        |
| Complejidad       | Baja  | Alta  | Media   | Media  | Baja      |
| Performance       | Media | Baja  | Media   | Alta   | Alta      |
| Caché             | Sí    | Difícil| Difícil | No     | No        |`,
          lenguaje: 'markdown'
        }
      ]
    }
  ]
};