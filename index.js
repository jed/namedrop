if (typeof phantom === "undefined") {
  var spawn = require("child_process").spawn
    , namespace = {}
    , n = function(a,b,c,d) {
        for(b in a) {
          for(c=a=0;d=b.charCodeAt(c++);a%=934)a+=c*d;
          namespace[(a+360).toString(36)]=b
        }
      }

  module.exports = function(code, objs, cb) {
    var args = [__filename].concat(objs)
      , phantom = spawn("phantomjs", args, {cwd: __dirname})
      , data = ""

    code = code.toString()

    objs
      .slice(0).reverse()
      .forEach(function(scope) {
        code = "n(" + scope + ");" + code
      })

    phantom.stdout.on("data", function(chunk){ data += chunk })
    phantom.stderr.on('data', function(chunk){ cb(chunk); phantom.kill() })

    phantom.on("exit", function(){
      JSON.parse(data).forEach(n)

      for (var key in namespace) code = code
        .replace(RegExp("\\." + namespace[key] + "\\b", "g"), "[n." + key + "]")
        .replace(RegExp("'"   + namespace[key] + "'"  , "g"), "n."  + key      )
        .replace(RegExp('"'   + namespace[key] + '"'  , "g"), "n."  + key      )

      code = "n=function(a,b,c,d){for(b in a){for(c=a=0;d=b.charCodeAt(c++);a%=934)a+=c*d;n[(a+360).toString(36)]=b}};" + code

      cb(null, code, namespace)
    })
  }
}

else {
  var args = phantom.args
    .map(eval)
    .map(function(obj) {
      var key, keys = {}
      for (key in obj) keys[key] = true
      return keys
    })

  console.log(JSON.stringify(args))

  phantom.exit()
}