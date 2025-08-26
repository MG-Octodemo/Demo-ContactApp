const app = require('../index.js');

console.log('🧪 Ejecutando tests básicos...\n');

// Test 1: Verificar que el módulo se exporta correctamente
function test_exportacion_modulo() {
    console.log('Test 1: Verificación de exportación del módulo');
    
    if (typeof app === 'function' || (typeof app === 'object' && app !== null && typeof app.listen === 'function')) {
        console.log('✅ PASÓ: El módulo se exporta correctamente');
        return true;
    } else {
        console.log('❌ FALLÓ: El módulo no se exporta correctamente');
        console.log('   Tipo recibido:', typeof app);
        return false;
    }
}

// Test 2: Verificar que Express está configurado
function test_configuracion_express() {
    console.log('\nTest 2: Verificación de configuración de Express');
    
    try {
        // Verificar que app tiene métodos de Express
        if (typeof app.listen === 'function' && 
            typeof app.get === 'function' && 
            typeof app.post === 'function') {
            console.log('✅ PASÓ: Express está configurado correctamente');
            return true;
        } else {
            console.log('❌ FALLÓ: Express no está configurado correctamente');
            return false;
        }
    } catch (error) {
        console.log('❌ FALLÓ: Error verificando configuración de Express:', error.message);
        return false;
    }
}

// Test 3: Verificar estructura de variables siguiendo convenciones
function test_convenciones_variables() {
    console.log('\nTest 3: Verificación de convenciones de nomenclatura');
    
    const codigo_fuente = require('fs').readFileSync('./index.js', 'utf8');
    
    // Verificar que las variables están en español y snake_case
    const variables_esperadas = [
        'puerto',
        'esquema_contacto',
        'servicio_contactos',
        'nombre_completo',
        'correo_electronico',
        'numero_telefono',
        'fecha_creacion'
    ];
    
    let variables_encontradas = 0;
    
    variables_esperadas.forEach(variable => {
        if (codigo_fuente.includes(variable)) {
            variables_encontradas++;
            console.log(`   ✓ Variable encontrada: ${variable}`);
        } else {
            console.log(`   ✗ Variable no encontrada: ${variable}`);
        }
    });
    
    const porcentaje_encontrado = (variables_encontradas / variables_esperadas.length) * 100;
    
    if (porcentaje_encontrado >= 80) {
        console.log(`✅ PASÓ: ${porcentaje_encontrado.toFixed(1)}% de variables siguen convenciones`);
        return true;
    } else {
        console.log(`❌ FALLÓ: Solo ${porcentaje_encontrado.toFixed(1)}% de variables siguen convenciones`);
        return false;
    }
}

// Test 4: Verificar endpoints básicos definidos
function test_endpoints_api() {
    console.log('\nTest 4: Verificación de endpoints de API');
    
    const codigo_fuente = require('fs').readFileSync('./index.js', 'utf8');
    
    const endpoints_esperados = [
        'GET /',
        'GET /contactos',
        'GET /api/contactos',
        'POST /api/contactos',
        'PUT /api/contactos/:id',
        'DELETE /api/contactos/:id'
    ];
    
    let endpoints_encontrados = 0;
    
    // Verificar patrones de definición de rutas
    if (codigo_fuente.includes("app.get('/'")) endpoints_encontrados++;
    if (codigo_fuente.includes("app.get('/contactos'")) endpoints_encontrados++;
    if (codigo_fuente.includes("app.get('/api/contactos'")) endpoints_encontrados++;
    if (codigo_fuente.includes("app.post('/api/contactos'")) endpoints_encontrados++;
    if (codigo_fuente.includes("app.put('/api/contactos/:id'")) endpoints_encontrados++;
    if (codigo_fuente.includes("app.delete('/api/contactos/:id'")) endpoints_encontrados++;
    
    console.log(`   Endpoints encontrados: ${endpoints_encontrados}/${endpoints_esperados.length}`);
    
    if (endpoints_encontrados >= 5) {
        console.log('✅ PASÓ: Endpoints principales están definidos');
        return true;
    } else {
        console.log('❌ FALLÓ: Faltan endpoints importantes');
        return false;
    }
}

// Test 5: Verificar manejo de errores
function test_manejo_errores() {
    console.log('\nTest 5: Verificación de manejo de errores');
    
    const codigo_fuente = require('fs').readFileSync('./index.js', 'utf8');
    
    const patrones_error = [
        'try',
        'catch',
        'console.error',
        'res.status(500)',
        'error.message'
    ];
    
    let patrones_encontrados = 0;
    
    patrones_error.forEach(patron => {
        if (codigo_fuente.includes(patron)) {
            patrones_encontrados++;
            console.log(`   ✓ Patrón de error encontrado: ${patron}`);
        }
    });
    
    if (patrones_encontrados >= 4) {
        console.log('✅ PASÓ: Manejo de errores implementado correctamente');
        return true;
    } else {
        console.log('❌ FALLÓ: Manejo de errores insuficiente');
        return false;
    }
}

// Ejecutar todos los tests
async function ejecutar_todos_tests() {
    const tests = [
        test_exportacion_modulo,
        test_configuracion_express,
        test_convenciones_variables,
        test_endpoints_api,
        test_manejo_errores
    ];
    
    let tests_pasados = 0;
    
    for (const test of tests) {
        if (test()) {
            tests_pasados++;
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`📊 RESUMEN DE TESTS:`);
    console.log(`   Tests ejecutados: ${tests.length}`);
    console.log(`   Tests pasados: ${tests_pasados}`);
    console.log(`   Tests fallidos: ${tests.length - tests_pasados}`);
    console.log(`   Porcentaje éxito: ${((tests_pasados / tests.length) * 100).toFixed(1)}%`);
    
    if (tests_pasados === tests.length) {
        console.log('\n🎉 ¡TODOS LOS TESTS PASARON!');
        process.exit(0);
    } else {
        console.log('\n⚠️  Algunos tests fallaron. Revisar implementación.');
        process.exit(1);
    }
}

// Evitar que el servidor se inicie durante las pruebas
if (require.main === module) {
    ejecutar_todos_tests();
}