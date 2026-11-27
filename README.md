# Café Origen · Analítica v1.0

Motor de analítica de ventas para **Café Origen**, una tienda de café de origen colombiano. Lee el historial de ventas y genera, por consola, un reporte de negocio que la gerente puede ejecutar sin abrir el código. Funciona con los datos reales del Día 1 o con la cantidad de ventas generadas que se le indique, para probar cómo se comporta con volúmenes grandes.

Está escrito en JavaScript (Node.js) con CommonJS y no tiene dependencias externas.

## Qué preguntas responde

**Ventas**
- ¿Cuánto se vendió en total y cuántas unidades salieron?
- ¿Cuál fue la venta más grande?
- ¿Cuánto gasta en promedio un cliente por compra (ticket promedio)?
- ¿Cuánto se vendió en cada ciudad y qué porcentaje representa?
- ¿Cuántas unidades se vendieron de cada producto?
- ¿Cuáles son los 3 productos que más dinero generaron?
- ¿Cómo le fue a un día específico, incluso si ese día no hubo ventas?

**Clientes y recomendaciones (nuevo en v1.0)**
- ¿Qué clientes han comprado más de una vez (clientes recurrentes)?
- ¿Cuál es el producto estrella de cada ciudad?
- ¿Qué combo de dos productos se puede regalar con un presupuesto dado? Si no hay uno exacto, ¿cuál es el más cercano sin pasarse?
- ¿A qué cliente enviarle un cupón? Se elige al primer cliente que ha comprado una sola vez.
- ¿Cuál fue la mejor semana (7 días seguidos) y cuánto se vendió en ella?

## Requisitos

- Node.js versión LTS (probado con Node 22). No hace falta `npm install`.

## Cómo ejecutarlo

Desde la carpeta del proyecto:

```bash
# Reporte con los datos reales del Día 1
node src/reporte.js

# Resumen por día para fechas específicas (formato AAAA-MM-DD)
node src/reporte.js 2026-09-05
node src/reporte.js 2026-09-01 2026-09-02

# Reporte con n ventas generadas al azar (septiembre de 2026)
node src/reporte.js 100000

# Ventas generadas y fechas específicas: el primer número es n, lo demás son fechas
node src/reporte.js 100000 2026-09-05

# Mide también la versión v0.1 para comparar tiempos
node src/reporte.js 10000 --comparar
```

Cómo se interpretan los argumentos:

| Argumento | Significado |
|---|---|
| Un número positivo en primer lugar (`100000`) | Cantidad de ventas a generar. Sin número se usan los datos reales. |
| Texto con formato `AAAA-MM-DD` | Día para el resumen por día (sección 5). |
| `--comparar` | Además de v1.0, mide y compara el tiempo de la v0.1. |

Al terminar, el programa imprime los tiempos (`Reporte v1.0: ... ms`) y una verificación de que el reporte no contiene `NaN`, `undefined` ni ciudades duplicadas.

> **Tiempos:** con 100.000 ventas, la v1.0 tarda menos de un segundo. La v0.1 puede tardar más de un minuto porque usa `clientesRecurrentes`, de complejidad O(n²). Por eso solo se ejecuta con `--comparar`.

### Qué contiene el reporte

| # | Sección | Disponible en |
|---|---|---|
| 1 | Resumen general | v0.1 y v1.0 |
| 2 | Ventas por ciudad | v0.1 y v1.0 |
| 3 | Unidades por producto | v0.1 y v1.0 |
| 4 | Top 3 productos por valor | v0.1 y v1.0 |
| 5 | Resumen por día | v0.1 y v1.0 |
| 6 | Clientes recurrentes | v0.1 (versión lenta) y v1.0 (versión rápida) |
| 7 | Producto estrella por ciudad | v1.0 |
| 8 | Combo de regalo sugerido | v1.0 |
| 9 | Cliente para cupón | v1.0 |
| 10 | Mejor semana | v1.0 |

Con los datos reales del Día 1, la sección 10 muestra "No hay suficientes días", porque solo hay 6 fechas y se necesitan 7.

### Otros scripts

