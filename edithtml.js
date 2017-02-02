/*
  Script to clean legacy headers and footers off of old .html pages from legacy site
*/

var Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const folder = path.basename('./pr/');
const result = path.basename('./results/');

fs.readdirAsync(folder)
.then(function(files){
  files.forEach(function(file){
    var html = new String();
    fs.readFileAsync(folder + "/" + file, "utf8")
    .then(function(contents) {
      var a = contents.split("<!-- InstanceBeginEditable name=\"main\" -->")
      var b = a[1].split("<!-- InstanceEndEditable -->")
      html = b[0];
      console.log("Writing file ", file, "...");
      return fs.writeFileAsync(result + "/" + file, html);
    })
    .catch(function(err){
      console.log(err);
    })

  })
})
.catch(function(err){
  console.log(err);
})
