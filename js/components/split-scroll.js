import Util from '../util/util';

export default class ScrollCtrl {
  constructor(options) {
    this.$el = options.el;
    this.$left = options.left;
    this.$right = options.right;
    this.itemsLeft = Array.from(this.$left.children);
    this.itemsRight = Array.from(this.$right.children);
    this.pointer = document.getElementById('scroll-pointer');
    this.pausePointer = false;
    this.initValue = 0.001
    this.touch = { prev: {left: this.initValue, right: this.initValue}, start: this.initValue };
    this.target = { left: this.initValue, right: this.initValue };
    this.event = {};
    this.pause = false;
    this.m = 0.99;
    // this.oneColumn = window.innerWidth < 1024;
    this.oneColumn = false;
    this.clonesHeight = { left: 0, right: 0 };
    this.scrollHeight = { left: 0, right: 0 };
    this.data = { left: { t: this.initValue, c: this.initValue }, right: { t: this.initValue, c: this.initValue } };
    this.maxDelta = 80;
    this.delta = 0;
    this.pauseEvents = false;
    this.render = this.render.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.onMove = this.onMove.bind(this);
    this.eventsManager = this.eventsManager.bind(this);
    this.resize = this.resize.bind(this);
    this.init();
  }
  init() {
    document.addEventListener('touchstart', this.touchStart, { passive: false });
    document.addEventListener('touchmove', this.onMove, { passive: false });
    document.addEventListener('mousemove', this.mouseMove);
    document.addEventListener('mouseWheel', this.onMove, { passive: false });
    document.addEventListener('wheel', this.onMove);

    this.resize();
    window.addEventListener('resize', () => {
      clearTimeout(this.resizedFinished);
      this.resizedFinished = setTimeout(() => {
        this.resize();
      }, 250);
    });
    this.render();
  }
  cloneItems() {
    const itemHeight = this.itemsLeft.find((p) => !p.classList.contains('hide')).offsetHeight;
    const fitIn = Math.ceil(window.innerHeight / itemHeight);

    this.$left.querySelectorAll('.item-clone').forEach((clone) => this.$left.removeChild(clone));
    this.$right
      .querySelectorAll('.item-clone')
      .forEach((clone) => this.$right.removeChild(clone));

    let totalClones = 0;
    this.itemsLeft.map((project) => {
      if (totalClones < fitIn && !project.classList.contains('hide')) {
        const clone = project.cloneNode(true);
        clone.classList.add('item-clone');
        this.$left.appendChild(clone);
        ++totalClones;
      }
    });
    this.clonesHeight.left = totalClones * itemHeight;
    if (!this.oneColumn) {
      totalClones = 0;
      this.itemsRight.map((project) => {
        if (totalClones < fitIn && !project.classList.contains('hide')) {
          const clone = project.cloneNode(true);
          clone.classList.add('item-clone');
          this.$right.appendChild(clone);
          ++totalClones;
        }
      });
      this.clonesHeight.right = totalClones * itemHeight;
    }

    this.scrollHeight.left = this.$left.scrollHeight;
    this.scrollHeight.right = this.$right.scrollHeight;
  }
  touchStart(e) {
    this.touch.prev.left = this.target.left;
    this.touch.prev.right = this.target.right;
    this.touch.start = e.targetTouches[0].pageY;
  }
  mouseMove() {
    this.pausePointer = true;
    this.pointer.style.pointerEvents = 'none';
  }
  initScroll() {
    this.data.left.t = this.initValue;
    this.data.right.t = this.initValue;

    this.data.left.c = this.initValue;
    this.data.right.c = this.initValue;

    this.target.left = this.initValue;
    this.target.right = this.initValue;
  }
  onMove(e) {
    this.event = e;
    if (this.event.toElement && this.event.toElement.closest('.option')) return;
    this.prevent(e);
    if (!this.pauseEvents && !this.pause) {
      requestAnimationFrame(this.eventsManager);
      this.pauseEvents = true;
    }
  }
  prevent(t) {
    if (t.cancelable && 'keydown' !== t.type) t.preventDefault();
  }
  eventsManager() {
    var t = this.event.type;
    switch (t) {
      case 'wheel':
        this.wheel();
        break;
      case 'mousewheel':
        this.mouseWheel();
        break;
      case 'touchmove':
        this.touchMove();
        break;
      case 'keydown':
        this.keyDown();
        break;
      default:
        break;
    }
  }
  touchMove() {
    this.pausePointer = false;
    var t = 1.5 * (this.event.targetTouches[0].pageY - this.touch.start);
    this.delta = t;
    this.target.left = this.delta + this.touch.prev.left;
    this.target.right = -this.delta + this.touch.prev.left;
    this.update();
  }
  mouseWheel() {
    this.pausePointer = false;
    var t = this.event.wheelDeltaY ? this.event.wheelDeltaY : this.event.wheelDelta;
    this.delta = Math.abs(t) > this.maxDelta ? Math.sign(t) * this.maxDelta : t;
    this.target.left += this.delta;
    this.target.right += -this.delta;

    this.update();
  }
  wheel() {
    this.pausePointer = false;
    var t = this.event.wheelDeltaY || -1 * this.event.deltaY;
    if (Util.testBrowser('firefox') && this.event.deltaMode) t *= 60;
    t *= 0.554;
    this.delta = Math.abs(t) > this.maxDelta ? Math.sign(t) * this.maxDelta : t;
    this.target.left += this.delta;
    this.target.right += -this.delta;
    //console.log('wheel', this.target.right);

    this.update();
  }
  keyDown() {
    var t,
      kc = this.event.keyCode;
    if (kc === 38) t = 80;
    else if (40 === kc) t = -80;
    else if (32 === kc && this.event.shiftKey) t = this.spaceDelta;
    else if (32 === kc) t = -this.spaceDelta;
    else if (9 === kc) {
      t = 0;
      this.prevent(this.event);
    } else t = 0;
    this.delta = Math.abs(t) > this.maxDelta ? Math.sign(t) * this.maxDelta : t;
    this.target.left += this.delta;
    this.target.right += -this.delta;
    this.update();
  }
  update() {
    this.target.left = Util.round(this.target.left);
    this.target.right = Util.round(this.target.right);

    this.data.left.t = Util.round(-this.target.left);
    this.data.right.t = Util.round(-this.target.right);
    this.pauseEvents = false;
  }
  render() {
    this.data.left.c += this.m * (this.data.left.t - this.data.left.c);
    this.data.right.c += this.m * (this.data.right.t - this.data.right.c);

    var final = Util.round(this.data.right.c);

    if (!this.oneColumn) {
      if (this.clonesHeight.right + final >= this.scrollHeight.right) {
        this.data.right.t = this.initValue;
        this.data.right.c = this.initValue;
        this.target.right = this.initValue;
      } else if (final <= 0) {
        let end = this.scrollHeight.right - this.clonesHeight.right;
        this.data.right.t = end;
        this.data.right.c = end;
        this.target.right = -end;
      } else {
        if (final !== this.data.right.t) {
          this.updateElements(this.$right, final);
          if (!this.pausePointer && !this.isMobile) {
            this.pausePointer = true;
            this.pointer.style.pointerEvents = 'all';
          }
        } else {
          this.pausePointer = true;
        }
      }
    }
    final = Util.round(this.data.left.c);
    if (this.clonesHeight.left + final >= this.scrollHeight.left) {
      this.data.left.t = this.initValue;
      this.data.left.c = this.initValue;
      this.target.left = this.initValue;
    } else if (final <= 0) {
      let end = this.scrollHeight.right - this.clonesHeight.left;
      this.data.left.t = end;
      this.data.left.c = end;
      this.target.left = -end;
    } else {
      if (final !== this.data.left.t) {
        this.updateElements(this.$left, final);
        if (!this.pausePointer && !this.isMobile) {
          this.pausePointer = true;
          this.pointer.style.pointerEvents = 'all';
        }
      } else {
        this.pointer.style.pointerEvents = 'none';
      }
    }
    requestAnimationFrame(this.render);
  }
  updateElements($el, target) {
    this.translate($el, target);
  }
  translate(section, target) {
    section.style.transform = `translate3d(0, ${-target}px, 0)`;
  }
  resize() {
    var wh = window.innerHeight;
    this.isMobile = window.innerWidth <= 1024;
    // this.oneColumn = window.innerWidth < 1024;
    this.oneColumn = false;
    this.spaceDelta = wh * 0.7;
    this.cloneItems();
    this.initScroll();
    this.updateElements(this.$left, this.initValue);
    this.updateElements(this.$right, this.initValue);
  }
}
