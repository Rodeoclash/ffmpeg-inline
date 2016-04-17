const _         = require('lodash')

const TEMP_PATH = '/tmp'

function totalInputFileSize(inputFiles) {
  return _.reduce(inputFiles, function(n, inputFile) {
    return n + inputFile.size
  }, 0)
}

/**
 * init
 *
 * Creates a DOM file system based on config and returns a promise which
 * resolves an object containing the original config and a DOMFileSystem.
 * Collectivly this object is referred to as an 'instance' and should be
 * used with each subsequent call.
 *
 * @param config Object Requested storage type and size of the filesystem
 * @returns Promise
 */
function init(config) {
  const { kind, requestedBytes } = config

  return new Promise(function (resolve, reject) {
    navigator.webkitPersistentStorage.requestQuota(requestedBytes, function(allowedBytes) {
      window.webkitRequestFileSystem(kind, allowedBytes, function(fs) {
        resolve({
          fs,
          config,
        })
      })
    })
  })
}

/**
 * tmpDirectory
 *
 * Returns a promise that resolves a DirectoryEntry pointing towards
 * /tmp.
 *
 * @param instance Object Returned from init function
 * @returns Promise
 */
function tmpDirectory(instance) {
  return new Promise(function(resolve, reject) {
    const { root } = instance.fs
    root.getDirectory(TEMP_PATH, {create: true}, resolve, reject)
  })
}

/**
 * getFile
 *
 * Returns a promise that resolves a FileEntry based on the name of the file
 * argument. Creates the FileEntry if it does not exist already.
 *
 * @param instance Object Returned from init function
 * @param file File
 * @returns Promise
 */
function getFile(instance, fileName) {
  return new Promise( function (resolve, reject) {
    tmpDirectory(instance).then(function(directoryEntry) {
      directoryEntry.getFile(fileName, {create: true}, resolve, reject)
    }).catch(function(error) {
      reject(error)
    })
  })
}

/**
 * writeFile
 *
 * Returns a promise that when resolved, writes the given File object to the
 * virtual file system and returns the FileEntry and the File in an object.
 *
 * @param instance Object Returne from init function
 * @param file File
 * @param fileEntry FileEntry
 * @returns Promise
 */
function writeFile(instance, fileEntry, file) {
  return new Promise( function(resolve, reject) {
    fileEntry.createWriter(function(writer) {
      writer.onwriteend = resolve
      writer.write(file)
    })
  }).catch(function(error) {
    reject(error)
  })
}

/**
 * Given a filesystem and HTML input files, saves all of them and returns a
 * promise containing an array of filesystem files.
 */
function saveFiles(instance, files) {
  return new Promise(function (resolve, reject) {
    const fileNames = _.map(files, 'name')
    const getFilePromises = _.map(fileNames, getFile.bind(this, instance))

    // Get file entries for all supplied files
    Promise.all(getFilePromises).then(function(fileEntries) {
      const writeFilePromises = _.map(files, (file, i) => {
        return writeFile(instance, fileEntries[i], file)
      })

      // Write file entries and return progressEvents
      Promise.all(writeFilePromises).then(function(progressEvents) {
        resolve(progressEvents)

      }).catch(reject)
    }).catch(reject)
  })
}

function openFile(fileEntry) {
  return new Promise(function (resolve, reject) {
    fileEntry.file(resolve, reject)
  })
}

function openFiles(instance, fileNames) {
  return new Promise(function (resolve, reject) {
    const getFilePromises = _.map(fileNames, getFile.bind(this, instance))

    Promise.all(getFilePromises).then(function(fileEntries) {
      const openFilePromises = _.map(fileEntries, openFile)
      Promise.all(openFilePromises).then(function(files) {
        resolve(files)
      }).catch(reject)
    }).catch(reject)
  })
}

// Deletes files by name
function deleteFiles(instance, fileNames) {
  console.log('TODO: delete')
}

function clearFiles(instance, inputFiles, outputFiles) {
  console.log('TODO: clear')
}

/**
 * listFiles
 *
 * Lists all files in folder. Promise resolves to an array of
 * FileEntry objects.
 *
 * @param instance Object Returned by init function
 * @returns Promise
 */
function listFiles(instance) {
  return new Promise( function (resolve, reject) {
    tmpDirectory(instance).then(function(directoryEntry) {
      const reader = directoryEntry.createReader()
      reader.readEntries(resolve, reject)
    }).catch(function(error) {
      reject(error)
    })
  })
}

module.exports = {
  clearFiles,
  deleteFiles,
  getFile,
  init,
  listFiles,
  openFiles,
  saveFiles,
  tmpDirectory,
  totalInputFileSize,
  writeFile,
}
