Namedrop
========

Namedrop is a JavaScript minifier for DOM-heavy code. It works by taking multiple DOM references and flattening their properties into a single namespace object, allowing each property name to be accessed by a 2-byte valid identifier from `a0` to `zz`. This means that verbose methods like `createDocumentFragment` can be invoked without having to exist in code, which is useful for environments in which gzipping is not available (such as in code golf).

## Requirements

* [node.js](http://nodejs.org/)
* [phantom.js](http://www.phantomjs.org/)

## Install

    $ npm install namedrop

## API

### `namedrop(code, DOM-refs, callback)`

Namedrop takes the code to be minified and an array of DOM references to resolve, and calls back with the minified code. This minified code starts with a `with` statement on a function `n`, which accepts a DOM object and hashes the object's properties on itself. the end result looks like this:

```javascript
with(n=function(){/* 102-byte namespace function*/}){n(this);ORIGINAL_CODE}
```

so that you can have code like this:

```javascript
this.document.body.appendChild(this.document.createElement('script'))
```

and turn it into code like this:

```javascript
with(n){this[fk][eq][cr](this[fk][e5]('script'))}
```

This is most effective when used with something like [@aivopaas](http://twitter.com/aivopaas)'s [jscrush](http://www.iteral.com/jscrush/).

Example
-------

(Note that that this is a contrived example that actually increases code size. Since Namedrop adds at least 111 bytes of overhead for namespacing, it works best on DOM-heavy code of several hundred bytes or more.)

### before.js

```javascript
with(n){this.document.body.appendChild(this.document.createElement('script'))}
```

### test.js

```javascript
fs = require("fs")
namedrop = require("namedrop")

before = fs.readFileSync("./before.js", "utf8")
namedrop = require("namedrop")

refs = [
  "this",
  "this.document",
  "this.document.documentElement"
]

namedrop(before, refs, function(err, code) {
  if (err) throw err

  else fs.writeFileSync("./after.js", code)
})
```

### after.js

```javascript
n=function(a,b,c,d){for(b in a){for(c=a=0;d=b.charCodeAt(c++);a%=934)a+=c*d;n[(a+360).toString(36)]=b}};n(this);n(this[fk]);n(this[fk][o3]);with(n){this[fk][eq][cr](this[fk][e5]('script'))}
```

Copyright
---------

Copyright (c) 2011 Jed Schmidt. See LICENSE.txt for details.

Send any questions or comments [here](http://twitter.com/jedschmidt).