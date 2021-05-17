d3.csv("https://takenoko2000.github.io/InfoVis2021/W08/data_pie.csv").then(data => {
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
      left: 30
    },
    radius: Math.min(256, 256) / 2
  };
  const piechart = new PieChart(config, data);
  piechart.update();
}).catch(error => {
  console.log(error);
});
class PieChart {
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
      },
      radius: config.radius
    }
    this.data = data;
    this.init();
  }
  init() {
    let self = this;
    self.svg = d3.select(self.config.parent).attr('width', self.config.width).attr('height', self.config.height).append('g').attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);
    self.update();
  }
  update() {
    let self = this;
    self.pie = d3.pie().value(d => d.width);
    self.arc = d3.arc().innerRadius(0).outerRadius(self.config.radius);
    self.text = d3.arc().outerRadius(self.config.radius - 20).innerRadius(self.config.radius - 60);
    self.render();
  }
  render() {
    let self = this;
    self.svg.selectAll('pie').data(self.pie(self.data)).enter().append('path').attr('d', self.arc).attr('fill', 'black').attr('stroke', 'white').style('stroke-width', '2px');
    self.svg.selectAll('pie').data(self.pie(self.data)).enter().append("text").attr("fill", 'white').attr("font-size", "20px").attr("transform", function (d) {
      return "translate(" + self.text.centroid(d) + ")";
    }).attr("dy", "5px").attr("text-anchor", "middle").text(function (d) {
      return d.data.label;
    });
  }
}