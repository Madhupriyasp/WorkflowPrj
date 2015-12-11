var	fromAll			=	"false";
var messageWindow = new MessageWindow();
messageWindow.injectMain();

window.idContainer = [];
window.failidContainer = [];
window.arrayLengthcounter;
window.currentArcounter;
window.singleSelection;
window.actualJsonData={};
window.counterMap={};
window.daysfetched;

$(document).ready(function()
{	
	dd.currentSelection = "all";
    dd.initializeData();
	doInitialAction();
	dd.displayInteractionByStatus("all");
	$(".task").trigger("click");
});


function doInitialAction()
{
	dd.initializeSpinner();
	var fromDate=	$('#inputDate1').val();
	var toDate	=	$('#inputDate2').val();
	var validatedateresult	=	ValidateDates(new Date(fromDate),new Date(toDate));
	if(String(validatedateresult).match(true))
	{
		$('#loading_img').show();
		loadInteractions_gae_all();
	}
}

function initiateTable()
{
	$("#table_data").html("");
}

function formateDate(date)
{
	var dates 		= 	new Date(date);
	var getmonth_date = parseInt(dates.getMonth())+1;
	if(!(getmonth_date>=10))
	{
		var formatMonth = "0";
		getmonth_date = formatMonth.concat(getmonth_date);
	}
	var getDate = dates.getDate();
	if(!(getDate>=10))
	{
		var formatMonth = "0";
		getDate = formatMonth.concat(getDate);
	}
	var date		= getDate+"/"+getmonth_date+"/"+dates.getFullYear();
	return date;
}

function ValidateDates(fromDate,toDate)
{
	var currentDate	= new Date();
	if(fromDate <= currentDate || toDate <= currentDate)
	{	
		if(toDate >= fromDate)
			return true ;
		else 
		{
			alertBox.show('Alert!',"Oops! Date Range is not valid. Please check.");
			setTimeout(function(){dd.hideLoadingSpinner("everything");},100);	
			return false ;
		}
	}
	else
	{
		alertBox.show('Alert!',"Oops! Date Range is not valid. Please check.");
		setTimeout(function(){dd.hideLoadingSpinner("everything");},100);	
		return false ;
	}

}

//Filling Dates at start up
function fillDateFieldsWithLatestDates()
{
	var currentDate = new Date();

	var todate= currentDate.getMonth()+ 1 +"/"+ currentDate.getDate()+"/"+currentDate.getFullYear();
	document.getElementById('inputDate2').value = todate ;
	document.getElementById('inputDate1').value = todate ;

}

function getFromDateFormatted()
{
	var fDate	= $("#inputDate1").val();

	var fDateArray	=	fDate.split("/");

	if(fDateArray.length == 3)
	{
		if(fDateArray[0]<10 && fDateArray[0].lenght<2){fDateArray[0]='0'+fDateArray[0];} if(fDateArray[1]<10 && fDateArray[1].lenght<2){fDateArray[1]='0'+fDateArray[1];}
		fDate			=	fDateArray[0]+"-"+fDateArray[1]+"-"+fDateArray[2];
	}
	else
	{
		fDate			=	getFormattedTodayDate();
	}

	return fDate;
}


function getToDateFormatted()
{
	var tDate	= $("#inputDate2").val();

	var tDateArray	=	tDate.split("/");

	if(tDateArray.length == 3)
	{
		if(tDateArray[0]<10 && tDateArray[0].lenght<2){tDateArray[0]='0'+tDateArray[0];} if(tDateArray[1]<10 && tDateArray[1].lenght<2){tDateArray[1]='0'+tDateArray[1];}

		tDate			=	tDateArray[0]+"-"+tDateArray[1]+"-"+tDateArray[2];
	}
	else
	{
		tDate			=	getFormattedTodayDate();
	}

	return tDate;
}

function getFormattedTodayDate()
{
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; 

	var yyyy = today.getFullYear();

	if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} 

	today = mm+'-'+dd+'-'+yyyy;

	return today;
}
function loadInteractions_gae_all(){
	counterMap 				=   {};	
	daysfetched				=   null;
	var fromDate 			= 	null;
	var toDate	 			=	null;
	dd.showLoadingSpinSymbol();
	initiateTable();
	
	fromDate     = getFromDateFormatted();
	toDate	 	 = getToDateFormatted();
	var datediff	=	getdatediff(fromDate,toDate);
	if(ValidateDates( new Date(fromDate.split("-").join("/")), new Date(toDate.split("-").join("/") ) )){
		if(datediff == 0)
			{
			daysfetched = 1;
			}
		else
		{
			daysfetched = datediff;
			}
		actualJsonData = {};
		for(var j=0;j<=datediff;j++)
		{
//			setTimeout(function(){loadInteractions_gae_new(fromDate,j);},1000);	
			loadInteractions_gae_new(fromDate,j);	  
			fromDate	=	getincrementedDate(fromDate);
		}
	}
	spinnerload.stop();
	return;
}

function loadInteractions_gae_new(fromDate,j)
{
	var toDate 				=	null;
	var cacheCursor			=	"noCache";
	var accNo 				=   [];
	var accNoStr            =   "";
	toDate	 			    = 	getToDateFormatted();	
	
	$('#dataIn').hide();
	$('#loading_img').show();
	Actions.showLoading("loading data ...");

		if(true )
			{
				if(internal_flag == "true" && fetch_flag == "false"){
					url 	=	"/getAllArInteractionsNew/"+fromDate+"/"+fromDate+"/"+"cursor"+"/"+cacheCursor+"/true"+"?internal=true";
					getAllArInteractions(url,fromDate,j);
				}
				else if(fetch_flag == "true")
				{
					if(fatch_acc == undefined || fatch_acc == null || fatch_acc == '')
					{
						var accString = $("#accNo").val();
						accString = accString.trim();
						var accArray = accString.split(",");
						var accArray2 = [];
						for (var i=0; i<accArray.length; i++)
							{
							var subaccountsList			= 	[];
							var tempString = accArray[i].trim();
							var url 	=	"/fetchSubaccounts?subAccountNumber=null&accountNumberorSkill="+tempString;
							$.ajax
							({
								type : "GET",
								url : url,
								async:false,
								success : function(data)
								{
									try
									{
										var dataMap				=	JSON.parse(data);
										var accountList			=	[];
										console.log("data length is"+dataMap.length)
										for(var i=0; i < dataMap.length ; i++)
										{
											var indivdualMap	=	dataMap[i];
											accountList.push(indivdualMap.subAccountNumber);
										}
									}
									catch(exceptionObject)
									{
										subaccountsList.push(tempString);
										console.error(exceptionObject)
									}
									console.log("accountList",accountList)
									subaccountsList			= 	[];
									if(accountList.length==0 && !isNaN(tempString))
									{
										 subaccountsList.push(tempString);
										 setTimeout(function(){dd.hideLoadingSpinner("everything");},100);
									}
									else
									{
										for (var i = 0; i < accountList.length; i++) 
										{
											var singleSubaccountNumber = accountList[i];
											subaccountsList.push(singleSubaccountNumber);
										}
									}
								}
							});
							for (var k=0; k < subaccountsList.length; k++)
							{
								var singleSubAccount = "";
								singleSubAccount = subaccountsList[k];
								accArray2.push(singleSubAccount);
							}
							}

						 accNo = accArray2;
						
					}else{
						accNo.push(fatch_acc); //flow modify
						$("#accNo").val(fatch_acc);
						$("#fetchedaccount").val(fatch_acc);
						fatch_acc = null;
						
					}
					var splittedSubAccNo = splitSubAccountNumberArrayToMakeServerCall(accNo);
					
					for(var i=0; i < splittedSubAccNo.length ; i++){
						var accNoStr = JSON.stringify(splittedSubAccNo[i]);
						url 	=	"/getAllArInteractionsNew/"+fromDate+"/"+fromDate+"/"+"cursor"+"/"+cacheCursor+"/true"+"?internal=false&accNo="+accNoStr;
						getAllArInteractions(url,fromDate,j,accNoStr);
					}
				}
				else
				{
					url 	=	"/getAllArInteractionsNew/"+fromDate+"/"+fromDate+"/"+"cursor"+"/"+cacheCursor+"/true"+"?internal=false";
					getAllArInteractions(url,fromDate,j);
				}
			}
}


