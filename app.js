const express = require('express');
const app = express();


/*Funcion aleatoria*/

const EsValida = () => {
    let Numero = Math.random() * (101 - 1) + 1; //Numero aleatorio entre 1 y 100
    if (Numero <= 10) { //Si el número esta entre 1 y 100 la operación "falla" (10% de probabilidad)
        return false;
    } else {
        return true;
    }
}

/*Fin*/

/*Configuramos los middleware*/

//Primera validación "Evalua la petición del cliente"
app.use('/Transaccion', (req, res, next) => {
    if (EsValida()) {
        req.passed_middleware = ["Petición del cliente"] // Añadimos a los middleware superados
        next();
    } else {
        res.json({
            status: 400,
            passed_middleware: req.passed_middleware,
            message: "Bad Request"
        })
    }
})

//Segunda validación "Evalua si el cliente esta autorizado"
app.use('/Transaccion', (req, res, next) => {
    if (EsValida()) {
        req.passed_middleware.push("Autorización del cliente");
        next();
    } else {
        res.json({
            status: 401,
            passed_middleware: req.passed_middleware,
            message: "Unauthorized"
        })
    }
})

//Segunda validación "Evalua si el recurso esta disponible"
app.use('/Transaccion', (req, res, next) => {
    if (EsValida()) {
        req.passed_middleware.push("Disponibilidad del recurso");
        next();
    } else {
        res.json({
            status: 410,
            passed_middleware: req.passed_middleware,
            message: "Gone"
        })
    }
})

/*Fin de los middleware*/


//Configuramos la ruta
app.get('/Transaccion', (req, res) => {
    res.json({
        status: 200,
        passed_middleware: req.passed_middleware,
        Mensaje: "Success Transaction"
    });
})



//Ruta por defecto
app.all('*', (req, res) => {
    res.redirect('/Transaccion');
})

//Inicar servidor
app.listen(3000, () => {
    console.log("Escuchando peticiones en el puerto 3000");
})