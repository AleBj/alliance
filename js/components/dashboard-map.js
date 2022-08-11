import Graph from '../util/graphs/graph';
import ComplexMap from '../util/graphs/complex-map';

export default class DashboardMap extends Graph {
  constructor(options){
    super(options);
  }
  init() {
    this.graph = new ComplexMap({...this.options, raw: this.raw});
  }
}