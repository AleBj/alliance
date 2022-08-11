import Graph from '../util/graphs/graph';
import SimpleMap from '../util/graphs/simple-map';

export default class HomeMap extends Graph {
  constructor(options){
    super(options);
  }
  init() {
    this.graph = new SimpleMap({...this.options, raw: this.raw});
  }
}