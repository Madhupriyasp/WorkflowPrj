/**
 * @author pradeep.1and0
 */

var dd =
{		
		//To filter interactions based on interactionTypes
		interactionType				: "All",
		
		//the timer that will start when page loads or reloads
		// make the reload time more than 1 minutes 
		reLoadTime					:	30,
		reInitializeDataCounter		:	0,
		reInitailizationObject		:	null,
		
		initialzeDataReloadCounter	:	function(){
//			this.reInitailizationObject		=	setInterval(function(){
//
//				dd.reInitializeDataCounter = dd.reInitializeDataCounter+1;
//				
//				if(dd.reLoadTime == 1)
//				{
//					return;
//				}	
//				
//				if(new Date().getMinutes() % dd.reLoadTime == 0)
//				{
//					var fromDate=	$('#inputDate1').val();
//					var toDate	=	$('#inputDate2').val();					
//					dd.doInitialAction_Reload(fromDate,toDate);
//				}
//			},59000);
		},
		
		//will maintain the currentStatus that is being monitored now
		
		currentSelection : "all",
		
		//will maintain the count of each tabs
		iCount 			: new Object(),

		//will maintain the the current status of the interaction
		currentStatusmap: new Object(),

		//will maintain the interactions in each tab
		inqueuemap		: new Object(),
		allmap			: new Object(),
		completedmap	: new Object(),
		scheduledmap	: new Object(),
		pendingmap		: new Object(),
		inprogressmap	: new Object(),
		waitingmap		: new Object(),
		stuckmap		: new Object(),
		answeredmap		: new Object(),
		requeuemap		: new Object(),
		internalMap		: new Object(),
		
		//will maintain interaction that is missed in the above map-> ny new status
		
		extrasmap		: new Object(),

		//domain map for account number 
		//key value pair key : accountNumber ,value : domain name
		domainMap		: new Object(),
		
		initializeData : function(){
		
			delete this.reInitializeDataCounter;
			delete this.timeCounter;
			
			this.domainMap.list		= new Array(),
			this.iCount.answered 	= 0;
			this.iCount.completed 	= 0;
			this.iCount.scheduled 	= 0;
			this.iCount.pending 	= 0;
			this.iCount.stuck 		= 0;
			this.iCount.inqueue		= 0;
			this.iCount.inprogress 	= 0;
			this.iCount.waiting 	= 0;
			this.iCount.all			= 0;
			
			//count for unhandled status for now -> do not use or del this count for now - > Pradeep.
			this.iCount.extras		= 0;
			
			this.inqueuemap		= new Object();
			this.completedmap	= new Object();
			this.scheduledmap	= new Object();
			this.pendingmap		= new Object();
			this.inprogressmap	= new Object();
			this.waitingmap		= new Object();
			this.stuckipmap		= new Object();
			this.answeredmap	= new Object();
			this.requeuemap		= new Object();
			this.timeCounter 	= new Object();
			this.allmap			= new Object();
			this.currentStatusmap = new Object();
			
			this.manipulateCounter();
			this.reInitializeDataCounter	=	0;
			this.initialzeDataReloadCounter();
		},
		
		// order status // dont want to maintain the load order somewhere else . 
		orderStatus			:	new Array("inqueue","queued-chat","waiting","answered-chat","answered","inprogress","scheduled","pending","completed","closed-chat","completed-resolved","completed-f8","callended","dialout","completed-tabclose","Account Disabled"),		
		spinnerObj1			: 	new Array(),
		spinnerObj2			:	new Array(),

		initializeSpinner 	:	function()
		{
			for(i in this.orderStatus)
			{
				this.spinnerObj1.push(new Spinner(opts).spin(document.getElementById(this.orderStatus[i]+"1_img")));
				this.spinnerObj2.push(new Spinner(opts).spin(document.getElementById(this.orderStatus[i]+"1_img")));
			}

			this.spinnerObj1.push(new Spinner(opts).spin(document.getElementById("all1_img")));
			this.spinnerObj2.push(new Spinner(opts).spin(document.getElementById("all2_img")));
		},
		
		//will maintain the time counter object
		timeCounter : new Object(),
		 
		onMessageAction	: function(totalData)
		{
			try
			{
				var tData = JSON.parse(totalData);
				var data  = JSON.parse(tData.data);

				if(data.newInteraction)
					this.manipulateDataAndAddtoPage(data.interactionsData);//TODO: Real time append
				else
					this.updateInteractionFromPage(data.currentStatus,data.agentLogin,data.connectionId,data.interactionId,data.updateTime,null);//TODO: Real time append
			}
			catch(ExcepionObject)
			{
				// agent update data came here, so We ignore updating it to the JSP.
			}
		},
		
		doInitialAction_Reload	: function(fromDate,toDate)
		{
			this.reInitializeDataCounter = 0;
			clearInterval(this.reInitailizationObject);
			dd.initializeSpinner();
			var validatedateresult	=	ValidateDates(new Date(fromDate),new Date(toDate));
			if(String(validatedateresult).match(true))
			{
				$('#loading_img').show();
				loadInteractions_gae_all();
			}
			this.initialzeDataReloadCounter();
		},
		
		addInteractionsList : function(jsonDataList,status)
		{
			$.each(jsonDataList, function(i, jsonData) 
			{
				if(status == null)
					status = jsonData.action;
				
				dd.addInteractionsToPage(jsonData,status);
			});
		},
		
		/*
		 * This function will add any new interaction to the local map -> not all status or handled here
		 * But a map "extra" is just adding all the missed status case - > so could be used for reference.
		 */
		appendValueToLocal : function(jsonData,status)
		{
			switch(status)
			{
				case 'Answered':
					var interactionid	= jsonData.interactionId;
					
					if(this.currentStatusmap.hasOwnProperty(interactionid))
					{
						curStatus = this.currentStatusmap[interactionid];
						this.iCount[curStatus] -= 1;
						delete this[curStatus+"map"][interactionid];
					}
					
					this.currentStatusmap[interactionid] = 'answered';
					this.answeredmap[interactionid] = jsonData;
					this.allmap[interactionid] = jsonData;
					this.iCount.answered += 1; 
					this.manipulateCounterForStatus('answered');
					
				break;
				
				case 'Completed':
					var interactionid	= jsonData.interactionId;
					
					if(this.currentStatusmap.hasOwnProperty(interactionid))
					{
						curStatus = this.currentStatusmap[interactionid];
						this.iCount[curStatus] -= 1;
						delete this[curStatus+"map"][interactionid];
					}				
					
					this.currentStatusmap[interactionid] = 'completed';
					this.completedmap[interactionid] = jsonData;
					this.allmap[interactionid] = jsonData;
					this.iCount.completed += 1; 
					this.manipulateCounterForStatus('completed');
				
				break;
				
				case 'Completed-TabClose':
					var interactionid	= jsonData.interactionId;
					
					if(this.currentStatusmap.hasOwnProperty(interactionid))
					{
						curStatus = this.currentStatusmap[interactionid];
						this.iCount[curStatus] -= 1;
						delete this[curStatus+"map"][interactionid];
					}				
					
					this.currentStatusmap[interactionid] = 'completed';
					this.completedmap[interactionid] = jsonData;
					this.allmap[interactionid] = jsonData;
					this.iCount.completed += 1; 
					this.manipulateCounterForStatus('completed');
				
				break;
					
				case 'Account Disabled':
					var interactionid	= jsonData.interactionId;
					
					if(this.currentStatusmap.hasOwnProperty(interactionid))
					{
						curStatus = this.currentStatusmap[interactionid];
						this.iCount[curStatus] -= 1;
						delete this[curStatus+"map"][interactionid];
					}				
					
					this.currentStatusmap[interactionid] = 'completed';
					this.completedmap[interactionid] = jsonData;
					this.allmap[interactionid] = jsonData;
					this.iCount.completed += 1; 
					this.manipulateCounterForStatus('completed');
				
				break;
					
				case 'Scheduled': 
					var interactionid	= jsonData.interactionId;
					
					if(this.currentStatusmap.hasOwnProperty(interactionid))
					{
						curStatus = this.currentStatusmap[interactionid];
						this.iCount[curStatus] -= 1;
						delete this[curStatus+"map"][interactionid];
					}
					
					this.currentStatusmap[interactionid] = 'scheduled';
					this.scheduledmap[interactionid] = jsonData;
					this.allmap[interactionid] = jsonData;
					this.iCount.scheduled += 1; 
					this.manipulateCounterForStatus('scheduled');
					
				break;
				
				case 'Pending': 
					var interactionid	= jsonData.interactionId;
					
					if(this.currentStatusmap.hasOwnProperty(interactionid))
					{
						curStatus = this.currentStatusmap[interactionid];
						this.iCount[curStatus] -= 1;
						delete this[curStatus+"map"][interactionid];
					}
					
					this.currentStatusmap[interactionid] = 'pending';
					this.pendingmap[interactionid] = jsonData;
					this.allmap[interactionid] = jsonData;
					this.iCount.pending += 1; 
					this.manipulateCounterForStatus('pending');
					
				break;
					
				/*case 'waiting':
					var interactionid	= jsonData.interactionId;
					
					if(this.currentStatusmap.hasOwnProperty(interactionid))
					{
						curStatus = this.currentStatusmap[interactionid];
						this.iCount[curStatus] -= 1;
						delete this[curStatus+"map"][interactionid];
					}
					
					this.currentStatusmap[interactionid] = 'waiting';
					this.stuckipmap[interactionid] = jsonData;
					this.allmap[interactionid] = jsonData;
					this.iCount.inprogress += 1; 
					this.manipulateCounterForStatus('waiting');
					
				break;*/
					
				case 'InQueue(IR)':
					var interactionid	= jsonData.interactionId;
					
					if(this.currentStatusmap.hasOwnProperty(interactionid))
					{
						curStatus = this.currentStatusmap[interactionid];
						this.iCount[curStatus] -= 1;
						delete this[curStatus+"map"][interactionid];
					}
					
					this.currentStatusmap[interactionid] = 'inqueue';
					this.inqueuemap[interactionid] = jsonData;
					this.allmap[interactionid] = jsonData;
					this.iCount.inqueue += 1; 
					this.manipulateCounterForStatus('inqueue');
					
				break;
					
				case 'In Progress': 
					var interactionid	= jsonData.interactionId;
					
					if(this.currentStatusmap.hasOwnProperty(interactionid))
					{
						curStatus = this.currentStatusmap[interactionid];
						this.iCount[curStatus] -= 1;
						delete this[curStatus+"map"][interactionid];
					}
					
					this.currentStatusmap[interactionid] = 'inprogress';
					this.inprogressmap[interactionid] = jsonData;
					this.allmap[interactionid] = jsonData;
					this.iCount.inprogress += 1; 
					this.manipulateCounterForStatus('inprogress');
					
				break;
				
				case 'waiting':
					var interactionid	= jsonData.interactionId;
					
					if(this.currentStatusmap.hasOwnProperty(interactionid))
					{
						curStatus = this.currentStatusmap[interactionid];
						this.iCount[curStatus] -= 1;
						delete this[curStatus+"map"][interactionid];
					}
					
					this.currentStatusmap[interactionid] = 'waiting';
					this.waitingmap[interactionid] = jsonData;
					this.allmap[interactionid] = jsonData;
					this.iCount.waiting += 1; 
					this.manipulateCounterForStatus('waiting');
					
				case 'Rejected(IR)':
					var interactionid	= jsonData.interactionId;
					
					if(this.currentStatusmap.hasOwnProperty(interactionid))
					{
						curStatus = this.currentStatusmap[interactionid];
						this.iCount[curStatus] -= 1;
						delete this[curStatus+"map"][interactionid];
					}
					
					this.currentStatusmap[interactionid] = 'waiting';
					this.waitingmap[interactionid]      = jsonData;
					this.allmap[interactionid] = jsonData;
					this.iCount.waiting += 1; 
					this.manipulateCounterForStatus('waiting');	
					
				break;
				
				case 'Deleted': 
					var interactionid	= jsonData.interactionId;
					
					if(this.currentStatusmap.hasOwnProperty(interactionid))
					{
						curStatus = this.currentStatusmap[interactionid];
						this.iCount[curStatus] -= 1;
						delete this[curStatus+"map"][interactionid];
					}
					
					this.currentStatusmap[interactionid] = 'deleted';
					this.waitingmap[interactionid] = jsonData;
					this.allmap[interactionid] = jsonData;
					this.iCount.waiting += 1;
					this.manipulateCounterForStatus('deleted');
					
				break;
	
				default : 
					var interactionid	= jsonData.interactionId;
					
					if(this.currentStatusmap.hasOwnProperty(interactionid))
					{
						curStatus = this.currentStatusmap[interactionid];
						this.iCount[curStatus] -= 1;
						delete this[curStatus+"map"][interactionid];
					}
					
					this.currentStatusmap[interactionid] = 'extras';
					this.extrasmap[interactionid] = jsonData;
					this.iCount.extras += 1; 
					this.manipulateCounterForStatus('extras');
				
				break;
			}
		},
		
		/*
		 * This is to construct the appropriate data in json format to be added to the table and local map
		 * Changing the structure could affect adding data to the table.
		 */
		manipulateDataAndAddtoPage:function(interactionData){
			
			Tobj = interactionData;
			var interactionId = Tobj.interactionId;
			if($('#trid_'+interactionId+'_history').html() != undefined && 
					$('#trid_'+interactionId+'_history').html() != null && 
					$('#trid_'+interactionId+'_history').html() != "" &&
					$('#trid_'+interactionId+'_history').html() != "undefined")
			{
				//this should be a rescheduled interaction or interaction coming again ...lets add something to interaction history - make it like and update
				this.updateInteractionFromPage(Tobj.interactionStatus, Tobj.agentLogin, Tobj.connectionId, Tobj.interactionId, Tobj.date,Tobj);
			}
			else
			{
				var date = new Date();
				Iobj = interactionData.interactionHistories;
				interactionsMap  =  new Object();
		
				interactionsMap['parentInteractionId'] 	= Tobj.interactionId;
				interactionsMap['interactionId'] 		= Tobj.interactionId;
				interactionsMap['connectionId'] 		= Tobj.connectionId;
				interactionsMap['action'] 				= Tobj.interactionStatus;
				interactionsMap['date'] 				= date.getTime();
				interactionsMap['dateAdded'] 			= date.getTime();
				if(Tobj.agentLogin == undefined)
				{
					interactionsMap['AgentLogin'] 			= Tobj.AgentLogin;
				}
				else
				{
					interactionsMap['AgentLogin'] 			= Tobj.agentLogin;
				}				
				
				interactionsMap['messages']				= encodeURIComponent(JSON.stringify(Tobj.messages));
				interactionsMap['subAccountNumber'] 	= Tobj.subaccountNumber;
				
				var interactionList  =  new Array();
		
				for(obj in Iobj)
				{
					tInteractionsDMap =  new Object();
					
					tInteractionsDMap['connectionId'] 	=  Iobj[obj].connectionId;
					tInteractionsDMap['action'] 		=  Tobj.interactionStatus;
					tInteractionsDMap['AgentLogin'] 	=  Iobj[obj].agentLogin;
					tInteractionsDMap['date'] 			=  Iobj[obj].date;
					tInteractionsDMap['dateAdded'] 		=  Iobj[obj].date;
		
					interactionList.push(tInteractionsDMap);
				}
				
				interactionsMap['interactionHistory'] 	= interactionList;     
				
				this.addInteractionsToPage(interactionsMap,Tobj.interactionStatus);
			}
		},
		
		addInteractionsToPage:function(jsonData,status)
		{
			var tempList	=	new Array();
			var arrayFormat = new Array();
			arrayFormat.push(jsonData);
			
			var accountNumber = jsonData.subAccountNumber;
			
	/*		if(status == dd.currentSelection ||dd.currentSelection == "all")
			{
				currentdata	=	currentdata.concat(arrayFormat);
				recreateDataToSort(currentdata,"");
				appendTable(arrayFormat);
				//chooseTheCurrentSelection(dd.currentSelection);
			}
			dd.appendValueToLocal(jsonData,status);
	*/		

			if(dd.domainMap.list.indexOf(jsonData.subAccountNumber) == -1)
			{
				dd.domainMap.list.push(jsonData.subAccountNumber);
				tempList.push(jsonData.subAccountNumber);
			}
			
			
			if(tempList.length > 0)
				dd.getDomainNameForList(tempList);
			
			
			if(internal_flag == "false" && fetch_flag == "false")
			{
				if( $.inArray(accountNumber,internal_accounts) === -1)	
				{
					if(status == dd.currentSelection ||dd.currentSelection == "all")
					{
						currentdata	=	currentdata.concat(arrayFormat);
						recreateDataToSort(currentdata,"");
						appendTable(arrayFormat);
						//chooseTheCurrentSelection(dd.currentSelection);
					}
					dd.appendValueToLocal(jsonData,status);
				}	
			}
			else if(internal_flag == "true" && fetch_flag == "false")
			{		
				if( $.inArray(accountNumber,internal_accounts) !== -1)	
				{
					if(status == dd.currentSelection ||dd.currentSelection == "all")
					{
						currentdata	=	currentdata.concat(arrayFormat);
						recreateDataToSort(currentdata,"");
						appendTable(arrayFormat);
						//chooseTheCurrentSelection(dd.currentSelection);
					}
					dd.appendValueToLocal(jsonData,status);
				}	
			}
			else if(fetch_flag == "true")
			{		
				if( accountNumber == $("#accNo").val())	
				{
					if(status == dd.currentSelection ||dd.currentSelection == "all")
					{
						currentdata	=	currentdata.concat(arrayFormat);
						recreateDataToSort(currentdata,"");
						appendTable(arrayFormat);
						//chooseTheCurrentSelection(dd.currentSelection);
					}
					dd.appendValueToLocal(jsonData,status);
				}	
			}
			
			
		},
		
		
		updateInteractionFromPage:function(status,agentLogin,connectionId,interactionId,updateTime,TranscriptObj)
		{	
			var obj = new Object();
			
			obj.connectionId 		= connectionId;
			obj.AgentLogin			= agentLogin;			
			obj.action				= status;
			obj.date				= updateTime;
			obj.dateAdded			= updateTime;
			
			if($('#trid_'+interactionId+'_history').html() != undefined && 
					$('#trid_'+interactionId+'_history').html() != null && 
					$('#trid_'+interactionId+'_history').html() != "" &&
					$('#trid_'+interactionId+'_history').html() != "undefined")
			{
				var interactionsdata = JSON.parse($('#trid_'+interactionId+'_history').html());
				interactionsdata.interactionHistory.push(obj);
				interactionsdata.action = status;
				interactionsdata.AgentLogin = agentLogin;
				if(TranscriptObj != undefined && TranscriptObj != null)
				{
					interactionsdata.message = encodeURIComponent(TranscriptObj.messages);
				}
				$('#trid_'+interactionId).remove();
				this.addInteractionsToPage(interactionsdata,status);
			}
			else
			{
				curStatus = this.currentStatusmap[interactionId];
				if(curStatus != undefined && curStatus != null && curStatus != "")
				{
					var jsonData = this[curStatus+"map"][interactionId];
					jsonData.interactionHistory.push(obj);
					jsonData.action = status;
					jsonData.AgentLogin = agentLogin;
					if(TranscriptObj != undefined && TranscriptObj != null)
					{
						jsonData.messages = encodeURIComponent(TranscriptObj.messages);
					}
					this.addInteractionsToPage(jsonData,status);
				}
				else
				{
					console.log("seriously, what can i do now ??!!! :@ ");
				}
			}
		},
		
		manipulateCounterForStatus:function(status){
			$("#answered1_cnt").html(this.iCount.answered);
			$("#answered2_cnt").html(this.iCount.answered);
			$("#completed1_cnt").html(this.iCount.completed);
			$("#completed2_cnt").html(this.iCount.completed);
			$("#scheduled1_cnt").html(this.iCount.scheduled);
			$("#scheduled2_cnt").html(this.iCount.scheduled);
			$("#pending1_cnt").html(this.iCount.pending);
			$("#pending2_cnt").html(this.iCount.pending);
			$("#inqueue1_cnt").html(this.iCount.inqueue);
			$("#inqueue2_cnt").html(this.iCount.inqueue);
			$("#inprogress1_cnt").html(this.iCount.inprogress);
			$("#inprogress2_cnt").html(this.iCount.inprogress);
			$("#waiting1_cnt").html(this.iCount.waiting);
			$("#waiting2_cnt").html(this.iCount.waiting);
			this.iCount.all = this.iCount.answered + this.iCount.completed + this.iCount.scheduled + this.iCount.pending + this.iCount.waiting + this.iCount.inqueue + this.iCount.inprogress;
			$("#all1_cnt").html(this.iCount.all);
			$("#all2_cnt").html(this.iCount.all);
		},
		
		manipulateCounter:function()
		{
			$("#answeredCounter1").html('<strong id="answered1_img"></strong><strong id="answered1_cnt">'+this.iCount.answered+'</strong>');
			$("#answeredCounter2").html('<strong id="answered2_img"/></strong><strong id="answered2_cnt">'+this.iCount.answered+'</strong>');

			$("#completedcounter1").html('<strong id="completed1_img"></strong><strong id="completed1_cnt">'+this.iCount.completed+'</strong>');
			$("#completedcounter2").html('<strong id="completed2_img"></strong><strong id="completed2_cnt">'+this.iCount.completed+'</strong>');

			$("#scheduledcounter1").html('<strong id="scheduled1_img"></strong><strong id="scheduled1_cnt">'+this.iCount.scheduled+'</strong>');
			$("#scheduledcounter2").html('<strong id="scheduled2_img"></strong><strong id="scheduled2_cnt">'+this.iCount.scheduled+'</strong>');

			$("#pendingcounter1").html('<strong id="pending1_img"></strong><strong id="pending1_cnt">'+this.iCount.pending+'</strong>');
			$("#pendingcounter2").html('<strong id="pending2_img"></strong><strong id="pending2_cnt">'+this.iCount.pending+'</strong>');
			
			$("#stuckcounter1").html('<strong id="stuck1_img"></strong><strong id="waiting1_cnt">'+this.iCount.waiting+'</strong>');
			$("#stuckcounter2").html('<strong id="stuck2_img"></strong><strong id="waiting2_cnt">'+this.iCount.waiting+'</strong>');

			$("#inqueueCounter1").html('<strong id="inqueue1_img"/></strong><strong id="inqueue1_cnt">'+this.iCount.inqueue+'</strong>');
			$("#inqueueCounter2").html('<strong id="inqueue2_img"/></strong><strong id="inqueue2_cnt">'+this.iCount.inqueue+'</strong>');

			$("#progresscounter1").html('<strong id="inprogress1_img"></strong><strong id="inprogress1_cnt">'+this.iCount.inprogress+'</strong>');
			$("#progresscounter2").html('<strong id="inprogress2_img"></strong><strong id="inprogress2_cnt">'+this.iCount.inprogress+'</strong>');

			this.iCount.all = this.iCount.answered + this.iCount.completed + this.iCount.scheduled + this.iCount.stuck + this.iCount.inqueue + this.iCount.inprogress;

			$("#allTaskCounter1").html('<strong id="all1_img"></strong><strong id="all1_cnt">'+this.iCount.all+'</strong>');
			$("#allTaskCounter2").html('<strong id="all2_img"></strong><strong id="all2_cnt">'+this.iCount.all+'</strong>');
		},
		
		showLoadingSymbol:function(){
			$("#answered1_img").css('display','');
			$("#answered2_img").css('display','');

			$("#completed1_img").css('display','');
			$("#completed2_img").css('display','');

			$("#scheduled1_img").css('display','');
			$("#scheduled2_img").css('display','');
			
			$("#pending1_img").css('display','');
			$("#pending2_img").css('display','');
			
			$("#stuck1_img").css('display','');
			$("#stuck2_img").css('display','');

			$("#inqueue1_img").css('display','');
			$("#inqueue2_img").css('display','');

			$("#inprogress1_img").css('display','');
			$("#inprogress2_img").css('display','');

			$("#all1_img").css('display','');
			$("#all2_img").css('display','');
		},
		
		showLoadingSpinSymbol:function(){
			this.spinnerObj1[this.orderStatus.indexOf('answered')].spin(document.getElementById("answered1_img"));
			this.spinnerObj2[this.orderStatus.indexOf('answered')].spin(document.getElementById("answered2_img"));

			this.spinnerObj1[this.orderStatus.indexOf('completed')].spin(document.getElementById("completed1_img"));
			this.spinnerObj2[this.orderStatus.indexOf('completed')].spin(document.getElementById("completed2_img"));

			this.spinnerObj1[this.orderStatus.indexOf('scheduled')].spin(document.getElementById("scheduled1_img"));
			this.spinnerObj2[this.orderStatus.indexOf('scheduled')].spin(document.getElementById("scheduled2_img"));
			
			this.spinnerObj1[this.orderStatus.indexOf('pending')].spin(document.getElementById("pending1_img"));
			this.spinnerObj2[this.orderStatus.indexOf('pending')].spin(document.getElementById("pending2_img"));
			
			this.spinnerObj1[this.orderStatus.indexOf('waiting')].spin(document.getElementById("stuck1_img"));
			this.spinnerObj2[this.orderStatus.indexOf('waiting')].spin(document.getElementById("stuck2_img"));

			this.spinnerObj1[this.orderStatus.indexOf('inqueue')].spin(document.getElementById("inqueue1_img"));
			this.spinnerObj2[this.orderStatus.indexOf('inqueue')].spin(document.getElementById("inqueue2_img"));

			this.spinnerObj1[this.orderStatus.indexOf('inprogress')].spin(document.getElementById("inprogress1_img"));
			this.spinnerObj2[this.orderStatus.indexOf('inprogress')].spin(document.getElementById("inprogress2_img"));

			this.spinnerObj1[this.spinnerObj1.length-1].spin(document.getElementById("all1_img"));
			this.spinnerObj2[this.spinnerObj2.length-1].spin(document.getElementById("all2_img"));
		},

		hideLoading:function(status)
		{
			switch(status)
			{
			case 'answered':
				$("#answered1_img").css('display','none');
				$("#answered2_img").css('display','none');

				break;

			case 'completed':
				$("#completed1_img").css('display','none');
				$("#completed2_img").css('display','none');

				break;

			case 'scheduled': 
				$("#scheduled1_img").css('display','none');
				$("#scheduled2_img").css('display','none');

				break;

			case 'pending': 
				$("#pending1_img").css('display','none');
				$("#pending2_img").css('display','none');

				break;
				
			case 'inqueue':
				$("#inqueue1_img").css('display','none');
				$("#inqueue2_img").css('display','none');

				break;
				
			case 'waiting':
				$("#stuck1_img").css('display','none');
				$("#stuck2_img").css('display','none');

				break;

			case 'inprogress': 
				$("#inprogress1_img").css('display','none');
				$("#inprogress2_img").css('display','none');

				break;

			case 'all': 
				$("#all1_img").css('display','none');
				$("#all2_img").css('display','none');

				break;

			default : 
				console.info("status ?? really :: "+status)

				break;
			}
		},

		hideLoadingSpinner:function(status)
		{
			switch(status)
			{
			case 'answered':
				this.spinnerObj1[this.orderStatus.indexOf('answered')].stop();
				this.spinnerObj2[this.orderStatus.indexOf('answered')].stop();
				$('#answered1_img').hide();

				break;

			case 'completed':
				this.spinnerObj1[this.orderStatus.indexOf('completed')].stop();
				this.spinnerObj2[this.orderStatus.indexOf('completed')].stop();
				$('#completed1_img').hide();

				break;

			case 'scheduled': 
				this.spinnerObj1[this.orderStatus.indexOf('scheduled')].stop();
				this.spinnerObj2[this.orderStatus.indexOf('scheduled')].stop();
				$('#scheduled1_img').hide();

				break;
				
			case 'pending': 
				this.spinnerObj1[this.orderStatus.indexOf('pending')].stop();
				this.spinnerObj2[this.orderStatus.indexOf('pending')].stop();
				$('#pending1_img').hide();

				break;
				
			case 'waiting': 
				this.spinnerObj1[this.orderStatus.indexOf('waiting')].stop();
				this.spinnerObj2[this.orderStatus.indexOf('waiting')].stop();
				$('#stuck1_img').hide();

				break;

			case 'inqueue':
				this.spinnerObj1[this.orderStatus.indexOf('inqueue')].stop();
				this.spinnerObj2[this.orderStatus.indexOf('inqueue')].stop();
				$('#inqueue1_img').hide();

				break;

			case 'inprogress': 
				this.spinnerObj1[this.orderStatus.indexOf('inprogress')].stop();
				this.spinnerObj2[this.orderStatus.indexOf('inprogress')].stop();
				$('#inprogress1_img').hide();

				break;

			case 'all': 
				this.spinnerObj1[this.spinnerObj1.length-1].stop();
				this.spinnerObj2[this.spinnerObj2.length-1].stop();
				break;
				
			case 'everything':
				this.spinnerObj1[this.orderStatus.indexOf('inprogress')].stop();
				this.spinnerObj2[this.orderStatus.indexOf('inprogress')].stop();
				this.spinnerObj1[this.orderStatus.indexOf('inqueue')].stop();
				this.spinnerObj2[this.orderStatus.indexOf('inqueue')].stop();
				this.spinnerObj1[this.orderStatus.indexOf('scheduled')].stop();
				this.spinnerObj2[this.orderStatus.indexOf('scheduled')].stop();
				this.spinnerObj1[this.orderStatus.indexOf('pending')].stop();
				this.spinnerObj2[this.orderStatus.indexOf('pending')].stop();
				this.spinnerObj1[this.orderStatus.indexOf('waiting')].stop();
				this.spinnerObj2[this.orderStatus.indexOf('waiting')].stop();
				this.spinnerObj1[this.orderStatus.indexOf('completed')].stop();
				this.spinnerObj2[this.orderStatus.indexOf('completed')].stop();
				this.spinnerObj1[this.orderStatus.indexOf('answered')].stop();
				this.spinnerObj2[this.orderStatus.indexOf('answered')].stop();
				this.spinnerObj1[this.spinnerObj1.length-1].stop();
				this.spinnerObj2[this.spinnerObj2.length-1].stop();
				$('#inprogress1_img').hide();
				$('#inqueue1_img').hide();
				$('#completed1_img').hide();
				$('#scheduled1_img').hide();
				$('#pending1_img').hide();
				$('#stuck1_img').hide();
				$('#answered1_img').hide();

				break;

			default : 
				console.info("status ?? really :: "+status)

				break;
			}
		},
		
		showLoading:function(status){
			switch(status)
			{
			case 'answered':
				$("#answered1_img").css('display','none');
				$("#answered2_img").css('display','none');

				break;

			case 'completed':
				$("#completed1_img").css('display','none');
				$("#completed2_img").css('display','none');

				break;

			case 'scheduled': 
				$("#scheduled1_img").css('display','none');
				$("#scheduled2_img").css('display','none');

				break;
				
			case 'pending': 
				$("#pending1_img").css('display','none');
				$("#pending2_img").css('display','none');

				break;
				
			case 'waiting': 
				$("#stuck1_img").css('display','none');
				$("#stuck2_img").css('display','none');

				break;

			case 'inqueue':
				$("#inqueue1_img").css('display','none');
				$("#inqueue2_img").css('display','none');

				break;

			case 'inprogress': 
				$("#inprogress1_img").css('display','none');
				$("#inprogress2_img").css('display','none');

				break;

			case 'all': 
				$("#all1_img").css('display','none');
				$("#all2_img").css('display','none');

				break;

			default : 
				console.info("status ?? really :: "+status)

				break;
			}
		},
		
		displayInteractionByStatus : function(status)
		{		
			switch(status)
			{
				case 'answered':
					
					var answerdList = new Array();
					$.each( dd.answeredmap,function(index,value){
						answerdList.push(value);
						});
					$('#table_data').html(" ");//clearing table before appending the interactions
					currentdata	=	answerdList;
					recreateDataToSort(currentdata,"");
					this.manipulateCounterForStatus('display-')
					appendTable(answerdList);
					
				break;
				
				case 'completed':
					
					var completedList = new Array();
					$.each( dd.completedmap,function(index,value){
						completedList.push(value);
						});
					$('#table_data').html(" ");//clearing table before appending the interactions
					currentdata	=	completedList;
					recreateDataToSort(currentdata,"");
					this.manipulateCounterForStatus('display-')
					appendTable(completedList);
	
				break;
					
				case 'scheduled':
					
					var ScheduledList = new Array();
					$.each( dd.scheduledmap,function(index,value){
						ScheduledList.push(value);
						});
					$('#table_data').html(" ");//clearing table before appending the interactions
					currentdata	=	ScheduledList;
					recreateDataToSort(currentdata,"");
					this.manipulateCounterForStatus('display-')
					appendTable(ScheduledList);
					
				break;
				case 'pending':
					
					var pendingList = new Array();
					$.each( dd.pendingmap,function(index,value){
						pendingList.push(value);
						});
					$('#table_data').html(" ");//clearing table before appending the interactions
					currentdata	=	pendingList;
					recreateDataToSort(currentdata,"");
					this.manipulateCounterForStatus('display-')
					appendTable(pendingList);
					
				break;
					
				case 'stuck':
					
					var inStruckList = new Array();
					$.each( dd.stuckipmap,function(index,value){
						inStruckList.push(value);
						});
					$('#table_data').html(" ");//clearing table before appending the interactions
					currentdata	=	inStruckList;
					recreateDataToSort(currentdata,"");
					this.manipulateCounterForStatus('display-')
					appendTable(inStruckList);
					
				break;
					
				case 'waiting':
					
					var inWaitingList = new Array();
					$.each( dd.waitingmap,function(index,value){
						inWaitingList.push(value);
						});
					$('#table_data').html(" ");//clearing table before appending the interactions
					currentdata	=	inWaitingList;
					recreateDataToSort(currentdata);
					this.manipulateCounterForStatus('display-')
					appendTable(inWaitingList);
					
				break;
				
				
				case 'Rejected(IR)':
					
					var inWaitingList = new Array();
					$.each( dd.waitingmap,function(index,value){
						inWaitingList.push(value);
						});
					$('#table_data').html(" ");//clearing table before appending the interactions
					currentdata	=	inWaitingList;
					recreateDataToSort(currentdata);
					this.manipulateCounterForStatus('display-')
					appendTable(inWaitingList);
					
				break;
				
				
				case 'inqueue':
					
					var inQueueList = new Array();
					$.each( dd.inqueuemap,function(index,value){
						inQueueList.push(value);
						});
					$('#table_data').html(" ");//clearing table before appending the interactions
					currentdata = inQueueList;
					recreateDataToSort(currentdata,"");
					this.manipulateCounterForStatus('display-')
					appendTable(inQueueList);

				break;
					
				case 'inprogress': 
					
					var inProgressList = new Array();
					$.each( dd.inprogressmap,function(index,value){
						inProgressList.push(value);
						});
					$('#table_data').html(" ");//clearing table before appending the interactions
					currentdata	=	inProgressList;
					recreateDataToSort(currentdata,"");
					this.manipulateCounterForStatus('display-')
					appendTable(inProgressList);
					
				break;
				case 'internal': 
					
					var internalList = new Array();
					$.each( dd.internalMap,function(index,value){
						internalList.push(value);
						});
					$('#table_data').html(" ");//clearing table before appending the interactions
					currentdata	=	internalList;
					recreateDataToSort(currentdata,"");
					this.manipulateCounterForStatus('display-')
					appendTable(internalList);
					
				break;
				
				case 'all':
					
					$('#table_data').html(" ");
					
					totalList = new Array();
					$.each( dd.answeredmap,function(index,value){
						totalList.push(value);
						});
					
					$.each( dd.completedmap,function(index,value){
						totalList.push(value);
						});
					
					$.each( dd.scheduledmap,function(index,value){
						totalList.push(value);
						});
					$.each( dd.pendingmap,function(index,value){
						totalList.push(value);
						});
					
					$.each( dd.stuckipmap,function(index,value){
						totalList.push(value);
						});
					
					$.each( dd.inqueuemap,function(index,value){
						totalList.push(value);
						});
					
					$.each( dd.inprogressmap,function(index,value){
						totalList.push(value);
						});
					$.each( dd.waitingmap,function(index,value){
						totalList.push(value);
						});
					currentdata	=	totalList;	
					recreateDataToSort(currentdata,"");
					this.manipulateCounterForStatus('display-')
					appendTable(totalList);
					
				break;
				
				default : console.info("not handling status ::"+status); 
				break;
			}	
			
		},
				//uniqueClientIds should be dd.domainMap.list
		getDomainNameForList	:	function(uniqueClientIds){
			if(uniqueClientIds.length != 0)
			{
				$.ajax({
					type : "POST",
					async: false,
					url :	'/getDomainNamesBasedOnCache' ,
					data : 'reqarray='+JSON.stringify(uniqueClientIds),
					success : function(data) 
					{
						if(data == null)
							return;
						else{
							var localdata = JSON.parse(data);
						$.each(localdata,function(index,value){
							dd.domainMap[index] = value;
						});
						}
					}
				});
			}
		},
		
		getDomainForAccountNumber :	function(accountNo,interactionId){
			if($('#domain_'+interactionId).html() != null && $('#domain_'+interactionId).html() != undefined)
			{
				if(dd.domainMap[accountNo] != null && dd.domainMap[accountNo]!='' && dd.domainMap[accountNo]!= undefined)
				{
					this.insertDNinInteractionsMap(dd.domainMap[accountNo],interactionId);
					clearInterval(dd.domainMap[interactionId]);
					delete dd.domainMap[interactionId];
					var tempDomain=dd.domainMap[accountNo];
				     if(tempDomain.length>30){
				      $('#domain_'+interactionId).attr('data-container','body');
				      $('#domain_'+interactionId).attr('data-toggle','tooltip');
				      $('#domain_'+interactionId).attr('data-placement','top');
				      $('#domain_'+interactionId).attr('data-original-title',tempDomain);
				      $('#domain_'+interactionId).html(tempDomain.substring(0,30)+'...');
				      $("[data-toggle='tooltip']").tooltip();
				     }else{
				      var domain_name = getDisplayDomainName(dd.domainMap[accountNo]);
				      $('#domain_'+interactionId).html(domain_name);      
				     }
				    }
				    else
				    {
				     $('#domain_'+interactionId).html("NA");
				    }
			}
		},
		
		getDomainForAccountNumberCache :	function(accountNo,interactionId){
			if($('#domain_'+interactionId).html() != null && $('#domain_'+interactionId).html() != undefined)
			{
				
				if(dd.domainMap[accountNo] == null || dd.domainMap[accountNo] == undefined || dd.domainMap[accountNo]=="")
				{		
					dd.getDomainNameFromCache(accountNo);
					$('#domain_'+interactionId).html(dd.domainMap[accountNo]);
				}
				else
				{
					$('#domain_'+interactionId).html("Loading ...");
				}
			}
		},
		getDomainNameFromCache :	function(accountNo)
		{
			var url 	=	"http://account-creation.live-cms.appspot.com/services/data/getAccountDetails/"+accountNo;
			$.ajax
			({
				type : "GET",
				url : url,
				async:false,
				success : function(data)
				{
					if(data != "NoData")
						dd.domainMap[accountNo]	  =	  data;
				}
			});
		},
		
		insertDNinInteractionsMap	:	function(domainName,interactionid){
			var status = this.currentStatusmap[interactionid];
			if(status == null || status == undefined)
				return;
			
			switch(status)
			{
				case 'answered':
					this.answeredmap[interactionid].domain = domainName;
				break;
				
				case 'completed':
					this.completedmap[interactionid].domain = domainName;
				break;
					
				case 'scheduled': 
					this.scheduledmap[interactionid].domain = domainName;
				break;
				
				case 'pending': 
					this.pendingmap[interactionid].domain = domainName;
				break;
				
				case 'inqueue':
					this.inqueuemap[interactionid].domain = domainName;
				break;
					
				case 'inprogress': 
					this.inprogressmap[interactionid].domain = domainName;
				break;
				
				case 'waiting':
					this.waitingmap[interactionid].domain = domainName;
				break;
				
				case 'Rejected(IR)':
					this.waitingmap[interactionid].domain = domainName;
				break;
				
				
	
				default : 
					this.extrasmap[interactionid].domain = domainName;
				break;
			}
		}
		
}
var opts = 
{
		lines: 7, // The number of lines to draw
		length: 3, // The length of each line
		width: 3, // The line thickness
		radius: 4, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		direction: 1, // 1: clockwise, -1: counterclockwise
		color: '#000', // #rgb or #rrggbb or array of colors
		speed: 1.4, // Rounds per second
		trail: 41, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 200, // The z-index (defaults to 200)
		top: 'auto', // Top position relative to parent in px
		left: 'auto' // Left position relative to parent in px
}



