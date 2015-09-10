window.videoController = videoController;

function videoController(name, options){

  var checkpoints = _.clone(options.checkpoints);

  var videoData = {
    get playbackRate() {
      return helperGetter('videoData', 'playbackRate');
    },
    set playbackRate(value) {
      helperSetter('videoData', 'playbackRate', value);
    },
    get checkpoint() {
      var identifier = helperGetter('videoData', 'checkpoint');
      return _.findWhere(checkpoints, {identifier: identifier});
    },
    set checkpoint(value) {
      if(_.findWhere(checkpoints, {identifier: value})){
        helperSetter('videoData', 'checkpoint', value);
      }
    },
    get nextCheckpoint() {
      var identifier = helperGetter('videoData', 'checkpoint');
      var currentIndex = _.findIndex(checkpoints, {identifier: identifier});
      if(_.isObject(checkpoints[currentIndex + 1])){
        return checkpoints[currentIndex + 1];
      } else if (currentIndex == checkpoints.length - 1) {
        // loop back to the beginning
        return _.first(checkpoints);
      } else {
        videoData.checkpoint = _.first(checkpoints).identifier;
        return _.first(checkpoints);
      }
    }
  };

  var consoleCleared = false;
  var videoIframe, checklistElement, player;

  initializeVideoData();
  initializeCheckpoint();

  videoIframe = initializeIframe(name, options);
  checklistElement = makeSteps(checkpoints);
  updateStepsActive(videoData.checkpoint.identifier, checklistElement);

  return;

  function initializeCheckpoint(){
    if(location.hash.length){
      videoData.checkpoint = location.hash.replace('#', '');
    } else if(videoData.checkpoint){
      location.hash = '#' + videoData.checkpoint.identifier;
    }
  }

  function initializeIframe(name, options){
    var instructionsIframe = document.getElementById(name)
    instructionsIframe.src = "https://www.youtube.com/embed/" + options.videoId + "?enablejsapi=1&origin=" + location.origin;

    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

    return instructionsIframe;
  }

  function initializeVideoData(){
    var defaultSettings = {
      playbackRate: 1.5,
      checkpoint: _.first(checkpoints).identifier
    };

    if(_.isNull(localStorage.getItem('videoData'))){
      localStorage.setItem('videoData', JSON.stringify(defaultSettings));  
    }
  }

  function helperGetter(dataName, dataKey){
    var stored = JSON.parse(localStorage.getItem(dataName));
    return stored[dataKey];
  }

  function helperSetter(dataName, dataKey, value){
    var stored = JSON.parse(localStorage.getItem(dataName));
    if(stored[dataKey] != value){
      stored[dataKey] = value;
      localStorage.setItem(dataName, JSON.stringify(stored));
    }
  }

  function onYouTubeIframeAPIReady() {
    player = new YT.Player('instructions', {
      events: {
        'onReady': onReady,
        'onStateChange': onStateChange,
        'onPlaybackRateChange': onPlaybackRateChange
      }
    });
  }

  function onReady(){
    cue(videoData.checkpoint);
  }

  function onPlaybackRateChange(){
    videoData.playbackRate = player.getPlaybackRate();
  }

  function onStateChange(event) {
    var checkpointByTime;

    if (event.data == YT.PlayerState.CUED && !consoleCleared){
      console.clear();
      consoleCleared = true;

    } else if (event.data == YT.PlayerState.PLAYING){
      setPlaying();
      checkpointByTime = getCheckpointByTime(player.getCurrentTime());

      if(checkpointByTime.identifier != videoData.checkpoint.identifier) {
        updatePlaying(checkpointByTime.identifier);
      }

    } else if (event.data == YT.PlayerState.ENDED){
      if (player.getCurrentTime() >= videoData.checkpoint.end){
        cue(videoData.nextCheckpoint);
        setPlayNext();
      }
    }
  }

  function getCheckpointByTime(playTime){
    var checkpointByTime = _.find(checkpoints, function(checkpoint){
      return checkpoint.start <= playTime && playTime < checkpoint.end;
    });

    return checkpointByTime;
  }


  function makeSteps(checkpoints){
    var listElement = document.getElementById('checklist');
    _.each(checkpoints, _.partial(makeStep, listElement));
    return listElement;
  }

  function makeStep(listElement, checkpoint){
    var stepElement = document.createElement('a');
    stepElement.className = 'list-group-item';

    stepElement.href = '#' + checkpoint.identifier;
    stepElement.id = checkpoint.identifier;
    stepElement.innerText = checkpoint.name;
    stepElement.addEventListener('click', _.partial(playThisStep, checkpoint.identifier));

    listElement.appendChild(stepElement);
  }

  function playThisStep(identifier, clickEvent){
    var actives;
    clickEvent.preventDefault();

    if(videoData.checkpoint == identifier){
      return;
    }
    updatePlaying(identifier, true);
    cue(videoData.checkpoint);
    playVideo();
  }

  function updateStepsActive(stepElement, checklistElement, isClick){
    var isClick = isClick || false;

    if(!_.isElement(stepElement)){
      stepElement = checklistElement.querySelector('a.list-group-item[href="#' + stepElement + '"]')
    }
    actives = stepElement.parentNode.getElementsByClassName('active');
    _.each(actives, function(active){
      active.classList.remove('active');
    });
    stepElement.classList.add('active');
    if (!isClick){
      if ((stepElement.offsetTop + stepElement.clientHeight) > stepElement.parentNode.clientHeight){
        stepElement.parentNode.style.marginBottom = stepElement.parentNode.clientHeight + 'px';
      } else {
        stepElement.parentNode.style.marginBottom = 0;
      }

      stepElement.parentNode.scrollTop = stepElement.offsetTop;        
    }
  }

  function updatePlaying(identifier, isClick){
    videoData.checkpoint = identifier;
    updateStepsActive(videoData.checkpoint.identifier, checklistElement, isClick);
    history.pushState({checkpoint: videoData.checkpoint}, videoData.checkpoint.name, '#' + videoData.checkpoint.identifier);
  }

  function cue(checkpoint){
    player.cueVideoById({videoId: options.videoId, startSeconds: checkpoint.start, endSeconds: checkpoint.end});
    player.setPlaybackRate(videoData.playbackRate);
  }

  function setPlayNext(){
    videoIframe.parentNode.classList.add('play-next');
    videoIframe.parentNode.addEventListener('click', playVideo);
  }

  function setPlaying(){
    videoIframe.parentNode.classList.remove('loading');
    videoIframe.parentNode.removeEventListener('click', playVideo);
  }

  function playVideo(){
    player.playVideo();
    videoIframe.parentNode.classList.remove('play-next');
    videoIframe.parentNode.classList.add('loading');
  }

}
