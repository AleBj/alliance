import gsap from 'gsap';
import * as d3 from '../../libs/d3.v6.min.js';
import Util from '../util.js';

export default class SimpleMap {
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

    this.keys = this.data.columns.slice(1);
    this.mainLabel = this.options.mainLabel || this.keys[0];
    window.addEventListener('resize', () => {
      this.resize();
    })
    this.resize();
  }
  resize() {
    this.width = Math.min(this.$el.clientWidth, window.innerHeight * 1.3);
    this.height = this.width * 0.55;

    this.margin = {top: 0, right: 0, bottom: 0, left: 0};
    this.marginLegends = {right: 0, bottom: 0};

    this.fs = 14;
    this.legendSquareW = 0;

    this.labelsHeight = 0;
    
    this.svgSize = {width: this.width, height: this.height};
    this.draw()
  }
  draw() {
    this.$el.innerHTML = '';
    const svg = d3.select(this.$el).append('svg')
      .attr('viewBox', `0,0,${this.svgSize.width},${this.svgSize.height}`)
      .attr('width', this.svgSize.width)
      .attr('height', this.svgSize.height);

    const mainGroup = svg.append('g').attr('class', 'main-group');

    // Map and projection
    const projection = d3.geoNaturalEarth1()
    .scale(this.width / 1.55 / Math.PI)
    .translate([this.width / 2.1, this.height * 0.6]);

    // Load external data and boot
    d3.json('./assets/data/world.geojson').then(world => {
      // Draw the map
      mainGroup.append('g')
        .selectAll('path')
        .data(world.features)
        .join('path')
        .attr('fill', d => {
          const data = this.data.find(country => country['ISO 3'] === d.properties.iso_a3);
          if(data) {
            if(data[this.mainLabel]) return this.colors[1];
          }
          return this.colors[0];
        })
        .attr('d', d3.geoPath().projection(projection))
        .style('stroke', '#242831')
        .style('stroke-width', '0.25');
    });
  }
}