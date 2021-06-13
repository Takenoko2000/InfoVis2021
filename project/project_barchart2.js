
//「parentに合わせて使うデータを変える」仕組みがよくわからないので
//仕方なく条件分岐で書いてある

class BarChart2 {
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
      xlabel: config.xlabel
    }
    this.data = data;
    this.init();
  }
  
  init() {
    let self = this;
    
    
    self.svg = d3.select(self.config.parent)
    .attr('width', self.config.width)
    .attr('height', self.config.height);
    
    self.chart = self.svg.append('g')
    .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);


    self.lilili = self.svg.append('k')
    .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

    
    
    self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
    self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;
    
    // Initialize axis scales
    self.yscale = d3.scaleBand().domain(self.data.map(d => d.prefecture)).range([0, self.inner_height]).paddingInner(0.1);
    
    
    //ラベルの指定が総面積だった場合
    if(self.config.xlabel == "all_area"){
    	self.xscale = d3.scaleLinear().domain([0, d3.max(self.data, d => d.all_area)]).range([0, self.inner_width]);
    }

    //ラベルの指定が人口だった場合
    if(self.config.xlabel == "population"){
        self.xscale = d3.scaleLinear().domain([0, d3.max(self.data, d => d.population)]).range([0, self.inner_width]);
    }
    
    //ラベルの指定が人口密度だった場合
    if(self.config.xlabel == "population_density"){
        self.xscale = d3.scaleLinear().domain([0, d3.max(self.data, d => d.population_density)]).range([0, self.inner_width]);
    }
    //ラベルの指定が森林率だった場合
    if(self.config.xlabel == "forest_ratio"){
        self.xscale = d3.scaleLinear().domain([0, d3.max(self.data, d => d.forest_ratio)]).range([0, self.inner_width]);
    }

    
    
    // Initialize axes
    self.xaxis = d3.axisBottom(self.xscale).ticks(5).tickSizeOuter(0);
    self.yaxis = d3.axisLeft(self.yscale).tickSizeOuter(0);
    
    
    
    // Draw the axis
    self.xaxis_group = self.chart.append('g')
    .attr('transform', `translate(0, ${self.inner_height})`)
    .call(self.xaxis);
    
    self.yaxis_group = self.chart.append('g')
    .call(self.yaxis);
    
    
    const xlabel_space = 40;
    self.svg.append('text')
        .style('font-size', '12px')
        .attr('x', self.config.width / 2)
        .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
        .text( self.config.xlabel );
    
    
    self.update();
    
    
  }
  
  
  
  update() {
    let self = this;
    
    // Initialize axis scales
    self.yscale = d3.scaleBand().domain(self.data.map(d => d.prefecture)).range([0, self.inner_height]).paddingInner(0.1);
    

    //ラベルの指定が総面積だった場合
    if(self.config.xlabel == "population"){
    	self.xscale = d3.scaleLinear().domain([0, d3.max(self.data, d => d.all_area)]).range([0, self.inner_width]);
    }

    //ラベルの指定が人口だった場合
    if(self.config.xlabel == "population"){
        self.xscale = d3.scaleLinear().domain([0, d3.max(self.data, d => d.population)]).range([0, self.inner_width]);
    }
    
    //ラベルの指定が人口密度だった場合
    if(self.config.xlabel == "population_density"){
        self.xscale = d3.scaleLinear().domain([0, d3.max(self.data, d => d.population_density)]).range([0, self.inner_width]);
    }
    //ラベルの指定が森林率だった場合
    if(self.config.xlabel == "forest_ratio"){
        self.xscale = d3.scaleLinear().domain([0, d3.max(self.data, d => d.forest_ratio)]).range([0, self.inner_width]);
    }
    
    // Initialize axes
    self.xaxis = d3.axisBottom(self.xscale).ticks(5).tickSizeOuter(0);
    self.yaxis = d3.axisLeft(self.yscale).tickSizeOuter(0);


	//移動平均を計算して配列に追加していく
	self.sma_range = 8;
	self.sma = [];
	//移動平均の中心になるprefectureも保持しておく
	self.sma_prefecture = [];
	
	for (let i = 0; i < self.data.length - self.sma_range; i++) {
		//これで配列から一部分を抜き出す
		let smadata = self.data.slice(i,i+self.sma_range-1);
		
		//reduceを使うと、コールバック関数で合計値を求めることができる
		
		let total;
		if(self.config.xlabel == "forest_ratio"){
			total = smadata.reduce((sum, element) => sum + element.forest_ratio, 0);
		} else if(self.config.xlabel == "population"){
			total = smadata.reduce((sum, element) => sum + element.population, 0);
		} else if(self.config.xlabel == "population_density"){
			total = smadata.reduce((sum, element) => sum + element.population_density, 0);
		}
		
		//求めた合計から平均値を求めて格納
		self.sma.push( Math.floor(self.xscale(total / self.sma_range)) );
		
		self.sma_prefecture.push(self.yscale( self.data[Math.floor(i+self.sma_range/2)].prefecture ));
		
	}
	
	//移動平均の値と中心を、後でd3.line()に渡すためにまとめておく
	self.sss = {
		data: self.sma,
		prefecture: self.sma_prefecture
	}
	
    
    self.render();
  }
  
  change(data){
  let self = this;
  this.data = data;
  
  self.update();
  }
  
  
  render() {
    let self = this;
    
    self.xaxis_group.call(self.xaxis);
    self.yaxis_group.call(self.yaxis);
    
    
    
    // 指定が人口
    if(self.config.xlabel == "population"){
	    self.chart.selectAll(".bar")
	    .data(self.data)
	    .join("rect")
	    .attr("class", "bar")
	    .transition().duration(1000)
	    .attr("x", 0)
	    .attr("y", d => self.yscale(d.prefecture))
	    .attr("width", d => self.xscale(d.population))
	    .attr("height", self.yscale.bandwidth());
	}
    
    // 指定が総面積
    if(self.config.xlabel == "all_area"){
	    self.chart.selectAll(".bar")
	    .data(self.data)
	    .join("rect")
	    .attr("class", "bar")
	    .transition().duration(1000)
	    .attr("x", 0)
	    .attr("y", d => self.yscale(d.prefecture))
	    .attr("width", d => self.xscale(d.all_area))
	    .attr("height", self.yscale.bandwidth());
	}
	
    // 指定が森林率
    if(self.config.xlabel == "forest_ratio"){
	    self.chart.selectAll(".bar")
	    .data(self.data)
	    .join("rect")
	    .attr("class", "bar")
	    .transition().duration(1000)
	    .attr("x", 0)
	    .attr("y", d => self.yscale(d.prefecture))
	    .attr("width", d => self.xscale(d.forest_ratio))
	    .attr("height", self.yscale.bandwidth());
	}
	
    // 指定が人口密度
    if(self.config.xlabel == "population_density"){
	    self.chart.selectAll(".bar")
	    .data(self.data)
	    .join("rect")
	    .attr("class", "bar")
	    .transition().duration(1000)
	    .attr("x", 0)
	    .attr("y", d => self.yscale(d.prefecture))
	    .attr("width", d => self.xscale(d.population_density))
	    .attr("height", self.yscale.bandwidth());
	}

	
	//マウスオーバーやクリックに反応させる部分
    //この書き方じゃないとエラーになる
    //functionの引数は[Mouseevent]と[Object]（対応するデータ）になっている
    self.chart.selectAll("rect")
    .on("click",function(ev,d,elem){
	    const is_active = filter.includes(d.prefecture);
	    if ( is_active ) {
	        filter = filter.filter( f => f !== d.prefecture );
	    }
	    else {
	    	//今のところaggregatedにしてないからこれでいい
	        filter.push( d.prefecture );
	    }
	    Filter();
	    d3.select(this).classed('active', !is_active);
    })
    .on('mouseover', (e,d) => {
        d3.select('#tooltip')
            .style('opacity', 1)
            .html(`<div class="tooltip-label">Prefecture:${d.prefecture}</div>Forest_ratio: ${d.forest_ratio}<br>Population_density(people/ha): ${d.population_density}<br>Population(people): ${d.population}`);
    })
    .on('mousemove', (e) => {
        const padding = 10;
        d3.select('#tooltip')
            .style('left', (e.pageX + padding) + 'px')
            .style('top', (e.pageY + padding) + 'px');
    })
    .on('mouseleave', () => {
        d3.select('#tooltip')
            .style('opacity', 0);
    });
    
    //
    let data = [];
	for (let i = 0; i < self.data.length - self.sma_range; i++){
		data.push({x: self.sss.data[i], y: self.sss.prefecture[i]});
	}

	//最前面に綺麗に表示させる方法がわからないので位置をずらして見やすくする
	self.line = d3.line()
	      .x( d => d.x + 30 )
	      .y( d => d.y );
	
	self.chart
		.selectAll("path")
		.join("path")
	    .attr('d', self.line(data))
	    .attr('stroke', 'red')
	    .attr('fill', 'none')
	    .attr("stroke-width",2);
    
    
  }
}

