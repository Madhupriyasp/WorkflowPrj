
$().ready(function() {
	
    if(internal_flag == "false" && fetch_flag == "false")
	{
    	
//	document.getElementById('manage').style.opacity = '1';
//		document.getElementById('internalAction').style.opacity = '0.25';
    	
    //	document.getElementById('manage').addClass('opacityclass');
    	
	}
else if(internal_flag == "true")
{
	document.getElementById('internalAction').style.opacity = '1';
 //   document.getElementById('manage').style.opacity = '0.25';
}
else if(fetch_flag == "true")
{
	document.getElementById('fetchtab').style.opacity = '1';
	document.getElementById('internalAction').style.opacity = '0.25';
	document.getElementById('manage').style.opacity = '0.25';
}
    
  if(document.URL.indexOf("accno") != -1 && document.URL.indexOf("&fetch") != -1)
    {
    	document.getElementById('manage').style.color = '#ffffff';
    	document.getElementById('fetchtab').style.color = '#ffffff';
    	document.getElementById('internalAction').style.opacity = '1.0';
    	document.getElementById('manage').style.opacity = '1.0';	
    }
});


var searchData	= [];
// Sorting interaction history according to date 
	function sortedintractionhistory(interactionHistory)
	{
			var temp	=	'';
			var dates	=	new Array();
			var interactionList  =  new Array();
			var interactionHis	 =	interactionHistory;
			$.each(interactionHis, function(i, interactionsMap) 	
				{
						dates[i]	=	interactionsMap.date;			
				});
				for(i=0;i<dates.length;i++){
		          for(j=i;j<dates.length;j++){
		               	if(dates[i] > dates[j]){
		               		temp	=dates[i];
		               		dates[i]=dates[j];
		               		dates[j]=temp;
		               }
		           }
				}
			for(i=0;i<dates.length;i++)
			{
		         var orderedDate	=	dates[i];
		         $.each(interactionHis, function(i, interactionsMap) 	
		     			{
		     				if(orderedDate 	==	interactionsMap.date){
		     				
		     					var tempInteractionMap =  new Object();
		     	
		     					tempInteractionMap['AgentLogin'] 	=  interactionsMap.AgentLogin;	
		     					tempInteractionMap['connectionId'] 	=  interactionsMap.connectionId;
		     					tempInteractionMap['action'] 		=  interactionsMap.action;
		     					tempInteractionMap['dateAdded'] 	=  interactionsMap.dateAdded;
		     					tempInteractionMap['date'] 			=  interactionsMap.date;
		     					interactionList.push(tempInteractionMap);
		     					
		     				}	
		     			});     
		     }

			return interactionList;
	}
// sorting by accending order
function sortByAsc(prop){
		   return function(a,b){
		      if( a[prop] > b[prop]){
		          return 1;
		      }else if( a[prop] < b[prop] ){
		          return -1;
		      }
		      return 0;
		   }
		}
function sortByAccountNum(){
	var temp		=	currentdata;
	var sortedArrey	=	temp.sort( sortByAsc("subAccountNumber"));

	initiateTable();
	iteration=0;
	appendTable(sortedArrey);
		
}
function sortByDomainName(){
	var temp		=	currentdata;
	var sortedArrey	=	temp.sort( sortByAsc("domainames"));
	initiateTable();
	iteration=0;
	appendTable(sortedArrey);
}
function sortByAgentLogin(){
	var temp		=	currentdata;
	var sortedArrey	=	temp.sort( sortByAsc("AgentLogin"));
	initiateTable();
	iteration=0;
	appendTable(sortedArrey);
		
}
function sortByAction(){
	var temp		=	currentdata;
	var sortedArrey	=	temp.sort( sortByAsc("action"));

	initiateTable();
	iteration=0;
	appendTable(sortedArrey);
		
}
function sortByDateAdded(){											
	var temp = currentdata;
	var sortedArrey	=	temp.sort(sortByAscDate());
	initiateTable();
	iteration=0;
	appendTable(sortedArrey);
		
}
function sortByAscDate(){										
	   return function(a,b){
		      if( a.interactionHistory[0].dateAdded > b.interactionHistory[0].dateAdded){
		          return 1;
		      }else if( a.interactionHistory[0].dateAdded < b.interactionHistory[0].dateAdded ){
		          return -1;
		      }
		      return 0;
		   }
	}
