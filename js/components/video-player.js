import Util from '../util/util';

export default class VideoPlayer {
  constructor($el, toggleListener){
    this.$el = $el;
    this.toggleListener = toggleListener;
    this.cover = this.$el.querySelector('.video-cover');
    this.button = this.$el.querySelector('.video-button');
    this.src = this.$el.getAttribute('data-src');
    this.playing = false;
    this.passive = true;
    if(this.$el.getAttribute('data-passive') === null || this.$el.getAttribute('data-passive') === 'false')
      this.passive = false;

    this.native = Util.isVideoNative(this.src);
    this.resize();
    this.addMedia();
    this.$el.addEventListener('click', (e) => {
      this.play();
    });
  }
  resize () {
    this.width = this.$el.clientWidth;
    this.height = this.$el.clientHeight;
  }
  play() {
    if(!this.$el.classList.contains('playing')){
      if(!this.native) {
        if(!this.player || !this.player.getPlayerState) {
          this.$el.classList.add('loading');
          this.initYT(() => {
            if(this.player.getPlayerState() != YT.PlayerState.PLAYING){
              this.player.playVideo();
            }
            this.$el.classList.remove('loading');
          });
        }
        else {
          if(this.player.getPlayerState() != YT.PlayerState.PLAYING){
            this.player.playVideo();
          }
        }
      }
    }
  }
  stop() {
    if (this.$el.classList.contains('playing')) {
      if (!this.native) {
        if (this.player.getPlayerState() === YT.PlayerState.PLAYING) {
          this.$el.classList.remove('playing');
          this.player.stopVideo();
          if(this.toggleListener) this.toggleListener(false);
        }
      }
    }
  }
  addMedia() {
    let media;
    if (this.native) {
      media = document.createElement('video');
      media.src = this.src;
      media.controls = true;
      this.$el.appendChild(media);
    } else {
      if(!this.passive) this.initYT();
    }
  }
  initYT(cb) {
    const container = document.createElement('div');
    Array.from(container.querySelectorAll('video, iframe')).forEach(old => old.remove());
    this.$el.appendChild(container);
    this.id = Util.getEmbedURL(this.src, true).id;
    this.player = new YT.Player(container, {
      height: this.width,
      width: this.height,
      videoId: this.id,
      playerVars: {
        controls: 0,
        disablekb: 1,
        playsinline: 1,
        showinfo: 0,
        rel: 0,
        modestbranding: 1
      },
      events: {
        'onReady': (e) => { this.onPlayerReady(e); if(cb) cb() },
        'onStateChange': (e) => { this.onPlayerStateChange(e) },
      }
    });
  }
  onPlayerReady (e){
    this.$el.classList.remove('loading');
  }
  onPlayerStateChange (e){
    const state = this.player.getPlayerState();
    if(this.stared === undefined && state === YT.PlayerState.PLAYING) this.stared = true;
    if(state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING) {
      this.$el.classList.add('playing');
      if(this.toggleListener) this.toggleListener(true);
    }
    if(this.stared && (state === YT.PlayerState.PAUSED || state === YT.PlayerState.ENDED) && state !== YT.PlayerState.BUFFERING){
      this.$el.classList.remove('playing');
      if(this.toggleListener) this.toggleListener(false);
    }
    if(state === YT.PlayerState.ENDED) {
      this.stared = undefined
    }
    this.playing = state === YT.PlayerState.PLAYING;
  }
}