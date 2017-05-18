// globally defined variables

var current_site = "";
var current_duration = 0;

var colors = [
              '#FBB735',
              '#E98931',
              '#EB403B',
              '#B32E37',
	      '#6C2A6A',
              '#5C4399',
              '#274389',
              '#1F5EA8',
              '#227FB0',
              '#2AB0C5',
              '#39C0B3',
              '#006401',
              '#90fb92',
	      '#0076ff',
              '#ff937e',
	      '#6a826c',
              '#ff029d',
	      '#fe8900',
	      '#7a4782'
	      ];


function toDate(dateStr) {
    const [year, month, day] = dateStr.split("-")
	return new Date(year, month - 1, day)
}

function initPage() {
  
    var ajaxInput_sitereadiness = {
        'url': 'main.php',
        'data': {'getSiteReadiness': 1, 'nweeks': 4},
        'success': function (data) { 
	    drawSiteReadiness(data);
	},
        'dataType': 'json',
        'async': false
    };

    $.ajax(ajaxInput_sitereadiness);

    var ajaxInput_oneyear = {
        'url': 'main.php',
        'data': {'getSiteReadiness': 1, 'nweeks': 52},
        'success': function (data) { 
	    drawOneYear(data);
	},
        'dataType': 'json',
        'async': false
    };

    $.ajax(ajaxInput_oneyear);

    var ajaxInput_corr = {
        'url': 'main.php',
        'data': {'getSiteReadiness': 1, 'nweeks': 52},
        'success': function (data) { 
	    drawCorrelation(data);
	},
        'dataType': 'json',
        'async': false
    };

    $.ajax(ajaxInput_corr);

}


function makeTrace(title,dates,dummy,status){
    return{
	    mode: 'markers',
            name: title,
	    x: dates,
            y: dummy,
	    showlegend: false,
            marker: {
	    sizemode: 'area',
                size: 20,
		sizeref: 20,
		color: status
	  }
    }	    
}


function drawSiteReadiness(data) {
    

    
    //preparing sort
    var site_name = [];
    var site_ready = [];
    for(var i = 0 in data) {
	
	var site_ready_tmp = 0
        var obj = data[i];

	var dates = 0;

	for (var j in obj['data']){
	    if (obj['data'][j].status=="Ok"){
		site_ready_tmp += 1;
	    }
	    dates += 1;
	}
	site_name.push(obj.site);
	site_ready.push(site_ready_tmp/dates);
    }

    var len = site_name.length;
    var indices = new Array(len);
    for (var i = 0; i < len; ++i) indices[i] = i;

    indices.sort(function (a, b) { return site_ready[a] < site_ready[b] ? -1 : site_ready[a] > site_ready[b] ? 1 : 0; });

    var final_site = [];
    var final_ready = [];

    for (var i = 0; i < len; i++){

	final_site.push(site_name[indices[i]]);
	final_ready.push(site_ready[indices[i]]);

    }

    var traces = [];
    var site_readinesses = [];

    var site_counter = 1;

    for(var h = 0; h<len; h++){

	for(var i = 0 in data) {    
	    
	    var dates_site = [];
	    var status_site = [];
	    var dummy_site = [];
	    
	    var site_ready = 0;
	    var obj = data[i];
	    
	    if (obj.site != final_site[h])
		continue;
	    
	    for (var j in obj['data']){
		if (obj['data'][j].status=="Ok"){
		    status_site.push('rgba(86,245,71,1.0)');
		    site_ready += 1;
		}
		else if (obj['data'][j].status=="Error")
		    status_site.push('rgba(255,0,0,1.0)');
		else
		    status_site.push('rgba(71,109,245,1.0)');
		dates_site.push(obj['data'][j].date);
		dummy_site.push(site_counter);
		
	    }
	    traces.push(makeTrace(obj.site,dates_site,dummy_site,status_site));
	    site_readinesses.push(obj.site.replace("T2_US_","") + " | " + (site_ready/status_site.length*100).toFixed(1) + "%");
	    site_counter += 1; 	    
	}
    }

    var data = traces;

    var nweeks = 2;
    
    var layout = {
	title: 'Site Readiness for US Tier-2s (last 4 weeks)',
	margin: {t: 50, b: 50, l: 128, r: 20},
	yaxis: {
	    showgrid: false,
	    fixedrange: true,
	    showticklabels: true,
	    tickvals: [1,2,3,4,5,6,7,8],
	    ticktext: site_readinesses,
	    tickfont: {
		family: "Arial, sans-serif",
		size: 15
	    }
	}
    };
    
    Plotly.plot('SiteOverview', data, layout);

}

