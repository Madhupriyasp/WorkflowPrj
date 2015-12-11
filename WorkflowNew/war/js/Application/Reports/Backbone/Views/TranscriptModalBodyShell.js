BackboneData.TranscriptModalBodyShell	= 		Backbone.View.extend( {

	isRendered 						: 			false,

	fetchedAccount 					: 			null,

	origin 							: 			'TranscriptDetailsShellView',

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
													var deferred = new $.Deferred();
													var htmlString = acti.workflow.reports.transcriptModalBodyShell( { attributes: { test: 'TEST', } } );
													self.$wrapper.html( htmlString );
													self.findElements();
													self.attachEvents();
													self.onResize();

													var options = { data: self.options.data, $wrapper: self.$.toolbarWrapper };
													options.data.currentTarget.transcriptModel = self.transcriptModel;
													self.options.data.views.transcriptDetailsToolbarView = new BackboneData.TranscriptDetailsToolbarView( options );
													self.options.data.views.transcriptDetailsToolbarView.render();

													var options = { data: self.options.data, $wrapper: self.$.transcriptModalDetailsWrapper };
													options.data.currentTarget.transcriptModel = self.transcriptModel;
													self.options.data.views.transcriptModalDetailsView = new BackboneData.TranscriptModalDetailsView( options );
													self.options.data.views.transcriptModalDetailsView.render();

													var options = { data: self.options.data, $wrapper: self.$.transcriptHistoryDetailsWrapper };
													options.data.currentTarget.transcriptModel = self.transcriptModel;
													self.options.data.views.transcriptHistoryDetailsView = new BackboneData.TranscriptHistoryDetailsView( options );
													self.options.data.views.transcriptHistoryDetailsView.render();

													var options = { data: self.options.data, $wrapper: self.$.transcriptFullDetailsWrapper };
													options.data.currentTarget.transcriptModel = self.transcriptModel;
													if( self.transcriptModel.getMessageObject().hasOwnProperty( 'FROM' ) && self.transcriptModel.getMessageObject().hasOwnProperty( 'TO' ) ) {
														self.options.data.views.transcriptFullDetailsView = new BackboneData.TranscriptFullDetailsMailView( options );
														self.options.data.views.transcriptFullDetailsView.render();
													}
													else if(self.transcriptModel.getMessageObject().hasOwnProperty('chatMessages')) 
													{
														self.options.data.views.transcriptFullDetailsView = new BackboneData.TranscriptFullDetailsChatView( options );
														self.options.data.views.transcriptFullDetailsView.render();
													}
													else
													{
														self.options.data.views.transcriptFullDetailsView = new BackboneData.TranscriptFullDetailsView( options );
														self.options.data.views.transcriptFullDetailsView.render();
													}
													self.showSelectedTab();
													self.isRendered = true;
													deferred.resolve();
													return deferred;
												},

	events							: 			{
													
												},

	showSelectedTab 				: 			function() {
													var self = this;
													switch( self.options.data.preferences.ui.transcriptDetailsViewTab ) {
														case 'message' :
															self.showMessageTab();
															break;
														case 'history' :
															self.showHistoryTab();
															break;
														default :
															self.showMessageTab();
															break;
													}
												},

	findElements 					: 			function() {
													var self = this;
													self.$container = self.$wrapper.find( 'div#transcript-modal-body-shell' );
													self.$.toolbarWrapper = self.$container.find( 'div.transcript-toolbar-wrapper' );
													self.$.transcriptModalDetailsWrapper = self.$container.find( 'div#transcript-modal-details-wrapper' );
													self.$.transcriptHistoryDetailsWrapper = self.$container.find( 'div#transcript-history-details-wrapper' );
													self.$.transcriptFullDetailsWrapper = self.$container.find( 'div#transcript-full-details-wrapper' );
												},

	attachEvents 					: 			function() {
													var self = this;
													$( window ).resize( function( event ) { self.onResize( event, this ); } );
												},

	showMessageTab 					: 			function() {
													var self = this;
													self.options.data.views.transcriptHistoryDetailsView.hide();
													self.options.data.views.transcriptFullDetailsView.show();
													self.options.data.preferences.ui.transcriptDetailsViewTab = 'message';
													self.options.data.views.transcriptDetailsToolbarView.makeMessageViewActive();
												},

	showHistoryTab 					: 			function() {
													var self = this;
													self.options.data.views.transcriptFullDetailsView.hide();
													self.options.data.views.transcriptHistoryDetailsView.show();
													self.options.data.preferences.ui.transcriptDetailsViewTab = 'history';
													self.options.data.views.transcriptDetailsToolbarView.makeHistoryViewActive();
												},

	onResize 						: 			function( event, element ) {
													var self = this;
													var windowHeight = $( window ).height();
													self.transcriptDetailsScrollableHeight = windowHeight - ( self.modalHeaderHeight + self.toolbarWrapperHeight + self.transcriptModalDetailsWrapperHeight + self.modalFooterHeight ) - 4 /* For Border */;
													self.$.transcriptHistoryDetailsWrapper.css( { height : self.transcriptDetailsScrollableHeight + 'px', } );
													self.$.transcriptFullDetailsWrapper.css( { height : self.transcriptDetailsScrollableHeight + 'px', } );
												},

	destroy 						: 			function() {
													var self = this;

													if( self.options.data.views.transcriptDetailsToolbarView ) {
														self.options.data.views.transcriptDetailsToolbarView.destroy();
													}

													if( self.options.data.views.transcriptModalDetailsView ) {
														self.options.data.views.transcriptModalDetailsView.destroy();
													}

													if( self.options.data.views.transcriptHistoryDetailsView ) {
														self.options.data.views.transcriptHistoryDetailsView.destroy();
													}

													if( self.options.data.views.transcriptFullDetailsView ) {
														self.options.data.views.transcriptFullDetailsView.destroy();
													}

													if( self.$container ) self.$container.remove();
													delete self.options.data.views.transcriptModalBodyShell;

													self.isRendered = false;
												},

} );