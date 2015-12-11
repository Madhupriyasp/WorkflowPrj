function showMsg(obj)
{
		try
		{	
		$("#messagebody").html('');
		$('#fromHeader').html("");
		$('#details_fromHeader').html("");
		$('#fromName').html("");
		$('#fromName').append("Unknown");
		var checkForEmailInteraction = false;
		var interactionInfoMsg = JSON.parse(obj);
		//Validation Required.
		if(interactionInfoMsg.hasOwnProperty("CC") && !interactionInfoMsg["CC"]){
			delete interactionInfoMsg["CC"];
		}
		
		for(var msgInfo in interactionInfoMsg)
		{
			try
			{
				var tempLabel = msgInfo; 
	
				if(  typeof tempLabel != "undefined" )
				{ 
					Label = msgInfo; 
					Value =  interactionInfoMsg[msgInfo].replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'");					
					try
					{
						var decodedValue =	decodeURIComponent(Value);
					}
					catch(e)
					{
					    var decodedValue = decodeURIComponent(escape(Value));
					}
					
				
					decodedValue     =  decodedValue.split('+').join(' ');
					decodedValue	 =	decodedValue.split('%26').join('&');
					decodedValue	 =	escapeBackHtml(decodedValue);
					if(Label.trim() == "TO")
					{
						checkForEmailInteraction = true;
					}
					if (decodedValue.indexOf('http://') != -1 || decodedValue.indexOf('www.') != -1 || decodedValue.indexOf('https://') != -1 && Label.trim() != "uniquepin")
					{	
						if(Label.trim() != "MESSAGE CONTENT" && Label.trim() != "MESSAGE+CONTENT")
						{
							decodedValue	=	"<a target='_blank' href= "+decodedValue.trim()+">"+decodedValue.trim()+"</a>";
						}
					}
					if(Label.trim() == "uniquepin"){
						
						if(interactionInfoMsg.hasOwnProperty("entityType") && (!!interactionInfoMsg['entityType']))
							decodedValue	=	"<a target='_blank' href= https://my.distributedsource.com/crm#"+interactionInfoMsg['entityType'] +"/"+decodedValue.trim()+">https://my.distributedsource.com/crm#"+interactionInfoMsg['entityType']+"/"+decodedValue.trim()+"</a>";
						else
							decodedValue	=	"<a target='_blank' href= https://my.distributedsource.com/crm#lead/"+decodedValue.trim()+">https://my.distributedsource.com/crm#lead/"+decodedValue.trim()+"</a>";
						
					}
					if(Label.trim() == "CC")
					{
						decodedValue = escapeTag(decodedValue);
					}
					if(Label.trim() == "MESSAGE+CONTENT" || Label.trim() == "MESSAGE CONTENT")
					{
						Label = "MESSAGE CONTENT";
						var	Message_string	='<tr>'+
						'<td style="font-size:13px; color:#64696d; font-weight:bold; padding-left:18px; padding-top: 14px; padding-right: 20px;">'+Label+'</td>'+
						'<td>'+ varifyHtmlandPreformatedText(decodedValue)  +'</td>'+
						'</tr>';
					}
					else
					{
						var	Message_string	='<tr>'+
							'<td style="font-size:13px; color:#64696d; font-weight:bold; padding-left:18px; padding-top: 14px; padding-right: 20px;">'+Label+'</td>'+
							'<td><p style="font-size:14px;  padding: 14px 0px 0px; margin: 0px;">'+decodedValue+'</p></td>'+
							'</tr>';
					}
					$("#messagebody").append(Message_string);
				}
			}
			catch (e)
			{
				fieldsNotFoundFlag = true;
				missing_fields += interactionInfoMsg[msgInfo]; 
			}
		}
		if(checkForEmailInteraction)
		{
			constructToHeader(interactionInfoMsg);
		}
	}
	catch(e)
	{
		console.log("error in JSON parser");
	}
}

function varifyHtmlandPreformatedText(str) 
{
	try
	{
	    var a = document.createElement('div');
	    a.innerHTML = str;
	    for (var c = a.childNodes, i = c.length; i--; ) 
	    {
	        if (c[i].nodeType == 1)
	        {
	        	return str; 
	        }
	    }
	    return "<pre>"+str+"</pre>";
	}catch(e)
	{
		console.log("pre execution failed :: "+e);
		return str;
	}
   
}