function sortByCompletedDate(){
	var temp		=	currentdata;
	var sortedArrey	=	temp.sort(sortByAscDateCompleted());

	initiateTable();
	iteration=0;
	appendTable(sortedArrey);
		
}
function sortByAscDateCompleted(){										
	   return function(a,b){
		   var	index = a.interactionHistory.length-1;
		   var	indexb = b.interactionHistory.length-1;
		   var aTime;
		   var bTime;
		   if(a.interactionHistory[index].action != 'Completed' && a.interactionHistory[index].action != 'Completed-Resolved' && a.interactionHistory[index].action != 'Completed-F8' && a.interactionHistory[index].action != 'closed' && a.interactionHistory[index].action != 'Callended' && a.interactionHistory[index].action != 'Dialout')
			   aTime = 0;
		   else
			   aTime = a.interactionHistory[index].dateAdded;
		   if(b.interactionHistory[indexb].action != 'Completed' && b.interactionHistory[indexb].action != 'Completed-Resolved' && b.interactionHistory[indexb].action != 'Completed-F8' && b.interactionHistory[indexb].action != 'closed' && b.interactionHistory[indexb].action != 'Callended' && b.interactionHistory[indexb].action != 'Dialout')
			   bTime = 0;
		   else
			   bTime =  b.interactionHistory[indexb].dateAdded;
		   if( aTime > bTime){
			   return 1;
		   }
		   else if(aTime < bTime ){
			   return -1;	
		   }
		   return 0;   
	   }
}

function sortByAnswerTime(){
	var temp		=	currentdata;
	var sortedArrey	=	temp.sort( sortByAsc("AnsTime"));

	initiateTable();
	iteration=0;
	appendTable(sortedArrey);
		
}
function sortByTimeSpent(){
	var temp		=	currentdata;
	var sortedArrey	=	temp.sort( sortByAsc("TimeSpent"));

	initiateTable();
	iteration=0;
	appendTable(sortedArrey);
		
}
function sortByTimeCompleted(){
	var temp		=	currentdata;
	var sortedArrey	=	temp.sort(sortByAsc("TimeToComplete"));
	
	initiateTable();
	iteration=0;
	appendTable(sortedArrey);
}
//sorting by descending order
function sortByDec(prop){
		   return function(b,a){
		      if( a[prop] > b[prop]){
		          return 1;
		      }else if( a[prop] < b[prop] ){
		          return -1;
		      }
		      return 0;
		   }
		}
function sortByAccountNumDec(){
	var temp		=	currentdata;
	var sortedArrey	=	temp.sort( sortByDec("subAccountNumber"));

	initiateTable();
	iteration=0;
	appendTable(sortedArrey);
		
}
function sortByDomainNameDec(){
	var temp		=	currentdata;
	var sortedArrey	=	temp.sort( sortByDec("domainames"));
	initiateTable();
	iteration=0;
	appendTable(sortedArrey);
		
}
function sortByAgentLoginDec(){
	var temp		=	currentdata;
	var sortedArrey	=	temp.sort( sortByDec("AgentLogin"));

	initiateTable();
	iteration=0;
	appendTable(sortedArrey);
		
}
function sortByActionDec(){
	var temp		=	currentdata;
	var sortedArrey	=	temp.sort( sortByDec("action"));

	initiateTable();
	iteration=0;
	appendTable(sortedArrey);
		
}
function sortByDateAddedDec(){											
	var temp = currentdata;
	var sortedArrey	=	temp.sort(sortByDateDec());				

	initiateTable();
	iteration=0;
	appendTable(sortedArrey);
		
}
function sortByDateDec(){										
	   return function(b,a){
		      if( a.interactionHistory[0].dateAdded > b.interactionHistory[0].dateAdded){
		          return 1;
		      }else if( a.interactionHistory[0].dateAdded < b.interactionHistory[0].dateAdded ){
		          return -1;
		      }
		      return 0;
		   }
	}
