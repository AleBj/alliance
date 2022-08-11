/* Home 👇 */
import '../../sass/pages/sustainability.page.scss';

import Util from '../util/util';
import Page from './page';
import gsap from 'gsap/all';
import SplitText from 'gsap/SplitText';
import ScrollTrigger from 'gsap/ScrollTrigger'
import ScrollSmoother from 'gsap/ScrollSmoother'

export default class Sustainability extends Page {
  constructor() {
    super();
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    if(this.isMobile){
      document.querySelectorAll("[data-speed]").forEach(e =>{
        e.dataset.speed = 0
      })
    }
    //Menu
    const menu = document.querySelector(".header_page");
    gsap.fromTo(menu, {y:-100},{duration:2,y:0,delay:2.5,ease:'Power3.easeOut'})

    setTimeout(()=>{
      document.querySelector('.heroAbout__image').classList.remove('biggest')    
      //title
      new SplitText("h1", { type: "lines", linesClass: "lineChild" });
      new SplitText("h1", { type: "lines", linesClass: "lineParent" });
      gsap.fromTo(".lineChild", {y:90},{duration:.6,y:-3,stagger:0.2, delay:2,ease:'power3.easeOut'});
    }, 1500)

    const smoother = ScrollSmoother.create({
      smooth: 3,
      effects: true,
      //normalizeScroll: true,
      smoothTouch: 0.1,
    });
  }
  pageReady() {
    super.pageReady();
  }
  
}
new Sustainability();