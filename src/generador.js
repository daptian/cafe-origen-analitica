const { ventas } = require("./datos");

const productList = [
    {
        producto: 'Origen Huila 500 g', 
        precio: 35000
    },
    {
        producto: 'Origen Huila 225 g',
        precio: 28000
    },
    {
        producto: 'Origen Antioquia 1000 g',
        precio: 42000
    },
    {
        producto: 'Origen Retiro 225 g',
        precio: 29000
    },
    {
        producto:'Origen Antioquia 250 g',
        precio: 32000
    },
    {
        producto: 'Molino manual',
        precio: 52000
    },
    {
        producto: "Prensa Francesa",
        precio: 100000
    },
    {
        producto: 'Origen Nariño 250 g',
        precio: 32000
    },
    {
        producto: 'Origen Nariño 500 g',
        precio: 35000
    },
    {
        producto:  'Origen Sierra 500 g',
        precio: 37000
    }
]

const citiesList = ventas.map(v => v.ciudad)


function generarVentas(n) {
    const ventas = [];
    const max =  Math.floor(n / 3) 
    for (let i = 0; i < n; i++) {
        const randomClient = Math.floor(Math.random() * (max - 1 + 1)) + 1 
        const randomProduct = Math.floor(Math.random() * (productList.length))  
        const randomCity = Math.floor(Math.random() *  (citiesList.length))
        const randomQuantity = Math.floor(Math.random() * (5 - 1 + 1)) + 1

        ventas.push({
            id: i + 1, 
            fecha: '2026-09', 
            cliente: 'C0' + randomClient,
            producto: productList[randomProduct].producto,
            ciudad: citiesList[randomCity] ,
            cantidad: randomQuantity ,
            precio: productList[randomProduct].precio
        })
    }
    return ventas;
}

module.exports = {
    generarVentas
}