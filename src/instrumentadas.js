const { valorVenta, esVentaValida, claveTexto, tieneTildes, formatearNombreLugar} = require("./analitica");

function totalVendidoC(ventas, contador){
    let total = 0;
    for (const v of ventas) {
        contador.ops++; 
        total += valorVenta(v);
    }    
    return total;
}

function ventaMayorC(ventas, contador) {
  let mayor = null;
  let valorMayor = 0;
  for (const venta of ventas) {
    contador.ops ++;
    if (!esVentaValida(venta)) continue;
    const valor = valorVenta(venta);
    if (mayor === null || valor > valorMayor) {
      mayor = venta;
      valorMayor = valor;
    }
    contador.ops++
  }
  return mayor;
}

function totalPorCiudadC(ventas, contador) {
  const grupos = ventas.reduce((acumulado, venta) => {
    contador.ops++;
    if (!venta) return acumulado;
    const clave = claveTexto(venta.ciudad);
    const nombre = clave === '' ? 'Sin ciudad' : formatearNombreLugar(venta.ciudad);
    contador.ops++
    if (!acumulado[clave]) {
      acumulado[clave] = { nombre, total: 0 };
    } else if (!tieneTildes(acumulado[clave].nombre) && tieneTildes(nombre)) {
      acumulado[clave].nombre = nombre;
    }
    acumulado[clave].total += valorVenta(venta);
    return acumulado;
  }, {});

  return Object.fromEntries(Object.entries(grupos).map(([, grupo]) => [grupo.nombre, grupo.total]));
}

function primeraVentaC(ventas, contador){
    const firstSale = ventas[0]
    contador.ops++;
    return firstSale
}

module.exports = {
    totalVendidoC,
    ventaMayorC,
    totalPorCiudadC, 
    primeraVentaC
};