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