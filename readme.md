## Usage
```
ffmpeg(file1, file2, '-s -w', {
  onProgress: function (progress) {
    console.log('progress')
  }
})
```
