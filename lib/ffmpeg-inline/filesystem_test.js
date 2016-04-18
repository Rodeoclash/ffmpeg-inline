const filesystem = require('./filesystem.js')

describe('filesystem.js', function() {
  const fileContent = ['\x45\x6e\x63\x6f\x64\x65\x49\x6e\x48\x65\x78\x42\x65\x63\x61\x75\x73\x65\x42\x69\x6e\x61\x72\x79\x46\x69\x6c\x65\x73\x43\x6f\x6e\x74\x61\x69\x6e\x55\x6e\x70\x72\x69\x6e\x74\x61\x62\x6c\x65\x43\x68\x61\x72\x61\x63\x74\x65\x72\x73']
  const file_1 = new File(fileContent, 'test_1.txt')
  const file_2 = new File(fileContent, 'test_2.txt')
  const TEMPORARY = window.TEMPORARY
  const storageSize = 1024 * 1024
  const config = {
    storageSize,
    kind: TEMPORARY,
  }

  function subject() {
    return filesystem.init(config)
  }

  beforeAll(() => {
    window.localStorage.clear()
  })

  describe('.init', function() {
    it('returns promise', function() {
      expect(subject().then).toEqual(jasmine.any(Function))
    })

    it('promise resolves initial config object', function (done) {
      subject().then(function(instance) {
        expect(instance.config).toEqual(config)
        done()
      })
    })

    it('promise resolves a DOMFileSystem', function (done) {
      subject().then(function(instance) {
        expect(instance.fs).toEqual(jasmine.any(Object))
        expect(instance.fs.name).toEqual('http_localhost_9876:Temporary')
        done()
      })
    })
  })

  describe('.tmpDirectory', function() {
    it('returns promise', function(done) {
      subject().then(function (instance) {
        const result = filesystem.tmpDirectory(instance)
        expect(result.then).toEqual(jasmine.any(Function))
        done()
      })
    })

    it('promise resolves a DirectoryEntry', function (done) {
      subject().then(function (instance) {
        const result = filesystem.tmpDirectory(instance)
        result.then(function(directoryEntry) {
          expect(directoryEntry).toEqual(jasmine.any(Object))
          expect(directoryEntry.fullPath).toEqual('/tmp')
          done()
        })
      })
    })
  })

  describe('.getFile', function() {
    it('returns promise', function(done) {
      subject().then(function (instance) {
        const result = filesystem.getFile(instance, file_1.name)
        expect(result.then).toEqual(jasmine.any(Function))
        done()
      })
    })

    it('promise resolves a FileEntry', function (done) {
      subject().then(function (instance) {
        filesystem.getFile(instance, file_1.name).then(function (fileEntry) {
          expect(fileEntry.name).toEqual(file_1.name)
          expect(fileEntry.fullPath).toEqual(`/tmp/${file_1.name}`)
          done()
        })
      })
    })
  })

  describe('.writeFile', function() {
    it('returns promise', function(done) {
      subject().then(function (instance) {
        filesystem.getFile(instance, file_1).then(function (fileEntry) {
          const result = filesystem.writeFile(instance, fileEntry, file_1)
          expect(result.then).toEqual(jasmine.any(Function))
          done()
        })
      })
    })

    it('promise resolves a ProgressEvent', function (done) {
      subject().then(function (instance) {
        filesystem.getFile(instance, file_1).then(function (fileEntry) {
          const result = filesystem.writeFile(instance, fileEntry, file_1)
          result.then(function (progressEvent) {
            expect(progressEvent.loaded).toEqual(57)
            done()
          })
        })
      })
    })
  })

  describe('.saveFiles', function() {
    it('returns promise', function(done) {
      subject().then(function (instance) {
        const result = filesystem.saveFiles(instance, [file_1, file_2])
        expect(result.then).toEqual(jasmine.any(Function))
        done()
      })
    })

    it('promise resolves ProgressEvents', function(done) {
      subject().then(function (instance) {
        const result = filesystem.saveFiles(instance, [file_1, file_2])
        result.then(function (progressEvents) {
          expect(progressEvents.length).toEqual(2)
          expect(progressEvents[0].loaded).toEqual(57)
          expect(progressEvents[1].loaded).toEqual(57)
          done()
        })
      })
    })
  })

  describe('.listFiles', function() {
    it('returns promise', function(done) {
      subject().then(function (instance) {
        filesystem.saveFiles(instance, [file_1, file_2]).then(function (progressEvents) {
          const result = filesystem.listFiles(instance)
          expect(result.then).toEqual(jasmine.any(Function))
          done()
        })
      })
    })

    it('promise resolves list of FileEntries', function(done) {
      subject().then(function (instance) {
        filesystem.saveFiles(instance, [file_1, file_2]).then(function (progressEvents) {
          filesystem.listFiles(instance).then(function () {
            filesystem.listFiles(instance).then(function(fileEntries) {
              expect(fileEntries[1].name).toEqual('test_1.txt')
              expect(fileEntries[0].name).toEqual('test_2.txt')
              done()
            })
          })
        })
      })
    })
  })

  describe('.openFiles', function() {
    it('returns promise', function(done) {
      subject().then(function (instance) {
        const result = filesystem.openFiles(instance, [file_1.name, file_2.name])
        expect(result.then).toEqual(jasmine.any(Function))
        done()
      })
    })

    it('promise resolves list of files saved', function(done) {
      subject().then(function (instance) {
        filesystem.saveFiles(instance, [file_1, file_2]).then(function () {
          filesystem.openFiles(instance, [file_1.name, file_2.name]).then(function(files) {
            expect(files[0].name).toEqual('test_1.txt')
            expect(files[0].size).toEqual(57)
            expect(files[1].name).toEqual('test_2.txt')
            expect(files[1].size).toEqual(57)
            done()
          })
        })
      })
    })
  })

})
