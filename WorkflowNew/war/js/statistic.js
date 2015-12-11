var ZeroClipboard = ZeroClipboard || undefined; 
var messageWindow = new MessageWindow();
messageWindow.injectMain();
$(document).ready(function()
  {
	if(ZeroClipboard)
		ZeroClipboard.config( { swfPath: "../js/ZeroClipboard.swf" } );
	var nowTemp = new Date();
	var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
	var checkin = $('#inputDate1').datepicker({
	    onRender: function (date) {
	        return date.valueOf() > now.valueOf() ? 'disabled' : '';
	    }
	}).on('changeDate', function (ev) {
	    
	    //made changes to condition below
	    var newDate = new Date(ev.date)
	    checkout.setValue(newDate);
	    checkin.hide();
	    $('#inputDate2')[0].focus();
	}).data('datepicker');
	var checkout = $('#inputDate2').datepicker({
	    onRender: function (date) {
	       //made changes to below line
	       var after = new Date(checkin.date);
	       after.setDate(after.getDate() + 91);
	       if(now.valueOf() > after.valueOf())
	    	   {
	    	   return (date.valueOf() <= after.valueOf()) && (date.valueOf()>= checkin.date.valueOf()) ? '' : 'disabled';	    	   
	    	   }
	       else if(after.valueOf() > now.valueOf())
	    	   {
		       return (date.valueOf() <= now.valueOf()) && (date.valueOf()>= checkin.date.valueOf()) ? '' : 'disabled';
	    	   }
	    }
	}).on('changeDate', function (ev) {
	    checkout.hide();
	}).data('datepicker');
    var dateEnd = $('#inputDate2')
    .datepicker()
    .on('changeDate', function(ev){
        dateEnd.datepicker('hide');
    });
   
    $('#inputDate1').datepicker("setValue",  new Date().setDate(new Date().getDate()-7));
	$('#inputDate2').datepicker("setValue", new Date());
	
	$('#Load_button').click(function(){
		doInitialAction();
	});
	 var toDate		=	formateDate(new Date().getTime());
	 var fromDate 	=	new Date();
	 	 fromDate.setDate(fromDate.getDate()-7);
	 	 fromDate	=	formateDate(fromDate);
	 
	getStats(fromDate,toDate);
	$("#queryButton").html('Last 7 Days <span class="caret"></span>');
  });
 var keys					=	["total","completed","scheduled","others","failed"];
 var otherKeys				=	["answered","inActive","inProgress","unAnswered","inqueue","misc"];
 var completedKeys			=	["completed","completedF8", "completedFetch", "completedResolved", "completedTabClose", "dialout", "closed", "callended"];
 var buttonKeys				=	new Array();
 buttonKeys["answered"]		=	"answered";
 buttonKeys["inActive"]		=	"pending";
 buttonKeys["inProgress"]	=	"progress";
 buttonKeys["InProgresschats"] = "progress";
 buttonKeys["unAnswered"]	=	"answered";
 buttonKeys["inqueue"]		=	"queue";
 buttonKeys["misc"]			=	"stuck";
 var chatExternalMap		=	new Object();
 var ARExternalMap			=	new Object();
 var ARInternalMap			=	new Object();
 var summeryARExternal		=	new Object();
 var summeryARInternal		=	new Object();
 var summeryChatExternal 	= 	new Object();
 function getStats(fromDate,toDate)
 {
	// messageWindow.showMessage( "Loading...");
	 url 	=	"/getStatisticreport/"+fromDate+"/"+toDate;
	 console.log("URL is :: "+url)
	 chatExternalMap		=	new Object();
	 ARExternalMap			=	new Object();
	 ARInternalMap			=	new Object();
	 summeryARExternal		=	new Object();
	 summeryARInternal		=	new Object();
	 summeryChatExternal 	= 	new Object();
	 $("#detail_table").html('');
//	 $("#Summery_data").html('');
			$.ajax
			({
				type : "GET",
				url : url,
				async:true,
				success : function(data)
				{
					messageWindow.hideMessage();
					console.log("Data obtained for statistics "+data);
					var resultantList = JSON.parse(data);
					console.log("This is the resultantList",resultantList);
					for(var i=0;i<resultantList.length;i++)
					{
						var date = new Date(resultantList[i]["date"]);
						if(resultantList[i]["type"]== "AR-Internal")
						{
							ARInternalMap[date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()]	=	resultantList[i];
						}
						if(resultantList[i]["type"]== "AR-External")
						{
							ARExternalMap[date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()]	=	resultantList[i];
						}
						if(resultantList[i]["type"]== "Chat-External")
						{
							chatExternalMap[date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()]	=	resultantList[i];
						}
					}
					var quiredDays = new Array();
					
					quiredDays		=	Object.keys(ARExternalMap);
					console.log("Quired Days Are : "+quiredDays);
					for (var i = 0; i < quiredDays.length; i++) 
					{
						console.log("date is here"+quiredDays[i])
						displayDates(quiredDays[i]);
					}
					SummeryReport();
				}
			});
 }
 function displayDates(date)
 {
	 var htmlString = "";
	 var loop		= keys.length;
	 var otherARExternalCount	=	0;
	 var otherARInternalCount	=	0;
	 var otherChatExternalCount	=	0;
	 var otherARExternalPopup	=	"";
	 var otherARInternalPopup	=	"";
	 var otherChatExternalPopup	=	"";
	 var completedARExternalCount	=	0;
	 var completedARInternalCount	=	0;
	 var completedChatExternalCount	=	0;
	 var completedARExternalPopup	=	"";
	 var completedARInternalPopup	=	"";
	 var completedChatExternalPopup	=	"";

	 try {
		 for (var i = 0; i < loop; i++) 
		 {
			 var key = keys[i];
			 var keyName = '';
			 var button  =	"scheduled";
			 
			 console.log(key);
				if (key.indexOf('scheduled') != -1)
				{
					button	=	"scheduled"; 
					keyName	=	"Scheduled";
				}
				else if (key.indexOf('failed') != -1)
				{
					button	=	'pending';
					keyName	=	"Failed";
				}
				else if (key.indexOf('total') != -1)
				{
					button	=	'progress';
					keyName	=	"Total";
				}
				else if (key.indexOf('others') != -1)
				{
					button =	"answered";
					keyName =	"Others";
					var dataARExternal = '';
					var dataARInternal = '';
					var dataChatExternal = '';
					for(var j=0; j < otherKeys.length; j++) {
						var otherKey			= otherKeys[j];
						otherARExternalCount	= otherARExternalCount + ((ARExternalMap[date][otherKey] != null) ? ARExternalMap[date][otherKey] : 0);
						otherARInternalCount	= otherARInternalCount + ((ARInternalMap[date][otherKey] != null) ? ARInternalMap[date][otherKey] : 0);
						if(key.indexOf("inProgress") != -1) 
						{
							otherChatExternalCount	= otherChatExternalCount + ((chatExternalMap[date]["inProgresschats"] != null) ? chatExternalMap[date]["inProgresschats"] : 0);
							dataChatExternal		= dataChatExternal + "<tr><td class='popup_td'><span class= 'label btn-"+buttonKeys[otherKey]+"' style='font-size: 12px;'>InProgresschats</span></td><td class='popup_td'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+((chatExternalMap[date]["inProgresschats"] != null) ? chatExternalMap[date]["inProgresschats"] : 0)+"</td></tr>";
						}
						else
						{
							otherChatExternalCount	= otherChatExternalCount + ((chatExternalMap[date][otherKey] != null) ? chatExternalMap[date][otherKey] : 0);
							dataChatExternal		= dataChatExternal + "<tr><td class='popup_td'><span class= 'label btn-"+buttonKeys[otherKey]+"' style='font-size: 12px;'>"+otherKey+"</span></td><td class='popup_td'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+((chatExternalMap[date][otherKey] != null) ? chatExternalMap[date][otherKey] : 0)+"</td></tr>";
						}
						dataARExternal			= dataARExternal + "<tr><td class='popup_td'><span class= 'label btn-"+buttonKeys[otherKey]+"' style='font-size: 12px;'>"+otherKey+"</span></td><td class='popup_td'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+((ARExternalMap[date][otherKey] != null) ? ARExternalMap[date][otherKey] : 0)+"</td></tr>";
						dataARInternal			= dataARInternal + "<tr><td class='popup_td'><span class= 'label btn-"+buttonKeys[otherKey]+"' style='font-size: 12px;'>"+otherKey+"</span></td><td class='popup_td'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+((ARInternalMap[date][otherKey] != null) ? ARInternalMap[date][otherKey] : 0)+"</td></tr>";					
						if(summeryARExternal[otherKey] != null)
							summeryARExternal[otherKey]		=	summeryARExternal[otherKey] + ARExternalMap[date][otherKey];
						else
							summeryARExternal[otherKey]		=	ARExternalMap[date][otherKey];

						if(summeryARInternal[otherKey] != null)
							summeryARInternal[otherKey]		=	summeryARInternal[otherKey] + ARInternalMap[date][otherKey];
						else
							summeryARInternal[otherKey]		=	ARInternalMap[date][otherKey];

						if(summeryChatExternal[otherKey] != null)
							summeryChatExternal[otherKey]	=	summeryChatExternal[otherKey] + chatExternalMap[date][otherKey];
						else
							summeryChatExternal[otherKey]	=	chatExternalMap[date][otherKey];
					}
					otherARExternalPopup = '<a data-toggle="popover" data-placement="bottom" data-html="true" tabindex="0" title="Others" data-content="'+dataARExternal+'" style="cursor:text; text-decoration: none; color:black; ">'+otherARExternalCount+'</a>';
					otherARInternalPopup = '<a data-toggle="popover" data-placement="bottom" data-html="true" tabindex="0" title="Others" data-content="'+dataARInternal+'" style="cursor:text; text-decoration: none; color:black; ">'+otherARInternalCount+'</a>';
					otherChatExternalPopup = '<a data-toggle="popover" data-placement="bottom" data-html="true" tabindex="0" title="Others" data-content="'+dataChatExternal+'" style="cursor:text; text-decoration: none; color:black; ">'+otherChatExternalCount+'</a>';
				}
				else if	(key.indexOf('completed') != -1)
				{
					button	=	'completed';
					keyName	=	"Completed";
					var dataARExternal = '';
					var dataARInternal = '';
					var dataChatExternal = '';
					for(var k=0; k < completedKeys.length; k++) {
						var completedKey	= completedKeys[k];
						completedARExternalCount	= completedARExternalCount + ((ARExternalMap[date][completedKey] != null) ? ARExternalMap[date][completedKey] : 0);
						completedARInternalCount	= completedARInternalCount + ((ARInternalMap[date][completedKey] != null) ? ARInternalMap[date][completedKey] : 0);
						completedChatExternalCount	= completedChatExternalCount + ((chatExternalMap[date][completedKey] != null) ? chatExternalMap[date][completedKey] : 0);
						dataARExternal			= dataARExternal + "<tr><td class='popup_td'><span class= 'label btn-"+button+"' style='font-size: 12px;'>"+completedKey+"</span></td><td class='popup_td'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+((ARExternalMap[date][completedKey] != null) ? ARExternalMap[date][completedKey] : 0)+"</td></tr>";
						dataARInternal			= dataARInternal + "<tr><td class='popup_td'><span class= 'label btn-"+button+"' style='font-size: 12px;'>"+completedKey+"</span></td><td class='popup_td'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+((ARInternalMap[date][completedKey] != null) ? ARInternalMap[date][completedKey] : 0)+"</td></tr>";
						dataChatExternal		= dataChatExternal + "<tr><td class='popup_td'><span class= 'label btn-"+button+"' style='font-size: 12px;'>"+completedKey+"</span></td><td class='popup_td'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+((chatExternalMap[date][completedKey] != null) ? chatExternalMap[date][completedKey] : 0)+"</td></tr>";

						if(summeryARExternal[completedKey] != null)
							summeryARExternal[completedKey]		=	summeryARExternal[completedKey] + ARExternalMap[date][completedKey];
						else
							summeryARExternal[completedKey]		=	ARExternalMap[date][completedKey];
				
						if(summeryARInternal[completedKey] != null)
							summeryARInternal[completedKey]		=	summeryARInternal[completedKey] + ARInternalMap[date][completedKey]
						else
							summeryARInternal[completedKey]		=	ARInternalMap[date][completedKey];
						
						if(summeryChatExternal[completedKey] != null)
							summeryChatExternal[completedKey]	=	summeryChatExternal[completedKey] + chatExternalMap[date][completedKey];
						else
							summeryChatExternal[completedKey]	=	chatExternalMap[date][completedKey];
					}
					completedARExternalPopup = '<a data-toggle="popover" data-placement="bottom" data-html="true" tabindex="0" title="Completed" data-content="'+dataARExternal+'" style="cursor:text; text-decoration: none; color:black; ">'+completedARExternalCount+'</a>';
					completedARInternalPopup = '<a data-toggle="popover" data-placement="bottom" data-html="true" tabindex="0" title="Completed" data-content="'+dataARInternal+'" style="cursor:text; text-decoration: none; color:black; ">'+completedARInternalCount+'</a>';
					completedChatExternalPopup = '<a data-toggle="popover" data-placement="bottom" data-html="true" tabindex="0" title="Completed" data-content="'+dataChatExternal+'" style="cursor:text; text-decoration: none; color:black; ">'+completedChatExternalCount+'</a>';
				}
				else
				{
					console.log("Inside else part");
				}
				if((key.indexOf("others") == -1 && key.indexOf("completed") == -1)){
					 if(summeryARExternal[key] != null)
						 summeryARExternal[key]		=	summeryARExternal[key] + ARExternalMap[date][key];
					 else
						 summeryARExternal[key]		=	ARExternalMap[date][key];
		
					 if(summeryARInternal[key] != null)
						 summeryARInternal[key]		=	summeryARInternal[key] + ARInternalMap[date][key];
					 else
						 summeryARInternal[key]		=	ARInternalMap[date][key];
		
					 if(summeryChatExternal[key] != null)
						 summeryChatExternal[key]	=	summeryChatExternal[key] + chatExternalMap[date][key];
					 else
						 summeryChatExternal[key]	=	chatExternalMap[date][key];
				}
				
				if(key == "total"){
					htmlString = htmlString+"<tr><td class='stat_td'>"+date+"</td><td class='stat_td'><span class= 'label btn-"+button+"' style='font-size: 12px;'>"+keyName+"</span></td><td class='stat_td'>"+((ARExternalMap[date][key] != null) ? ARExternalMap[date][key] : 0)+"</td><td class='stat_td'>"+((ARInternalMap[date][key] != null) ? ARInternalMap[date][key] : 0)+"</td><td class='stat_td'>"+((chatExternalMap[date][key] != null) ? chatExternalMap[date][key] : 0)+"</td>"         
				}
				else if(key == "others"){
					htmlString = htmlString+"<tr><td class='stat_td'></td><td class='stat_td'><span class= 'label btn-"+button+"' style='font-size: 12px;'>"+keyName+"</span></td><td class='stat_td'>"+otherARExternalPopup+"</td><td class='stat_td'>"+otherARInternalPopup+"</td><td class='stat_td'>"+otherChatExternalPopup+"</td>"         
				}
				else if(key == "completed"){
					htmlString = htmlString+"<tr><td class='stat_td'></td><td class='stat_td'><span class= 'label btn-"+button+"' style='font-size: 12px;'>"+keyName+"</span></td><td class='stat_td'>"+completedARExternalPopup+"</td><td class='stat_td'>"+completedARInternalPopup+"</td><td class='stat_td'>"+completedChatExternalPopup+"</td>"       
				}
				else{
					htmlString = htmlString+"<tr><td class='stat_td'></td><td class='stat_td'><span class= 'label btn-"+button+"' style='font-size: 12px;'>"+keyName+"</span></td><td class='stat_td'>"+((ARExternalMap[date][key] != null) ? ARExternalMap[date][key] : 0)+"</td><td class='stat_td'>"+((ARInternalMap[date][key] != null) ? ARInternalMap[date][key] : 0)+"</td><td class='stat_td'>"+((chatExternalMap[date][key] != null) ? chatExternalMap[date][key] : 0)+"</td>"         
				}
		 }
	 }
	 catch(e)
	 {
		 console.log("There was an error",e);
	 }
	 $("#detail_table").append(htmlString);
 }
 function SummeryReport()
 {
	 var htmlSummery  =	"";
	 var totalotherARExternalCount			=	0;
	 var totalotherARInternalCount			=	0;
	 var totalotherChatExternalCount		=	0;
	 var totalotherARExternalPopup			=	"";
	 var totalotherARInternalPopup			=	"";
	 var totalotherChatExternalPopup		=	"";
	 var totalcompletedARExternalCount		=	0;
	 var totalcompletedARInternalCount		=	0;
	 var totalcompletedChatExternalCount	=	0;
	 var totalcompletedARExternalPopup		=	"";
	 var totalcompletedARInternalPopup		=	"";
	 var totalcompletedChatExternalPopup	=	"";

	 for (var n = 0; n < keys.length; n++) 
	 {
		 var key = keys[n];
		 var keyName ;
		 var button 	=	"scheduled";	
		 
		 console.log(key);
			if (key.indexOf('scheduled') != -1)
			{
				button	=	"scheduled"; 
				keyName	=	"Scheduled";
			}
			else if (key.indexOf('failed') != -1)
			{
				button	=	'pending';
				keyName	=	"Failed";
			}
			else if	(key.indexOf('completed') != -1)
			{
				button	=	'completed';
				keyName	=	"Completed";
				var dataARExternal = '';
				var dataARInternal = '';
				var dataChatExternal = '';
				for(var l=0; l < completedKeys.length; l++) {
					var completedKey	= completedKeys[l];
					totalcompletedARExternalCount	= totalcompletedARExternalCount + ((summeryARExternal[completedKey] != null) ? summeryARExternal[completedKey] : 0);
					totalcompletedARInternalCount	= totalcompletedARInternalCount + ((summeryARInternal[completedKey] != null) ? summeryARInternal[completedKey] : 0);
					totalcompletedChatExternalCount	= totalcompletedChatExternalCount + ((summeryChatExternal[completedKey] != null) ? summeryChatExternal[completedKey] : 0);
					dataARExternal			= dataARExternal + "<tr><td class='popup_td'><span class= 'label btn-"+button+"' style='font-size: 12px;'>"+completedKey+"</span></td><td class='popup_td'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+((summeryARExternal[completedKey] != null) ? summeryARExternal[completedKey] : 0)+"</td></tr>";
					dataARInternal			= dataARInternal + "<tr><td class='popup_td'><span class= 'label btn-"+button+"' style='font-size: 12px;'>"+completedKey+"</span></td><td class='popup_td'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+((summeryARInternal[completedKey] != null) ? summeryARInternal[completedKey] : 0)+"</td></tr>";
					dataChatExternal		= dataChatExternal + "<tr><td class='popup_td'><span class= 'label btn-"+button+"' style='font-size: 12px;'>"+completedKey+"</span></td><td class='popup_td'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+((summeryChatExternal[completedKey] != null) ? summeryChatExternal[completedKey] : 0)+"</td></tr>";
				}
				totalcompletedARExternalPopup = '<a data-toggle="popover" data-placement="top" data-html="true" tabindex="0" title="Completed" data-content="'+dataARExternal+'" style="cursor:text; text-decoration: none; color:black; ">'+totalcompletedARExternalCount+'</a>';
				totalcompletedARInternalPopup = '<a data-toggle="popover" data-placement="top" data-html="true" tabindex="0" title="Completed" data-content="'+dataARInternal+'" style="cursor:text; text-decoration: none; color:black; ">'+totalcompletedARInternalCount+'</a>';
				totalcompletedChatExternalPopup = '<a data-toggle="popover" data-placement="top" data-html="true" tabindex="0" title="Completed" data-content="'+dataChatExternal+'" style="cursor:text; text-decoration: none; color:black; ">'+totalcompletedChatExternalCount+'</a>';
			}
			else if (key.indexOf('others') != -1)
			{
				button 	=	"answered";
				keyName =	"Others";
				var dataARExternal = '';
				var dataARInternal = '';
				var dataChatExternal = '';
				for(var m=0; m < otherKeys.length; m++) {
					var otherKey				= otherKeys[m];
					totalotherARExternalCount	= totalotherARExternalCount + ((summeryARExternal[otherKey] != null) ? summeryARExternal[otherKey] : 0);
					totalotherARInternalCount	= totalotherARInternalCount + ((summeryARInternal[otherKey] != null) ? summeryARInternal[otherKey] : 0);
					if(key.indexOf("inProgress") != -1) 
					{
						totalotherChatExternalCount	= totalotherChatExternalCount + ((summeryChatExternal["inProgresschats"] != null) ? summeryChatExternal["inProgresschats"] : 0);
						dataChatExternal		= dataChatExternal + "<tr><td class='popup_td'><span class= 'label btn-"+buttonKeys[otherKey]+"' style='font-size: 12px;'>"+otherKey+"</span></td><td class='popup_td'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+((summeryChatExternal["inProgresschats"] != null) ? summeryChatExternal["inProgresschats"] : 0)+"</td></tr>";
					}
					else
					{
						totalotherChatExternalCount	= totalotherChatExternalCount + ((summeryChatExternal[otherKey] != null) ? summeryChatExternal[otherKey] : 0);
						dataChatExternal		= dataChatExternal + "<tr><td class='popup_td'><span class= 'label btn-"+buttonKeys[otherKey]+"' style='font-size: 12px;'>"+otherKey+"</span></td><td class='popup_td'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+((summeryChatExternal[otherKey] != null) ? summeryChatExternal[otherKey] : 0)+"</td></tr>";
					}
					dataARExternal			= dataARExternal + "<tr><td class='popup_td'><span class= 'label btn-"+buttonKeys[otherKey]+"' style='font-size: 12px;'>"+otherKey+"</span></td><td class='popup_td'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+((summeryARExternal[otherKey] != null) ? summeryARExternal[otherKey] : 0)+"</td></tr>";
					dataARInternal			= dataARInternal + "<tr><td class='popup_td'><span class= 'label btn-"+buttonKeys[otherKey]+"' style='font-size: 12px;'>"+otherKey+"</span></td><td class='popup_td'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+((summeryARInternal[otherKey] != null) ? summeryARInternal[otherKey] : 0)+"</td></tr>";
				}
				totalotherARExternalPopup = '<a data-toggle="popover" data-placement="top" data-html="true" tabindex="0" title="Others" data-content="'+dataARExternal+'" style="cursor:text; text-decoration: none; color:black; ">'+totalotherARExternalCount+'</a>';
				totalotherARInternalPopup = '<a data-toggle="popover" data-placement="top" data-html="true" tabindex="0" title="Others" data-content="'+dataARInternal+'" style="cursor:text; text-decoration: none; color:black; ">'+totalotherARInternalCount+'</a>';
				totalotherChatExternalPopup = '<a data-toggle="popover" data-placement="top" data-html="true" tabindex="0" title="Others" data-content="'+dataChatExternal+'" style="cursor:text; text-decoration: none; color:black; ">'+totalotherChatExternalCount+'</a>';
			}
			else if (key.indexOf('total') != -1)
			{
				button	=	'progress';
				keyName	=	"Total";
			}
			if(key == "total"){
				htmlSummery = htmlSummery+"<tr><td class='stat_td'>Summery</td><td class='stat_td'><span class= 'label btn-"+button+"' style='font-size: 12px;'>"+keyName+"</span></td><td class='stat_td'>"+((summeryARExternal[key] != null) ? summeryARExternal[key] : 0)+"</td><td class='stat_td'>"+((summeryARInternal[key] != null) ? summeryARInternal[key] : 0)+"</td><td class='stat_td'>"+((summeryChatExternal[key] != null) ? summeryChatExternal[key] : 0)+"</td>"         
			} 
			else if(key == "others"){
				htmlSummery = htmlSummery+"<tr><td class='stat_td'></td><td class='stat_td'><span class= 'label btn-"+button+"' style='font-size: 12px;'>"+keyName+"</span></td><td class='stat_td'>"+totalotherARExternalPopup+"</td><td class='stat_td'>"+totalotherARInternalPopup+"</td><td class='stat_td'>"+totalotherChatExternalPopup+"</td>"         
			}
			else if(key == "completed"){
				htmlSummery = htmlSummery+"<tr><td class='stat_td'></td><td class='stat_td'><span class= 'label btn-"+button+"' style='font-size: 12px;'>"+keyName+"</span></td><td class='stat_td'>"+totalcompletedARExternalPopup+"</td><td class='stat_td'>"+totalcompletedARInternalPopup+"</td><td class='stat_td'>"+totalcompletedChatExternalPopup+"</td>"         
			} 
			else {
				htmlSummery = htmlSummery+"<tr><td class='stat_td'></td><td class='stat_td'><span class= 'label btn-"+button+"' style='font-size: 12px;'>"+keyName+"</span></td><td class='stat_td'>"+((summeryARExternal[key] != null) ? summeryARExternal[key] : 0)+"</td><td class='stat_td'>"+((summeryARInternal[key] != null) ? summeryARInternal[key] : 0)+"</td><td class='stat_td'>"+((summeryChatExternal[key] != null) ? summeryChatExternal[key] : 0)+"</td>"         
			}
	 }
	 $("#detail_table").append(htmlSummery);
	 $('[data-toggle="popover"]').each(function () {
	        var $elem = $(this);
	        $elem.popover({
	            trigger: 'hover',
	            container: $elem,
	            animation: true,
	        });
	  });
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
 	var date		= getmonth_date+"-"+getDate+"-"+dates.getFullYear();
 	return date;
 }
 function doInitialAction()
 {
 	var fromDate=	$('#inputDate1').val();
 	var toDate	=	$('#inputDate2').val();
 	var validatedateresult	=	ValidateDates(new Date(fromDate),new Date(toDate));
 	if(String(validatedateresult).match(true))
 	{
 		getStats(getFromDateFormatted(),getToDateFormatted())
 		console.log("fromDate :: "+getFromDateFormatted()+"todate :: "+getToDateFormatted())
 	}
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
 function ValidateDates(fromDate,toDate)
 {
 	var currentDate	= new Date();
 	if(fromDate <= currentDate || toDate <= currentDate)
 	{	
 		if(toDate >= fromDate)
 			return true ;
 		else 
 		{
 			alertBox.show('Alert!',"Oops. Date Range is not valid. Please check.");
 			return false ;
 		}
 	}
 	else
 	{
 		alertBox.show('Alert!',"Oops. Date Range is not valid. Please check.");
 		return false ;
 	}

 }
 