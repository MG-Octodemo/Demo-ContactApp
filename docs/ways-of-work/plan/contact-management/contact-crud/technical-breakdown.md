# Contact CRUD Technical Breakdown

## Architecture Overview

### System Architecture
The Contact CRUD functionality follows a traditional 3-tier web architecture:

1. **Presentation Layer**: EJS templates with client-side JavaScript
2. **Application Layer**: Node.js with Express.js framework
3. **Data Layer**: MongoDB with Mongoose ODM

### Component Structure
```
src/
├── models/
│   └── Contact.js          # MongoDB schema and model
├── controllers/
│   └── contactController.js # Business logic and request handling
├── routes/
│   └── contactRoutes.js    # Route definitions and middleware
├── views/
│   ├── contacts/
│   │   ├── index.ejs       # Contact list view
│   │   ├── create.ejs      # Contact creation form
│   │   ├── edit.ejs        # Contact edit form
│   │   └── show.ejs        # Contact detail view
│   └── layouts/
│       └── main.ejs        # Base layout template
├── public/
│   ├── css/
│   │   └── styles.css      # Application styles
│   └── js/
│       └── contacts.js     # Client-side JavaScript
└── middleware/
    ├── validation.js       # Input validation middleware
    └── errorHandler.js     # Error handling middleware
```

## Data Model Design

### Contact Schema (MongoDB)
```javascript
const contactSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100,
    validate: {
      validator: function(v) {
        return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v);
      },
      message: 'El nombre solo puede contener letras y espacios'
    }
  },
  correo_electronico: {
    type: String,
    trim: true,
    lowercase: true,
    maxLength: 255,
    validate: {
      validator: function(v) {
        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Formato de correo electrónico inválido'
    }
  },
  numero_telefono: {
    type: String,
    trim: true,
    maxLength: 20,
    validate: {
      validator: function(v) {
        return !v || /^[\+]?[\d\s\-\(\)]+$/.test(v);
      },
      message: 'Formato de número de teléfono inválido'
    }
  },
  empresa: {
    type: String,
    trim: true,
    maxLength: 100
  },
  notas: {
    type: String,
    trim: true,
    maxLength: 500
  },
  fecha_creacion: {
    type: Date,
    default: Date.now
  },
  fecha_modificacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { 
    createdAt: 'fecha_creacion', 
    updatedAt: 'fecha_modificacion' 
  }
});

// Índices para optimización de consultas
contactSchema.index({ nombre: 1 });
contactSchema.index({ correo_electronico: 1 });
contactSchema.index({ fecha_creacion: -1 });
```

### Database Considerations
- **Indexing Strategy**: Composite indexes for common query patterns
- **Document Size**: Optimized for typical contact data volume
- **Schema Validation**: MongoDB validation rules for data integrity
- **Performance**: Efficient queries for list, search, and CRUD operations

## API Design

### RESTful Endpoints

#### Contact Management Endpoints
```javascript
// GET /contactos - Listar todos los contactos
router.get('/contactos', contactController.listar_contactos);

// GET /contactos/crear - Mostrar formulario de creación
router.get('/contactos/crear', contactController.mostrar_formulario_crear);

// POST /contactos - Crear nuevo contacto
router.post('/contactos', 
  validation.validar_contacto,
  contactController.crear_contacto
);

// GET /contactos/:id - Mostrar detalles del contacto
router.get('/contactos/:id', 
  validation.validar_id_objectid,
  contactController.mostrar_contacto
);

// GET /contactos/:id/editar - Mostrar formulario de edición
router.get('/contactos/:id/editar', 
  validation.validar_id_objectid,
  contactController.mostrar_formulario_editar
);

// PUT /contactos/:id - Actualizar contacto
router.put('/contactos/:id', 
  validation.validar_id_objectid,
  validation.validar_contacto,
  contactController.actualizar_contacto
);

// DELETE /contactos/:id - Eliminar contacto
router.delete('/contactos/:id', 
  validation.validar_id_objectid,
  contactController.eliminar_contacto
);

// GET /api/contactos/buscar - Buscar contactos (AJAX)
router.get('/api/contactos/buscar', 
  contactController.buscar_contactos
);
```

