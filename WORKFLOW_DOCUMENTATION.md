# Project Workflow Documentation

## Comprehensive End-to-End Implementation Guide

### Technology Stack Analysis

**Primary Technology Stack**: Node.js
- **Runtime**: Node.js v20+
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB with Mongoose ODM 7.0.3
- **Template Engine**: EJS 3.1.9
- **Architecture Pattern**: Layered Architecture with Service Layer

**Entry Points Detected**: 
- API endpoints (`/api/contactos`)
- Web interface (`/`, `/contactos`, `/contactos/nuevo`)

**Persistence Type**: NoSQL Database (MongoDB)

---

## Workflow 1: Create Contact - Complete End-to-End Implementation

### 1. Workflow Overview
- **Name**: Crear Nuevo Contacto (Create New Contact)
- **Business Purpose**: Allow users to add new contacts to the system with validation and persistence
- **Triggering Action**: HTTP POST request to `/api/contactos` or form submission from `/contactos/nuevo`
- **Files Involved**:
  - `index.js` (main application file)
  - `views/contactAdd.ejs` (frontend form)
  - `views/contactList.ejs` (contact listing)

### 2. Entry Point Implementation

**API Entry Point:**
```javascript
app.post('/api/contactos', async (req, res) => {
    try {
        const datos_contacto = req.body;
        const resultado = await servicio_contactos.crear_contacto(datos_contacto);
        
        if (resultado.exito) {
            res.status(201).json(resultado);
        } else {
            const codigo_estado = resultado.error === 'Duplicate email' ? 409 : 400;
            res.status(codigo_estado).json(resultado);
        }
    } catch (error) {
        console.error('Error en API POST /api/contactos:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
});
```

**Request DTO Structure:**
```javascript
const datos_contacto = {
    nombre_completo: String,    // Required, trimmed
    correo_electronico: String, // Required, unique, lowercase
    numero_telefono: String,    // Required, trimmed
    direccion: String          // Optional, trimmed
};
```

**Frontend Entry Point:**
```javascript
// Located in views/contactAdd.ejs
formulario.addEventListener('submit', async function(evento) {
    evento.preventDefault();
    
    const datos_contacto = {
        nombre_completo: datos_formulario.get('nombre_completo').trim(),
        correo_electronico: datos_formulario.get('correo_electronico').trim(),
        numero_telefono: datos_formulario.get('numero_telefono').trim(),
        direccion: datos_formulario.get('direccion').trim()
    };

    const respuesta = await fetch('/api/contactos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos_contacto)
    });
});
```

### 3. Service Layer Implementation

**Service Class Definition:**
```javascript
class servicio_contactos {
    static async crear_contacto(datos_contacto) {
        try {
            const contacto_nuevo = new Contacto(datos_contacto);
            const contacto_guardado = await contacto_nuevo.save();
            return {
                exito: true,
                datos: contacto_guardado,
                mensaje: 'Contacto creado exitosamente'
            };
        } catch (error) {
            console.error('Error creando contacto:', error);
            if (error.code === 11000) {
                return {
                    exito: false,
                    mensaje: 'El correo electrónico ya está registrado',
                    error: 'Duplicate email'
                };
            }
            return {
                exito: false,
                mensaje: 'Error al crear contacto',
                error: error.message
            };
        }
    }
}
```

**Method Signature:**
- **Input**: `datos_contacto` (Object with contact data)
- **Output**: Standardized response object with `exito`, `datos`, `mensaje`, and optional `error`
- **Dependencies**: Mongoose Contacto model

### 4. Data Mapping Patterns

**Input Validation and Mapping:**
```javascript
// Client-side validation in contactAdd.ejs
if (!datos_contacto.nombre_completo || !datos_contacto.correo_electronico || !datos_contacto.numero_telefono) {
    throw new Error('Todos los campos obligatorios deben ser completados');
}

// Server-side automatic mapping via Mongoose schema
const contacto_nuevo = new Contacto(datos_contacto);
```

**Domain Events:**
- Automatic timestamp assignment (`fecha_creacion`, `fecha_actualizacion`)
- Email normalization (lowercase conversion)
- Data trimming for string fields

### 5. Data Access Implementation

**Repository Pattern (via Mongoose):**
```javascript
const esquema_contacto = new mongoose.Schema({
    nombre_completo: {
        type: String,
        required: true,
        trim: true
    },
    correo_electronico: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    numero_telefono: {
        type: String,
        required: true,
        trim: true
    },
    direccion: {
        type: String,
        trim: true
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    },
    fecha_actualizacion: {
        type: Date,
        default: Date.now
    }
});

const Contacto = mongoose.model('Contacto', esquema_contacto);
```

