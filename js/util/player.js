import Util from './util';
import gsap from 'gsap';

export default class Player {
  constructor(){
    this.isPlaying = false;
  }
  play(src, cb, keep, time){
    this.isPlaying = true;
    if(keep && this.audioElement){
      this.audioElement.src = src;
    }else{
      this.audioElement = new Audio(src);
    }
    this.audioElement.loop = cb ? false : true;
    this.audioElement.crossorigin = 'anonymous';
    if(time !== undefined) {
      this.audioElement.currentTime = time;
    }
    this.checkForPlay(cb, time);
  }
  resume(){
    this.isPlaying = true;
    this.checkForPlay();
  }
  checkForPlay(cb, time){
    this.lowBackgroundVolume();
    if(Util.testBrowser('safari mobile')){
      this.audioElement.play();
    }if(this.audioElement.readyState === HTMLMediaElement.HAVE_FUTURE_DATA || this.audioElement.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA){
      this.audioElement.play();
    }else{
      this.audioElement.addEventListener("canplaythrough", event => {
        if(this.isPlaying){
          if(time !== undefined) {
            this.audioElement.currentTime = time;
          }
          this.audioElement.play();
        }
      });
    }
    this.audioElement.addEventListener("ended", event => {
      if(cb){
        this.resetBackgroundVolume();
      }
    });
  }
  stop(){
    this.isPlaying = false;
    if(this.audioElement)
      this.audioElement.pause();
    this.resetBackgroundVolume();
  }
  fadeout(){
    this.isPlaying = false;
    if(this.audioElement){
      gsap(this.audioElement, {duration: 1, volume: 0, ease: 'Power4.easeOut', onComplete: () => {
        if(this.audioElement) {
          this.audioElement.pause();
          this.audioElement.volume = 1;
        }
      }})
    }
  }
  lowBackgroundVolume() {
    if(window.soundNav && window.soundNav.isPlaying && window.soundNav.player.audioElement && (!this.audioElement || !this.audioElement.src !== window.soundNav.src)) {
      gsap(window.soundNav.player.audioElement, {duration: 1, volume: 0.5, ease: 'Power4.easeOut'})
    }
  }
  resetBackgroundVolume() {
    if(window.soundNav && window.soundNav.isPlaying && window.soundNav.player.audioElement && (!this.audioElement || !this.audioElement.src !== window.soundNav.src)) {
      gsap(window.soundNav.player.audioElement, {duration: 1, volume: 1, ease: 'Power4.easeOut'})
    }
  }
}