#### Request/Response Formats

**Contact Creation Request:**
```json
{
  "nombre": "Juan Pérez",
  "correo_electronico": "juan.perez@ejemplo.com",
  "numero_telefono": "+34 123 456 789",
  "empresa": "Empresa Ejemplo",
  "notas": "Contacto importante del proyecto"
}
```

**Contact Response:**
```json
{
  "_id": "64a7b2c1d5e6f7a8b9c0d1e2",
  "nombre": "Juan Pérez",
  "correo_electronico": "juan.perez@ejemplo.com",
  "numero_telefono": "+34 123 456 789",
  "empresa": "Empresa Ejemplo",
  "notas": "Contacto importante del proyecto",
  "fecha_creacion": "2024-01-15T10:30:00.000Z",
  "fecha_modificacion": "2024-01-15T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "error": true,
  "mensaje": "Error de validación",
  "detalles": [
    {
      "campo": "correo_electronico",
      "mensaje": "Formato de correo electrónico inválido"
    }
  ]
}
```

## Controller Implementation

### Contact Controller Structure
```javascript
class ControladorContacto {
  
  // Listar contactos con paginación y búsqueda
  async listar_contactos(req, res) {
    try {
      const pagina = parseInt(req.query.pagina) || 1;
      const limite = 10;
      const termino_busqueda = req.query.busqueda || '';
      
      const filtro_busqueda = termino_busqueda ? {
        $or: [
          { nombre: { $regex: termino_busqueda, $options: 'i' } },
          { correo_electronico: { $regex: termino_busqueda, $options: 'i' } },
          { empresa: { $regex: termino_busqueda, $options: 'i' } }
        ]
      } : {};
      
      const contactos = await Contact.find(filtro_busqueda)
        .sort({ nombre: 1 })
        .limit(limite)
        .skip((pagina - 1) * limite)
        .lean();
        
      const total_contactos = await Contact.countDocuments(filtro_busqueda);
      const total_paginas = Math.ceil(total_contactos / limite);
      
      res.render('contacts/index', {
        contactos,
        pagina_actual: pagina,
        total_paginas,
        termino_busqueda,
        titulo: 'Lista de Contactos'
      });
    } catch (error) {
      res.status(500).render('error', { 
        mensaje: 'Error al cargar la lista de contactos',
        error 
      });
    }
  }
  
  // Crear nuevo contacto
  async crear_contacto(req, res) {
    try {
      const datos_contacto = {
        nombre: req.body.nombre,
        correo_electronico: req.body.correo_electronico,
        numero_telefono: req.body.numero_telefono,
        empresa: req.body.empresa,
        notas: req.body.notas
      };
      
      const nuevo_contacto = new Contact(datos_contacto);
      await nuevo_contacto.save();
      
      req.flash('success', 'Contacto creado exitosamente');
      res.redirect('/contactos');
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errores_validacion = Object.values(error.errors)
          .map(err => ({ campo: err.path, mensaje: err.message }));
        
        return res.status(400).render('contacts/create', {
          errores: errores_validacion,
          datos: req.body,
          titulo: 'Crear Contacto'
        });
      }
      
      res.status(500).render('error', { 
        mensaje: 'Error al crear el contacto',
        error 
      });
    }
  }
  
  // Actualizar contacto existente
  async actualizar_contacto(req, res) {
    try {
      const { id } = req.params;
      
      const datos_actualizacion = {
        nombre: req.body.nombre,
        correo_electronico: req.body.correo_electronico,
        numero_telefono: req.body.numero_telefono,
        empresa: req.body.empresa,
        notas: req.body.notas,
        fecha_modificacion: new Date()
      };
      
      const contacto_actualizado = await Contact.findByIdAndUpdate(
        id, 
        datos_actualizacion, 
        { new: true, runValidators: true }
      );
      
      if (!contacto_actualizado) {
        return res.status(404).render('error', { 
          mensaje: 'Contacto no encontrado' 
        });
      }
      
      req.flash('success', 'Contacto actualizado exitosamente');
      res.redirect(`/contactos/${id}`);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errores_validacion = Object.values(error.errors)
          .map(err => ({ campo: err.path, mensaje: err.message }));
        
        return res.status(400).render('contacts/edit', {
          errores: errores_validacion,
          contacto: req.body,
          titulo: 'Editar Contacto'
        });
      }
      
      res.status(500).render('error', { 
        mensaje: 'Error al actualizar el contacto',
        error 
      });
    }
  }
  
  // Eliminar contacto
  async eliminar_contacto(req, res) {
    try {
      const { id } = req.params;
      
      const contacto_eliminado = await Contact.findByIdAndDelete(id);
      
      if (!contacto_eliminado) {
        return res.status(404).json({ 
          error: true, 
          mensaje: 'Contacto no encontrado' 
        });
      }
      
      req.flash('success', 'Contacto eliminado exitosamente');
      res.redirect('/contactos');
    } catch (error) {
      res.status(500).json({ 
        error: true, 
        mensaje: 'Error al eliminar el contacto',
        detalles: error.message 
      });
    }
  }
}
```

