const { totalVendidoC, ventaMayorC ,totalPorCiudadC, primeraVentaC} = require( './instrumentadas')
const { generarVentas } = require('./generador')
const {ventas} = require('./datos')
const { totalCiudadCadena, totalCiudadUnaPasada, 
    contarVentasValidas,
    totalVendido,
    unidadesVendidas,
    ticketPromedio,
    ventasPorCiudad,
    totalVendidoM,
    unidadesVendidasM,
    ventasPorCiudadM,
    agruparPorProducto,
    unidadesPorProducto,
    topProductosPorValor,
    ventasOrdenadasPorValor,
    ventasDelDia,
    clientesRecurrentes
 } = require('./analitica')

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

// console.log("\nMinireto 7:")
// console.log("Funciòn de reporte por ciudad")

console.log(totalCiudadCadena(ventas, "Pereira"))
console.log(totalCiudadUnaPasada(ventas, "Pereira"))

console.log("\nMinireto 8: Mediciones con 10.000 datos.")
console.log("----------------------------------------")

const ventasDePrueba = generarVentas(10000)

console.time('contarVentasValidas')
contarVentasValidas(ventasDePrueba)
console.timeEnd('contarVentasValidas')

console.time('totalVendido')
totalVendido(ventasDePrueba)
console.timeEnd('totalVendido')

console.time('unidadesVendidas')
unidadesVendidas(ventasDePrueba)
console.timeEnd('unidadesVendidas')

console.time('ticketPromedio')
ticketPromedio(ventasDePrueba)
console.timeEnd('ticketPromedio')

console.time('ventasPorCiudad', 'Medellín')
ventasPorCiudad(ventasDePrueba)
console.timeEnd('ventasPorCiudad')

console.time('totalVendidoM')
totalVendidoM(ventasDePrueba)
console.timeEnd('totalVendidoM')

console.time('unidadesVendidasM')
unidadesVendidasM(ventasDePrueba)
console.timeEnd('unidadesVendidasM')

console.time('ventasPorCiudadM')
ventasPorCiudadM(ventasDePrueba, 'Medellín')
console.timeEnd('ventasPorCiudadM')

console.time('agruparPorProducto')
agruparPorProducto(ventasDePrueba)
console.timeEnd('agruparPorProducto')

console.time('unidadesPorProducto')
unidadesPorProducto(ventasDePrueba)
console.timeEnd('unidadesPorProducto')

console.time('topProductosPorValor')
topProductosPorValor(ventasDePrueba, 3)
console.timeEnd('topProductosPorValor')

console.time('ventasOrdenadasPorValor')
ventasOrdenadasPorValor(ventasDePrueba)
console.timeEnd('ventasOrdenadasPorValor')

console.time('ventasDelDia')
ventasDelDia(ventasDePrueba, '2026-09-04')
console.timeEnd('ventasDelDia')

console.time('clientesRecurrentes')
clientesRecurrentes(ventasDePrueba)
console.timeEnd('clientesRecurrentes')

console.time('totalCiudadCadena')
totalCiudadCadena(ventasDePrueba, 'Medellín')
console.timeEnd('totalCiudadCadena')

console.time('totalCiudadUnaPasada')
totalCiudadUnaPasada(ventasDePrueba, 'Medellín')
console.timeEnd('totalCiudadUnaPasada')