function ChatMessage(messages, visitorDetails, metaData, feedback)
{
	var name	=	'';
	var email	=	'';
	var mess	=	'';
	$("#messagebody").html("");
	var MessageHtml = '<tr>'+
	'<td style="font-size:13px; color:#64696d; font-weight:bold; padding-left:18px; padding-top: 14px; padding-right: 20px;">User</td>'+
	'<td style="font-size:13px; color:#64696d; font-weight:bold; padding-left:18px; padding-top: 14px; padding-right: 20px;">Chat</td>'+
	'<td style="font-size:13px; color:#64696d; font-weight:bold; padding-left:18px; padding-top: 14px; padding-right: 20px;">Dates and Time</td>'+
	'</tr>';
	if((metaData!=null)&&(metaData!="{}")&&(metaData!="")&&((metaData.indexOf("NA") == -1)))
	{
		try
		{
			metaData = JSON.parse(metaData);
			MessageHtml += '<tr>' + '<td style="font-size:13px; color:#64696d; font-weight:bold; padding-left:5px; padding-top: 14px; padding-right: 20px;"></td><td><table>'; 
			for(var key in metaData)
			{
				if(metaData.hasOwnProperty(key))
				{
					if(key.indexOf('Cookie') == -1)
					{
						var temp = '<tr><td style="font-size:14px;  padding: 14px 0px 0px; margin: 0px;">' + key + '</td><td style="font-size:14px;  padding: 14px 0px 0px; margin: 0px;">:   ' + metaData[key] + '</td></tr>'; 
						MessageHtml += temp;
						if(key === 'guestName')
							name	=	(metaData[key]).split('+').join(' ');
						if(key === 'guestEmail')
							email	=	(metaData[key]).split('+').join(' ');
						if(key === 'guestMessage')
							mess	=	(metaData[key]).split('+').join(' ');
					}
				}
			}
		}
		catch(e)
		{
			MessageHtml += '<tr>' + '<td style="font-size:13px; color:#64696d; font-weight:bold; padding-left:5px; padding-top: 14px; padding-right: 20px;"></td><td><table>'; 
			metaData = metaData.replace("{","");
			metaData = metaData.replace("}","");
			var data=metaData.split(",");
			for(var i=0;i<data.length;i++)
			{
				var currentData = data[i].split("=");
				var temp = '<tr><td style="font-size:14px;  padding: 14px 0px 0px; margin: 0px;">' + currentData[0] + '</td><td style="font-size:14px;  padding: 14px 0px 0px; margin: 0px;">:   ' + currentData[1] + '</td></tr>';
				MessageHtml += temp;
			}
		}
		MessageHtml += '</table></td><td align="center"></td>' + '</tr>';
	}
	try
	{
		var messages		=	JSON.parse(messages);
		var feedback;
		if(feedback)
		{
			try {
				feedback = JSON.parse(feedback);
				console.error("This is the feedback after parsing"+feedback);
			} catch (e) {
				console.error("Error occured when trying to parse feedback",e);
			}
		}
		var message;
		
		for(var connectionId in messages)
		{
			if(messages.hasOwnProperty(connectionId))
			{
				message			=	messages[connectionId];
				try
				{
					var decodedValue =	decodeURIComponent(message);
				}
				catch(e)
				{
					var decodedValue =	decodeURIComponent(escape(message));
				}
				
				MessageHtml	+=	'<tr>'+
				'<td style="font-size:13px; color:#64696d; font-weight:bold; padding-left:18px; padding-top: 14px; padding-right: 20px; padding-bottom: 10px;"></td>'+
				'<td style="font-size:13px; color:#64696d; font-weight:bold; padding-left:20px; padding-top: 14px; padding-right: 20px; padding-bottom: 10px; text-align: center; border-bottom: 1pt solid #999;"><b style="position: relative; top: 18px; padding: 0 10px; background-color: #fff;">'+connectionId+'</b></td>'+
				'<td style="font-size:13px; color:#64696d; font-weight:bold; padding-left:18px; padding-top: 14px; padding-right: 20px; padding-bottom: 10px;"></td>'+
				'</tr>';
				
				var Message_string 	=	'';
				var feedbackHtml	=	'';
				var MessageJson = new Array();
				MessageJson = JSON.parse(decodedValue);
				for(var i=0;i<MessageJson.length;i++)
				{
					try
					{
						var individualMessageBox = new Object();
						individualMessageBox  = MessageJson[i];
						var time = (individualMessageBox.time).split('+').join(' ');
						var date = new Date(time.replace(/-/g,"/"));
				
						if ('PST'.indexOf(timezone) == -1 )
						{//curently pdt
							var gmtdates		=	new Date(date);	
							gmtdates.setHours(gmtdates.getHours() - 7);
						}
						else
						{//currently pst
							var gmtdates		=	new Date(date);	
							gmtdates.setHours(gmtdates.getHours() - 8);
						}
					
//					var offsetAtPresent	=	new Date().getTimezoneOffset();
//					if((offsetAtPresent != "480") && (offsetAtPresent != "420"))
//					{
//						var gmtdates		=	offsetconversion(date);		
//					}
//					
//					else if((offsetAtPresent == "480") || (offsetAtPresent == "420"))
//					{
//						var gmtdates		=	new Date(date);				//pst/pdt date
//					}
//					var dates 		= 	new Date(gmtdates);		
//					var getDate 	=   dates.getDate();
//					if(!(getDate>=10))
//					{
//						var formatMonth = "0";
//						getDate = formatMonth.concat(getDate);
//					}
//					var getmonth_date = parseInt(dates.getMonth())+1;
//					if(!(getmonth_date>=10))
//					{
//						var formatMonth = "0";
//						getmonth_date = formatMonth.concat(getmonth_date);
//					}
					
						//Added +1 to get month as function returns number starting from 0.
						var datetemp		=	gmtdates.getDate()+"/"+(gmtdates.getMonth()+1)+"/"+gmtdates.getFullYear();
						//	var date			=	getDate_ddmmmyy(datetemp);
						var date			=   datetemp;
						var time			=	pad(gmtdates.getHours())+":"+pad(gmtdates.getMinutes())+":"+pad(gmtdates.getSeconds());
						
						
						var user 			=	(individualMessageBox.user).split('+').join(' ');
						if(user.indexOf('Prechatsurvey') != -1 || user.indexOf('Offlineform') != -1)
						{
							var message		=	individualMessageBox.chat
							if(typeof message === 'string')
								message		=	JSON.parse(message);
							Message_string += '<tr>' + '<td style="font-size:13px; color:#64696d; font-weight:bold; padding-left:5px; padding-top: 14px; padding-right: 20px;">'+(individualMessageBox.user).split('+').join(' ')+'</td><td><table>';
							for(var key in message)
							{
								if(message.hasOwnProperty(key))
								{
									var temp = '<tr><td style="font-size:14px;  padding: 14px 0px 0px; margin: 0px;">' + key + '</td><td style="font-size:14px;  padding: 14px 0px 0px; margin: 0px;">:   ' + (message[key]).split('+').join(' ') + '</td></tr>'; 
									Message_string += temp;
									if(key === 'Name')
										name	=	(message[key]).split('+').join(' ');
									if(key === 'Email')
										email	=	(message[key]).split('+').join(' ');
									if(key === 'Message')
										mess	=	(message[key]).split('+').join(' ');
								}
							}
							Message_string += '</table></td><td><p style="font-size:14px;  padding: 14px 0px 0px; margin: 0px;">'+date+'&nbsp;<span>'+time+'</span></p></td>'+ '</tr>';
						} else {
							var tempString =	'<tr>'+
							'<td style="font-size:13px; color:#64696d; font-weight:bold; padding-left:5px; padding-top: 14px; padding-right: 20px;">'+(individualMessageBox.user).split('+').join(' ')+'</td>'+
							'<td style="width: 70%;"><p style="font-size:14px;  padding: 14px 0px 0px; margin: 0px;">'+(individualMessageBox.chat).split('+').join(' ')+'</p></td>'+
							'<td><p style="font-size:14px;  padding: 14px 0px 0px; margin: 0px;">'+date+'&nbsp;<span>'+time+'</span></p></td>'+
							'</tr>';
							Message_string = Message_string + tempString;
						}
					}
					catch(ExceptionObj2)
					{
						console.log("one of the lines in the chat is having some problem :: "+ExceptionObj2);
						continue;
					}
				}
				
				if(feedback && feedback[connectionId] && feedback[connectionId] != 'NA')
				{
					console.error("feedback[connectionId] : ",feedback[connectionId]);
					var feedbackObj	= JSON.parse(feedback[connectionId]);
					console.error("feedback[connectionId] after parsing",feedbackObj);
					if(feedbackObj)
					{
						var rating	=	(feedbackObj.rating ? feedbackObj.rating : '');
						var feedbackMessage	=	(feedbackObj.feedback ? feedbackObj.feedback : '');
						var feedbackdate	=	(feedbackObj.date ? feedbackObj.date : '');
						if(rating || feedbackMessage)
						{
							feedbackHtml	+=	'<tr> <td style="font-size:13px; color:#64696d; font-weight:bold; vertical-align: top;padding-left:5px; padding-top: 14px; padding-right: 20px;">Visitor</td><td class="visitor-feedback" style="width: 70%;">';
							if(rating)
							{
								rating		=	parseInt(rating);
								feedbackHtml	+=	'<p style="font-size:14px;  padding: 14px 0px 0px; margin: 0px;"><label>Ratings:</label><ul class="ratings">';
								for(var i=0; i<5; i++)
								{
									if(i<rating)
										feedbackHtml	+=	 '<li class="rated hover"></li>';
									else
										feedbackHtml	+=	'<li></li>';
								}
								feedbackHtml	+=	'</ul> </p>';
							}
							if(feedbackMessage)
							{
								feedbackHtml	+=	'<p style="font-size:14px;  padding: 0; margin: 0px;"> <label>Feedback:</label> <span>'+feedbackMessage+'</span> </p>';
							}
							if(feedbackdate && typeof feedbackdate === 'number')
							{
								var dateFormatted	=	moment(feedbackdate).tz('America/Los_Angeles').format('DD[/]MM[/]YYYY[ ]HH[:]mm[:]ss');
								feedbackHtml	+=	'</td> <td style="vertical-align: top;"> <p style="font-size:14px;  padding: 14px 0px 0px; margin: 0px;">'+dateFormatted+'</p>';
							}
							feedbackHtml	+= ' </td> </tr>';
						}
					}
				}
				MessageHtml = MessageHtml+Message_string+feedbackHtml;
			}
		}
		$("#messagebody").append(MessageHtml);
		if(!!visitorDetails && visitorDetails.email != '' && visitorDetails.email != undefined && visitorDetails.email != null && visitorDetails.email != 'null' && visitorDetails.email != 'NA' && visitorDetails.email != 'na')
		{
			$('#fromName').html(visitorDetails.name);
			$('#fromHeader').html(visitorDetails.email);
			$('#details_fromHeader').html('"'+visitorDetails.message.value+'"');
		}
		else
		{
			((email) && email.toLowerCase() != 'undefined' && email.toLowerCase() != 'null') ? $('#fromHeader').html(email) : $('#fromHeader').html("");
			((name) && name.toLowerCase() != 'undefined' && name.toLowerCase() != 'null') ? $('#fromName').html(name) : $('#fromName').html("UNKNOWN");
//			((mess) && mess.toLowerCase() != 'undefined' && mess.toLowerCase() != 'null')? $('#details_fromHeader').html('"'+mess+'"') : $('#details_fromHeader').html("");
			$('#details_fromHeader').html("");
		}
	} catch(e) {
		console.log("error in parsing json for chat");
	}
}

