import gsap from 'gsap';
import SplitText from 'gsap/SplitText';
import ScrollTrigger from 'gsap/ScrollTrigger'
import ScrollSmoother from 'gsap/ScrollSmoother'

import Util from '../util/util';

export default class Page {
  constructor(options) {
    this.options = options || {};
    this.isMobile = window.innerWidth < 900
    this.init();

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);


    const textAppear = document.querySelectorAll('.text-appear')
    textAppear.forEach( e => {
      gsap.fromTo(e, {
        alpha: 0,
        y: '40px'
      }, {
        alpha: 1,
        duration:1.5,
        delay:1,
        y:0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: e
        },
        onComplete:()=>{
          let line = e.querySelector('.line-animated')
          if(line) {line.classList.add('view')}
        }
      })
    })

    //Aparece Imagen
    const figures = document.querySelectorAll('.figure-appear')
    figures.forEach( e => {
      gsap.fromTo(e, {
        width:0,
        alpha:0
      }, {
        alpha: 1,
        duration:2,
        width:'100%',
        delay:1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: e
        },
        onComplete:()=>{
          
        }
      })
      let im = e.querySelector('img')
      gsap.fromTo(im, {
        scale:1.2,
        alpha:.8
      }, {
        alpha: 1,
        scale:1,
        duration:2,
        delay:1,
        scrollTrigger: {
          trigger: e
        },
      })
    })

    // h2 reveal
    const childSplit = new SplitText(".title-split", {type: "lines"});
    gsap.set(childSplit.lines, {opacity: 0, xPercent: -100});
    ScrollTrigger.batch(childSplit.lines, {
      onEnter: batch => {
        gsap.set(batch, {opacity: 0, xPercent: -100});
        gsap.to(batch, {
          opacity: 1,
          xPercent: 0,
          duration: 1.3,
          ease: "power4", 
          stagger: 0.03
        });
      },
      //onLeaveBack: batch => gsap.to(batch, {opacity: 0, xPercent: -100}),
      start: "bottom 95%"
    });
    //Util.waitForLoader(this.pageReady);

    gsap.set(".ball", {xPercent: -50, yPercent: -50});
    const ball = document.querySelector(".ball");
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };
    const speed = 0.35;

    const xSet = gsap.quickSetter(ball, "x", "px");
    const ySet = gsap.quickSetter(ball, "y", "px");

    window.addEventListener("mousemove", e => {    
      mouse.x = e.x;
      mouse.y = e.y;  
    });

    gsap.ticker.add(() => {
      
      // adjust speed for higher refresh monitors
      const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio()); 
      
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      xSet(pos.x);
      ySet(pos.y);
    });
    this.navAppear()
  }
  init() {
    const overlay = document.getElementById('overlay')
    setTimeout( ()=>{
      overlay.classList.remove('show')
    }, 1000);
    this.innerLink(overlay)
    this.burger()
  }
  navAppear(){
    const body = document.body;
    const menu = document.querySelector(".header_page");
    const scrollUp = "scroll-up";
    const scrollDown = "scroll-down";
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll <= 80) {
        body.classList.remove(scrollUp);
        //gsap.to(menu,{duration:.5,y:'0',ease:'Power3.easeOut'})
        return;
      }
    
      if (currentScroll > lastScroll && !body.classList.contains(scrollDown)) {
        // down
        body.classList.remove(scrollUp);
        body.classList.add(scrollDown);

        gsap.to(menu,{duration:.6,y:'-100%',ease:'Power3.easeOut'})

      } else if (
        currentScroll < lastScroll &&
        body.classList.contains(scrollDown)
      ) {
        // up
        body.classList.remove(scrollDown);
        body.classList.add(scrollUp);
        gsap.to(menu,{duration:.5,y:'0',ease:'Power3.easeOut'})
      }
      lastScroll = currentScroll;
    });
  }
  innerLink(o){
    const innerLink = document.querySelectorAll('.inner-link')
    innerLink.forEach(e => {
      e.addEventListener('click', (event)=>{
        console.log('ale')
        event.preventDefault()
        let url = e.getAttribute('href');
        o.classList.add('show')

        setTimeout( ()=>{
          window.location = url
        }, 1200);
      })
    })
  }
  burger(){
    const burger = document.getElementById('burger')
    const nav = document.querySelector('.header_page--nav')
    if(this.isMobile){
      burger.addEventListener('click', ()=>{
        if(burger.classList.contains('close')){
          gsap.to(nav,{duration:.5,opacity:0,pointerEvents:'none',ease:'Power3.easeOut'})
          burger.classList.remove('close')
          nav.classList.remove('close')
        }else{
          burger.classList.add('close')
          nav.classList.add('close')
          gsap.to(nav,{duration:.5,opacity:1,pointerEvents:'initial',ease:'Power3.easeOut'})

        }
      })
    }
  }
}