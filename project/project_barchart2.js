
//�uparent�ɍ��킹�Ďg���f�[�^��ς���v�d�g�݂��悭�킩��Ȃ��̂�
//�d���Ȃ���������ŏ����Ă���

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
    
    
    //���x���̎w�肪���ʐς������ꍇ
    if(self.config.xlabel == "all_area"){
    	self.xscale = d3.scaleLinear().domain([0, d3.max(self.data, d => d.all_area)]).range([0, self.inner_width]);
    }

    //���x���̎w�肪�l���������ꍇ
    if(self.config.xlabel == "population"){
        self.xscale = d3.scaleLinear().domain([0, d3.max(self.data, d => d.population)]).range([0, self.inner_width]);
    }
    
    //���x���̎w�肪�l�����x�������ꍇ
    if(self.config.xlabel == "population_density"){
        self.xscale = d3.scaleLinear().domain([0, d3.max(self.data, d => d.population_density)]).range([0, self.inner_width]);
    }
    //���x���̎w�肪�X�ї��������ꍇ
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
    

    //���x���̎w�肪���ʐς������ꍇ
    if(self.config.xlabel == "population"){
    	self.xscale = d3.scaleLinear().domain([0, d3.max(self.data, d => d.all_area)]).range([0, self.inner_width]);
    }

    //���x���̎w�肪�l���������ꍇ
    if(self.config.xlabel == "population"){
        self.xscale = d3.scaleLinear().domain([0, d3.max(self.data, d => d.population)]).range([0, self.inner_width]);
    }
    
    //���x���̎w�肪�l�����x�������ꍇ
    if(self.config.xlabel == "population_density"){
        self.xscale = d3.scaleLinear().domain([0, d3.max(self.data, d => d.population_density)]).range([0, self.inner_width]);
    }
    //���x���̎w�肪�X�ї��������ꍇ
    if(self.config.xlabel == "forest_ratio"){
        self.xscale = d3.scaleLinear().domain([0, d3.max(self.data, d => d.forest_ratio)]).range([0, self.inner_width]);
    }
    
    // Initialize axes
    self.xaxis = d3.axisBottom(self.xscale).ticks(5).tickSizeOuter(0);
    self.yaxis = d3.axisLeft(self.yscale).tickSizeOuter(0);


	//�ړ����ς��v�Z���Ĕz��ɒǉ����Ă���
	self.sma_range = 8;
	self.sma = [];
	//�ړ����ς̒��S�ɂȂ�prefecture���ێ����Ă���
	self.sma_prefecture = [];
	
	for (let i = 0; i < self.data.length - self.sma_range; i++) {
		//����Ŕz�񂩂�ꕔ���𔲂��o��
		let smadata = self.data.slice(i,i+self.sma_range-1);
		
		//reduce���g���ƁA�R�[���o�b�N�֐��ō��v�l�����߂邱�Ƃ��ł���
		
		let total;
		if(self.config.xlabel == "forest_ratio"){
			total = smadata.reduce((sum, element) => sum + element.forest_ratio, 0);
		} else if(self.config.xlabel == "population"){
			total = smadata.reduce((sum, element) => sum + element.population, 0);
		} else if(self.config.xlabel == "population_density"){
			total = smadata.reduce((sum, element) => sum + element.population_density, 0);
		}
		
		//���߂����v���畽�ϒl�����߂Ċi�[
		self.sma.push( Math.floor(self.xscale(total / self.sma_range)) );
		
		self.sma_prefecture.push(self.yscale( self.data[Math.floor(i+self.sma_range/2)].prefecture ));
		
	}
	
	//�ړ����ς̒l�ƒ��S���A���d3.line()�ɓn�����߂ɂ܂Ƃ߂Ă���
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
    
    
    
    // �w�肪�l��
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
    
    // �w�肪���ʐ�
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
	
    // �w�肪�X�ї�
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
	
    // �w�肪�l�����x
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

	
	//�}�E�X�I�[�o�[��N���b�N�ɔ��������镔��
    //���̏���������Ȃ��ƃG���[�ɂȂ�
    //function�̈�����[Mouseevent]��[Object]�i�Ή�����f�[�^�j�ɂȂ��Ă���
    self.chart.selectAll("rect")
    .on("click",function(ev,d,elem){
	    const is_active = filter.includes(d.prefecture);
	    if ( is_active ) {
	        filter = filter.filter( f => f !== d.prefecture );
	    }
	    else {
	    	//���̂Ƃ���aggregated�ɂ��ĂȂ����炱��ł���
	        filter.push( d.prefecture );
	    }
	    Filter();
	    d3.select(this).classed('active', !is_active);
    })
    .on('mouseover', (e,d) => {
        d3.select('#tooltip')
            .style('opacity', 1)
            .html(`<div class="tooltip-label">Prefecture:${d.prefecture}</div>Forest_ratio: ${d.forest_ratio}<br>Population_density(�l/ha): ${d.population_density}<br>Population(�l): ${d.population}`);
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

	//�őO�ʂ��Y��ɕ\����������@���킩��Ȃ��̂ňʒu�����炵�Č��₷������
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

