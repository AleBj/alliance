/* Home 👇 */
import '../../sass/pages/about.page.scss';

import Util from '../util/util';
import Page from './page';
import gsap from 'gsap/all';
import SplitText from 'gsap/SplitText';
import TimelineMax from 'gsap/all'
import ScrollTrigger from 'gsap/ScrollTrigger'
import ScrollSmoother from 'gsap/ScrollSmoother'

export default class About extends Page {
  constructor() {
    super();
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

    //Menu
    const menu = document.querySelector(".header_page");
    const bt = document.querySelector(".heroAbout .button-single")
    const popup = document.getElementById('popup')
    const iframe = document.getElementById('iframe')
    const closepopup = document.getElementById('popup-close')
    const line = document.querySelector('.join .line-animated')

    gsap.to(line, {
      scrollTrigger: line,
      onComplete:()=>{
        setTimeout(()=>{
          line.classList.add('view')
        }, 1500)
        
      }
    });

    bt.addEventListener('click', (e)=>{
      e.preventDefault()
      let code = bt.dataset.video
      iframe.src = `https://www.youtube.com/embed/${code}`
      popup.style.zIndex = 99;
      gsap.to(popup,{duration:.5,pointerEvents:'initial',opacity:1,ease:'Power3.easeOut'})
    })
    closepopup.addEventListener('click', (e)=>{
      e.preventDefault()
      iframe.src = ''
      
      gsap.to(popup,{duration:.5,pointerEvents:'none',opacity:0,ease:'Power3.easeOut',onComplete:()=>{
        popup.style.zIndex = -99;
      }})
    })
    popup.addEventListener('click', (e)=>{
      e.preventDefault()
      iframe.src = ''
    
      gsap.to(popup,{duration:.5,pointerEvents:'none',opacity:0,ease:'Power3.easeOut',onComplete:()=>{
        popup.style.zIndex = -99;
      }})
    })

    gsap.set(bt, {opacity:0,y:40})
    gsap.fromTo(menu, {y:-100},{duration:2,y:0,delay:2.5,ease:'Power3.easeOut'})

    setTimeout(()=>{
      document.querySelector('.heroAbout__image').classList.remove('biggest')    
      //title
      new SplitText("h1", { type: "lines", linesClass: "lineChild" });
      new SplitText("h1", { type: "lines", linesClass: "lineParent" });
      gsap.fromTo(".lineChild", {y:90},{duration:.6,y:-10,stagger:0.2, delay:2,ease:'power3.easeOut'});
      gsap.to(bt,{duration:1,opacity:1,y:0,delay:3,ease:'Power3.easeOut'})
    }, 1500)

    const smoother = ScrollSmoother.create({
      smooth: 3,
      effects: true,
      //normalizeScroll: true,
      smoothTouch: 0.1,
    });
    this.rotator()
  }
  pageReady() {
    super.pageReady();
  }
  rotator(){
    const words = document.querySelectorAll('.innovation__title > strong')

    let index = 0
    if(words){
      let interval = setInterval(()=>{
        
        if(index < words.length){
          gsap.to(words,{duration:1,y:40,opacity:0,ease:'Power3.easeOut'})
          gsap.to(words[index],{duration:1,y:0,opacity:1,ease:'Power3.easeOut'})
          index ++
        }else{
          index = 0
        }
      }, 1000)
    }
  }
  
}
new About();