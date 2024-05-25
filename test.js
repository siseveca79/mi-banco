const { client, registrarTransferencia, consultarUltimasTransferencias, consultarSaldo } = require('./app');

(async () => {
    await registrarTransferencia('Pago de servicios', '2024-05-23', 5000, 1, 2);
    await consultarUltimasTransferencias(1);
    await consultarSaldo(1);
    client.end();  
})();
