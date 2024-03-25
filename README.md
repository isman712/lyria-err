# lyria-err

[![NPM Version](https://img.shields.io/npm/v/lyria-err.svg)](https://www.npmjs.com/package/lyria-err)

Módulo que te permite renderizar archivos de React usando Express de manera sencilla.

## Instalación

Para instalar `lyria-err`, utiliza:

```bash
npm install lyria-err
```

## Uso

Antes que nada, asegúrate de tener instalado Express y haber creado un servidor HTTP (si ya tienes uno, puedes saltarte este paso):

```bash
npm install express
```

Crea un servidor HTTP usando Express:

```javascript
const express = require('express');
const app = express();

app.listen(3000, () => {
    console.log("Servidor HTTP listo");
});
```

Ahora que tienes tu servidor web, llama al módulo **lyria-err** y configúralo:

```javascript
const er = require("lyria-err");

er.config(app, "./src/jsx");

// Como primer argumento, pasa el objeto app de tu servidor Express.
// Como segundo argumento, pasa la ruta de tus archivos JSX.
```

Una vez que has configurado el paquete **lyria-err**, puedes usarlo en cualquier ruta de tu servidor Express de la siguiente manera:

```javascript
app.get("/", (req, res) => {
    res.react("app"); // Nombre del archivo .jsx 
});
```

También puedes pasarle props de la siguiente manera:

```javascript
app.get("/", (req, res) => {
    res.react("app", { Nombre: "Isman", Nick: "Isman" });
});
```

#### Archivo app.jsx

```jsx
const React = require('react');

function App(prop) {
    return (
        <div>
            <h1>Hola {prop.Nombre} / {prop.Nick}</h1>
        </div>
    );
}

module.exports = App;
```

#### Archivo index.js completo

```javascript
const express = require('express');
const app = express();
const er = require("lyria-err");

er.config(app, "./src/jsx");

app.get("/", (req, res) => {
    res.react("app", { Nombre: "Isman", Nick: "Isman" });
});

app.listen(3000, () => {
    console.log("Servidor HTTP listo");
});
```

¡Y así de simple puedes renderizar archivos de React usando Express como si fuera un renderizador de plantillas! Espero que les guste.