function getDate_ddmmmyy(formatteddate)
{
	var date			  = formatteddate.split("/");
	var monthNames        = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
	
	if(date[1].length == 2)
	{
		if(date[1].substring(0,1) == 0)
		{
			var month = date[1].substring(1,2)-1;
		}
		var month = date[1]-1;
	}
	
	var str = date[0]+" "+monthNames[month]+" "+date[2].substring(date[2].length,date[2].length-2);
	return  date[0]+" "+monthNames[month]+" "+date[2].substring(date[2].length,date[2].length-2);
}
		
function appendTable(interactionsData)	
{
	$('#dataIn').show();
	$('#loading_img').hide();
	Actions.hideLoading();
	for(var i=iteration;i<iteration+lengthToIterate;i++)
	{
		var	interactionsMap		=	interactionsData[i];
		var gmtdatesadded	    =	"";
		var intractionhistory 	= 	new Object();
		try
		{
		    intractionhistory 	=	interactionsMap.interactionHistory;
		}
		catch(e)
		{
			console.log("iterator index is not appropriate for you so go away.");
			return;
		}
		
		var rdateadded    		=	parseInt(intractionhistory[0].date);
		var len					= 	intractionhistory.length;
		var rdate				=   parseInt(intractionhistory[len-1].date);
		var offsetAtPresent		=	new Date().getTimezoneOffset();
		if((offsetAtPresent != "480") && (offsetAtPresent != "420"))
		{
			var gmtdates		=	offsetconversion(new Date(rdate).getTime());				//gmt date
			gmtdatesadded		=	offsetconversion(new Date(rdateadded).getTime());		//gmt date added
		}
		else if((offsetAtPresent == "480") || (offsetAtPresent == "420"))
		{
			var gmtdates		=	new Date(rdate).getTime();				//pst/pdt date
			gmtdatesadded		=	new Date(rdateadded).getTime();		//pst/pdt date added
		}
		
		var dates 				= 	new Date(gmtdates);								
		var dateadded 			= 	new Date(gmtdatesadded);						
		var getmonth 	   		= 	parseInt(dateadded.getMonth())+1;
		var interactionId  		= 	interactionsMap.interactionId;
		
		//for timer
		var intractionhistory 	=	interactionsMap.interactionHistory;				
		
		if(!(getmonth>=10))
		{
			var formatMonth = "0";
			getmonth = formatMonth.concat(getmonth);
		}
		var getmonth_dateadded = parseInt(dateadded.getMonth())+1;

		if(!(getmonth_dateadded>=10))
		{
			var formatMonth = "0";
			getmonth_dateadded = formatMonth.concat(getmonth_dateadded);
		}
		var getDate = dates.getDate();
		if(!(getDate>=10))
		{
			var formatMonth = "0";
			getDate = formatMonth.concat(getDate);
		}
		var getDateAdded = dateadded.getDate();
		if(!(getDateAdded>=10))
		{
			var formatMonth = "0";
			getDateAdded = formatMonth.concat(getDateAdded);
		}
		
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
		var datetemp		=	getDate+"/"+getmonth_date+"/"+dates.getFullYear();
		var date			=	getDate_ddmmmyy(datetemp);
		var time			=	pad(dates.getHours())+":"+pad(dates.getMinutes())+":"+pad(dates.getSeconds());
		
		var dateAddedtemp 	= 	getDateAdded+"/"+getmonth_dateadded+"/"+dateadded.getFullYear();
		var dateAdded		=	getDate_ddmmmyy(dateAddedtemp);
		var timeAdded		=	pad(dateadded.getHours())+":"+pad(dateadded.getMinutes())+":"+pad(dateadded.getSeconds());
		
		if(interactionsMap.subAccountNumber != '1215251315')
			var accountNo	=	interactionsMap.subAccountNumber;
		else
		{
			var accountNo 	=	'2215251315';
		}
		var agentlogin	=	interactionsMap.AgentLogin;
		var status		=   interactionsMap.action;
		var timeSpent	=	getTimeSpent(JSON.stringify(interactionsMap));
		var ansTime		=	getAnswerTime(JSON.stringify(interactionsMap));
		var compTime	=   millisecondsToTime(gmtdates-gmtdatesadded);
		var button 		=	"scheduled";	
		if (status.indexOf('nQueue(IR)') != -1)
		{
			compTime = 'NA';
			button	=	"queue"; 
			date	=	"NA";
			time	=	"";
			var intractionhistory 					=	interactionsMap.interactionHistory;
			var sortedinteractionHistory			=	sortedintractionhistory(intractionhistory);
			$.each(sortedinteractionHistory, function(i, interactions) 	
			{
				var status		=	interactions.action;
				if(status.indexOf("equeued") == -1)
				{
					
				}
				else
				{
					button	=	'requed';
				}
			});
		}
		else if (status.indexOf('nQueue(TR)') != -1)
		{
			compTime = 'NA';
			button	=	"queue"; 
			date	=	"NA";
			time	=	"";
			var intractionhistory 					=	interactionsMap.interactionHistory;
			var sortedinteractionHistory			=	sortedintractionhistory(intractionhistory);
			$.each(sortedinteractionHistory, function(i, interactions) 	
			{
				var status		=	interactions.action;
				if(!(status.indexOf("equeued") == -1))
				{
					button	=	'requed';
				}
			});
		}
		else if (status.indexOf('nQueue(WI)') != -1)
		{
			compTime = 'NA';
			button	=	"queue"; 
			date	=	"NA";
			time	=	"";
			var intractionhistory 					=	interactionsMap.interactionHistory;
			var sortedinteractionHistory			=	sortedintractionhistory(intractionhistory);
			$.each(sortedinteractionHistory, function(i, interactions) 	
			{
				var status		=	interactions.action;
				if(status.indexOf("equeued") == -1)
				{
					
				}
				else
				{
					button	=	'requed';
				}
			});
		}
		else if (status.indexOf('Scheduled') != -1)
		{
			compTime = 'NA';
			button	=	"scheduled"; 
			date	=	"NA";
			time	=	"";
			timeSpent =	"NA";
			
		}
		else if (status.indexOf('Pending') != -1 || status.indexOf('InActive') != -1)
		{
			compTime = 'NA';
			button	=	"pending"; 
			date	=	"NA";
			time	=	"";
			timeSpent =	"NA";
			
		}
		else if (status.indexOf('In Progress') != -1)
		{
			compTime = 'NA';
			button	=	'progress';
			date	=	"NA";
			time	=	"";
			
		}
		else if (status.indexOf('Waiting') != -1 || status.indexOf('Waiting(IR)') != -1)
		{
			date	 =  "NA";
			compTime =  'NA';
			time     =   "";
		}
		
		else if (status.indexOf('Rejected') != -1 || status.indexOf('Rejected(IR)') != -1)
		{
			date	 =  "NA";
			compTime =  'NA';
			time     =   "";
		}
		
		else if	(status.indexOf('Completed') != -1 || status.indexOf('closed') != -1 || status.indexOf("Callended") != -1 || status.indexOf("Dialout") != -1)
		{
			button	=	'completed';
		}
		else if	(status.indexOf('Answered') != -1 || status.indexOf('answered') != -1)
		{
			compTime = 'NA';
			button	=	'answered';
			date	=	"NA";
			time	=	"";
		}
		if(compTime === 'NA')
		{
			interactionsMap.TimeToComplete = 0;	
		}
		else
		{
			interactionsMap.TimeToComplete = gmtdates-gmtdatesadded;
		}	
		if(agentlogin == 'null' || agentlogin == '' || agentlogin == null || agentlogin == 'undefined' || agentlogin == undefined || agentlogin == 'na'){
			agentlogin	= "NA";
		}
		
//		if(dd.timeCounter[interactionId] != null && dd.timeCounter[interactionId] != undefined)
//			clearInterval(dd.timeCounter[interactionId]);
		
		var domain						= interactionsMap.domain;
		var executeDomainFunction		= false;
		var domainString	= 'dd.domainMap[interactionId]   = setInterval(function(){dd.getDomainForAccountNumber(accountNo,interactionId);},3000);';
		var timerString 	= '(function(interactionId,intractionhistory,timeSpent) {dd.timeCounter[interactionId] = setInterval(function(){displayinIdForTcOne("timeS_"+interactionId,intractionhistory,timeSpent)},1000)})(interactionId,intractionhistory,timeSpent);';
		
		var chkId	=	"chkid_"+interactionId;
		var trId 	=	"trid_"+interactionId;
		var tdId	=	"trid_"+interactionId+"_history";
		if(interactionsMap.interactionType === "SBChat")
		{
			
			intraction_data = '<tr class="'+button+'" id="'+trId+'"  onclick	=	callpopup("'+tdId+'")>'+	
            '<td class="chkb"><input type="checkbox" id="'+chkId+'" class="chkbox"></td>'+
            '<td><i class="fa fa-comment-o"></i></td>';
		}
		else
		{
					//console.log(chkId);

			intraction_data = '<tr class="'+button+'" id="'+trId+'"  onclick	=	callpopup("'+tdId+'")>'+
            '<td class="chkb"><input type="checkbox" id="'+chkId+'" class="chkbox"></td>'+
            '<td><i class="fa fa-flash icon-2x"></i></td>';
           
		}
		
		if(interactionsMap.multiConId)
			intraction_data = intraction_data + '<td class="acc_wdt multi_conID"></td>'+
			 '<td id="accNo_'+interactionId+'"    class="acc_wd">'+accountNo+'</td>';
		else
			intraction_data = intraction_data + '<td class="acc_wdt"></td>'+
			 '<td id="accNo_'+interactionId+'"    class="acc_wd">'+accountNo+'</td>';;
				
			
        if(domain == null || domain == undefined || domain == "")
        {
        	if(status.indexOf('Completed') != -1 || status.indexOf('closed') != -1 || status.indexOf("Callended") != -1 || status.indexOf("Dialout") != -1){
        		intraction_data = intraction_data+'<td id="domain_'+interactionId+'"   class="domain_wd" width="20%">Loading...</td>';
        	}
        	else{
        		intraction_data = intraction_data+'<td id="domain_'+interactionId+'"   class="domain_wd" width="18%">Loading...</td>';
        	}
        	executeDomainFunction	=	true;	
        }
        else
        {
        	domain = getDisplayDomainName(domain);
        	if(status.indexOf('Completed') != -1 || status.indexOf('closed') != -1 || status.indexOf("Callended") != -1 || status.indexOf("Dialout") != -1){
        		intraction_data = intraction_data+'<td id="domain_'+interactionId+'"   class="domain_wd" width="20%">'+domain+'</td>';
        	}
        	else{
        		intraction_data = intraction_data+'<td id="domain_'+interactionId+'"   class="domain_wd" width="18%">'+domain+'</td>';
        	}
        	
        	executeDomainFunction	=	false;
        }
        
        
        intraction_data = intraction_data+'<td id="agent_'+interactionId+'" class="aglogin_wd" '+(agentlogin.length>30 ? 'data-container="body" data-toggle="tooltip" data-placement="top" data-original-title="'+agentlogin+'"': 'title=""') +'>'+(agentlogin.length>30 ? agentlogin.substring(0,30)+'...' : agentlogin)+'</td>'+
        '<td id="status_'+interactionId+'" class="status_wd text-center"><span class="label btn-'+button+'">'+status+'</span></td>'+
        '<td id="dateA_'+interactionId+'" class="dateadd_wd text-center">'+dateAdded+'&nbsp;<span>'+timeAdded+'</span></td>'+
        '<td id="date_'+interactionId+'"  class="datecom_wd text-center">'+date+'&nbsp;<span>'+time+'</span> </td>'+
        '<td id="ansT_'+interactionId+'"  class="anstime_wd text-center">'+ansTime+'</td>'+
        '<td id="timeS_'+interactionId+'" class="timespt_wd text-center">Loading...</td>'+
        '<td id="compT_'+interactionId+'" class="compTime_wd text-center">'+compTime+'</td>'+
        '<td id="'+tdId+'"  style="display:none;">'+JSON.stringify(interactionsMap)+'</td>'+
        '</tr>';
        $("[data-toggle='tooltip']").tooltip();
        $('.tooltip').remove();
        $("#table_data").append(intraction_data);
        
		clearInterval(dd.timeCounter[interactionId]);
        
		eval(timerString);
		if(executeDomainFunction)
		{
			eval(domainString);
		}
	}
	$( ".modal-backdrop.fade.in" ).remove();
	spinner.stop();
	if(query_counter == 6)
	{
		query_counter	= 1;
		fetch_flag		=	"false";	
	}
}

