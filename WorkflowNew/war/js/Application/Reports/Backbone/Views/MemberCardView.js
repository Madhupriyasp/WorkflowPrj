BackboneData.MemberCardView	 		= 		Backbone.View.extend( {

	isRendered 						: 			false,

	activeState 					: 			false,

	initialize 						: 			function ( options ) {
													var self = this;
													self.options = options;
													self.agentDetails = options.agentDetails;
													self.$wrapper = options.$wrapper;
													self.$el = self.$wrapper;
													self.$ = options.$ || {};
											    },

	render 							: 			function() {
													var self = this;
													var deferred = new $.Deferred();
													var agentContact = null;
													var photoID = '/images/user-icon.jpg';
													var agentName = ( self.agentDetails.agentLogin != 'null' ) ? self.agentDetails.agentLogin : 'NA';
													var afterGettingContact = function() {
														if( self.agentDetails.agentLogin && self.agentDetails.agentLogin != 'null' && self.agentDetails.agentLogin != 'All' ) {
															agentContact = self.options.data.collections.contactCollection.get( self.agentDetails.agentLogin.toLowerCase() );
															if( agentContact ) {
																agentName = agentContact.getName();
																if( agentContact.get( 'photoID' ) ) {
																	photoID =  agentContact.get( 'photoID' );
																}
																self.agentDetails.selectedAgentTranscriptCollection.each( 	function( model ) {
																																model.set( 'agentName', agentName );
																																model.set( 'agentPhotoID', photoID );
																															} );
															}
														}
														var htmlString = acti.workflow.reports.newNewNewMemberCard( { attributes: { id: self.agentDetails.id, agentName: agentName, agentPhotoURL: photoID, interactionTotal: self.agentDetails.interactionTotal, averageDuration: self.agentDetails.selectedAgentTranscriptCollection.getMeanDuration(), averageTTA: self.agentDetails.selectedAgentTranscriptCollection.getAverageTTA(), averageTTC: self.agentDetails.selectedAgentTranscriptCollection.getAverageTTC() } } );
														self.$wrapper.append( htmlString );
														self.findElements();
														self.attachEvents();
														deferred.resolve();
														self.isRendered = true;
													};
													/*
													// var htmlString = acti.workflow.reports.memberCard( { attributes: { id: self.agentDetails.id, agentName: ( self.agentDetails.agentLogin != 'null' ) ? self.agentDetails.agentLogin : 'NA', agentPhotoURL: '/images/user-icon.jpg', interactionTotal: self.agentDetails.interactionTotal } } );
													if( self.agentDetails.agentLogin && self.agentDetails.agentLogin != 'null' ) {
														self.options.data.collections.contactCollection.getContact( self.agentDetails.agentLogin.toLowerCase() )
															.done( function() { afterGettingContact(); } )
																.fail( function() { afterGettingContact(); } );
													} else {
														afterGettingContact();
													}
													*/
													afterGettingContact();
													return deferred;
												},

	attachEvents 					: 			function() {
													var self = this;
													// var groupedByInteractionTypeId = self.options.data.collections.selectedAccountCollection.groupBy( 'campaign' );
													var optionsForTemplate = [];
													if( self.agentDetails.selectedAgentTranscriptCollection.length > 0 ) {
														var groupedByInteractionType = {};
														var groupedBySubAccountNumber = self.agentDetails.selectedAgentTranscriptCollection.groupBy( 'subAccountNumber' );

														/* Algorithm to display by accountNumber */
														for( var subAccountNumber in groupedBySubAccountNumber ) {
															var completedTranscriptLength = new BackboneData.TranscriptCollection( groupedBySubAccountNumber[ subAccountNumber ], self.options ).filterByStatusLike( "Completed" ).length; 
															var inqueueTranscriptLength = new BackboneData.TranscriptCollection( groupedBySubAccountNumber[ subAccountNumber ], self.options ).filterByStatusLike( self.options.data.collections.transcriptCollection.inqueueStatuses ).length;
															var interactionTypeId = self.options.data.collections.subAccountCollection.get( subAccountNumber ).get( 'interactionTypeId' ); //Later Change it to selectedSubAccountCollection
															var interactionTypeDetails = $.extend( {}, self.options.data.linkedObjects.interactionType[ interactionTypeId ] );
															interactionTypeDetails.name = subAccountNumber;
															var accountDetails = { completedTranscriptLength: completedTranscriptLength, inqueueTranscriptLength: inqueueTranscriptLength, interactionTypeDetails: interactionTypeDetails, };
															optionsForTemplate.push( accountDetails );
														}
														
														/*
														Algorithm to display details by interactionType

														for( var subAccountNumber in groupedBySubAccountNumber ) {
															var completedTranscriptLength = new BackboneData.TranscriptCollection( groupedBySubAccountNumber[ subAccountNumber ], self.options ).filterByStatusLike( 'completed' ).length;
															var inqueueTranscriptLength = new BackboneData.TranscriptCollection( groupedBySubAccountNumber[ subAccountNumber ], self.options ).filterByStatusLike( 'inqueue' ).length;
															var interactionTypeId = self.options.data.collections.selectedSubAccountCollection.get( subAccountNumber ).get( 'campaign' );
															var interactionTypeDetails = self.options.data.linkedObjects.interactionType[ interactionTypeId ];
															if( groupedByInteractionType[ interactionTypeDetails.name ] ) {
																groupedByInteractionType[ interactionTypeDetails.name ].completedTranscriptLength = groupedByInteractionType[ interactionTypeDetails.name ].completedTranscriptLength + completedTranscriptLength;
																groupedByInteractionType[ interactionTypeDetails.name ].inqueueTranscriptLength = groupedByInteractionType[ interactionTypeDetails.name ].inqueueTranscriptLength + inqueueTranscriptLength;
															} else {
																groupedByInteractionType[ interactionTypeDetails.name ] = { completedTranscriptLength: completedTranscriptLength, inqueueTranscriptLength: inqueueTranscriptLength, interactionTypeDetails: interactionTypeDetails };
															}
														}
														for( var interactionTypeName in groupedByInteractionType ) {
															optionsForTemplate.push( groupedByInteractionType[ interactionTypeName ] );
														}
														*/
													}

													self.$.memberCardButton.bind( 'click', function( event ) { self.onMemberCardButtonClick( event, this ); } );
													// self.$.memberCardButton.bind( 'mouseenter', function( event ) { self.onMemberCardButtonMouseEnter( event, this ); } );
													// self.$.memberCardButton.bind( 'mouseout', function( event ) { self.onMemberCardButtonMouseOut( event, this ); } );
													self.$.membersUlWrapper.bind( 'scroll', function( event ) { self.onMembersUlWrapperScroll( event, this ); } );
													self.$.memberCardButton.popover( { trigger: 'hover', html: true, content: acti.workflow.reports.interactionPopOverContent({attributes:{ interactionsOptionsArray: optionsForTemplate }}), placement: 'bottom', title: 'Interaction Break Down', container: "#popover-container", customOffset: { offset1: 0/* 71 */, offset2: 50 } } );
												},

	findElements 					: 			function() {
													var self = this;
													self.$container = self.$wrapper.find( 'li#' + self.agentDetails.id + '.member-card-li' );
													self.$.memberCard = self.$container.find( 'div.member-card' );
													self.$.memberCardButton = self.$container.find( 'button.member-card-button' );
												},

	onMemberCardButtonClick			: 			function( event, element ) {
													var self = this;
													self.options.data.routers.reportsRouter.navigate( self.options.data.url.accountNumber + '/' + self.options.data.url.subAccountDetails.subAccountNumber + '/' + self.options.data.url.subAccountDetails.fromDate + '/' + self.options.data.url.subAccountDetails.toDate + '/' + ( ( self.agentDetails.agentLogin && self.agentDetails.agentLogin != 'null' ) ? self.agentDetails.agentLogin : 'NA' ), { trigger: true, replace: true /* Will not create history */ } );
												},

	loadTranscripts 				: 			function() {
													var self = this;
													var deferred = new $.Deferred();
													if( ! self.active() ) {
														//self.options.data.showing.transcriptListShellView = self.options.data.showing.transcriptListShellView || {};
														self.options.data.collections.selectedAgentTranscriptCollection = self.agentDetails.selectedAgentTranscriptCollection;
														self.options.data.collections.selectedAgentTranscriptCollection.sortByKey( 'date' );
														self.options.data.views.memberListShellView.makeActive( ( self.agentDetails.agentLogin != 'null' ) ? self.agentDetails.agentLogin : 'NA' );
														return self.options.data.views.transcriptListShellView.displayTranscripts( null, null, self.agentDetails.agentLogin );
													} else {
														deferred.resolve(); 		// Since already active
													}
													return deferred;
												},

	onMemberCardButtonMouseEnter	: 			function( event, element ) {
													var self = this;
													// $( element ).popover( 'show' );
												},

	onMemberCardButtonMouseOut 		: 			function( event, element ) {
													var self = this;
													// $( element ).popover( 'hide' );
												},

	onMembersUlWrapperScroll 		: 			function( event, element ) {
													var self = this;
													self.options.data.$.popOverContainer.html( '' );
													// self.$.memberCardButton.popover( 'hide' );
												},

	showPopOver 					: 			function() {
													var self = this;
													self.$.memberCardButton.popover( 'show' );
												},

	select 							: 			function() {

												},

	active 							: 			function( state ) {
													var self = this;
													if( arguments.length != 0 ) {
														if( typeof( state ) == 'boolean' ) {
															if( state && !self.$.memberCard.hasClass( 'active' ) ) {
																self.$.memberCard.addClass( 'active' );
																// self.showPopOver();
																self.activeState = true;
															} else if( !state && self.$.memberCard.hasClass( 'active' ) ) {
																self.$.memberCard.removeClass( 'active' );
																self.activeState = false;
															}
														}
													} else {
														return self.activeState;
													}
												},

	destroy 						: 			function() {
													var self = this;
													if( self.$container ) self.$container.remove();
													self.isRendered = false;
												},

} );