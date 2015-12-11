BackboneData.MemberListShellView 		= 		Backbone.View.extend( {

	isRendered 						: 			false,

	memberCollection 				: 			{},

	initialize 						: 			function ( options ) {
													var self = this;
													self.options = options;
													self.$wrapper = options.$wrapper;
													self.$el = self.$wrapper
													self.$ = self.$ || {};
													self.headerHeight = 55;
													self.toolbarHeight = 45;
													self.options.data.showing.memberListShellView = self.options.data.showing.memberListShellView || {};
											    },

	render 							: 			function() {
													var self = this;
													var deferred = new $.Deferred();
													// var htmlString = acti.workflow.reports.memberListShell( { attributes: { test: 'TEST'} } );
													var htmlString = acti.workflow.reports.newMemberListShell( { attributes: { test: 'TEST'} } );
													self.$wrapper.html( htmlString );
													self.$container = self.$wrapper.find( 'div#members-list-shell' );
													self.findElements();
													self.onResize();
													self.attachEvents();
													self.isRendered = true;
													deferred.resolve();
													return deferred;
												},

	events 							: 			{
													'click a#member-pane-right-arrow' 				: 			'onMemberPaneRightScrollClick',
													'click a#member-pane-left-arrow' 				: 			'onMemberPaneLeftScrollClick',
												},

	findElements 					: 			function() {
													var self = this;
													self.$container = self.$wrapper.find( 'div#members-list-shell' );
													self.$.membersPane = self.$container.find( 'div.members-pane' );
													self.$.memberCardsTbody = self.$container.find( 'tbody#members-tbody' );
													self.$.memberCardsUl = self.$container.find( 'ul.members-ul' );
													self.$.popOverContainer = self.$container.find( 'div#popover-container' );
													self.$.membersUlWrapper = self.$container.find( 'div.members-ul-wrapper' );
													self.$.memberRightScrollDiv = self.$container.find( 'div#member-list-right-scroll-arrow' );
													self.$.memberLeftScrollDiv = self.$container.find( 'div#member-list-left-scroll-arrow' );
													self.$.memberRightScrollAnchor = self.$.memberRightScrollDiv.find( 'a#member-pane-right-arrow' );
													self.$.memberLeftScrollAnchor = self.$.memberLeftScrollDiv.find( 'a#member-pane-left-arrow' );
												},

	attachEvents 					: 			function() {
													var self = this;
													$( window ).bind( 'resize', function( event ) { self.onResize( event, this ); } );
													self.$.membersUlWrapper.bind( 'scroll', function( event ) { self.onMembersUlScroll( event, this ); } );
												},

	onMembersUlScroll 				: 			function( event, element ) {
													var self = this;
													self.options.data.$.popOverContainer.html( '' );
												},

	renderScrollIcons 				: 			function() {
													var self = this;
													if( self.$.membersUlWrapper.hasScrollBar() ) {
														self.showLeftScroll();
														self.showRightScroll();
													} else {
														self.hideLeftScroll();
														self.hideRightScroll();
													}
												},

	onResize 						: 			function( event ) {
													var self = this;
													var bodyHeight = $( window ).height();
													var memberListHeight = bodyHeight - self.headerHeight - self.toolbarHeight;
													// self.$wrapper.css( { height: memberListHeight + 'px' } );
													// self.$container.css( { height: ( memberListHeight - 1 ) + 'px' } );
													// self.$.membersPane.css( { height: ( memberListHeight - 1 ) + 'px' } );
												},

	onMemberPaneRightScrollClick 	: 			function( events ) {
													var self = this;
													self.scroll( 'right', 100 );
												},

	onMemberPaneLeftScrollClick 	: 			function( event ) {
													var self = this;
													self.scroll( 'left', 100 );
												},

	scroll 		 					: 			function( direction, incrementBy, atRightEnd, atLeftEnd ) {
													var self = this;
													var incrementBy = incrementBy || 5;
													switch( direction ) {
														case 'right' :
															incrementBy = incrementBy;
															break;
														case 'left' :
															incrementBy = - incrementBy;
															break;
													}
													self.$.membersUlWrapper.scrollLeft( self.$.membersUlWrapper.scrollLeft() + incrementBy );
												},

	showRightScroll 				: 			function() {
													var self = this;
													self.$.memberRightScrollDiv.fadeIn( 200 );
												},

	showLeftScroll 					: 			function() {
													var self = this;
													self.$.memberLeftScrollDiv.fadeIn( 200 );
												},

	hideRightScroll 				: 			function() {
													var self = this;
													self.$.memberRightScrollDiv.fadeOut( 200 );
												},

	hideLeftScroll 					: 			function() {
													var self = this;
													self.$.memberLeftScrollDiv.fadeOut( 200 );
												},

	destroy 						: 			function() {
													var self = this;
													if( self.$container ) self.$container.remove();
													self.isRendered = false;
												},

	clearAllMemberCard 				: 			function( isRemoveShowingData ) {
													var self = this;
													for( var agentLogin in self.options.data.views.memberCardView ) {
														self.options.data.views.memberCardView[ agentLogin ].destroy();
														delete self.options.data.views.memberCardView[ agentLogin ];
													}
													self.options.data.$.popOverContainer.html( '' );
													options.data.views.memberListShellView.$.memberCardsUl.html( '' );
													if( isRemoveShowingData ) delete self.options.data.showing.memberListShellView.subAccountDetails; 
													self.options.data.views.transcriptListShellView.clearAllTranscriptCard( isRemoveShowingData );
													self.options.data.showing.memberListShellView.subAccountDetails = {};
												},

	makeActive 						: 			function( agentLogin ) {
													var self = this;
													for( var agentLoginKey in self.options.data.views.memberCardView ) {
														if( agentLoginKey == agentLogin )
															self.options.data.views.memberCardView[ agentLoginKey ].active( true );
														else {
															self.options.data.views.memberCardView[ agentLoginKey ].active( false );
														}
													}
												},

	selectAgent						: 			function( agentLogin ) {
													var self = this;
													var deferred = new $.Deferred();	
													var memberCardView = self.options.data.views.memberCardView[ agentLogin ];
													if( memberCardView ) {
														memberCardView.loadTranscripts().done( function() { deferred.resolve(); } ).fail( function() { deferred.reject(); } );
													} else {
														messageWindow.popUpMessage( 'No&nbsp;such&nbsp;agent&nbsp;found' );
                                                        deferred.reject();
													}
													return deferred;
												},

	displayMembers			 		: 			function( collection, subAccountDetails, forceRender ) {
													var self = this;
													var returnDeferred = new $.Deferred();
													var agentLoginIdToFetchContact = [];
													if( forceRender || JSON.stringify( self.options.data.showing.memberListShellView.subAccountDetails ) != JSON.stringify( subAccountDetails ) ) {
														var currentSubAccountTransciptCollection = ( collection || self.options.data.collections.selectedSubAccountTranscriptCollection );
														var groupedByAgentSelectedSubAccount = currentSubAccountTransciptCollection.groupBy( 'AgentLogin' );
														for( var agentLogin in groupedByAgentSelectedSubAccount ) {
															agentLoginIdToFetchContact.push( agentLogin );
														}
														self.options.data.collections.contactCollection = self.options.data.collections.contactCollection || new BackboneData.ContactCollection( self.options );
														var operationsToPerformAfterFetchingContacts = function() {
															self.clearAllMemberCard( !forceRender );
															if( subAccountDetails ) { self.options.data.showing.memberListShellView.subAccountDetails = subAccountDetails; }
															if( Object.keys( groupedByAgentSelectedSubAccount ).length == 0 ) {
																if( !forceRender ) { messageWindow.popUpMessage( 'None&nbsp;took&nbsp;interaction', 2 * 1000, true /* now */ ); }
															} else {
																self.renderMemberCard( 'All', self.options.data.collections.selectedSubAccountTranscriptCollection.models );
															}
															
															var agent = self.sortAgentByInteractionCount(groupedByAgentSelectedSubAccount); //flow modify
															
															for(var i = agent.length-1; i >= 0; i--) {
																agentLogin = agent[i].get("agentID");
																if( agentLogin && agentLogin != 'null' && agentLogin != 'NA' && agentLogin !='System' )
																	self.renderMemberCard( agentLogin, groupedByAgentSelectedSubAccount[ agentLogin ] );
															}
															self.renderScrollIcons();
															returnDeferred.resolve( self.options.data.collections.selectedAccountTranscriptCollection );
														};
														// operationsToPerformAfterFetchingContacts();
														agentLoginIdToFetchContact = agentLoginIdToFetchContact.filter( function( element ) { return element != null && element != 'null' && element != 'NA' && element != 'All' && element != 'system'; } );
														// console.log( agentLoginIdToFetchContact );
														if( !forceRender && !isLoaded) { messageWindow.showMessage( 'Loading&nbsp;reports...', true /* now */ ); }
														self.options.data.collections.contactCollection.getContacts( agentLoginIdToFetchContact )
															.done( 	function() { if( !forceRender && !isLoaded) { messageWindow.popUpMessage( 'Loaded&nbsp;reports&nbsp;successfully!', 5 * 1000, true /* now */ ); isLoaded = true; } operationsToPerformAfterFetchingContacts(); } )
																.fail( function() { operationsToPerformAfterFetchingContacts(); console.error( 'Failed to fetchContacts.' ); messageWindow.showMessage( 'Failed&nbsp;to&nbsp;fetch&nbsp;reports' ); } );
													} else {
														returnDeferred.resolve();
													}
													return returnDeferred;
												},

	renderMemberCard 				: 			function( agentLogin, transcriptModelArray ) {
													var self = this;
													var options = { data: self.options.data, $: {} };
													options.$.membersUlWrapper = self.$.membersUlWrapper;
													options.$.popOverContainer = self.$.popOverContainer;
													self.memberCollection[ agentLogin ] = { id: Helper.generateUniqueId() };
													var selectedAgentTranscriptCollection = new BackboneData.TranscriptCollection( transcriptModelArray, self.options );
													options.agentDetails = { id: self.memberCollection[ agentLogin ].id, agentLogin: agentLogin, interactionTotal: transcriptModelArray.length, selectedAgentTranscriptCollection: selectedAgentTranscriptCollection };
													// options.$wrapper = self.$.memberCardsTbody;
													options.$wrapper = self.$.memberCardsUl;
													var memberCardView = new BackboneData.MemberCardView( options );
													self.options.data.views.memberCardView[ ( agentLogin && agentLogin != 'null' ) ? agentLogin : 'NA' ] =  memberCardView;
													memberCardView.render();
													try {
														//if( self.options.data.showing.transcriptListShellView.agentLogin == ( ( agentLogin && agentLogin != 'null' ) ? agentLogin : 'NA' ) ) memberCardView.active( true );
													} catch( exception ) {
														console.info( 'Exception: But we can ignore this.', exception.message, exception );
													}
												},
	sortAgentByInteractionCount			: 			function(groupedByAgentSelectedSubAccountt) {
													var Agent = Backbone.Collection.extend({});
													var agent = new Agent();
													for(var agentID in groupedByAgentSelectedSubAccountt ){
													agent.add({"agentID" : agentID, interactionLength : groupedByAgentSelectedSubAccountt[agentID].length });
													}
													agent = agent.sortBy("interactionLength");
													return agent;
												},
												

} );

/* Extending JQuery to find whether a div has scrollbar */
$.fn.hasScrollBar 					= 			function() {
												    //note: clientHeight= height of holder
												    //scrollHeight= we have content till this height
												    var _elm = $(this)[0];
												    var _hasScrollBar = false; 
												    if ((_elm.clientHeight < _elm.scrollHeight) || (_elm.clientWidth < _elm.scrollWidth)) {
												        _hasScrollBar = true;
												    }
												    return _hasScrollBar;
												};