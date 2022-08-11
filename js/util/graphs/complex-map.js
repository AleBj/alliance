import axios from 'axios';
import gsap from 'gsap';
import * as d3 from '../../libs/d3.v6.min.js';
import Util from '../util.js';

const DEFAULT_LEGENDS = {
  PERCENT: [
    {
      "text": "75% - 100%"
    },
    {
      "text": "50% - 74%"
    },
    {
      "text": "25% - 49%"
    },
    {
      "text": "0% - 24%"
    },
    {
      "text": "Data unavailable"
    }
  ],
  RANGE : [
    {
      "text": "751 - 900",
    },
    {
      "text": "451 - 600"
    },
    {
      "text": "0 - 150"
    },
  ],
  EFFORT : [
    {
      "text": "Extensive",
    },
    {
      "text": "Limited"
    },
    {
      "text": "None"
    },
    {
      "text": "Data unavailable"
    }
  ],
};
export default class ComplexMap {
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
    this.$legends = document.querySelector('#legends');
    this.$tooltip = document.querySelector('#tooltip');

    this.currentIndicator = null;
    this.currentFilters = [];

    this.data = this.raw;
    
    this.keys = Object.keys(this.data[0]);
    this.mainLabel = this.options.mainLabel || this.keys[0];
    axios.get('./assets/data/world-2.svg').then(res => {
      this.HTML = res.data;
      window.addEventListener('resize', () => {
        this.resize();
      })
      this.resize();
      document.addEventListener('click', e => {
        if(e.target.closest('.country') === null && e.target.closest('#tooltip') === null) {
          this.hideTooltip();
        }
      });
      document.addEventListener('keydown', e => {
        if(e.key === 'Escape') {
          this.hideTooltip();
        }
      });
      this.$tooltip.addEventListener('click', e => {
        this.hideTooltip();
      });
    });
  }
  resize() {
    this.width = Math.min(this.$el.clientWidth, window.innerHeight * 1.7);
    this.height = this.width * 0.55;

    this.margin = {top: 0, right: 0, bottom: 0, left: 0};

    this.fs = 14;

    this.svgSize = {width: this.width, height: this.height};
    this.draw()
  }
  draw() {
    this.$el.innerHTML = '';
    this.$el.innerHTML = this.HTML;
    this.viewBoxRatio = Number(this.$el.querySelector('svg').getAttribute('viewBox').split(' ')[2]) / this.width;
    const svg = d3.select(this.$el).select('svg')
      .attr('width', this.svgSize.width);

    this.$el.style.setProperty('--scale', 1);
    this.mainGroup = svg.append('g').attr('class', 'main-group');
    this.mainGroup.append('rect').attr('class', 'background').attr('width', '100%').attr('height', '100%');
    this.$el.querySelector('.main-group').append(...this.$el.querySelectorAll('path'))
    this.$el.querySelectorAll('path').forEach(path => {
      if(path.getAttribute('data-code') && path.getAttribute('data-code').length === 2) {
        path.classList.add('country');
        path.style.stroke = '#242831';
        path.style.strokeWidth = 1;
        path.setAttribute('fill', this.colors.default);
        this.$el.addEventListener('mouseover', (e) => {
          this.hideTooltip()
        })
        path.addEventListener('mouseover', (e) => {
          e.stopPropagation();
          // path.style.filter = 'brightness(2.4)'
          if(!this.dragging)
            this.showTooltip(path.getAttribute('data-code'), e.clientX, e.clientY, path.getBoundingClientRect());
          
        })        
        path.addEventListener('mouseout', (e) => {
          path.style.filter = 'brightness(1)'
        });
        path.addEventListener('click', (e) => {
          if(!Util.isTouch()) {
            e.stopPropagation();
            const code = path.getAttribute('data-code');
            const data = this.data.find(country => country.iso2 === code);
            if(data) {
              location.href = `./country.html?code=${code}`;
            }
          }
        }) 
      }else if(path.getAttribute('stroke-dasharray')){
        path.classList.add('dashed');
        path.setAttribute('fill', 'none');
      }else {
        path.classList.add('island');
        path.setAttribute('fill', this.colors.default);
      }
    });
    this.mainGroup.call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

    zoomIn()
    zoomOut()


    let isMobile = window.innerWidth < 800
    let width = document.querySelector('#right').clientWidth * 2
    let height = document.querySelector('#right').clientHeight * 2
    let scaleM = 1
    let currentTransform
    const self = this;
    function zoomIn(){
      const zoomIn = document.querySelector('.button-zoom__in')
      zoomIn.addEventListener('click', ()=>{

        scaleM < 3 ? scaleM += .5 : scaleM = 3   

        self.$el.style.setProperty('--scale', scaleM);
        let x = (self.width / 2 - self.width / 2 * scaleM) * self.viewBoxRatio;
        let y = (self.height / 2 - self.height / 2 * scaleM) * self.viewBoxRatio;

        let translate = [x, y];
        

        const transform = d3.zoomIdentity
          .translate(translate[0], translate[1])
          .scale(scaleM);
        currentTransform = transform;
        self.mainGroup
          .transition()
          .duration(500)
          .ease(d3.easeCubicOut)
          .attr('transform', transform);
      })

    }
    function zoomOut(){
      const zoomIn = document.querySelector('.button-zoom__out')
      zoomIn.addEventListener('click', ()=>{

        scaleM > 1 ? scaleM -= .5 : scaleM = 1    
        self.$el.style.setProperty('--scale', scaleM);
        
        let x = (self.width / 2 - self.width / 2 * scaleM) * self.viewBoxRatio;
        let y = (self.height / 2 - self.height / 2 * scaleM) * self.viewBoxRatio;

        let translate = [x, y];
        
        const transform = d3.zoomIdentity
          .translate(translate[0], translate[1])
          .scale(scaleM);
        currentTransform = transform;

        self.mainGroup
          .transition()
          .duration(1000)
          .ease(d3.easeCubicOut)
          .attr('transform', transform);
      })
    }
    function isMobileFn(){
      scaleM = 3   

      self.$el.style.setProperty('--scale', scaleM);
      let x = (self.width / 2 - self.width / 2 * scaleM) * self.viewBoxRatio;
      let y = (self.height / 2 - self.height / 2 * scaleM) * self.viewBoxRatio;

      let translate = [x, y];

      const transform = d3.zoomIdentity
        .translate(translate[0], translate[1])
        .scale(scaleM);
      currentTransform = transform;
      
      self.mainGroup
        .transition()
        .duration(200)
        .ease(d3.easeCubicOut)
        .attr('transform', transform);
    }

    if(isMobile) isMobileFn()

    function dragstarted() {
      self.dragging = true;
      self.hideTooltip();
      svg.raise();
      svg.attr("cursor", "grabbing");
    }
  
    function dragged(event, d) {
      let x, y;
      if(currentTransform && scaleM > 1) {
        const xMax = 0;
        const yMax = 0;
        let xMin = -self.width * scaleM * self.viewBoxRatio / 2;
        let yMin = -self.height * scaleM * self.viewBoxRatio / 2;

        if(isMobile) {
          xMin += xMin * 0.13 * scaleM;
        }
        x = -event.dx;
        y = -event.dy;

        if(currentTransform.x - x > xMax) {
          x = xMax - currentTransform.x;
        }
        if(currentTransform.x - x < xMin) {
          x = xMin - currentTransform.x;
        }
        if(currentTransform.y - y > yMax) {
          y = yMax - currentTransform.y;
        }
        if(currentTransform.y - y < yMin) {
          y = yMin - currentTransform.y;
        }

        let moveY = currentTransform.y -= y;
        let moveX = currentTransform.x -= x;

        let translate = [moveX,  moveY];
        const transform = d3.zoomIdentity
          .translate(translate[0], translate[1])
          .scale(scaleM);

        self.mainGroup
          .transition()
          .duration(500)
          .ease(d3.easeCubicOut)
          .attr('transform', transform);
      }
      
    }
  
    function dragended() {
      self.dragging = false;
      svg.attr("cursor", "grab");
    };
  }
  selectIndicator(indicator) {
    if(indicator){
      this.currentIndicator = indicator;
      document.getElementById('filters').classList.remove('none')
    }
    else {
      this.currentIndicator = null;
      document.getElementById('filters').classList.add('none')
    }
    this.updateMap();
  }
  updateMap() {
    if(this.currentIndicator) {
      let legends;
      if(this.currentIndicator.legends) {
        legends = this.currentIndicator.legends;
      }else {
        if(this.currentIndicator.legends_rule === 'range') {
          legends = DEFAULT_LEGENDS.RANGE;
        }else if(this.currentIndicator.legends_rule === 'match') {
          legends = DEFAULT_LEGENDS.EFFORT;
        }else {
          legends = DEFAULT_LEGENDS.PERCENT;
        }
      }
      const finalLegends = this.getLegendsColors(legends);
      if(this.currentIndicator.name == 'Resourcing'){
        this.$legends.querySelector('#legends-title').innerHTML = 'Total GBV resourcing';
        this.$legends.querySelector('#legends-bottom').innerHTML = '';
        this.$legends.querySelector('#legends-bottom').innerHTML = finalLegends.map((l,index) => {
          return `<div class="legend-item" data-type="${l.type}">
            <div class="legend-item-color" style="background-color: ${l.color};"></div>
            <span class="legend-item-text">${(index == 0) ? this.currentIndicator.title : l.text}</span>
          </div>`
        }).join('');

      }else{
        this.$legends.querySelector('#legends-title').innerHTML = this.currentIndicator.legends_title || this.currentIndicator.title;
        this.$legends.querySelector('#legends-bottom').innerHTML = '';
        this.$legends.querySelector('#legends-bottom').innerHTML = finalLegends.map(l => {
          return `<div class="legend-item" data-type="${l.type}">
            <div class="legend-item-color" style="background-color: ${l.color};"></div>
            <span class="legend-item-text">${l.visual || l.text}</span>
          </div>`
        }).join('');
      }
      this.$el.querySelectorAll('.country, .island').forEach(country => {
        const code = country.getAttribute('data-code');
        const data = this.data.find(country => country.iso2 === code);
        let color = this.colors.black;
        if(data) {
          let keyData = data[this.currentIndicator.key];
          if(this.currentIndicator.legends_rule === 'programme'){
            const programme = (this.currentIndicator.legends[0].text).toLowerCase().trim();
            color = this.colors.scales[this.colors.scales.length - 1];
            if(data.GlobProg1.toLowerCase().trim() !== programme && data.GlobProg2.toLowerCase().trim() !== programme && data.GlobProg3.toLowerCase().trim() !== programme && data.GlobProg4.toLowerCase().trim() !== programme) {
              color = data.GBV_programmes.toLowerCase().trim() === 'yes' ? this.colors.black : this.colors.black;
            }
          }
          else if(keyData) {
            color = this.getCountryColor(keyData, this.currentIndicator.legends_rule, legends);
          }
          if(this.currentIndicator.legends_rule === 'match' && (!keyData || keyData.trim() === '')) {
            color = data.GBV_programmes.toLowerCase().trim() === 'yes' ? this.colors.black : this.colors.black;
          }
          if(this.currentFilters.length > 0) {
            this.currentFilters.forEach(filter => {
              if(filter.type === 'By programme') {
                const programme = (filter.key || filter.title).toLowerCase().trim();
                if(data.GlobProg1.toLowerCase().trim() !== programme && data.GlobProg2.toLowerCase().trim() !== programme && data.GlobProg3.toLowerCase().trim() !== programme && data.GlobProg4.toLowerCase().trim() !== programme) {
                  color = this.colors.default;
                }
              }
              else if(filter.type.toLowerCase() === 'filter by context') {
                const context = (filter.key || filter.title).toLowerCase().trim();
                const keyValue = data.context.toLowerCase().trim();
                switch (context) {
                  case 'critical humanitarian needs':
                    if(keyValue !== 'top humanitarian requirements') {
                      color = this.colors.default;
                    }
                    break;
                  case 'development':
                    if(keyValue !== 'development' && keyValue !== 'both') {
                      color = this.colors.default;
                    }
                    break;
                  case 'humanitarian':
                    if(keyValue !== 'humanitarian ask' && keyValue !== 'top humanitarian requirements' && keyValue !== 'both') {
                      color = this.colors.default;
                    }
                    break;
                  case 'development & humanitarian':
                    if(keyValue !== 'both') {
                      color = this.colors.default;
                    }
                    break;
                  default:
                    break;
                }
              }
            });
          }
        }
        country.setAttribute('fill', color);
      })
    }else {
      this.$el.querySelectorAll('.country, .island').forEach(country => {
        country.setAttribute('fill', this.colors.default);
      });
    }
  }
  showTooltip(code, x, y, rect) {
    if(this.tooltipTO) clearTimeout(this.tooltipTO);
    const xOffset = Math.min(rect.width + 40, 450);
    x = rect.left;
    y = rect.top + rect.height + 40;
    x += x < window.innerWidth / 2 ? xOffset : -(this.$tooltip.clientWidth + 40);
    
    const data = this.data.find(country => country.iso2 === code);
    if(data && this.$tooltip.getAttribute('data-code') !== code) {
      this.$tooltip.setAttribute('data-code', code);
      let animatedItems = this.$tooltip.querySelectorAll('#tooltip-title, #tooltip-content > *, #tooltip-button');
      const $content = this.$tooltip.querySelector('#tooltip-content');
      const $top = this.$tooltip.querySelector('#tooltip-top');
      const $topMain = this.$tooltip.querySelector('#tooltip-top-main');

      if(y + this.$tooltip.scrollHeight > window.innerHeight) {
        y = y - this.$tooltip.scrollHeight - rect.height;
      }
      if(y < 0) {
        y = 40;
      }
      if(x + this.$tooltip.scrollWidth > window.innerWidth) {
        x = x - this.$tooltip.scrollWidth - Math.min(rect.width, 200);
      }
      if(x < 0) {
        x = 40;
      }
      this.$tooltip.style.transform = `translate(${x}px, ${y}px)`;

      gsap.killTweensOf(animatedItems);
      gsap.to(animatedItems, { duration: 0.3, opacity: 0, y: 60, ease: 'power4.out'});
      this.tooltipTO = setTimeout(() => {
        animatedItems = this.$tooltip.querySelectorAll('#tooltip-title, #tooltip-content > *, #tooltip-button');
        gsap.killTweensOf(animatedItems);
        gsap.to(animatedItems, { duration: 0.3, opacity: 0, y: 60, ease: 'power4.out', onComplete: () => {
          this.$tooltip.classList.add('show');
          this.$tooltip.setAttribute('data-code', code);
          this.$tooltip.querySelector('#tooltip-title').innerHTML = data.name;
          this.$tooltip.querySelector('#tooltip-title').classList.toggle('large-text', data.name.length > 10);
          $content.innerHTML = '';
          let $percents = '';
          let $rows = '';
          const percents = [
            { title: 'Intimate partner violence', key: 'IPV_prevalence' },
            { title: 'Female genital mutilation', key: 'FGM_prevalence' },
            { title: 'Child marriage', key: 'CM18_female_prevalence' },
            { title: 'Femicide', key: 'Femicide_number_year', noBar: true },
          ];
          const rows = [
            [
              {title: 'Funding 2020', key: 'funding_2020'},
            ]
          ];
          percents.forEach(item => {
            const value = data[item.key] || 'Data unavailable';
            let valueVisual = value + (value === 'Data unavailable' ? '' : '%');
            if(item.noBar) {
              valueVisual = value;
            }
            $percents += `
              <div class="tooltip-percent-item ${item.noBar ? 'no-bar' : ''}" style="opacity:0;transform:translateY(60px)">
                <div class="flex">
                  <span>${item.title}</span>
                  <strong>${valueVisual}${item.title == 'Femicide' && value != 'Data unavailable' ? `<small>cases per 100,000 female population</small>` : ''}</strong>
                </div>
                <div class="tooltip-percent-item-bar-container">
                  <div class="tooltip-percent-item-bar" data-num="${value / 100}"></div>
                </div>
              </div>
            `;
          });
          rows.forEach(row => {
            let $row = '<div class="tooltip-row" style="opacity:0;transform:translateY(60px)">';
            row.forEach(item => {
              let value = data[item.key] || 'N/A';
              if(data[item.key] > 1000) {
                value = Util.round(data[item.key] / 1000000, 2) + ' million';
              }
              if(item.title.toLowerCase().includes('funding') && value !== 'N/A') {
                if(data[item.key] < 1000000) {
                  value = `${Math.round(data[item.key])}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                value = '$' + value;
              }
              $row += `
                <div class="tooltip-row-item">
                  <span>${item.title}</span>
                  <strong>${value}</strong>`
                  if(item.title == 'Femicide' && value != 'N/A'){ $row += `<small>cases per 100,000 female population</small>`}
              $row += `</div>`;
            });
            $row += '</div>';
            $rows += $row;
          });
          $content.innerHTML = $rows + $percents;
          animatedItems = this.$tooltip.querySelectorAll('#tooltip-title, #tooltip-content > *, #tooltip-button');
          gsap.to($top, { duration: 1, height: $topMain.clientHeight, ease: 'power4.out' });
          gsap.to(animatedItems, { duration: 1.5, opacity: 1, y: 0, stagger: 0.05, ease: 'power4.out' });
          gsap.to(animatedItems, { duration: 0.2, top: 0, stagger: 0.05, ease: 'power4.out', onComplete: () => {
            this.$tooltip.querySelectorAll('.tooltip-percent-item-bar').forEach(bar => {
              bar.style.transform = `scaleX(${bar.getAttribute('data-num')})`;
            });
          }});
        }});
      }, 350);
    }
  }
  hideTooltip() {
    this.$tooltip.classList.remove('show');
    this.$tooltip.setAttribute('data-code', '');
  }
  addFilter(filter) {
    this.currentFilters.push(filter);
    this.updateMap();
  }
  removeFilter(title) {
    const index = this.currentFilters.findIndex(f => f.title === title);
    if(index !== -1) {
      this.currentFilters.splice(index, 1);
    }
    this.updateMap();
  }
  setFilters(filters) {
    this.currentFilters = filters || [];
    this.updateMap();
  }
  getCountryColor(value, ruleName, rules) {
    if(!ruleName) return this.getDefaultScale(value);
    if(!value || value === '') return this.colors.black;
    const colors = this.getColorScales(rules);
    let color = this.colors.black;
    if(ruleName === 'range') {
      // rules example: ['751 - 900 women', '601 - 750 women', '451 - 600 women', '0 - 150 women']
      rules = rules.map(rule => {
        return rule.text.toLowerCase().replace(/ /g, '').replace(/([a-z])+/, '').split('-').map(r => Number(r));
      });
      rules.forEach((range, i) => {
        if(value >= range[0] && value <= range[1]) {
          color = colors[i];
        }
      })
    }else if(ruleName === 'match') {
      value = value.toLowerCase().trim();
      rules = rules.map(rule => {
        return rule.text.toLowerCase();
      });
      rules.forEach((rule, i) => {
        if(value.includes(rule)) {
          color = colors[i];
        }
        else if(rule === 'none' && value === 'no') {
          color = colors[i];
        }
      });
    }
    return color;
  }
  getDefaultScale(value) {
    const colors = this.colors.scales;
    if(!value || value === '') return this.colors.black;
    // else if(value === '0') return this.colors.black;
    else if(value === 0) return colors[0];
    else if(value <= 1) return colors[1];
    else if(value <= 25) return colors[2];
    else if(value <= 50) return colors[3];
    else if(value <= 75) return colors[4];
    else if(value <= 100) return colors[5];
  }
  splitLegends(legends) {
    const scales = [];
    const no = [];

    legends.forEach(l => {
      const title = l.text.toLowerCase();
      if(title !== 'data unavailable' && title !== 'data unknown' && title !== 'no unfpa programme' && title !== 'data unavailable or no unfpa programming') {
        scales.push(l.text);
      }else {
        no.push(l.text);
      }
    })
    return {scales, no};
  }
  getColorScales(legends) {
    const {scales} = this.splitLegends(legends);
    const colorsReverse = [...this.colors.scales].reverse();
    const colors = [];
    const scale = d3.scaleLinear().domain([0, scales.length]).range([0, colorsReverse.length]);


    scales.forEach((s, i) => {
      colors.push(colorsReverse[Math.floor(scale(i))]);
    });
    return colors;
  }
  getLegendsColors(legends) {
    const {scales, no} = this.splitLegends(legends);
    const finalLegends = [];
    const scalesColors = this.getColorScales(legends);
    scales.forEach((scale, i) => {
      finalLegends.push({
        text: scale,
        visual: legends.find(l => l.text === scale).visual,
        color: scalesColors[i],
        type: 'scale'
      });
    });
    no.forEach(l => {
      let color = this.colors.default;
      switch (l) {
        case 'Data unavailable':
          color = this.colors.dataUnknow;
          break;
        case 'Data unknown':
          color = this.colors.dataUnknow;
          break;
        case 'Data unavailable or no UNFPA programming':
          color = this.colors.black;
          break;
        default:
          color =  this.colors.black;
          break;
      }
      finalLegends.push({
        text: l,
        color: color,
        type: 'no'
      });
    });
    return finalLegends;
  }
}