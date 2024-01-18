# Template for JSDoc 3

- [Based on PixiJS Template](https://github.com/pixijs/pixi-jsdoc-template)
- [JSDoc3](https://github.com/jsdoc3/jsdoc)
- [JSDoc3 API Documentations](http://usejsdoc.org)

## Installation

Install the template using NPM:

```bash
npm install git+https://github.com/IQGeo/utils-jsdoc-template.git#v2.6.1 --save-dev
```

## Usage

If you already have JSDoc system, you can use this project as JSDoc template. More information about JSDoc command-line arguments can be found [here](http://usejsdoc.org/about-commandline.html).

```bash
jsdoc -c conf.json -R README.md
```

### conf.json

You can set options for customizing your documentations. Notice the `"template"` field for setting the path to **utils-jsdoc-template**.

```json
{
  "templates": {
      "applicationName": "Demo",
      "disqus": "",
      "googleAnalytics": "",
      "favicon": "path/to/favicon.png",
      "openGraph": {
          "title": "",
          "type": "website",
          "image": "",
          "site_name": "",
          "url": ""
      },
      "meta": {
          "title": "",
          "description": "",
          "keyword": ""
      },
      "linenums": true,
      "source": {
          "include": [
              "./src/"
          ],
          "includePattern": ".+\\.js(doc)?$",
          "excludePattern": "(^|\\/|\\\\)_"
      },
      "opts": {
          "encoding": "utf8",
          "recurse": true,
          "private": false,
          "lenient": true,
          "destination": "./docs",
          "template": "./node_modules/@pixi/jsdoc-template"
      }
  },
  "pixi": {
      "styles": ["path/to/custom/styles.css"],
      "scripts": ["path/to/custom/script.js"]
   }
}
```

## License

This template is based on the [Pixi](https://github.com/pixijs/pixi-jsdoc-template) template. [Pixi](https://github.com/pixijs/pixi-jsdoc-template) is licensed under the [MIT](https://github.com/pixijs/pixi-jsdoc-template?tab=MIT-1-ov-file#readme).

The default template for JSDoc 3 uses: [the Salty Database library](https://www.npmjs.com/package/@jsdoc/salty) and the [Underscore Template library](https://underscorejs.org/#template).
