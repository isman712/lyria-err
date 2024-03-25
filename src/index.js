require('@babel/register')({
    presets: ['@babel/preset-env', '@babel/preset-react']
});

const fs = require('fs');
const path = require('path');
const Reacto = require('react');
const ReactDOMServer = require('react-dom/server');

function TaumaluipasGet(jsx, name) {
    name = name + ".jsx"
    const jsxget = jsx.find(e => e === name);

    if (jsxget) {
        return jsxget;
    } else {
        throw new Error(`No se encontró el archivo "${name}"`);
    }
}

function view(dir, callback) {
    fs.readdir(dir, (err, ar) => {
        if (err) {
            callback(err, null);
            return;
        }

        const JSX = ar.filter(e => {
            const dirJSX = path.join(dir, e);
            return fs.statSync(dirJSX).isFile() && path.extname(e) === '.jsx';
        });
        callback(null, JSX); 
    });
}

function config(app, dir) {
    app.use((req, res, next) => {
        view(dir, (error, data) => {
            if (error) {
                console.error('Error:', error);
                return;
            }
            res.jsxAr = data; 
            res.react = function React(archivo, props) {
                const bab = TaumaluipasGet(data, archivo);
                const elePath = path.join(__dirname,"../../../", dir, bab);
                const ele = require(elePath);
                const html = ReactDOMServer.renderToString(Reacto.createElement(ele, props));
                res.send(html);
            };
            next(); 
        });
    });
}

module.exports = { config }