function getAllArInteractions(url,fromDate,j,accNo){
	
	
	var len					=	0;
	var type				=   "default";
	var newCurser			=	"start";
	var currentCurser		=	new Date().getTime()+"SS"+Math.floor(Math.random() * 1000);
	
	console.info("ajax url for getting interactions ::"+url);
	   var startTimeBeforeCall = new Date().getTime();
	   
	   
	$.ajax
	({
		type : "POST",
		url : url,
		async:true,
		success : function(data)
		{
			var endTimeAfterCall = new Date().getTime();
			console.log(endTimeAfterCall - startTimeBeforeCall);
			console.info("the controller has returned a success for the ajax call");
			var dataui = data
			if(data == "no data for this time range")
				{
				$(".modal-backdrop.fade.in" ).remove();
				console.log("no data received for this date bob");
				if(j == daysfetched-1)
				{
				console.log("stopping all spinners")	
				$('.spinner').css( "display", "none" );	
				setTimeout(function(){dd.hideLoadingSpinner("everything");},100);	
				}
				return
				}
			var totalData			=   JSON.parse(dataui);
			var interactionsString 	=	totalData.ResultMap;
			var cursorControl		=	totalData.datefornextquery;
			var fetchedData			=   totalData.fetchedValue;
			var cacheCursorValue    =   totalData.cacheCursor;
			var continueToQuery		=	true;
			var queryAgain			=   true;
			var jsondata 			=   "";
			console.info("this is the cursor value returned"+cursorControl);
			
			if(interactionsString == "query again")
			{
				console.log("gonna query Again coz we havent queried evrything yet");
				continueQueryAgain(type,fromDate,nextQuerydate,j,fetchedData,accNo, cacheCursorValue);
			}
			
			else if(cacheCursorValue != "noCache" && cursorControl == "no-overflow-here")
			{
				queryAgain  = false;
				console.info("no more queries will be made, all data has been fetched");
			}
			else if(cursorControl == "no-overflow-here" || cursorControl == undefined)
			{
				queryAgain  = false;
				console.info("no more queries will be made, all data has been fetched");
			}
			else
			{
				var nextQuerydate = cursorControl;
			}
			
			try
			{
			if(interactionsString == "")
			{
				console.log("interaction string is still empy.. How is it even possible for it to come through all these validations?");
			}
			else if(interactionsString == "query again" && queryAgain == true)
			{
				console.log("gonna query Again coz we havent queried evrything yet");
				continueQueryAgain(type,fromDate,nextQuerydate,j,fetchedData,accNo, cacheCursorValue);
			}
			else
			{
				jsondata = interactionsString ;
				$.extend(actualJsonData,jsondata);
			}
			}
			catch(error)
				{
			console.log("parsing exception the data is probably still unparseable or undefined+"+interactionsString+"+");
				}

			
			if(jsondata != "")
			{
				interactionsManipulator.addInteractionsList(jsondata);
				chooseTheCurrentSelection(dd.currentSelection);
				if(queryAgain)
				{
					console.log("gonna query Again coz we havent queried evrything yet");
					setTimeout(function(){continueQueryAgain(type,fromDate,nextQuerydate,j,fetchedData,accNo, cacheCursorValue);},100);		
				} 
				else
				{
					var pos 	= dd.orderStatus.indexOf(type);
					var newType	= dd.orderStatus[pos+1];
				}
				if(j == daysfetched-1 && queryAgain == false)
				{
					console.log("stop every spinner has been called");	
					setTimeout(function(){dd.hideLoadingSpinner("everything");},100);	
				}
			}
			return;
		},
		error: function( XMLHttpRequest, textStatus, errorThrown ) {
			console.error( 'XMLHttpRequest : ', XMLHttpRequest, ' textStatus : ', textStatus, 'errorThrown : ', errorThrown );
			console.error( 'Inside loadInteractions_gae_new() function :: AJAX call failed.', '\nURL :: ', url, ' ErrorThrown :: ', errorThrown );
		},
	});
	
	
	
	
	
}


function fetchdatafromcache(type){

	console.log(type);

	var fromDate	=	null;
	var toDate		= 	null;
	fromDate     	= 	getFromDateFormatted();
	toDate	 	 	= 	getToDateFormatted();
	var datediff	=	getdatediff(fromDate,toDate);
	for(i=0;i<=datediff;i++)
	{
		url 	=	"/getcache/"+fromDate+type;
		$.ajax
		({
			type : "GET",
			url : url,
			async:true,
			success : function(data)
			{
				var totalData	= data.split("_scursors_");
	
				var interactionsString 	=	totalData[0];
	
				var jsondata 	= JSON.parse(interactionsString);
				len = jsondata.length;
				setTimeout(function(){dd.addInteractionsList(jsondata);
				chooseTheCurrentSelection(dd.currentSelection);},100);
	
			
					var pos 	= dd.orderStatus.indexOf(type);
					setTimeout(function(){dd.hideLoadingSpinner("everything");},100);
					var newType	= dd.orderStatus[pos+1];
					if(newType != null && newType != undefined){
					}	
					else
					{
						setTimeout(function(){dd.hideLoadingSpinner("everything");},100);
					}
			
			}
		});
		fromDate	=	getincrementedDate(fromDate);
		
    }
}
function getdatediff(fromDate,toDate){
	 var mdy = fromDate.split('-')
	    var fromdate	=	 new Date(mdy[2], mdy[0], mdy[1]);
	 			mdy 	=	 toDate.split('-')
	 	var todate		=	 new Date(mdy[2], mdy[0], mdy[1]);
	 	var diff		=	(todate-fromdate)/(1000*60*60*24);
	 	
	 	return diff;
}
function getincrementedDate(date){
	 var mdy = date.split('-')
	    var dateformed		=	 new Date(mdy[2], mdy[0], mdy[1]);
	 dateformed.setTime(dateformed.getTime() + (24 * 60 * 60 * 1000));
		var dd = dateformed.getDate();
		var mm = dateformed.getMonth(); 

		var yyyy = dateformed.getFullYear();

		if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} 

		dateformed = mm+'-'+dd+'-'+yyyy;

		return dateformed;
	 	
}



// MY function for continous querying based on cursor <the last date thing, there ain't no cursor there on full  history>

function continueQueryAgain(type,fromDate,nextQuerydate,j,fetchedData,accNo, cacheCursorValue)
{	
	if(fetchedData)
	{
		console.log("entered the fetch query ::"+fetchedData)
		var suburl 	=	"/getAllArInteractionsNew/"+fromDate+"/"+nextQuerydate+"/"+"cursor"+"/"+cacheCursorValue+"/true"+"?internal=true&accNo="+accNo;
	}
	else
	{
		var suburl 	=	"/getAllArInteractionsNew/"+fromDate+"/"+nextQuerydate+"/"+"cursor"+"/"+cacheCursorValue+"/true"+"?internal="+internal_flag;
	}
	var startTimeBeforeCall = new Date().getTime();	
	$.ajax
	({
		type : "POST",
		url : suburl,
		async:true,
		success : function(data)
		{
			var endTimeAfterCall = new Date().getTime();
			console.log(endTimeAfterCall - startTimeBeforeCall);
			
			var dataui = data
			if(data == "no data for this time range")
			{
				$(".modal-backdrop.fade.in" ).remove();
				console.log("no data received for this date bob");
				if(j == daysfetched-1)
				{
					console.log("stopping all spinners")		
					$('.spinner').css( "display", "none" );	
					setTimeout(function(){dd.hideLoadingSpinner("everything");},100);	
				}
				return;
			}
			var totalData			=   JSON.parse(dataui);
			var interactionsString 	=	totalData.ResultMap;
			var cursorControl		=	totalData.datefornextquery;
			var fetchedData			=   totalData.fetchedValue;
			cacheCursorValue		=	totalData.cacheCursor;
			var continueToQuery		=	true;
			var queryAgain			=   true;
			var jsondata			=   "";
		
			if(cursorControl == "no-overflow-here" || cursorControl == undefined)
			{
				queryAgain  = false;
			}
			else
			{
				var nextQuerydate = cursorControl;
			}
		
			try
			{
				if(interactionsString == "")
				{
					console.error("interaction string is still empty.. How is it even possible for it to come through all these validations?");
				}
				else if(interactionsString == "query again" && queryAgain == true )
				{
					console.log("gonna query Again coz we havent queried evrything yet");
					continueQueryAgain(type,fromDate,nextQuerydate,j,fetchedData,accNo, cacheCursorValue);
				}
				else
				{
					jsondata = interactionsString ; 
					$.extend(actualJsonData,jsondata);
				}
			}
			catch(error)
			{
				console.log("this happened coz the data is probably still unparseable or undefined+"+interactionsString+"+");
			}

			if(jsondata != "")
			{
				interactionsManipulator.addInteractionsList(jsondata);
				chooseTheCurrentSelection(dd.currentSelection);
			
				if(queryAgain)
				{
					console.log("gonna query Again coz we havent queried evrything yet");
					continueQueryAgain(type,fromDate,nextQuerydate,j,fetchedData,accNo, cacheCursorValue);
				}
				else
				{
					var pos 	= dd.orderStatus.indexOf(type);
					var newType	= dd.orderStatus[pos+1];
					if(j == daysfetched-1)
					{
						setTimeout(function(){dd.hideLoadingSpinner("everything");},100);	
					}	
				}		
	
			}
			return;	
		},
		error: function( XMLHttpRequest, textStatus, errorThrown ) {
			console.error( 'XMLHttpRequest : ', XMLHttpRequest, ' textStatus : ', textStatus, 'errorThrown : ', errorThrown );
			console.error( 'Inside recursiveInQueue() function :: AJAX call failed. So retrying...', '\nURL :: ', url, ' ErrorThrown :: ', errorThrown );
			setTimeout(function(){continueQueryAgain(type,fromDate,nextQuerydate,j);}, 100);
		},
	});
}

// MY FUNCTION ENDS


