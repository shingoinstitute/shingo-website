/*
  Script to clean legacy headers and footers off of old .html pages from legacy site
*/

const { promisify } = require('util')
const { readdir, writeFile: writefile, readFile: readfile } = require('fs')
const readDir = promisify(readdir)
const writeFile = promisify(writefile)
const readFile = promisify(readfile)
const path = require('path')
const folder = path.basename('./pr/')
const result = path.basename('./results/')

readDir(folder)
  .then(function(files) {
    files.forEach(function(file) {
      let html = ''
      readFile(folder + '/' + file, 'utf8')
        .then(function(contents) {
          var a = contents.split('<!-- InstanceBeginEditable name="main" -->')
          var b = a[1].split('<!-- InstanceEndEditable -->')
          html = b[0]
          console.log('Writing file ', file, '...')
          return writeFile(result + '/' + file, html)
        })
        .catch(function(err) {
          console.log(err)
        })
    })
  })
  .catch(function(err) {
    console.log(err)
  })
