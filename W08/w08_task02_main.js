d3.csv("https://takenoko2000.github.io/InfoVis2021/W08/test02.csv").then(data => {
  data.forEach(d => {
    d.x = +d.x;
    d.y = +d.y;
  });
  var config = {
    parent: '#drawing_region',
    width: 256,
    height: 256,
    margin: {
      top: 10,
      right: 10,
      bottom: 30,
      left: 30
    }
  };
  const linechart = new LineChart(config, data);
  linechart.update();
}).catch(error => {
  console.log(error);
});
class LineChart {
  constructor(config, data) {
    this.config = {
      parent: config.parent,
      width: config.width || 256,
      height: config.height || 256,
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
    self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
    self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;
    self.chart = self.svg.append('g').attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);
    // Initialize axis scales
    self.xscale = d3.scaleLinear().domain([0, d3.max(self.data, d => d.x)]).range([0, self.inner_width]);
    self.yscale = d3.scaleLinear().domain([0, d3.max(self.data, d => d.y)]).range([self.inner_height, 0]);
    // Initialize axes
    self.xaxis = d3.axisBottom(self.xscale).ticks(5).tickSizeOuter(0);
    self.yaxis = d3.axisLeft(self.yscale).ticks(5).tickSizeOuter(0);
    self.update();
  }
  update() {
    let self = this;
    // Draw the axis
    self.xaxis_group = self.chart.append('g').attr('transform', `translate(0, ${self.inner_height})`).call(self.xaxis);
    self.yaxis_group = self.chart.append('g').attr('transform', `translate(0, 0)`).call(self.yaxis);
    self.line = d3.line().x(d => self.xscale(d.x)).y(d => self.yscale(d.y));
    self.render();
  }
  render() {
    let self = this;
    self.xaxis_group.call(self.xaxis);
    self.yaxis_group.call(self.yaxis);
    self.chart.append('path').attr('d', self.line(self.data)).attr('stroke', 'black').attr('fill', 'none');
  }
}