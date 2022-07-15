const path = require('path');

module.exports = {
  "plugins": [
    "plugins/markdown",
    "./suitescriptJsDocPlugin.js"
  ],
  "recurseDepth": 10,
  "source": {
    "include": [
      path.resolve(process.cwd(), "FileCabinet")
    ],
    "excludePattern": "(node_modules/|docs)"
  },
  "sourceType": "module",
  "tags": {
    "allowUnknownTags": true,
    "dictionaries": [
      "jsdoc",
      "closure"
    ]
  },
  "templates": {
    "default": {
      "staticFiles": {
        "include": [
          path.resolve(process.cwd(), "documentation")
        ],
        "includePattern": ".\\.(jpeg|png|gif|mp4|css|svg|js)"
      }
    },
    "cleverLinks": false,
    "monospaceLinks": true,
    "useLongnameInNav": false,
    "showInheritedInNav": true
  },
  "opts": {
    "destination": "./docs/",
    "encoding": "utf8",
    "private": true,
    "recurse": true,
    "template": "./node_modules/docdash",
    "tutorials": path.resolve(process.cwd(), "documentation")
  },
  "docdash": {
    "meta": {
      "title": "Technical Documentation"
    },
    "search": true,
    "commonNav": true,
    "typedefs": true,
    "scripts": [],
    "sectionOrder": [
      "Tutorials",
      "Classes",
      "Modules",
      "Externals",
      "Events",
      "Namespaces",
      "Mixins",
      "Interfaces"
    ]
  },
  "markdown": {
    "gfm": true
  }
};
