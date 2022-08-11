import axios from "axios";
import Util from "../util";

export default class Graph {
  constructor(options){
    this.options = options;
    this.src = options.src;
    this.$el = options.el;
    this.getData();
  }
  async getData() {
    try {
      const res = await axios.get(this.src);
      if(res.data) {
        this.raw = res.data;
        this.init();
      }
    } catch (error) {
      console.error(error);
    }
  }
}