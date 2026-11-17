const { totalVendidoC, ventaMayorC ,totalPorCiudadC, primeraVentaC} = require( './instrumentadas')
const { generarVentas } = require('./generador')
const {ventas} = require('./datos')

const nValues = [100, 1000, 10000, 100000]

const data = []

function primeraVenta(ventas){
    const firstSale = ventas[0]
    return firstSale
}

for (let i = 0; i < nValues.length; i++) {
    const ventas = generarVentas(nValues[i])
    const contadorTotalV = { ops : 0}
    const contadorVentaM = { ops : 0}
    const contadorTotalC = { ops : 0}
    const contadorPrimeraV = {ops : 0}

    totalVendidoC(ventas, contadorTotalV)
    ventaMayorC(ventas, contadorVentaM)
    totalPorCiudadC(ventas, contadorTotalC)
    primeraVentaC(ventas, contadorPrimeraV)
    data.push({
        n: nValues[i],
        totalVendido : contadorTotalV.ops,
        ventaMayor : contadorVentaM.ops,
        totalPorCiudad : contadorTotalC.ops,
        primeraVenta: contadorPrimeraV.ops
    })
}

console.table(data)

