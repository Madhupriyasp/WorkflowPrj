BackboneData.TranscriptDetailsToolbarView	= 		Backbone.View.extend( {

	isRendered 						: 			false,

	fetchedAccount 					: 			null,

	origin 							: 			'TranscriptToolbarView',

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
													var htmlString = acti.workflow.reports.transcriptDetailsToolbar( { attributes: { test: 'TEST', } } );
													self.$wrapper.html( htmlString );
													self.findElements();
													self.attachEvents();
													self.onResize();
													self.showOrHideNavigationIcon();
													self.isRendered = true;
													deferred.resolve();
													return deferred;
												},

	events							: 			{
													'click a#message-view' 						: 				'onMessageViewClick',
													'click a#table-view' 						: 				'onHistoryViewClick',
													'click a#next-transcript' 					: 				'onPrevTranscriptClick',
													'click a#prev-transcript' 					: 				'onNextTranscriptClick',
												},

	findElements 					: 			function() {
													var self = this;
													self.$container = self.$wrapper.find( 'div#transcript-details-toolbar' );
													self.$.historyViewAnchor = self.$container.find( 'a#table-view' );
													self.$.messageViewAnchor = self.$container.find( 'a#message-view' );
													self.$.prevTranscriptAnchor = self.$container.find( 'a#next-transcript' );
													self.$.nextTranscriptAnchor = self.$container.find( 'a#prev-transcript' );
												},

	attachEvents 					: 			function() {
													var self = this;
													$( window ).resize( function( event ) { self.onResize( event, this ); } );
												},

	showOrHideNavigationIcon 		: 			function() {
													var self = this;
													if( ! self.options.data.collections.selectedAgentTranscriptCollection.getNextModel() ) {
														if( ! self.$.nextTranscriptAnchor.hasClass( 'inactive' ) ) self.$.nextTranscriptAnchor.addClass( 'inactive' );
													} else {
														self.$.nextTranscriptAnchor.removeClass( 'inactive' );
													}
													if( ! self.options.data.collections.selectedAgentTranscriptCollection.getPrevModel() ) {
															if( ! self.$.prevTranscriptAnchor.hasClass( 'inactive' ) ) self.$.prevTranscriptAnchor.addClass( 'inactive' );
													} else {
														self.$.prevTranscriptAnchor.removeClass( 'inactive' );
													}
												},

	onResize 						: 			function( event, element ) {
													var self = this;
													var windowHeight = $( window ).height();
												},

	onNextTranscriptClick 			: 			function( event ) {
													var self = this;
													if( ! self.$.nextTranscriptAnchor.hasClass( 'inactive' ) ) {
														self.options.data.routers.reportsRouter.navigate( self.options.data.url.accountNumber + '/' + self.options.data.url.subAccountDetails.subAccountNumber + '/' + self.options.data.url.subAccountDetails.fromDate + '/' + self.options.data.url.subAccountDetails.toDate + '/' + self.options.data.url.agentLogin + '/' + self.options.data.collections.selectedAgentTranscriptCollection.getNextModel().get( 'interactionId' ) + '/' + self.options.data.url.interactionDetails.interactionDetailsTab, { trigger: true, replace: true /* Will not create history */ } );
													}else{
														messageWindow.popUpMessage("No more interactions", 1000*2, true , true);
													}
												},

	onPrevTranscriptClick 			: 			function( event ) {
													var self = this;
													if( ! self.$.prevTranscriptAnchor.hasClass( 'inactive' ) ) {
														self.options.data.routers.reportsRouter.navigate( self.options.data.url.accountNumber + '/' + self.options.data.url.subAccountDetails.subAccountNumber + '/' + self.options.data.url.subAccountDetails.fromDate + '/' + self.options.data.url.subAccountDetails.toDate + '/' + self.options.data.url.agentLogin + '/' +  self.options.data.collections.selectedAgentTranscriptCollection.getPrevModel().get( 'interactionId' ) + '/' + self.options.data.url.interactionDetails.interactionDetailsTab, { trigger: true, replace: true /* Will not create history */ } );
													}else{
														messageWindow.popUpMessage("No more interactions", 1000*2, true , true);
													}
												},

	onMessageViewClick 				: 			function( event ) {
													var self = this;
													self.options.data.routers.reportsRouter.navigate( self.options.data.url.accountNumber + '/' + self.options.data.url.subAccountDetails.subAccountNumber + '/' + self.options.data.url.subAccountDetails.fromDate + '/' + self.options.data.url.subAccountDetails.toDate + '/' + self.options.data.url.agentLogin + '/' + self.options.data.url.interactionDetails.interactionId + '/' + 'message', { trigger: true, replace: true /* Will not create history */ } );
												},

	onHistoryViewClick 				: 			function( event ) {
													var self = this;
													self.options.data.routers.reportsRouter.navigate( self.options.data.url.accountNumber + '/' + self.options.data.url.subAccountDetails.subAccountNumber + '/' + self.options.data.url.subAccountDetails.fromDate + '/' + self.options.data.url.subAccountDetails.toDate + '/' + self.options.data.url.agentLogin + '/' + self.options.data.url.interactionDetails.interactionId + '/' + 'history', { trigger: true, replace: true /* Will not create history */ } );
												},

	makeMessageViewActive 			: 			function() {
													var self = this;
													self.setMessageViewAnchorStatus( true );
													self.setHistoryViewAnchorStatus( false );
												},

	makeHistoryViewActive 			: 			function() {
													var self = this;
													self.setMessageViewAnchorStatus( false );
													self.setHistoryViewAnchorStatus( true );
												},

	setMessageViewAnchorStatus 		: 			function( activeStatus ) {
													var self = this;
													if( self.$.messageViewAnchor.hasClass( 'active' ) ) {
														if( ! activeStatus )
															self.$.messageViewAnchor.removeClass( 'active' );
													} else {
														if( activeStatus ) {
															self.$.messageViewAnchor.addClass( 'active' );
														}
													}
												},

	setHistoryViewAnchorStatus 		: 			function( activeStatus ) {
													var self = this;
													if( self.$.historyViewAnchor.hasClass( 'active' ) ) {
														if( ! activeStatus )
															self.$.historyViewAnchor.removeClass( 'active' );
													} else {
														if( activeStatus ) {
															self.$.historyViewAnchor.addClass( 'active' );
														}
													}
												},

	destroy 						: 			function() {
													var self = this;
													if( self.$container ) self.$container.remove();
													delete self.options.data.views.transcriptDetailsToolbarView;
													self.isRendered = false;
												},

} );