BackboneData.TranscriptDetailsShellView	= 		Backbone.View.extend( {

	isRendered 						: 			false,

	fetchedAccount 					: 			null,

	origin 							: 			'TranscriptDetailsShellView',

	initialize 						: 			function ( options ) {
													var self = this;
													self.options = options;
													self.$ = {};
													self.$wrapper = options.$wrapper;
													self.$el = self.$wrapper;
													self.modalHeaderHeight = 56;
													self.modalFooterHeight = 50;
											    },

	render 							: 			function() {
													var self = this;
													var deferred = new $.Deferred();
													var htmlString = acti.workflow.reports.transcriptDetailsShell( { attributes: { test: 'TEST', } } );
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
													self.$container = self.$wrapper.find( 'div#transcript-details-shell' );
													self.$.modalHeader = self.$container.find( 'div.modal-header' );
													self.$.modalFooter = self.$container.find( 'div.modal-footer' );
													self.$.modalContent = self.$container.find( 'div.modal-content' );
													self.$.modalBodyWrapper = self.$container.find( 'div#transcript-modal-body-wrapper' );
												},

	attachEvents 					: 			function() {
													var self = this;
													$( window ).resize( function( event ) { self.onResize( event, this ); } );
													self.$container.on( 'shown.bs.modal', function( event ) { self.onTranscriptModalShown( event, this ); } );
													self.$container.on( 'hide.bs.modal', function( event ) { self.onTranscriptModalHide( event, this ); } );
												},

	onResize 						: 			function( event, element ) {
													var self = this;
													var windowHeight = $( window ).height();
													var modalBodyWrapperHeight = windowHeight - ( self.modalHeaderHeight + self.modalFooterHeight );
													self.$.modalContent.css( { height: windowHeight + 'px' } );
													self.$.modalBodyWrapper.css( { height: modalBodyWrapperHeight + 'px', } );
												},

	onTranscriptModalShown 			: 			function( event, element ) {
													var self = this;
													self.options.data.views.transcriptHistoryDetailsView.reflowTable();
												},

	onTranscriptModalHide 			: 			function( event, element ) {
													var self = this;
													self.options.data.routers.reportsRouter.navigate( self.options.data.url.accountNumber + '/' + self.options.data.url.subAccountDetails.subAccountNumber + '/' + self.options.data.url.subAccountDetails.fromDate + '/' + self.options.data.url.subAccountDetails.toDate + '/' + self.options.data.url.agentLogin, { trigger: false, replace: true /* Will not create history */ } );
												},

	show 							: 			function() {
													var self = this;
													self.$container.modal( 'show' );
												},

	hide 							: 			function() {
													var self = this;
													self.$container.modal( 'hide' );
												},

	destroy 						: 			function() {
													var self = this;
													if( self.$container ) self.$container.remove();
													delete self.options.data.views.transcriptDetailsShellView;
													self.isRendered = false;
												},

	showTranscriptById 				: 			function( interactionId ) {
													var self = this;
													var deferred = new $.Deferred();
													try {
														if( options.data.collections.selectedAccountTranscriptCollection.get( interactionId ) ) {
															self.show();
															self.showTranscript( options.data.collections.selectedAccountTranscriptCollection.get( interactionId ) );
															deferred.resolve();
														} else {
															self.hide();
															messageWindow.popUpMessage( 'No&nbsp;such&nbsp;interaction&nbsp;found' );
															deferred.reject();
														}
													} catch( exception ) {
														console.error( exception.message +  exception, exception.stack);
														self.hide();
														messageWindow.popUpMessage( 'No&nbsp;such&nbsp;interaction&nbsp;found' );
														deferred.reject();
													}
													return deferred;
												},

	showTranscript 					: 			function( transcriptModel ) {
													var self = this;
													if( self.options.data.views.transcriptModalBodyShell ) {
														self.options.data.views.transcriptModalBodyShell.destroy();
													}
													self.options.data.collections.selectedAgentTranscriptCollection.setElement( transcriptModel );
													var options = { data: self.options.data, $wrapper: self.$.modalBodyWrapper, };
													options.data.currentTarget.transcriptModel = transcriptModel;
													self.options.data.views.transcriptModalBodyShell = new BackboneData.TranscriptModalBodyShell( options );
													self.options.data.views.transcriptListShellView.visited.push(transcriptModel.get('interactionId'));
													self.options.data.views.transcriptModalBodyShell.render();
													var transcriptCardView = options.data.views.transcriptCardView[ transcriptModel.get( 'interactionId' ) ]
													if( transcriptModel && transcriptCardView ) {
														transcriptCardView.makeVisited( true );
													}
													
												},

} );	