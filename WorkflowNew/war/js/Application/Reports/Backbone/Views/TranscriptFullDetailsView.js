BackboneData.TranscriptFullDetailsView	= 		Backbone.View.extend( {

	isRendered 						: 			false,

	fetchedAccount 					: 			null,

	origin 							: 			'TranscriptFullDetailsView',

	initialize 						: 			function ( options ) {
													var self = this;
													self.options = options;
													self.$ = {};
													self.$wrapper = options.$wrapper;
													self.$el = self.$wrapper;
													self.transcriptModel = self.options.data.currentTarget.transcriptModel;
													self.transcriptMessageObject = self.options.data.currentTarget.transcriptModel.getMessageObject();
											    },

	render 							: 			function() {
													var self = this;
													var deferred = new $.Deferred();
													var messageArray = [];
													var messageObject = self.transcriptModel.getMessageObject();
													for( var key in messageObject ) {
														messageArray.push( { key: key, value: messageObject[ key ] } );
													}
													var htmlString = acti.workflow.reports.transcriptFullDetail( { attributes: { test: 'TEST', messages: messageArray, messageDetails: { domainName: Helper.getDisplayDomainName(self.transcriptModel.get( 'domain' )), userImage: 'images/user-icon.jpg', from: 'Unknown', to: '', } } } );
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

	show 							: 			function() {
													var self = this;
													if( self.$container ) { self.$wrapper.show(); }
												},

	hide 							: 			function() {
													var self = this;
													if( self.$container ) { self.$wrapper.hide(); }
												},

	findElements 					: 			function() {
													var self = this;
													self.$container = self.$wrapper.find( 'div#transcript-full-details' );
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
													delete self.options.data.views.transcriptFullDetailsView;
													self.isRendered = false;
												},

} );