/* Home 👇 */
import '../../sass/pages/contact.page.scss';

import Util from '../util/util';
import Page from './page';
import gsap from 'gsap/all';
import SplitText from 'gsap/SplitText';
import ScrollTrigger from 'gsap/ScrollTrigger'
import ScrollSmoother from 'gsap/ScrollSmoother'

export default class Contact extends Page {
  constructor() {
    super();
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const smoother = ScrollSmoother.create({
      smooth: 3,
      effects: true,
      //normalizeScroll: true,
      smoothTouch: 0.1,
    });
    this.send();
  }
  pageReady() {
    super.pageReady();
  }
  send(){
    
    const form = document.getElementById('form-contact');
    
    if(form){
      form.onsubmit = (e)=>{
        e.preventDefault()
          let inputs = form.querySelectorAll('input')
          let textarea = form.querySelector('textarea')
          let select = form.querySelector('select')
          let data = new FormData()
          inputs.forEach(e => {
            data.append(e.name,e.value)
          })
          data.append(textarea.name,textarea.value)
          data.append(select.name,select.value)

          fetch('./assets/data/send-contacto.php', {
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
              const content = document.querySelector('.bodyContact__cols.form')
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
  
}
new Contact();