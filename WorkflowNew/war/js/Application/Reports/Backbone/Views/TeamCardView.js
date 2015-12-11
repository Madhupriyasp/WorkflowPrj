BackboneData.TeamCardView	 		= 		Backbone.View.extend( {

	isRendered 						: 			false,

	activeState 					: 			false,

	initialize 						: 			function ( options ) {
													var self = this;
													self.options = options;
													self.options.data.model = self.options.data.model || {};
													self.$wrapper = options.$wrapper;
													self.$el = self.$wrapper;
													self.$ = {};
													self.subAccountModel = self.options.data.currentTarget.subAccountModel;
											    },

	accountStatusColor 				: 			{
													"true" 						: 			'#00CC66',
													"false" 					: 			'#FF5050',
													undefined 					: 			'#00CC66',
												},

	render 							: 			function() {
													var self = this;
													var deferred = new $.Deferred();
													var subAccountObject = self.subAccountModel.toJSON();
													var interactionType = self.options.data.linkedObjects.interactionType[ subAccountObject.interactionTypeId ] || { interactionTypeId: undefined, name: 'Unknown', icon: 'fa-bolt', color: '#777' }; //flow acc modify
													var htmlString = acti.workflow.reports.newTeamCard( { attributes: { id: subAccountObject.subAccountNumber, accountNumber: subAccountObject.subAccountNumber, hexColorCode: self.accountStatusColor[ subAccountObject.activeStatus ], domainName: subAccountObject.domainName ? Helper.getDisplayDomainName(subAccountObject.domainName) : 'NA', accountTypeIcon: interactionType.icon, } } ); //flow acc modify
													self.$wrapper.append( htmlString );
													self.findElements();
													self.attachEvents();
													try
													{ 
														if(isMainAccountNumber && !!self.subAccountModel.get('isMainAccountNumber'))
														{
															self.active( true );
														} 
														if( self.options.data.url.subAccountDetails.subAccountNumber == subAccountObject.subAccountNumber && !isMainAccountNumber ) 
														{ 
															self.active( true );
														}
													} 
													catch( exception ) {}
													deferred.resolve();
													self.isRendered = true;
													return deferred;
												},

	attachEvents 					: 			function() {
													var self = this;
													self.$.teamCard.bind( 'click', function( event ) { self.onTeamCardClick( event, this ); } );
												},

	findElements 					: 			function() {
													var self = this;
													self.$container = self.$wrapper.find( 'tr#' + self.subAccountModel.get( 'subAccountNumber' ) + '.team-card-tr-new' ); //flow acc modify
													self.$.teamCard = self.$container.find( 'div.team-card-new' );
												},

	destroy 						: 			function() {
													var self = this;
													if( self.$container ) self.$container.remove();
													self.isRendered = false;
												},

	onTeamCardClick 				: 			function( event, element ) {
													var self = this;
													self.selectSubAccountModel();
													if(!!isMainAccountNumber && isMainAccountNumber == true)
														self.options.data.routers.reportsRouter.navigate( self.options.data.url.accountNumber + '/' + 'Accounts' + '/' + self.options.data.views.toolbarView.getFromDate() + '/' + self.options.data.views.toolbarView.getToDate(), { trigger: true, replace: true /* Will not create history */ } ); //flow acc modify
													else
														self.options.data.routers.reportsRouter.navigate( self.options.data.url.accountNumber + '/' + self.subAccountModel.get( 'subAccountNumber' ) + '/' + self.options.data.views.toolbarView.getFromDate() + '/' + self.options.data.views.toolbarView.getToDate(), { trigger: true, replace: true /* Will not create history */ } ); //flow acc modify
												},

	active 							: 			function( state ) {
													var self = this;
													if( arguments.length != 0 ) {
														if( typeof( state ) == 'boolean' ) {
															if( state && !self.$.teamCard.hasClass( 'active' ) ) {
																self.$.teamCard.addClass( 'active' );
																self.activeState = true;
																self.options.data.model.subAccountModel = self.subAccountModel;
															} else if( !state && self.$.teamCard.hasClass( 'active' ) ) {
																self.$.teamCard.removeClass( 'active' );
																self.activeState = false;
															}
														}
													} else {
														return self.activeState;
													}
												},
    selectSubAccountModel     			:			function(){
	   												var self = this;
												    self.options.data.model.subAccountModel = self.subAccountModel;
													if(!!self.subAccountModel.get('isMainAccountNumber'))
													 isMainAccountNumber  = self.subAccountModel.get('isMainAccountNumber');
													else
													 isMainAccountNumber  = false;		
   												},												

} );