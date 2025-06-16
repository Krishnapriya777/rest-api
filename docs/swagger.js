const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Management API',
      version: '1.0.0',
      description: 'API for user registration, login, token handling and user CRUD operations',
    },
    servers: [{ url: 'http://localhost:5000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // You can keep this or remove since you're manually defining everything below
};

const specs = swaggerJsdoc(options);

specs.paths = {
  '/api/auth/register': {
    post: {
      summary: 'Register a new user',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'email', 'password'],
              properties: {
                name: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'User registered successfully',
        },
        400: {
          description: 'User already exists',
        },
      },
    },
  },
  '/api/auth/login': {
    post: {
      summary: 'Login user',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string' },
                password: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Login successful',
        },
        400: {
          description: 'Invalid credentials',
        },
      },
    },
  },
  '/api/auth/refresh-token': {
    post: {
      summary: 'Refresh JWT token',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['token'],
              properties: {
                token: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'New access token returned',
        },
        403: {
          description: 'Invalid refresh token',
        },
      },
    },
  },
  '/api/auth/logout': {
    post: {
      summary: 'Logout user',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['token'],
              properties: {
                token: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Logged out successfully',
        },
      },
    },
  },
  '/api/users': {
    get: {
      summary: 'Get all users',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'List of users',
        },
      },
    },
  },
  '/api/users/{id}': {
    get: {
      summary: 'Get user by ID',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: 'User found',
        },
      },
    },
    put: {
      summary: 'Update user by ID',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: 'User updated',
        },
      },
    },
    delete: {
      summary: 'Delete user by ID',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: 'User deleted',
        },
      },
    },
  },
};

module.exports = specs;