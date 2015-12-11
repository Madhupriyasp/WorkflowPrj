/**
 * @author balu
 */

var opts = {
  lines: 13, // The number of lines to draw
  length: 15, // The length of each line
  width: 15, // The line thickness
  radius: 36, // The radius of the inner circle
  corners: 1.0, // Corner roundness (0..1)
  rotate: 71, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 1, // Rounds per second
  trail: 64, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 200, // The z-index (defaults to 200)
  top: '350px', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};


$( document ).ready(function() {

	if((activeListenersCount==0)&&(inactiveListenersCount==0)){
	for( var i = 0; i < emailListenerClientDetails.length; i++){
		if( emailListenerClientDetails[i].status === "true" )
			activeListenersCount++;
		else
			inactiveListenersCount++;
	} 
	loadActiveListeners();
	}

	
	$('.allListeners').html(emailListenerClientDetails.length);
	$('.activeListeners').html(activeListenersCount);
	$('.inactiveListeners').html(inactiveListenersCount);	
	
	$('#fetchme').click(function(){
		var pathname = location.href;
		var path	 = pathname.split('/')[2];	
		if($("#fetchinbox").val() == ""|| $("#fetchinbox").val() == undefined || $("#fetchinbox").val() == null){
			 $("#fetchinbox").attr("placeholder", "Enter Account Number");
		}else{
			var accNo	 =	 $("#fetchinbox").val();
			var url = "http://"+path+"/?fetch=true&accno="+accNo.trim();
			window.location.href=url;
		}
	
		});
});


$("#allListenersClick").on("click", function(){
	$('#search_box').val('');
	$("#table_data").html('');
	loadActiveListeners();
	loadInActiveListeners();
	console.log("all");
});

$("#activeListenersClick").on("click", function(){
	$('#search_box').val('');
	$("#table_data").html('');
	console.log("active");
	loadActiveListeners();
});

$("#inactiveListenersClick").on("click", function(){
	$('#search_box').val('');
	$("#table_data").html('');
	console.log("inactive");
	loadInActiveListeners();
});

function loadActiveListeners(){
	console.log("Loading active listeners");
	var allTrs	= "",
		label	= "";
	for( var i = 0; i < emailListenerClientDetails.length; i++){
		if( emailListenerClientDetails[i].status === "true" ){
			( emailListenerClientDetails[i].folderName === ""|| "undefined" || null || undefined ) ? ( label = "NA") : ( label = emailListenerClientDetails[i].folderName )
					
					if(!!!emailListenerClientDetails[i].emailAddress || emailListenerClientDetails[i].emailAddress.toLowerCase() === 'null')
						emailListenerClientDetails[i].emailAddress = "NA";					
			allTrs += '<tr id="'+emailListenerClientDetails[i].listenerId+'">'+
				  /*'<td style="width:9%;">'+emailListenerClientDetails[i].listenerId+'</td>'+*/
				  '<td style="width:9%;">'+emailListenerClientDetails[i].clientId+'</td>'+
				  '<td style="width:27%;">'+emailListenerClientDetails[i].emailAddress+'</td>'+
				  /*'<td style="width:10%;">'+emailListenerClientDetails[i].pollingRate+'</td>'+*/
				  '<td style="width:8%;"><span style="background: #ABABAB;padding: .2em 2.6em .3em;" id="'+emailListenerClientDetails[i].listenerId+'_startbutton" class="label btn-completed">Start</span></td>'+
				  '<td style="width:7%;"><span style="cursor:pointer;padding: .2em 2.6em .3em;" id="'+emailListenerClientDetails[i].listenerId+'_stopbutton" class="label btn-stuck" onclick=popuptoStopEmailListener("'+emailListenerClientDetails[i].listenerId+'")>Stop</span></td>'+
				  '<td style="width:10%;">'+emailListenerClientDetails[i].status+'</td>';
				  /*'<td style="width:10%;">'+label+'</td>';*/
				  allTrs	= allTrs + '</tr>';
				  
		}
	}
	$("#table_data").append(allTrs);
}

