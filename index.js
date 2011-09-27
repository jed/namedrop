if (typeof phantom === "undefined") {
  spawn = require("child_process").spawn

  n = function(a,b,c,d) {
    for(b in a) {
      for(c=a=0;d=b.charCodeAt(c++);a%=934)a+=c*d;
      n[(a+360).toString(36)]=b
    }
  }

  module.exports = function(code, objs, cb) {
    var args = [__filename].concat(objs)
      , phantom = spawn("phantomjs", args, {cwd: __dirname})
      , data = ""

    objs
      .slice(0).reverse()
      .forEach(function(scope) {
        code = "n(" + scope + ");" + code
      })

    phantom.stdout.on("data", function(chunk){ data += chunk })
    phantom.stderr.on('data', function(chunk){ cb(chunk); phantom.kill() })

    phantom.on("exit", function(){
      JSON.parse(data).forEach(n)

      for (var key in n) code = code
        .replace(RegExp("\\." + n[key] + "\\b", "g"), "[" + key + "]")
        .replace(RegExp("'"   + n[key] + "'"  , "g"), "'" + key + "'")

      code = "n=function(a,b,c,d){for(b in a){for(c=a=0;d=b.charCodeAt(c++);a%=934)a+=c*d;n[(a+360).toString(36)]=b}};" + code

      cb(null, code)
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