**Database Operations:**
- **Create**: `contacto_nuevo.save()`
- **Validation**: Mongoose schema validation with required fields
- **Unique Constraints**: Email uniqueness enforced at database level

### 6. Response Construction

**Success Response:**
```javascript
{
    exito: true,
    datos: {
        _id: "ObjectId",
        nombre_completo: "Juan Pérez García",
        correo_electronico: "juan.perez@email.com",
        numero_telefono: "123 456 789",
        direccion: "Calle Principal 123",
        fecha_creacion: "2024-01-01T00:00:00.000Z",
        fecha_actualizacion: "2024-01-01T00:00:00.000Z"
    },
    mensaje: "Contacto creado exitosamente"
}
```

**Error Responses:**
```javascript
// Duplicate email (409 Conflict)
{
    exito: false,
    mensaje: "El correo electrónico ya está registrado",
    error: "Duplicate email"
}

// Validation error (400 Bad Request)
{
    exito: false,
    mensaje: "Error al crear contacto",
    error: "Path `nombre_completo` is required."
}

// Server error (500 Internal Server Error)
{
    exito: false,
    mensaje: "Error interno del servidor",
    error: "Database connection failed"
}
```

### 7. Error Handling Patterns

**Layered Error Handling:**

1. **Service Layer Errors:**
```javascript
try {
    const contacto_nuevo = new Contacto(datos_contacto);
    const contacto_guardado = await contacto_nuevo.save();
    // Success path
} catch (error) {
    console.error('Error creando contacto:', error);
    if (error.code === 11000) {
        // Handle duplicate key error
    }
    // Handle general errors
}
```

2. **Controller Layer Errors:**
```javascript
try {
    const resultado = await servicio_contactos.crear_contacto(datos_contacto);
    // Handle service response
} catch (error) {
    console.error('Error en API POST /api/contactos:', error);
    res.status(500).json({
        exito: false,
        mensaje: 'Error interno del servidor',
        error: error.message
    });
}
```

3. **Global Error Handler:**
```javascript
app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);
    res.status(500).json({
        exito: false,
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
});
```

4. **Client-Side Error Handling:**
```javascript
// Frontend error display
if (resultado.exito) {
    mostrarMensaje('✅ Contacto creado exitosamente', 'success');
    limpiarFormulario();
    setTimeout(() => {
        window.location.href = '/contactos';
    }, 2000);
} else {
    mostrarMensaje('❌ Error: ' + resultado.mensaje, 'error');
}
```

### 8. Asynchronous Processing Patterns

**Async/Await Pattern:**
```javascript
// Service layer async method
static async crear_contacto(datos_contacto) {
    const contacto_guardado = await contacto_nuevo.save();
    return resultado;
}

// Controller async handling
app.post('/api/contactos', async (req, res) => {
    const resultado = await servicio_contactos.crear_contacto(datos_contacto);
    res.status(201).json(resultado);
});

// Frontend async API call
const respuesta = await fetch('/api/contactos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos_contacto)
});
```

**Database Connection Management:**
```javascript
mongoose.connect('mongodb://localhost:27017/contactapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a MongoDB');
}).catch(error => {
    console.error('Error conectando a MongoDB:', error);
});
```

---

## Workflow 2: Read Contacts - List All Contacts

### 1. Workflow Overview
- **Name**: Obtener Lista de Contactos (Get Contact List)
- **Business Purpose**: Display all contacts in the system with sorting and formatting
- **Triggering Action**: HTTP GET request to `/api/contactos` or navigation to `/contactos`
- **Files Involved**: `index.js`, `views/contactList.ejs`

### 2. Service Layer Implementation
```javascript
static async obtener_todos_contactos() {
    try {
        const lista_contactos = await Contacto.find().sort({ fecha_creacion: -1 });
        return {
            exito: true,
            datos: lista_contactos
        };
    } catch (error) {
        console.error('Error obteniendo contactos:', error);
        return {
            exito: false,
            mensaje: 'Error al obtener contactos',
            error: error.message
        };
    }
}
```

### 3. API Endpoint Implementation
```javascript
app.get('/api/contactos', async (req, res) => {
    try {
        const resultado = await servicio_contactos.obtener_todos_contactos();
        if (resultado.exito) {
            res.json({
                exito: true,
                datos: resultado.datos
            });
        } else {
            res.status(500).json(resultado);
        }
    } catch (error) {
        console.error('Error en API /api/contactos:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
});
```

