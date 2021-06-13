let input_data;
let bar_chart;
let bar_chart2;
let bar_chart3;
let filter = [];

//�����������ɂ����data�ɕ����̃f�[�^��z��`���œ������B
//���|�[�g�ɂ������Ď��ۂɎg�p�����͕̂���29�N�̃f�[�^�̂�
var files = ["https://takenoko2000.github.io/InfoVis2021/project/forest_data_h29.csv"]
var promises = [];

files.forEach(function(url) {
    promises.push(d3.csv(url))
});


Promise.all(promises)
.then(data => {
		input_data = data[0];
		input_data.forEach(d => {
		  d.prefecture = d.prefecture;
		  d.forest_area = +d.forest_area;
		  d.planted_forest_area = +d.planted_forest_area;
		  d.all_area = +d.all_area;
		  d.forest_ratio = +d.forest_ratio;
		  d.planted_forest_ratio = +d.planted_forest_ratio;
		  d.population = +d.population;
		  d.population_density = +d.population_density;
		});
		
        bar_chart = new BarChart2( {
            parent: '#drawing_region_barchart',
            width: 250,
            height: 750,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'forest_ratio'
        }, input_data );
        bar_chart.update();

        bar_chart2 = new BarChart2( {
            parent: '#drawing_region_barchart2',
            width: 250,
            height: 750,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'population_density'
        }, input_data );
        bar_chart2.update();
        
        bar_chart3 = new BarChart2( {
            parent: '#drawing_region_barchart3',
            width: 480,
            height: 750,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'population'
        }, input_data );
        bar_chart3.update();
        
	    
	    
	    
	  //�~��
	  d3.select('#descend_population')
	    .on('click', d => {
	        input_data.sort( function(a,b) {
	        	if ( a.population < b.population){
	        		return 1;
	        	} else {
	        		return -1;
	        	}
	        });
	    
		bar_chart.update();
		bar_chart2.update();
		bar_chart3.update();
	    });
	  
	  //����
	  d3.select('#ascend_population')
	    .on('click', d => {
	        input_data.sort( function(a,b) {
	        	if ( a.population > b.population){
	        		return 1;
	        	} else {
	        		return -1;
	        	}
	        });
	    
		bar_chart.update();
		bar_chart2.update();
		bar_chart3.update();
	    });
	    
	    
	    
	    
	  //�~��
	  d3.select('#descend_population_density')
	    .on('click', d => {
	        input_data.sort( function(a,b) {
	        	if ( a.population_density < b.population_density){
	        		return 1;
	        	} else {
	        		return -1;
	        	}
	        });
	    
		bar_chart.update();
		bar_chart2.update();
		bar_chart3.update();
	    });
	  
	  //����
	  d3.select('#ascend_population_density')
	    .on('click', d => {
	        input_data.sort( function(a,b) {
	        	if ( a.population_density > b.population_density){
	        		return 1;
	        	} else {
	        		return -1;
	        	}
	        });
	    
		bar_chart.update();
		bar_chart2.update();
		bar_chart3.update();
	    });
	    
	  //�~��
	  d3.select('#descend_forest_ratio')
	    .on('click', d => {
	        input_data.sort( function(a,b) {
	        	if ( a.forest_ratio < b.forest_ratio){
	        		return 1;
	        	} else {
	        		return -1;
	        	}
	        });
	    
		bar_chart.update();
		bar_chart2.update();
		bar_chart3.update();
	    });
	  
	  //����
	  d3.select('#ascend_forest_ratio')
	    .on('click', d => {
	        input_data.sort( function(a,b) {
	        	if ( a.forest_ratio > b.forest_ratio){
	        		return 1;
	        	} else {
	        		return -1;
	        	}
	        });
	    
		bar_chart.update();
		bar_chart2.update();
		bar_chart3.update();
	    });
	    


    })
    .catch( error => {
        console.log( error );
    });



function Filter() {

	//���̏�Ԃ��Ɓubar_chart�̒��̂Ƃ��Ă��̗v�f���������o�����v
	//����ς�Q�ȏ�̃r���[��u���đΉ�������悤�ɂ��Ȃ��ƈӖ��Ȃ�
	//����̗v�f�Ɋւ���̂���������悤�ɂȂ�̂͂܂������Ǝv���񂾂���
	//�Ă��܂��I�����邾���̃{�b�N�X�Ƃ��s���{��UI�Ƃ��u���Ƃ�������
	//�I�񂾗v�f�Ɋւ���ʐσ����L���O�A�X�ї������L���O�A�Ƃ����ꂽ�炢��
    if ( filter.length == 0 ) {
        bar_chart2.data = input_data;
        bar_chart3.data = input_data;
    }
    else {
    	
        bar_chart2.data = input_data.filter( d => filter.includes( d.prefecture ) );
        bar_chart3.data = input_data.filter( d => filter.includes( d.prefecture ) );
    }
    bar_chart2.update();
    bar_chart3.update();
}
