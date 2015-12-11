BackboneData.TranscriptModel 		= 		Backbone.Model.extend( {

	url 					: 			'',

	statusColorCode 		: 			{
											inqueue 				: 			'#466bcc',
											completed 				: 			'#72ab44',
											callended 				: 			'#72ab44',
											closed 					:  			'#72ab44',
											dialout					:  			'#72ab44',
										},

	idAttribute				: 			'interactionId',

    initialize 				: 			function ( models, options ) {
									    },

	parse					: 			function( response, xhr ) {
											return response;
										},

	sync 					: 			function( method, model, options ) {
											return Backbone.sync( method, model, options );
										},

	getMessageObject 		: 			function() {
											var self = this;
											var messageObject = self.get( 'messageObject' );
											if( ! messageObject ) {
												var decodedMessages = decodeURIComponent(self.get( 'messages' ));
												 if(!!!decodedMessages)
												 {
													 self.set( 'messageObject', {} );
													 return {};
												 } 
												var jdoObject = JSON.parse(decodedMessages);
												if(self.get('interactionType') == 'SBChat')
													messageObject  =  self.getChatMessageToJson(jdoObject);
												else	
												    messageObject  =  self.getMessageToJson( jdoObject );
												self.set( 'messageObject', messageObject );
											}
											return messageObject;
										},

	getRecievedTime 		: 			function() {
											var self = this;
											var recievedTime = self.getTimeOfStatus( 'Answered');
											 if( ! recievedTime )								   //flow modify
												recievedTime = self.getTimeOfStatus( 'InQueue(IR)');
											 if( ! recievedTime )								   
													recievedTime = self.getTimeOfStatus( 'Scheduled');
											 if( ! recievedTime )								   
													recievedTime = self.getTimeOfStatus('queued');
											 
											self.set( 'recievedTime', recievedTime );
											return recievedTime;
										},

	getCompletedTime 		: 			function() {
											var self = this;
											var completedTime = self.getTimeOfStatus( 'Completed' );
											if( ! completedTime ) 
												completedTime = self.getTimeOfStatus( 'Callended' );
											if( ! completedTime ) 
												completedTime = self.getTimeOfStatus( 'Dialout' );
											if( ! completedTime ) 
												completedTime = self.getTimeOfStatus( 'closed' );
											self.set( 'completedTime', completedTime );
											return completedTime;
										},

	getWaitingTime 			: 			function() {
											var self = this;
											var waitingTime = self.getTimeOfStatus( 'InQueue' );
											if( waitingTime ) {
												return waitingTime;
											}
											var waitingTime = self.getTimeOfStatus( 'answered' );
											if( waitingTime ) {
												return waitingTime;
											}
											else {
												waitingTime = self.getTimeOfStatus( 'Waiting' );
												self.set( 'waitingTime', waitingTime );
												if( waitingTime )
													return waitingTime;
												else
													return undefined;
											}
										},

	getTimeTakenToAnswer 	: 			function( isGetMilliseconds ) {
											var self = this;
											var recievedTime = self.getRecievedTime();
											if( recievedTime ) {
												self.set( 'timeTakenToAnswer', self.dateDifference( self.getWaitingTime(), recievedTime, true /* GetMilliseconds */ ) );
												if( self.getWaitingTime() < recievedTime )
													return self.dateDifference( self.getWaitingTime(), recievedTime, isGetMilliseconds ); 			// TimeTakenToAnswer
												else
													return self.dateDifference( recievedTime, self.getWaitingTime(), isGetMilliseconds ); 			// TimeTakenToAnswer
											} else {
												return 'NA';
											}
										},

	getTimeTakenToComplete 	: 			function( isGetMilliseconds ) {
											var self = this;
											var completedTime = self.getCompletedTime();
											var answeredTime =  self.getRecievedTime(); 
											if(self.get('interactionType') == 'SBChat')        //All Timing Logic  has to be modified  
												answeredTime =  self.getTimeOfStatus('answered');
											if( answeredTime && completedTime ) {
												self.set( 'timeTakenToComplete', self.dateDifference( answeredTime, completedTime, true /* GetMilliseconds */ ) );
												return self.dateDifference( answeredTime, completedTime, isGetMilliseconds );
											//} else if( waitingTime ) {
											//	return self.dateDifference( waitingTime, new Date(), isGetMilliseconds );
											} else {
												return 'NA';
											}
										},

	getDuration 			: 			function( isGetMilliseconds ) {
											var self = this;
											/*
											var waitingTime = self.getWaitingTime();
											var completedTime = self.getCompletedTime();
											if( waitingTime && completedTime ) {
												self.set( 'duration', self.dateDifference( waitingTime, completedTime, true /* GetMilliseconds */ // ) ); 
												/*
												return self.dateDifference( waitingTime, completedTime, isGetMilliseconds );			// TimeTakenToComplete
											} else if( waitingTime ) {
												return self.dateDifference( waitingTime, new Date(), isGetMilliseconds );			// TimeTakenToComplete
											} else {
												return 'NA';
											}
											*/
											self.set( 'duration', getTimeSpent( self.toJSON(), true /* isReturnMilliseconds */ ) ); 
											var duration = getTimeSpent( self.toJSON(), isGetMilliseconds /* isReturnMilliseconds */ );
											return duration;
										},

	getStatusColor 			: 			function() {
											var self = this;
											var colorCode = '#000000';
											for( var status in self.statusColorCode ) {
												if( self.get( 'action' ).toLowerCase().indexOf( status ) != -1 ) {
													colorCode = self.statusColorCode[ status ];
												}
											}
											return colorCode;
										},

	getTimeOfStatus 		: 			function( status ) {
											var self = this;
											var interactionType = self.get('interactionType'); 
											var timeInMilliSeconds = undefined;
											var interactionHistory = self.get( 'interactionHistory' )
											for( var index in interactionHistory ) {
												if(interactionType == 'SBChat')
												{
													if( interactionHistory[ index ].action == status)
														timeInMilliSeconds = interactionHistory[ index ].date;
												}
												else if( interactionHistory[ index ].action.indexOf( status ) != -1 ) 
												{
													timeInMilliSeconds = interactionHistory[ index ].date;
												}
											}
											return timeInMilliSeconds;
										},

	getTimeString 			: 			function( dateInMilliSeconds ) {
											var self = this;
											if( dateInMilliSeconds && dateInMilliSeconds != 'NA' ) {
												return moment( dateInMilliSeconds ).format( 'D MMM YY HH:mm:ss' );
											} else {
												return 'NA';
											}
										},

	dateDifference 			: 			function( fromDateInMilliSeconds, toDateInMilliSeconds, isGetMilliseconds ) {
											if(!!!fromDateInMilliSeconds || !!!toDateInMilliSeconds)
												return 'NA';
											var differenceInMilliSeconds = moment( toDateInMilliSeconds ).diff( fromDateInMilliSeconds );
											var duration = moment.duration( differenceInMilliSeconds );
											if( isGetMilliseconds )
												return duration.asMilliseconds();
											var differenceString = Math.floor( duration.asHours() ) + moment.utc( differenceInMilliSeconds ).format( ":mm:ss" );
											return differenceString;
										},

	offsetconversion        :           function( dbdate ) {
											var self = this;
											if(dbdate && isNaN(dbdate))
												dbdate =  dbdate.replace(/-/g,"/");
                                            var date = new Date(dbdate);
                                            var datemill    =   date.getTime();
                                            var pdtoffset   =   "";
                                            if(timezone == "PST")
                                                pdtoffset   =   480;
                                            else
                                                pdtoffset   =   420;
                                            dateoffset  =   date.getTimezoneOffset();
                                            if(dateoffset<0)
                                                {
                                                    dateoffset  =   -(dateoffset);
                                                    pdtoffset   =   pdtoffset+dateoffset;
                                                    var pdfoffsetmilli  =   pdtoffset   * 60000;
                                                    pdfoffsetmilli  =   datemill    -   pdfoffsetmilli;
                                                    return pdfoffsetmilli;
                                                }
                                            else if(dateoffset>0)
                                                {
                                                    pdtoffset   =   pdtoffset - dateoffset;
                                                    var pdfoffsetmilli  =   pdtoffset   * 60000;
                                                    pdfoffsetmilli  =   datemill    -   pdfoffsetmilli;
                                                    return pdfoffsetmilli;
                                                }
                                            else if(dateoffset == 0)
                                                {
                                                    var pdfoffsetmilli  =   pdtoffset   * 60000;
                                                    pdfoffsetmilli  =   datemill    -   pdfoffsetmilli;
                                                    return pdfoffsetmilli;
                                                    
                                                }
                                        },

    getConnectionIds 		: 			function() {
    										var self = this;
    										var interactionHistory = self.get( 'interactionHistory' )
											for( var index in interactionHistory ) {
												if( interactionHistory[ index ].id != -1 ) {
													timeInMilliSeconds = interactionHistory[ index ].date;
												}
											}
    									},
    getMessageToJson       :			function(jdoObject){ //flow modify
    										var messageObject = {};
    										for(var index in jdoObject){
    											var key = index ; //jdoObject[index].title;
    											var value = jdoObject[index].replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'");//jdoObject[index].value.replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'");
    											try
    											{
    												var decodedValue =	decodeURIComponent(value);
    												
    											}
    											catch(e)
    											{
    												var decodedValue = decodeURIComponent(escape(value));
    											}
    											
    										   
    											decodedValue       =  decodedValue.split('+').join(' ');
    											decodedValue	   =	decodedValue.split('%26').join('&');
    											decodedValue	   =	escapeBackHtml(decodedValue);
    											messageObject[key] = decodedValue ;
    										}
                                            
											if(messageObject.hasOwnProperty("entityType") && !!messageObject['entityType'] && !!messageObject['uniquepin'])
												messageObject['uniquepin']	=	"https://my.distributedsource.com/crm#"+messageObject['entityType']+"/"+messageObject['uniquepin'];
											else if(messageObject.hasOwnProperty("uniquepin"))
												messageObject['uniquepin']	=	"https://my.distributedsource.com/crm#lead/"+messageObject['uniquepin'];
											
											if(messageObject.hasOwnProperty("CC") && !messageObject["CC"]){
												delete messageObject["CC"];
											}else if(messageObject.hasOwnProperty("CC")){
												messageObject["CC"] = escapeTag(messageObject["CC"]);
											}
    										return messageObject;
    									},
   getChatMessageToJson    :			function(chatObject){
	   
	   											var chatMessages = new Array();
	   											var self = this;
	   											var chatFormData = [];
	   											var chatMessageData = {};
	   											var chatMessageObject = [];
	   											var chatFeedBackAry = [];
	   											var chatFeedBack = self.get('feedback');
	   											var chatDate;
	   											try
	   											{
	   												if(!!chatFeedBack)
	   													{
	   													  chatFeedBack = JSON.parse(chatFeedBack);
	   													}
	   												
	   											
                                                for(var key in chatObject)
                                                {
                                                	chatMessageObject = chatMessageObject.concat([{chat:"------ "+ key + " ------" ,time: "",user: ""}]);
                                                	var singleConnectionChat = JSON.parse(chatObject[key]);
                                                	chatMessageObject = chatMessageObject.concat(singleConnectionChat);
                                                	
                                                	if(!!chatFeedBack && !!chatFeedBack[key] && chatFeedBack[key].toLowerCase() != 'na')
                                            		{
                                                		singleFeedBackObject = JSON.parse(chatFeedBack[key]);
                                                		chatFeedBackAry =  [];
                                                		chatDate = "";
                                                		for(feedbackKey in singleFeedBackObject)
                                            			{
                                            			  if(feedbackKey != 'date')
                                            				  chatFeedBackAry.push({key :feedbackKey , value: singleFeedBackObject[feedbackKey]});
                                            			  else
                                            				  chatDate = singleFeedBackObject[feedbackKey];
                                            			}
                                                		chatMessageObject.push({user: 'feedback',chat: chatFeedBackAry, time: chatDate })
                                            		}
                                                }
                                                
	                                            for( i=0 ; i < chatMessageObject.length ; i++)
                                            	{
	                                               var messageObject = {};
	                                               singleChatObject	 = chatMessageObject[i];  
												   for(var index in singleChatObject){
														var key = index ; 
														if(typeof singleChatObject[index] == 'string' || typeof singleChatObject[index] == 'number')
														{
															if(typeof singleChatObject[index] == 'number' && key == 'time' )
															{
																decodedValue = self.getTimeString(self.offsetconversion(singleChatObject[index]) - new Date().getTimezoneOffset() * 60 * 1000 );
																messageObject[key] = decodedValue ;
																continue;
															}
															var value = singleChatObject[index].replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'");//jdoObject[index].value.replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'");
															try
															{
																var decodedValue =	decodeURIComponent(value);
															}
															catch(e)
															{
																var decodedValue = decodeURIComponent(escape(value));
															}
															
															decodedValue       =  decodedValue.split('+').join(' ');
															decodedValue	   =	decodedValue.split('%26').join('&');
															decodedValue	   =	escapeBackHtml(decodedValue);
															if(key == 'time' && singleChatObject['time'])
																decodedValue = self.getTimeString(self.offsetconversion(decodedValue) - new Date().getTimezoneOffset() * 60 * 1000 );
															if(key == 'chat' && singleChatObject[key].indexOf('Visitor navigated to') == -1)
																decodeValue = escapeTag(decodedValue);
															messageObject[key] = decodedValue ;
														}
														else
														{
															messageObject[key] = singleChatObject[key] ;
														}
													}
												   chatFormData = [];
												   if((messageObject.user == 'Prechatsurvey' || messageObject.user == 'Offlineform') )
													{
													   if(messageObject.chat.constructor == String)
														   messageObject.chat = JSON.parse(messageObject.chat);
														for(var key  in messageObject.chat)
														{
															chatFormData.push({key : key , value: messageObject.chat[key]});
															if(key.toLowerCase() == 'name')
																chatMessageData.gustName = messageObject.chat[key];
															else if(key.toLowerCase() == 'email')
																chatMessageData.gustEmail = messageObject.chat[key];
														}
														messageObject.chat = chatFormData;
														chatMessages.push(messageObject);
													}
												   else
													   chatMessages.push(messageObject);
                                            	}
	   										}
	   										catch(exception)
	   										{
	   											console.log(exception);
	   										}
	   										chatMessageData.chatMessages = chatMessages;
	   										return chatMessageData;
   										},							
} );