function recursiveInQueue(cursor,status,fromDate,toDate,j)
{
	console.log("came inside the recursive inqueue this should happen when limit has exceeded");
	Actions.showLoading("loading data ...");
	var len = 0;
	url 	=	"/getAllArInteractionsNew/"+fromDate+"/"+toDate+"/"+cursor+"/"+status+"/false"+"?internal=false";
	console.info(url);
	$.ajax
	({
		type : "POST",
		url : url,
		async:true,
		success : function(data)
		{
			var totalData			=   JSON.parse(data);
			var interactionsString 	=	totalData.ResultMap;
			var cursorControl		=	totalData.datefornextquery;
			var fromCache			=	null;
			
			var continueToQuery		=	true;
			if(newCurser == "stopQuery")
			{
				continueToQuery  = false;
			}
			
			if(fromCache == undefined || fromCache == null || fromCache == true || fromCache == "true" || fromCache == "null" || fromCache == "undefined")
			{
				fromCache = true;
			}
			else if(!fromCache || fromCache == "false")
			{
				fromCache = false;
			}
			else
			{
				console.log("what is the stupid value of fromCache :: "+fromCache);
			}
			
			var jsondata 			= JSON.parse(interactionsString);
			
			var jsonActualData = jsondata[status];
			len = Object.keys(jsonActualData).length;
			console.info(url+" :: "+len+" :: "+fromCache);
			setTimeout(function(){
				interactionsManipulator.addInteractionsList(jsonActualData,null,j);
				chooseTheCurrentSelection(dd.currentSelection);
				},100);
			
			if(continueToQuery && !fromCache)
			{
				setTimeout(function(){recursiveInQueue(cursor,status,fromDate,toDate, j);}, 100);
			}
			else
			{
				setTimeout(function(){dd.hideLoadingSpinner(status);},100);
				var pos 	= dd.orderStatus.indexOf(status)
				var newType	= dd.orderStatus[pos+1];
				if(newType != null && newType != undefined)	{
				}
				else
					setTimeout(function(){dd.hideLoadingSpinner("all");},100);
			}
			return;
		},
		error: function( XMLHttpRequest, textStatus, errorThrown ) {
			console.error( 'XMLHttpRequest : ', XMLHttpRequest, ' textStatus : ', textStatus, 'errorThrown : ', errorThrown );
			console.error( 'Inside recursiveInQueue() function :: AJAX call failed. So retrying...', '\nURL :: ', url, ' ErrorThrown :: ', errorThrown );
			setTimeout(function(){recursiveInQueue(cursor,status,fromDate,toDate);}, 100);
		},
	});
	Actions.hideLoading();
}

function convertDate(dateInMilliSeconds)
{
	var date = new Date(dateInMilliSeconds);

	var dd = date.getDate();
	var mm = date.getMonth()+1; 

	var yyyy = date.getFullYear();

	if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} 

	date = mm+'-'+dd+'-'+yyyy;

	return date;


}

function pad(c)
{
	if(c   < 10)
	{
		c	=	"0"+c;
		return c;
	}
	else
	{
		return c;
	}
}
function incrementer()
{
	var history_id	=	$("#decrem_increm").html();
	increm_id	=	$('#'+history_id.split('_history')[0] ).next("tr").attr("id"); 
	callpopup(increm_id+"_history");
	positionHistoryTableHeaders();
	
}
function decrementer()
{
	var history_id	=	$("#decrem_increm").html();
	increm_id	=	$('#'+history_id.split('_history')[0] ).prev("tr").attr("id");
	callpopup(increm_id+"_history");
	positionHistoryTableHeaders();
}	


function completefromModal(interactionId)
{
	var chk_id = interactionId;
	console.log(chk_id);
	var tobcompleted = [];
tobcompleted.push(chk_id);	
intractionToMarkComplete(tobcompleted);
}

function markInQueueFromModal(interactionId)
{
	var chk_id = interactionId;
	console.log(chk_id);
	var toBeMarkedInQueue = [];
	toBeMarkedInQueue.push(chk_id);	
intractionToMarkInQueue(toBeMarkedInQueue);
}