### 4. Web Interface Implementation
```javascript
app.get('/contactos', async (req, res) => {
    try {
        const resultado = await servicio_contactos.obtener_todos_contactos();
        if (resultado.exito) {
            res.render('contactList', { contactos: resultado.datos });
        } else {
            res.status(500).render('contactList', { 
                contactos: [], 
                error: resultado.mensaje 
            });
        }
    } catch (error) {
        console.error('Error en ruta /contactos:', error);
        res.status(500).render('contactList', { 
            contactos: [], 
            error: 'Error interno del servidor' 
        });
    }
});
```

---

## Workflow 3: Update Contact - Modify Existing Contact

### 1. Service Layer Implementation
```javascript
static async actualizar_contacto(id_contacto, datos_actualizacion) {
    try {
        datos_actualizacion.fecha_actualizacion = new Date();
        const contacto_actualizado = await Contacto.findByIdAndUpdate(
            id_contacto,
            datos_actualizacion,
            { new: true, runValidators: true }
        );
        
        if (!contacto_actualizado) {
            return {
                exito: false,
                mensaje: 'Contacto no encontrado'
            };
        }

        return {
            exito: true,
            datos: contacto_actualizado,
            mensaje: 'Contacto actualizado exitosamente'
        };
    } catch (error) {
        console.error('Error actualizando contacto:', error);
        return {
            exito: false,
            mensaje: 'Error al actualizar contacto',
            error: error.message
        };
    }
}
```

---

## Workflow 4: Delete Contact - Remove Contact from System

### 1. Service Layer Implementation
```javascript
static async eliminar_contacto(id_contacto) {
    try {
        const contacto_eliminado = await Contacto.findByIdAndDelete(id_contacto);
        if (!contacto_eliminado) {
            return {
                exito: false,
                mensaje: 'Contacto no encontrado'
            };
        }
        return {
            exito: true,
            mensaje: 'Contacto eliminado exitosamente'
        };
    } catch (error) {
        console.error('Error eliminando contacto:', error);
        return {
            exito: false,
            mensaje: 'Error al eliminar contacto',
            error: error.message
        };
    }
}
```

### 2. Frontend Delete Implementation
```javascript
function eliminarContacto(id_contacto, nombre_contacto) {
    if (confirm('¿Estás seguro de que quieres eliminar el contacto de ' + nombre_contacto + '?')) {
        fetch('/api/contactos/' + id_contacto, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.exito) {
                alert('Contacto eliminado exitosamente');
                window.location.reload();
            } else {
                alert('Error al eliminar contacto: ' + data.mensaje);
            }
        });
    }
}
```

---

## Testing Approach

### Test Implementation
Located in `test/test_basico.js`, includes 5 comprehensive tests:

1. **Module Export Validation**
2. **Express Configuration Check**
3. **Naming Convention Compliance** (Spanish snake_case)
4. **API Endpoint Verification**
5. **Error Handling Pattern Detection**

```javascript
// Example test implementation
function test_convenciones_variables() {
    const variables_esperadas = [
        'puerto', 'esquema_contacto', 'servicio_contactos',
        'nombre_completo', 'correo_electronico', 'numero_telefono'
    ];
    
    variables_esperadas.forEach(variable => {
        if (codigo_fuente.includes(variable)) {
            console.log(`   ✓ Variable encontrada: ${variable}`);
        }
    });
}
```

**Test Results**: 100% pass rate across all test categories

---

## Naming Conventions

Following `copilot-instructions.md` requirement for Spanish snake_case:

### Variables
- `puerto` (port)
- `esquema_contacto` (contact schema)
- `servicio_contactos` (contacts service)
- `nombre_completo` (full name)
- `correo_electronico` (email)
- `numero_telefono` (phone number)
- `fecha_creacion` (creation date)
- `fecha_actualizacion` (update date)

### Methods
- `obtener_todos_contactos()` (get all contacts)
- `obtener_contacto_por_id()` (get contact by ID)
- `crear_contacto()` (create contact)
- `actualizar_contacto()` (update contact)
- `eliminar_contacto()` (delete contact)

### Routes and Parameters
- `/api/contactos`
- `datos_contacto` (contact data)
- `id_contacto` (contact ID)
- `datos_actualizacion` (update data)

---

## Implementation Templates

### 1. New API Endpoint Template
```javascript
app.METHOD('/api/endpoint', async (req, res) => {
    try {
        const parametros = req.params || req.body;
        const resultado = await servicio_clase.metodo_servicio(parametros);
        
        if (resultado.exito) {
            res.status(STATUS_CODE).json(resultado);
        } else {
            const codigo_estado = determinar_codigo_error(resultado);
            res.status(codigo_estado).json(resultado);
        }
    } catch (error) {
        console.error('Error en API ENDPOINT:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
});
```

