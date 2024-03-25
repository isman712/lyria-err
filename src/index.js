require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
});

const fs = require("fs");
const path = require("path");
const React = require("react");
const ReactDOMServer = require("react-dom/server");

/**
 * Finds the specified JSX file in the given array of JSX files.
 *
 * @param {Array} jsxFiles - The array of JSX files to search.
 * @param {string} name - The name of the JSX file to find.
 * @return {string | Error} The found JSX file, or an Error if the file is not found.
 */
function findJSXFile(jsxFiles, name) {
  const jsxFile = jsxFiles.find((file) => file === `${name}.jsx`);
  return jsxFile ?? new Error(`File ${name}.jsx not found.`);
}

/**
 * Retrieves all JSX files from the specified directory.
 *
 * @param {string} dir - The directory to search for JSX files.
 * @param {function} callback - The callback function to be called with the retrieved JSX files.
 * @return {void}
 */
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

/**
 * Configures the React middleware for the given app and directory.
 *
 * @param {Object} app - The Express app object.
 * @param {string} dir - The directory to search for JSX files.
 */
function configureReact(app, dir) {
  app.use((req, res, next) => {
    getJSXFiles(dir, (error, jsxFiles) => {
      if (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.jsxFiles = jsxFiles;

      /**
       * Renders a React component to a string and sends it as the HTTP response.
       *
       * @param {string} filename - the name of the JSX file to render
       * @param {object} props - the props to pass into the React component
       * @return {void}
       */
      res.renderReact = function (filename, props) {
        const jsxFile = findJSXFile(jsxFiles, filename);
        if (!jsxFile)
          return res.status(404).send(`File ${filename} not found.`);

        const filePath = path.join(__dirname, "../../../", dir, jsxFile);
        const Component = require(filePath);

        const htmlString = ReactDOMServer.renderToString(
          React.createElement(Component, props)
        );

        res.setHeader("Content-Type", "text/html");
        htmlString.pipe(res);
      };

      next();
    });
  });
}

module.exports = { configureReact };
