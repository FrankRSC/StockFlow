Se creo la configuracion inicial del proyecto.
El backend fue creado con un boilerplalate de express que ya tenia de proyectos pasados, esto apra facilitar el setup del servidor.
Se creo el proyeco de frontend con NextJS utilizando CSS vanilla.

Tanto como frontend y backend tienen su archivo de configuracion de Docker para su facil despliegue local y en servidor
Tanto como frontend y backend utilizan variables de entorno para su configuracion en el archivo .ENV
Se creo el archivo Docker-Compose.yml para orquestar los contenedores de MongoDB, Backend y Frontend para que fuera mas facil el setup.
Despues de la configuracion inicial, se crearon los modelos de la base de datos utilizando mongoose para mongodb, los modelos creados fueron:
Usuarios
Productos
Sucursales
Movimientos

La decision de tener endpoint por entidades se tomo por que es mas facil manejar las rutas y controladores independientes y mas limpio en la arquitectura que suelo utilizar para este tipo de proyectos.

Se sigui con la implementacion de las rutas y controladores de la API para proporcionar los datos de Sucursales y Productos al frontend.
Se creo un dashboard sencillo para poder agregar, eliminar, editar, ver productos y sucursales consumiendo los endpoints previamente relizados.

Se realizaron primero los endpoints ya se decidio modelar las respuestas de los datos antes de mostratlas en el frontend para que fuera mas facil utilizarlos en el frontend y construir los componentes necesarios.

Se siguio con la implemenacion de las rutas y controladores de stock, se realiz el mismo proceso que Sucursales y Productos, pero esta vez como los movimientos requerian del stock de los productos, se creo tambien las rutas y controladores de Stock, al igual que unas modificaciones al modelo de movimientos para que pudiera tener el estado transfer que habia faltado y se añadio otro estado "ajuste" para correcciones en caso de error de registro de stock.
Se realizo la respectiva parte de frontend para mostrar los movimientos y el CRUD de Stock

Con el requeriminto  el  Worker para procesar moovimientos asincronamente, se realizaron cambios en los controladores de movmientos, pasando cierta logica que procesaba los estados a el worker, ya que este se encargaria de procesarlos con un delay para simular lo que menciona el requerimiento.

El worker corre cada 5 segundos verificando el estado de los movimientos, y el frontend tambien fue modificado para escuchar cada 3 segundos si hay algun cambio en los registros y mostrarlos en tiempo real, esto se hizo con polling.

Ladecicion de hacerlo con Polling fue por que es mas facil y rapido que configurar websockets para este proyecto.

Lo siguiente fue la generacion del dashboard en el frontent para mostrar los datos requeridos, utilizando los endpoints que ya se tenian construidos.
Tambien se realzaron cambios en ciertas partes del frontend para crear componentes y reutilizarlos y asi no tener codigo repetido, lo cual tambien facilita el uso en el proyecto.