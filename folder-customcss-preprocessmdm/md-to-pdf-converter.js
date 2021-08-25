//#region Imports
const markdownpdf = require("markdown-pdf")
const fs = require('fs')
const path = require('path')
const through2 = require('through2');
//#endregion Imports

// New line required before and after to handle the initial # h1 in markdown. Without these # h1 will not render
const lineBreak = "\n<div class='pagebreak'></div>\n"
const mdFilesPath = 'sample-markdowns'
const outputPDFFilePath = `${mdFilesPath}.pdf`

var inputFilePaths = fs
    .readdirSync(path.join(__dirname, mdFilesPath))
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => path.join(__dirname, mdFilesPath, fileName));
inputFilePaths.forEach(fileName => console.log(fileName)); // Trace

//https://stackoverflow.com/questions/27426081/append-text-to-a-node-js-stream-on-the-go
const through2_opts = { "decodeStrings": false, "encoding": "utf8" }
let chunk_handler = function(chunk, enc, next) {
    next(null, chunk)
    this.push(lineBreak); //https://github.com/alanshaw/markdown-pdf/issues/60
}
let finish_handler = function(done) {
    done()
}
var markdownPDFOptions = {
    remarkable: {
        breaks: true,
        html: true
    },
    cssPath: path.join(__dirname, "custom.css"),
    preProcessMd: through2.ctor(through2_opts, chunk_handler, finish_handler)
}
markdownpdf(markdownPDFOptions)
    .concat.from.paths(inputFilePaths)
    .to(outputPDFFilePath, function() {
        console.log("Output .pdf : ", outputPDFFilePath)
    });