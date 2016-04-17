const executor = require('./executor.js')

describe('executor.js', function() {
  const eventData = "frame=  132 fps=2.8 q=0.0 Lsize=     264kB time=00:00:05.31 bitrate= 407.3kbits/s speed=0.112x    "
  const args = 'ffmpeg -y -i test.mp4 -preset ultrafast output.webm'

  describe('.dataIsProgress', function () {
    it('returns true with event data', function () {
      const result = executor.dataIsProgress(eventData)
      expect(result).toEqual(true)
    })

    it('returns false with non event data', function () {
      const result = executor.dataIsProgress('hello world')
      expect(result).toEqual(false)
    })
  })

  describe('.dataToProgress', function () {
    it('parses correctly', function () {
      const result = executor.dataToProgress(eventData)
      expect(result).toEqual({
        frame: '132',
        fps: '2.8',
        q: '0.0',
        Lsize: '264kB',
        time: '00:00:05.31',
        bitrate: '407.3kbits/s',
        speed: '0.112x',
      })
    })
  })

  describe('.argumentsToMap', function () {
    it('returns map with correct keys', function () {
      const result = executor.argumentsToMap(args)
      expect(result).toEqual({
        arg0: 'ffmpeg',
        arg1: '-y',
        arg2: '-i',
        arg3: 'test.mp4',
        arg4: '-preset',
        arg5: 'ultrafast',
        arg6: 'output.webm',
      })
    })
  })

  describe('.createContainer', function () {
    it('returns promise', function () {
      const result = executor.createContainer()
      expect(result.then).toEqual(jasmine.any(Function))
    })

    it('promise resolves element', function (done) {
      const result = executor.createContainer()
      result.then(function(el) {
        expect(el.tagName).toEqual('DIV')
        done()
      })
    })
  })

  describe('.addAttributes', function () {
    it('returns element with attributes added', function () {
      const el = document.createElement('div')
      const attr = {arg0: '0', arg1: '1'}
      const result = executor.addAttributes(el, attr)
      expect(result.tagName).toEqual('DIV')
      expect(el.getAttribute('arg0')).toEqual('0')
      expect(el.getAttribute('arg1')).toEqual('1')
    })
  })

  /*
  describe('.run', function () {
    it('returns promise', function () {
      const container = document.createElement('div')
      const result = executor.run(container, args)
      expect(result.then).toEqual(jasmine.any(Function))
    })

    it('resolves promise to embed element', function (done) {
      const container = document.createElement('div')
      const result = executor.run(container, args)
      result.then(function(el) {
        console.log('--- here')
        expect(el.tagName).toEqual('EMBED')
        done()
      })
    })

    it('adds default attributes to element', function () {
      const container = document.createElement('div')
      const result = executor.run(container, args)
      result.then(function(el) {
        expect(el.getAttribute('path')).toEqual('/')
        expect(el.getAttribute('src')).toEqual('/manifest.nmf')
        done()
      })
    })

    it('adds arguments string as element attributes', function () {
      const container = document.createElement('div')
      const result = executor.run(container, args)
      result.then(function(el) {
        expect(el.getAttribute('arg0')).toEqual('ffmpeg')
        expect(el.getAttribute('arg1')).toEqual('-y')
        done()
      })
    })

    it('nests embed inside the container', function () {
      const container = document.createElement('div')
      const result = executor.run(container, args)
      result.then(function(el) {
        expect(container.contains(el)).toEqual(true)
        done()
      })
    })
  })
  */

})
