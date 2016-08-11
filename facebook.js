  	 

/********************************** Facebook Functionality ************************************/
function fbbtnclick() {
    var fbimgurl = $('#ychartImg').attr('src');
    var fbtitle = 'Current Stock Price of ' + nname + ' is $' + nlastprice.toFixed(2);
	var fbname = 'Stock Information of '+nname+'('+nsymbol+')';
	var fbcaption = 'last trade price: $ '+nlastprice.toFixed(2)+', change: '+nchangenew+'('+nchangepercentnew+'%)';
    FB.init({
        appId: '127206297677842',
        status: true,
        cookie: true,
        xfbml: true
    }); 
    FB.ui(
   {
     method: 'share',
	 href: 'http://dev.markitondemand.com/',
	 title: fbtitle,
     description: fbname,
     picture: fbimgurl,
     caption: fbcaption,
   },
   function(response) {
    if (response && response.post_id)  {
       alert('Post was published.');
     } else {
       alert('Post was not published.');
     }
   }
 ); 
	  
return false;

}

/********************************** Click on Table Row ************************************/
function clickfav(rownum){
		var locsto = JSON.parse(localStorage.user);
		$.ajax({
                type: 'GET',
                url: 'http://ninja-1.crpqbfpuau.us-west-2.elasticbeanstalk.com/?quot='+locsto.name[rownum].symbol,
                success: function(data) {
                   	 $('#failure').empty();
                     $('#right').prop('disabled', false);
                     updateTable(data);
                     updateChart(locsto.name[rownum].symbol);
                     newsfunc(locsto.name[rownum].symbol);
                     histfunc(locsto.name[rownum].symbol);
                     histfunc(locsto.name[rownum].symbol);
					 colorfavbutt();

                }
        });             
}

/********************************** Delete Table Row ************************************/
function deletefav(abc){

			var locsto = JSON.parse(localStorage.user);
			locsto.name.splice(abc,1);
			var len = locsto.name.length;
			if(len==0){
			 $('#right').prop('disabled', true);	
			}
			var tx ='';
			var user = {'name':[]};
	
			var item;
			for(var i=0;i<len;i++){
                
                if(locsto.name[i].change<0){
                    col="red";
                }
                    if(locsto.name[i].change>0){
                        col="green";
                    }
	
				tx += '<tr><td><a href ="#" onclick="clickfav('+i+')">'+locsto.name[i].symbol+'</a></td><td>'+locsto.name[i].name+'</td><td>'+locsto.name[i].lastprice+'</td><td style="color:'+col+';">'+locsto.name[i].change+'('+locsto.name[i].changepercent+'%) '+'<img src='+locsto.name[i].imgsrc+'>'+'</td><td>'+locsto.name[i].marketcap+' '+locsto.name[i].unit+'</td><td><button type="button" class="btn btn-default btn-md" style="background-color:#E3E3E3"; onclick="deletefav('+i+')" ><p class="glyphicon glyphicon-trash"></p></button></td></tr>';
				item = {'num':i,'symbol':locsto.name[i].symbol, 'name' : locsto.name[i].name, 'lastprice': locsto.name[i].lastprice, 'change':locsto.name[i].change,'changepercent':locsto.name[i].changepercent,'imgsrc':locsto.name[i].imgsrc, 'marketcap': locsto.name[i].marketcap, 'unit' : locsto.name[i].unit};
				user.name.push(item);
			}

			$('#nfavtable tbody').html(tx);
			localStorage.setItem('user', JSON.stringify(user));
	
}
/********************************** Favourite Button Update ************************************/

function colorfavbutt(){
    var locsto = JSON.parse(localStorage.user);
	var len = locsto.name.length;
	var i; var flag=0;
	for(i=0;i<len;i++){
			if(locsto.name[i].symbol==nsymbol){
				flag=1;
				break;
			}	
		}
	if(flag==0){
		$('#nfavbtn').empty();
		var p = '<p><span class="glyphicon glyphicon-star white"></span></p>';
		$('#nfavbtn').html(p);
	}
	else{
		$('#nfavbtn').empty();
		var p = '<p><span class="glyphicon glyphicon-star yellow"></span></p>';
		$('#nfavbtn').html(p);
	}
}

/********************************** On Favourite Button Click ************************************/
function favbtnclick(){
	if(typeof(Storage) !== "undefined") {
	if(localStorage.user!=null){
		var locsto = JSON.parse(localStorage.user);
		var len = locsto.name.length;
		var i; var flag=0;

		for(i=0;i<len;i++){
			if(locsto.name[i].symbol==nsymbol){
				flag=1;
				break;
			}	
		}
		if(flag==0){
			$('#nfavbtn').empty();
			var p = '<p><span class="glyphicon glyphicon-star yellow"></span></p>';
			$('#nfavbtn').html(p);
            localStorage.num++;
            var item = {'fav':1,'num':localStorage.num,'symbol':nsymbol, 'name' : nname, 'lastprice': nlastpricenew, 'change':nchangenew,'changepercent':nchangepercentnew,'imgsrc':imgsource, 'marketcap': nmarketcap, 'unit' : unit};
            locsto.name.push(item);
            len = locsto.name.length;
            localStorage.setItem('user', JSON.stringify(locsto));
            updteLocSto();
  			refreshvals();
		}
		else{
			$('#nfavbtn').empty();
			var p = '<p><span class="glyphicon glyphicon-star white"></span></p>';
			$('#nfavbtn').html(p);
			deletefav(i);
		}
	}	
	else{
            localStorage.num = 0;
            var user = {'name':[{'fav':1,'num':localStorage.num,'symbol':nsymbol, 'name' : nname, 'lastprice': nlastpricenew, 'change':nchangenew,'changepercent':nchangepercentnew,'imgsrc':imgsource, 'marketcap': nmarketcap, 'unit' : unit}]};
            localStorage.setItem('user', JSON.stringify(user));
            updteLocSto();
            $('#nfavbtn').empty();
            var p = '<p><span class="glyphicon glyphicon-star yellow"></span></p>';
            $('#nfavbtn').html(p);
            refreshvals();
	   }
	} 
	else {
     alert("Sorry! No Web Storage support..");
	}
}