const {formatearNombreLugar} = require('./analitica.js')

const catalogo = [
  { producto: "Origen Nariño 250 g", precio: 26000 },
  { producto: "Origen Huila 500 g", precio: 42000 },
  { producto: "Origen Sierra 500 g", precio: 45000 },
  { producto: "Filtros de papel x100", precio: 18000 },
  { producto: "Taza de cerámica", precio: 35000 },
  { producto: "Origen Huila 1 kg", precio: 79000 },
  { producto: "Prensa francesa", precio: 95000 },
  { producto: "Molino manual", precio: 120000 },
];

function comboRegaloFuerzaBruta(catalogo, valor){
    const productos = [];
    for (let i = 0; i < catalogo.length; i++) {
        for (let j = i + 1; j < catalogo.length; j++) {
            const sumaTotal = catalogo[i].precio + catalogo[j].precio
            if (catalogo[i] === catalogo[j]) {
                continue
            }else if(sumaTotal == valor){
                productos.push(catalogo[i], catalogo[j])
            }
        }
    }
    return productos
}

function comboRegaloMap(catalogo, valor){
    const vistos = new Map();
    for (const p of catalogo) {
        const falta = valor - p.precio
        if (vistos.has(falta)) return [vistos.get(falta), p];
        vistos.set(p.precio, p)
    }
    return null
}

if(require.main === module){
    console.log("Prueba con 87.000")
    console.log(comboRegaloFuerzaBruta(catalogo, 87000))
    console.log(comboRegaloMap(catalogo, 87000))

    console.log("Prueba con 61.000")
    console.log(comboRegaloFuerzaBruta(catalogo, 61000))
    console.log(comboRegaloMap(catalogo, 61000))

    console.log("Prueba con 92.000")
    console.log(comboRegaloFuerzaBruta(catalogo, 92000))
    console.log(comboRegaloMap(catalogo, 92000))

    console.log("<--------------------->")
    console.log("\nproductoEstrellaPorCiudad(ventas)")
}


function productoEstrellaPorCiudad(ventas) {
    const conteo = new Map();
    for (const venta of ventas) {
        const ciudad = formatearNombreLugar(venta.ciudad);

        if (!conteo.has(ciudad)) conteo.set(ciudad, new Map());

        const productos = conteo.get(ciudad);
        productos.set(venta.producto, (productos.get(venta.producto) || 0) + 1);
    }
    const resultado = {};

    for (const [ciudad, productos] of conteo) {
        let estrella = null;
        let max = 0;

        for (const [producto, cantidad] of productos) {
            if (cantidad > max) {
                max = cantidad;
                estrella = producto;
            }
        }

        resultado[ciudad] = estrella;
    }

    return resultado;
}


function primerClienteUnico(ventas){
    const conteo = new Map();
    for (const v of ventas) {
        conteo.set(v.cliente, (conteo.get(v.cliente) || 0) + 1)    
    }
    for (const v of ventas) {
        if (conteo.get(v.cliente) == 1) {
            return v.cliente
        }
    }
    return null
}

module.exports = {
    catalogo,
    comboRegaloFuerzaBruta,
    comboRegaloMap,
    productoEstrellaPorCiudad,
    primerClienteUnico
}