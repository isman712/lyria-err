require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
});

const fs = require("fs");
const path = require("path");
const React = require("react");
const ReactDOMServer = require("react-dom/server");

function findJSXFile(jsxFiles, name) {
  const jsxFile = jsxFiles.find((file) => file === `${name}.jsx`);
  return jsxFile ?? new Error(`File ${name}.jsx not found.`);
}

function getJSXFiles(dir, callback) {
  fs.readdir(dir, (err, files) => {
    if (err) return callback(err, null);

    const jsxFiles = files.filter((file) => {
      const filePath = path.join(dir, file);
      return fs.statSync(filePath).isFile() && path.extname(file) === ".jsx";
    });

    callback(null, jsxFiles);
  });
}

function configureReact(app, dir) {
  app.use((req, res, next) => {
    getJSXFiles(dir, (error, jsxFiles) => {
      if (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.jsxFiles = jsxFiles;

      res.renderReact = function (filename, props) {
        const jsxFile = findJSXFile(jsxFiles, filename);
        if (!jsxFile)
          return res.status(404).send(`File ${filename} not found.`);

        const filePath = path.join(__dirname, "../../../", dir, jsxFile);
        const Component = require(filePath).default;

        const htmlString = ReactDOMServer.renderToString(
          React.createElement(Component, props)
        );

        res.setHeader("Content-Type", "text/html");
        res.send(htmlString);
      };

      next();
    });
  });
}

module.exports = { configureReact };
