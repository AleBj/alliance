/* Home 👇 */
import '../../sass/pages/home.page.scss';

import Util from '../util/util';
import Page from './page';
import gsap from 'gsap/all';
import Slider from '../components/slider';
import SplitText from 'gsap/SplitText';
import ScrollTrigger from 'gsap/ScrollTrigger'
import ScrollSmoother from 'gsap/ScrollSmoother'

export default class Home extends Page {
  constructor() {
    super();
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

    const smoother = ScrollSmoother.create({
      smooth: 3,
      effects: true,
      //normalizeScroll: true,
      smoothTouch: 0.1,
    });
    
    new Slider(document.querySelector('.hero-slider'))

   


  }
  pageReady() {
    super.pageReady();;

  }
  
  
}
new Home();