| Comando | Para qué sirve |
|---|---|
| `node src/explorar.js` | Exploración inicial de los datos (MiniReto 1). |
| `node src/pruebas.js` | Prueba las funciones con ciclos con tres entradas: completo, un elemento y vacío (MiniReto 2). |
| `node src/verificar.js` | Demuestra que cada versión con métodos da el mismo resultado que su ciclo: "OK" o "DIFERENTE" (MiniReto 3). |
| `node src/reproducir-errores.js` | Reproduce los dos errores reportados por la gerente y prueba que están corregidos (MiniReto 4). |
| `node src/medir.js` | Mide operaciones y tiempos de las funciones de `analitica.js` (MiniRetos 5 a 8). |
| `node src/recurrentes.js` | Compara las tres versiones de clientes recurrentes (original, `Set` y `Map`) (MiniReto 9). |
| `node src/catalogo.js` | Prueba el combo de regalo (fuerza bruta vs `Map`), el producto estrella y el primer cliente único (MiniReto 10). |
| `node src/mejor-cercano.js` | Prueba la mejor semana (fuerza bruta vs ventana deslizante) y el par más cercano (MiniReto 11). |

## Estructura

```
cafe-origen-analitica/
├── src/
│   ├── analitica.js            Funciones puras de cálculo
│   ├── catalogo.js             Catálogo, combo de regalo, producto estrella y primer cliente único
│   ├── datos.js                Muestra de 12 ventas, tal como se exportó
│   ├── explorar.js             Exploración de los datos
│   ├── generador.js            Generador de ventas al azar (con día aleatorio)
│   ├── instrumentadas.js       Versiones con contador de operaciones
│   ├── medir.js                Mediciones de operaciones y tiempos
│   ├── mejor-cercano.js        Mejor semana (ventana deslizante) y par más cercano (dos punteros)
│   ├── pruebas.js              Pruebas de las funciones con ciclos
│   ├── recurrentes.js          Clientes recurrentes: versiones con Set y Map
│   ├── reporte.js              Reporte de negocio por consola (v0.1 y v1.0)
│   ├── reproducir-errores.js   Reproducción y corrección de errores
│   └── verificar.js            Comparación ciclo vs. método
├── bitacora.md                 Análisis, decisiones, trazas y depuración
├── RENDIMIENTO.md              Complejidades, mediciones y comparación v0.1 vs v1.0
└── README.md
```

Los archivos con funciones reutilizables (`catalogo.js`, `mejor-cercano.js`, `recurrentes.js`, `reporte.js`) ejecutan sus pruebas solo cuando se corren directamente, no cuando `reporte.js` los importa.

## Decisiones importantes sobre los datos

- Los datos de `datos.js` no se modifican; la limpieza se hace al calcular.
- El valor de una venta es `cantidad × precio` (el precio es unitario).
- Las ciudades se comparan sin importar mayúsculas, tildes ni espacios sobrantes, y se muestran con la primera letra en mayúscula (por ejemplo, "medellín" se suma a "Medellín").
- Una venta con cantidad 0 suma 0, pero no cuenta como venta válida para el ticket promedio ni para la venta más grande.
- Un día sin ventas muestra valores en cero y un mensaje claro, nunca `NaN`.
- En la mejor semana, los días sin ventas entre la primera y la última fecha cuentan como 0, para que 7 días sean realmente 7 días seguidos.
- El combo de regalo se calcula sobre el catálogo (8 productos), no sobre las ventas, así que no depende de `n`. Por defecto el presupuesto es de $ 87.000 (`PRESUPUESTO_COMBO` en `reporte.js`).
- Las ventas generadas (`generador.js`) tienen clientes, productos, ciudades, cantidades y días aleatorios, por lo que cada ejecución da resultados distintos.

El detalle de cada decisión está en [`bitacora.md`](bitacora.md), y la justificación de las complejidades en [`RENDIMIENTO.md`](RENDIMIENTO.md).

## Versiones 

- **v0.1**: primer reporte de negocio; corrige la ciudad duplicada y el ticket promedio `NaN`.
- **v1.0**: usa las versiones optimizadas (clientes recurrentes con `Set`, O(n)), agrega las secciones de producto estrella por ciudad, combo de regalo, cliente para cupón y mejor semana, permite ejecutar con `n` ventas generadas y compara tiempos con la v0.1.
