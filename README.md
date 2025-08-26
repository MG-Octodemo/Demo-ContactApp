# Demo ContactApp - Comprehensive Implementation Reference

## Overview

This is a complete Node.js/Express/MongoDB contact management application that serves as a reference implementation for comprehensive end-to-end workflow documentation. The application demonstrates best practices in API design, service layer architecture, error handling, and naming conventions.

## Features

### Core Functionality
- ✅ **Complete CRUD Operations**: Create, Read, Update, Delete contacts
- ✅ **RESTful API**: JSON endpoints for all operations
- ✅ **Web Interface**: User-friendly HTML forms and contact listing
- ✅ **Data Validation**: Server-side and client-side validation
- ✅ **Error Handling**: Comprehensive error management at all layers
- ✅ **Spanish Naming Convention**: Variables in Spanish using snake_case

### Technical Stack
- **Runtime**: Node.js v20+
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB with Mongoose ODM 7.0.3
- **Template Engine**: EJS 3.1.9
- **Architecture**: Layered architecture with service layer pattern

## Quick Start

### Prerequisites
- Node.js v20 or higher
- MongoDB instance running on `localhost:27017`
- npm (comes with Node.js)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd Demo-ContactApp

# Install dependencies
npm install

# Start the application
npm start
```

### Access the Application
- **Web Interface**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api/contactos
- **Add Contact Form**: http://localhost:3000/contactos/nuevo
- **Contact List**: http://localhost:3000/contactos

## API Endpoints

### Contact Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contactos` | Retrieve all contacts |
| GET | `/api/contactos/:id` | Retrieve specific contact |
| POST | `/api/contactos` | Create new contact |
| PUT | `/api/contactos/:id` | Update existing contact |
| DELETE | `/api/contactos/:id` | Delete contact |

### Example API Usage

**Create Contact:**
```bash
curl -X POST http://localhost:3000/api/contactos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_completo": "Juan Pérez García",
    "correo_electronico": "juan.perez@email.com",
    "numero_telefono": "123 456 789",
    "direccion": "Calle Principal 123"
  }'
```

**Response Format:**
```json
{
  "exito": true,
  "datos": {
    "_id": "...",
    "nombre_completo": "Juan Pérez García",
    "correo_electronico": "juan.perez@email.com",
    "numero_telefono": "123 456 789",
    "direccion": "Calle Principal 123",
    "fecha_creacion": "2024-01-01T00:00:00.000Z",
    "fecha_actualizacion": "2024-01-01T00:00:00.000Z"
  },
  "mensaje": "Contacto creado exitosamente"
}
```

## Project Structure

```
Demo-ContactApp/
├── index.js                 # Main application file
├── package.json             # Dependencies and scripts
├── WORKFLOW_DOCUMENTATION.md # Comprehensive implementation guide
├── README.md               # This file
├── copilot-instructions.md # Naming convention rules
├── views/                  # EJS templates
│   ├── index.ejs          # Home page
│   ├── contactList.ejs    # Contact listing page
│   └── contactAdd.ejs     # Add contact form
└── test/                   # Test files
    └── test_basico.js     # Basic functionality tests
```

## Data Model

### Contact Schema
```javascript
{
  nombre_completo: String,     // Required - Full name
  correo_electronico: String,  // Required, unique - Email address
  numero_telefono: String,     // Required - Phone number
  direccion: String,          // Optional - Address
  fecha_creacion: Date,       // Auto-generated - Creation timestamp
  fecha_actualizacion: Date   // Auto-updated - Last modification timestamp
}
```

## Development

### Running Tests
```bash
npm test
```

**Test Coverage:**
- ✅ Module export validation
- ✅ Express configuration check
- ✅ Spanish naming convention compliance
- ✅ API endpoint verification
- ✅ Error handling pattern detection

### Development Mode
```bash
npm run dev
```

## Architecture Patterns

### Service Layer Pattern
The application implements a service layer pattern with the `servicio_contactos` class containing all business logic:

```javascript
class servicio_contactos {
    static async crear_contacto(datos_contacto) { /* ... */ }
    static async obtener_todos_contactos() { /* ... */ }
    static async obtener_contacto_por_id(id_contacto) { /* ... */ }
    static async actualizar_contacto(id_contacto, datos) { /* ... */ }
    static async eliminar_contacto(id_contacto) { /* ... */ }
}
```

### Error Handling Strategy
- **Service Layer**: Try/catch with standardized return objects
- **Controller Layer**: HTTP status code mapping and JSON responses
- **Global Middleware**: Unhandled error catching and logging
- **Client Side**: User-friendly error messages and form validation

### Response Standardization
All API responses follow a consistent format:
```javascript
{
  exito: boolean,           // Success indicator
  datos?: object,           // Response data (on success)
  mensaje?: string,         // User-friendly message
  error?: string           // Error details (on failure)
}
```

## Naming Conventions

Following the requirement in `copilot-instructions.md`, all variables use Spanish names in snake_case:

### Examples
- `puerto` (port)
- `esquema_contacto` (contact schema)
- `nombre_completo` (full name)
- `correo_electronico` (email)
- `numero_telefono` (phone number)
- `fecha_creacion` (creation date)

## Documentation

### Comprehensive Implementation Guide
See [WORKFLOW_DOCUMENTATION.md](WORKFLOW_DOCUMENTATION.md) for:
- Complete end-to-end workflow documentation
- Implementation blueprints and templates
- Best practices and common pitfalls
- Technology-specific patterns
- Extension mechanisms

This documentation follows the comprehensive template structure for documenting end-to-end application workflows and serves as a reference for implementing similar features.

## Contributing

When adding new features:
1. Follow the established service layer pattern
2. Maintain Spanish snake_case naming conventions
3. Implement comprehensive error handling
4. Add appropriate tests
5. Update documentation

## License

MIT License - Feel free to use this as a reference implementation.