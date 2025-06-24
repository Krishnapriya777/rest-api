const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Management API',
      version: '1.0.0',
      description: 'API for user registration, login, token handling and user CRUD operations',
    },
    servers: [{ url: 'https://rest-api-pq0n.onrender.com' }],
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
  apis: ['./routes/*.js'],
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
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['name', 'email', 'password'],
              properties: {
                name: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                profilepic:{type:'string',format:'binary'}
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
    summary: 'Get all users with pagination, search, and filtering',
    tags: ['Users'],
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: 'page',
        in: 'query',
        description: 'Page number',
        required: false,
        schema: { type: 'integer', default: 1 }
      },
      {
        name: 'limit',
        in: 'query',
        description: 'Number of users per page',
        required: false,
        schema: { type: 'integer', default: 10 }
      },
      {
        name: 'search',
        in: 'query',
        description: 'Search term for name or email',
        required: false,
        schema: { type: 'string' }
      },
      {
        name: 'isverified',
        in: 'query',
        description: 'Filter users by verification status (true or false)',
        required: false,
        schema: { type: 'boolean' }
      }
    ],
    responses: {
      200: {
        description: 'List of users',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string',example:'64aa1234567bc1234567de90' },
                      name: { type: 'string' ,example:'krishnapriya'},
                      email: { type: 'string' ,example:'krishnapriya@gmail.com'},
                      isverified: { type: 'boolean',example:'true' }
                    }
                  }
                },
                total: { type: 'integer' },
                page: { type: 'integer' },
                pages: { type: 'integer' }
              }
            }
          }
        }
      }
    }
  }
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
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                email: { type: 'string', format: 'email' },
                // add more fields if needed
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'User updated',
        },
        400: {
          description: 'Invalid input',
        },
        404: {
          description: 'User not found',
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
specs.paths['/api/auth/forgot-password'] = {
  post: {
    summary: 'Send password reset link via email',
    tags: ['Auth'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email'],
            properties: {
              email: { type: 'string', format: 'email' },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Password reset email sent',
      },
      404: {
        description: 'Email not found',
      },
    },
  },
};

specs.paths['/api/auth/reset-password/{token}'] = {
  post: {
    summary: 'Reset password using token',
    tags: ['Auth'],
    parameters: [
      {
        name: 'token',
        in: 'path',
        required: true,
        schema: {
          type: 'string'
        },
        description: 'JWT token sent to user email for password reset'
      }
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['newPassword'],
            properties: {
              newPassword: { type: 'string', minLength: 6 },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Password reset successfully',
      },
      400: {
        description: 'Invalid or expired token',
      },
    },
  },
};

specs.paths['/api/auth/verify-email'] = {
  get: {
    summary: 'Verify user email',
    description: 'Verifies a user\'s email using a token sent via email.',
    tags: ['Auth'],
    parameters: [
      {
        name: 'token',
        in: 'query',
        required: true,
        description: 'Verification token sent to the user\'s email.',
        schema: { type: 'string' },
      },
    ],
    responses: {
      200: {
        description: 'Email verified successfully.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string' },
              },
            },
            example: {
              message: 'Email verified successfully',
            },
          },
        },
      },
      400: {
        description: 'Invalid or expired token or email already verified.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string' },
              },
            },
            example: {
              message: 'Token is invalid or email is already verified',
            },
          },
        },
      },
      404: {
        description: 'User not found.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string' },
              },
            },
            example: {
              message: 'User not found',
            },
          },
        },
      },
    },
  },
};


module.exports = specs;