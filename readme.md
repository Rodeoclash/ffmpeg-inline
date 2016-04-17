Wrapper around a pexe based version of ffmpeg

## Usage

```
var file = event.target.files[0] // from <input type="file" /> change
event
var inputFiles = [file]
var globalOptions = '-y' // always overwrite files
var convertOptions = '-preset ultrafast -s 320x200'
var outputFiles = ['output.webm']

window.ffmpeg(globalOptions, inputFiles, convertOptions, outputFiles, {
  onProgress: function(progress) {
    console.log('progress', progress)
  }
}).then(function(results) {
  results // array of file objects
})
```

See examples folder for working versions.

## Contributing

Run `make develop` to setup local dev envionment (run examples at:
`http://localhost:8000/example_1.html`)

Run `make test` to execute test suite.