## Validation and Middleware

### Input Validation Middleware
```javascript
const { body, param, validationResult } = require('express-validator');

const validacion_contacto = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
    
  body('correo_electronico')
    .optional({ checkFalsy: true })
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('Formato de correo electrónico inválido')
    .isLength({ max: 255 })
    .withMessage('El correo no puede exceder 255 caracteres'),
    
  body('numero_telefono')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[\+]?[\d\s\-\(\)]+$/)
    .withMessage('Formato de número de teléfono inválido')
    .isLength({ max: 20 })
    .withMessage('El número de teléfono no puede exceder 20 caracteres'),
    
  body('empresa')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('La empresa no puede exceder 100 caracteres'),
    
  body('notas')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Las notas no pueden exceder 500 caracteres')
];

const validar_id_objectid = [
  param('id')
    .isMongoId()
    .withMessage('ID de contacto inválido')
];

const manejar_errores_validacion = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      error: true,
      mensaje: 'Error de validación',
      detalles: errores.array()
    });
  }
  next();
};
```

## Frontend Implementation

### Client-Side JavaScript
```javascript
class GestorContactos {
  constructor() {
    this.inicializar_eventos();
    this.configurar_busqueda();
  }
  
  inicializar_eventos() {
    // Confirmación de eliminación
    document.querySelectorAll('.btn-eliminar').forEach(boton => {
      boton.addEventListener('click', this.confirmar_eliminacion.bind(this));
    });
    
    // Validación de formularios
    const formulario_contacto = document.getElementById('formulario-contacto');
    if (formulario_contacto) {
      formulario_contacto.addEventListener('submit', this.validar_formulario.bind(this));
    }
  }
  
  configurar_busqueda() {
    const input_busqueda = document.getElementById('busqueda');
    if (input_busqueda) {
      let timeout;
      input_busqueda.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.buscar_contactos(e.target.value);
        }, 300);
      });
    }
  }
  
  async buscar_contactos(termino) {
    try {
      const respuesta = await fetch(`/api/contactos/buscar?q=${encodeURIComponent(termino)}`);
      const datos = await respuesta.json();
      
      if (datos.error) {
        this.mostrar_error(datos.mensaje);
        return;
      }
      
      this.actualizar_lista_contactos(datos.contactos);
    } catch (error) {
      this.mostrar_error('Error al buscar contactos');
    }
  }
  
  confirmar_eliminacion(evento) {
    evento.preventDefault();
    
    const modal_confirmacion = new bootstrap.Modal(document.getElementById('modal-confirmacion'));
    const boton_confirmar = document.getElementById('btn-confirmar-eliminacion');
    
    boton_confirmar.onclick = () => {
      const formulario = evento.target.closest('form');
      formulario.submit();
    };
    
    modal_confirmacion.show();
  }
  
  validar_formulario(evento) {
    const formulario = evento.target;
    const errores = [];
    
    // Validación del nombre
    const nombre = formulario.nombre.value.trim();
    if (!nombre) {
      errores.push({ campo: 'nombre', mensaje: 'El nombre es obligatorio' });
    } else if (nombre.length > 100) {
      errores.push({ campo: 'nombre', mensaje: 'El nombre no puede exceder 100 caracteres' });
    }
    
    // Validación del correo
    const correo = formulario.correo_electronico.value.trim();
    if (correo && !this.validar_email(correo)) {
      errores.push({ campo: 'correo_electronico', mensaje: 'Formato de correo inválido' });
    }
    
    if (errores.length > 0) {
      evento.preventDefault();
      this.mostrar_errores_validacion(errores);
    }
  }
  
  validar_email(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  mostrar_errores_validacion(errores) {
    // Limpiar errores anteriores
    document.querySelectorAll('.error-validacion').forEach(el => el.remove());
    
    errores.forEach(error => {
      const campo = document.querySelector(`[name="${error.campo}"]`);
      if (campo) {
        const mensaje_error = document.createElement('div');
        mensaje_error.className = 'error-validacion text-danger small mt-1';
        mensaje_error.textContent = error.mensaje;
        campo.parentNode.appendChild(mensaje_error);
        campo.classList.add('is-invalid');
      }
    });
  }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  new GestorContactos();
});
```

