/* Home 👇 */
import '../../sass/pages/home.page.scss';

import NormalizeWheel from 'normalize-wheel';

import Util from '../util/util';
import Page from './page';
import gsap from 'gsap/all';
import SplitText from 'gsap/SplitText';
import ScrollTrigger from 'gsap/ScrollTrigger'
import ScrollSmoother from 'gsap/ScrollSmoother'

export default class Home extends Page {
  constructor() {
    super();
    
    // gsap.registerPlugin(SplitText);

    // var tl = gsap.timeline(),
    //   mySplitText = new SplitText("#quote", { type: "words,chars" }),
    //   chars = mySplitText.chars; //an array of all the divs that wrap each character

    // gsap.set("#quote", { perspective: 400 });

    // console.log(chars);

    // tl.from(chars, {
    //   duration: 0.8,
    //   opacity: 0,
    //   scale: 0,
    //   y: 80,
    //   rotationX: 180,
    //   transformOrigin: "0% 50% -50",
    //   ease: "back",
    //   stagger: 0.01
    // });

    // document.getElementById("animate").onclick = function () {
    //   tl.restart();
    // };

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const smoother = ScrollSmoother.create({
      smooth: 3,
      effects: true,
    // normalizeScroll: true,
      smoothTouch: 0.1,
    });

    let paths = gsap.utils.toArray("#logo-scroll path, #logo-smoother path, #logo-mouse");
    let byGreensock = document.querySelector("#by-greensock");

    let distPaths = gsap.utils.distribute({
      base: -300,
      amount: 600,
    });

    let logoTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".logo-section",
        scrub: 1,
        start: "bottom 95%",
        end: "bottom center"
      }
    });

    logoTl.to(paths, { x: distPaths })
      .to([...paths, byGreensock], { opacity: 0 }, 0)

    let gridTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".grid-section",
        scrub: 1,
        start: "top center",
        end: "bottom+=10% bottom",
      },
      defaults: {
        ease: "power1.inOut"
      }
    });

    gridTl.add("start")
      .from(".grid-layout", {
        ease: "power1",
        scale: 3
      }, "start")
      .from(".column-1 .grid-image", {
        duration: 0.6,
        xPercent: i => -((i + 1) * 40 + i * 100),
        yPercent: i => (i + 1) * 40 + i * 100
      }, "start")
      .from(".column-3 .grid-image", {
        duration: 0.6,
        xPercent: i => (i + 1) * 40 + i * 100,
        yPercent: i => (i + 1) * 40 + i * 100
      }, "start");

    gsap.from(".parallax-section", {
      scale: 1/3,
      scrollTrigger: {
        trigger: ".parallax-section",
        scrub: 1
      }
    });

    let pinSection = document.querySelector(".pin-section")
    let pinContent1 = document.querySelector(".pin-content-1")
    let pinContent2 = document.querySelector(".pin-content-2")

    let pinTl = gsap.timeline({
      scrollTrigger: {
        pin: true,
        trigger: pinSection,
        scrub: true,
        start: "top top",
        end: () => `$+=${pinContent1.offsetWidth}`,
        invalidateOnRefresh: true
      }
    });

    pinTl.fromTo(".pin-content-1", {
      x: () => document.body.clientWidth * 0.9
    }, {
      x: () => -(pinContent1.offsetWidth),
      ease: "none"
    }, 0)

    pinTl.fromTo(".pin-content-2", {
      x: () => -pinContent2.offsetWidth + document.body.clientWidth * 0.1
    }, {
      x: () => document.body.clientWidth, 
      ease: "none"
    }, 0);

  }
  pageReady() {
    super.pageReady();
    console.log('Home page ready');
  }
  
}
new Home();