function checkInteractionInCache(interactionId)
{
	var subAccountNumber = $('#subAccCache').text();
	var interactionID    = interactionId.split('_')[1];
	console.log("interactionID="+interactionID);
	if(subAccountNumber == '')
		return;
	$('.checkinqueue i').addClass('fa-spin');
	$.ajax({
		type : "GET",
		url  : "/checkInteractionsInCache/"+interactionID+"/"+subAccountNumber,
		success : function(data) 
		{
			if (data === "success")
				{
				$('.checkinqueue').addClass('success');
				console.log("interaction present in the cache");
				}
				else
				{
					$('.checkinqueue').addClass('error');
					console.log('interaction not present in the cache');
				}
			$('.checkinqueue i').removeClass('fa-spin');

		}
});
}
		

 function intractionToMarkComplete(interactionList){

	 singleSelection = "no";

	 	
		var numAr2 = failidContainer.length;
	
		for(var i=0; i<numAr2 ;i++)
		{
		
		failidContainer.pop();
		
		}
		
		var numAr1 = idContainer.length;
		
		for(var i=0; i<numAr1 ;i++)
		{
		
		idContainer.pop();
		
		}
	 	
		var toBeCompleted	=	interactionList;
		if(toBeCompleted.length	==	0)
		{
			alertBox.show('Alert!',"Please select an interaction to complete");
		}
		else{
			//var completeFlag=confirm('Are you Sure you want to Mark the interaction(s) complete ?');
			bootbox.dialog({
				message:"Are you Sure you want to Mark the interaction(s) complete ?",
				title:'Warning!',
				buttons:{
					success:{
						label:"Proceed",
						className:'btn-success',
						callback: function() {
												for (var i=0;i<toBeCompleted.length;i++)
												{
													if(toBeCompleted.length == 1)
														{
														singleSelection = "yes";
														}
													var halfid = toBeCompleted[i].slice(5);
													var rowIdPrefix = "trid";
													var rowsId = rowIdPrefix.concat(halfid);
													
													var idarrey		=	toBeCompleted[i].split("_");
													var history_id	=	"trid_"+idarrey[1]+"_history";     //trid_0_history
													var displayCondition = "no";
													if(i === toBeCompleted.length-1)
														{						displayCondition = "yes";						}
													else
														{						displayCondition = "no";						}
													markComplete(history_id,true,displayCondition,rowsId);
												}
							    			 }
							},
					cancel:{
								label:'Cancel',
								className:'btn-close'
								}
							}
						});
		}	
	}
	
 function intractionToMarkInQueue(interactionList){

	 singleSelection = "no";

	 	
		var numAr2 = failidContainer.length;
	
		for(var i=0; i<numAr2 ;i++)
		{
		
		failidContainer.pop();
		
		}
		
		var numAr1 = idContainer.length;
		
		for(var i=0; i<numAr1 ;i++)
		{
		
		idContainer.pop();
		
		}
	 	
		var toBeCompleted	=	interactionList;
		if(toBeCompleted.length	==	0)
		{
			alertBox.show('Alert!',"Please select an interaction to InQueue");
		}
		else{
			//var completeFlag=confirm('Are you Sure you want to Mark the interaction(s) complete ?');
			bootbox.dialog({
				message:"Are you Sure you want to Mark the interaction(s) InQueue ?",
				title:'Warning!',
				buttons:{
					success:{
						label:"Proceed",
						className:'btn-success',
						callback: function() {
												for (var i=0;i<toBeCompleted.length;i++)
												{
													if(toBeCompleted.length == 1)
														{
														singleSelection = "yes";
														}
													var halfid = toBeCompleted[i].slice(5);
													var rowIdPrefix = "trid";
													var rowsId = rowIdPrefix.concat(halfid);
													
													var idarrey		=	toBeCompleted[i].split("_");
													var history_id	=	"trid_"+idarrey[1]+"_history";     //trid_0_history
													var displayCondition = "no";
													if(i === toBeCompleted.length-1)
														{						displayCondition = "yes";						}
													else
														{						displayCondition = "no";						}
													markInQueue(history_id,true,displayCondition,rowsId);
												}
							    			 }
							},
					cancel:{
								label:'Cancel',
								className:'btn-close'
								}
							}
						});
		}	
	}
 
 	function markInQueue(history_ID,comFlag,displayCondition,rowsId)
 	{

 		
		singleSelection = "no";

		var completeFlag		=	comFlag;
		var history_id			=	history_ID;
		var intractionData 		=	$("#"+history_id).html();
		
		console.log("---------> interactiondata"+intractionData);
		
		if(intractionData == null)
		{
			alertBox.show('Alert!','Click on the interactions to be completed and Try again.');
			return false;
		}
		var compObj				=	new Object();
		var compStr				=	"";
		var json_intractionData = 	JSON.parse(intractionData);
		var intractionhistory 	=	json_intractionData.interactionHistory;
		var interactionId		=	json_intractionData.interactionId;
		var subAccountNumber	=	json_intractionData.subAccountNumber;
		var status				=	json_intractionData.action;
		var connectionId		=	"";
		for (var i=intractionhistory.length-1;i>=0;i--)
		{
			connectionId	=	intractionhistory[i].connectionId;
			break;
		}
		  if(status == "Pending" && status == "Failed" && status == "InActive")
		  {
	
		//alert("Boo ! Already Completed");
			
			if(status == "InQueue(IR)")
		    {
				var completedFail = 'already InQueue: '+interactionId;
		    }
		   else if(status.toLowerCase() =="deleted")
		   {
			   var completedFail = 'deleted Interaction: '+interactionId;
		   }
		   else if(status.toLowerCase() != "pending")
		   {
			   var completedFail = 'Not a Pending Interaction: '+interactionId;
		   }
			failidContainer.push(completedFail);
			if(singleSelection == "yes")
				{
					singleSelection = "no";
				$('#dynamicModalstartdiv').html('');

				$('#dynamicModalstartdiv').html('<div class="modal-content"> <div class="modal-header">  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>  <h4 class="modal-title" id="myLargeModalLabel">'+'One or more Interactions failed when marking InQueue'+'</h4>     </div> <div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated"></h4><table class="table"><thead><tr><th>'+'Interaction IDs of failed selections'+'</th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div>');
		     	$('#faildeleted_items').html(failidContainer[0]);

		     	$('#deleting_status').modal('show');
				
		     	messageWindow.hideMessage();
			return false;
		}
			
			
			if(displayCondition == "yes")
				{
				var failString = "";
				displayCondition = "no";
				$('#dynamicModalstartdiv').html('');

				$('#dynamicModalstartdiv').html('<div class="modal-content"> <div class="modal-header">  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>  <h4 class="modal-title" id="myLargeModalLabel">'+'One or more Interactions failed when marking complete'+'</h4>     </div> <div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated"></h4><table class="table"><thead><tr><th>'+'Interaction IDs of failed selections'+'</th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div>');
		     	
				for(var i=0; i<failidContainer.length;i++)
		     		{
					failString = failString+"<tr><td>"+failidContainer[i]+"</td></tr>";	
		     		}
				$('#faildeleted_items').html(failString);

		     	$('#deleting_status').modal('show');
				
		     	messageWindow.hideMessage();
				
		     	return false;
				
				}
			return false;
		}
		if(completeFlag)
		{
			$("#closemodel").trigger("click");

			try
			{
				compObj['interactionId']	=	interactionId;
				compObj['agentLogin']		=	currentUser;
				compObj['connectionId']		=	connectionId;
				compObj['subAccountNumber']	=	subAccountNumber;
				compObj['status']			=	"InQueue(IR)";
				compObj['currentStatus']	=	status;
				compObj['scheduledTime']	=	new Date().getTime();
				compStr						=	JSON.stringify(compObj);
				console.log("the string is---->"+compStr);
				

				
				messageWindow.showMessage( "Moving to InQueue, Please wait");			
				
			// compStr = "beberererere to check for failure in complete process remove //";
				
				
				$.ajax({
							type : "POST",
							url  : "/updateInteractionStatus?compStr="+compStr,
							success : function(data) 
							{
								if (data === "success")
									{
										if (displayCondition === "yes")
										{
											messageWindow.hideMessage();
											messageWindow.popUpMessage( "Successfully Marked as InQueue", 3000 );			
											displayCondition = "no";
											if(failidContainer.length > 0)
											{
												var failString = "";
												for(var i=0; i<failidContainer.length; i++)
												{
													failString = failString+"<tr><td>"+failidContainer[i]+"</td></tr>";	
												}
												$('#dynamicModalstartdiv').html('');
												$('#dynamicModalstartdiv').html('<div class="modal-content"> <div class="modal-header">  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>  <h4 class="modal-title" id="myLargeModalLabel">'+'One or more Interactions failed when marking complete'+'</h4>     </div> <div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated"></h4><table class="table"><thead><tr><th>'+'Interaction IDs of failed selections'+'</th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div>');
												$('#faildeleted_items').html(failString);
												$('#deleting_status').modal('show');
											}
										}
										else
										{
											console.log("completed");
										}
										/*var readTimeele				=	{};
								     	var readTimeData			=	{};
								     	readTimeData.newInteraction	=	false;
								     	readTimeData.agentLogin		=	currentUser;
								     	readTimeData.interactionId	=	interactionId;
								     	readTimeData.connectionId	=	connectionId;
								     	readTimeData.currentStatus	=	"InQueue(IR)";
								     	readTimeData.updateTime		=	moment().tz( 'America/Whitehorse' ).unix() * 1000;
								     	readTimeele.data			=	JSON.stringify(readTimeData);
								     	console.log("readtimeele::",JSON.stringify(readTimeele));
								     	dd.onMessageAction(JSON.stringify(readTimeele));*/
									}
									else
									{
									failidContainer.push(interactionId);
									if(displayCondition == "yes")
										{
											messageWindow.hideMessage();
											if(failidContainer.length > 0)
											{
												var failString = "";
												for(var i=0; i<failidContainer.length; i++)
												{
													failString = failString+"<tr><td>"+failidContainer[i]+"</td></tr>";	
												}
												$('#dynamicModalstartdiv').html('<div class="modal-content"> <div class="modal-header">  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>  <h4 class="modal-title" id="myLargeModalLabel">'+'One or more Interactions failed when marking Inqueue(IR)'+'</h4>     </div> <div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated"></h4><table class="table"><thead><tr><th>'+'Interaction IDs of failed selections'+'</th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div>');
												$('#faildeleted_items').html(failString);
												$('#deleting_status').modal('show');
											}
										displayCondition = "no";
										}
									}
								$("#closemodel").trigger("click");
							}
					});
			}
			catch(e)
			{
				console.log(e);
				$("#closemodel").trigger("click");
//


				messageWindow.hideMessage();


			}
		}
		else  
			return false;
	
 	}
	function markComplete(history_ID,comFlag,displayCondition,rowsId)
	{
	
		singleSelection = "no";

		var completeFlag			=	comFlag;
		var history_id			=	history_ID;
		var intractionData 		=	$("#"+history_id).html();
		
		console.log("---------> interactiondata"+intractionData);
		
		if(intractionData == null)
		{
			alertBox.show('Alert!','Click on the interactions to be completed and Try again.');
			return false;
		}
		var compObj				=	new Object();
		var compStr				=	"";
		var json_intractionData = 	JSON.parse(intractionData);
		var intractionhistory 	=	json_intractionData.interactionHistory;
		var interactionId		=	json_intractionData.interactionId;
		var status				=	json_intractionData.action;
		var subAccountNumber	=	json_intractionData.subAccountNumber;
		var connectionId		=	"";
		var webchatURL			=	getURL();
		for (var i=intractionhistory.length-1;i>=0;i--)
		{
			connectionId	=	intractionhistory[i].connectionId;
			break;
		}

		  if(status.toLowerCase() =="completed" || status.toLowerCase() =="completed-f8" || status.toLowerCase() =="completed-resolved" || status.toLowerCase() =="callended"|| status.toLowerCase() =="deleted")
		{
			if(status.toLowerCase() =="completed" || status.toLowerCase() =="completed-f8" || status.toLowerCase() =="completed-resolved" || status.toLowerCase() =="callended")
		    {
				var completedFail = 'already completed: '+interactionId;
		    }
		   else if(status.toLowerCase() =="deleted")
		   {
			   var completedFail = 'deleted Interaction: '+interactionId;
		   }
			failidContainer.push(completedFail);
			if(singleSelection == "yes")
				{
				singleSelection = "no";
				$('#dynamicModalstartdiv').html('');

				$('#dynamicModalstartdiv').html('<div class="modal-content"> <div class="modal-header">  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>  <h4 class="modal-title" id="myLargeModalLabel">'+'One or more Interactions failed when marking complete'+'</h4>     </div> <div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated"></h4><table class="table"><thead><tr><th>'+'Interaction IDs of failed selections'+'</th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div>');
		     	$('#faildeleted_items').html(failidContainer[0]);

		     	$('#deleting_status').modal('show');
				
		     	messageWindow.hideMessage();
			return false;
		}
			
			
			if(displayCondition == "yes")
				{
				var failString = "";
				displayCondition = "no";
				$('#dynamicModalstartdiv').html('');

				$('#dynamicModalstartdiv').html('<div class="modal-content"> <div class="modal-header">  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>  <h4 class="modal-title" id="myLargeModalLabel">'+'One or more Interactions failed when marking complete'+'</h4>     </div> <div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated"></h4><table class="table"><thead><tr><th>'+'Interaction IDs of failed selections'+'</th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div>');
		     	
				for(var i=0; i<failidContainer.length;i++)
		     		{
					failString = failString+"<tr><td>"+failidContainer[i]+"</td></tr>";	
		     		}
				$('#faildeleted_items').html(failString);

		     	$('#deleting_status').modal('show');
				
		     	messageWindow.hideMessage();
				
		     	return false;
				
				}
			return false;
		}
		if(completeFlag)
		{
			$("#closemodel").trigger("click");

			try
			{
				compObj['interactionId']	=	interactionId;
				compObj['agentLogin']		=	currentUser;
				compObj['connectionId']		=	connectionId;
				compObj['subAccountNumber']	=	subAccountNumber;
				compObj['status']			=	"Completed";
				compObj['currentStatus']	=	status;
				compObj['scheduledTime']	=	new Date().getTime();
				compStr						=	JSON.stringify(compObj);
				console.log("the string is---->"+compStr);
				

				
				messageWindow.showMessage( "Moving to completed, Please wait");			
				
			// compStr = "beberererere to check for failure in complete process remove //";
				
				
				$.ajax({
							type : "POST",
							url  : "/updateInteractionStatus?compStr="+compStr,
							success : function(data) 
							{			
								if (data === "success")
									{
										if (displayCondition === "yes")
										{
											messageWindow.hideMessage();
											messageWindow.popUpMessage( "Successfully Marked as Completed", 3000 );			
											displayCondition = "no";
											if(failidContainer.length > 0)
											{
												var failString = "";
												for(var i=0; i<failidContainer.length; i++)
												{
													failString = failString+"<tr><td>"+failidContainer[i]+"</td></tr>";	
												}
												$('#dynamicModalstartdiv').html('');
												$('#dynamicModalstartdiv').html('<div class="modal-content"> <div class="modal-header">  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>  <h4 class="modal-title" id="myLargeModalLabel">'+'One or more Interactions failed when marking complete'+'</h4>     </div> <div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated"></h4><table class="table"><thead><tr><th>'+'Interaction IDs of failed selections'+'</th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div>');
												$('#faildeleted_items').html(failString);
												$('#deleting_status').modal('show');
											}
										}
										else
										{
											console.log("completed");
										}
										/*var readTimeele				=	{};
								     	var readTimeData			=	{};
								     	readTimeData.newInteraction	=	false;
								     	readTimeData.agentLogin		=	currentUser;
								     	readTimeData.interactionId	=	interactionId;
								     	readTimeData.connectionId	=	connectionId;
								     	readTimeData.currentStatus	=	"Completed";
								     	readTimeData.updateTime		=	moment().tz( 'America/Whitehorse' ).unix() * 1000;
								     	readTimeele.data			=	JSON.stringify(readTimeData);
								     	/dd.onMessageAction(JSON.stringify(readTimeele));*/
									}
									else
									{
									failidContainer.push(interactionId);
									if(displayCondition == "yes")
										{
											messageWindow.hideMessage();
											if(failidContainer.length > 0)
											{
												var failString = "";
												for(var i=0; i<failidContainer.length; i++)
												{
													failString = failString+"<tr><td>"+failidContainer[i]+"</td></tr>";	
												}
												$('#dynamicModalstartdiv').html('<div class="modal-content"> <div class="modal-header">  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>  <h4 class="modal-title" id="myLargeModalLabel">'+'One or more Interactions failed when marking Completed'+'</h4>     </div> <div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated"></h4><table class="table"><thead><tr><th>'+'Interaction IDs of failed selections'+'</th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div>');
												$('#faildeleted_items').html(failString);
												$('#deleting_status').modal('show');
											}
										displayCondition = "no";
										}
									}
								$("#closemodel").trigger("click");
							
								
								//Old code for Refrence
								
//								if (data === "Success")
//									{
//								if (displayCondition === "yes")
//									{
//									
//									messageWindow.hideMessage();
//
//									messageWindow.popUpMessage( "Successfully Marked as completed", 3000 );			
//									
//							     	
//							     	displayCondition = "no";
//							     	
//							     	if(failidContainer.length > 0)
//							     		{
//							     
//							     	
//							     	var failString = "";
//							     	for(var i=0; i<failidContainer.length; i++)
//							     		{
//									failString = failString+"<tr><td>"+failidContainer[i]+"</td></tr>";	
//							     		}
//							    	
//									$('#dynamicModalstartdiv').html('');
//
//									$('#dynamicModalstartdiv').html('<div class="modal-content"> <div class="modal-header">  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>  <h4 class="modal-title" id="myLargeModalLabel">'+'One or more Interactions failed when marking complete'+'</h4>     </div> <div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated"></h4><table class="table"><thead><tr><th>'+'Interaction IDs of failed selections'+'</th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div>');
//							     	$('#faildeleted_items').html(failString);
//							     	$('#deleting_status').modal('show');					
//									}
//									}
//								
//								else
//									{
//									
//									console.log("completed");
//									
//									}
//				
//									}
//								
//								else
//									{
//									
//									failidContainer.push(interactionId);
//
//									
//									if(displayCondition == "yes")
//										{
//									messageWindow.hideMessage();
//									
//							     	if(failidContainer.length > 0)
//						     		{
//						     	
//
//							     		var failString = "";
//						     	for(var i=0; i<failidContainer.length; i++)
//						     		{
//								failString = failString+"<tr><td>"+failidContainer[i]+"</td></tr>";	
//						     		}
//								$('#dynamicModalstartdiv').html('<div class="modal-content"> <div class="modal-header">  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>  <h4 class="modal-title" id="myLargeModalLabel">'+'One or more Interactions failed when marking complete'+'</h4>     </div> <div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated"></h4><table class="table"><thead><tr><th>'+'Interaction IDs of failed selections'+'</th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div>');
//
//						     	$('#faildeleted_items').html(failString);
//
//								$('#deleting_status').modal('show');
//
//				
//						     	}
//										displayCondition = "no";
//										}
//
//									}
								
	//							

								
								$("#closemodel").trigger("click");
							}
					});
			}
			catch(e)
			{
				console.log(e);
				$("#closemodel").trigger("click");
				messageWindow.hideMessage();
			}
		}
		else  
			return false;
	}
	