## Performance Optimization

### Database Optimization
- **Indexing Strategy**: Strategic indexes for common queries
- **Query Optimization**: Efficient MongoDB queries with projections
- **Connection Pooling**: Optimized connection management
- **Pagination**: Efficient pagination for large datasets

### Caching Strategy
- **Application-Level Caching**: Redis for frequently accessed data
- **Browser Caching**: Appropriate cache headers for static assets
- **Database Query Caching**: Mongoose query result caching

### Frontend Optimization
- **Asset Minification**: CSS and JavaScript minification
- **Image Optimization**: Optimized image formats and sizes
- **Lazy Loading**: Lazy loading for non-critical resources
- **Code Splitting**: Modular JavaScript loading

## Security Implementation

### Input Sanitization
- **XSS Prevention**: HTML entity encoding for user input
- **NoSQL Injection Prevention**: Parameterized queries and validation
- **CSRF Protection**: Cross-site request forgery tokens
- **Rate Limiting**: API rate limiting to prevent abuse

### Data Protection
- **Encryption**: Sensitive data encryption at rest and in transit
- **Secure Headers**: Security headers for web application
- **Authentication**: Secure user authentication mechanisms
- **Authorization**: Role-based access control

## Error Handling

### Application-Level Error Handling
```javascript
const manejador_errores = (error, req, res, next) => {
  console.error('Error de aplicación:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: true,
      mensaje: 'Error de validación',
      detalles: Object.values(error.errors).map(err => ({
        campo: err.path,
        mensaje: err.message
      }))
    });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({
      error: true,
      mensaje: 'ID de contacto inválido'
    });
  }
  
  res.status(500).json({
    error: true,
    mensaje: 'Error interno del servidor',
    detalles: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
  });
};
```

## Testing Strategy Integration

### Unit Testing Structure
- **Model Tests**: Contact schema validation and methods
- **Controller Tests**: Business logic and error handling
- **Middleware Tests**: Validation and error handling middleware
- **Utility Tests**: Helper functions and utilities

### Integration Testing
- **API Endpoint Tests**: Complete request/response cycles
- **Database Integration**: MongoDB operations and data integrity
- **Authentication Integration**: User authentication and authorization

### End-to-End Testing
- **User Workflow Tests**: Complete user journey validation
- **Cross-Browser Tests**: Browser compatibility validation
- **Performance Tests**: Load and stress testing scenarios

This technical breakdown provides the foundation for comprehensive test planning following ISTQB methodologies and ISO 25010 quality standards.