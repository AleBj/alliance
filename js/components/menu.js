import gsap from 'gsap';
import Util from '../util/util';
import InnerScroll from '../components/inner-scroll';
import SplitScroll from '../components/split-scroll';
import countries from '../../assets/data/countries';
import Share from './share';

export default class Menu {
  constructor(){
    new Share();
    this.el = document.getElementById('menu');
    this.isMobile = window.innerWidth <= 1024;

    this.button = document.getElementById('menu-toggle');
    this.navBar = document.getElementById('nav');
    this.bg = document.querySelector('#menu-bg');

    this.sources ={ 
      el:  document.getElementById('sources'),
      bg: document.getElementById('sources-bg'),
      left: document.querySelector('#sources .left'),
      right: document.querySelector('#sources .right'),
      button: document.querySelector('.btDataSource')
    }
    this.issue = {
      el: document.getElementById('menu-issue'),
      bg: document.querySelector('#menu-issue-bg'),
      mask: document.querySelector('#menu-issue-mask'),
      content: document.querySelector('#menu-issue-content'),
      title: document.querySelector('#menu-issue-title'),
    };
    this.data = {
      el: document.getElementById('menu-data'),
      bg: document.querySelector('#menu-data-bg'),
      mask: document.querySelector('#menu-data-mask'),
      content: document.querySelector('#menu-data-content'),
      title: document.querySelector('#menu-data-title'),
    };
    
    this.countries = {
      data: countries.sort((a, b) => a.name.localeCompare(b.name)),
      el: document.getElementById('menu-countries'),
      bg: document.querySelector('#menu-countries-bg'),
      input: document.querySelector('#menu-countries-input input'),
      items: Array.from(document.querySelectorAll('.menu-country')),
      mask: document.querySelector('#menu-countries-mask'),
      content: document.querySelector('#menu-countries-list'),
      title: document.querySelector('#menu-countries-title'),
    };
    this.countries.scroll = new InnerScroll({
      mask: this.countries.mask,
      content: this.countries.content,
    });
    this.countries.scroll.pause = true;

    this.stories = {
      el: document.getElementById('menu-stories'),
      bg: document.querySelector('#menu-stories-bg'),
      items: Array.from(document.querySelectorAll('.menu-story')),
      mask: document.querySelector('#menu-stories-mask'),
      left: document.querySelector('#menu-stories-left'),
      right: document.querySelector('#menu-stories-right'),
      title: document.querySelector('#menu-stories-title'),
    };
    if(!this.isMobile) {
      this.stories.scroll = new SplitScroll({
        el: this.stories.mask,
        left: this.stories.left,
        right: this.stories.right,
      });
    }
    if(this.stories.scroll) this.stories.scroll.pause = true;

    // this.stories.el.setAttribute('data-cursor-bg', '#242831');
    this.stories.mask.setAttribute('data-cursor-bg', 'white');
    // this.countries.el.setAttribute('data-cursor-bg', '#242831');

    this.el.setAttribute('data-cursor-bg', 'white');

    this.button.addEventListener('click', () => { 
      if(this.button.classList.contains('showSources')) {
        this.closeSources()
      }else {
        this.toggle() 
      }
    });
    if(this.sources.button)
    this.sources.button.addEventListener('click', () => { this.openSources() });

    this.items = Array.from(this.el.querySelectorAll('#menu-title, .menu-item, .social-item'));
    if(this.isMobile) {
      this.items = [
        this.el.querySelector('#menu-social'),
        ...this.el.querySelectorAll('#menu-title, .menu-item'),
      ]
    }
    this.overlay = document.getElementById('overlay');
    this.line = document.getElementById('menu-line');
    
    Array.from(document.querySelectorAll(`[data-lang="${Util.getLang()}"]`)).forEach(item => {
      item.classList.add('active');
    });

    /*
    const issueButton = this.el.querySelector('.menu-item[data-menu-open="issue"]');
    issueButton.addEventListener('mouseover', () => {
      if(!this.isMobile) {
        this.openIssue();
      }
    });
    const dataButton = this.el.querySelector('.menu-item[data-menu-open="data"]');
    dataButton.addEventListener('mouseover', () => {
      if(!this.isMobile) {
        this.openData();
      }
    });

    const countriesButton = this.el.querySelector('.menu-item[data-menu-open="countries"]');
    countriesButton.addEventListener('mouseover', () => {
      if(!this.isMobile) {
        this.openCountries();
      }
    });

    const storiesButton = this.el.querySelector('.menu-item[data-menu-open="stories"]');
    storiesButton.addEventListener('mouseover', () => {
      if(!this.isMobile) {
        this.openStories();
      }
    });
    */

    Array.from(this.el.querySelectorAll('.menu-item[href]')).forEach(item => {
      item.addEventListener('click', (e) => {
        const URL = item.href.split('#')[0];
        const hash = item.href.split('#')[1];
        if(hash && URL === window.location.href.replace(/#.*/g, '')) {
          e.preventDefault();
          e.stopImmediatePropagation();
          e.stopPropagation();

          this.overlay.classList.remove('show');
          window.scroll.goTo(`#${hash}`);
          this.close();
        }
      });
    });
    Array.from(document.querySelectorAll('[data-menu-open]')).forEach(item => {
      const name = item.getAttribute('data-menu-open');
      item.addEventListener('click', (e) => {
        if(!(item.closest('.menu-item') && (name == 'issue' || name == 'data'))) {
          e.preventDefault();
          e.stopImmediatePropagation();
          e.stopPropagation();
          if(!this.isOpen) {
            this.open(name)
          }else {
            if(name === 'countries') {
              this.openCountries();
            }
            if(name === 'stories') {
              this.openStories();
            }
          }
        }
      });
    });

    document.querySelector('.arrow-button').addEventListener('click', (e) => {
      const name = document.querySelector('.arrow-button').getAttribute('data-menu-open');
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
      if(!this.isOpen) {
        this.open(name)
      }else {
        if(name === 'countries') {
          this.openCountries();
        }
        if(name === 'stories') {
          this.openStories();
        }
        if(name === 'issue') {
          this.openIssue();
        }
        if(name === 'data') {
          this.openData();
        }
      }
    });

    this.countries.input.addEventListener('keyup', () => {
      this.filterCountries();
    });

    this.issue.title.addEventListener('click', () => {
      this.closeIssue();
    });
    this.data.title.addEventListener('click', () => {
      this.closeData();
    });

    this.countries.title.addEventListener('click', () => {
      this.closeCountries();
    });

    this.stories.title.addEventListener('click', () => {
      this.closeStories();
    });
    this.storiesMouseOver = this.storiesMouseOver.bind(this);
    this.storiesMouseLeave = this.storiesMouseLeave.bind(this);

    window.addEventListener('resize', () => { this.resize() });
    this.fillCountries();
    this.resize();
    this.hide();
  }
  resize() {
    this.winW = window.innerWidth;
    this.winH = window.innerHeight;
    this.isMobile = this.winW <= 1024;

    this.titlesX = Math.max(this.countries.title.clientWidth, this.stories.title.clientWidth, this.data.title.clientWidth, this.issue.title.clientWidth) + 20;

    this.el.querySelector('#menu-title').classList.add('no-opacity', 'no-transform');
    let top = this.el.querySelector('#menu-title').getBoundingClientRect().top;
    this.el.querySelector('#menu-title').classList.remove('no-opacity', 'no-transform');
    if(this.isMobile) top = this.countries.title.clientHeight + 90;
    else this.countries.el.style.paddingTop = `35px`;

    const inputH = this.countries.input.parentElement.clientHeight;
    const maskH = this.winH - top - inputH;
    this.countries.mask.style.height = `${maskH}px`;
    this.countries.maskH = maskH;
    if(this.isMobile) {
      this.countries.bg.style.height = `${this.winH - top + 20}px`;
      this.stories.bg.style.height = `${this.winH - top}px`;

      this.stories.mask.style.height = `${this.winH - top}px`;
    }
    this.updateScrolls();
  }
  toggle(){
    if(this.isOpen) this.close();
    else this.open();
  }
  updateScrolls() {
    this.countries.mask.classList.add('no-opacity', 'no-transform');
    this.countries.scroll.resize();
    this.countries.mask.classList.remove('no-opacity', 'no-transform');

    this.stories.mask.classList.add('no-opacity', 'no-transform');
    if(this.stories.scroll) this.stories.scroll.resize();
    this.stories.mask.classList.remove('no-opacity', 'no-transform');

    if(!this.isMobile) {
      Array.from(this.el.querySelectorAll('.menu-story')).forEach(item => {
        item.removeEventListener('mouseover', this.storiesMouseOver);
        item.removeEventListener('mouseleave', this.storiesMouseLeave);

        item.addEventListener('mouseover', this.storiesMouseOver);
        item.addEventListener('mouseleave', this.storiesMouseLeave);
      });
    }
  }
  storiesMouseOver(e) {
    const item = e.target.closest('.menu-story');
    this.stories.el.setAttribute('data-bg-color', item.getAttribute('data-color'));
  }
  storiesMouseLeave(e) {
    this.stories.el.setAttribute('data-bg-color', 'transparent');
  }
  fillCountries(){
    this.countries.content.innerHTML = '';
    this.countries.data.forEach((item, i) => {
      this.countries.content.innerHTML += `
        <a class="inner-link menu-country" href="./country.html" data-index="${i}">
          <small>${i < 9 ? '0' + (i + 1) : (i + 1)}</small>
          <h5>${item.name}</h5>
        </a>
      `;
    });
    this.countries.items = Array.from(this.countries.content.querySelectorAll('.menu-country'));
    this.countries.max = this.countries.content.scrollHeight;
    this.updateScrolls();
  }
  filterCountries(){
    const filter = this.countries.input.value && this.countries.input.value !== '' && this.countries.input.value.toLowerCase();
    this.countries.items.forEach(item => {
      item.classList.add('hide');
      if(!filter || item.innerText.toLowerCase().indexOf(filter) !== -1) {
        item.classList.remove('hide');
      }
    });
    this.updateScrolls();
  }
  openIssue(){
    this.countries.el.classList.remove('show');
    this.data.el.classList.remove('show');
    this.stories.el.classList.remove('show');

    this.el.querySelector('.menu-item[data-menu-open="issue"]').classList.add('active');
    this.issue.el.classList.add('show');
    this.navBar.classList.add('hide-right');
    gsap.to(this.issue.bg, {duration: 1, y: 0, ease: 'power4.inOut', onComplete: () => {
    }});
    this.closeData();
    this.closeCountries();
    this.closeStories();
    gsap.to(this.issue.title, {duration: 1, x: 0, ease: 'power3.inOut'});
    gsap.to(this.issue.mask, {duration: 1.2, y: 0, opacity: 1, ease: 'power4.inOut'});
  }
  openData(){
    this.countries.el.classList.remove('show');
    this.issue.el.classList.remove('show');
    this.stories.el.classList.remove('show');

    this.el.querySelector('.menu-item[data-menu-open="data"]').classList.add('active');
    this.data.el.classList.add('show');
    this.navBar.classList.add('hide-right');
    gsap.to(this.data.bg, {duration: 1, y: 0, ease: 'power4.inOut', onComplete: () => {
      
    }});
    this.closeIssue();
    this.closeCountries();
    this.closeStories();

    gsap.to(this.data.title, {duration: 1, x: 0, ease: 'power3.inOut'});
    gsap.to(this.data.mask, {duration: 1.2, y: 0, opacity: 1, ease: 'power4.inOut'});
  }
  openCountries(){
    this.data.el.classList.remove('show');
    this.issue.el.classList.remove('show');
    this.stories.el.classList.remove('show');

    this.el.querySelector('.menu-item[data-menu-open="countries"]').classList.add('active');
    this.countries.el.classList.add('show');
    this.navBar.classList.add('hide-right');
    gsap.to(this.countries.bg, {duration: 1, y: 0, ease: 'power4.inOut', onComplete: () => {
      
    }});
    this.closeIssue();
    this.closeData();
    this.closeStories();

    if(!Util.isInViewportDom(this.countries.bg)) {
      this.countries.scroll.scroll(0);
    }
    gsap.to([this.countries.input.parentElement, this.countries.mask], {duration: 1.2, y: 0, ease: 'power4.inOut'});
    gsap.to(this.countries.title, {duration: 1.5, x: 0, ease: 'power3.out'});

    if(this.countries.scroll) this.countries.scroll.pause = false;
  }
  openStories(){
    this.countries.el.classList.remove('show');
    this.el.querySelector('.menu-item[data-menu-open="stories"]').classList.add('active');
    this.stories.el.classList.add('show');
    this.navBar.classList.add('hide-right');
    gsap.to(this.stories.bg, {duration: 1, y: 0, ease: 'power4.inOut', onComplete: () => {
      
    }});
    this.closeIssue();
    this.closeData();
    this.closeCountries();

    if(!Util.isInViewportDom(this.stories.bg)) {
      if(this.stories.scroll) this.stories.scroll.initScroll();
    }
    gsap.to(this.stories.mask, {duration: 1.2, y: 0, ease: 'power4.inOut'});
    gsap.to(this.stories.title, {duration: 1, x: 0, ease: 'power3.out'});
    if(this.stories.scroll) this.stories.scroll.pause = false;
  }
  closeIssue(){
    if(this.issue.scroll) this.issue.scroll.pause = true;
    this.el.querySelector('.menu-item[data-menu-open="issue"]').classList.remove('active');
    this.issue.el.classList.remove('show');
    gsap.to(this.issue.mask, {duration: 1.2, y: this.winH, ease: 'power3.out', overwrite: 'all'});
    gsap.to(this.issue.title, {duration: 1, x: -this.titlesX, ease: 'power3.out', overwrite: 'all'});
    gsap.to(this.issue.bg, {duration: 1, y: this.winH, ease: 'power4.out', overwrite: 'all'});
  }
  closeData(){
    if(this.data.scroll) this.data.scroll.pause = true;
    this.el.querySelector('.menu-item[data-menu-open="data"]').classList.remove('active');
    this.data.el.classList.remove('show');
    gsap.to(this.data.mask, {duration: 1.2, y: this.winH, ease: 'power3.out', overwrite: 'all'});
    gsap.to(this.data.title, {duration: 1, x: -this.titlesX, ease: 'power3.out', overwrite: 'all'});
    gsap.to(this.data.bg, {duration: 1, y: this.winH, ease: 'power4.out', overwrite: 'all'});
  }
  closeStories(){
    if(this.stories.scroll) this.stories.scroll.pause = true;
    this.el.querySelector('.menu-item[data-menu-open="stories"]').classList.remove('active');
    this.stories.el.classList.remove('show');
    gsap.to(this.stories.mask, {duration: 1.2, y: this.winH, ease: 'power3.out', overwrite: 'all'});
    gsap.to(this.stories.title, {duration: 1, x: -this.titlesX, ease: 'power3.out', overwrite: 'all'});
    gsap.to(this.stories.bg, {duration: 1, y: this.winH, ease: 'power4.out', overwrite: 'all'});
  }
  closeCountries(){
    this.countries.scroll.pause = true;
    this.el.querySelector('.menu-item[data-menu-open="countries"]').classList.remove('active');
    this.countries.el.classList.remove('show');
    gsap.to([this.countries.input.parentElement, this.countries.mask], {duration: 1.2, y: this.winH, ease: 'power3.out', overwrite: 'all'});
    gsap.to(this.countries.title, {duration: 1, x: -this.titlesX, ease: 'power3.out', overwrite: 'all'});
    gsap.to(this.countries.bg, {duration: 1, y: this.winH, ease: 'power4.out', overwrite: 'all'});
  }
  openSources(){
    this.button.classList.add('showSources')
    gsap.to(this.sources.button, {duration: .3, autoAlpha: 0, delay: 0.5, ease: 'power3.out'});
    this.sources.el.classList.add('show')
    gsap.to(this.sources.bg, {duration: 0.8, y: 0, ease: 'power4.inOut'});
    gsap.to(this.sources.left, {duration: 0.8, y: 0, ease: 'power3.inOut'});
    gsap.to(this.sources.right, {duration: 0.8, y: 0, ease: 'power3.inOut'});
  }
  closeSources(){
    this.button.classList.remove('showSources')
    this.sources.el.classList.remove('show')
    gsap.to(this.sources.bg, {duration: 0.8, y: this.winH, ease: 'power4.out', overwrite: 'all'});
    gsap.to(this.sources.left, {duration: 0.8, y: this.winH, ease: 'power3.out', overwrite: 'all'});
    gsap.to(this.sources.right, {duration: 0.8, y: this.winH, ease: 'power3.out', overwrite: 'all'});
    gsap.to(this.sources.button, {duration: .3, autoAlpha: 1, ease: 'power3.out', overwrite: 'all'});
  }
  open(section, keepScrolling){
    if(document.getElementById('nav-back')) document.getElementById('nav-back').style.display = 'none'
    if(this.isOpen) return;
    // if(!keepScrolling)
      window.scroll.pause();
    this.isOpen = true;
    this.button.classList.add('close', keepScrolling ? 'keep-scrolling' : undefined);
    this.navBar.classList.add('menu-open');
    this.el.classList.add('show');

    gsap.to(this.sources.button, {duration: .3, autoAlpha: 1, ease: 'power3.out'});
    if(!keepScrolling)
      gsap.to(this.bg, {duration: 0.8, y: 0, ease: 'power4.inOut'});
    gsap.to(this.items, {duration: 1.5, y: 0, stagger: 0.05, delay: 0.1, ease: 'power3.out'});
    gsap.to(this.line, {duration: 1, y: 0, ease: 'power3.out'});
    if(section === 'countries') {
      this.openCountries();
    }
    if(section === 'stories') {
      this.openStories();
    }
    if(section === 'issue') {
      this.openIssue();
    }
    if(section === 'data') {
      this.openData();
    }
  }
  close(keepScrolling){    
    if(document.getElementById('nav-back')) document.getElementById('nav-back').style.display = 'flex'
    if(!this.isOpen) return;
    gsap.killTweensOf([
      ...this.items,
      this.bg,
    ])
    this.isOpen = false;
    this.countries.scroll.pause = true;
    if(this.stories.scroll) this.stories.scroll.pause = true;

    gsap.to(this.line, {duration: 1, y: this.winH, ease: 'power3.out', overwrite: 'all'});
    gsap.to([...this.items].reverse(), {duration: 1, y: this.winH, stagger: 0.01, delay: 0.05, ease: 'power3.out'});

    this.closeCountries();
    this.closeStories();
    this.closeData();
    this.closeIssue();
    this.closeSources();
    gsap.to(this.sources.button, {duration: .3, autoAlpha: 0, ease: 'power3.out', overwrite: 'all'});

    gsap.to(this.bg, {duration: 0.8, y: this.winH, delay: 0.3, ease: 'power4.out', onComplete: () => {
      this.navBar.classList.remove('menu-open', 'hide-right');
      //if(!keepScrolling)
        window.scroll.play();
    }});
    this.button.classList.remove('close', 'keep-scrolling');
    this.el.classList.remove('show');
  }
  hide(){
    const y = [
      ...this.items,
      this.bg,
      this.line,
      this.countries.bg,
      this.countries.input.parentElement,
      this.countries.mask,
      this.stories.bg,
      this.stories.mask,
      this.issue.bg,
      this.issue.mask,
      this.data.bg,
      this.data.mask,
    ];
    const x = [
      this.countries.title,
      this.stories.title,
      this.issue.title,
      this.data.title,
    ]
    gsap.set(x, {x: -this.titlesX});
    gsap.set(y, {y: this.winH});
  }
}