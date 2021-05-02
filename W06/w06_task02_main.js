d3.csv("https://takenoko2000.github.io/InfoVis2021/W06/data.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 300,
            height: 300,
            margin: {top:30, right:30, bottom:30, left:30}
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10}
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);
             

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left*2}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right*2;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range( [self.config.margin.left, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height - self.config.margin.top,0 ] );
            
            
        
        	
        	

        self.xaxis = d3.axisBottom( self.xscale )
			.tickValues([-5,20,40,60,80,100,120,140,160])
            .tickSize(-self.inner_height)
            .tickPadding(10);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);
            
            
        // Add yaxis
        self.yaxis = d3.axisLeft( self.yscale )
			.tickValues([10,20,30,40,50,60,70,80,90,110])
            .tickSize(-self.inner_width)
            .tickPadding(10);
            
        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0 ,0)`);
    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        self.xscale.domain( [xmin, xmax] );

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        self.yscale.domain( [ymin, ymax] );
        
        
        
        
    	self.svg.append("text")
        	.attr("x", self.xscale(xmax/2) + 15 )
        	.attr("y", 15)
        	.attr("font-size", 15)
        	.text("Chart Title");   
           
           
    	self.svg.append("text")
        	.attr("x", self.xscale(xmax/2) + 50 )
        	.attr("y", 300)
        	.attr("font-size", 15)
        	.text("x");   
        
        
    	self.svg.append("text")
        	.attr("x", 20 )
        	.attr("y", self.yscale(ymax/2) + 25)
        	.attr("font-size", 15)
        	.text("y");   
        	

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r );

        self.xaxis_group
            .call( self.xaxis );
            
        // Add yaxis
        self.yaxis_group
            .call( self.yaxis );
            
        
        
        
            
            
        
    }
}
