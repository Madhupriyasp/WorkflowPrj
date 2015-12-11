BackboneData.ToolbarView 		= 		Backbone.View.extend( {

	initialize 						: 			function ( options ) {
													var self = this;
													self.options = options;
													self.$wrapper = options.$wrapper;
													self.$el = self.$wrapper;
													self.$ = self.$ || {};
											    },

	render 							: 			function() {
													var self = this;
													var deferred = new $.Deferred();
													var htmlString = acti.workflow.reports.toolbar( { attributes: { test: 'TEST'} } );
													self.$wrapper.html( htmlString );
													self.findElements();
													self.attachEvents();
													/* self.fillDateRangeDefault(); */
													self.isRendered = true;
													deferred.resolve();
													return deferred;
												},

	events 							: 			{
													'click div.date-range a#go-date-range' 					: 			'onDateRangeGoClick',
													'keyup div.date-range' 									: 			'onKeyUpOfDateRange',
													'keyup input#find-player'	 				 			: 			'onSearchPlayerInputKeyDown'
												},

	attachEvents 					: 			function() {
													var self = this;
													self.attachDateProperty();
												},

	findElements 					: 			function() {
													var self = this;
													self.$container = self.$wrapper.find( 'div#toolbar' );
													self.$.fromDate = self.$container.find( 'input#from-date' );
													self.$.toDate = self.$container.find( 'input#to-date' );
													self.$.findMemberInput = self.$container.find( 'input#find-player' );
												},

	onSearchPlayerInputKeyDown 		: 			function( event ) {
													var self = this;
												    self.keyTime = new Date().getTime();
														setTimeout(function(){
																	if((new Date().getTime() - self.keyTime) >= 1000)
				   												 	{
																		searchedSelectedAgentTranscriptCollection = new BackboneData.TranscriptCollection( self.options.data.collections.selectedSubAccountTranscriptCollection.searchTranscripts( self.$.findMemberInput.val() ), self.options );
																		console.log( self.$.findMemberInput.val(), '-->', searchedSelectedAgentTranscriptCollection );
																		self.options.data.views.memberListShellView.displayMembers( searchedSelectedAgentTranscriptCollection, self.options.data.showing.memberListShellView.subAccountDetails, true /* forceRender */ );
																		var searchedTranscriptCollection = new BackboneData.TranscriptCollection( self.options.data.collections.selectedAgentTranscriptCollection.searchTranscripts( self.$.findMemberInput.val() ), self.options );
																		self.options.data.views.transcriptListShellView.displayTranscripts( searchedTranscriptCollection, true /* forceRender */, self.options.data.url.agentLogin );
																	    self.options.data.views.memberListShellView.makeActive(self.options.data.url.agentLogin);
				   												 	}
																}
																, 1000);
												},
	setDateRange 					: 			function( fromDate, toDate ) {
													var self = this;
													/*
													self.$.fromDate.attr( 'value', fromDate );
													self.$.toDate.attr( 'value', toDate );
													*/
													self.listenToDateChange = false;
													self.fromDateDatePicker.setDate( moment( new Date( fromDate.replace(/-/g,"/") ) ).format( 'MM/DD/YYYY' ) );
													self.options.data.preferences.dateRange = { fromDate: moment( fromDate ).format( 'MM-DD-YYYY' ), toDate: moment( toDate ).format( 'MM-DD-YYYY' ) };
													self.toDateDatePicker.setDate( moment( new Date( toDate.replace(/-/g,"/") ) ).format( 'MM/DD/YYYY' ) );
													self.listenToDateChange = true;
													return true;
												},

	fillDateRangeDefault 			: 			function() {
													var self = this;
													// var currentDateString = self.getDateStringForInputTag( new Date() );
													var currentDateString = moment().tz( 'America/Whitehorse' ).format( 'MM/DD/YYYY' );
													self.$.fromDate.attr( 'max', currentDateString );
													self.$.toDate.attr( 'max', currentDateString );
													self.setDateRange( currentDateString, currentDateString );
												},

	onDateRangeGoClick 				: 			function( event ) {
													var self = this;
													isLoaded = false;
													if( self.getFromDate() && self.getToDate() ) {
														if( !self.options.data.url.accountNumber ) { messageWindow.popUpMessage( 'Fetch&nbsp;account&nbsp;first', 2 * 1000 ); }
														else { self.options.data.routers.reportsRouter.navigate( self.options.data.url.accountNumber + '/' + self.options.data.url.subAccountDetails.subAccountNumber + '/' + self.getFromDate() + '/' + self.getToDate(), { trigger: true, replace: true /* Will not create history */ } ); }
													} else {
														messageWindow.popUpMessage( 'Provide&nbsp;valid&nbsp;date', 3 * 1000 );
													}
												},

	onKeyUpOfDateRange 				: 			function( event ) {
													var self = this;
													if( event.keyCode == 13 /* Enter Key */ )
														self.onDateRangeGoClick();
												},

	trimDigits 						: 			function( valueInteger, digits ) {
													var valueString = valueInteger + '';
													if( valueString.length > digits ) {
														valueString = valueString.slice( valueString.length - digits, valueString.length );
													} else {
														var numberOfZeros = digits - valueString.length;
														var zeroString = '';
														for( var i = 0; i < numberOfZeros; i++ ) {
															zeroString += '0';
														}
														valueString = zeroString + valueString;
													}
													return valueString;
												},

	getDateStringForInputTag		: 			function( date ) {
		 											var self = this;
													return date.getFullYear() + '-' + self.trimDigits( ( date.getMonth() + 1 ), 2 ) + '-' + self.trimDigits( date.getDate(), 2 );
												},

	getDateStringForServer			: 			function( date ) {
		 											var self = this;
													return  self.trimDigits( ( date.getMonth() + 1 ), 2 ) + '-' + self.trimDigits( date.getDate(), 2 ) + '-' + date.getFullYear();
												},

	getDateStringForUI				: 			function( date ) {
		 											var self = this;
													return  self.trimDigits( date.getDate(), 2 ) + '-' + self.trimDigits( ( date.getMonth() + 1 ), 2 ) + '-' + date.getFullYear();
												},

	getFromDate 					: 			function() {
													var self = this;
													if( self.fromDateDatePicker.getDate() != 'Invalid Date' ) {
														return moment( self.fromDateDatePicker.getDate() ).format( 'MM-DD-YYYY' );
													} else {
														return false;
													}
													/*
													var fromDateString = self.$.fromDate.val();
													if( !fromDateString || fromDateString == '' ) {
														return false;
													}
													var fromDate = new Date( fromDateString );
													var fromDateForServer = self.getDateStringForServer( fromDate );
													return fromDateForServer;
													*/
												},

	getToDate 	 					: 			function() {
													var self = this;
													if( self.toDateDatePicker.getDate() != 'Invalid Date' ) {
														return moment( self.toDateDatePicker.getDate() ).format( 'MM-DD-YYYY' );
													} else {
														return false;
													}
													/*
													var toDateString = self.$.toDate.val();
													if( !toDateString || toDateString == '' ) {
														return false;
													}
													var toDate = new Date( toDateString );
													var toDateForServer = self.getDateStringForServer( toDate );
													return toDateForServer;
													*/
												},												

	destroy 						: 			function() {
													var self = this;
													if( self.$container ) self.$container.remove();
													self.isRendered = false;
												},

	attachDateProperty 				: 			function() {
													var self = this;
													var nowTemp = new Date();
													var now = new Date( nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0 );
													var fromDateDatePicker = null, toDateDatePicker = null;
													self.listenToDateChange = true;
													var previousFromDate = null, previousToDate = null;

													var onFromDateChange 	= 	function( event, element ) {
																					var currentFromDate = self.fromDateDatePicker.getDate();
																					self.toDateDatePicker.setStartDate( self.fromDateDatePicker.getDate() );
																					if( self.listenToDateChange && currentFromDate != 'Invalid Date' ) {
																						self.fromDateDatePicker.hide();
																						self.$.toDate.focus();
																						previousFromDate = self.fromDateDatePicker.getDate();
																					}
																				};
													var onToDateChange 		= 	function( event, element ) {
																					var currentToDate = self.toDateDatePicker.getDate();
																					if( self.listenToDateChange && currentToDate != 'Invalid Date' ) {
																						self.toDateDatePicker.hide();
																						self.onDateRangeGoClick();
																						previousToDate = self.toDateDatePicker.getDate();
																					}
																				};

													self.fromDateDatePicker 	=	self.$.fromDate.datepicker( { endDate: new Date( moment().tz( 'America/Whitehorse' ).format() ), format: 'mm/dd/yyyy', todayHighlight: true, } )
																						.on( 'changeDate' , function( event ) { onFromDateChange( event, this ); } )
																							.data( 'datepicker' );

													self.toDateDatePicker 		= 	self.$.toDate.datepicker( { endDate: new Date( moment().tz( 'America/Whitehorse' ).format() ), format: 'mm/dd/yyyy', todayHighlight: true, } )
																						.on( 'changeDate' , function( event ) { onToDateChange( event, this ); } )
																							.data( 'datepicker' );

													var currentDateString = moment().tz( 'America/Whitehorse' ).format( 'MM/DD/YYYY' );
													self.listenToDateChange = false;
													self.fromDateDatePicker.setDate( currentDateString );
													self.toDateDatePicker.setDate( currentDateString );
													self.listenToDateChange = true;
													window.fromDate = self.fromDateDatePicker;
													window.toDate = self.toDateDatePicker;
												},

	//for converting the date to pst/pdt timezone
    offsetconversion            	:           function( dbdate ) {
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

    toGMT                       :               function( date ) {
                                                    return new Date( date.getTime() + ( date.getTimezoneOffset() * 60 * 1000 ) );
                                                },

} );