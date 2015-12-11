BackboneData.TranscriptCardView 	 = 		Backbone.View.extend( {

	isRendered 						: 			false,

	initialize 						: 			function ( options ) {
													var self = this;
													self.options = options;
													self.$wrapper = options.$wrapper;
													self.$el = self.$wrapper;
													self.$ = {};
													self.transcriptModel = self.options.data.currentTarget.transcriptModel;
											    },

	events 							: 			{
													'' 				: 			'',
												},

	render 							: 			function() {
													var self = this;
													var deferred = new $.Deferred();
													var status   = null;
													if(!!!self.transcriptModel.get( 'multiConId' ))
													{
														status = self.getMultiConIdStatus(self.transcriptModel.get( 'interactionHistory' ));
														self.transcriptModel.set({ multiConId : status });
													}
														
													var htmlString = acti.workflow.reports.transcriptCard( { attributes: 	{
																																test 									: 	'TEST',
																																id 										: 	self.transcriptModel.get( 'interactionId' ),
																																subAccountNumber 						: 	self.transcriptModel.get( 'subAccountNumber' ),
																																subAccountName 							: 	Helper.getDisplayDomainName(self.transcriptModel.get( 'domain' )),
																																agentLogin 								: 	( self.transcriptModel.get( 'AgentLogin' ) && self.transcriptModel.get( 'AgentLogin' ) != 'null' ) ? self.transcriptModel.get( 'AgentLogin' ) : 'NA',
																																status 									: 	self.transcriptModel.get( 'action' ),
																																recievedTime 							: 	self.getTimeString( self.offsetconversion( self.transcriptModel.getRecievedTime() ) ),
																																completedTime 							: 	self.getTimeString( self.offsetconversion( self.transcriptModel.getCompletedTime() ) ),
																																duration 								: 	self.transcriptModel.getDuration(),
																																timeTakenToAnswer 						: 	self.transcriptModel.getTimeTakenToAnswer(),
																																timeTakenToComplete 					: 	self.transcriptModel.getTimeTakenToComplete(),
																																statusColor 							: 	self.transcriptModel.getStatusColor(),
																																multiConId								: 	self.transcriptModel.get('multiConId'),
																															}
																											} );
													self.$wrapper.append( htmlString );
													self.options.data.$.transcriptTable.floatThead( 'reflow' );
													self.findElements();
													self.attachEvents();
													self.isRendered = true;
													deferred.resolve();
													return deferred;
												},

	attachEvents 					: 			function() {
													var self = this;
													if( self.transcriptModel.get( 'action' ).indexOf( 'Completed' ) == -1 ) {
														window.setTimeout( function() {  }, 1 * 1000 );
													}
												},

	findElements 					: 			function() {
													var self = this;
													self.$container = self.$wrapper.find( 'tr#' + self.transcriptModel.get( 'interactionId' ) + '.transcript-card-tr' );
													self.$container.bind( 'click', function( event ) { self.onTranscriptCardClick( event, this ); } );
												},

	onTranscriptCardClick 			: 			function( event, element ) {
													var self = this;
													self.options.data.preferences.ui.transcriptDetailsViewTab = self.options.data.preferences.ui.transcriptDetailsViewTab || 'message';
													self.options.data.routers.reportsRouter.navigate( self.options.data.url.accountNumber + '/' + self.options.data.url.subAccountDetails.subAccountNumber + '/' + self.options.data.url.subAccountDetails.fromDate + '/' + self.options.data.url.subAccountDetails.toDate + '/' + self.options.data.url.agentLogin + '/' + self.transcriptModel.get( 'interactionId' ) + '/' + self.options.data.preferences.ui.transcriptDetailsViewTab, { trigger: true, replace: true /* Will not create history */ } );
												},

	onResize 						: 			function( event, element ) {
													var self = this;
													var bodyHeight = $( window ).height();
													var mainContainerHeight = bodyHeight - self.headerHeight;
													self.$wrapper.css( { height: mainContainerHeight + 'px' } );
													var teamPaneHeaderHeight = self.$.teamPaneHeader.height() + 2 /* TeamPaneHeader border */;
													self.$.teamList.css( { height: ( mainContainerHeight - ( (self.$.teamPaneHeader.css( 'display' ) != 'none') ? teamPaneHeaderHeight : 0 ) ) + 'px' } );
												},

	offsetconversion            	:           function( dbdate ) {
													if( typeof( dbdate ) == 'string' ) {
														dbdate = window.parseInt( dbdate );
													}
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

	getTimeString 					: 			function( dateInMilliSeconds ) {
													var self = this;
													if( dateInMilliSeconds && dateInMilliSeconds != 'NA' ) {
														return moment( dateInMilliSeconds ).format( 'D MMM YY HH:mm:ss' );
													} else {
														return 'NA';
													}
												},

	destroy 						: 			function() {
													var self = this;
													if( self.$container ) { self.$container.remove(); self.options.data.$.transcriptTable.floatThead( 'reflow' ); }
													self.isRendered = false;
												},
												
    makeVisited 					:			function(set){
    												var self = this;
													if(set)
														self.$container.css("background-color", "#F2F2F2" );
												},
	getMultiConIdStatus				:			function(intractionhistory){
													   var connectionID        =   intractionhistory[0].connectionId;
													   var multiConId = false;
												       for(var index in intractionhistory)
												       	{
												       	      if(connectionID !== intractionhistory[index].connectionId)
												       	      {
												       	    	multiConId = true;
												       	    	  break;
												       	      }
												       	}
												       	return multiConId;
												},
											
} );