function getDisplayDomainName(domainName)
{
	var isURL = false;
	var displayName = domainName;
	
	if(domainName.indexOf("http://") > -1)
	{
		displayName = domainName.replace("http://","");
		isURL = true;
	}
	else if(domainName.indexOf("https://") > -1)
	{
		displayName = domainName.replace("https://","");
		isURL = true;
	}
	
	if((domainName.indexOf("www.") > -1 || domainName.indexOf(".com") > -1) && isURL == false)
	{
		isURL 	   = true;
		domainName = "http://".concat(domainName);
	}
	
	if(displayName.length>30)
		displayName = displayName.substring(0,28)+"...";
	
	if(isURL)
		displayName = "<a target='_blank' id='clientURL' href='"+domainName+"'>"+displayName+"</a>";
	
	return displayName;
}
function displayinIdForTcOne(id,historyId,timeSpent)
{
	var updateTime = statusUpdateTime(historyId);
	if(updateTime != null)
	{
		var currentTime = new Date().getTime();
		var diff = millisecondsToTime(currentTime - updateTime);
		$("#"+id).html(diff);
		updateTime = null;
	}
	else
	{
		updateTime = null;
		$("#"+id).html(timeSpent);
	}
}
	
function chooseTheCurrentSelection(currentSelection){
	console.log("came to the current selection choosing part :: and this is the current status"+currentSelection);
	
	switch(currentSelection)
	{
		case 'Answered':
			answeredClick();
		break;
		
		case 'Completed':
			completedClick();
		break;
			
		case 'Scheduled':
			scheduledClick();
		break;
			
		case 'waiting':
			stuckClick();
		break;
		
		case 'InQueue(IR)':
			inQueueClick();
		break;
			
		case 'In Progress': 
			inprogressClick();
		break;
		
		case 'all':
			allTaskClick();
		break;
		
		default : console.info("not handling status -to trigger click -> status::"+currentSelection); 
		break;
	}
}
	