function deletefromModal(interactionId)
{
	var chk_id = interactionId;

	var tobdeleted = [];
tobdeleted.push(chk_id);	
intractionToDel(tobdeleted);
	

	
}
	
	
	
	
function intractionToDel(deletionof)
{
		// re initialize global variables 
		
singleSelection = "no";
		
if(deletionof.length == 1)
	{
	singleSelection = "yes";
	}
	
		var numAr= idContainer.length;
		var numAr2 = failidContainer.length;
		arrayLengthcounter = 0;
		currentArcounter = 0;

		for(var i=0; i<numAr ;i++)
			{
			
			idContainer.pop();
			}
		
		for(var i=0; i<numAr2 ;i++)
		{
		
		failidContainer.pop();
		}
		

		var delete_id	=	deletionof;
		if(delete_id	!=	'single' && delete_id.length	==	0){
			alertBox.show('Alert!',"Please select an interaction to delete");
		}
		else{
			//var deleteFlag=confirm('Sure to DELETE interaction ');
			bootbox.dialog({
				message:"Are you sure you want to delete the selected interaction(s)?",
				title:'Warning!',
				buttons:{
					success:{
						label:"Proceed",
						className:'btn-success',
						callback: function() {
												if(delete_id	==	'single')
												{
													var history_id	=	$("#decrem_increm").html();
													deleteintraction(history_id,true,"yes");
												}
												else
												{
													arrayLengthcounter = delete_id.length;
													for (var i=0;i<delete_id.length;i++)
													{
														var displayCondition	= "no"
															if(i === delete_id.length-1)
															{						displayCondition = "yes";						}
															else
															{						displayCondition = "no";						}
														var idarrey		=	delete_id[i].split("_");
														var history_id	=	"trid_"+idarrey[1]+"_history";     //trid_0_history
														console.log("-----------------++++",history_id);
														deleteintraction(history_id,true,displayCondition);
													}
												}
											 }
							},
					cancel:{
								label:'Cancel',
								className:'btn-close'
								}
							}
						});
			}
	}
	
	function deleteintraction(history_ID,delf,displayCondition)
	{
		var deleteFlag			=	delf;
		var history_id			=	history_ID;
		var intractionData 		=	$("#"+history_id).html();
		
		if(intractionData == null)
		{
			return false;
		}
		var json_intractionData = 	JSON.parse(intractionData);
		var intractionhistory 	=	json_intractionData.interactionHistory;
		var interactionId		=	json_intractionData.interactionId;
		var status				=	json_intractionData.action;
		var subAccountNumber	=	json_intractionData.subAccountNumber;
		var connectionId		=	"";
		var webchatURL			=	getURL();
		var compStr				=	"";
		for (var i=intractionhistory.length-1;i>=0;i--)   //changes by DUH
		{
			if(intractionhistory[i].connectionId != null && intractionhistory[i].connectionId != undefined && intractionhistory[i].connectionId != "" && intractionhistory[i].connectionId != "null" && intractionhistory[i].connectionId != "NA" && intractionhistory[i].connectionId != "na")
			{
				connectionId	=	intractionhistory[i].connectionId;
				break;
			}
		}

		if(status.toLowerCase() =="completed" || status.toLowerCase() =="deleted" || status.toLowerCase() =="completed-f8" || status.toLowerCase() =="completed-resolved" || status.toLowerCase() =="callended")

		{
		//	alert("Boo ! Completed Interactions can't be Deleted");
			
			if(status.toLowerCase() =="completed" || status.toLowerCase() =="completed-f8" || status.toLowerCase() =="completed-resolved" || status.toLowerCase() =="callended")
		    {
				var completedFail = 'completed Interaction: '+connectionId;
		    }
		   else if(status.toLowerCase() =="deleted")
		   {
			   var completedFail = 'Already deleted : '+connectionId;
		   }
			
			failidContainer.push(completedFail);
			++currentArcounter;
			
			if(singleSelection == "yes")
			{
			singleSelection = "no";
			$('#dynamicModalstartdiv').html('');

			$('#dynamicModalstartdiv').html('<div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button><h4 class="modal-title" id="myLargeModalLabel">Results Of Delete</h4></div> <div id="successDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated">Successfully Deleted </h4><table class="table"><thead><tr><th><h5 id="headingTable1">Connection IDs</h5></th></tr></thead><tbody id="deleted_items"> </tbody></table></div><div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated">Failed to Delete</h4><table class="table"><thead><tr><th><h5 id="headingTable2">Connection IDs</h5></th></tr></thead><tbody id="faildeleted_items"></tbody></table></div></div>');
	     	$('#successDeleting_modal_content').html('');
	     	$('#faildeleted_items').html(failidContainer[0]);

	     	$('#deleting_status').modal('show');
	     
	     	messageWindow.hideMessage();
			return false;
		}
			
			//
			if (currentArcounter == arrayLengthcounter)
			{
			
			messageWindow.hideMessage();
			
			console.log ("current"+currentArcounter+"length"+arrayLengthcounter);
			console.log (" ID CONTAINER! ---> final!!!! "+idContainer);

			var successString = "";
			var failString = "";
			for(var i=0; i<idContainer.length ; i++)
			{
				successString= successString+"<tr><td>"+idContainer[i]+"</td></tr>";
			}
			for(var i=0;i<failidContainer.length ; i++)
				{
				failString = failString+"<tr><td>"+failidContainer[i]+"</td></tr>";	

			}
		
		$('#dynamicModalstartdiv').html('');
		$('#dynamicModalstartdiv').html('<div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button><h4 class="modal-title" id="myLargeModalLabel">Results Of Delete</h4></div> <div id="successDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated">Successfully Deleted </h4><table class="table"><thead><tr><th><h5 id="headingTable1">Connection IDs</h5></th></tr></thead><tbody id="deleted_items"> </tbody></table></div><div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated">Failed to Delete</h4><table class="table"><thead><tr><th><h5 id="headingTable2">Connection IDs</h5></th></tr></thead><tbody id="faildeleted_items"></tbody></table></div></div>');

		if(idContainer.length >= 1)
			{							
			$('#deleted_items').html(successString);
			}
		else
			{
			$('#successDeleting_modal_content').html("");
			}
			if(failidContainer.length >=1)
			{
			$('#faildeleted_items').html(failString);
			}
			else
			{
			$('#failedDeleting_modal_content').html("");
			}

			currentArcounter = 0;

			$('#deleting_status').modal('show');
			
			}
	
			
			//
			return false;
		
		}
		
		if(deleteFlag)
		{
			$("#closemodel").trigger("click");

			
			messageWindow.showMessage( "Deleting selected interactions, Please wait");			
				var compObj					=	new Object();
				compObj['interactionId']	=	interactionId;
				compObj['agentLogin']		=	currentUser;
				compObj['connectionId']		=	connectionId;
				compObj['subAccountNumber']	=	subAccountNumber;
				compObj['status']			=	"Deleted";
				compObj['currentStatus']	=	status;
				compObj['scheduledTime']	=	new Date().getTime();
				compStr						=	JSON.stringify(compObj);
				console.log("the string is---->"+compStr);
//

				$.ajax({
					type : "POST",
					url  : "/updateInteractionStatus?compStr="+compStr,
					success : function(data) 
					{
						if (data === "success")
						{
							if (displayCondition === "yes")
							{
								messageWindow.hideMessage();
								messageWindow.popUpMessage( "Successfully Marked as Deleted", 3000 );			
								displayCondition = "no";
								if(failidContainer.length > 0)
								{
									var failString = "";
									for(var i=0; i<failidContainer.length; i++)
									{
										failString = failString+"<tr><td>"+failidContainer[i]+"</td></tr>";	
									}
									$('#dynamicModalstartdiv').html('');
									$('#dynamicModalstartdiv').html('<div class="modal-content"> <div class="modal-header">  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>  <h4 class="modal-title" id="myLargeModalLabel">'+'One or more Interactions failed when marking Deleted'+'</h4>     </div> <div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated"></h4><table class="table"><thead><tr><th>'+'Interaction IDs of failed selections'+'</th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div>');
									$('#faildeleted_items').html(failString);
									$('#deleting_status').modal('show');
								}
							}
							else
							{
								console.log("completed");
							}
							var readTimeele				=	{};
					     	var readTimeData			=	{};
					     	readTimeData.newInteraction	=	false;
					     	readTimeData.agentLogin		=	currentUser;
					     	readTimeData.interactionId	=	interactionId;
					     	readTimeData.connectionId	=	connectionId;
					     	readTimeData.currentStatus	=	"Deleted";
					     	readTimeData.updateTime		=	moment().tz( 'America/Whitehorse' ).unix() * 1000;
					     	readTimeele.data			=	JSON.stringify(readTimeData);
					     	dd.onMessageAction(JSON.stringify(readTimeele));
						}
						else
						{
						failidContainer.push(interactionId);
						if(displayCondition == "yes")
							{
								messageWindow.hideMessage();
								if(failidContainer.length > 0)
								{
									var failString = "";
									for(var i=0; i<failidContainer.length; i++)
									{
										failString = failString+"<tr><td>"+failidContainer[i]+"</td></tr>";	
									}
									$('#dynamicModalstartdiv').html('<div class="modal-content"> <div class="modal-header">  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>  <h4 class="modal-title" id="myLargeModalLabel">'+'One or more Interactions failed when marking Inqueue(IR)'+'</h4>     </div> <div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated"></h4><table class="table"><thead><tr><th>'+'Interaction IDs of failed selections'+'</th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div>');
									$('#faildeleted_items').html(failString);
									$('#deleting_status').modal('show');
								}
							displayCondition = "no";
							}
						}
					$("#closemodel").trigger("click");
				}
				});
		}
		else  
			{
				return false;
			}
	}
	
	function getURL(){
		
		var url =	'';
		
		if (document.URL.indexOf('staging') != -1){
			url =	"http://staging.webchat.a-cti.com:8082";
		}else{
			url	=	"http://webchat.a-cti.com:8082";
		}
		return url;
		
	}
	function changeStatusToDelete(history_id){
		
		var history_ID	=	history_id;
		var idarrey		=	history_ID.split("_");
		var status_id		=	"status_"+idarrey[1];
		$("#"+status_id).html("<span class='label btn-delete'>Deleted</span>");			
	}
	
	function intractionToSche(scheduleof)
	{
		$('#Rescheduling_modal_content').empty();
		
		var schedule_id	=	scheduleof;
		if(schedule_id	!=	'single' && schedule_id.length	==	0)
		{
			//alertBox.show('Alert!',"nothing selected to rechedule...");
			alertBox.show('Alert!','Please select an interaction to reschedule');
		}
		else
		{
			
				if(schedule_id	==	'single')
				{
					var rescheduleDate	=	new Date($('#reschedule_date_modal').val());
					if(rescheduleDate != "")
					{
						var deleteFlag=false;
						bootbox.dialog({
							message:"Are you sure you want to Re-schedule the selected interaction?",
							title:'Warning!',
							buttons:{
								success:{
									label:"Proceed",
									className:'btn-success',
									callback: function() {
										deleteFlag=true;  
						var history_id	=	$("#decrem_increm").html();
						var single	=	true;
						$("#Selected").html("Rescheduleing...");
						scheduleintraction(history_id,deleteFlag,single,"yes");
					}
										},
								cancel:{
											label:'Cancel',
											className:'btn-close'
											}
										}
									});
					}
					else
					{
						//alertBox.show('Alert!',"Oops. Date is not valid. Please check..");
						alertBox.show('Alert!','Oops. Date is not valid. Please check..');
					}
				}
				else
				{
					var rescheduleDate	=	new Date($('#reschedule_date').val());
					if(rescheduleDate != "")
					{
						var deleteFlag=false;
						bootbox.dialog({
							message:"Are you sure you want to Re-schedule the selected interaction(s)?",
							title:'Warning!',
							buttons:{
								success:{
									label:"Proceed",
									className:'btn-success',
									callback: function() {
										deleteFlag=true;  
						for (var i=0;i<schedule_id.length;i++)
						{
							var displayCondition	= "no"
							if(i === schedule_id.length-1)
							{						displayCondition = "yes";						}
							else
							{						displayCondition = "no";						}
							var single	=	false;
							var idarrey		=	schedule_id[i].split("_");
							var history_id	=	"trid_"+idarrey[1]+"_history";     //trid_0_history
							$("#rescSelected").html("Rescheduleing...");
							scheduleintraction(history_id,deleteFlag,single,displayCondition);
								
						}
					}
										},
								cancel:{
									label:'Cancel',
									className:'btn-close'
									}
								}
							}); 
					}
					else
					{
						//alertBox.show('Alert!',"Oops. Date is not valid. Please check..");
						alertBox.show('Alert!','Oops. Date is not valid. Please check..');
					}
					
				}
			}
	}
	function scheduleintraction(history_ID,delf,singleflag,displayCondition)
	{
		try
		{	
			var compObj				=	new Object();
			var compStr				=	"";
			var single				=	singleflag;
			var deleteFlag			=	delf;
			var history_id			=	history_ID;
			var intractionData 		=	$("#"+history_id).html();
			
			if(intractionData == null)
			{
				alertBox.show('Alert!','Click on interaction to be Scheduled and Try again.');
				$("#rescSelected").html("Reschedule");
				$("#Selected").html("Reschedule");
				return false;
			}
			var json_intractionData = 	JSON.parse(intractionData);
			var intractionhistory 	=	json_intractionData.interactionHistory;
			var interactionId		=	json_intractionData.interactionId;
			var subAccountNumber	=	json_intractionData.subAccountNumber;
			var status				=	json_intractionData.action;
			var connectionId		=	"";
			for (var i=intractionhistory.length-1;i>=0;i--)
			{
				connectionId	=	intractionhistory[i].connectionId;
				break;
			}
		if(status.toLowerCase() =="completed")
		{
			alertBox.show('Alert!',"Boo ! Completed Interactions can't be rescheduled");
			$("#rescSelected").html("Reschedule");
			$("#Selected").html("Reschedule");
			return false;
		}
		if(!single){
			var whole_date	= $('#reschedule_date').val();
			var whole_time	= $('#reschedule_time').val();
			var zone		= "PDT";//$('#timezone_value').val();
			var hour		= whole_time.split(':')[0];
			var temp		= whole_time.split(':')[1];
			var minute		= temp.split(' ')[0];
			var type		= temp.split(' ')[1];
			var webchatURL	=	getURL();
		}else{
			var whole_date	= $('#reschedule_date_modal').val();
			var whole_time	= $('#reschedule_time_modal').val();
			var zone		= "PDT";//$('#timezone_value_modal').val();
			var hour		= whole_time.split(':')[0];
			var temp		= whole_time.split(':')[1];
			var minute		= temp.split(' ')[0];
			var type		= temp.split(' ')[1];
			var webchatURL	=	getURL();
		}
		if(deleteFlag)
		{
			
			if(whole_date != ""  && hour != ""  && minute != "" && type != ""  && zone != ""  )
			{
				$('#rescSelected').prop("disabled",true);
				spinnerload.spin(target);
				compObj['interactionId']	=	interactionId;
				compObj['agentLogin']		=	currentUser;
				compObj['connectionId']		=	connectionId;
				compObj['subAccountNumber']	=	subAccountNumber;
				compObj['scheduledTime']	=	whole_date +' '+hour+':'+minute+' '+type+' '+zone; //MM-dd-yyyy hh:mm a z
				compObj['currentStatus']	=	status;
				compObj['status']			=	"Scheduled";
				compStr						=	JSON.stringify(compObj);
				console.log("the string is---->"+compStr);
				

				
				messageWindow.showMessage( "Scheduling Interactions, Please wait");	
				//Make a Ajax for rescheduling and call the call back function on success
				$.ajax({
					type : "POST",
					url  : "/updateInteractionStatus?compStr="+compStr,
					success : function(data) 
					{
						if (data === "success")
							{
								if (displayCondition === "yes")
								{
									messageWindow.hideMessage();
									messageWindow.popUpMessage( "Successfully Marked as Scheduled", 3000 );			
									displayCondition = "no";
									if(failidContainer.length > 0)
									{
										var failString = "";
										for(var i=0; i<failidContainer.length; i++)
										{
											failString = failString+"<tr><td>"+failidContainer[i]+"</td></tr>";	
										}
										$('#dynamicModalstartdiv').html('');
										$('#dynamicModalstartdiv').html('<div class="modal-content"> <div class="modal-header">  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>  <h4 class="modal-title" id="myLargeModalLabel">'+'One or more Interactions failed to Rechedule'+'</h4>     </div> <div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated"></h4><table class="table"><thead><tr><th>'+'Interaction IDs of failed selections'+'</th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div>');
										$('#faildeleted_items').html(failString);
										$('#deleting_status').modal('show');
									}
								}
								else
								{
									console.log("completed");
								}
								var readTimeele				=	{};
						     	var readTimeData			=	{};
						     	readTimeData.newInteraction	=	false;
						     	readTimeData.agentLogin		=	currentUser;
						     	readTimeData.interactionId	=	interactionId;
						     	readTimeData.connectionId	=	connectionId;
						     	readTimeData.currentStatus	=	"Scheduled";
						     	readTimeData.updateTime		=	moment().tz( 'America/Whitehorse' ).unix() * 1000;
						     	readTimeele.data			=	JSON.stringify(readTimeData);
						     	dd.onMessageAction(JSON.stringify(readTimeele));
							}
							else
							{
							failidContainer.push(interactionId);
							if(displayCondition == "yes")
								{
									messageWindow.hideMessage();
									if(failidContainer.length > 0)
									{
										var failString = "";
										for(var i=0; i<failidContainer.length; i++)
										{
											failString = failString+"<tr><td>"+failidContainer[i]+"</td></tr>";	
										}
										$('#dynamicModalstartdiv').html('<div class="modal-content"> <div class="modal-header">  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>  <h4 class="modal-title" id="myLargeModalLabel">'+'One or more Interactions failed to Rechedule'+'</h4>     </div> <div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated"></h4><table class="table"><thead><tr><th>'+'Interaction IDs of failed selections'+'</th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div>');
										$('#faildeleted_items').html(failString);
										$('#deleting_status').modal('show');
									}
								displayCondition = "no";
								}
							}
						$("#closemodel").trigger("click");
					spinnerload.stop();
					$('#rescSelected').prop("disabled",false);
					$("#rescSelected").html("Reschedule");
					$("#Selected").html("Reschedule");
					}
				});

			}
			else
			{
				spinnerload.stop();
				alertBox.show('Alert!',"Rescheduling Details not valid ! Please check.");
				$('#rescSelected').prop("disabled",false);
				$("#rescSelected").html("Reschedule");
				$("#Selected").html("Reschedule");
				return false;
			}
		}
	}
		catch(e)
		{
			alertBox.show('Alert!','Error detail - '+e);
			spinnerload.stop();
			$('#rescSelected').prop("disabled",false);
			$("#rescSelected").html("Reschedule");
			$("#Selected").html("Reschedule");
		}
		
	}
	function updateAccountsType(accountIds, markType, trArray, arrayOfAccountIdSelected){				
		var indexValue;		
		$.ajax({
			type: 'GET',
			url: '/addAccountsToDB/'+markType+'/'+accountIds+"?csv=true",
			success: function(data){
				if(data === 'Success'){
					removeInteractionsFromTable(trArray);
					if(markType == 'External')
					{
						$.each(arrayOfAccountIdSelected, function(index, value){
							indexValue = internal_accounts.indexOf(value)
							internal_accounts.splice(indexValue, 1);
							external_accounts.push(value);
						});
					}
					else if(markType == 'Internal')
					{
						$.each(arrayOfAccountIdSelected, function(index, value){
							indexValue = external_accounts.indexOf(value)
							external_accounts.splice(indexValue, 1);
							internal_accounts.push(value);
						});
					}
					messageWindow.popUpMessage( "Successfully migrated", 3000 );
				}
				else
					alertBox.show('Alert!','Failure! The type for account(s) selected could not be changed. ');
			},
			failure: function(jqXHR){
				console.log(jqXHR.responseText);
			}
		});
	}
	
	function removeInteractionsFromTable(arrayOfTRInteractionIds){					
		console.log("remove is called");
		var tRow;
		var interactionIdRemove;
		$.each(arrayOfTRInteractionIds, function(index, value){
			interactionIdRemove 		 = value.split('_')[1];
			delete dd.allmap[interactionIdRemove];
			
			if(dd.inqueuemap.hasOwnProperty(interactionIdRemove)){
				if(delete dd.inqueuemap[interactionIdRemove]){
					dd.iCount.inqueue 		-= 1;
				}
			}
			if(dd.answeredmap.hasOwnProperty(interactionIdRemove)){
				if(delete dd.answeredmap[interactionIdRemove]){
					dd.iCount.answered 		-= 1;
				}
			}
			if(dd.inprogressmap.hasOwnProperty(interactionIdRemove)){
				if(delete dd.inprogressmap[interactionIdRemove]){
					dd.iCount.inprogress 	-= 1;
				}
			}
			if(dd.scheduledmap.hasOwnProperty(interactionIdRemove)){
				if(delete dd.scheduledmap[interactionIdRemove]){
					dd.iCount.scheduled 	-= 1;
				}
			}
			if(dd.stuckipmap.hasOwnProperty(interactionIdRemove)){
				if(delete dd.stuckipmap[interactionIdRemove]){
					dd.iCount.stuck 		-= 1;
				}
			}
			if(dd.completedmap.hasOwnProperty(interactionIdRemove)){
				if(delete dd.completedmap[interactionIdRemove]){
					dd.iCount.completed 	-= 1;
				}
			}
			if(dd.waitingmap.hasOwnProperty(interactionIdRemove)){
				if(delete dd.waitingmap[interactionIdRemove]){
					dd.iCount.waiting 		-=1;
				}
			}

			delete dd.currentStatusmap[interactionIdRemove];
			tRow = document.getElementById(value);
			$(tRow).remove();
		});
		dd.manipulateCounterForStatus(status);
	}
	
	function triggerActiveResponse(accnum,keyArr,valArr)
	{
		var arObj	=	new Object();
		var arStr	=	"";
		
		if(keyArr.length == valArr.length)
		{
				for(var i=0;i<keyArr.length;i++)
					{
						var key		=	keyArr[i].trim();
						var value 	=	valArr[i].trim();
						arObj[keyArr[i]] = valArr[i];
					}
		}
		if(accnum != "")
			arObj['accountnumber']	=	accnum;
		
		console.log("before sending----->"+JSON.stringify(arObj));
		arStr	=	JSON.stringify(arObj);
		var url	=	"/triggerActiveResponse?arObj="+arStr;

	//	messageWindow.showMessage( "triggering AR, Please wait");			

		$.ajax
		({
			type : "POST",
			url : url,
			success : function(data)
			{
				if(data == "success")
					{
						spinnerload.stop();
						messageWindow.popUpMessage( "Successfully triggered", 3000 );
						$('#aracc_num').val('');
						$('#ar_key').val('');
						$('#ar_value').val('');
						var builder = $('#dynamic_attributes').find('tr').length;
						for(var i=0;i<=builder;i++)
							{
								$('#ar_key_'+i).val('');
								$('#ar_value_'+i).val('');
								current_rows = 0;
							}
						document.getElementById('ar_pop').style.display	=	"none";
					}
				else
					{
						spinnerload.stop();
						messageWindow.popUpMessage( "Failed,Check the fields", 3000 );
						document.getElementById('ar_pop').style.display	=	"none";
					}
			}
		});
	}
	var file=null;
	function prepareUpload(event)
	{
		 var fileName = '';
		 var filePathElements = [];
		 file = event.target.files[0];
		 filePathElements = event.target.value.split('\\');
		 fileName = filePathElements[filePathElements.length-1];
		 file.name = fileName;
		 console.log("prepareUplode");
		 uplodeFile();
	}
	function uplodeFile()
	{	
		messageWindow.showMessage( "Uploading CSV , Please wait");		
		event.preventDefault();
			
		if(file!=null)
		{
			
				var formData = new FormData();
				formData.append("UploadFile", file);
				
				try 
				{
					validateAndUploadCSV();
					
				} 
				catch (e) 
				{
						$.getScript("../js/Library/papaparse.js", function(){
							validateAndUploadCSV();
						});
				}
		}
		else
		{
			    console.log("null is image");
		}
	}
	
	
	function validateAndUploadCSV()
	{
		var csvData = [];
		var csvKey  = [];
		var csvInfo = {};
		
		Papa.parse(file, {
			complete: function(results) {
			
				if(results.data.length>501)
					displayInvalidCSV("The maximum upload limit is 500!"); 
				
				if(results.errors.length <=0)
				{
					csvData =results.data;
					if(!!csvData && csvData.length>0){
						for(var index=0; index <= csvData[0].length-1 ; index++ ){
							if(csvData[0][index].toLowerCase() == "accountnumber")
								csvData[0][index] = "accountnumber";
							if(csvData[0][index].toLowerCase() == "phonenumber")
								csvData[0][index] = "phonenumber";
							csvKey.push(csvData[0][index]);
						}
					}
						
					csvInfo.csvData = csvData;
					csvInfo.csvFileName = file.name;
					
					if (csvKey.length>0 && (csvKey.indexOf('accountnumber') != -1) && (csvKey.indexOf('phonenumber') != -1) && csvData.length > 0)
					{
						uploadFormattedCsv(csvInfo);
					}
					else
					{
						displayInvalidCSV("");
						$("#choose-file").val("");
					}
				}
				else
				{
						var errorDetails = results.errors[0];
						displayInvalidCSV(errorDetails.type);
				}
			}
		});
	}
		
		
		
	function displayInvalidCSV(error)
	{
		messageWindow.hideMessage();
		$('#dynamicModalstartdiv').html('');

		if(!!!error)
		{
			$('#dynamicModalstartdiv').html('<div id="dynamicModalstartdiv"><div class="modal-content"> <div class="modal-header">  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>  <h4 class="modal-title" id="myLargeModalLabel">Upload Status : Failed</h4>     </div> <div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated">Invalid CSV File : </h4><table class="table"><thead><tr><th>Compulsory headers : </th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div></div>');
			$('#faildeleted_items').html("<tr><td>AccountNumber</td></tr><tr><td>PhoneNumber</td></tr>");
		}
		else
		{
			$('#dynamicModalstartdiv').html('<div id="dynamicModalstartdiv"><div class="modal-content"> <div class="modal-header">  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>  <h4 class="modal-title" id="myLargeModalLabel">Upload Status : Failed</h4>     </div> <div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated">Invalid File:</h4><table class="table"><thead><tr><th>Error Type : '+ error + '</th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div></div>');
		}
				
     	$('#deleting_status').modal('show');
	}
		
	function uploadFormattedCsv(csvInfo)
	{
		urltest = '/uploadcsv';
		$.ajax({
			beforeSend : function(xhr) {
				xhr.setRequestHeader("Accept", "application/json");
				xhr.setRequestHeader("Content-Type", "application/json");
			},
			url  : urltest,
			type : 'POST',
			data : JSON.stringify(csvInfo),
			dataType : 'text',
			success :function(data){
				messageWindow.hideMessage();
				if(data == "success")
					{
						messageWindow.popUpMessage( "Uploaded Successfully", 2 * 1000);	
						$("#choose-file").val("");
					}
				else
					{
						messageWindow.popUpMessage( "Upload Failded", 2 * 1000);
					}
				console.log(data.toString());
			},
			
		});
	}
	
	
	var newfile=null;
	function prepareAgentUpload(event)
	{
		 newfile = event.target.files[0];
		 console.log("prepareAgentUplode");
		 uplodeAgentFile();
	}
	function uplodeAgentFile()
	{	messageWindow.showMessage( "Uploading CSV , Please wait");	
		event.preventDefault();
		if(newfile!=null){
			
			var formData = new FormData();
			formData.append("UploadFileNew", newfile);
			var formURL;
			$.ajax
			({
				url: '/uplodeAgentFile',
				type: "POST",
				mimeType:"multipart/form-data",
				success: function(data)
				{
					formURL=data;
					$.ajax
					({
						url: formURL,
						type: "POST",
						mimeType:"multipart/form-data",
						data: formData,
						contentType: false,
						cache: false,
						processData:false,
						success: function(data)
						{
							messageWindow.hideMessage();
							console.log("newFile is here : : "+data)
							var response = JSON.parse(data);
							console.log("The value of data"+ data);
							if(response["success"])
							{
								var messageString = response["resultMsg"];
								
								if(messageString.length > 0)
								{
									
									
									$('#dynamicModalstartdiv').html('');
									$('#dynamicModalstartdiv').html('<div id="dynamicModalstartdiv"><div class="modal-content"> <div class="modal-header">  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>  <h4 class="modal-title" id="myLargeModalLabel"> Upload success </h4>     </div> <div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated"></h4><table class="table"><thead><tr><th></th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div></div></th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div>');
							     	$('#faildeleted_items').html(messageString);
							     	$('#deleting_status').modal('show');	
							     	
								}
								else
								{
									$('#dynamicModalstartdiv').html('');
									$('#dynamicModalstartdiv').html('<div id="dynamicModalstartdiv"><div class="modal-content"> <div class="modal-header">  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>  <h4 class="modal-title" id="myLargeModalLabel">Upload success</h4>     </div> <div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated"></h4><table class="table"><thead><tr><th></th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div></div></th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div>');
							     	$('#faildeleted_items').html(messageString);
							     	$('#deleting_status').modal('show');	
								}
								
//								var timeout = setTimeout("location.reload(true);",1000);
//								function resetTimeout() {
//								clearTimeout(timeout);
//								timeout = setTimeout("location.reload(true);",1000);
//								}
							}
							else
							{   
								var messageString = response["resultMsg"];

								messageWindow.showMessage( "there was some error, view the alert for more info");	
								$('#dynamicModalstartdiv').html('');
								$('#dynamicModalstartdiv').html('<div id="dynamicModalstartdiv"><div class="modal-content"> <div class="modal-header">  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>  <h4 class="modal-title" id="myLargeModalLabel">Upload Status : Failed</h4>     </div> <div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated"></h4><table class="table"><thead><tr><th></th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div></div></th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div>');
						     	$('#faildeleted_items').html(messageString);
						     	$('#deleting_status').modal('show');
						     	messageWindow.hideMessage();

//						     	var timeout = setTimeout("location.reload(true);",1000);
//								function resetTimeout() {
//								clearTimeout(timeout);
//								timeout = setTimeout("location.reload(true);",1000);
//								}
							}
							var control = $('#newchoose-newfile');
							control.replaceWith( control = control.clone( true ) );
							newfile = null;
						},
					});
				},
			});
			}else
			{
		     	messageWindow.hideMessage();
				console.log("the file was read as null... What the HEck!!");
			}
	}
	
	
	
	function splitSubAccountNumberArrayToMakeServerCall(subAccountNumArray){
		var subAccountNumArrayTemp = subAccountNumArray;
		var subAccountNumSplittedArrayTemp = [];
		var subAccountNumArray = [];
		do{
           
			subAccountNumArray = subAccountNumArrayTemp.splice(0,subAccountNumArrayTemp.length >= 30 ? 30 :subAccountNumArrayTemp.length );
			if(subAccountNumArray.length > 0){
				subAccountNumSplittedArrayTemp.push(subAccountNumArray);
			}
		}while(subAccountNumArrayTemp.length>=1);
		
		return subAccountNumSplittedArrayTemp;
		
	}
