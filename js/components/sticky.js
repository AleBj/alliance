import gsap from 'gsap';
import Util from '../util/util';

export default class Sticky {
  constructor(el, onProgress){
    this.el = el;
    this.placeholder = this.el.querySelector('[data-scroll-sticky-placeholder]');
    this.container = this.el.querySelector('[data-scroll-sticky-container]');
    this.content = this.el.querySelector('[data-scroll-sticky-content]');
    this.main = document.getElementById('main');
    this.progress = 0;
    this.last = 'isDown';

    this.onProgress = onProgress;
    this.resize = this.resize.bind(this);
    this.scroll = this.scroll.bind(this);

    this.resize();

    window.addEventListener('resize', this.resize);

    window.addEventListener('wheel', () => { this.scroll() });
    document.addEventListener('touchmove', () => { this.scroll() }, { passive: false });
    document.addEventListener('keydown', (e) => {
      if(this.isNavKey(e)) {
        this.scroll();
      }
    });
  }
  isNavKey(e) {
    return e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Home' || e.key === 'End';
  }
  resize() {
    this.winH = window.innerHeight;
    this.isMobile = window.innerWidth <= 1024;
    this.height = this.content.getAttribute('data-scroll-sticky-height') ? Number(this.content.getAttribute('data-scroll-sticky-height')) * this.winH : this.content.scrollHeight + this.winH;
    this.heightMultiply = this.content.getAttribute('data-scroll-sticky-multiply') ? Number(this.content.getAttribute('data-scroll-sticky-multiply')) : 1;
    
    this.height *= this.heightMultiply;

    const t = window.scroll.data ? window.scroll.data.t : 0;
    this.top = t + this.el.getBoundingClientRect().top;
  }
  scroll(customPos, customIsDown) {
    if(this.isMobile) return;
    const pos = customPos === undefined ? window.scroll.data.t : customPos;
    if(pos <= this.top) {
      this.progress = 0;
    }
    else if(pos > this.top && pos < this.top + this.height) {
      this.progress = Math.max(Math.min(1, (pos - this.top) / (this.height - this.winH)), 0);
    }else {
      this.progress = 1;
    }
    let isDown = window.scroll.data.t > window.scroll.data.c;
    if(window.scroll.data.t === window.scroll.data.c) {
      isDown = this.last === 'isDown';
    }
    if(customIsDown !== undefined) {
      isDown = customIsDown;
    }
    this.onProgress(this.progress, isDown);
    this.last = isDown ? 'isDown' : 'isUp';
  }
}