function statusUpdateTime(intractionhistory)
{
	var dates
	var time
	var formattedDate
	var date
	for (var i=intractionhistory.length-1;i>=0;i--)
	{
			secondDate	=	parseInt(intractionhistory[i].date);
			if(intractionhistory[i].action == "Completed" || intractionhistory[i].action == "Completed-Resolved" || intractionhistory[i].action == "Completed-F8" || intractionhistory[i].action == "closed" || intractionhistory[i].action == "Callended" || intractionhistory[i].action == "Dialout" || intractionhistory[i].action == "Completed-TabClose" || intractionhistory[i].action == "Scheduled" || intractionhistory[i].action == "closed-unanswered" || intractionhistory[i].action == "InActive" || intractionhistory[i].action == "Deleted" || intractionhistory[i].action == "Completed-Fetch" || intractionhistory[i].action == "offlineformclosed" || intractionhistory[i].action == "prechatsurveyclosed" || intractionhistory[i].action == "offlineForm")
			{
				break;
				return null;
			}
			 formattedDate	=	parseInt(formateDate(intractionhistory[i].date));
			 date			=	parseInt(intractionhistory[i].date);
		 dates 			= 	new Date(date);			
		 time			=	pad(dates.getHours())+":"+pad(dates.getMinutes())+":"+pad(dates.getSeconds());
		
		break;
	}
	return date;
}
	
//for converting the date to pst/pdt timezone
function offsetconversion(dbdate)
{
	var date = new Date(dbdate);
	var datemill	=	date.getTime();
	var pdtoffset	=	"";
	if(timezone == "PST")
		pdtoffset	=	480;
	else
		pdtoffset	=	420;
	dateoffset	=	date.getTimezoneOffset();
	if(dateoffset<0)
	{
		dateoffset	=	-(dateoffset);
		pdtoffset	=	pdtoffset+dateoffset;
		var pdfoffsetmilli	=	pdtoffset	* 60000;
		pdfoffsetmilli	=	datemill	-	pdfoffsetmilli;
		return pdfoffsetmilli;
	}
	else if(dateoffset>0)
	{
		pdtoffset	=	pdtoffset - dateoffset;
		var pdfoffsetmilli	=	pdtoffset	* 60000;
		pdfoffsetmilli	=	datemill	-	pdfoffsetmilli;
		return pdfoffsetmilli;
	}
	else if(dateoffset == 0)
	{
		var pdfoffsetmilli	=	pdtoffset	* 60000;
		pdfoffsetmilli	=	datemill	-	pdfoffsetmilli;
		return pdfoffsetmilli;
		
	}
}

