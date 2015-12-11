BackboneData.TranscriptCollection      =       Backbone.Collection.extend( {

    fetchUrl                    :               '/getAllArInteractionsNew', // /getInteractionsForReport',

    cacheFlag                   :               true,

    internalFlag                :               [ false ],

    model                       :               BackboneData.TranscriptModel,

    completedStatuses           :               [ 'noCache', /* 'completed', 'completed-resolved', 'completed-f8', 'closed-chat', 'callended', 'dialout' , 'completed-tabclose' */ ],

    inqueueStatuses             :               [ /* 'inqueue' */ ],

    fetchedTranscripts          :               {},

    fetchedTranscriptsTemp      :               {},

    sortKey                     :               'date',

    sortOrder                   :               'asc',

    meanDuration                :               null,

    status                      :               function() { var self = this; return self.completedStatuses.concat( self.inqueueStatuses ); },

    initialize                  :               function( models, options ) {
                                                    var self = this;
                                                    self.options = options;
                                                    self.cacheFlag = true;
                                                    self.status = self.status();
                                                },

    sync                        :               function( method, model, options ) {
                                                    var self = this;
                                                    options = options || {};
                                                    switch( method ) {
                                                        case 'read' :
                                                            options.url = self.fetchUrl + '/' + options.startDate + '/' + options.endDate + '/' + options.cursor + '/' + self.status[ 0 ] + '/' + self.cacheFlag + '?' + 'internal=' + options.internalFlag + '&accNo=' + options.subAccountNumber;
                                                            break;
                                                    }
                                                    return Backbone.sync( method, model, options ); 
                                                },

    fetchTranscripts            :               function( options ) {
                                                    var self = options.self;
                                                    var deferred = new $.Deferred();
                                                    var successCallBack = null;
                                                    var failureCallBack = null;
                                                    var operationsToPerform = [];
                                                    var transcriptsToResolveWith = [];
                                                    options = options || {};
                                                    options.url = options.url || self.fetchUrl;
                                                    /*
                                                    gmtStartDate = moment( self.offsetconversion( self.toGMT( new Date( options.startDate ) ) ) ).format( 'MM-DD-YYYY' );
                                                    gmtEndDate = moment( self.offsetconversion( self.toGMT( new Date( options.endDate ) ) ) ).format( 'MM-DD-YYYY' );
                                                    */
                                                    gmtStartDate = moment( new Date( options.startDate.replace(/-/g,"/") ) ).format( 'MM-DD-YYYY' );
                                                    gmtEndDate = moment( new Date( options.endDate.replace(/-/g,"/") ) ).format( 'MM-DD-YYYY' );
                                                    
                                                    var subAccountNumberArraySplitted = self.splitSubAccountNumberArrayToMakeServerCall( options.subAccountNumberArray );
                                                    for( var index in subAccountNumberArraySplitted ) {
                                                        var subAccountNumberArray = subAccountNumberArraySplitted[ index ];
                                                        options.url = self.fetchUrl + '/' + gmtStartDate + '/' + gmtEndDate + '/' + self.generateUniqueId() /* cursor */ + '/' + options.status + '/' + self.cacheFlag + '?' + 'internal=' + options.internalFlag + '&accNo=' + JSON.stringify( subAccountNumberArray );
                                                        var ajaxDeferred = $.ajax( { url: options.url, type: 'post' } );
                                                        ajaxDeferred
                                                            .done( function( data ) { transcriptsToResolveWith = transcriptsToResolveWith.concat( self.parse( data ) ); } );
                                                        operationsToPerform.push( ajaxDeferred );
                                                    }
                                                    $.when.apply( $, operationsToPerform )
                                                        .done( function( data ) { deferred.resolve( transcriptsToResolveWith ); } )
                                                            .fail( function() { var rejectObject = { error: { message: 'Failed to fetch the transcripts. URL: ' + options.url } }; deferred.reject( rejectObject ); console.error( rejectObject.error.message ); } );
                                                    this.done = function( callBackArg ) { successCallBack = callBackArg; };
                                                    this.fail = function( callBackArg ) { failureCallBack = callBackArg; };
                                                    deferred
                                                        .done( function( data ) { if( successCallBack ) successCallBack( data, options ); } )
                                                            .fail( function( data ) { if( failureCallBack ) failureCallBack( data, options ); } );
                                                },

    fetchTranscriptsFullHistory     :           function( options ) {
                                                    var self = options.self;
                                                    var deferred = new $.Deferred();
                                                    var successCallBack = null;
                                                    var failureCallBack = null;
                                                    var operationsToPerform = [];
                                                    var loadDateDifference = null;
                                                    options = options || {};
                                                    options.url = options.url || self.fetchUrl;
                                                    /*
                                                    gmtStartDate = moment( self.offsetconversion( self.toGMT( new Date( options.startDate ) ) ) ).format( 'MM-DD-YYYY' );
                                                    gmtEndDate = moment( self.offsetconversion( self.toGMT( new Date( options.endDate ) ) ) ).format( 'MM-DD-YYYY' );
                                                    */
                                                    gmtStartDate = moment( new Date( options.startDate.replace(/-/g,"/") ) ).format( 'MM-DD-YYYY' );
                                                    gmtEndDate = moment( new Date( options.endDate.replace(/-/g,"/") ) ).format( 'MM-DD-YYYY' );
                                                    
                                                    loadDateDifference =new Date( options.endDate.replace(/-/g,"/") ) - new Date(options.startDate.replace(/-/g,"/"));
                                                    if(loadDateDifference != 0)
                                                    	loadDateDifference = loadDateDifference/(1000*60*60*24);
                                                    //flow modify
                                                    var subAccountNumberArraySplitted = self.splitSubAccountNumberArrayToMakeServerCall( options.subAccountNumberArray );
                                                    for( var index in subAccountNumberArraySplitted) {
                                                    	
                                                    	 var subAccountNumberArray = subAccountNumberArraySplitted[ index ];
                                                         var optionsTemp = $.extend( {}, options );
                                                         var startDateMilli = new Date(options.startDate.replace(/-/g,"/")).getTime();
                                                         optionsTemp.subAccountNumberArray = subAccountNumberArray;                                                    
                                                         for(var i=0 ; i <= loadDateDifference; i++ ){
                                                                 
                                                        	 optionsTemp.startDate  = moment(new Date (startDateMilli + i*1000*60*60*24)).format( 'MM-DD-YYYY' );
                                                             optionsTemp.endDate = optionsTemp.startDate;
															 var deferredForFetchingSubAccountNumbers = new self.fetchTranscriptsForAccountNumbers( optionsTemp );
                                                             operationsToPerform.push( deferredForFetchingSubAccountNumbers );

                                                         } 
                                                    	
                                                    }
                                                    $.when.apply( $, operationsToPerform )
                                                        .done( function( data ) { self.addToFetchedTranscripts( options.subAccountNumberArray, options.startDate, options.endDate ); self.setNewDateForFetchedHistory( options.subAccountNumber, options.startDate, options.endDate ); deferred.resolve(); } )
                                                            .fail( function() { var rejectObject = { error: { message: 'Failed to fetch the transcripts. URL: ' + options.url } }; deferred.reject( rejectObject ); console.error( rejectObject.error.message ); } );
                                                    return deferred;
                                                },

    fetchTranscriptsForAccountNumbers:          function( options ) {
                                                    var self = options.self;
                                                    var deferred = new $.Deferred();
                                                    var onSuccessOfFetchTranscripts =   function( data ) { //flow modify
                                                                                            if( data.hasOwnProperty("nextCursor") && data.nextCursor ) {
                                                                                            	
                                                                                                if( data.nextCursor != 'no-overflow-here' ) { 
                                                                                                    var optionsTemp = $.extend( {}, options );
                                                                                                    optionsTemp.startDate = data.startDate;
                                                                                                    optionsTemp.endDate = data.nextCursor;
                                                                                                    optionsTemp.status  = data.cacheCursor;
                                                                                                    self.fetchTranscriptsForAccountNumbersCore( optionsTemp )
                                                                                                        .done( function( data ) { onSuccessOfFetchTranscripts( data ); } )
                                                                                                            .fail( function( data ) { deferred.reject( data ); } )
                                                                                                } else {
                                                                                                    deferred.resolve();
                                                                                                }
                                                                                            } else {
                                                                                                deferred.resolve();
                                                                                            }
                                                                                        };
                                                    self.fetchTranscriptsForAccountNumbersCore( options )
                                                        .done( function( data ) { onSuccessOfFetchTranscripts( data ); } )
                                                            .fail( function( data ) { deferred.reject( data ); } );
                                                    return deferred;
                                                },

    fetchTranscriptsForAccountNumbersCore:      function( options ) {
                                                    var self = this;
                                                    var deferred = $.Deferred();
                                                    var startDate = options.startDate;
                                                    var gmtStartDate = moment( new Date( options.startDate.replace(/-/g,"/") ) ).format( 'MM-DD-YYYY' );
                                                    if( ! window.isNaN( new Date( options.endDate.replace(/-/g,"/") ) ) )
                                                        var gmtEndDate = moment( new Date( options.endDate.replace(/-/g,"/") ) ).format( 'MM-DD-YYYY' );
                                                    else
                                                        var gmtEndDate = options.endDate;
                                                    options.url = self.fetchUrl + '/' + gmtStartDate + '/' + gmtEndDate + '/' + self.generateUniqueId() /* cursor */ + '/' + options.status + '/' + self.cacheFlag + '?' + 'internal=' + options.internalFlag + '&accNo=' + JSON.stringify( options.subAccountNumberArray );
                                                    $.ajax( { url: options.url, type: 'post' } )
                                                        .done( function( data ) { var parsedData = self.parseFullHistoryResponse( data , gmtStartDate); parsedData.startDate = startDate; self.add( parsedData.response ); deferred.resolve( parsedData ); } )
                                                            .fail( function( data ) { deferred.reject( data ); } );
                                                    return deferred;
                                                },

    parse                       :               function( response, xhr ) {
                                                    var returnResponse = [];
                                                    var returnNextCursor = undefined;
                                                    if( ( typeof( response ) == 'string' ) && response != '' ) {
                                                        if( response != 'no data for this time range' ) {
                                                            var splittedResponse = JSON.parse(response);
                                                        response = splittedResponse.ResultMap;
                                         //             response = JSON.parse( response );
                                                            returnNextCursor = splittedResponse.datefornextquery;
                                                        if( typeof( response ) == 'string' )
                                                            response = JSON.parse( response );
                                                        } else {
                                                            response = [];
                                                        }
                                                    }
                                                    $.each( response, function( key, value ) {
                                                        var transcriptsObjects = response[ key ];
                                                        $.each( transcriptsObjects, function( key, value ) {
                                                            returnResponse.push( value );
                                                        } );
                                                    } );
                                                    return returnResponse;
                                                },

    parseFullHistoryResponse    :               function( response, gmtStartDate ) {
    												var self = this;
                                                    var returnResponse = [];
                                                    var singleHistoryStatus  = null;      
                                                    var returnNextCursor = undefined;
                                                    var fetchDate = self.pdtToGMT(new Date(gmtStartDate.replace(/-/g,"/")).getTime());
                                                    var cacheCursor = "noCache";
                                                    if( ( typeof( response ) == 'string' ) && response != '' ) {
                                                        if( response != 'no data for this time range' ) {
                                                            var splittedResponse = JSON.parse(response);
                                                            response = splittedResponse.ResultMap;
                                                            cacheCursor = splittedResponse.cacheCursor;
                                          //                response = JSON.parse( response );
                                                            returnNextCursor = splittedResponse.datefornextquery;
                                                            if( response !== "query again" && typeof( response ) == 'string' ) //flow modify
                                                                response = JSON.parse( response );
                                                        } else {
                                                            response = [];
                                                        }
                                                    }
                                                    if(response !== "query again")
                                                    {
                                                    	$.each( response, function( key, interaction ) {
                                                			interaction.fetchDate = fetchDate;
//                                                			 if(interaction.AgentLogin){interaction.AgentLogin = interaction.AgentLogin.toLowerCase();}
//                                                    		    if(interaction.interactionType === 'SBChat' &&  (interaction.AgentLogin == 'visitor' || interaction.AgentLogin =='system' || interaction.AgentLogin == 'na'))
//                                                    		    {
//                                                    		    	for(i = interaction.interactionHistory.length-1  ; i >= 0 ; i--)	
//                                                    		    	{
//                                                    		    	  singleHistoryStatus = interaction.interactionHistory[i];
//                                                    		    	  if(!!singleHistoryStatus.AgentLogin &&  singleHistoryStatus.AgentLogin != 'visitor' && singleHistoryStatus.AgentLogin != 'NA' && singleHistoryStatus.AgentLogin != 'null' )
//                                                    		    	  {
//                                                    		    		  interaction.AgentLogin = singleHistoryStatus.AgentLogin;
//                                                    		    		  break;
//                                                    		    	  }
//                                                    		    	}
//                                                    		    	
//                                                    		    }
                                                    			returnResponse.push( interaction );
                                                    		} );
                                                    }
                                                    return { response: returnResponse, nextCursor: returnNextCursor, cacheCursor : cacheCursor };
                                                },

    isFetched                   :               function( subAccountNumber, fromDate, toDate ) {
                                                    var self = this;
                                                    var returnObject = { mustHitServer: true, subAccountNumber: subAccountNumber, fromDate: fromDate, toDate: toDate };
                                                    var askedFromDate = new Date( fromDate );
                                                    var askedToDate = new Date( toDate );
                                                    if( self.fetchedTranscripts[ subAccountNumber ] ) {
                                                        var availableFromDate = new Date( self.fetchedTranscripts[ subAccountNumber ].fromDate );
                                                        var availableToDate = new Date( self.fetchedTranscripts[ subAccountNumber ].toDate );
                                                        if( askedFromDate >= availableFromDate && askedFromDate <= availableToDate ) {
                                                            var newFromDate = availableToDate.setDate( availableToDate.getDate() + 1 );
                                                            returnObject.fromDate = moment( newFromDate ).format( 'MM-DD-YYYY' );
                                                            if( askedToDate >= availableFromDate && askedToDate <= availableToDate ) { returnObject.mustHitServer = false; }
                                                        }
                                                        if( askedToDate >= availableFromDate && askedToDate <= availableToDate ) {
                                                            var newToDate = availableToDate.setDate( availableToDate.getDate() - 1 );
                                                            returnObject.toDate = moment( newToDate ).format( 'MM-DD-YYYY' );
                                                            if( askedFromDate >= availableFromDate && askedFromDate <= availableToDate ) { returnObject.mustHitServer = false; }
                                                        }
                                                        returnObject = !returnObject.mustHitServer ? { mustHitServer: false } : returnObject;
                                                    }
                                                    return returnObject;
                                                },

    setNewDateForFetchedHistory :               function( subAccountNumber, fromDate, toDate ) {
                                                    var self = this;
                                                    if( self.fetchedTranscripts[ subAccountNumber ] ) {
                                                        var oldAvailableFromDate = new Date( self.fetchedTranscripts[ subAccountNumber ].fromDate );
                                                        var oldAvailableToDate = new Date( self.fetchedTranscripts[ subAccountNumber ].toDate );
                                                        var newFromDate = new Date( fromDate );
                                                        var newToDate = new Date( toDate );
                                                        if( newFromDate < oldAvailableFromDate ) {
                                                            self.fetchedTranscripts[ subAccountNumber ].fromDate = fromDate
                                                        }
                                                        if( newToDate > oldAvailableToDate ) {
                                                            self.fetchedTranscripts[ subAccountNumber ].fromDate = toDate;
                                                        }
                                                        return true;
                                                    } else {
                                                        self.fetchedTranscripts[ subAccountNumber ] = { fromDate: fromDate, toDate: toDate }
                                                    }
                                                },

    getTranscriptsFullHistoryCore:              function( subAccountNumberArray, status, startDate, endDate, cacheFlag, internalFlag, options ) {
                                                    var self = this;
                                                    // var isFetchedResult = self.isFetched( subAccountNumber, startDate, endDate );
                                                    var deferredToReturn = new $.Deferred();
                                                    options = options || { self: self, subAccountNumberArray: subAccountNumberArray, status: status, startDate: startDate, endDate: endDate, cacheFlag: cacheFlag, internalFlag: internalFlag };
                                                    fetchTranscriptsDeferred = new self.fetchTranscripts( options );
                                                    fetchTranscriptsDeferred.done( function( data, options ) { self.addToFetchedTranscripts( options.subAccountNumberArray, options.startDate, options.endDate ); self.setNewDateForFetchedHistory( options.subAccountNumber, options.startDate, options.endDate ); self.add( data ); deferredToReturn.resolve( data ); } )
                                                    fetchTranscriptsDeferred.fail( function( data, options ) { deferredToReturn.reject( data, options ); } );
                                                    return deferredToReturn;
                                                },

    getTranscriptsFullHistory   :               function( subAccountNumberArray, startDate, endDate ) {
                                                    var self = this;
                                                    var deferred = $.Deferred();
                                                    var subAccountNumberArrayToFetchFromServer =  self.checkInFetchedTranscripts( subAccountNumberArray, startDate, endDate );
                                                    if( subAccountNumberArrayToFetchFromServer.length <= 0 ) { // if( ! isFetchedResult.mustHitServer ) {
                                                        var filteredTranscripts = new BackboneData.TranscriptCollection( self.filterTranscripts( subAccountNumberArray, startDate, endDate ), self.options );
                                                        deferred.resolve( filteredTranscripts );
                                                    } else {
                                                        var operationsToPerform = [];
                                                        for( var indexForStatus in self.status ) {
                                                            var options = options || { self: self, subAccountNumberArray: subAccountNumberArray, status: self.status[ indexForStatus ], startDate: startDate, endDate: endDate, cacheFlag: self.cacheFlag, internalFlag: self.internalFlag[ 0 ] };
                                                            var getTranscriptsCoreDeferred = self.fetchTranscriptsFullHistory( options );
                                                            // getTranscriptsCoreDeferred.done( function( data ) { console.error( 'Done - ', data ); } );
                                                            operationsToPerform.push( getTranscriptsCoreDeferred );
                                                        }
                                                        $.when.apply( $, operationsToPerform )
                                                            .done( function( data ) { var filteredTranscripts = new BackboneData.TranscriptCollection( self.filterTranscripts( subAccountNumberArray, startDate, endDate ), self.options ); deferred.resolve( filteredTranscripts ); } )
                                                                .fail( function() { deferred.reject(); } );
                                                    }
                                                    // }
                                                    return deferred;
                                                },

    getTranscripts              :               function( subAccountNumberArray, startDate, endDate ) {
                                                    var self = this;
                                                    var deferred = $.Deferred();
                                                    // for( var indexForSubAccountNumber in subAccountNumberArray ) {
                                                    var subAccountNumberArrayToFetchFromServer =  self.checkInFetchedTranscripts( subAccountNumberArray, startDate, endDate );
                                                    if( subAccountNumberArrayToFetchFromServer.length <= 0 ) { // if( ! isFetchedResult.mustHitServer ) {
                                                        var filteredTranscripts = new BackboneData.TranscriptCollection( self.filterTranscripts( subAccountNumberArray, startDate, endDate ), self.options );
                                                        deferred.resolve( filteredTranscripts );
                                                    } else {
                                                        var operationsToPerform = [];
                                                        for( var indexForStatus in self.status ) {
                                                            var getTranscriptsCoreDeferred = self.getTranscriptsCore( subAccountNumberArray, self.status[ indexForStatus ], startDate, endDate, self.cacheFlag, self.internalFlag[ 0 ] );
                                                            // getTranscriptsCoreDeferred.done( function( data ) { console.error( 'Done - ', data ); } );
                                                            operationsToPerform.push( getTranscriptsCoreDeferred );
                                                        }
                                                        $.when.apply( $, operationsToPerform )
                                                            .done( function( data ) { var filteredTranscripts = new BackboneData.TranscriptCollection( self.filterTranscripts( subAccountNumberArray, startDate, endDate ), self.options ); deferred.resolve( filteredTranscripts ); } )
                                                                .fail( function() { deferred.reject(); } );
                                                    }
                                                    // }
                                                    return deferred;
                                                },

    getTranscriptsCore          :               function( subAccountNumberArray, status, startDate, endDate, cacheFlag, internalFlag, options ) {
                                                    var self = this;
                                                    // var isFetchedResult = self.isFetched( subAccountNumber, startDate, endDate );
                                                    var deferredToReturn = new $.Deferred();
                                                    options = options || { self: self, subAccountNumberArray: subAccountNumberArray, status: status, startDate: startDate, endDate: endDate, cacheFlag: cacheFlag, internalFlag: internalFlag };
                                                    fetchTranscriptsDeferred = new self.fetchTranscripts( options );
                                                    fetchTranscriptsDeferred.done( function( data, options ) { self.addToFetchedTranscripts( options.subAccountNumberArray, options.startDate, options.endDate ); self.setNewDateForFetchedHistory( options.subAccountNumber, options.startDate, options.endDate ); self.add( data ); deferredToReturn.resolve( data ); } )
                                                    fetchTranscriptsDeferred.fail( function( data, options ) { deferredToReturn.reject( data, options ); } );
                                                    return deferredToReturn;
                                                },

    checkInFetchedTranscripts   :               function( subAccountNumberArray, fromDate, toDate ) {
                                                    var self = this;
                                                    var subAccountNumberArrayToFetchFromServer = [];
                                                    for( var index in subAccountNumberArray ) {
                                                        if( !( self.fetchedTranscriptsTemp[ subAccountNumberArray[ index ] ] && self.fetchedTranscriptsTemp[ subAccountNumberArray[ index ] ].indexOf( JSON.stringify( { fromDate: fromDate, toDate: toDate } ) ) != -1 ) ) {
                                                            subAccountNumberArrayToFetchFromServer.push( subAccountNumberArray[ index ] );
                                                        }
                                                    }
                                                    return subAccountNumberArrayToFetchFromServer;
                                                },

    addToFetchedTranscripts     :               function( subAccountNumberArray, fromDate, toDate ) { //flow modify
                                                    var self = this;
                                                    
                                                    var loadDateDifference =new Date( toDate.replace(/-/g,"/") ) - new Date( fromDate.replace(/-/g,"/") );
                                                    if(loadDateDifference != 0)
                                                    	loadDateDifference = loadDateDifference/(1000*60*60*24);
                                                    
                                                    for( var index in subAccountNumberArray ) {
                                                        self.fetchedTranscriptsTemp[ subAccountNumberArray[ index ] ] = self.fetchedTranscriptsTemp[ subAccountNumberArray[ index ] ] || [];
	                                                        for(var i=0 ; i <= loadDateDifference; i++ ){
	                                                        	
	                                                        	for(j=i; j<=loadDateDifference; j++){ //flow modify avoid fetching the retrieved data 
	                                                        		
	                                                        		var fromDateTempMilli = new Date(fromDate.replace(/-/g,"/")).getTime();
		                                                        	var fromDateTemp = moment( new Date(fromDateTempMilli + (i * 1000*60*60*24)) ).format( 'MM-DD-YYYY' );
		                                                        	var toDateTemp = moment( new Date(fromDateTempMilli + (j * 1000*60*60*24)) ).format( 'MM-DD-YYYY' );
		                                                        	var jsonStringToPush = JSON.stringify( { fromDate: fromDateTemp, toDate: toDateTemp } );
		                                                        	if( self.fetchedTranscriptsTemp[ subAccountNumberArray[ index ] ].indexOf( jsonStringToPush ) == -1 ) {
			                                                            self.fetchedTranscriptsTemp[ subAccountNumberArray[ index ] ].push( jsonStringToPush ); 
			                                                        }
	                                                        		
	                                                        	}
				                                                        	
	                                                        }
                                                    }
                                                },

    filterTranscripts           :               function( subAccountNumberArray, fromDate, toDate ) {
                                                    var self = this;
                                                    /*
                                                    var fromDate = self.toGMT( new Date( fromDate ) ).getTime();
                                                    var toDate = self.toGMT( new Date( toDate ) ).getTime() + 86399999 /* for getting end time of a day */;

                                                    var fromDate = self.pdtToGMT( new Date( fromDate.replace(/-/g,"/") ).getTime() );
                                                    var toDate = self.pdtToGMT( new Date( toDate.replace(/-/g,"/") ).getTime() + 86399999 /* for getting end time of a day */ );

                                                    /*
                                                    var fromDateInPDT = self.toGMT( self.getDateWithPDTTimeZone( moment( new Date( fromDate ) ).format( 'M/D/YYYY H:mm' ) ) );
                                                    var fromDateInPDT = self.toGMT( self.getDateWithPDTTimeZone( moment( new Date( toDate ) ).format( 'M/D/YYYY H:mm' ) ) );
                                                    /*
                                                    var fromDate = new Date( fromDate ).getTime();
                                                    var toDate = new Date( toDate ).getTime() + 86399999 /* for getting end time of a day */;

                                                    var transcriptsModels = self.models.filter( function( model ) {
                                                        try {
                                                            var createdDate = parseInt( model.get( 'fetchDate' ) );
                                                        } catch( exception ) { console.error( 'Given date is not in integer format. Model : ', model, 'Exception Message : ', exception.message, exception ); }
                                                        return  (
                                                                    createdDate                                                         >=      fromDate        &&
                                                                    createdDate                                                         <=      toDate          &&
                                                                    subAccountNumberArray.indexOf( model.get( 'subAccountNumber' ) )    !=      -1				&&
                                                                   (model.get('action').toLowerCase().indexOf('completed')				!=      -1              ||
                                                                    model.get('action').toLowerCase().indexOf('callended')				!=      -1              ||
                                                                    model.get('action').toLowerCase().indexOf('dialout')				!=      -1              ||
                                                                   (model.get('interactionType').toLowerCase().indexOf('sbchat')        !=      -1              &&
                                                                    model.get('action').toLowerCase()                  					===     'closed'           ))
                                                                );
                                                    } );
                                                    return transcriptsModels;
                                                },

    filterByStatusLike          :               function( statusKeyWordArray ) {
                                                    var self = this;
                                                    var transcriptsModels = self.models.filter( function( model ) {
                                                                                                    var status = model.get( 'action' ).toLowerCase();
                                                                                                    var filterSuccess = false;
                                                                                                    for( var index in statusKeyWordArray ) {
                                                                                                        if( status.indexOf( statusKeyWordArray[ index ].toLowerCase() ) != -1 ) {
                                                                                                            filterSuccess = true;
                                                                                                            break;
                                                                                                        }
                                                                                                    }
                                                                                                    return filterSuccess;
                                                                                                } );
                                                    return transcriptsModels;
                                                },

    //for converting the date to pst/pdt timezone
    offsetconversion            :               function( dbdate ) {
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

    //for converting the date to pst/pdt timezone
    pdtToGMT                   :               function( pdtMilliseconds ) {
                                                    var date = new Date(pdtMilliseconds);
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
                                                            pdtoffset   =   pdtoffset + dateoffset;
                                                            var pdfoffsetmilli  =   pdtoffset   * 60000;
                                                            pdfoffsetmilli  =   datemill    +   pdfoffsetmilli;
                                                            return pdfoffsetmilli;
                                                        }
                                                    else if(dateoffset>0)
                                                        {
                                                            pdtoffset   =   pdtoffset - dateoffset;
                                                            var pdfoffsetmilli  =   pdtoffset   * 60000;
                                                            pdfoffsetmilli  =   datemill    +   pdfoffsetmilli;
                                                            return pdfoffsetmilli;
                                                        }
                                                    else if(dateoffset == 0)
                                                        {
                                                            var pdfoffsetmilli  =   pdtoffset   * 60000;
                                                            pdfoffsetmilli  =   datemill    +   pdfoffsetmilli;
                                                            return pdfoffsetmilli;
                                                            
                                                        }
                                                },

    toGMT                       :               function( date ) {
                                                    return new Date( date.getTime() + ( date.getTimezoneOffset() * 60 * 1000 ) );
                                                },

    splitSubAccountNumberArrayToMakeServerCall: function( subAccountNumberArray ) {
                                                    var subAccountNumberArrayTemp = subAccountNumberArray.slice( 0, subAccountNumberArray.length );
                                                    var subAccountNumberSplittedArrayTemp = subAccountNumberArrayTemp;
                                                    var subAccountSplittedArrayToReturn = [];
                                                    do {
                                                        subAccountNumberSplittedArrayTemp = subAccountNumberArrayTemp.splice( 0, subAccountNumberArrayTemp.length > 30 ? 30 : subAccountNumberArrayTemp.length );
                                                        if( subAccountNumberSplittedArrayTemp.length > 0 ) { subAccountSplittedArrayToReturn.push( subAccountNumberSplittedArrayTemp ); }
                                                    } while( subAccountNumberArrayTemp.length > 0 );
                                                    return subAccountSplittedArrayToReturn;
                                                },

    generateUniqueId            :               ( function() {
                                                    function s4() {
                                                        return Math.floor((1 + Math.random()) * 0x10000)
                                                               .toString(16)
                                                               .substring(1);
                                                    }
                                                    return function() {
                                                                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
                                                            };
                                                } )(),

    getElement                  :               function() {
                                                    return this.currentElement;
                                                },

    setElement                  :               function(model) {
                                                    this.currentElement = model;
                                                },

    getNextModel                :               function() {
                                                    return this.at(this.indexOf(this.getElement()) + 1);
                                                },

    getPrevModel                :               function() {
                                                    return this.at(this.indexOf(this.getElement()) - 1);
                                                },

    next                        :               function (){
                                                    this.setElement(this.at(this.indexOf(this.getElement()) + 1));
                                                    return this;
                                                },
    prev                        :               function() {
                                                    this.setElement(this.at(this.indexOf(this.getElement()) - 1));
                                                    return this;
                                                },

    comparator                  :               function( a, b ) {
                                                    var self = this;
                                                    a = a.get( self.sortKey );
                                                    b = b.get( self.sortKey );
                                                    var conditionToPerform = undefined;
                                                    if( self.sortOrder == 'asc' )
                                                        conditionToPerform = a < b ?  1 : a > b ? -1 : 0;
                                                    else
                                                        conditionToPerform = a > b ?  1 : a < b ? -1 : 0;
                                                    return conditionToPerform;
                                                },

    sortByKey                   :               function( sortKey ) {
                                                    var self = this;
                                                    if( sortKey ) self.sortKey = sortKey;
                                                    self.sort();
                                                },

    toggleSortOrder             :               function() {
                                                    var self = this;
                                                    if( self.sortOrder == 'asc' )
                                                        self.sortOrder = 'des';
                                                    else
                                                        self.sortOrder = 'asc';
                                                },

    sortByRecievedTime          :               function() {

                                                },

    searchByAgent               :               function( phrase ) {
                                                    var self = this;
                                                    var transcriptsModels = self.models.filter( function( model ) {
                                                                                                    var agentLogin = model.get( 'agentName' ) || model.get( 'AgentLogin' ) ? model.get( 'AgentLogin' ) : 'NA';
                                                                                                    return  (
                                                                                                                agentLogin.toLowerCase().indexOf( phrase.toLowerCase() ) != -1
                                                                                                            );
                                                                                                } );
                                                    return transcriptsModels;
                                                },

    searchTranscripts           :               function( phrase ) {
                                                    var self = this;
                                                    var transcriptsModels = self.models.filter( function( model ) {
                                                                                                    var stringifiedModel = JSON.stringify( model.toJSON() );
                                                                                                    var phraseArr = phrase.split(",");
                                                                                                    var flag = false;
                                                                                                    for(index in phraseArr){
                                                                                                    	 if(stringifiedModel.toLowerCase().indexOf( phraseArr[index].toLowerCase() ) != -1 ){
                                                                                                    		 flag = true;
                                                                                                    		 break;
                                                                                                    	 }
                                                                                                    		 
                                                                                                    }
                                                                                                    return flag;
                                                                                                } );
                                                    return transcriptsModels;  
                                                },

    getMeanDuration             :               function( isGetMilliseconds ) {
                                                    var self = this;
                                                    var mean = 0;
                                                    var total = 0;
                                                    var itemsToFindMean = [];
                                                    if( ! self.meanDuration ) {
                                                        self.each(  function( model ) {
                                                                        var duration = model.getDuration( true /* isReturnInMilliSeconds */ );
                                                                        if( self.options.data.linkedObjects.completedStatuses.indexOf( model.get( 'action' ) ) != -1 ) {
                                                                        	//console.error( model.get( 'action' ));
                                                                            if( duration && duration != 'NA' && duration != 'null' ) {
                                                                                total = total + duration;
                                                                                itemsToFindMean.push( duration );
                                                                            }
                                                                        }
                                                                    } );
                                                        mean = total / itemsToFindMean.length;
                                                        self.meanDuration = mean;
                                                    }
                                                    if( isGetMilliseconds ) {
                                                        return self.meanDuration;
                                                    }
                                                    var duration = moment.duration( self.meanDuration );
                                                    var differenceString = '0:00:00';
                                                    if( self.meanDuration && ( self.meanDuration != 0 || self.meanDuration != '0' || self.meanDuration != 'Invalid Date' ) ) {
                                                        differenceString = Math.floor( duration.asHours() ) + moment.utc( self.meanDuration ).format( ":mm:ss" );
                                                    }
                                                    return differenceString;
                                                },

    getAverageTTA               :               function( isGetMilliseconds ) {
                                                    var self = this;
                                                    var mean = 0;
                                                    var total = 0;
                                                    var itemsToFindMean = [];
                                                    if( ! self.averageTTA ) {
                                                        self.each(  function( model ) {
                                                                        var duration = model.getTimeTakenToAnswer( true /* isReturnInMilliSeconds */ );
                                                                        if( self.options.data.linkedObjects.completedStatuses.indexOf( model.get( 'action' ) ) != -1 ) {
                                                                            if( duration && duration != 'NA' && duration != 'null' ) {
                                                                                total = total + duration;
                                                                                itemsToFindMean.push( duration );
                                                                            }
                                                                        }
                                                                    } );
                                                        mean = total / itemsToFindMean.length;
                                                        self.averageTTA = mean;
                                                    }
                                                    if( isGetMilliseconds ) {
                                                        return self.averageTTA;
                                                    }
                                                    var duration = moment.duration( self.averageTTA );
                                                    var differenceString = '0:00:00';
                                                    if( self.averageTTA && ( self.averageTTA != 0 || self.averageTTA != '0' || self.averageTTA != 'Invalid Date' ) ) {
                                                        differenceString = Math.floor( duration.asHours() ) + moment.utc( self.averageTTA ).format( ":mm:ss" );
                                                    }
                                                    return differenceString;
                                                },

    getAverageTTC               :               function( isGetMilliseconds ) {
                                                    var self = this;
                                                    var mean = 0;
                                                    var total = 0;
                                                    var itemsToFindMean = [];
                                                    if( ! self.averageTTC ) {
                                                        self.each(  function( model ) {
                                                                        var duration = model.getTimeTakenToComplete( true /* isReturnInMilliSeconds */ );
                                                                        if( self.options.data.linkedObjects.completedStatuses.indexOf( model.get( 'action' ) ) != -1 ) {
                                                                            if( duration && duration != 'NA' && duration != 'null' ) {
                                                                                total = total + duration;
                                                                                itemsToFindMean.push( duration );
                                                                            }
                                                                        }
                                                                    } );
                                                        mean = total / itemsToFindMean.length;
                                                        self.averageTTC = mean;
                                                    }
                                                    if( isGetMilliseconds ) {
                                                        return self.averageTTC;
                                                    }
                                                    var duration = moment.duration( self.averageTTC );
                                                    var differenceString = '0:00:00';
                                                    if( self.averageTTC && ( self.averageTTC != 0 || self.averageTTC != '0' || self.averageTTC != 'Invalid Date' ) ) {
                                                        differenceString = Math.floor( duration.asHours() ) + moment.utc( self.averageTTC ).format( ":mm:ss" );
                                                    }
                                                    return differenceString;
                                                },

    dateDifference              :               function( fromDateInMilliSeconds, toDateInMilliSeconds, isGetMilliseconds ) {
                                                    var differenceInMilliSeconds = moment( toDateInMilliSeconds ).diff( fromDateInMilliSeconds );
                                                    var duration = moment.duration( differenceInMilliSeconds );
                                                    
                                                },

} );