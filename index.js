const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const puerto = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/contactapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a MongoDB');
}).catch(error => {
    console.error('Error conectando a MongoDB:', error);
});

// Modelo de Contacto
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

// Servicio de Contactos
class servicio_contactos {
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

    static async obtener_contacto_por_id(id_contacto) {
        try {
            const contacto = await Contacto.findById(id_contacto);
            if (!contacto) {
                return {
                    exito: false,
                    mensaje: 'Contacto no encontrado'
                };
            }
            return {
                exito: true,
                datos: contacto
            };
        } catch (error) {
            console.error('Error obteniendo contacto por ID:', error);
            return {
                exito: false,
                mensaje: 'Error al obtener contacto',
                error: error.message
            };
        }
    }

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
}

// Rutas de la API
app.get('/', (req, res) => {
    res.render('index');
});

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

app.get('/contactos/nuevo', (req, res) => {
    res.render('contactAdd');
});

// API endpoints JSON
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

app.get('/api/contactos/:id', async (req, res) => {
    try {
        const id_contacto = req.params.id;
        const resultado = await servicio_contactos.obtener_contacto_por_id(id_contacto);
        
        if (resultado.exito) {
            res.json(resultado);
        } else {
            const codigo_estado = resultado.mensaje === 'Contacto no encontrado' ? 404 : 500;
            res.status(codigo_estado).json(resultado);
        }
    } catch (error) {
        console.error('Error en API /api/contactos/:id:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
});

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

app.put('/api/contactos/:id', async (req, res) => {
    try {
        const id_contacto = req.params.id;
        const datos_actualizacion = req.body;
        const resultado = await servicio_contactos.actualizar_contacto(id_contacto, datos_actualizacion);
        
        if (resultado.exito) {
            res.json(resultado);
        } else {
            const codigo_estado = resultado.mensaje === 'Contacto no encontrado' ? 404 : 400;
            res.status(codigo_estado).json(resultado);
        }
    } catch (error) {
        console.error('Error en API PUT /api/contactos/:id:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
});

app.delete('/api/contactos/:id', async (req, res) => {
    try {
        const id_contacto = req.params.id;
        const resultado = await servicio_contactos.eliminar_contacto(id_contacto);
        
        if (resultado.exito) {
            res.json(resultado);
        } else {
            const codigo_estado = resultado.mensaje === 'Contacto no encontrado' ? 404 : 500;
            res.status(codigo_estado).json(resultado);
        }
    } catch (error) {
        console.error('Error en API DELETE /api/contactos/:id:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
});

// Manejo de errores global
app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);
    res.status(500).json({
        exito: false,
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        exito: false,
        mensaje: 'Ruta no encontrada'
    });
});

// Iniciar servidor solo si no estamos en modo test
if (require.main === module) {
    app.listen(puerto, () => {
        console.log(`Servidor ejecutándose en puerto ${puerto}`);
    });
}

module.exports = app;