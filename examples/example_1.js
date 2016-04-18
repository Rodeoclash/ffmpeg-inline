$(function() {

  var $inputFile = $('#inputFile')
  var $videos = $('#videos')

  function handleChange(event) {
    var file = event.target.files[0]
    var inputFiles = [file]
    var globalOptions = '-y' // always overwrite files
    var convertOptions = '-preset ultrafast -s 320x200'
    var outputFiles = ['output.webm']

    window.ffmpeg(globalOptions, inputFiles, convertOptions, outputFiles, {

      // Pexe loading started
      onLoadstart: function(event) {
        console.log('loadstart', event)
      },

      // Pexe load progress
      onProgress: function(event) {
        console.log('progress', event)
      },

      // Pexe load successful
      onLoad: function(event) {
        console.log('load', event)
      },

      // Pexe load ended
      onLoadend: function(event) {
        console.log('loadend', event)
      },

      // Called when ffmpeg has processed some frames
      onMessage: function(message) {
        console.log('message', message)
      }

    }).then(function(results) {
      const result = results[0]
      const url = window.URL.createObjectURL(result)
      const el = $('<video>', {
        src: url,
        controls: true,
      })

      $videos
        .empty()
        .append(el)
    }).catch(function(error) {
      console.error('Their was a problem using ffmpeg-inline: ', error)
    })
  }

  $inputFile.on('change', handleChange)
})