function drawOneYear(data){

    var weekday = new Array(7);
    weekday[0] =  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
	
    var traces = [];

    var counter = 1;

    for(var i = 0 in data) {

	var obj = data[i];
	var dates_with_error = [];

	for (var j in obj['data'])
            if (obj['data'][j].status!="Ok")
		dates_with_error.push(toDate(obj['data'][j].date).getDay());
	
	var Count = new Map([...new Set(dates_with_error)].map(
							       x => [x, dates_with_error.filter(y => y === x).length]
							       ));

	var failures = new Array(7);

	for(var i = 0; i<7; i++)
	    failures[i] = Count.get(i);
	
	var trace = {
	    x: weekday,
	    y: failures,
	    marker: {
		color: colors[counter],
		line: {
		    color: colors[counter],
		    width: 1.0
		}
	    },
	    name: obj.site.replace("T2_US_",""),
	    type: 'bar'
	};	
	traces.push(trace);
	counter += 1;
    }
    
    var layout = {
	title: 'Site errors per weekday (last 52 weeks)',
	margin: {t: 50, b: 50, l: 40, r: 20},
	barmode: 'stack',
	yaxis: {
	    showgrid: false,
	    fixedrange: true,
	    showticklabels: true,
	    tickfont: {
		family: "Arial, sans-serif",
		size: 15
	    }
	}
    };

    Plotly.newPlot('YearOverview', traces,layout);
    
}



function drawCorrelation(data){

    var sites = [];
    var correlation_array = [];

    for(var i = 0 in data) {
	var obj_i = data[i];
	
	sites.push(obj_i.site.replace("T2_US_",""));

	var status_i = getArray(obj_i);

	var correlation_with_other_sites = [];

	for(var j = 0 in data) {

	    var obj_j = data[j];
	    var status_j = getArray(obj_j);
	    
	    var data_pearson = [status_i,status_j];

	    correlation_with_other_sites.push(getPearsonCorrelation(status_i,status_j));
	}
	correlation_array.push(correlation_with_other_sites);
    }

    var data_draw = [
		{
		    z: correlation_array,
		    zmin: -1,
		    zauto: false,
		    type: 'heatmap'
		}
		];

    var layout = {
	title: 'Correlation (last 52 weeks)',
	margin: {t: 50, b: 40, l: 58, r: 40},
	yaxis: {
	    showgrid: false,
	    fixedrange: true,
	    showticklabels: true,
	    tickvals: [0,1,2,3,4,5,6,7],
	    ticktext: sites,
	    tickfont: {
		family: "Arial, sans-serif",
		size: 11
	    }
	},
	xaxis: {
	    showgrid: false,
	    fixedrange: true,
	    showticklabels: true,
	    tickvals: [0,1,2,3,4,5,6,7],
	    ticktext: sites,
	    tickfont: {
		family: "Arial, sans-serif",
		size: 11
	    }
	},
    };


    Plotly.newPlot('Correlation', data_draw,layout);



}

function getArray(object){

    var status = [];
    for (var j in object['data']){
	if (object['data'][j].status=="Ok")
	    status.push(1);
	else if (object['data'][j].status=="Error")
	    status.push(0);
	else
	    status.push(-1);
    }
    return status;
    
}


function getPearsonCorrelation(x, y) {
    var shortestArrayLength = 0;
     
    if(x.length == y.length) {
        shortestArrayLength = x.length;
    } else if(x.length > y.length) {
        shortestArrayLength = y.length;
    } else {
        shortestArrayLength = x.length;
    }
  
    var xy = [];
    var x2 = [];
    var y2 = [];
  
    for(var i=0; i<shortestArrayLength; i++) {
        xy.push(x[i] * y[i]);
        x2.push(x[i] * x[i]);
        y2.push(y[i] * y[i]);
    }
  
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_x2 = 0;
    var sum_y2 = 0;
  
    for(var i=0; i< shortestArrayLength; i++) {
        sum_x += x[i];
        sum_y += y[i];
        sum_xy += xy[i];
        sum_x2 += x2[i];
        sum_y2 += y2[i];
    }
  
    var step1 = (shortestArrayLength * sum_xy) - (sum_x * sum_y);
    var step2 = (shortestArrayLength * sum_x2) - (sum_x * sum_x);
    var step3 = (shortestArrayLength * sum_y2) - (sum_y * sum_y);
    var step4 = Math.sqrt(step2 * step3);
    var answer = step1 / step4;
  
    return answer;

}

