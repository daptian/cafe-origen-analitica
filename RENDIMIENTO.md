# Tabla de rendimiento

| Funciòn | Que hace | Tiempo | Espacio | Justificaciòn | Medido con 10.000 ventas |
|---|---|---|---|---|---|
| `limpiarTexto` | Normaliza y limpia un texto | O(1) | O(1) | Trabaja sobre un texto corto, no sobre las ventas | 1 operaciòn |
| `claveTexto` | Texto en minúsculas y sin tildes | O(1) | O(1) | Texto corto, sin arreglos que crezcan con n | 1 operaciòn |
| `tieneTildes` | Indica si un texto tiene tildes | O(1) | O(1) | Una sola prueba sobre un texto corto | 1 operaciòn |
| `formatearNombreLugar` | Pone mayúscula inicial a un nombre | O(1) | O(1) | Recorre las palabras de un nombre | 1 operaciòn |
| `cantidadDe` | Lee la cantidad de una venta | O(1) | O(1) | Sin ciclos | 1 operaciòn |
| `precioDe` | Lee el precio de una venta | O(1) | O(1) | Sin ciclos | 1 operaciòn |
| `valorVenta` | Cantidad × precio | O(1) | O(1) | Una multiplicación | 1 operaciòn |
| `esVentaValida` | Indica si cantidad > 0 | O(1) | O(1) | Una comparación | 1 operaciòn|
| `esFechaValida` | Valida el formato de fecha | O(1) | O(1) | Texto de largo fijo | 1 operaciòn |
| `contarVentasValidas` | Cuenta ventas válidas | O(n) | O(1) | Un ciclo; solo usa el contador `validas` | ~0.436ms |
| `totalVendido` | Suma el valor de todas las ventas | O(n) | O(1) | Un ciclo; solo usa `total` | 10.000 operaciones |
| `unidadesVendidas` | Suma las unidades | O(n) | O(1) | Un ciclo; solo usa `unidades` | ~0.342ms |
| `ventaMayor` | Encuentra la venta de mayor valor | O(n) | O(1) | Un ciclo; `mayor` apunta a una venta existente, no la copia | 20.000 operaciones |
| `ticketPromedio` | Valor promedio por venta válida | O(n) | O(1) | Un ciclo; solo usa `total` y `validas` | ~0.421ms |
| `ventasPorCiudad` | Total vendido en una ciudad | O(n) | O(1) | Un ciclo; solo usa `total` | ~0.053ms |
| `totalVendidoM` | Igual que `totalVendido`, con `reduce` | O(n) | O(1) | `reduce` devuelve un número, sin arreglos | ~0.303ms |
| `unidadesVendidasM` | Igual que `unidadesVendidas`, con `reduce` | O(n) | O(1) | `reduce` devuelve un número | ~0.413ms |
| `ventasPorCiudadM` | Igual que `ventasPorCiudad`, con cadena | O(n) | O(n) | `filter` y `map` crean 2 arreglos de hasta n elementos | ~2.732 ms |
| `agruparPorProducto` | Agrupa unidades y valor por producto | O(n) | O(n) en el peor caso | Un `reduce`; el objeto tiene una entrada por producto distinto | ~4.425 ms |
| `unidadesPorProducto` | Unidades por producto | O(n) | O(n) en el peor caso | Usa `agruparPorProducto` y luego recorre sus grupos | ~5.382 ms |
| `topProductosPorValor` | Los k productos de mayor valor | O(n + p log p) | O(n) en el peor caso | `reduce` recorre n ventas; luego `sort` ordena los p productos distintos (p log p). En el peor caso p = n | ~4.645 ms |
| `ventasOrdenadasPorValor` | Ventas ordenadas por valor | O(n log n) | O(n) | La copia `[...ventas]` es O(n) y `sort` ordena n elementos | ~2.736 ms |
| `ventasDelDia` | Resumen de las ventas de un día | O(n) | O(n) | El `filter` crea `delDia`; las demás funciones recorren ese arreglo una vez cada una | ~2.484 ms |
| `clientesRecurrentes` | Clientes que compraron más de una vez | O(n²) | O(r) | Dos `for` anidados comparan cada venta con las siguientes; `recurrentes` solo guarda los clientes recurrentes (r) | ~368.911 ms |
| `totalCiudadCadena` | Total de una ciudad con `map/filter/map/reduce` | O(n) | O(n) | 4 recorridos (4n, se elimina la constante) y 3 arreglos nuevos | ~3.401 ms |
| `totalCiudadUnaPasada` | Total de una ciudad con un solo ciclo | O(n) | O(1) | 1 recorrido y 0 arreglos nuevos | ~3.652 ms |

## Proyección para 1.000.000 de ventas

Método: n pasa de 10.000 a 1.000.000, es decir, **×100**.
- Funciones lineales O(n): el tiempo se multiplica por 100.
- Funciones O(n log n): el tiempo se multiplica por ≈150 (100 × log(1.000.000) / log(10.000)).
- Funciones O(n²): el tiempo se multiplica por 100² = **10.000**.

