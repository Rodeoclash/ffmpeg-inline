const _ = require('lodash')

function inputFileAsArg(inputFile) {
  return `-i ${inputFile.name}`
}

function make(globalOptions, inputFiles, options, outputFiles) {
  const inputFileArgs = _.map(inputFiles, inputFileAsArg).join(' ')
  const outputFileArgs = outputFiles.join(' ')
  return `ffmpeg ${globalOptions} ${inputFileArgs} ${options} ${outputFileArgs}`
}

module.exports = {
  inputFileAsArg,
  make,
}
