BackboneData.AppShellView 		= 		Backbone.View.extend( {

	isRendered 						: 			false,

	initialize 						: 			function ( options ) {
													var self = this;
													self.$wrapper = options.$wrapper;
													self.$el = self.$wrapper;
											    },

	render 							: 			function() {
													var self = this;
													var deferred = new $.Deferred();
													var htmlString = acti.workflow.reports.appShell( { attributes: { test: 'TEST' } } );
													self.$wrapper.html( htmlString );
													self.$container = self.$wrapper.find( 'div#shell-view' );
													deferred.resolve();
													self.isRendered = true;
													return deferred;
												},

	destroy 						: 			function() {
													var self = this;
													if( self.$container ) self.$container.remove();
													self.isRendered = false;
												},

} );