| Función | Complejidad | Medido (10.000) | Estimado (1.000.000) |
|---|---|---|---|
| `totalVendido` | O(n) | 10.000 operaciones | 1.000.000 operaciones |
| `ventaMayor` | O(n) | 20.000 operaciones | 2.000.000 operaciones |
| `totalPorCiudad` | O(n) | 20.000 operaciones | 2.000.000 operaciones |
| `primeraVenta` | O(1) | 1 operación | 1 operación |
| `contarVentasValidas` | O(n) | 0,436 ms | ≈ 44 ms |
| `unidadesVendidas` | O(n) | 0,342 ms | ≈ 34 ms |
| `ticketPromedio` | O(n) | 0,421 ms | ≈ 42 ms |
| `totalVendidoM` | O(n) | 0,303 ms | ≈ 30 ms |
| `unidadesVendidasM` | O(n) | 0,178 ms | ≈ 18 ms |
| `ventasPorCiudadM` | O(n) | 2,732 ms | ≈ 273 ms |
| `agruparPorProducto` | O(n) | 4,425 ms | ≈ 443 ms |
| `unidadesPorProducto` | O(n) | 5,382 ms | ≈ 538 ms |
| `topProductosPorValor` | O(n + p log p) | 4,645 ms | ≈ 465 ms |
| `ventasOrdenadasPorValor` | O(n log n) | 2,736 ms | ≈ 410 ms |
| `ventasDelDia` | O(n) | 2,484 ms | ≈ 248 ms |
| `totalCiudadCadena` | O(n) | 3,401 ms | ≈ 340 ms |
| `totalCiudadUnaPasada` | O(n) | 3,652 ms | ≈ 365 ms |
| **`clientesRecurrentes`** | **O(n²)** | **368,911 ms** | **≈ 3.689.110 s ≈ 1.025 horas ≈ 43 días** |

**Cómo leer la proyección:** todas las funciones, salvo una, terminan en menos de un segundo con un millón de ventas. `clientesRecurrentes` tardaría semanas.

 -Además, es una estimación optimista: en el **MiniReto 6**, con 100.000 ventas, la estimación fue ≈34 s y el tiempo real fue 1 min 17 s, más del doble. Con un millón de ventas el tiempo real podría ser aún mayor.

## Riesgos

Orden de mayor a menor riesgo cuando los datos crecen.

**Criterio:** primero cuenta la velocidad de crecimiento del tiempo (n² > n log n > n > 1). Luego, a igual tiempo, la memoria extra, porque el servidor del marketplace tiene memoria limitada.

| # | Función | Riesgo | Motivo |
|---|---|---|---|
| 1 | `clientesRecurrentes` | **Crítico** | O(n²) en tiempo: al duplicar n, el tiempo se multiplica por 4. Con 1.000.000 de ventas pasaría de 43 días. |
| 2 | `ventasOrdenadasPorValor` | Medio | O(n log n): crece un poco más que lineal, y además copia el arreglo (O(n) de memoria). |
| 3 | `topProductosPorValor` | Medio-bajo | El `sort` es O(p log p) sobre productos distintos. Con pocos productos casi no se nota. |
| 4 | `totalCiudadCadena`, `ventasPorCiudadM`, `ventasDelDia` | Bajo | Tiempo lineal, pero crean arreglos intermedios de hasta n elementos (O(n) de memoria). |
| 5 | `totalPorCiudad`, `agruparPorProducto`, `unidadesPorProducto` | Bajo | Tiempo lineal. Su memoria depende de las ciudades o productos distintos, así que solo es O(n) en el peor caso. |
| 6 | `totalVendido`, `ventaMayor`, `totalCiudadUnaPasada` y demás lineales con espacio O(1) | Muy bajo | Un solo recorrido y memoria constante. |
| 7 | Funciones O(1) (`primeraVenta`, `valorVenta`, etc.) | Ninguno | No dependen de n. |

## Plan de optimizaciòn (`clientesRecurrentes`)

**¿Qué trabajo se repite?**
- Cada venta se compara con todas las que vienen después. Si un cliente aparece 3 veces, se vuelve a comparar con las mismas ventas una y otra vez, y esas comparaciones se pueden evitar.
- `recurrentes.includes(...)` vuelve a recorrer la lista de recurrentes cada vez que dos ventas coinciden, para preguntar algo que ya se sabía.

**¿Qué información se podría guardar para no buscarla de nuevo?**
- Un registro de **cuántas veces ha aparecido cada cliente**, por ejemplo un objeto o un `Map` con el cliente como clave y el conteo como valor. Consultar o actualizar una clave es de costo constante, sin recorrer nada.
- Con un solo recorrido de las ventas se actualiza el conteo. Si el conteo de un cliente llega a 2, se agrega a recurrentes (una sola vez, porque justo en ese momento pasa de 1 a 2).