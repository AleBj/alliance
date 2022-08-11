/* eslint-disable */
import { gsap } from 'gsap';

export default class DropDowns {
  constructor($el){
    this.$el = $el
    this.tooltip = $el.querySelector('.graph_country--tooltip')
    this.bars = [...$el.querySelectorAll('.bar')]
    this.offset = $el.getBoundingClientRect()

    this.bars.forEach(e =>{
      e.addEventListener('mouseover', n => {
        let text = e.dataset.tooltip
        if(text){ 
          this.tooltip.innerText = text
          this.handlerHover(n,this.tooltip,this.offset)
        }

      })
      e.addEventListener('mouseout', n => {
        this.handlerHover(n,this.tooltip,this.offset)
      })

      
      //e.onmouseover = e.onmouseout = this.handler;
    })
    this.$el.addEventListener('scroll', () => {
      this.hideTooltip(this.tooltip);
    })
  }
  showTooltip(e){
    gsap.to(e,{duration:1,opacity:1,y:-20,delay:.1,ease:'Power3.easeOut'})
  }
  hideTooltip(e){
    gsap.to(e,{duration:.6,opacity:0,delay:.1,y:20,ease:'Power3.easeOut'})
  }
  handlerHover(event,t,o) {
    let x = event.pageX 
    let y = event.pageY

    //windows
    let vwOff = window.innerWidth * .6

    if (event.type == 'mouseover') {
      
      if(x > vwOff){
        t.style.left = `${x - o.x - 400}px`
      }else{
        t.style.left = `${x - o.x}px`
      }
      t.style.top = `${y - 300}px`

      console.log(t)
      this.showTooltip(t,y)
      
    }
    if (event.type == 'mouseout') {
      this.hideTooltip(t)
    }
  }
}



