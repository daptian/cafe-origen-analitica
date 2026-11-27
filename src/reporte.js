const { ventas } = require('./datos');
const {
  claveTexto,
  valorVenta,
  contarVentasValidas,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
  esFechaValida,
  clientesRecurrentes, 
} = require('./analitica');
const { generarVentas } = require('./generador');
const {
  catalogo,
  comboRegaloMap,
  productoEstrellaPorCiudad,
  primerClienteUnico,
} = require('./catalogo');
const { clientesRecurrentesSet } = require('./recurrentes'); 
const { mejorSemana, parMasCercano } = require('./mejor-cercano');

const ANCHO = 64;
const FECHAS_POR_DEFECTO = ['2026-09-04', '2026-09-07'];
const PRESUPUESTO_COMBO = 87000;
const DIAS_SEMANA = 7;
const MAX_RECURRENTES_MOSTRADOS = 5;

const preciosOrdenados = catalogo.map((p) => p.precio).sort((a, b) => a - b);

function pesos(valor) {
  return Number(valor).toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function numero(valor) {
  return Number(valor).toLocaleString('es-CO');
}

function porcentaje(parte, total) {
  if (total === 0) return '0,0 %';
  return `${((parte / total) * 100).toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
}

function titulo(texto) {
  return ['', texto, '─'.repeat(ANCHO)];
}

function dato(etiqueta, valor) {
  return `  ${`${etiqueta} `.padEnd(34, '.')} ${valor}`;
}

function tabla(columnas, filas, pie) {
  const todas = pie ? [...filas, pie] : filas;
  const anchos = columnas.map((col) =>
    Math.max(col.titulo.length, ...todas.map((fila) => String(fila[col.clave]).length))
  );
  const celda = (texto, i) =>
    columnas[i].derecha ? String(texto).padStart(anchos[i]) : String(texto).padEnd(anchos[i]);
  const linea = (fila) => `  ${columnas.map((col, i) => celda(fila[col.clave], i)).join('   ')}`;
  const separador = `  ${anchos.map((ancho) => '-'.repeat(ancho)).join('   ')}`;

  const resultado = [`  ${columnas.map((col, i) => celda(col.titulo, i)).join('   ')}`, separador];
  for (const fila of filas) resultado.push(linea(fila));
  if (pie) resultado.push(separador, linea(pie));
  return resultado;
}

function describirVenta(venta) {
  if (venta === null) return 'Sin ventas válidas';
  return `#${venta.id} · ${venta.producto} · ${pesos(valorVenta(venta))}`;
}

function seccionResumen(datos) {
  const fechas = datos.map((venta) => venta.fecha).sort();
  const periodo = fechas.length === 0 ? 'Sin datos' : `${fechas[0]} a ${fechas[fechas.length - 1]}`;
  const validas = contarVentasValidas(datos);

  return [
    ...titulo('1. RESUMEN GENERAL'),
    dato('Periodo', periodo),
    dato('Registros', numero(datos.length)),
    dato('Ventas válidas (cantidad > 0)', numero(validas)),
    dato('Registros sin unidades', numero(datos.length - validas)),
    dato('Unidades vendidas', numero(unidadesVendidas(datos))),
    dato('Total vendido', pesos(totalVendido(datos))),
    dato('Ticket promedio', pesos(ticketPromedio(datos))),
    dato('Venta más grande', describirVenta(ventaMayor(datos))),
  ];
}

function seccionCiudades(datos) {
  const total = totalVendido(datos);
  const filas = Object.entries(totalPorCiudad(datos))
    .sort(([, a], [, b]) => b - a)
    .map(([ciudad, valor]) => ({ ciudad, valor: pesos(valor), part: porcentaje(valor, total) }));

  if (filas.length === 0)
    return [...titulo('2. VENTAS POR CIUDAD'), '  No hay ventas registradas.'];
  return [
    ...titulo('2. VENTAS POR CIUDAD'),
    ...tabla(
      [
        { titulo: 'Ciudad', clave: 'ciudad' },
        { titulo: 'Total', clave: 'valor', derecha: true },
        { titulo: 'Participación', clave: 'part', derecha: true },
      ],
      filas,
      { ciudad: 'TOTAL', valor: pesos(total), part: porcentaje(total, total) }
    ),
  ];
}

function seccionProductos(datos) {
  const filas = Object.entries(unidadesPorProducto(datos))
    .sort(([prodA, a], [prodB, b]) => b - a || prodA.localeCompare(prodB, 'es'))
    .map(([producto, unidades]) => ({ producto, unidades: numero(unidades) }));

  if (filas.length === 0)
    return [...titulo('3. UNIDADES POR PRODUCTO'), '  No hay ventas registradas.'];
  return [
    ...titulo('3. UNIDADES POR PRODUCTO'),
    ...tabla(
      [
        { titulo: 'Producto', clave: 'producto' },
        { titulo: 'Unidades', clave: 'unidades', derecha: true },
      ],
      filas,
      { producto: 'TOTAL', unidades: numero(unidadesVendidas(datos)) }
    ),
  ];
}

function seccionTop(datos) {
  const filas = topProductosPorValor(datos, 3).map((item, i) => ({
    puesto: `${i + 1}.`,
    producto: item.producto,
    unidades: numero(item.unidades),
    valor: pesos(item.valor),
  }));

  if (filas.length === 0)
    return [...titulo('4. TOP 3 PRODUCTOS POR VALOR'), '  No hay ventas registradas.'];
  return [
    ...titulo('4. TOP 3 PRODUCTOS POR VALOR'),
    ...tabla(
      [
        { titulo: '#', clave: 'puesto' },
        { titulo: 'Producto', clave: 'producto' },
        { titulo: 'Unidades', clave: 'unidades', derecha: true },
        { titulo: 'Valor', clave: 'valor', derecha: true },
      ],
      filas
    ),
  ];
}

function seccionDias(datos, fechas) {
  const lineas = [...titulo('5. RESUMEN POR DÍA')];
  for (const fecha of fechas) {
    const dia = ventasDelDia(datos, fecha);
    lineas.push('', `  Día ${dia.fecha || '(sin fecha)'}`);

    if (!dia.fechaValida) {
      lineas.push(
        `  Fecha no válida. Use el formato AAAA-MM-DD, por ejemplo ${FECHAS_POR_DEFECTO[0]}.`
      );
      continue;
    }
    if (!dia.hayVentas) {
      lineas.push('  No se registraron ventas este día.');
    }
    lineas.push(
      dato('Registros', numero(dia.registros)),
      dato('Ventas válidas', numero(dia.ventasValidas)),
      dato('Unidades vendidas', numero(dia.unidades)),
      dato('Total vendido', pesos(dia.total)),
      dato('Ticket promedio', pesos(dia.ticketPromedio)),
      dato('Venta más grande', describirVenta(dia.ventaMayor))
    );
  }
  return lineas;
}

function seccionRecurrentes(datos, buscarRecurrentes) {
  const recurrentes = [...buscarRecurrentes(datos)].sort();
  const lineas = titulo('6. CLIENTES RECURRENTES');

  if (recurrentes.length === 0) return [...lineas, '  No hay clientes recurrentes.'];
  const muestra = recurrentes.slice(0, MAX_RECURRENTES_MOSTRADOS).join(', ');
  const resto = recurrentes.length - MAX_RECURRENTES_MOSTRADOS;
  return [
    ...lineas,
    dato('Clientes con más de una compra', numero(recurrentes.length)),
    dato('Primeros', resto > 0 ? `${muestra} y ${numero(resto)} más` : muestra),
  ];
}

function seccionEstrellaPorCiudad(datos) {
  const filas = Object.entries(productoEstrellaPorCiudad(datos)).map(([ciudad, producto]) => ({
    ciudad,
    producto,
  }));

  if (filas.length === 0)
    return [...titulo('7. PRODUCTO ESTRELLA POR CIUDAD'), '  No hay ventas registradas.'];
  return [
    ...titulo('7. PRODUCTO ESTRELLA POR CIUDAD'),
    ...tabla(
      [
        { titulo: 'Ciudad', clave: 'ciudad' },
        { titulo: 'Producto más vendido', clave: 'producto' },
      ],
      filas
    ),
  ];
}

function seccionCombo(presupuesto = PRESUPUESTO_COMBO) {
  const lineas = [...titulo('8. COMBO DE REGALO SUGERIDO'), dato('Presupuesto', pesos(presupuesto))];

  const exacto = comboRegaloMap(catalogo, presupuesto);
  if (exacto) {
    const [a, b] = exacto;
    return [
      ...lineas,
      dato('Combo exacto', `${a.producto} + ${b.producto}`),
      dato('Suma', pesos(a.precio + b.precio)),
    ];
  }

  const par = parMasCercano(preciosOrdenados, presupuesto);
  if (!par) return [...lineas, '  Ningún par de productos cabe en el presupuesto.'];

  const [precioA, precioB] = par;
  const a = catalogo.find((p) => p.precio === precioA);
  const b = catalogo.find((p) => p.precio === precioB && p !== a);
  return [
    ...lineas,
    '  No hay combo exacto; este es el más cercano sin pasarse:',
    dato('Combo', `${a.producto} + ${b.producto}`),
    dato('Suma', pesos(precioA + precioB)),
  ];
}

function seccionCupon(datos) {
  const cliente = primerClienteUnico(datos);
  return [
    ...titulo('9. CLIENTE PARA CUPÓN'),
    cliente === null
      ? '  Todos los clientes compraron más de una vez.'
      : dato('Primer cliente único', cliente),
  ];
}

// Total vendido por día, de la primera a la última fecha, rellenando con 0 los días sin ventas.
function totalesPorDia(datos) {
  const porFecha = new Map();
  for (const venta of datos) {
    if (!venta || !esFechaValida(venta.fecha)) continue;
    porFecha.set(venta.fecha, (porFecha.get(venta.fecha) || 0) + valorVenta(venta));
  }
  if (porFecha.size === 0) return { fechas: [], totales: [] };

  const ordenadas = [...porFecha.keys()].sort();
  const DIA_MS = 24 * 60 * 60 * 1000;
  const fin = new Date(`${ordenadas[ordenadas.length - 1]}T00:00:00Z`).getTime();
  const fechas = [];
  const totales = [];
  for (let t = new Date(`${ordenadas[0]}T00:00:00Z`).getTime(); t <= fin; t += DIA_MS) {
    const fecha = new Date(t).toISOString().slice(0, 10);
    fechas.push(fecha);
    totales.push(porFecha.get(fecha) || 0);
  }
  return { fechas, totales };
}

function seccionMejorSemana(datos) {
  const lineas = titulo(`10. MEJOR SEMANA (${DIAS_SEMANA} DÍAS SEGUIDOS)`);
  const { fechas, totales } = totalesPorDia(datos);

  if (fechas.length < DIAS_SEMANA)
    return [
      ...lineas,
      `  No hay suficientes días: se necesitan ${DIAS_SEMANA} y hay ${fechas.length}.`,
    ];

  const mejor = mejorSemana(totales, DIAS_SEMANA);
  return [
    ...lineas,
    dato('Desde', fechas[mejor.dia]),
    dato('Hasta', fechas[mejor.dia + DIAS_SEMANA - 1]),
    dato('Total vendido en la semana', pesos(mejor.total)),
  ];
}

function encabezado(version) {
  return [
    '═'.repeat(ANCHO),
    `  CAFÉ ORIGEN · Reporte de ventas · ${version}`,
    `  Generado: ${new Date().toLocaleDateString('es-CO')}`,
    '═'.repeat(ANCHO),
  ];
}

// v0.1: secciones originales (1 a 5) y clientes recurrentes con la versión O(n²).
function generarReporte(datos, fechas = FECHAS_POR_DEFECTO) {
  const lineas = [
    ...encabezado('v0.1'),
    ...seccionResumen(datos),
    ...seccionCiudades(datos),
    ...seccionProductos(datos),
    ...seccionTop(datos),
    ...seccionDias(datos, fechas),
    ...seccionRecurrentes(datos, clientesRecurrentes),
    '',
    '═'.repeat(ANCHO),
  ];
  return lineas.join('\n');
}

// v1.0: lo mismo con la versión O(n) de recurrentes y las secciones nuevas (7 a 10).
function generarReporteV1(datos, fechas = FECHAS_POR_DEFECTO) {
  const lineas = [
    ...encabezado('v1.0'),
    ...seccionResumen(datos),
    ...seccionCiudades(datos),
    ...seccionProductos(datos),
    ...seccionTop(datos),
    ...seccionDias(datos, fechas),
    ...seccionRecurrentes(datos, clientesRecurrentesSet),
    ...seccionEstrellaPorCiudad(datos),
    ...seccionCombo(),
    ...seccionCupon(datos),
    ...seccionMejorSemana(datos),
    '',
    '═'.repeat(ANCHO),
  ];
  return lineas.join('\n');
}

function revisarReporte(texto, datos) {
  const problemas = [];
  if (texto.includes('NaN')) problemas.push('El reporte contiene NaN.');
  if (texto.includes('undefined')) problemas.push('El reporte contiene undefined.');

  const claves = Object.keys(totalPorCiudad(datos)).map((ciudad) => claveTexto(ciudad));
  if (new Set(claves).size !== claves.length) problemas.push('Hay ciudades duplicadas.');
  return problemas;
}

function leerParametros(argv) {
  const comparar = argv.includes('--comparar');
  const argumentos = argv.filter((arg) => arg !== '--comparar');

  // Si el primer argumento es un número positivo, es la cantidad de ventas a generar.
  const n = Number(argumentos[0]);
  const generadas = Number.isInteger(n) && n > 0;
  const fechas = generadas ? argumentos.slice(1) : argumentos;

  return {
    comparar,
    n: generadas ? n : null,
    fechas: fechas.length > 0 ? fechas : FECHAS_POR_DEFECTO,
  };
}

function mostrarVerificacion(reporte, datos) {
  const problemas = revisarReporte(reporte, datos);
  if (problemas.length === 0) {
    console.log('  Verificación: sin NaN, sin undefined y sin ciudades duplicadas.\n');
  } else {
    console.log('  Verificación con problemas:');
    for (const problema of problemas) console.log(`  - ${problema}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  const { comparar, n, fechas } = leerParametros(process.argv.slice(2));
  const datos = n === null ? ventas : generarVentas(n);
  console.log(`Datos: ${n === null ? 'reales del Día 1' : 'generadas'} (${numero(datos.length)} ventas)`);

  let reporteV01;
  if (comparar) {
    console.time('Reporte v0.1');
    reporteV01 = generarReporte(datos, fechas);
    console.timeEnd('Reporte v0.1');
  }

  console.time('Reporte v1.0');
  const reporte = generarReporteV1(datos, fechas);
  console.timeEnd('Reporte v1.0');

  console.log(reporte);
  mostrarVerificacion(reporte, datos);
  if (comparar) mostrarVerificacion(reporteV01, datos);
}

module.exports = { generarReporte, generarReporteV1, revisarReporte };