function callpopup(history_id)
{
	var historyId 		=	history_id;
	if(historyId.indexOf("undefined") != -1)
	{
	return;
	}
	var historytointer1 = historyId.slice(5);
	var interactionId 	= historytointer1.slice(-8)
	var interactionId 	= historytointer1.slice(0,(historytointer1.length-8));
	row_id 				= historyId.split("_")[0]+"_"+historyId.split("_")[1];	
	$('.checkinqueue').removeClass('success').removeClass('error');
	$( "#"+row_id ).css("background-color", "#F2F2F2" );
	
		var vvd					=	history_id.split('_')[1];
		var domain_Name 		= $('#domain_'+vvd).html();
		$('#domain_Name').html("");
		$('#domain_Name').append(domain_Name);
		var intractionData 		=		$("#"+historyId).html();
		var json_intractionData = JSON.parse(intractionData);
		var scheduledOrNot		= false;
		var intractionHistoryList 	=	json_intractionData.interactionHistory;
		for (var i=0;i < intractionHistoryList.length;i++)
		{
			var status	=	intractionHistoryList[i].action;
			if	(status.indexOf('scheduled') != -1 || status.indexOf('Scheduled') != -1)
			{
				scheduledOrNot = true;
				break;
			}
		}

		try
		{			
			if(json_intractionData.scheduledTime.toString().indexOf('NA') != -1)
			{
				scheduledOrNot = false;
			}
		}
		catch(excep)
		{
			scheduledOrNot = false;
		}
		var offsetAtPresent		= new Date().getTimezoneOffset();
		if((offsetAtPresent != "480") && (offsetAtPresent != "420"))
		{
			var gmtdates		=	offsetconversion(new Date(json_intractionData.date).getTime());				//gmt date
			var gmtdatesadded	=	offsetconversion(new Date(json_intractionData.dateAdded).getTime());		//gmt date added
		}
		else if((offsetAtPresent == "480") || (offsetAtPresent == "420"))
		{
			var gmtdates		=	new Date(json_intractionData.date).getTime();				//pst/pdt date
			var gmtdatesadded	=	new Date(json_intractionData.dateAdded).getTime();		//pst/pdt date added
		}
		var dates 		= 	new Date(gmtdates);
		var dateadded 	= 	new Date(gmtdatesadded);
		var getmonth 	= 	parseInt(dateadded.getMonth())+1;
		if(!(getmonth>=10))
		{
			var formatMonth = "0";
			getmonth = formatMonth.concat(getmonth);
		}
		var getmonth_dateadded = parseInt(dateadded.getMonth())+1;
		if(!(getmonth_dateadded>=10))
		{
			var formatMonth = "0";
			getmonth_dateadded = formatMonth.concat(getmonth_dateadded);
		}
		
		var getDate = dates.getDate();
		if(!(getDate>=10))
		{
			var formatMonth = "0";
			getDate = formatMonth.concat(getDate);
		}
		var getDateAdded = dateadded.getDate();
		if(!(getDateAdded>=10))
		{
			var formatMonth = "0";
			getDateAdded = formatMonth.concat(getDateAdded);
		}
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
		try
		{
		var datetemp		=	getDate+"/"+getmonth_date+"/"+dates.getFullYear();
		var date 			=	getDate_ddmmmyy(datetemp);
		var dateAddedtemp 	= 	getDateAdded+"/"+getmonth_dateadded+"/"+dateadded.getFullYear();
		var dateAdded 		=	getDate_ddmmmyy(dateAddedtemp);
		var timeAdded		=	pad(dateadded.getHours())+":"+pad(dateadded.getMinutes())+":"+pad(dateadded.getSeconds());
		var accountNo		=	json_intractionData.subAccountNumber;
		var agentlogin		=	json_intractionData.AgentLogin;
		var status			=   json_intractionData.action;
		var metaData		=	json_intractionData.metaData;
		var feedback		=	json_intractionData.feedback;
		var messages		=	decodeURIComponent(json_intractionData.messages);
		var timeSpent		=	getTimeSpent(intractionData);
		var ansTime			=	getAnswerTime(intractionData);
		var visitorDetails	=	json_intractionData.visitorDetails;
		
		if(json_intractionData.interactionType === "SBChat" || status != "InQueue(IR)")
			$('.checkinqueue').hide();
		else
			$('.checkinqueue').show();
		}
		catch (exceptionObject)
		{
			scheduledDate = "NA";	
		}
		if (status.indexOf('Scheduled') != -1)
		{
			timeSpent	=	'NA';
		}
		if(json_intractionData.interactionType === "SBChat")
		{
			ChatMessage(messages, visitorDetails, metaData, feedback);
		}
		else
		{
			showMsg(messages);
		}
		if(agentlogin == 'null' || agentlogin == '' || agentlogin == null || agentlogin == 'undefined' || agentlogin == undefined || agentlogin == 'na')
		{
			agentlogin	= "NA";
		}
		
			$("#accountId").html("<a href='/toolsmanager?accno="+accountNo+"' target='_blank' id='subAccCache'>"+accountNo+"</a>");
			
		$("#accountLogin").html(agentlogin);
		$("#statusId").html(status);
		try
		{
			if(json_intractionData.scheduledTime.toString().indexOf("na") != -1)
			{
				scheduledOrNot = false;
			}
			else if(json_intractionData.scheduledTime.toString().indexOf("NA") != -1)
			{
				scheduledOrNot = false;
			}
		}
		catch(excetionObject1)
		{
			console.log("entered the exception part !!. so hardcoding scheduled status as false");
			scheduledOrNot = false;
		}
		if(scheduledOrNot)
		{
			var currentscheduledDate = new Date(parseInt(json_intractionData.scheduledTime));
			var currentMinutes		 = currentscheduledDate.getMinutes();
			var offSetMinutes    	 = currentscheduledDate.getTimezoneOffset();
			currentscheduledDate.setMinutes(currentMinutes+offSetMinutes);
			var gmtScheduledHours = currentscheduledDate.getHours();
			if(timezone == "PDT")
			{
				currentscheduledDate.setHours(gmtScheduledHours-7);	
			}
			else
			{
				currentscheduledDate.setHours(gmtScheduledHours-8);	
			}
			$('#scheduleTime').html(currentscheduledDate.toDateString()+" "+currentscheduledDate.toTimeString().slice(0,8)+" "+timezone);     
		}
		else
		{
			$('#scheduleTime').html('NA');
		}
		$("#dateAdded").html(dateAdded+" <span>"+timezone+"</span>");
		$("#DateCompleted").html(date+" <span>"+timezone+"</span>");
		$("#decrem_increm").html(historyId);
		$("#ansTime").html(ansTime);
		$("#timeSpent").html(timeSpent);
		var intractionhistory 					=	json_intractionData.interactionHistory;
		var sortedinteractionHistory			=	intractionhistory;//sortedintractionhistory(intractionhistory);
		var flag=false;
		for(var index in intractionhistory){
			if(intractionhistory[index].phoneNumber)
				flag=true;
		}
		
		if($('#phno_head'))
			$('#phno_head').remove();
		if($('#obHead'))
			$('#obHead').remove();
		
		$("#IntractionHistoryTable").html('');
		
		if(flag){
			$('#myTable thead tr').append("<th id='phno_head' class='due_wd'>Phone</th>");
			$('#myTable thead tr').append("<th id='obHead' class='obID' style='visiblity:hidden'></th>");
			$('.status .dt_wd').css('width','20%');
		}else{
			$('.status .dt_wd').css('width','25.82106%');
		}
		
		$.each(sortedinteractionHistory, function(i, interactionsMap) 	
		{
			if(interactionsMap == undefined || interactionsMap.date == undefined)
				{
				return;
				}
			var offsetAtPresent	=	new Date().getTimezoneOffset();
			if((offsetAtPresent != "480") && (offsetAtPresent != "420"))
			{
			var gmtdates		=	offsetconversion(new Date(parseInt(interactionsMap.date)).getTime());				//gmt date
			var gmtdatesadded	=	offsetconversion(new Date(parseInt(interactionsMap.dateAdded)).getTime());		//gmt date added
			}
			else if((offsetAtPresent == "480") || (offsetAtPresent == "420"))
			{
			var gmtdates		=	(new Date(parseInt(interactionsMap.date))).getTime();				//pst/pdt date
			var gmtdatesadded	=	(new Date(parseInt(interactionsMap.dateAdded))).getTime();		//pst/pdt date added
			}
			var dates 			= 	new Date(gmtdates);	
			var formattedDatetemp	=	formateDate(gmtdates);
			var formattedDate		=	getDate_ddmmmyy(formattedDatetemp);
			var time			=	pad(dates.getHours())+":"+pad(dates.getMinutes())+":"+pad(dates.getSeconds());
			var agentlogin		=	interactionsMap.AgentLogin;
			var HisStatus		=	interactionsMap.action.capitalizeFirstLetter();
			var obConnIDRow     =   "";
			if(agentlogin == 'null' || agentlogin == '' || agentlogin == null || agentlogin == 'undefined' || agentlogin == undefined)
			{
				agentlogin	= "NA";
			} 
			else if(agentlogin === 'system' || agentlogin === 'visitor')
			{
				agentlogin	=	agentlogin.capitalizeFirstLetter();
			}
//			if (HisStatus.indexOf('incoming') != -1)
//			{
//				HisStatus	=	'Incoming';
//			}
			var chk_id	=	"chkid_"+interactionId; 
			
			var phoneNumber="NA";
			var outboundConnectionID="NA";
		
			if(interactionsMap.phoneNumber)
				{
					if(interactionsMap.outboundConnectionID != 'null' && interactionsMap.outboundConnectionID != '' && interactionsMap.outboundConnectionID != null && interactionsMap.outboundConnectionID != 'undefined' && interactionsMap.outboundConnectionID != undefined){
						outboundConnectionID	=interactionsMap.outboundConnectionID;
					}else{outboundConnectionID='NA'}
					if(interactionsMap.phoneNumber != 'null' && interactionsMap.phoneNumber != '' && interactionsMap.phoneNumber != null && interactionsMap.phoneNumber != 'undefined' && interactionsMap.phoneNumber != undefined){
						phoneNumber	=interactionsMap.phoneNumber;
					}else{phoneNumber='NA'} 
				}
			if(flag){
				if(phoneNumber=='NA'){
					obConnIDRow = '<td class="obID"><div id="d_clip_button'+i+'" class="clip_button fa fa-files-o" data-clipboard-text="'+outboundConnectionID+'" title="Click to copy." style="float: right;cursor: pointer;margin-top:1px;visibility:hidden"></div></td>';
				}else{
					obConnIDRow = '<td class="obID"><div id="d_clip_button'+i+'" class="clip_button fa fa-files-o" data-clipboard-text="'+outboundConnectionID+'" title="Click to copy." style="float: right;cursor: pointer;margin-top:1px;"></div></td>';
				}
				
				$('.status .dt_wd').css('width','20%');
				$('.status .conid_wd').css('width','39.3888%');
				$('.status .sat_wd').css('width','10.6666%');
				$('.status .agent_wd').css('width','20.1666%');
				$('.status .due_wd').css('width','14.6666%');
				$('.status .obID').css('width','2.6666%');
				
			var IntractionHistoryTable	=	'<tr >'+
	                					'<td class="dt_wd">'+formattedDate+'&nbsp&nbsp'+time+'</td>'+
	                					' <td class="conid_wd">'+interactionsMap.connectionId+'</td>'+
	                					'<td class="sat_wd">'+HisStatus+'</td>'+
	                					'<td class="agentlog_wd">'+agentlogin+'</td>'+
												'<td class="due_wd" title='+outboundConnectionID+'>'+phoneNumber+'</td>'+
												obConnIDRow + 
	                					'</tr> <input type="hidden" id="fieldinteractionId" value="'+chk_id+'">';
			$("#IntractionHistoryTable").append(IntractionHistoryTable);
				$('.dtl_scroll .dt_wd').css('width','20%');
			
				 var client = new ZeroClipboard( document.getElementById('d_clip_button'+i) );
				 client.on( 'aftercopy', function(event) {
			          messageWindow.popUpMessage( "Copied outbound connectionId to clipboard", 2000 );
		});
			}else{
				$('.status .dt_wd').css('width','25.82106%');
				$('.status .conid_wd').css('width','42.00906%');
				$('.status .sat_wd').css('width','12.68403%');
				$('.status .agent_wd').css('width','21.4043%');
				$('.status .due_wd').css('width','16.08154%');
				$('.status .obID').css('width','2.6666');
				
			var IntractionHistoryTable	=	'<tr >'+
	                					'<td class="dt_wd">'+formattedDate+'&nbsp&nbsp'+time+'</td>'+
	                					' <td class="conid_wd">'+interactionsMap.connectionId+'</td>'+
	                					'<td class="sat_wd">'+HisStatus+'</td>'+
	                					'<td class="agentlog_wd">'+agentlogin+'</td>'+
	                					'</tr> <input type="hidden" id="fieldinteractionId" value="'+chk_id+'">';
					$("#IntractionHistoryTable").append(IntractionHistoryTable);
	}
					
			
		});	
}

