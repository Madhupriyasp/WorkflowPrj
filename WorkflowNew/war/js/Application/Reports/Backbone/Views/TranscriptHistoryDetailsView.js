BackboneData.TranscriptHistoryDetailsView	= 		Backbone.View.extend( {

	isRendered 						: 			false,

	fetchedAccount 					: 			null,

	origin 							: 			'TranscriptHistoryDetailsView',

	initialize 						: 			function ( options ) {
													var self = this;
													self.options = options;
													self.$ = {};
													self.$wrapper = options.$wrapper;
													self.$el = self.$wrapper;
													self.transcriptModel = self.options.data.currentTarget.transcriptModel;
													self.modalHeaderHeight = 56;
													self.modalFooterHeight = 50;
													self.toolbarWrapperHeight = 50;
													self.transcriptModalDetailsWrapperHeight = 142;
											    },

	render 							: 			function() {
													var self = this;
													var phoneFlag = false;
													var deferred = new $.Deferred();
													var interactionHistories = self.transcriptModel.get( 'interactionHistory' );
													for( var index in interactionHistories ) {
														if(!!interactionHistories[index].phoneNumber || !!interactionHistories[index].outboundConnectionID)
															phoneFlag = true;
														interactionHistories[ index ].dateString = self.transcriptModel.getTimeString( self.transcriptModel.offsetconversion( interactionHistories[ index ].date ) ) // moment( interactionHistories[ index ].date ).format( 'D MMM YY HH:mm:ss' ); //flow modify
													}
													if(phoneFlag)
														for (var i in interactionHistories)
													    {
															if(!interactionHistories[i].hasOwnProperty("phoneNumber"))
															  interactionHistories[ i ].phoneNumber = 'NA' ;
															if(!!!interactionHistories[i].outboundConnectionID)
																  interactionHistories[ i ].outboundConnectionID = 'NA' ;
															
													    }													
													var htmlString = acti.workflow.reports.transcriptHistoryList( { attributes: { test: 'TEST', interactionHistories: interactionHistories , hasPhone : phoneFlag} } );
													self.$wrapper.html( htmlString );
													self.findElements();
													self.attachEvents();
													self.onResize();
													self.isRendered = true;
													deferred.resolve();
													return deferred;
												},

	events							: 			{
													'click .clip_button' 	: 'displayMessage' 
												},

	show 							: 			function() {
													var self = this;
													if( self.$container ) { self.$wrapper.show(); self.reflowTable(); }
												},

	hide 							: 			function() {
													var self = this;
													if( self.$container ) { self.$wrapper.hide(); }
												},

	findElements 					: 			function() {
													var self = this;
													self.$container = self.$wrapper.find( 'div#transcript-history-details' );
													self.$.transcriptHistoryTable = self.$container.find( 'table#transcript-history-details-table' );
													self.$.transcriptHistoryTableWrapper = self.$container.find( 'div#transcript-history-details-table-wrapper' );
												},

	attachEvents 					: 			function() {
													var self = this;
													$( window ).resize( function( event ) { self.onResize( event, this ); } );
													self.$.transcriptHistoryTable.floatThead( { scrollContainer: function ( $table ) { return $table.closest( '#transcript-history-details-table-wrapper' ); }, } );
													var client = new ZeroClipboard($(".clip_button") );
												},

	onResize 						: 			function( event, element ) {
													var self = this;
													var windowHeight = $( window ).height();
													self.transcriptHistoryDetailsTableWrapperHeight = windowHeight - ( self.modalHeaderHeight + self.toolbarWrapperHeight + self.transcriptModalDetailsWrapperHeight + self.modalFooterHeight ) - 4 /* For Border */;
													self.$.transcriptHistoryTableWrapper.css( { height : self.transcriptHistoryDetailsTableWrapperHeight + 'px', } );
												},

	destroy 						: 			function() {
													var self = this;
													if( self.$container ) self.$container.remove();
													delete self.options.data.views.transcriptHistoryDetailsView;
													self.isRendered = false;
												},

	reflowTable 					: 			function() {
													var self = this;
													if( self.$.transcriptHistoryTable )
														self.$.transcriptHistoryTable.floatThead( 'reflow' );
												},
	displayMessage 					: 			function() {
		  											messageWindow.popUpMessage( "Copied Outbound ConnectionId", 2000 , true ,true);
		  											console.log("Alert is triggered");
												},
																						

} );