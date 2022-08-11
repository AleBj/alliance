import gsap from 'gsap';
import * as d3 from '../../libs/d3.v6.min.js';
import Util from '../util.js';

export default class BarsYears {
  constructor(options){
    this.options = options;

    this.$el = this.options.el;
    this.colors = this.options.colors;
    this.raw = this.options.raw;
    if(this.$el){
      this.init();
    }
  }
  init() {
    this.data = d3.csvParse(this.raw, d3.autoType);
    this.data.forEach(d => {
      const keys = Object.keys(d);
      keys.forEach(k => {
        if(k !== 'name' && k !== 'iso2'){
          d[k] = Number(d[k]) / 1000000;
        }
      });
    });
    this.createColumns();
    this.keys = this.data.columns.slice(1);
    this.mainLabel = this.options.mainLabel || this.keys[0];
    this.currentYear = 'all';
    window.addEventListener('resize', () => {
      this.resize();
    })
    this.resize();
    this.$el.querySelectorAll('.year').forEach(item => {
      item.addEventListener('click', () => {
        this.currentYear = item.getAttribute('data-year');
        const $current = this.$el.querySelector('.year.active');
        if($current) $current.classList.remove('active');
        item.classList.add('active');
        this.draw();
      })
    });    
  }
  intro() {
    this.introDone = true;
    this.draw();
  }
  createColumns() {
    this.data.forEach((d, i) => {
      const $column = document.createElement('div');
      $column.classList.add('column');
      $column.setAttribute('data-code', d.iso2);
      $column.setAttribute('data-index', i);
      $column.setAttribute('title', d.name);
      $column.innerHTML = `
        <div class="column-label">
          <h5>$0</h5>
          <span>million</span>
        </div>
        <div class="column-rectangle">
          <span>${d.name}</span>
        </div>
      `
      this.$el.querySelector('.right').appendChild($column);
    });

    this.$columns = Array.from(this.$el.querySelectorAll('.column'));
  }
  resize() {
    this.columnH = this.$el.querySelector('.right').clientHeight - 70;
    this.columnW = this.$el.querySelector('.right').clientWidth / this.$columns.length - 5;
    this.$el.style.setProperty('--column-width', `${this.columnW}px`);
    if(this.introDone) this.draw();
  }
  draw() {
    const sorted = [...this.data];
    sorted.sort((a, b) => {
      return b[this.currentYear] - a[this.currentYear];
    });
    const max = sorted[0][this.currentYear];
    sorted.forEach((d, i) => {
      const $column = this.$columns.find(c => c.getAttribute('data-code') === d.iso2);
      $column.setAttribute('data-index', i);
      const h = (d[this.currentYear] / max) * this.columnH;
      $column.querySelector('.column-rectangle').style.height = `${h}px`;
      gsap.to($column.querySelector('.column-rectangle span'), {duration: 2, maxWidth: h - 40, ease: 'Power4.easeOut'});

      const label = $column.querySelector('.column-label h5');
      const data = {
        from: Number(label.getAttribute('data-current') || 0),
        to: Number(d[this.currentYear]),
      }
      data.value = data.from

      gsap.fromTo(
        data,
        { value: data.from },
        {
          duration: 2,
          value: data.to,
          snap: { value: 0.6 },
          delay: 0.1 * i,
          ease: 'Power4.easeOut',
          onUpdate: () => {
            label.innerHTML = `$${data.value}`
            label.setAttribute('data-current', data.value)
          },
        }
      )
    });
  }
}