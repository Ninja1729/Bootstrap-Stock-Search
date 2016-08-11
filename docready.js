/********************************** Initial Function ************************************/
$(document).ready(function(){
        
    //Local Storage
    if(typeof(Storage) !== "undefined") {
        if(localStorage.user!=null){
                updteLocSto();
                refreshvals();

            }

    }
        
    //ToolTip
    $('[data-toggle="tooltip]').tooltip();
        
    //Form Submit
    $("#nformid").submit(function(e){
        e.preventDefault();
        var symbol = document.getElementById("nsrchtb").value.split("-");
        if (symbol[0] != ""){
                
            $.ajax({
                type: 'GET',
                url: 'http://ninja-1.crpqbfpuau.us-west-2.elasticbeanstalk.com/?quot='+symbol[0],
                success: function(data) {
                   	$('#failure').empty();
                    $('#right').prop('disabled', false);
                    updateTable(data);
                    updateChart(symbol[0]);
                    newsfunc(symbol[0]);
                    histfunc(symbol[0]);
					colorfavbutt();
                    
                }

            });
         }
    });
    
    //Clear Button
    $("#nclearbtn").click(function(){
        document.getElementById("nsrchtb").value = "";
        $('#failure').empty();
        $('#cont2').removeClass('item active');
        $('#cont2').addClass('item');
        $('#cont1').removeClass('item');
        $('#cont1').addClass('item active');
        $('#right').prop('disabled', true);
    });
      
    //AutoComplete
    $("#nsrchtb").autocomplete({ 
        source: function (request, response) {
            $.ajax({
              url: "http://ninja-1.crpqbfpuau.us-west-2.elasticbeanstalk.com/",
              dataType: "json",
              data: {
                look:  $("#nsrchtb").val()
              },
              success: function( data ) {
                response( data );
              }
            });
        }
    });
  
}); 


/********************************** To Update Stock Table ************************************/

function updateTable(data){
        var data1 = JSON.parse(data);
        message = data1.Message;
    if(data1.Status=="Failure|APP_SPECIFIC_ERROR")
					{
					$('#failure').append('No stock information available');
					$('#right').prop('disabled', true);
					}
        if(message == undefined){


        nname = data1.Name;
        nsymbol=data1.Symbol;
        nlastprice=data1.LastPrice;
        nchange=data1.Change;
        nchangepercent=data1.ChangePercent;
        ntimestamp=data1.Timestamp;
        nmarketcap=data1.MarketCap;
        nvolume=data1.Volume;
        nlastprice=data1.LastPrice;
        nchangepercentytd=data1.ChangePercentYTD;
        nchangeytd=data1.ChangeYTD
        nhigh=data1.High;
        nlow=data1.Low;
        nopen=data1.Open;   

        nlastpricenew=parseFloat(nlastprice);
        nlastpricenew=nlastpricenew.toFixed(2);
        nchangenew=parseFloat(nchange);
        nchangenew=nchangenew.toFixed(2);

        nchangepercentnew=parseFloat(nchangepercent);
        nchangepercentnew=nchangepercentnew.toFixed(2);
        nchangeytdnew=parseFloat(nchangeytd);
        nchangeytdnew=nchangeytdnew.toFixed(2);
        nchangepercentytdnew=parseFloat(nchangepercentytd);
        nchangepercentytdnew=nchangepercentytdnew.toFixed(2);
        nhighnew=parseFloat(nhigh);
        nhighnew=nhighnew.toFixed(2);
        nlownew=parseFloat(nlow);
        nlownew=nlownew.toFixed(2);
        nopennew=parseFloat(nopen);
        nopennew=nopennew.toFixed(2);
        ntimestamp = moment();
        ntimestampnew = ntimestamp.format('DD MMMM YYYY, hh:mm:ss a');


        if(nchangepercentnew<0)
            {
                imgsource=dnimg;
                color3="red";
            }
            else{
                imgsource=upimg;
                color3="green";
            }

        if(nchangepercentytdnew<0)
            {
                imgsourceyt=dnimg;
                color4="red";
            }
            else{
                imgsourceyt=upimg;
                color4="green";
            }
        if(nmarketcap<=10000000 && nmarketcap>=1000000)
            {
                nmarketcap=nmarketcap/1000000;
                nmarketcap=parseFloat(nmarketcap);
                nmarketcap=nmarketcap.toFixed(2);
                unit="M";
            }
        else if(nmarketcap>10000000)
            {
                nmarketcap=nmarketcap/1000000000;
                nmarketcap=parseFloat(nmarketcap);
                nmarketcap=nmarketcap.toFixed(2);
                unit="B";
            }
        else{
                nmarketcap=parseFloat(nmarketcap);
                nmarketcap=nmarketcap.toFixed(2);
                unit="";
        }

        $('#nstktable > tbody').empty();
        $('#nstktable > tbody:last').append('<tr><th>Name</th><td>'+nname+'</td></tr>');
        $('#nstktable > tbody:last').append('<tr><th>Symbol</th><td>'+nsymbol+'</td></tr>');
        $('#nstktable > tbody:last').append('<tr><th>Last Price</th><td>$'+nlastpricenew+'</td></tr>');
        $('#nstktable > tbody:last').append('<tr><th>Change (Change Percent)</th><td style="color:'+color3+';">'+nchangenew+'('+nchangepercentnew+'%) '+'<img src='+imgsource+'>'+'</td></tr>');
        $('#nstktable > tbody:last').append('<tr><th>Time and Date</th><td>'+ntimestampnew+'</td></tr>');
        $('#nstktable > tbody:last').append('<tr><th>Market Cap</th><td>'+nmarketcap+' '+unit+'</td></tr>');
        $('#nstktable > tbody:last').append('<tr><th>Volume</th><td>'+nvolume+'</td></tr>');
        $('#nstktable > tbody:last').append('<tr><th>Change YTD (Change Percent YTD)</th><td style="color:'+color4+';">'+nchangeytdnew+'('+nchangepercentytdnew+'%) '+'<img src='+imgsourceyt+'>'+'</td></tr>');
        $('#nstktable > tbody:last').append('<tr><th>High Price</th><td>$'+nhighnew+'</td></tr>');
        $('#nstktable > tbody:last').append('<tr><th>Low Price</th><td>$'+nlownew+'</td></tr>');
        $('#nstktable > tbody:last').append('<tr><th>Opening Price</th><td> $'+nopennew+'</td></tr>');



        }else{
            $('#failure').empty();
            $('#right').prop('disabled', true);
            $('#failure').append('Select a valid entry');
        }
       
    
}

