const {catalogo} = require('./catalogo');

const ventasDiarias = [320, 410, 280, 390, 510, 620, 700, 300, 290, 450,
480, 530, 610, 680, 350, 330, 420, 470, 560, 640,
710, 380, 360, 440, 500, 590, 650, 720, 400, 370];

function mejorSemanaBruta(dias, k) {
    let mejor = 0
    let inicio = 0
    for (let i = 0; i <= dias.length - k; i++) {
        let suma = 0;
        for (let j = i; j < i + k; j++) {
            suma += dias[j]
        }
        if (suma > mejor) {
            mejor = suma 
            inicio = i
        }
    }
    return {
        total: mejor,
        dia: inicio
    }
}

console.log(mejorSemanaBruta(ventasDiarias, 7))

function mejorSemana(dias, k){
    let inicioConteo = 0;
    let suma = 0;
    for (let i = 0; i < k ; i++) {
        suma += dias[i]
    }
    let mejorSemanaTotal = suma;
    for (let i = k; i < dias.length; i++) {
        suma += dias[i]
        suma -= dias[i - k]
        if (suma > mejorSemanaTotal) {
            mejorSemanaTotal = suma 
            inicioConteo = i - k + 1
        }
    }
    return {
        total: mejorSemanaTotal,
        dia: inicioConteo
    }
}

console.log(mejorSemana(ventasDiarias, 7))

const listaPrecios = []

for (const p of catalogo) {
    const precio = p.precio
    listaPrecios.push(precio)
}

const listaPreciosOrdenados =  listaPrecios.sort((a, b) => a - b)


function parMasCercano(precios, presupuesto) {
    let izq = 0
    let der = precios.length - 1
    let mejorSuma = 0;
    let primerPrecio = 0;
    let segundoPrecio = 0;

    while (izq < der) {
        let suma = precios[izq] + precios[der]
        if(suma > presupuesto){
            der--;
        }else{
            if (suma > mejorSuma) {
                mejorSuma = suma; 
                primerPrecio = precios[izq]
                segundoPrecio = precios[der]
            }
            izq++
        } 
    }
    return mejorSuma ? [primerPrecio, segundoPrecio] : null
}

console.log("Prueba par mas cercano")
console.log("Con 100.000")
console.log(parMasCercano(listaPreciosOrdenados, 100000))
console.log("Con 140.000")
console.log(parMasCercano(listaPreciosOrdenados, 140000))
console.log("Con 40.000")
console.log(parMasCercano(listaPreciosOrdenados, 40000))

console.log("Prueba con 100.000 dias")

const cienMilPrueba = Array.from({ length: 100000 }, () => Math.floor(Math.random() * 1000))

console.time('bruta')
console.log(mejorSemanaBruta(cienMilPrueba, 1000))
console.timeEnd('bruta')

console.time('ventana')
console.log(mejorSemana(cienMilPrueba, 1000))
console.timeEnd('ventana')