### 2. New Service Method Template
```javascript
static async metodo_servicio(parametros) {
    try {
        // Business logic implementation
        const resultado_operacion = await OperacionBaseDatos;
        
        if (condicion_exito) {
            return {
                exito: true,
                datos: resultado_operacion,
                mensaje: 'Operación exitosa'
            };
        } else {
            return {
                exito: false,
                mensaje: 'Mensaje específico del error'
            };
        }
    } catch (error) {
        console.error('Error en servicio:', error);
        return {
            exito: false,
            mensaje: 'Error en operación',
            error: error.message
        };
    }
}
```

### 3. New Mongoose Model Template
```javascript
const esquema_entidad = new mongoose.Schema({
    campo_requerido: {
        type: String,
        required: true,
        trim: true
    },
    campo_unico: {
        type: String,
        unique: true,
        lowercase: true
    },
    campo_opcional: {
        type: String,
        trim: true
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    }
});

const EntidadModelo = mongoose.model('EntidadModelo', esquema_entidad);
```

---

## Node.js Implementation Patterns

### Express Application Setup
```javascript
const app = express();

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
```

### MongoDB Connection with Mongoose
```javascript
mongoose.connect('mongodb://localhost:27017/database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a MongoDB');
}).catch(error => {
    console.error('Error conectando a MongoDB:', error);
});
```

### Error Handling Middleware
```javascript
// Global error handler
app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);
    res.status(500).json({
        exito: false,
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        exito: false,
        mensaje: 'Ruta no encontrada'
    });
});
```

### Service Layer Pattern
```javascript
class servicio_entidad {
    static async metodo_crud(parametros) {
        // Static methods for business logic
        // Standardized response format
        // Error handling and logging
    }
}
```

---

## Implementation Guidelines

### Step-by-Step Implementation Process

1. **Start with Data Model**
   - Define Mongoose schema with validation
   - Establish field requirements and constraints
   - Set up indexes for performance

2. **Implement Service Layer**
   - Create service class with static methods
   - Implement standardized response format
   - Add comprehensive error handling

3. **Create API Endpoints**
   - Map HTTP methods to service methods
   - Implement proper status codes
   - Add request/response validation

4. **Build Web Interface**
   - Create EJS templates for views
   - Implement client-side JavaScript
   - Add form validation and user feedback

5. **Add Testing**
   - Create basic functionality tests
   - Validate naming conventions
   - Test error scenarios

### Common Pitfalls to Avoid

1. **Database Connection Issues**
   - Always handle connection failures gracefully
   - Use environment variables for connection strings
   - Implement retry logic for production

2. **Error Response Inconsistency**
   - Maintain standardized response format
   - Always include meaningful error messages
   - Use appropriate HTTP status codes

3. **Input Validation Gaps**
   - Validate both client-side and server-side
   - Sanitize input data to prevent injection
   - Handle edge cases and malformed requests

4. **Memory Leaks in Express**
   - Properly close database connections
   - Avoid creating global variables in request handlers
   - Use connection pooling for database operations

### Extension Mechanisms

1. **Adding New Entities**
   - Follow the established service pattern
   - Reuse error handling middleware
   - Maintain naming convention consistency

2. **API Versioning**
   - Use route prefixes like `/api/v1/`
   - Maintain backward compatibility
   - Document breaking changes

3. **Authentication Integration**
   - Add middleware before route handlers
   - Implement JWT token validation
   - Extend service methods with user context

4. **Real-time Features**
   - Integrate Socket.io for live updates
   - Use event emission from service layer
   - Maintain RESTful API for non-real-time operations

---

## Conclusion

This Contact Application demonstrates a comprehensive implementation following Node.js best practices with Express.js and MongoDB. The architecture emphasizes:

- **Separation of Concerns**: Clear service layer separation from routing
- **Error Handling**: Comprehensive error management at all layers
- **Spanish Naming Convention**: Consistent use of snake_case Spanish variables
- **Standardized Responses**: Uniform API response format across all endpoints
- **Full CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Web Interface**: User-friendly HTML forms with client-side validation
- **Testing Coverage**: Basic but comprehensive test suite

When implementing new features, follow the established patterns for consistency and maintainability. The service layer pattern, standardized error handling, and Spanish naming conventions should be maintained across all new development.

Key implementation principles:
1. Always use try/catch blocks for async operations
2. Return standardized response objects from service methods
3. Implement proper HTTP status codes in API endpoints
4. Follow Spanish snake_case naming throughout the codebase
5. Add comprehensive error logging for debugging
6. Validate input data at multiple layers
7. Use Mongoose schema validation for data integrity