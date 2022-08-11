import Util from '../util/util';

export default class CustomCursor {
  constructor(){
    this.$el = document.getElementById('custom-cursor');
    this.$bg = document.getElementById('custom-cursor-bg');
    this.$text = document.getElementById('custom-cursor-text');

    this.text = 'Unmute';
    this.arrowState = 'left';
    this.mediaState = 'play';
    this.show = false;
    this.showText = false;
    this.showArrow = false;
    this.showMedia = false;
    this.showPointer = false;
    this.bg = undefined;
    this.last = {
      bg: 'none',
      show: false,
      showText: true,
      showArrow: true,
      showMedia: true,
      showPointer: true
    };
    this.position = { c: [0, 0], t: [-100, -100] };
    this.render = this.render.bind(this);
    this.resize = this.resize.bind(this);
    this.mouseHandler = this.mouseHandler.bind(this);

    this.mounted();
  }
  mounted() {
    if (window.innerWidth > 740) {
      window.addEventListener('resize', this.resize);
      this.resize();
      document.addEventListener('mousemove', this.mouseHandler);
      this.render();
      setTimeout(() => {
        this.$el.classList.add('enable-transitions');
      }, 400);
    }
  }
  mouseHandler(e) {
    this.position.t[0] = e.clientX
    this.position.t[1] = e.clientY

    this.$target = e.target;
    this.$cursorElementText = e.target.closest('[data-cursor-text]')
    this.$cursorElementArrow = e.target.closest('[data-cursor-arrow]')
    this.$cursorElementMedia = e.target.closest('[data-cursor-media]')
    this.$cursorElementPointer = this.closestPointer(e.target)
    this.$cursorElementBG = e.target.closest('[data-cursor-bg]')
    this.$cursorElementHide = e.target.closest('[data-cursor-hide]')
    this.update()
  }
  closestPointer($el) {
    return $el.closest('[data-cursor-pointer], .play-button, .primary-button, .social-link, input, .btnLegal, #footer-left, #nav, .modalClose, .legalClose, .menu-country, .menu-item, .button-takeaction, .button-download, .btDataSource, .social-item, #donor-section-years .year, p a, #founding-section .right .item')
  }
  update() {
    if (this.$cursorElementHide) {
      this.show = false
      this.showText = false
      this.showMedia = false
      this.showPointer = false
      this.showArrow = false
    }else if (this.$cursorElementPointer) {
      this.show = true
      this.showMedia = false
      this.showPointer = true
      this.showText = false
      this.showArrow = false
      
    } else if (this.$cursorElementText) {
      this.text = this.$cursorElementText.getAttribute('data-cursor-text')
      this.show = true
      this.showText = true
      this.showPointer = false
      this.showMedia = false
      this.showArrow = false
    } else {
      this.show = false
      this.showText = false
      this.showMedia = false
      this.showPointer = false
      this.showArrow = false
    }
    let bg = this.$target && this.$target.closest('[data-cursor-bg]') && this.$target.closest('[data-cursor-bg]').getAttribute('data-cursor-bg');
    if (bg) this.bg = bg;
    else this.bg = undefined;
    this.updateClasses();
  }
  render() {
    this.position.c[0] += (this.position.t[0] - this.position.c[0]) * 0.19
    this.position.c[1] += (this.position.t[1] - this.position.c[1]) * 0.19
    let final = [
      Util.round(this.position.c[0]),
      Util.round(this.position.c[1]),
    ]
    if (final[0] !== this.position.t[0] || final[1] !== this.position.t[1]) {
      this.move(final)
    }
    requestAnimationFrame(this.render)
  }
  resize() {
    this.width = this.$el.clientWidth
    this.height = this.$el.clientHeight
    this.updateClasses();
  }
  move(pos) {
    let x = pos[0] - this.width * 0.5
    let y = pos[1] - this.height * 0.5

    this.$el.style.transform = `translateX(${x}px) translateY(${y}px)`
  }
  hide() {
    this.show = false
    this.showText = false
    this.showArrow = false
    this.showMedia = false
    this.bg = undefined;

    this.updateClasses();
  }
  updateClasses() {
    if(this.show) this.$el.classList.add('show');
    else this.$el.classList.remove('show');

    if(this.showText) this.$el.classList.add('show-text');
    else this.$el.classList.remove('show-text');

    if(this.showMedia) this.$el.classList.add('show-media');
    else this.$el.classList.remove('show-media');

    if(this.showArrow) this.$el.classList.add('show-arrow');
    else this.$el.classList.remove('show-arrow');
    if(this.showPointer) this.$el.classList.add('show-pointer');
    else this.$el.classList.remove('show-pointer');

    if(this.arrowState === 'left') {
      this.$el.classList.remove('right');
      this.$el.classList.add('left');
    }
    else {
      this.$el.classList.add('right');
      this.$el.classList.remove('left');
    }

    if(this.mediaState === 'play') {
      this.$el.classList.remove('pause');
      this.$el.classList.add('play');
    }
    else {
      this.$el.classList.add('pause');
      this.$el.classList.remove('play');
    }
    
    this.$bg.style.fill = this.bg;
    this.$text.innerHTML = this.text;
  }
}