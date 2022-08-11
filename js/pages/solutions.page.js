/* Home 👇 */
import '../../sass/pages/solutions.page.scss';

import Util from '../util/util';
import Page from './page';
import gsap from 'gsap/all';
import SplitText from 'gsap/SplitText';
import ScrollTrigger from 'gsap/ScrollTrigger'
import ScrollSmoother from 'gsap/ScrollSmoother'

export default class Solutions extends Page {
  constructor() {
    super();

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
    //Menu
    const menu = document.querySelector(".header_page");
    gsap.fromTo(menu, {y:-100},{duration:2,y:0,delay:2.5,ease:'Power3.easeOut'})

    setTimeout(()=>{
      document.querySelector('.heroSolutions__image').classList.remove('biggest')    
      //title
      new SplitText("h1", { type: "lines", linesClass: "lineChild" });
      new SplitText("h1", { type: "lines", linesClass: "lineParent" });
      gsap.fromTo(".lineChild", {y:90},{duration:.6,y:-10,stagger:0.2, delay:2,ease:'power3.easeOut'});
    }, 1500)



    const smoother = ScrollSmoother.create({
      smooth: 3,
      effects: true,
      //normalizeScroll: true,
      smoothTouch: 0.1,
    });

    if(!this.isMobile){
      gsap.to(".numbers__detail--fix",{
        scrollTrigger:{
            trigger: ".numbers",
            // start: "100px top",
            end: "bottom 750px",
            markers: false,
            pin: ".numbers__detail--fix",
            pinSpacing: false
        },
      });
    }

    this.play()
    let topStart = window.innerHeight;
    (topStart < 700) ? topStart = topStart + 100 : topStart
    // h2 reveal
    const childSplit = new SplitText(".title-split-solutions", {type: "lines"});
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
      //start: "bottom 50%"
      start: `top ${topStart / 2}`
    });
    const textSolutions = document.querySelectorAll('.numbers__blocks--box p')
    gsap.set(textSolutions, {opacity: 0, y: 100});
    ScrollTrigger.batch(textSolutions, {
      onEnter: batch => {
        gsap.set(batch, {opacity: 0, y: 100});
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 1.3,
          ease: "power4", 
          stagger: 0.03
        });
      },
      //onLeaveBack: batch => gsap.to(batch, {opacity: 0, xPercent: -100}),
      //start: "top 60%"
      start: `top ${topStart / 2}`
    });
    
    this.send();
  }
  pageReady() {
    super.pageReady();
  }
  send(){
    
    const form = document.getElementById('form-solutions');
    
    if(form){
      form.onsubmit = (e)=>{
        e.preventDefault()
          let inputs = form.querySelectorAll('input')
          let textarea = form.querySelector('textarea')
          let data = new FormData()
          inputs.forEach(e => {
            data.append(e.name,e.value)
          })
          data.append(textarea.name,textarea.value)

          fetch('./assets/data/send.php', {
            method: 'POST',
            body: data
          })
          // (C) RETURN SERVER RESPONSE AS TEXT
          .then((result) => {
            if (result.status != 200) { throw new Error("Bad Server Response");}
            return result.text();
          })
         
          // (D) SERVER RESPONSE
          .then((response) => {
            console.log(response);
            if(response == 'OK'){
              const content = document.querySelector('.contact__form')
              let div = document.createElement('div')
              div.classList.add('message-ok')
              div.innerText = 'Mensaje enviado con éxito!'
              content.appendChild(div)
    
              gsap.to(form,{duration:.5,pointerEvents:'none',opacity:0,ease:'Power3.easeOut'})
    
              gsap.to(div,{duration:.5,delay:1,opacity:1,ease:'Power3.easeOut'})
            }
          })
         
          // (E) HANDLE ERRORS - OPTIONAL
          .catch((error) => { console.log(error); console.log(body);});
         
          // (F) PREVENT FORM SUBMIT
          return false;
      }
    }
  }
  play(){      
    let imagesDetails = document.querySelectorAll('.images-sliders')
    let index = 0
    if(imagesDetails){
      let interval = setInterval(()=>{
        
        if(index < imagesDetails.length){
          gsap.to(imagesDetails,{duration:1,opacity:0,ease:'Power3.easeOut'})
          gsap.to(imagesDetails[index],{duration:1,opacity:1,ease:'Power3.easeOut'})
          index ++
        }else{
          index = 0
        }
      }, 3000)
    }

  }
  
  
}
new Solutions();