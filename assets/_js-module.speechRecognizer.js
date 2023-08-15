define(['recorder'], function(Recorder){

  console.log('Module SpeechRecognizer is loaded');

  var SpeechRecognizer = function (userConfig) {
  
    this.config = this._extendObj ({  //написати коментарі до всіх параметрів коментарі
      recordBtnId:  '',
      apiKey:       '',
      maxTimeRecord:  15,
      language: "en-US",
      maxAlternatives: 15,
      googleSpeechURL: "https://speech.googleapis.com/v1beta1/speech:syncrecognize?key=" + userConfig.apiKey,
    }, userConfig);
    
    if (!userConfig.apiKey) {
      throw new Error('Missing apiKey value. Please check an apiKey for SpeechRecognizer options');
    }
    
    if (!FileReader) {
      console.error('FileReader isn\'t supported in your browser');
      return null;
    }
   
    try { 
      window.AudioContext     = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    }
    catch(e) {
      console.error('Web Audio API is not supported in this browser');
      return null;
    }
    
    if (location.protocol == 'http:') {
      location.href = location.href.replace('http:', 'https:');
    }
    
    this.init();
  };

  SpeechRecognizer.prototype.init = function() {

    this.DOM        = {};
    this.DOM.micBtn = document.getElementById(this.config.recordBtnId);

    if (!this.DOM.micBtn) {
      throw new Error('Record button id error. Passed id "' + this.config.recordBtnId + '" for record button is not found. Please check an cofiguration id for SpeechRecognizer options');
    }
    
    this.DOM.micBtn.onclick = function (e) {
      e.preventDefault();
      this.toggleRecord();
    }.bind(this);

    this.workingState = "stopped";
    
    this.audioContext = null; // AudioContext instance
    this.audioInput   = null; // Object with Stream (to record a voice)
    this.recorder     = null; // Recorder instance. more https://github.com/mattdiamond/Recorderjs

    this.lngCode = "en-US";
    this.lngList = ["af-ZA", "id-ID", "ms-MY", "ca-ES", "cs-CZ", "da-DK", "de-DE", "en-AU", "en-CA", "en-GB", "en-IN", "en-IE", "en-NZ", "en-PH", "en-ZA", "en-US", "es-AR", "es-BO", "es-CL", "es-CO", "es-CR", "es-EC", "es-SV", "es-ES", "es-US", "es-GT", "es-HN", "es-MX", "es-NI", "es-PA", "es-PY", "es-PE", "es-PR", "es-DO", "es-UY", "es-VE", "eu-ES", "fil-PH", "fr-FR", "gl-ES", "hr-HR", "zu-ZA", "is-IS", "it-IT", "lt-LT", "hu-HU", "nl-NL", "nb-NO", "pl-PL", "pt-BR", "pt-PT", "ro-RO", "sk-SK", "sl-SI", "fi-FI", "sv-SE", "vi-VN", "tr-TR", "el-GR", "bg-BG", "ru-RU", "sr-RS", "uk-UA", "he-IL", "ar-IL", "ar-JO", "ar-AE", "ar-BH", "ar-DZ", "ar-SA", "ar-IQ", "ar-KW", "ar-MA", "ar-TN", "ar-OM", "ar-PS", "ar-QA", "ar-LB", "ar-EG", "fa-IR", "hi-IN", "th-TH", "ko-KR", "cmn-Hant-TW", "yue-Hant-HK", "ja-JP", "cmn-Hans-HK", "cmn-Hans-CN"];

    this.lngListShort = ["af-ZA", "id-ID", "ms-MY", "ca-ES", "cs-CZ", "da-DK", "de-DE", "en-US", "es-ES", "eu-ES", "fil-PH", "fr-FR", "gl-ES", "hr-HR", "zu-ZA", "is-IS", "it-IT", "lt-LT", "hu-HU", "nl-NL", "nb-NO", "pl-PL", "pt-PT", "ro-RO", "sk-SK", "sl-SI", "fi-FI", "sv-SE", "vi-VN", "tr-TR", "el-GR", "bg-BG", "ru-RU", "sr-RS", "uk-UA", "he-IL", "ar-SA", "fa-IR", "hi-IN", "th-TH", "ko-KR", "ja-JP"];

    this.defineLngCode();
    this._emit('initEnd');
  };


  SpeechRecognizer.prototype.toggleRecord = function() {

    if (this.workingState == 'recording') {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  };

  SpeechRecognizer.prototype.startRecording = function() {

    navigator.getUserMedia( { audio: true }, this.micPermissionGranted.bind(this), this.micPermissionDenied.bind(this));
  };

  SpeechRecognizer.prototype.micPermissionDenied = function(e) {

    this._emit('micDenied');
  };

  SpeechRecognizer.prototype.micPermissionGranted = function(e) {

    if (!this.audioContext || !this.audioInput || !this.recorder) {

      this.audioContext = new AudioContext();
      this.audioInput   = this.audioContext.createMediaStreamSource(e);
      this.recorder     = new Recorder(this.audioInput, { numChannels: 1 });
    }

    this.workingState = "recording";

    this.recorder.clear();
    this.recorder.record();
    
    this.startRecordTimer();    
    this._emit('recording');
  };

  SpeechRecognizer.prototype.startRecordTimer = function() {

    var recordingTime = 0,
        startTime = Date.now();

    timerInterval = setInterval(function() {

      if (this.workingState == 'recording') {

        recordingTime = Date.now() - startTime;

        if (recordingTime >= this.config.maxTimeRecord*1000) {

          this.stopRecording();
          clearInterval(timerInterval);
        }
      } else {
        clearInterval(timerInterval);
      }
    }.bind(this), 250);
  };

  SpeechRecognizer.prototype.stopRecording = function() {

    setTimeout(function(){

      this.workingState = "stopped";

      this.recorder.stop();
      this.processRecording();

      this._emit('processing');
    }.bind(this), 300);
  };

  SpeechRecognizer.prototype.processRecording = function() {
   
    this.recorder.exportWAV(function(blob){

      var file = new FileReader();

      file.onload = function(progressData) {

        var loadedString = progressData.target.result;
        this.sendRecord(btoa(loadedString), "LINEAR16", this.audioContext.sampleRate);
      }.bind(this);

      file.readAsBinaryString(blob);
      
    }.bind(this));
  };

  SpeechRecognizer.prototype.sendRecord = function(base64string, encoding, sampleRate) {

    var dataSend, xhttp;

    dataSend = JSON.stringify({
      config: {
        encoding:        encoding,
        sampleRate:      sampleRate,
        languageCode:    this.lngCode,
        maxAlternatives: this.config.maxAlternatives
      },
      audio: {
        content: base64string
      }
    });

    xhttp = new XMLHttpRequest();
    
    xhttp.open("POST", this.config.googleSpeechURL, true);
    xhttp.send(dataSend);
    
    xhttp.onload = function() {

      if (xhttp.status >= 200 && xhttp.status < 400) {

        this._emit('result', JSON.parse(xhttp.responseText));
      } else {

        this._emit('error', 'Unable to upload the speech');
      }
    }.bind(this);
  };

  SpeechRecognizer.prototype.defineLngCode = function() {

    var shopLngCode    = this.config.language,
        browserLngCode = navigator.language;

    if (shopLngCode.length >= 5 && this.lngList.indexOf(shopLngCode) >= 0 ) {

      this.lngCode = shopLngCode;
    } else if (shopLngCode.length > 2 && this.lngList.indexOf(shopLngCode) < 0) {

      shopLngCode  = shopLngCode.slice(0, shopLngCode.indexOf('-'));
      this.lngCode = this.getLngCodeFromList(shopLngCode);
    } else if (shopLngCode.length === 2 ) {

      this.lngCode = this.getLngCodeFromList(shopLngCode);
    } else {

      this.lngCode = browserLngCode;
    }
  };

  SpeechRecognizer.prototype.getLngCodeFromList = function(shopLngCode) {

    var lngCodeSimple, lngCode;

    for ( var i = 0, max = this.lngListShort.length; i < max; i++ ) {

      lngCodeSimple = this.lngListShort[i].match(/^\w+(?=-)/);

      if (shopLngCode == lngCodeSimple) {

        lngCode = this.lngListShort[i];
        break;
      }
    }

    return lngCode;
  };

  SpeechRecognizer.prototype.setMicBtnState = function(state) {

    if (state === 'disabled') {

      this.DOM.micBtn.disabled = true;
    } else if (state === 'enabled') {

      this.DOM.micBtn.disabled = false;
    }
  };

  SpeechRecognizer.prototype._on = function(eventStr, callback, context) {

    if (typeof eventStr !== "string"){
      console.error('First passed parametr for addEventHandler isn\'t string');
      return null;
    }

    if (typeof callback !== 'function') {
      console.error('Second passed parametr for addEventHandler isn\'t function');
      return null;
    }        

    typeof context == 'object' || (context = null);

    this.evenTable = this.evenTable || {};

    eventStr        = eventStr.replace(/\s*\,\s+|\s+/g, ' ');
    var eventNames  = eventStr.split(" ");

    for (var i in eventNames) {
      evName = eventNames[i];
      this.evenTable[evName] = this.evenTable[evName] || [];
      this.evenTable[evName].push({
        'function': callback,
        'context': context
      });
    }
  };

  SpeechRecognizer.prototype._emit = function(eventName) {

      if (!this.evenTable || !this.evenTable[eventName] || !this.evenTable[eventName].length) { return false;}

      var context, lastResult,
          event = this.evenTable[eventName];

      for (var i = event.length - 1; i >= 0; i--) {

        context = event[i]['context'] || null;
        lastResult = event[i]['function'].apply(context, arguments);
      }

      return lastResult;
  };

  SpeechRecognizer.prototype._extendObj = function ( defaults, options ) {
    
    var extended = {};
    var prop;
    for (prop in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
        extended[prop] = defaults[prop];
      }
    }
    for (prop in options) {
      if (Object.prototype.hasOwnProperty.call(options, prop)) {
        extended[prop] = options[prop];
      }
    }
    return extended;
  };

  return SpeechRecognizer;
});