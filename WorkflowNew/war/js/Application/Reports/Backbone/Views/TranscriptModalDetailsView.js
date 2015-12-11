BackboneData.TranscriptModalDetailsView	= 		Backbone.View.extend( {

	isRendered 						: 			false,

	fetchedAccount 					: 			null,

	origin 							: 			'TranscriptModalDetailsView',

	initialize 						: 			function ( options ) {
													var self = this;
													self.options = options;
													self.$ = {};
													self.$wrapper = options.$wrapper;
													self.$el = self.$wrapper;
													self.transcriptModel = self.options.data.currentTarget.transcriptModel;
											    },

	render 							: 			function() {
													var self = this;
													var deferred = new $.Deferred();
													var htmlString = acti.workflow.reports.transcriptModalDetails( { attributes: {
																																		test 									: 		'TEST',
																																		subAccountNumber 						: 		self.transcriptModel.get( 'subAccountNumber' ),
																																		agentName 								: 		self.transcriptModel.get( 'AgentLogin' ),
																																		status  								: 		self.transcriptModel.get( 'action' ),
																																		recievedTime 							: 		self.transcriptModel.getTimeString( self.transcriptModel.offsetconversion( self.transcriptModel.getRecievedTime() ) ),
																																		completedTime 							: 		self.transcriptModel.getTimeString( self.transcriptModel.offsetconversion( self.transcriptModel.getCompletedTime() ) ),
																																		duration 								: 		self.transcriptModel.getDuration(),
																																		timeTakenToAnswer 						: 		self.transcriptModel.getTimeTakenToAnswer(),
																																		timeZone  								: 		timezone,
																																	} } );
													self.$wrapper.html( htmlString );
													self.findElements();
													self.attachEvents();
													self.onResize();
													self.isRendered = true;
													deferred.resolve();
													return deferred;
												},

	events							: 			{
													
												},

	findElements 					: 			function() {
													var self = this;
													self.$container = self.$wrapper.find( 'div#transcript-modal-details-wrapper' );
												},

	attachEvents 					: 			function() {
													var self = this;
													$( window ).resize( function( event ) { self.onResize( event, this ); } );
												},

	onResize 						: 			function( event, element ) {
													var self = this;
													var windowHeight = $( window ).height();
												},

	destroy 						: 			function() {
													var self = this;
													if( self.$container ) self.$container.remove();
													delete self.options.data.views.transcriptModalDetailsView;
													self.isRendered = false;
												},

} );