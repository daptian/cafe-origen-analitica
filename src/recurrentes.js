const {clientesRecurrentes} = require('./analitica')
const {ventas} = require('./datos')
const {generarVentas}  = require('./generador')

console.log('\nverifcaciòn de que la funcion devuelva ["C01", "C02", "C03"]: ', clientesRecurrentes(ventas))

for (const n of [1000, 2000, 4000, 8000 ,16000]) {
    const ventasGeneradas = generarVentas(n)
    console.time(`n = ${n}`)
    clientesRecurrentes(ventasGeneradas)
    console.timeEnd(`n = ${n}`)
}

function clientesRecurrentesSet(ventas){
    const vistos = new Set();
    const recurrentes = new Set();
    for (const v of ventas) {
        if (vistos.has(v.cliente)) {
            recurrentes.add(v.cliente)
        }else{
            vistos.add(v.cliente)
        }
    }
    return [...recurrentes].sort()
}

function comprasPorCliente(ventas){
    const compras = new Map();
    for (const v of ventas) {
        compras.set(v.cliente, (compras.get(v.cliente) || 0) + 1)
    }
    const comprasMap = recurrentesDesdeMap(compras)
    return comprasMap.sort()
}


function recurrentesDesdeMap(compras){
    const auxArray = []
    for (const [cliente, cantidad] of compras) {
        if (cantidad > 1) {
            auxArray.push(cliente)
        }
    }
    return auxArray.sort()
}

// Verficacion con las ventas del dia 1

console.log("Versiòn Original para 12 ventas")
console.log(clientesRecurrentes(ventas).sort())
console.log("Versiòn con Set para 12 ventas")
console.log(clientesRecurrentesSet(ventas))
console.log("Versiòn con map para 12 ventas")
console.log(comprasPorCliente(ventas))

// Verificacion con 5 Mil datos

const ventasGeneradas = generarVentas(5000)

console.log("Versiòn Original para 5.000 ventas")
console.log(clientesRecurrentes(ventasGeneradas).sort())
console.log("Versiòn con Set para 5.000 ventas")
console.log(clientesRecurrentesSet(ventasGeneradas))
console.log("Versiòn con map para 5.000 ventas")
console.log(comprasPorCliente(ventasGeneradas))


console.log("Mediciones")
console.log("<==================================>")

console.log("Original")
for (const n of [1000, 10000]) {
    const ventasGeneradas = generarVentas(n)
    console.time(`n = ${n}`)
    clientesRecurrentes(ventasGeneradas)
    console.timeEnd(`n = ${n}`)
}

console.log("Set")
for (const n of [1000, 10000, 100000]) {
    const ventasGeneradas = generarVentas(n)
    console.time(`n = ${n}`)
    clientesRecurrentesSet(ventasGeneradas)
    console.timeEnd(`n = ${n}`)
}
console.log("Map")
for (const n of [1000, 10000, 100000]) {
    const ventasGeneradas = generarVentas(n)
    console.time(`n = ${n}`)
    comprasPorCliente(ventasGeneradas)
    console.timeEnd(`n = ${n}`)
}
