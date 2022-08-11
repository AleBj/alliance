import Graph from '../util/graphs/graph';
import BarsYears from '../util/graphs/bars-years';

export default class DonorYears extends Graph {
  constructor(options){
    super(options);
  }
  init() {
    this.graph = new BarsYears({...this.options, raw: this.raw});
  }
}