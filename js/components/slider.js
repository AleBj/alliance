/* eslint-disable */
import gsap from 'gsap';
import sliders from '../../assets/data/sliders.json'

export default class Slider {
  constructor(el){
    this.el = el;
    this.data = sliders
    this.bar = el.querySelector('.hero--blackstrip-bar')
    this.title = el.querySelector('.title-h1')
    this.text = el.querySelector('.hero--blackstrip p')
    this.btred = el.querySelector('.hero--button-red')
    this.cta = el.querySelector('.hero--button-red span')
    this.arrow = el.querySelector('.hero--button-red svg')
    this.contentImages = el.querySelector('.hero--images')
    this.time = 6
    this.currentSlide = 0;
    this.startSlider = null

    this.init();
  }
  init(){
    this.title.innerHTML = this.data[0].title
    this.text.innerHTML = this.data[0].text
    this.cta.innerHTML = this.data[0].cta
    this.setLink(this.data[0].link)    
    this.initImage(this.data)
    
    this.start();
    this.btred.addEventListener('click', ()=>{
      let link = this.btred.dataset.link
      const overlay = document.getElementById('overlay')
      overlay.classList.add('show')

      setTimeout( ()=>{
        window.location = link
      }, 1200);
    })
    this.btred.addEventListener('mouseenter',() => this.stop())
    this.btred.addEventListener('mouseleave',() => this.start())
  }
  start(){
    this.startSlider =  setInterval(()=>this.changeSlide(this.currentSlide), (this.time * 1000))
    this.initBar()
  }
  stop() {
    clearTimeout(this.startSlider);
    console.log('stop')
  }
  initImage(data){
    data.forEach((e,i)=> {
      if(e.image == ''){
        let video = document.createElement('video')
        video.setAttribute('src', e.video)
        video.setAttribute('autoplay','autoplay')
        video.setAttribute('muted','muted')
        video.setAttribute('playsinline','playsinline')
        video.setAttribute('loop',true)
        video.classList.add(`image`)
        video.classList.add(`image-${i}`)
        if(i == 0) video.classList.add('active')
        video.muted = 'muted'
        this.contentImages.appendChild(video)
        this.playVideo()
      }else{
        let img = document.createElement('img')
        img.setAttribute('src', e.image)
        img.classList.add(`image`)
        img.classList.add(`image-${i}`)
        if(i == 0) img.classList.add('active')
        this.contentImages.appendChild(img)
      }
    });
  }
  playVideo(){
    let video = document.querySelector('.hero--images video')
    video.play()
  }
  initBar(){
    gsap.fromTo(this.bar,{
      width:0,
    },
    {
      duration:this.time,
      width:'100%',
      ease:'Power4.linear'
    })
  }
  changeSlide(){
    this.currentSlide++
    (this.currentSlide > (this.data.length - 1)) ? this.currentSlide = 0 : this.currentSlide

    this.changeCopy(this.title,this.data[this.currentSlide].title, .05)
    this.changeCopy(this.text,this.data[this.currentSlide].text, .1)
    this.changeCopy(this.cta,this.data[this.currentSlide].cta, .15)
    this.setLink(this.data[this.currentSlide].link)
    
    let imgs = this.contentImages.querySelectorAll('.image')
    imgs.forEach(n => n.classList.remove('active'))
    imgs[this.currentSlide].classList.add('active')

    this.initBar()
  }
  changeCopy(e,t,delay){
    gsap.to(e,{y:20,opacity:0,duration:.8,delay,ease:'Power3.easeOut',onComplete:()=>{
      e.innerHTML = t
      gsap.to(e,{y:0,opacity:2,duration:.8,delay,ease:'Power3.easeOut'})
    }})
    gsap.to(this.arrow,{y:0,opacity:0,duration:.8,delay:.15,ease:'Power3.easeOut',onComplete:()=>{
      gsap.to(this.arrow,{y:0,opacity:2,duration:.8,delay:.15,ease:'Power3.easeOut'})
    }})
  }
  setLink(link){
    this.btred.setAttribute('data-link',link)
  }
}