function loadInActiveListeners(){
	console.log("Loading in-active listeners");
	var allTrs	= "",
		label	= "";
	for( var i = 0; i < emailListenerClientDetails.length; i++){
		if( emailListenerClientDetails[i].status === "false" ){
			( emailListenerClientDetails[i].folderName === "" || "undefined" || null || undefined ) ? ( label = "NA") : ( label = emailListenerClientDetails[i].folderName )
		if(!!!emailListenerClientDetails[i].emailAddress || emailListenerClientDetails[i].emailAddress.toLowerCase() === 'null')
			emailListenerClientDetails[i].emailAddress = "NA";	
			allTrs += '<tr id="'+emailListenerClientDetails[i].listenerId+'">'+
				  /*'<td style="width:9%;">'+emailListenerClientDetails[i].listenerId+'</td>'+*/
				  '<td style="width:9%;">'+emailListenerClientDetails[i].clientId+'</td>'+
				  '<td style="width:27%;">'+emailListenerClientDetails[i].emailAddress+'</td>'+
				  /*'<td style="width:10%;">'+emailListenerClientDetails[i].pollingRate+'</td>'+*/
				  '<td style="width:8%;"><span style="cursor:pointer;padding: .2em 2.6em .3em;" id="'+emailListenerClientDetails[i].listenerId+'_startbutton" class="label btn-completed" onclick=popuptoStartEmailListener("'+emailListenerClientDetails[i].listenerId+'")>Start</span></td>'+
				  '<td style="width:7%;"><span style="background: #ABABAB;padding: .2em 2.6em .3em;" id="'+emailListenerClientDetails[i].listenerId+'_stopbutton" class="label btn-stuck")>Stop</span></td>'+
				  '<td style="width:10%;">'+emailListenerClientDetails[i].status+'</td>';
				  /*'<td style="width:10%;">'+label+'</td>';*/
			  
			  allTrs	= allTrs + '</tr>';
		}
	}
	$("#table_data").append(allTrs);
}

function popuptoStartEmailListener(listenerid)
{
	bootbox.dialog({
		message:"Are you sure you want to start the account ?",
		title:'Warning!',
		buttons:{
			success:{
				label:"Proceed",
				className:'btn-success',
				callback: function() {
							startEmailListener(listenerid);
						}
					},
			cancel:{
						label:'Cancel',
						className:'btn-close'
						}
					}
				});

}

