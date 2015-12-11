BackboneData.SubAccountModel 		= 		Backbone.Model.extend( {

	url 					: 			'',

	idAttribute				: 			'subAccountNumber',   //flow acc modify

    initialize 				: 			function ( models, options ) {
									    },

	parse					: 			function( response, xhr ) {
											return response;
										},

	sync 					: 			function( method, model, options ) {
											return Backbone.sync( method, model, options );
										},

	isFetchedBySubAccount	: 			function( givenAccountNumber ) {
											var self = this;
											return !( self.get( 'accountNumber' ) == givenAccountNumber )
										},

} );
