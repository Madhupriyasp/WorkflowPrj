BackboneData.TeamPaneShellView 		= 		Backbone.View.extend( {

	isRendered 						: 			false,

	origin 							: 			'TeamPaneShellView',

	initialize 						: 			function ( options ) {
													var self = this;
													self.options = options;
													self.$wrapper = options.$wrapper;
													self.$el = self.$wrapper;
													self.$ = self.$ || {};
													self.headerHeight = 55;
													self.options.data.showing.teamPaneShellView = self.options.data.showing.teamPaneShellView || {};
											    },

	render 							: 			function() {
													var self = this;
													var deferred = new $.Deferred();
													var htmlString = acti.workflow.reports.newTeamPaneShell( { attributes: { test: 'TEST', mainAccountNumber: 'Account Number' } } );
													self.$wrapper.html( htmlString );
													self.findElements();
													self.onResize();
													self.attachEvents();
													self.showHeader();
													self.isRendered = true;
													deferred.resolve();
													return deferred;
												},

	events 							: 			{
													'click div#main-account-number' 				: 			'onMainAccountClick',
													'keyup input#search-team-input' 				: 			'onSearchTeamInputKeyDown',
												},

	findElements 					: 			function() {
													var self = this;
													self.$container = self.$wrapper.find( 'div#team-pane-shell' );
													self.$.teamCardsTbody = self.$container.find( 'tbody#team-cards-tbody' );
													self.$.teamList = self.$container.find( 'div#team-list' );
													self.$.teamPaneHeader = self.$container.find( 'div#team-pane-header' );
													self.$.headerMainAccountNumber = self.$container.find( 'div#main-account-number' );
													self.$.teamSearchInput = self.$container.find( 'input#search-team-input' );
												},

	attachEvents 					: 			function() {
													var self = this;
													$( window ).bind( 'resize', function( event ) { self.onResize( event ); } );
												},

	onMainAccountClick 				: 			function( event ) {
													var self = this;
													// self.displayMainAccountReport();
													self.options.data.routers.reportsRouter.navigate( self.options.data.url.accountNumber + '/' + self.options.data.url.accountNumber + '/' + self.options.data.url.subAccountDetails.fromDate + '/' + self.options.data.url.subAccountDetails.toDate, { trigger: true, replace: true /* Will not create history */ } );
												},

	onSearchTeamInputKeyDown 		: 			function( event ) {
													var self = this;
													console.log( 'Key down!' );
													self.searchTeam( self.$.teamSearchInput.val() );
												},

	onResize 						: 			function( event ) {
													var self = this;
													var bodyHeight = $( window ).height();
													var mainContainerHeight = bodyHeight - self.headerHeight;
													self.$wrapper.css( { height: mainContainerHeight + 'px' } );
													var teamPaneHeaderHeight = self.$.teamPaneHeader.height() + 2 /* TeamPaneHeader border */;
													self.$.teamList.css( { height: ( mainContainerHeight - ( (self.$.teamPaneHeader.css( 'display' ) != 'none') ? teamPaneHeaderHeight : 0 ) ) + 'px' } );
												},

	setMainAccountNumber 			: 			function( mainAccountNumber ) {
													var self = this;
													if( mainAccountNumber )
														self.$.headerMainAccountNumber.html( mainAccountNumber );
												},

	showHeader 						: 			function() {
													var self = this;
													// self.$.teamPaneHeader.fadeIn( null, function() { self.onResize(); } );
													self.$.teamPaneHeader.show();
													self.onResize();
												},

	hideHeader 						: 			function() {
													var self = this;
													// self.$.teamPaneHeader.fadeOut( null, function() { self.onResize(); } );
													self.$.teamPaneHeader.hide();
													self.onResize();
												},

	destroy 						: 			function() {
													var self = this;
													if( self.$container ) self.$container.remove();
													self.isRendered = false;
												},

	fetchTranscripts 				: 			function( subAccountCollection ) {
													
												},

	makeActive 						: 			function( subAccountNumber ) {
													var self = this;
													if(!!isMainAccountNumber && !self.options.data.collections.subAccountCollection.isSubAccountNumber(self.options.data.url.subAccountDetails.subAccountNumber))
														subAccountNumber = 'Accounts'
															
													for( var subAccountNumberKey in self.options.data.views.teamCardView ) {
														if( subAccountNumberKey == subAccountNumber )
															self.options.data.views.teamCardView[ subAccountNumberKey ].active( true );
														else
															self.options.data.views.teamCardView[ subAccountNumberKey ].active( false );
													}
												},

	fetchAccount 					: 			function( accountNumber ) {
													var self = this;
													var accountNumberAry = [];
													var operationToPerform = [];
													var returnDeferred = new $.Deferred();
													if(!isLoaded)
														messageWindow.showMessage( 'Fetching account(s)...' );
													console.log( self.origin, ' :: ', 'Fetching Account.... : "' + accountNumber + '"' );
													self.options.data.collections.subAccountCollection = self.options.data.collections.subAccountCollection || new BackboneData.SubAccountCollection( null, self.options );
													//self.options.data.collections.subAccountCollection = self.options.data.collections.subAccountCollection.excludeByInteractionType(); //flow modify
													accountNumberAry = accountNumber.split(",");
													for(var index in accountNumberAry)
													{
														var fetchSubAccountNumberDeferred = self.options.data.collections.subAccountCollection.fetchAccount( accountNumberAry[index] );
														operationToPerform.push(fetchSubAccountNumberDeferred);
													}
													
													
													$.when.apply($,operationToPerform)
														.done(
																function( filteredSubAccountCollection ) {
																	filteredSubAccountCollection.sortByKey( 'subAccountNumber' ); //flow acc modify
																	self.options.data.collections.selectedSubAccountCollection = new BackboneData.SubAccountCollection();
																	for(var index in accountNumberAry)
																	{
																		 if(isNaN(accountNumberAry[index]))
																			 self.options.data.collections.selectedSubAccountCollection.add(self.options.data.collections.subAccountCollection.getSubAccountCollectionBySkill(accountNumberAry[index]).models);
																		 else
																			 self.options.data.collections.selectedSubAccountCollection.add(self.options.data.collections.subAccountCollection.getSubAccountCollectionByAccountNumber(accountNumberAry[index]).models);
																	}
																	if( self.options.data.collections.selectedSubAccountCollection.length > 0 ) {
																		self.displayTeamCard( self.options.data.collections.selectedSubAccountCollection, accountNumber )
																			.done( function( subAccountCollection ) { returnDeferred.resolve( subAccountCollection ); } )
																				.fail( function() { returnDeferred.reject(); } );
																		returnDeferred.resolve();
																	} else {
																		messageWindow.popUpMessage( 'Invalid&nbsp;Account!', 2 * 1000 );
																		self.clearAllTeamCard();
																		self.options.data.views.transcriptListShellView.clearAllTranscriptCard();
																		self.options.data.views.memberListShellView.clearAllMemberCard();
																		returnDeferred.reject();
																	}
																} 
															)
															.fail( function() { messageWindow.popUpMessage( 'Fetch&nbsp;failed!', 2 * 1000 ); returnDeferred.reject(); } );
													// window.setTimeout( function() { if( getSubAccountNumberDeferred.state() == 'pending' ) messageWindow.popUpMessage( 'Oops! Something&nbsp;went&nbsp;wrong!', 3 * 1000 ); }, 7 * 1000 );
													return returnDeferred;
												},

	clearAllTeamCard 				: 			function() {
													var self = this;
													self.setMainAccountNumber( 'Account Number' );
													for( var subAccountNumber in self.options.data.views.teamCardView ) { //flow acc modify
														self.options.data.views.teamCardView[ subAccountNumber ].destroy();
														delete self.options.data.views.teamCardView[ subAccountNumber ];
													}
													delete self.options.data.showing.teamPaneShellView.mainAccountNumber;
													// self.options.data.views.memberListShellView.clearAllMemberCard();
												},

	searchTeam 					: 				function( phrase ) {
													var self = this;
													var searchedModels = self.options.data.collections.selectedSubAccountCollection.search( phrase );
													var searchedSubAccountCollection = new BackboneData.SubAccountCollection( searchedModels, self.options );
													self.displayTeamCard( searchedSubAccountCollection, self.options.data.url.accountNumber, true /* renderForce */ );
												},

	displayTeamCard 			: 				function( subAccountCollection, accountNumber, renderForce ) {
													var self = this;
													var returnDeferred = new $.Deferred();
													if( renderForce || self.options.data.showing.teamPaneShellView.mainAccountNumber != accountNumber ) {
														self.clearAllTeamCard();
														self.options.data.showing.teamPaneShellView.mainAccountNumber = accountNumber;
														// var accountNumberElseSkill = subAccountCollection.at(0) ? ( subAccountCollection.at(0).get( 'accountNumber' ) ? subAccountCollection.at(0).get( 'accountNumber' ) : accountNumber ) : accountNumber;
														var accountNumberElseSkill = accountNumber;
														// console.error( 'AccountNumber :: ', accountNumberElseSkill, '  --> ', subAccountCollection.at(0) ? ( subAccountCollection.at(0).get( 'accountNumber' ) ? subAccountCollection.at(0).get( 'accountNumber' ) : undefined ) : undefined, ' :: ', accountNumber );
														if( accountNumber && ( accountNumber.slice( 0, 3 ) == 'ett' || accountNumber.slice( 0, 3 ) == 'cht' || accountNumber.slice( 0, 6 ) == 'repeat' || accountNumber.slice( 0, 3 ) == 'rpt' || accountNumber.slice( 0, 6 ) == 'engage' ) ) accountNumberElseSkill = accountNumber;
														if( subAccountCollection.length > 1 ) { self.setMainAccountNumber( subAccountCollection.at(0).get( 'accountNumber' ) ); var subAccountModel = new BackboneData.SubAccountModel( { domainName: 'All', accountNumber: accountNumberElseSkill, subAccountNumber: 'Accounts' , isMainAccountNumber: true, } ); self.renderTeamCard( subAccountModel ); } //flow acc modify
														subAccountCollection.each(	function( model ) {
																						self.renderTeamCard( model );
																					} );
													}
													returnDeferred.resolve( subAccountCollection );
													return returnDeferred;
												},

	renderTeamCard 					: 			function( subAccountModel ) {
													var self = this;
													var options = { data: self.options.data, };
													options.data.currentTarget.subAccountModel = subAccountModel;
													options.$wrapper = self.$.teamCardsTbody;
													var teamCardView = new BackboneData.TeamCardView( options )
													self.options.data.views.teamCardView[ subAccountModel.get( 'subAccountNumber' ) ] =  teamCardView;
													teamCardView.render();
												},

	fetchTranscripts 				: 			function( subAccountNumbers, fromDate, toDate ) {
													var self = this;
													var returnDeferred = new $.Deferred();
													var currentDate = new Date();
													try {
														var fromDateObject = new Date( fromDate.replace(/-/g,"/") );
														var toDateObject = new Date( toDate.replace(/-/g,"/") );
														if( fromDateObject > currentDate || toDateObject > currentDate || fromDateObject > toDateObject || isNaN( fromDateObject ) || isNaN( toDateObject ) ) {
															messageWindow.popUpMessage( 'Provide&nbsp;valid&nbsp;date&nbsp;range' );
															returnDeferred.reject();
															return returnDeferred;
														}
													} catch( exception ) { messageWindow.popUpMessage( 'Provide&nbsp;valid&nbsp;date&nbsp;range' ); returnDeferred.reject(); return returnDeferred; }
													if(!isLoaded)
													  messageWindow.showMessage( 'Loading&nbsp;reports...', true /* now */ );
													// alert( 'Herre' );
													self.options.data.collections.transcriptCollection = self.options.data.collections.transcriptCollection || new BackboneData.TranscriptCollection( null, self.options );
													self.options.data.collections.transcriptCollection.getTranscriptsFullHistory( subAccountNumbers, fromDate, toDate )
														.done(	function( filteredTranscriptCollection ) {
																	console.log( 'Done Fetching Transcripts! - ', filteredTranscriptCollection );
																	if(!isLoaded)
																	 messageWindow.popUpMessage( 'Loaded&nbsp;reports&nbsp;successfully!', 1 * 500, true /* now */ );
																	self.options.data.collections.selectedAccountTranscriptCollection = filteredTranscriptCollection;
																	returnDeferred.resolve( filteredTranscriptCollection );
																} )
															.fail( function( data ) { console.log( 'Failed Fetching Transcripts!' ); returnDeferred.reject(); } );
													return returnDeferred;
												},

	selectSubAccount 				: 			function( subAccountNumber, fromDate, toDate ) {
													var self = this;
													var deferred = new $.Deferred();
													self.options.data.collections.selectedSubAccountTranscriptCollection = ( isMainAccountNumber ) ? self.options.data.collections.selectedAccountTranscriptCollection : new BackboneData.TranscriptCollection( self.options.data.collections.transcriptCollection.filterTranscripts( [ subAccountNumber ], fromDate, toDate ), self.options );
													self.makeActive( subAccountNumber );
													self.options.data.views.toolbarView.setDateRange( moment( fromDate.replace(/-/g,"/") ).format( 'MM/DD/YYYY' ), moment( toDate.replace(/-/g,"/") ).format( 'MM/DD/YYYY' ) );
													/*
													if( subAccountNumber == self.options.data.showing.teamPaneShellView.mainAccountNumber ) {
														self.options.data.views.memberListShellView.displayMainAccountReport( self.options.data.collections.selectedAccountTranscriptCollection, { subAccountNumber: self.options.data.showing.teamPaneShellView.mainAccountNumber, fromDate: fromDate, toDate: toDate } )
															.done( function() { deferred.resolve(); } )
																.fail( function() { deferred.reject(); } );
													} else {
													*/
														self.options.data.views.memberListShellView.displayMembers( self.options.data.collections.selectedSubAccountTranscriptCollection, { subAccountNumber: subAccountNumber, fromDate: fromDate, toDate: toDate , isMainAccountNumber: isMainAccountNumber } )
															.done( function() { deferred.resolve(); } )
																.fail( function() { deferred.reject(); } );
													// }
													return deferred;
												},

	displayMainAccountReport		: 			function( event ) {
													var self = this;
													self.options.data.views.memberListShellView.displayMainAccountReport();
												},

} );