function popuptoStopEmailListener(listenerid)
{
	bootbox.dialog({
		message:"Are you sure you want to stop the account ?",
		title:'Warning!',
		buttons:{
			success:{
				label:"Proceed",
				className:'btn-success',
				callback: function() {
							stopEmailListener(listenerid);
						}
					},
			cancel:{
						label:'Cancel',
						className:'btn-close'
						}
					}
				});

}
function enableORdisableNewEmailReader(ele)
{
	var req			=	{};
	var listenerId	=	ele.name;
	var clientId	=	ele.value;
	req.clientId	=	clientId;
	req.listenerId	=	listenerId;
	if(ele.checked)
	{
		req.isNewEmailReader	=	"true";

	}else
	{
		req.isNewEmailReader	=	"false";

	}
	$("#"+listenerId+"_stopbutton").html('Stopping');
	$.ajax
	({
		type : "POST",
		url : '/startandstopNewEmailReader',
		data : {parameters: JSON.stringify(req)},
		success : function(data)
		{
			console.log(data);
			for( var i = 0; i < emailListenerClientDetails.length; i++)
			{
				if( emailListenerClientDetails[i].listenerId === listenerId )
				{
					var status	=	emailListenerClientDetails[i].status;
					if(status.toLowerCase() == "true")
					{
						$("#"+listenerId+"_stopbutton").html('Stop');
						emailListenerClientDetails[i].statusGAEReader	=	req.isNewEmailReader
						startEmailListenerNew(listenerId);
					}
					else
					{
						$("#"+listenerId+"_stopbutton").html('Stop');
					}
				}
			}
//			if(data == "Failure" || data != "success")
//			{
//				$("#"+listenerId+"_startbutton").html('');
//			}
//			else
//			{
//			}
		}
	});	
}
function startEmailListenerNew(listenerId)
{
	$("#"+listenerId+"_startbutton").html('Starting');
	var requestParams	= {};
	console.log("Starting this listener ID :::: "+listenerId)
	for( var i = 0; i < emailListenerClientDetails.length; i++)
	{
		try
		{
			if(emailListenerClientDetails[i].listenerId.trim() == null)
			{
				continue;
			}
			if( emailListenerClientDetails[i].listenerId.trim() === listenerId.trim() )
			{
				/*requestParams.clientId	=	emailListenerClientDetails[i].clientId;
				requestParams.login		= 	currentUserMail;
				requestParams.action	= 	"start";*/
				
				requestParams.status			= emailListenerClientDetails[i].status;
				requestParams.pauseDuration		= emailListenerClientDetails[i].pauseDuration;
				requestParams.campaign			= emailListenerClientDetails[i].interactionTypeId;
				if(emailListenerClientDetails[i].interactionTypeId == "8333d8c0-e22a-4e32-9bf5-0f578461823e" || emailListenerClientDetails[i].interactionTypeId == "84d52042-cc6d-4df8-acf4-1ecc278f790e" 
					|| emailListenerClientDetails[i].interactionTypeId == "a7359531-3e43-4da1-be98-5a1392638e42" || emailListenerClientDetails[i].interactionTypeId == "b3485731-3c4e-4eeb-a15e-c5bc41286205" 
							|| emailListenerClientDetails[i].interactionTypeId == "b9eafcf0-a770-412d-a557-6ec203641bb0" || emailListenerClientDetails[i].interactionTypeId == "8405312c-4f51-42a9-bb55-3543d22e4569")
				{
					requestParams.itype		= "ar";
				}
				else
					requestParams.type		= "webchat";
				requestParams.intertype			= emailListenerClientDetails[i].intertype;
				requestParams.subAccountNumber	= emailListenerClientDetails[i].clientId;
				requestParams.oldSkill			= emailListenerClientDetails[i].staging_skill;
			break;
			}
		}
		catch(nullPointerError)
		{
			continue;
		}
	}
	var URL = "/updatearaccountskills?jsonvar="+JSON.stringify(requestParams);
	console.log("this is the parametersJSON"+JSON.stringify(requestParams));
	$.ajax
	({
		type 	: "POST",
		url 	: URL,//'/startandstopEmaillistener',
		async	: true,
		//data : {parameters: JSON.stringify(requestParams)},
		success : function(data)
		{
			console.log(data);
			if( data != "error" && data === "success" )
			{
				$("#"+listenerId+"_startbutton").html('Start');
				
			}
		}
	});	

}
function startEmailListener(listenerId){
	messageWindow.hideMessage();
	messageWindow.popUpMessage( "Starting the account...", 3000 );
	$("#"+listenerId+"_startbutton").html('Starting');
	var requestParams	= {};
	var statusGAEReader	=	"";
	console.log("Starting this listener ID :::: "+listenerId)
	for( var i = 0; i < emailListenerClientDetails.length; i++){
		try
		{
			if(emailListenerClientDetails[i].listenerId.trim() == null)
			{
				continue;
			}
			if( emailListenerClientDetails[i].listenerId.trim() === listenerId.trim() )
			{
				/*statusGAEReader			=	emailListenerClientDetails[i].statusGAEReader
				requestParams.clientId	=	emailListenerClientDetails[i].clientId;
				requestParams.login		= 	currentUserMail;
				requestParams.action	= 	"start";*/
				requestParams.pauseDuration		= emailListenerClientDetails[i].pauseDuration;
				requestParams.status			= "true";
				requestParams.intertype			= emailListenerClientDetails[i].intertype;
				requestParams.subAccountNumber	= emailListenerClientDetails[i].clientId;
				requestParams.campaign			= emailListenerClientDetails[i].interactionTypeId;
				requestParams.oldSkill			= emailListenerClientDetails[i].staging_skill;
				if(emailListenerClientDetails[i].interactionTypeId == "8333d8c0-e22a-4e32-9bf5-0f578461823e" || emailListenerClientDetails[i].interactionTypeId == "84d52042-cc6d-4df8-acf4-1ecc278f790e" 
					|| emailListenerClientDetails[i].interactionTypeId == "a7359531-3e43-4da1-be98-5a1392638e42" || emailListenerClientDetails[i].interactionTypeId == "b3485731-3c4e-4eeb-a15e-c5bc41286205" 
							|| emailListenerClientDetails[i].interactionTypeId == "b9eafcf0-a770-412d-a557-6ec203641bb0" || emailListenerClientDetails[i].interactionTypeId == "8405312c-4f51-42a9-bb55-3543d22e4569")
				{
					requestParams.itype		= "ar";
				}
				else
					requestParams.type		= "webchat";
			break;
			}
	}
		catch(nullPointerError)
		{
			continue;
		}
	}
	var URL = "/updatearaccountskills";
	console.log("this is the parametersJSON"+JSON.stringify(requestParams));
	$.ajax
	({
		type : "POST",
		url : URL,
		data : JSON.stringify(requestParams),
	    contentType: "application/json",
		success : function(data)
		{
			if(!JSON.parse(data).response)
			{
				messageWindow.hideMessage();
				messageWindow.popUpMessage( "Unable to start", 3000 );
				$("#"+listenerId+"_startbutton").html('failed');
				/*if(statusGAEReader	!= "true")
				{
					$("#"+listenerId+"_startbutton").html('failed');
				}
				else
				{
					data	=	"success";
				}*/
					
			}
			//window.location.reload(true);
			else
			{
				messageWindow.hideMessage();
				messageWindow.popUpMessage( "Successfully started", 3000 );
				$('.activeListeners').html(++activeListenersCount);
				$('.inactiveListeners').html(--inactiveListenersCount);
				for(var i=0; i< emailListenerClientDetails.length;i++){ 
					if(emailListenerClientDetails[i].listenerId === listenerId){
						emailListenerClientDetails[i].status = "true";
						console.log(emailListenerClientDetails[i]);
					}
				}
				if( $(".task").attr('class').split(" ")[1] == "active" ){
					$("#table_data").html('');
					loadActiveListeners();
					loadInActiveListeners();
					search_filter(document.getElementById('search_box'),"table_data");
				}
				else
				{
					$("#table_data").html('');
					loadInActiveListeners();
					search_filter(document.getElementById('search_box'),"table_data");
				}
				$("#"+listenerId+"_startbutton").html('Start');
			}
		},
		error : function(data)
		{
			messageWindow.hideMessage();
			messageWindow.popUpMessage( "Unable to start", 3000 );
		}
	});	
}

