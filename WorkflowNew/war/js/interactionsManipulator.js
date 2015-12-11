var interactionsManipulator =
{
	addInteractionsList :   function(jsonData)
	{
		if(jsonData != null || jsonData != undefined || JSON.stringify(jsonData) != "{}")
		{
			console.log("this is the initial interactionType",dd.interactionType)
			if(dd.interactionType=='All')
			{	
				this.appendTable(jsonData);
			}
			else if(dd.interactionType=='AR')
			{
				var tempJsonData={};
				for(var object in jsonData)
				{
					if(jsonData[object].interactionType==dd.interactionType)
						tempJsonData[object]=jsonData[object];
				}
				this.appendTable(tempJsonData);
			}else if(dd.interactionType=='SBChat')
			{
				var tempJsonData={};
				for(var object in jsonData)
				{
					if(jsonData[object].interactionType==dd.interactionType)
						tempJsonData[object]=jsonData[object];
				}
				this.appendTable(tempJsonData);
			}
		}
		else
		{
			console.log("unidentified interaction type found, this is neither sbchat nor AR"+dd.interactionType);	
		}
	},
	
	appendTable	:	function(interactionsData)
	{  
		$('#dataIn').show();
		$('#loading_img').hide();
		Actions.hideLoading();		
		var tempClientIdList	=	new Array()
		
		try
		{
		$.each(interactionsData, function(i, interactionsMap) 
		{
			if(interactionsMap.subAccountNumber != '1215251315')
				var accountNo	=	interactionsMap.subAccountNumber;
			else
			{
				var accountNo 	=	'2215251315';
			}
			if(dd.domainMap.list.indexOf(accountNo) == -1)
				{
					dd.domainMap.list.push(accountNo);
					tempClientIdList.push(accountNo);
				}
			
			var intractionhistory 	= 	interactionsMap.interactionHistory;
			var rdateadded    		=	intractionhistory[0].date;
			var len					= 	intractionhistory.length;
			var rdate				=   intractionhistory[len-1].date;
			var connectionID        =   intractionhistory[0].connectionId;
			    
			interactionsMap.multiConId = false;
            for(var index in intractionhistory)
            	{
            	      if(connectionID !== intractionhistory[index].connectionId)
            	      {
            	    	  interactionsMap.multiConId = true;
            	    	  break;
            	      }
            	}
            	
			var offsetAtPresent	=	new Date().getTimezoneOffset();
			if((offsetAtPresent != "480") && (offsetAtPresent != "420"))
			{
				var gmtdates		=	offsetconversion(new Date(rdate).getTime());				//gmt date
				gmtdatesadded	=	offsetconversion(new Date(rdateadded).getTime());		//gmt date added
			}
			else if((offsetAtPresent == "480") || (offsetAtPresent == "420"))
			{
				var gmtdates		=	new Date(rdate).getTime();				//pst/pdt date
				gmtdatesadded	=	new Date(rdateadded).getTime();		//pst/pdt date added
			}
			var compTime	=   millisecondsToTime(gmtdates-gmtdatesadded);
			
			if (interactionsMap.action.indexOf('nQueue(IR)') != -1 || interactionsMap.action.indexOf('Scheduled') != -1 || interactionsMap.action.indexOf('In Progress') != -1 || interactionsMap.action.indexOf('Answered') != -1 || interactionsMap.action.indexOf('answered') != -1 || interactionsMap.action.indexOf('Waiting') != -1 || interactionsMap.action.indexOf('Account Disabled') != -1 || interactionsMap.action.indexOf('Waiting(IR)') != -1)
			{
				compTime = 'NA';
			}
			if(compTime === 'NA'){
				interactionsMap.TimeToComplete = 0;	
			}
			else{
				interactionsMap.TimeToComplete = gmtdates-gmtdatesadded;
			}	
			
//			if(interactionsMap.interactionType == 'SBChat')
//			{
//				var interactionHistory  = new Array();
//				interactionHistory = interactionsMap.interactionHistory;
//				interactionsMap.AgentLogin = 'na';
//				var value = new Object();
//				for(var j=0; j<interactionHistory.length; j++)
//				{
//					value = interactionHistory[j];
//					if(value.AgentLogin == 'visitor' || value.AgentLogin == 'Visitor' || value.AgentLogin == 'system' || value.AgentLogin == 'System')
//						continue;
//					delete interactionsMap.AgentLogin;
//					interactionsMap.AgentLogin = value.AgentLogin;
//				}
//			}
			var interactionId 				=   interactionsMap.interactionId;
			var domain						=   interactionsMap.domain;
			var executeDomainFunction		=   false;
			var domainString	= 'dd.domainMap[interactionId] = setInterval(function(){dd.getDomainForAccountNumber(accountNo,interactionId);},500);';
			 if(domain == null || domain == undefined || domain == "")
		            {
		            	executeDomainFunction	=	true;	
		            }
		            else
		            {
		            	executeDomainFunction	=	false;
		            }
			if(executeDomainFunction)
				{
					eval(domainString);
				}
			interactionsManipulator.addInteractionToAppropriateMap(interactionsMap,i,interactionsMap.action);
		});
		}
		catch(ExceptionObj)
		{
			console.log("stupid exception occured!! :: ");
		}
		
		if(tempClientIdList.length > 0){
			dd.getDomainNameForList(tempClientIdList);
		}
		
    $( ".modal-backdrop.fade.in" ).remove();
		spinner.stop();
		if(query_counter == 6)
		{
			query_counter	= 	1;
			fetch_flag		=	"false";
		}
	},
	addInteractionToAppropriateMap : function(interactionData,key,status)
	{
		var interactionid	= key;
		var tempStatus      = status;
		tempStatus = tempStatus.toLowerCase();
		switch(tempStatus)
		{  
			case 'answered':
				if(dd.currentStatusmap.hasOwnProperty(interactionid))
				{
					curStatus = dd.currentStatusmap[interactionid];
					dd.iCount[curStatus] -= 1;
					delete dd[curStatus+"map"][interactionid];
				}
				
				dd.currentStatusmap[interactionid] = 'answered';
				dd.answeredmap[interactionid] = interactionData;
				dd.allmap[interactionid] = interactionData;
				dd.iCount.answered += 1; 
				dd.manipulateCounterForStatus('answered');
				
			break;
			
			case 'completed':
				
				if(dd.currentStatusmap.hasOwnProperty(interactionid))
				{
					curStatus = dd.currentStatusmap[interactionid];
					dd.iCount[curStatus] -= 1;
					delete dd[curStatus+"map"][interactionid];
				}
				
				dd.currentStatusmap[interactionid] = 'completed';
				dd.completedmap[interactionid] = interactionData;
				dd.allmap[interactionid] = interactionData;
				dd.iCount.completed += 1; 
				dd.manipulateCounterForStatus('completed');
				
			break;
			case 'completed-resolved':
			
				if(dd.currentStatusmap.hasOwnProperty(interactionid))
				{
					curStatus = dd.currentStatusmap[interactionid];
					dd.iCount[curStatus] -= 1;
					delete dd[curStatus+"map"][interactionid];
				}				
				
				dd.currentStatusmap[interactionid] = 'completed';
				dd.completedmap[interactionid] = interactionData;
				dd.allmap[interactionid] = interactionData;
				dd.iCount.completed += 1; 
				dd.manipulateCounterForStatus('completed');
			
			break;
			case 'completed-f8':
				
				if(dd.currentStatusmap.hasOwnProperty(interactionid))
				{
					curStatus = dd.currentStatusmap[interactionid];
					dd.iCount[curStatus] -= 1;
					delete dd[curStatus+"map"][interactionid];
				}				
				
				dd.currentStatusmap[interactionid] = 'completed';
				dd.completedmap[interactionid] = interactionData;
				dd.allmap[interactionid] = interactionData;
				dd.iCount.completed += 1; 
				dd.manipulateCounterForStatus('completed');
			break;
			
		//
				case 'completed-fetch':				
					if(dd.currentStatusmap.hasOwnProperty(interactionid))
					{
						curStatus = dd.currentStatusmap[interactionid];
						dd.iCount[curStatus] -= 1;
						delete dd[curStatus+"map"][interactionid];
					}								
					dd.currentStatusmap[interactionid] = 'completed';
					dd.completedmap[interactionid] = interactionData;
					dd.allmap[interactionid] = interactionData;
					dd.iCount.completed += 1; 
					dd.manipulateCounterForStatus('completed');
			break;
		//
			case 'completed-tabclose':
				
				if(dd.currentStatusmap.hasOwnProperty(interactionid))
				{
					curStatus = dd.currentStatusmap[interactionid];
					dd.iCount[curStatus] -= 1;
					delete dd[curStatus+"map"][interactionid];
				}				
				
				dd.currentStatusmap[interactionid] = 'completed';
				dd.completedmap[interactionid] = interactionData;
				dd.allmap[interactionid] = interactionData;
				dd.iCount.completed += 1; 
				dd.manipulateCounterForStatus('completed');
			
			break;
				
			
				case 'callended':
				if(dd.currentStatusmap.hasOwnProperty(interactionid))
				{
					curStatus = dd.currentStatusmap[interactionid];
					dd.iCount[curStatus] -= 1;
					delete dd[curStatus+"map"][interactionid];
				}				
				
				dd.currentStatusmap[interactionid] = 'completed';
				dd.completedmap[interactionid] = interactionData;
				dd.allmap[interactionid] = interactionData;
				dd.iCount.completed += 1; 
				dd.manipulateCounterForStatus('completed');
				break;
			
			case 'prechatsurveyclosed':
			case 'offlineformclosed':
			case 'closed':
			case 'closed-unanswered':
				
				if(dd.currentStatusmap.hasOwnProperty(interactionid))
				{
					curStatus = dd.currentStatusmap[interactionid];
					dd.iCount[curStatus] -= 1;
					delete dd[curStatus+"map"][interactionid];
				}				
				
				dd.currentStatusmap[interactionid] = 'completed';
				dd.completedmap[interactionid] = interactionData;
				dd.allmap[interactionid] = interactionData;
				dd.iCount.completed += 1; 
				dd.manipulateCounterForStatus('completed');
			
			break;
			case 'scheduled': 
				
				if(dd.currentStatusmap.hasOwnProperty(interactionid))
				{
					curStatus = dd.currentStatusmap[interactionid];
					dd.iCount[curStatus] -= 1;
					delete dd[curStatus+"map"][interactionid];
				}
				
				dd.currentStatusmap[interactionid] = 'scheduled';
				dd.scheduledmap[interactionid] = interactionData;
				dd.allmap[interactionid] = interactionData;
				dd.iCount.scheduled += 1; 
				dd.manipulateCounterForStatus('scheduled');
				
			break;
			case 'pending': 
				
				if(dd.currentStatusmap.hasOwnProperty(interactionid))
				{
					curStatus = dd.currentStatusmap[interactionid];
					dd.iCount[curStatus] -= 1;
					delete dd[curStatus+"map"][interactionid];
				}
				
				dd.currentStatusmap[interactionid] = 'pending';
				dd.pendingmap[interactionid] = interactionData;
				dd.allmap[interactionid] = interactionData;
				dd.iCount.pending += 1; 
				dd.manipulateCounterForStatus('pending');
				
			break;
			
			case 'inactive': 
				
				if(dd.currentStatusmap.hasOwnProperty(interactionid))
				{
					curStatus = dd.currentStatusmap[interactionid];
					dd.iCount[curStatus] -= 1;
					delete dd[curStatus+"map"][interactionid];
				}
				
				dd.currentStatusmap[interactionid] = 'pending';
				dd.pendingmap[interactionid] = interactionData;
				dd.allmap[interactionid] = interactionData;
				dd.iCount.pending += 1; 
				dd.manipulateCounterForStatus('pending');
				
			break;
			case 'failed': 
				
				if(dd.currentStatusmap.hasOwnProperty(interactionid))
				{
					curStatus = dd.currentStatusmap[interactionid];
					dd.iCount[curStatus] -= 1;
					delete dd[curStatus+"map"][interactionid];
				}
				
				dd.currentStatusmap[interactionid] = 'pending';
				dd.pendingmap[interactionid] = interactionData;
				dd.allmap[interactionid] = interactionData;
				dd.iCount.pending += 1; 
				dd.manipulateCounterForStatus('pending');
				
			break;
			
//			
//			
//			case 'waiting(ir)':
//				
//				if(dd.currentStatusmap.hasOwnProperty(interactionid))
//				{
//					curStatus = dd.currentStatusmap[interactionid];
//					dd.iCount[curStatus] -= 1;
//					delete dd[curStatus+"map"][interactionid];
//				}
//				
//				dd.currentStatusmap[interactionid] = 'waiting';
//				dd.waitingmap[interactionid] = interactionData;
//				dd.allmap[interactionid] = interactionData;
//				dd.iCount.waiting += 1; 
//				dd.manipulateCounterForStatus('waiting');
//				
//			break;
//				
//			
//			case 'rejected(ir)':
//				
//				if(dd.currentStatusmap.hasOwnProperty(interactionid))
//				{
//					curStatus = dd.currentStatusmap[interactionid];
//					dd.iCount[curStatus] -= 1;
//					delete dd[curStatus+"map"][interactionid];
//				}
//				
//				dd.currentStatusmap[interactionid] = 'waiting';
//				dd.waitingmap[interactionid] = interactionData;
//				dd.allmap[interactionid] = interactionData;
//				dd.iCount.waiting += 1; 
//				dd.manipulateCounterForStatus('waiting');
//				
//			break;
//			
//			
//			case 'account disabled':
//				
//				if(dd.currentStatusmap.hasOwnProperty(interactionid))
//				{
//					curStatus = dd.currentStatusmap[interactionid];
//					dd.iCount[curStatus] -= 1;
//					delete dd[curStatus+"map"][interactionid];
//				}
//				
//				dd.currentStatusmap[interactionid] = 'waiting';
//				dd.waitingmap[interactionid] = interactionData;
//				dd.allmap[interactionid] = interactionData;
//				dd.iCount.waiting += 1; 
//				dd.manipulateCounterForStatus('waiting');
//				
//			break;
//			
//			case 'overflowed':
//				
//				if(dd.currentStatusmap.hasOwnProperty(interactionid))
//				{
//					curStatus = dd.currentStatusmap[interactionid];
//					dd.iCount[curStatus] -= 1;
//					delete dd[curStatus+"map"][interactionid];
//				}
//				
//				dd.currentStatusmap[interactionid] = 'waiting';
//				dd.waitingmap[interactionid] = interactionData;
//				dd.allmap[interactionid] = interactionData;
//				dd.iCount.waiting += 1; 
//				dd.manipulateCounterForStatus('waiting');
//				
//			break;
//			
//			case 'invited':
//				
//				if(dd.currentStatusmap.hasOwnProperty(interactionid))
//				{
//					curStatus = dd.currentStatusmap[interactionid];
//					dd.iCount[curStatus] -= 1;
//					delete dd[curStatus+"map"][interactionid];
//				}
//				
//				dd.currentStatusmap[interactionid] = 'waiting';
//				dd.waitingmap[interactionid] = interactionData;
//				dd.allmap[interactionid] = interactionData;
//				dd.iCount.waiting += 1; 
//				dd.manipulateCounterForStatus('waiting');
//				
//			break;
//			
//			case 'delivered':
//				
//				if(dd.currentStatusmap.hasOwnProperty(interactionid))
//				{
//					curStatus = dd.currentStatusmap[interactionid];
//					dd.iCount[curStatus] -= 1;
//					delete dd[curStatus+"map"][interactionid];
//				}
//				
//				dd.currentStatusmap[interactionid] = 'waiting';
//				dd.waitingmap[interactionid] = interactionData;
//				dd.allmap[interactionid] = interactionData;
//				dd.iCount.waiting += 1; 
//				dd.manipulateCounterForStatus('waiting');
//				
//			break;
//			
//
//			case 'deleted':
//				
//				if(dd.currentStatusmap.hasOwnProperty(interactionid))
//				{
//					curStatus = dd.currentStatusmap[interactionid];
//					dd.iCount[curStatus] -= 1;
//					delete dd[curStatus+"map"][interactionid];
//				}
//				
//				dd.currentStatusmap[interactionid] = 'waiting';
//				dd.waitingmap[interactionid] = interactionData;
//				dd.allmap[interactionid] = interactionData;
//				dd.iCount.waiting += 1; 
//				dd.manipulateCounterForStatus('waiting');
//				
//			break;
//			
//			case 'offlinetimeout':
//				
//				if(dd.currentStatusmap.hasOwnProperty(interactionid))
//				{
//					curStatus = dd.currentStatusmap[interactionid];
//					dd.iCount[curStatus] -= 1;
//					delete dd[curStatus+"map"][interactionid];
//				}
//				
//				dd.currentStatusmap[interactionid] = 'waiting';
//				dd.waitingmap[interactionid] = interactionData;
//				dd.allmap[interactionid] = interactionData;
//				dd.iCount.waiting += 1; 
//				dd.manipulateCounterForStatus('waiting');
//				
//			break;
//				
//			case 'unanswered':
//				
//				if(dd.currentStatusmap.hasOwnProperty(interactionid))
//				{
//					curStatus = dd.currentStatusmap[interactionid];
//					dd.iCount[curStatus] -= 1;
//					delete dd[curStatus+"map"][interactionid];
//				}
//				
//				dd.currentStatusmap[interactionid] = 'waiting';
//				dd.waitingmap[interactionid] = interactionData;
//				dd.allmap[interactionid] = interactionData;
//				dd.iCount.waiting += 1; 
//				dd.manipulateCounterForStatus('waiting');
//				
//			break;
//			
//			case 'requeuemaxlimitexceeded(3)-inprogress':
//				
//				if(dd.currentStatusmap.hasOwnProperty(interactionid))
//				{
//					curStatus = dd.currentStatusmap[interactionid];
//					dd.iCount[curStatus] -= 1;
//					delete dd[curStatus+"map"][interactionid];
//				}
//				
//				dd.currentStatusmap[interactionid] = 'waiting';
//				dd.waitingmap[interactionid] = interactionData;
//				dd.allmap[interactionid] = interactionData;
//				dd.iCount.waiting += 1; 
//				dd.manipulateCounterForStatus('waiting');
//				
//			break;
//			
//			case 'requeuemaxlimitexceeded(3)-answered':
//				
//				if(dd.currentStatusmap.hasOwnProperty(interactionid))
//				{
//					curStatus = dd.currentStatusmap[interactionid];
//					dd.iCount[curStatus] -= 1;
//					delete dd[curStatus+"map"][interactionid];
//				}
//				
//				dd.currentStatusmap[interactionid] = 'waiting';
//				dd.waitingmap[interactionid] = interactionData;
//				dd.allmap[interactionid] = interactionData;
//				dd.iCount.waiting += 1; 
//				dd.manipulateCounterForStatus('waiting');
//				
//			break;
			
			case 'inqueue(ir)':
				
				if(dd.currentStatusmap.hasOwnProperty(interactionid))
				{
					curStatus = dd.currentStatusmap[interactionid];
					dd.iCount[curStatus] -= 1;
					delete dd[curStatus+"map"][interactionid];
				}
				dd.currentStatusmap[interactionid] = 'inqueue';
				dd.inqueuemap[interactionid] = interactionData;
				dd.allmap[interactionid] = interactionData;
				dd.iCount.inqueue += 1; 
				dd.manipulateCounterForStatus('inqueue');
				
			break;
			case 'inqueue(tr)':
				
				if(dd.currentStatusmap.hasOwnProperty(interactionid))
				{
					curStatus = dd.currentStatusmap[interactionid];
					dd.iCount[curStatus] -= 1;
					delete dd[curStatus+"map"][interactionid];
				}
				
				dd.currentStatusmap[interactionid] = 'inqueue';
				dd.inqueuemap[interactionid] = interactionData;
				dd.allmap[interactionid] = interactionData;
				dd.iCount.inqueue += 1; 
				dd.manipulateCounterForStatus('inqueue');
				
			break;
			case 'inqueue(wi)':
				
				if(dd.currentStatusmap.hasOwnProperty(interactionid))
				{
					curStatus = dd.currentStatusmap[interactionid];
					dd.iCount[curStatus] -= 1;
					delete dd[curStatus+"map"][interactionid];
				}
				
				dd.currentStatusmap[interactionid] = 'inqueue';
				dd.inqueuemap[interactionid] = interactionData;
				dd.allmap[interactionid] = interactionData;
				dd.iCount.inqueue += 1; 
				dd.manipulateCounterForStatus('inqueue');
				
			break;
			case 'queued':
				
				if(dd.currentStatusmap.hasOwnProperty(interactionid))
				{
					curStatus = dd.currentStatusmap[interactionid];
					dd.iCount[curStatus] -= 1;
					delete dd[curStatus+"map"][interactionid];
				}
				
				dd.currentStatusmap[interactionid] = 'inqueue';
				dd.inqueuemap[interactionid] = interactionData;
				dd.allmap[interactionid] = interactionData;
				dd.iCount.inqueue += 1; 
				dd.manipulateCounterForStatus('inqueue');
				
			break;
				
			case 'in progress': 
				
				if(dd.currentStatusmap.hasOwnProperty(interactionid))
				{
					curStatus = dd.currentStatusmap[interactionid];
					dd.iCount[curStatus] -= 1;
					delete dd[curStatus+"map"][interactionid];
				}
				
				dd.currentStatusmap[interactionid] = 'inprogress';
				dd.inprogressmap[interactionid] = interactionData;
				dd.allmap[interactionid] = interactionData;
				dd.iCount.inprogress += 1; 
				dd.manipulateCounterForStatus('inprogress');
				
			break;
			
			case 'callended':

				if(dd.currentStatusmap.hasOwnProperty(interactionid))
				{
					curStatus = dd.currentStatusmap[interactionid];
					dd.iCount[curStatus] -= 1;
					delete dd[curStatus+"map"][interactionid];
				}

				dd.currentStatusmap[interactionid] = 'completed';
				dd.completedmap[interactionid] = interactionData;
				dd.allmap[interactionid] = interactionData;
				dd.iCount.completed += 1;
				dd.manipulateCounterForStatus('completed');

			break;

			case 'dialout':

				if(dd.currentStatusmap.hasOwnProperty(interactionid))
				{
					curStatus = dd.currentStatusmap[interactionid];
					dd.iCount[curStatus] -= 1;
					delete dd[curStatus+"map"][interactionid];	
				}

				dd.currentStatusmap[interactionid] = 'completed';
				dd.completedmap[interactionid] = interactionData;
				dd.allmap[interactionid] = interactionData;
				dd.iCount.completed += 1;
				dd.manipulateCounterForStatus('completed');

			break;

			default : 

				if(dd.currentStatusmap.hasOwnProperty(interactionid))
				{
					curStatus = dd.currentStatusmap[interactionid];
					dd.iCount[curStatus] -= 1;
					delete dd[curStatus+"map"][interactionid];
				}
				
				dd.currentStatusmap[interactionid] = 'waiting';
				dd.waitingmap[interactionid] = interactionData;
				dd.allmap[interactionid] = interactionData;
				dd.iCount.waiting += 1; 
				dd.manipulateCounterForStatus('waiting');
			break;
			}
		
	}
	
	
}