function getAnswerTime( intractionData, isReturnMilliseconds )
{
	var json_intractionData = null;
	var interactionDateType = typeof( intractionData );

	if( interactionDateType == 'string' )
		json_intractionData =   JSON.parse(intractionData);
	else if( interactionDateType == 'object' )
		json_intractionData = intractionData;

	var intractionhistory 	=	json_intractionData.interactionHistory;
	var initialDate		    =	null;
	var secondDate			=	null;
	var initialFlag			=	false;
	var timeDiff			=	'';
	var count				= 	0;
	for (var i=intractionhistory.length-1;i>=0;i--)
	{
		var status	=	intractionhistory[i].action;
		if	(status.indexOf('Answered') != -1 || status.indexOf('answered') != -1)
		{
			secondDate	=	intractionhistory[i].date;
			count 		= 	i;
			break;
		}
	}
	for (var i=count-1;i>=0;i--)
	{
		var status	=	intractionhistory[i].action;
		if	(status.indexOf('InQueue(IR)') != -1 || status.indexOf('queued') != -1)
		{
			 initialDate	=	intractionhistory[i].date;
			 initialFlag 	=	true;
		}
		else if (status.indexOf('Waiting(IR)') != -1)
		{
			 initialDate		=	intractionhistory[i].date;
			 initialFlag		=	true;
		}
		else
		{
			initialDate		=	intractionhistory[i].date;
		}
		if(initialFlag){
			break;
		}
	}
	if (initialDate == 'undefined'||initialDate == 'null'||initialDate == null || initialDate == ' '||secondDate == 'undefined'||secondDate == 'null'||secondDate == null || secondDate == ' ')
	{
		return 'NA';
	}
	timeDiffInMilliseconds = secondDate - initialDate;
	timeDiff	=	millisecondsToTime( timeDiffInMilliseconds );
	return ( isReturnMilliseconds ) ? timeDiffInMilliseconds : timeDiff;
}
	