function stopEmailListener(listenerId){
	messageWindow.hideMessage();
	messageWindow.popUpMessage( "Stopping the account...", 3000 );
	$("#"+listenerId+"_stopbutton").html('Stopping');
//	$('body').append('<div class="modal-backdrop fade in"></div>');
//	var spinnerload	= new Spinner(opts);
//	var target = document.getElementById('foo');
//	var spinner = new Spinner(opts).spin(target);
	var requestParams	= {};
	console.log("stopping this listener ID :::: "+listenerId)
	for( var i = 0; i < emailListenerClientDetails.length; i++){
		try
		{
			if(emailListenerClientDetails[i].listenerId.trim() == null)
				{
				continue;
				}
		if( emailListenerClientDetails[i].listenerId.trim() === listenerId.trim() ){
			/*requestParams.login		= currentUserMail;
			requestParams.action	= "stop";
			requestParams.clientId	= emailListenerClientDetails[i].clientId;*/
			
			requestParams.pauseDuration		= emailListenerClientDetails[i].pauseDuration;
			requestParams.status			= "false";
			requestParams.intertype			= emailListenerClientDetails[i].intertype;
			requestParams.subAccountNumber	= emailListenerClientDetails[i].clientId;
			requestParams.campaign			= emailListenerClientDetails[i].interactionTypeId;
			requestParams.oldSkill			= emailListenerClientDetails[i].staging_skill;
			if(emailListenerClientDetails[i].interactionTypeId == "8333d8c0-e22a-4e32-9bf5-0f578461823e" || emailListenerClientDetails[i].interactionTypeId == "84d52042-cc6d-4df8-acf4-1ecc278f790e" 
				|| emailListenerClientDetails[i].interactionTypeId == "a7359531-3e43-4da1-be98-5a1392638e42" || emailListenerClientDetails[i].interactionTypeId == "b3485731-3c4e-4eeb-a15e-c5bc41286205" 
						|| emailListenerClientDetails[i].interactionTypeId == "b9eafcf0-a770-412d-a557-6ec203641bb0" || emailListenerClientDetails[i].interactionTypeId == "8405312c-4f51-42a9-bb55-3543d22e4569")
			{
				requestParams.itype		= "ar";
			}
			else
				requestParams.type		= "webchat";
			console.log("stop json :: "+JSON.stringify(requestParams));
		break;
		}
	}
		catch(nullPointerError)
		{
			continue;
		}
	}
	var URL = "/updatearaccountskills";
	$.ajax
	({
		type : "POST",
		url : URL,
		data : JSON.stringify(requestParams),
	    contentType: "application/json",
		success : function(data)
		{
			console.log("data in success "+data);
			if(!JSON.parse(data).response)
			{
				messageWindow.hideMessage();
				messageWindow.popUpMessage( "Unable to stop", 3000 );
				$("#"+listenerId+"_stopbutton").html('failed');
			}
			else
			{
				messageWindow.hideMessage();
				messageWindow.popUpMessage( "Successfully stopped", 3000 );
				$('.activeListeners').html(--activeListenersCount);
				$('.inactiveListeners').html(++inactiveListenersCount);
				for(var i=0; i< emailListenerClientDetails.length;i++){ 
					if(emailListenerClientDetails[i].listenerId === listenerId){
						emailListenerClientDetails[i].status = "false";
						console.log(emailListenerClientDetails[i]);
					}
				}
				if( $(".task").attr('class').split(" ")[1] === "active" ){
					$("#table_data").html('');
					loadActiveListeners();
					loadInActiveListeners();
					search_filter(document.getElementById('search_box'),"table_data");
				}
				else{
					$("#table_data").html('');
					loadActiveListeners();
					search_filter(document.getElementById('search_box'),"table_data");
				}
				
				$("#"+listenerId+"_stopbutton").html('Stop');
			}
			//window.location.reload(true);
		},
		error : function(data)
		{
			messageWindow.hideMessage();
			messageWindow.popUpMessage( "Unable to stop", 3000 );
		}
	});	
}
function search_filter(phrase, _id){
//	console.log("phrase :: "+phrase);
	var words = phrase.value.toLowerCase().split(' ').join('');
	var matchedArray = [];
	words = words.split(",");
		var table = document.getElementById(_id);
		var ele;
		for (var r = 0; r < table.rows.length; r++){
			ele = table.rows[r].innerHTML.replace(/<[^>]+>/g,"");
		        var displayStyle = 'none';
		        for (var i = 0; i < words.length; i++) {
				    if (ele.toLowerCase().indexOf(words[i]) >= 0){
				    	//console.log("matched");
				    	displayStyle = '';
						break;
				    }
				    else {
						displayStyle = 'none';
				    }
		        }
			table.rows[r].style.display = displayStyle;
		}
}
