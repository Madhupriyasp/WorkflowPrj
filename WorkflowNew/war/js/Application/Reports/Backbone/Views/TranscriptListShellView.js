BackboneData.TranscriptListShellView = 		Backbone.View.extend( {

	isRendered 						: 			false,
	
	visited							:			[],

	initialize 						: 			function ( options ) {
													var self = this;
													self.options = options;
													self.$wrapper = options.$wrapper;
													self.$el = self.$wrapper;
													self.$ = {};
													self.headerHeight = 55;
													self.toolbarHeight = 45;
													self.memberListHeight = 120 + 2 /* border */;
											    },

	events 							: 			{
													'click a#sort-by-account-id' 					: 			'onSortByAcountIdClick',
													'click a#sort-by-account-name' 					: 			'onSortByAccountNameClick',
													'click a#sort-by-recieved-by' 					: 			'onSortByARecievedByClick',
													'click a#sort-by-status' 						: 			'onSortByStatusClick',
													'click a#sort-by-recieved' 						: 			'onSortByRecievedClick',
													'click a#sort-by-completed' 					: 			'onSortByCompletedClick',
													'click a#sort-by-tta' 							: 			'onSortByTTAClick',
													'click a#sort-by-duration' 						: 			'onSortByDurationClick',
													'click a#sort-by-ttc' 							: 			'onSortByTTCClick',
												},

	render 							: 			function() {
													var self = this;
													var deferred = new $.Deferred();
													var htmlString = acti.workflow.reports.transcriptListShell( { attributes: { test: 'TEST', timeZone: timezone, } } );
													self.$wrapper.append( htmlString );
													self.findElements();
													self.onResize();
													self.attachEvents();
													self.isRendered = true;
													deferred.resolve();
													return deferred;
												},

	attachEvents 					: 			function() {
													var self = this;
													$( window ).bind( 'resize', function( event ) { self.onResize( event, this ); } );
													self.$.transcriptTable.floatThead( { scrollContainer: function ( $table ) { return $table.closest( '#transcript-table-wrapper' ); }, } );
												},

	reflowTable 					: 			function() {
													var self = this;
													self.$.transcriptTable.floatThead( 'reflow' );
												},

	findElements 					: 			function() {
													var self = this;
													self.$container = self.$wrapper.find( 'div#transcript-list-shell' );
													self.$.tracscriptTableWrapper = self.$container.find( 'div#transcript-table-wrapper' );
													self.$.transcriptTable = self.$container.find( 'table#transcript-table' );
													self.options.data.$.transcriptTable = self.$.transcriptTable;
													self.$.transcriptTableBody = self.$.transcriptTable.find( 'tbody#transcript-table-tbody' );
												},

	onResize 						: 			function( event, element ) {
													var self = this;
													var bodyHeight = $( window ).height();
													var transcriptListShellHeight = bodyHeight - ( self.headerHeight + self.toolbarHeight + self.memberListHeight );
													self.$container.css( { height: transcriptListShellHeight + 'px' } );
													self.$.tracscriptTableWrapper.css( { height: transcriptListShellHeight + 'px' } );
												},

	clearAllTranscriptCard 			: 	 		function( isRemoveShowingData ) {
													var self = this;
													for( var interactionId in self.options.data.views.transcriptCardView ) {
														self.options.data.views.transcriptCardView[ interactionId ].destroy();
														delete self.options.data.views.transcriptCardView[ interactionId ];
													}
													if( isRemoveShowingData ) delete self.options.data.showing.transcriptListShellView;
												},

	displayTranscripts 				: 			function( transcriptCollection, forceRender, agentLogin ) {
													var self = this;
													var deferred = new $.Deferred();
													if( forceRender || JSON.stringify( self.options.data.showing.transcriptListShellView ) != JSON.stringify( { agentLogin: self.options.data.url.agentLogin, accountNumber: self.options.data.url.accountNumber, subAccountDetails: self.options.data.url.subAccountDetails } ) ) {
														self.clearAllTranscriptCard( !forceRender );
														var transcriptCollectionToRender = transcriptCollection || self.options.data.collections.selectedAgentTranscriptCollection;
														transcriptCollectionToRender.each(	function( model ) {
																								var options = { data: self.options.data, };
																								options.data.currentTarget.transcriptModel = model;
																								options.$wrapper = self.$.transcriptTableBody;
																								var transcriptCardView = new BackboneData.TranscriptCardView( options )
																								self.options.data.views.transcriptCardView[ model.get( 'interactionId' ) ] =  transcriptCardView;
																								transcriptCardView.render();
																								if(self.visited && self.visited.indexOf(model.get('interactionId'))!=-1)
																									transcriptCardView.makeVisited(true);																							} );
														if( agentLogin ) {
															self.options.data.showing.transcriptListShellView = self.options.data.showing.transcriptListShellView || {};
															self.options.data.showing.transcriptListShellView.agentLogin = ( agentLogin != 'null' ) ? agentLogin : 'NA';
															self.options.data.showing.transcriptListShellView.accountNumber = self.options.data.url.accountNumber;
															self.options.data.showing.transcriptListShellView.subAccountDetails = self.options.data.url.subAccountDetails;
														}
														// self.options.data.showing.transcriptListShellView = { transcriptCollection: transcriptCollectionToRender };
													}
													deferred.resolve();
													return deferred;
												},

	destroy 						: 			function() {
													var self = this;
													if( self.$container ) self.$container.remove();
													self.isRendered = false;
												},

	/* Sorting Functions Starts */

	onSortByAcountIdClick 			: 			function() {
													var self = this;
													self.sortByKey( 'subAccountNumber' );
												},

	onSortByAccountNameClick 		: 			function() {
													var self = this;
													self.sortByKey( 'domain' );
												},

	onSortByARecievedByClick		: 			function() {
													var self = this;
													self.sortByKey( 'AgentLogin' );
												},

	onSortByStatusClick 			: 			function() {
													var self = this;
													self.sortByKey( 'action' );
												},

	onSortByRecievedClick 			: 			function() {
													var self = this;
													self.sortByKey( 'recievedTime' );
												},

	onSortByCompletedClick 			: 			function() {
													var self = this;
													self.sortByKey( 'completedTime' );
												},

	onSortByTTAClick 				: 			function() {
													var self = this;
													self.sortByKey( 'timeTakenToAnswer' );
												},

	onSortByDurationClick 			: 			function() {
													var self = this;
													self.sortByKey( 'duration' );
												},

	onSortByTTCClick 				: 			function() {
													var self = this;
													self.sortByKey( 'timeTakenToComplete' );
												},

	sortByKey 						: 			function( key ) {
													var self = this;
													
													if($("#find-player").val() && searchedSelectedAgentTranscriptCollection.length > 0)
													{
														searchedSelectedAgentTranscriptCollection.toggleSortOrder();
														searchedSelectedAgentTranscriptCollection.sortByKey( key );
														self.displayTranscripts( searchedSelectedAgentTranscriptCollection, true /* forceRender */, self.options.data.url.AgentLogin );
													}
													if(self.options.data.collections.selectedSubAccountTranscriptCollection.length > 0 && !!! $("#find-player").val())
													{
														console.log( 'TranscriptListShellView :: Sorting by key :: ', key );
														self.options.data.collections.selectedAgentTranscriptCollection.toggleSortOrder();
														self.options.data.collections.selectedAgentTranscriptCollection.sortByKey( key );
														self.displayTranscripts( null, true /* forceRender */, self.options.data.url.AgentLogin );
													}
												},

} );