function getTimeSpent( intractionData, isReturnMilliseconds )
{
	var json_intractionData = null;
	var interactionDateType = typeof( intractionData );

	if( interactionDateType == 'string' )
		json_intractionData =   JSON.parse(intractionData);
	else if( interactionDateType == 'object' )
		json_intractionData = intractionData;

	var intractionhistory 	=	json_intractionData.interactionHistory;
	var completedDate		=	null;
	var secondDate			=	null;
	var completedFlag		=	false;
	var secondFlag			=	false;
	var timeDiff			=	'';
	for (var i=intractionhistory.length-1;i>=0;i--)
	{
		try
		{
		
		
		var status	=	intractionhistory[i].action;
		if	(status.indexOf('Completed') != -1 || status.indexOf('closed') != -1 || status.indexOf('Account Disabled')  != -1 || status.indexOf('Callended') != -1 || status.indexOf('Dialout') != -1)
		{
			 completedDate	=	intractionhistory[i].date;
			 completedFlag 	=	true;
		}
		else if(status.indexOf('In Progress') != -1 )
		{
			 secondDate		=	intractionhistory[i].date;
			 secondFlag		=	true;
		}
		else if(status.indexOf('Answered') != -1 || status.indexOf('answered') != -1 )
		{	
			 secondDate		=	intractionhistory[i].date;
			 secondFlag		=	true;
		}
		if(completedFlag && secondFlag){
			break;
		}
	}
	catch(statusException)
	{
	console.log("this is the exception that occured at the place ::"+intractionhistory[i].action)
	console.log("printing necessary data :: status ::"+status+" interactionhistory[i]"+intractionhistory[i]+" and this is the interaction history object"+intractionhistory)
	}
	}
	if (completedDate == 'undefined'||completedDate == 'null'||completedDate == null || completedDate == ''||secondDate == 'undefined'||secondDate == 'null'||secondDate == null || secondDate == ''){
		
		return 'NA';
	}
	timeDiffInMilliseconds = completedDate - secondDate;
	timeDiff	=	millisecondsToTime( timeDiffInMilliseconds );
	return ( isReturnMilliseconds ) ? timeDiffInMilliseconds : timeDiff;
}

function millisecondsToTime(time)
{
	 var temp = 0;
     if(time < 0)
     {
          temp 		=  Math.round(-time/1000);
     }
     else
     {
    	 temp 		=  Math.round(time/1000);
     }
	if (isNaN(temp)) 
		temp = 0;
	var value1 		= temp;

	var hours		= Math.floor(value1/3600);
	var value2		= value1-(hours*3600);
	var mins		= Math.floor(value2/60);
	var seconds		= value2-(mins*60);
	
	if(hours<=0  && mins<=0 && seconds<=0)
	{
	    return 'NA';
	}
	if(time < 0)
	{
        return '-'+pad(hours) + ':' + pad(mins) + ':' + pad(seconds);
    }
	return pad(hours) + ':' + pad(mins) + ':' + pad(seconds);
}
var domainNames			= {};

function getDomainNamesBasedOnClientIdArray(uniqueClientIds)
{
	if(uniqueClientIds.length != 0)
    {
    	$.ajax({
    		type : "GET",
    		async: false,
    		url :	'/getDomainNames' ,
    		data : 'reqarray='+JSON.stringify(uniqueClientIds),
    		success : function(data) 
    		{
    			window.domainNames = JSON.parse(data);
    		}
    	});
    }
}

function escapeBackHtml(str) 
{
    return String(str).replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"');
}

function escapeTag(str){
	return String(str).replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function decodeHTML(str) 
{
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
}

function constructToHeader(interactionInfoMsg)
{
	var domToHeader	= '<a data-toggle="dropdown" href="#"><i class="fa fa-caret-down"></i></a>'
		+'<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">'
		+'<li class="scroll_li">'
		+'<ul class="viewer_list">';
	var addCC	="";
	var addBCC	="";
	for(var index in interactionInfoMsg)
	{
		try
		{
			var tempLabel =  index; 
			if(  typeof tempLabel != "undefined" )
			{
				Label = index; 
				Value = interactionInfoMsg[index].replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'"); 
				var decodedValue =	decodeURIComponent(escape(Value));
				decodedValue = decodedValue.split("+").join(" ");
				
				if("TO" == Label && Label)
				{
					var addTo	=	'<li><div class="view_info">to:</div><div class="view_dtl">';
					var headerArray	=	decodedValue.split(',');
					for(var index in headerArray)
					{
						addTo	=	addTo+(escapeTag(headerArray[index]))+'<br/>';
						
					}
					addTo	=	addTo+"</div></li>";
				}
				if("FROM" == Label && Label)
				{	
					$('#fromName').html("");
					$('#fromName').append(escapeTag(escapeBackHtml(decodedValue)));
					$('#fromHeader').html("");
					$('#fromHeader').append("From "+escapeTag(decodedValue));
					var addFrom	=	'<li><div class="view_info">from:</div><div class="view_dtl">';
					var headerArray	=	decodedValue.split(',');
					for(var index in headerArray)
					{	
						addFrom	=	addFrom+escapeTag(headerArray[index])+'<br/>';
					}
					addFrom	=	addFrom+"</div></li>";
				}
				if("CC" == Label && Label)
				{
					addCC	=	'<li><div class="view_info">cc:</div><div class="view_dtl">';
					var headerArray	=	decodedValue.split(',');
					for(var index in headerArray)
					{	
						addCC	=	addCC+escapeTag(headerArray[index])+'<br/>';
					}
					addCC	=	addCC+"</div></li>";
				}
				if("BCC" == Label && Label)
				{
					addBCC	=	'<li><div class="view_info">bcc:</div><div class="view_dtl">';
					var headerArray	=	decodedValue.split(',');
					for(var index in headerArray)
					{	
						addBCC	=	addBCC+escapeTag(headerArray[index])+'<br/>';
					}
					addBCC	=	addBCC+"</div></li>";
				}
			}
		}
		catch(e)
		{
			console.log("Exception while construction constructToHeader :: "+e);
		}
	}
	domToHeader	=	domToHeader+addTo+addFrom+addCC+addBCC+'</ul></li></ul>';
	$('#details_fromHeader').html("");
	$('#details_fromHeader').append(domToHeader);
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