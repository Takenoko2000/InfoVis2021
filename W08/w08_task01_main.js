d3.csv("https://takenoko2000.github.io/InfoVis2021/W04/data_task2.csv").then(data => {
  data.forEach(d => {
    d.width = +d.width;
    d.color = d.color;
    d.label = d.label;
  });
  var config = {
    parent: '#drawing_region',
    width: 256,
    height: 256,
    margin: {
      top: 30,
      right: 30,
      bottom: 30,
      left: 80
    }
  };
  const barchart = new BarChart(config, data);
  barchart.update();
}).catch(error => {
  console.log(error);
});
class BarChart {
  constructor(config, data) {
    this.config = {
      parent: config.parent,
      width: config.width || 256,
      height: config.height || 128,
      margin: config.margin || {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      }
    }
    this.data = data;
    this.init();
  }
  init() {
    let self = this;
    self.svg = d3.select(self.config.parent).attr('width', self.config.width).attr('height', self.config.height);
    self.chart = self.svg.append('g').attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);
    self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
    self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;
    // Initialize axis scales
    self.xscale = d3.scaleLinear().domain([0, d3.max(self.data, d => d.width)]).range([0, self.inner_width]);
    self.yscale = d3.scaleBand().domain(self.data.map(d => d.label)).range([0, self.inner_height]).paddingInner(0.1);
    // Initialize axes
    self.xaxis = d3.axisBottom(self.xscale).ticks(5).tickSizeOuter(0);
    self.yaxis = d3.axisLeft(self.yscale).tickSizeOuter(0);
    self.update();
  }
  update() {
    let self = this;
    // Draw the axis
    self.xaxis_group = self.chart.append('g').attr('transform', `translate(0, ${self.inner_height})`).call(self.xaxis);
    self.yaxis_group = self.chart.append('g').call(self.yaxis);
    self.render();
  }
  render() {
    let self = this;
    self.xaxis_group.call(self.xaxis);
    // Add yaxis
    self.yaxis_group.call(self.yaxis);
    // Draw bars
    self.chart.selectAll("rect").data(self.data).enter().append("rect").attr("x", 0).attr("y", d => self.yscale(d.label)).attr("width", d => self.xscale(d.width)).attr("height", self.yscale.bandwidth());
  }
}