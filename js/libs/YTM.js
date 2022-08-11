var callback;
window.onYouTubeIframeAPIReady = function(){
  if(callback) callback();
}
function init(cb){
  callback = cb;
  var tag = document.createElement('script');
  
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
export default {
  init: init
}