/********************************** To Update the Yahoochart ************************************/
function updateChart(sym){
    $('#yahoochart').empty();
    $('#yahoochart').prepend('<center><img id="ychartImg" class="img-responsive" src="http://chart.finance.yahoo.com/t?s='+sym+'&lang=en-US&width=400&height=300"/></center>');
}

/********************************** To Update the Favourite List Table ************************************/
function updteLocSto(){
                var locsto = JSON.parse(localStorage.user);
                var len = locsto.name.length;

				var tx ='';
				for(var i=0;i<len;i++){
				if(locsto.name[i].change<0){
                    col="red";
                }
                    if(locsto.name[i].change>0){
                        col="green";
                    }
				tx += '<tr><td><a href="#" onclick="clickfav('+i+')">'+locsto.name[i].symbol+'</a></td><td>'+locsto.name[i].name+'</td><td>'+locsto.name[i].lastprice+'</td><td style="color:'+col+';">'+locsto.name[i].change+'('+locsto.name[i].changepercent+'%) '+'<img src='+locsto.name[i].imgsrc+'>'+'</td><td>'+locsto.name[i].marketcap+' '+locsto.name[i].unit+'</td><td><button type="button" class="btn btn-default btn-md" style="background-color:#E3E3E3"; onclick="deletefav('+i+')" ><p class="glyphicon glyphicon-trash"></p></button></td></tr>';
				}
                $('#nfavtable tbody').html(tx);
				
}

/********************************** To Refresh Values ************************************/
function refreshvals(){

	    var locsto = JSON.parse(localStorage.user);
		var len = locsto.name.length;
		var i; var flag=0;
		var favTable = document.getElementById('nfavtable');
		var cell;
		for(i=0;i<len;i++){

			$.ajax({
                type: 'GET',
                url: 'http://ninja-1.crpqbfpuau.us-west-2.elasticbeanstalk.com/?quot='+locsto.name[i].symbol,
                success: function(data) {
					var data1 = JSON.parse(data);
	                var currsymb = data1.Symbol;
					
                    var val1 = parseFloat(data1.LastPrice.toFixed(2));
					
                    nchangenew=parseFloat(data1.Change);
                    nchangenew =nchangenew.toFixed(2);
                    
                    
                    nchangepercentnew=parseFloat(data1.ChangePercent);
                    nchangepercentnew= nchangepercentnew.toFixed(2);
                    
					if(nchangepercentnew<0)
                    {
                        imgsource= dnimg;
                    }
                    else{
                        imgsource= upimg;
                    }
					cell=nchangenew+'('+nchangepercentnew+'%)'+'<img src='+imgsource+'>';
                
          
					var val2 = cell;
					var j;
					for(j=0;j<len;j++){
						if(locsto.name[j].symbol==currsymb){
							favTable.rows[j+2].cells[2].innerHTML = val1;
							favTable.rows[j+2].cells[3].innerHTML = val2;
							break;
						}
					}

				} 
            });
			
		}
}
/********************************** Auto Refresh ************************************/
function refrfunc(){
		$('#nrefrchckbox').checked = !($('#nrefrchckbox').checked);		
		if($('#nrefrchckbox').is(":checked")){
			clearInterval(intr);  
		}
		else{
			intr = setInterval(refreshvals, 5000);
		}
	  }