function sortByCompletedDateDec(){
	var temp		=	currentdata;
	var sortedArrey	=	temp.sort( sortByDateCompletedDec());		

	initiateTable();
	iteration=0;
	appendTable(sortedArrey);
}
function sortByDateCompletedDec(){									
	   return function(b,a){
		   var	index = a.interactionHistory.length-1;
		   var	indexb = b.interactionHistory.length-1;
		   var aTime;
		   var bTime;
		   if(a.interactionHistory[index].action != 'Completed' && a.interactionHistory[index].action != 'Completed-Resolved' && a.interactionHistory[index].action != 'Completed-F8' && a.interactionHistory[index].action != 'closed' && a.interactionHistory[index].action != 'Callended' && a.interactionHistory[index].action != 'Dialout')
			   aTime = 0;
		   else
			   aTime = a.interactionHistory[index].dateAdded;
		   if(b.interactionHistory[indexb].action != 'Completed' && b.interactionHistory[indexb].action != 'Completed-Resolved' && b.interactionHistory[indexb].action != 'Completed-F8' && b.interactionHistory[indexb].action != 'closed' && b.interactionHistory[indexb].action != 'Callended' && b.interactionHistory[indexb].action != 'Dialout')
			   bTime = 0;
		   else
			   bTime =  b.interactionHistory[indexb].dateAdded;
		   if( aTime > bTime){
			   return 1;
		   }
		   else if(aTime < bTime ){
			   return -1;	
		   }
		   return 0;   
	   }
}
function sortByAnswerTimeDec(){
	var temp		=	currentdata;
	var sortedArrey	=	temp.sort( sortByDec("AnsTime"));

	initiateTable();
	iteration=0;
	appendTable(sortedArrey);
		
}
function sortByTimeSpentDec(){
	var temp		=	currentdata;
	var sortedArrey	=	temp.sort( sortByDec("TimeSpent"));

	initiateTable();
	iteration=0;
	appendTable(sortedArrey);
		
}
function sortByTimeCompletedDec(){
	var temp		=	currentdata;
	var sortedArrey	=	temp.sort(sortByDec("TimeToComplete"));
	
	initiateTable();
	iteration=0;
	appendTable(sortedArrey);
}
function recreateDataToSort(currentDatatosort, type){
	
	var formattedData	=	new Array();
	var unformattedData	=	currentDatatosort;

	$.each(unformattedData, function(i, interactionsMap) {

		var ttimestamp	=	getTimeSpent(JSON.stringify(interactionsMap));
		var status		=	interactionsMap.action

		if	(status.indexOf('Completed') != -1 || status.indexOf('closed') != -1 || status.indexOf('Callended') != -1 || status.indexOf('Dialout') != -1 )
		{
			
		var ttimestamp	=	getTimeSpent(JSON.stringify(interactionsMap));
		var tempArray	=	ttimestamp.split(":")
		var hour		=	parseInt(tempArray[0]);
		var minute		=	parseInt(tempArray[1]);
		var second		=	parseInt(tempArray[2]);
		var timeinsec	=	(hour * 60 * 60)+(minute * 60)+(second);
		if(isNaN(timeinsec)){
			interactionsMap.TimeSpent = 0;
		}
		else{
			interactionsMap.TimeSpent = timeinsec;
		}
		}
		else{
		var realtime	=	realTimeCalculater(interactionsMap);
		
		if(realtime == null || realtime == undefined)
		{
			return null;
		}
		var tempArray	=	realtime.split(":")
		var hour		=	parseInt(tempArray[0]);
		var minute		=	parseInt(tempArray[1]);
		var second		=	parseInt(tempArray[2]);
		var timeinsec	=	(hour * 60 * 60)+(minute * 60)+(second);
		if(isNaN(timeinsec)){
			interactionsMap.TimeSpent = 0;
		}
		else{
			interactionsMap.TimeSpent = timeinsec;
		}

		}

		var ttimestamp	=	getAnswerTime(JSON.stringify(interactionsMap));
		if(ttimestamp	!= "NA"){
		var tempArray	=	ttimestamp.split(":")
		var hour		=	parseInt(tempArray[0]);
		var minute		=	parseInt(tempArray[1]);
		var second		=	parseInt(tempArray[2]);
		var timeinsec	=	(hour * 60 * 60)+(minute * 60)+(second);
		interactionsMap.AnsTime = timeinsec;
		}
		else{
			interactionsMap.AnsTime = 0;
		}
	
		if(interactionsMap.AgentLogin	==	null || interactionsMap.AgentLogin	==	'undefined' ||interactionsMap.AgentLogin	==	''||interactionsMap.AgentLogin	==	'null'){
		
			delete interactionsMap.AgentLogin;
			interactionsMap.AgentLogin = "na";
		}
		else{
			var tagentLogin	=	interactionsMap.AgentLogin;
			delete interactionsMap.AgentLogin;
			interactionsMap.AgentLogin = tagentLogin.toLowerCase();
		}
		formattedData.push(interactionsMap);
	});
	
	currentdata	=	formattedData;
	if( type === "search"){
		initiateTable();
		iteration=0;
		appendTable(currentdata);
	}

}
function realTimeCalculater(interactionmap){
	
	var currentTime     = new Date().getTime();
	var interactionData = interactionmap.interactionHistory;
	
	for (var i=interactionData.length-1;i>=0;i--)
			{
				 
				 var timediff =	 millisecondsToTime(currentTime - interactionData[i].date);
					break;
			}
	return timediff;
}
function sortDomainNames()
{
	
	for(var i=0;i< currentdata.length;i++)
	{
		var subacc	=	currentdata[i].subAccountNumber;
		$.each(dd.domainMap.list,function(index,value){
			
           if(value == subacc)
           {
        	   currentdata[i].domainames= dd.domainMap[subacc];
           }

		});
		
	}
}
