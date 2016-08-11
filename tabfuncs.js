/********************************** CSS for Tabs ************************************/
$(document).ready(function($){
    $('#NavTabMain').on("click", function(){
		$(this).find('.hist').css("color", "white");
		$(this).find('.hist').css("background-color", "#337AB7");
		$(this).find('.news').css("color", "#337AB7");
		$(this).find('.news').css("background-color", "white");
		$(this).find('.curr').css("color", "#337AB7");
		$(this).find('.curr').css("background-color", "white");
    });
});

/********************************** Tab Click Functionality ************************************/

$(document).click(function(e) {
    if(!$(e.target).is('.hist'))
    { 
	  $('.hist').css("background-color", "white");
	  $('.hist').css("color", "#337AB7");
	}
    if($(e.target).is('.news'))
	{
      $('.news').css("background-color", "#337AB7");
	  $('.news').css("color", "white");
	}
    if($(e.target).is('.curr'))
    {
	   $('.curr').css("background-color", "#337AB7");
	   $('.curr').css("color", "white");
    }
});

/********************************** News Feed Tab ************************************/
function newsfunc(stksymbol){       
        $.ajax({                
                url: 'http://ninja-1.crpqbfpuau.us-west-2.elasticbeanstalk.com/',
                type: 'GET',
                data: ({news: stksymbol}),                
                    success: function(data){
                        var text = JSON.parse(data);
                        $('#nnewsfeeddiv').empty();
                        for(var m=0; m<text.length; m++){                           
                            $('#nnewsfeeddiv').append('<div id="newsdiv'+m+'"class="newsfeedcls"></div><br>');
                            $('#newsdiv'+m).append("<a href='"+text[m].Url+"'>"+text[m].Title+"</a><br><br>");
                            //$('#twitterFeed').append(text[m].url+"<br><br>");
                            $('#newsdiv'+m).append(text[m].Description+"<br><br>");
                            $('#newsdiv'+m).append("<b>Publisher:"+text[m].Source+"<br></b>");
                            $('#newsdiv'+m).append("<b>Date:"+text[m].Date+"<br><br></b>");
                        }
                        
                    }
    });
}

/********************************** Historical Charts Tab ************************************/
var Markit = {};
var symbol;
var duration = 1095;
function histfunc(stksym){
    symbol = stksym;
    Markit.InteractiveChartApi(symbol, duration);
    
}
Markit.InteractiveChartApi = function(symbol,duration){

    this.symbol = symbol.toUpperCase();
    this.duration = duration;
    PlotChart(this.symbol);
};
var PlotChart = function(stksymb){
 
    //Make JSON request for timeseries data
    $.ajax({
        beforeSend:function(){
            $("#nhistchartdiv").text("Loading chart...");
        },

        url: "http://ninja-1.crpqbfpuau.us-west-2.elasticbeanstalk.com/",
        type: 'GET',
        data: ({his: stksymb}),
        context: this,
        success: function(json){
            //Catch errors
            if (!json || json.Message){
                console.error("Error: ", json.Message);
                return;
            }
            var jsonpar = JSON.parse(json);
            render(jsonpar);
        },
        error: function(response,txtStatus){
            console.log(response,txtStatus)
        }
    });
};

var fixDate = function(dateIn) {
    var dat = new Date(dateIn);
    return Date.UTC(dat.getFullYear(), dat.getMonth(), dat.getDate());
};
var getOHLC = function(json) {
    var dates = json.Dates || [];
    var elements = json.Elements || [];
    var chartSeries = [];

    if (elements[0]){

        for (var i = 0, datLen = dates.length; i < datLen; i++) {
            var dat = fixDate( dates[i] );
            var pointData = [
                dat,
                elements[0].DataSeries['open'].values[i],
                elements[0].DataSeries['high'].values[i],
                elements[0].DataSeries['low'].values[i],
                elements[0].DataSeries['close'].values[i]
            ];
            chartSeries.push( pointData );
        };
    }
    return chartSeries;
};
 var getVolume = function(json) {
    var dates = json.Dates || [];
    var elements = json.Elements || [];
    var chartSeries = [];

    if (elements[1]){

        for (var i = 0, datLen = dates.length; i < datLen; i++) {
            var dat = fixDate( dates[i] );
            var pointData = [
                dat,
                elements[1].DataSeries['volume'].values[i]
            ];
            chartSeries.push( pointData );
        };
    }
    return chartSeries;
};

var render = function(data) {
var ohlc = getOHLC(data),
    volume = getVolume(data);
    // create the chart
    $('#nhistchartdiv').highcharts('StockChart', {
        
        rangeSelector: {
            selected: 0,
            inputEnabled: false ,
            buttons: [{
                type: 'week',
                count: 1,
                text: '1w'
            },
            {
                type: 'month',
                count: 1,
                text: '1m'
            },
            {
                type: 'month',
                count: 3,
                text: '3m'
            }, {
                type: 'month',
                count: 6,
                text: '6m'
            }, {
                type: 'ytd',
                text: 'YTD'
            }, {
                type: 'year',
                count: 1,
                text: '1y'
            }, {
                type: 'all',
                text: 'All'
            }]
        },
exporting:{enabled:false},
        title: {
            text: symbol + ' Stock Value'
        },

        yAxis: [{
            title: {
                text: 'Stock Value'
            },
            height: 200,
            lineWidth: 2
        }],
        
        series: [{
            type: 'area',
            name: symbol,
            data: ohlc,    
          fillColor : {
            linearGradient : {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
            },
            stops : [
                [0, Highcharts.getOptions().colors[0]],
                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
        }
        }],
        credits: {
            enabled:false
        }
    });
};

