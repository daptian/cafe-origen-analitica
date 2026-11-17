const {clientesRecurrentes} = require('./analitica')
const {ventas} = require('./datos')
const {generarVentas}  = require('./generador')

console.log('\nverifcaciòn de que la funcion devuelva ["C01", "C02", "C03"]: ', clientesRecurrentes(ventas))

for (const n of [1000, 2000, 4000, 8000 ,16000, 100000]) {
    const ventasGeneradas = generarVentas(n)
    console.time(`n = ${n}`)
    clientesRecurrentes(ventasGeneradas)
    console.timeEnd(`n = ${n}`)
}