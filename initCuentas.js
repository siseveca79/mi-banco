const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Banco',
    password: 'Simi1935',
    port: 5432,
});

client.connect();

async function initCuentas() {
    try {
        await client.query('BEGIN');
        
  
        await client.query('DELETE FROM transferencias;');
        await client.query('DELETE FROM cuentas;');
        
  
        await client.query('INSERT INTO cuentas (id, saldo) VALUES (1, 20000), (2, 10000);');
        
        await client.query('COMMIT');
        console.log('Cuentas inicializadas correctamente.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error al inicializar cuentas:', err.message);
    } finally {
        client.end();
    }
}

initCuentas();
