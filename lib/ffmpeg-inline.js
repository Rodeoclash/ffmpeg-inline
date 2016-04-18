const filesystem      = require('./ffmpeg-inline/filesystem.js')
const executor        = require('./ffmpeg-inline/executor.js')
const argumentBuilder = require('./ffmpeg-inline/argument_builder.js')

const PERSISTENT   = window.PERSISTENT
const TEMPORARY    = window.TEMPORARY

let container

executor.createContainer().then(function(el) {
  container = el
})

function run(globalOptions, inputFiles, options, outputFiles, cbs) {
  return new Promise(function(resolve, reject) {
    const inputFileNames = _.map(inputFiles, 'name')
    const requestedBytes = filesystem.totalInputFileSize(inputFiles) * 2

    // Create the virtual file system
    filesystem.init({
      requestedBytes,
      kind: PERSISTENT,
    }).then(function(fsInstance) {

      // Save the input files to it
      filesystem.saveFiles(fsInstance, inputFiles).then(function(progressEvents) {

        // Generate ffmpeg arguments
        const args = argumentBuilder.make(globalOptions, inputFiles, options, outputFiles)

        // Run ffmpeg
        executor.run(container, args, cbs).then(function() {

          // Get the output files as File objects
          filesystem.openFiles(fsInstance, outputFiles).then(function(files) {

            resolve(files)

            // Cleanup run
            filesystem.removeFiles(fsInstance, inputFileNames)
            filesystem.removeFiles(fsInstance, outputFiles)

          }).catch(function(error) {
            reject(error)
          })
        }).catch(function(error) {
          reject(error)
        })
      }).catch(function(error) {
        reject(error)
      })
    }).catch(function(error) {
      reject(error)
    })
  })
}

module.exports = run
