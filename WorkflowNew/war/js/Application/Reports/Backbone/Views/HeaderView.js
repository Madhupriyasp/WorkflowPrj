BackboneData.HeaderView 		= 		Backbone.View.extend( {

	isRendered 						: 			false,

	fetchedAccount 					: 			null,

	origin 							: 			'HeaderView',

	initialize 						: 			function ( options ) {
													var self = this;
													self.options = options;
													self.$ = self.$ || {};
													self.$wrapper = options.$wrapper;
													self.$el = self.$wrapper;
											    },

	render 							: 			function() {
													var self = this;
													var deferred = new $.Deferred();
													var htmlString = acti.workflow.reports.header( { attributes: { test: 'TEST'	, photoURL: photoURL, currentUser: currentUser } } );
													self.$wrapper.html( htmlString );
													self.findElements();
													self.isRendered = true;
													deferred.resolve();
													return deferred;
												},

	findElements 					: 			function() {
													var self = this;
													self.$container = self.$wrapper.find( '#header' );
													self.$.fetchAccountPopOverDown = self.$container.find( 'div#fetchdtl' );
													self.$.userIconPopOverDown = self.$container.find( 'div#log_dtl' );
													self.$.fetchAccountInput = self.$container.find( 'input#fetchinbox' );
												},

	events							: 			{
													'click a#hide-fetch' 						: 			'onFetchDropdownClick',
													//'click div.full_dtl' 						: 			'onUserPhotoClick',
													'click a#fetch' 							: 			'onFetchClick',
													'keyup input#fetchinbox' 					: 			'onKeyUpOfFetchInput',
													'mouseover div.full_dtl'					:			'onUserPhotoMouseover',
													'mouseout div.full_dtl'						:			'onUserPhotoMouseout',
													'mouseover div#log_dtl'						:			'onMouseoverUserIconPopOverDown',
													'mouseout div#log_dtl'						:			'onMouseoutUserIconPopOverDown',
												},
												
	onFetchClick 					: 			function( event ) {
													var self = this;
													self.onFetchDropdownClick(); 			// To close the fetch dropdown box
													isLoaded = false;
													self.options.data.views.teamPaneShellView.clearAllTeamCard();
													isMainAccountNumber = true;
													self.options.data.routers.reportsRouter.navigate( self.getAccountNumber(), { trigger: true, replace: true /* Will not create history */ } );
													self.$.fetchAccountInput.val( '' );
												},

	onFetchDropdownClick 			: 			function( event ) {
													var self = this;
													self.$.fetchAccountPopOverDown.fadeToggle( 100 );
													if( self.$.fetchAccountPopOverDown.css( 'display' ) != 'none' )
														self.$.fetchAccountInput.focus();
													if( self.$.userIconPopOverDown.css( 'display' ) != 'none' )
														self.$.userIconPopOverDown.fadeToggle( 100 );
												},

	onUserPhotoMouseover 			: 			function() {
													var self = this;
													self.$.userIconPopOverDown.show();
													if( self.$.fetchAccountPopOverDown.css( 'display' ) != 'none' )
														self.$.fetchAccountPopOverDown.fadeToggle( 100 );
												},
	onUserPhotoMouseout 			: 			function() {
													var self = this;
													self.$.userIconPopOverDown.hide();
													if( self.$.fetchAccountPopOverDown.css( 'display' ) != 'none' )
														self.$.fetchAccountPopOverDown.fadeToggle( 100 );
												},
	onMouseoverUserIconPopOverDown	:			function(){
													var self=this;
													self.$.userIconPopOverDown.show();
												},
	onMouseoutUserIconPopOverDown	:			function(){
													var self=this;
													self.$.userIconPopOverDown.hide();
												},

	onKeyUpOfFetchInput 			: 			function( event ) {
													var self = this;
													if( event.keyCode == 13 /* Enter key */ ) {
														self.onFetchClick( event );
													}
												},

	getAccountNumber 				: 			function() {
													var self = this;
													return self.$.fetchAccountInput.val();
												},

	destroy 						: 			function() {
													var self = this;
													if( self.$container ) self.$container.remove();
													self.isRendered = false;
												},

} );