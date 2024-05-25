# mi-banco

git clone https://github.com/siseveca79/mi-banco


npm install pg



CREATE DATABASE Banco;

\c Banco

CREATE TABLE cuentas (
    id INT PRIMARY KEY,
    saldo DECIMAL CHECK (saldo >= 0)
);

CREATE TABLE transferencias (
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(50),
    fecha VARCHAR(10),
    monto DECIMAL,
    cuenta_origen INT,
    cuenta_destino INT,
    FOREIGN KEY (cuenta_origen) REFERENCES cuentas(id),
    FOREIGN KEY (cuenta_destino) REFERENCES cuentas(id)
);

INSERT INTO cuentas (id, saldo) VALUES (1, 20000);
INSERT INTO cuentas (id, saldo) VALUES (2, 10000);


node initCuentas.js


node test.js



