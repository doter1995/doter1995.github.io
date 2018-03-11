var Music = function (src) {
  this.src = src
  var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
  this.AudioContext = new AudioContext()
  this.source = this.AudioContext.createBufferSource()
  this.Analyser = this.AudioContext.createAnalyser()
  
  this.Analyser.fftSize = 256;
  this.isRun = false;
  this.loadSound = function () {
    var that = this
    var request = new XMLHttpRequest(); //建立一个请求
    request.open('GET', this.src, true); //配置好请求类型，文件路径等
    request.responseType = 'arraybuffer'; //配置数据返回类型
    // 一旦获取完成，对音频进行进一步操作，比如解码
    request.onload = function () {
      console.log(request)
      that.AudioContext.decodeAudioData(request.response)
        .then((buffer) => {
          that.source.buffer = buffer
        })
      that.play()
    }
    request.send();
  }
  this.getByteTimeDomainData = function () {
    var data = new Uint8Array(this.Analyser.frequencyBinCount);
    this.Analyser.getByteTimeDomainData(data)
    return Array.from(data)
  }
  this.play = function () {
    console.log(this.AudioContext)
    this.source.connect(this.AudioContext.destination)
    console.log('aaa')
    this.source.connect(this.Analyser)
    this.source.start(0);
    this.isRun = true;
  }
  this.loadSound()
}