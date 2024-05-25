const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Banco',
    password: 'Simi1935',
    port: 5432,
});

client.connect();

async function registrarTransferencia(descripcion, fecha, monto, cuentaOrigen, cuentaDestino) {
    try {
        await client.query('BEGIN');

        const resOrigen = await client.query('SELECT saldo FROM cuentas WHERE id = $1 FOR UPDATE', [cuentaOrigen]);
        const resDestino = await client.query('SELECT saldo FROM cuentas WHERE id = $1 FOR UPDATE', [cuentaDestino]);

        if (resOrigen.rows.length === 0 || resDestino.rows.length === 0) {
            throw new Error('Cuenta no encontrada');
        }

        const saldoOrigen = resOrigen.rows[0].saldo;
        if (saldoOrigen < monto) {
            throw new Error('\x1b[33;1m' + 'SALDO INSUFICIENTE EN LA CUENTA DE ORIGEN' + '\x1b[0m'); 
        }

        await client.query('UPDATE cuentas SET saldo = saldo - $1 WHERE id = $2', [monto, cuentaOrigen]);
        await client.query('UPDATE cuentas SET saldo = saldo + $1 WHERE id = $2', [monto, cuentaDestino]);

        const resTransferencia = await client.query(
            'INSERT INTO transferencias (descripcion, fecha, monto, cuenta_origen, cuenta_destino) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [descripcion, fecha, monto, cuentaOrigen, cuentaDestino]
        );

        await client.query('COMMIT');
        console.log('Transferencia registrada:', resTransferencia.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('\x1b[33;1m' + 'ERROR EN LA TRANSACCIÓN:' + '\x1b[0m', err.message); 
    }
}

async function consultarUltimasTransferencias(cuenta, limite = 10) {
    try {
        const res = await client.query(
            'SELECT * FROM transferencias WHERE cuenta_origen = $1 OR cuenta_destino = $1 ORDER BY id DESC LIMIT $2',
            [cuenta, limite]
        );
        console.log(`Últimas ${limite} transferencias de la cuenta ${cuenta}:`, res.rows);
    } catch (err) {
        console.error('Error al consultar transferencias:', err.message);
    }
}

async function consultarSaldo(cuenta) {
    try {
        const res = await client.query('SELECT saldo FROM cuentas WHERE id = $1', [cuenta]);
        if (res.rows.length === 0) {
            console.log('Cuenta no encontrada');
        } else {
            console.log(`Saldo de la cuenta ${cuenta}:`, res.rows[0].saldo);
        }
    } catch (err) {
        console.error('Error al consultar saldo:', err.message);
    }
}

module.exports = {
    client,
    registrarTransferencia,
    consultarUltimasTransferencias,
    consultarSaldo,
};
