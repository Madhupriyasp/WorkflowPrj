BackboneData.ContactModel 		= 		Backbone.Model.extend( {

	url 					: 			'',

	idAttribute				: 			'login',

    initialize 				: 			function ( models, options ) {
									    },

	getName 				: 			function() {
											var self = this;
											var name = '';
											if( !self.get( 'agentName' ) ) {
												name += self.get( 'firstName' ) ? self.get( 'firstName' ) : '';
												if( self.get( 'middleName' ) ) {
													if( name != '' )
														name += ' ';
													name += self.get( 'middleName' )[0]; 		// Getting only the initial
												}
												if( self.get( 'lastName' ) ) {
													if( name != '' )
														name += ' ';
													name += self.get( 'lastName' )[0]; 			// Getting only the initial
												}
												self.set( 'agentName', name );
											} else {
												name = self.get( 'agentName' );
											}
											return name;
										},

/*
	parse					: 			function( response, xhr ) {
											return response;
										},

	sync 					: 			function( method, model, options ) {
											return Backbone.sync( method, model, options );
										},
*/

} );
