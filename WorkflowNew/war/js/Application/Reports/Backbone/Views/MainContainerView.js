BackboneData.MainContainerView 		= 		Backbone.View.extend( {

	isRendered 						: 			false,

	initialize 						: 			function ( options ) {
													var self = this;
													self.options = options
													self.$wrapper = options.$wrapper;
													self.$el = self.$wrapper;
													self.$ = self.$ || {};
													self.headerHeight = 55;
											    },

	render 							: 			function() {
													var self = this;
													var deferred = new $.Deferred();
													var htmlString = acti.workflow.reports.mainContainer( { attributes: { test: 'TEST' } } );
													self.$wrapper.html( htmlString );
													self.findElements();
													self.onResize();
													self.attachEvents();
													self.isRendered = true;
													deferred.resolve();
													return deferred;
												},

	events 							: 			{
													'click a#team-pane-toggle-flap-a'				: 			'onToggleFlapClick',	
												},

	onToggleFlapClick 				: 			function() {
													var self = this;
													var anchorValue = self.$.teamPaneToggleFlapAnchor.attr( 'value' );
													if( anchorValue == 'opened' ) {
														self.options.data.views.mainContainerView.toggleTeamPane();
														self.$.teamPaneToggleFlapIcon.removeClass( 'fa-chevron-left' );
														self.$.teamPaneToggleFlapIcon.addClass( 'fa-chevron-right' );
														self.$.teamPaneToggleFlapAnchor.attr( 'value', 'closed' );
													} else {
														self.options.data.views.mainContainerView.toggleTeamPane();
														self.$.teamPaneToggleFlapIcon.removeClass( 'fa-chevron-right' );
														self.$.teamPaneToggleFlapIcon.addClass( 'fa-chevron-left' );
														self.$.teamPaneToggleFlapAnchor.attr( 'value', 'opened' );
													}
													self.options.data.views.transcriptListShellView.reflowTable();
												},

	toggleTeamPane 					: 			function() {
													var self = this;
													var isTeamPaneShown = ( self.$.teamPaneWrapper.css( 'display' ) != 'none' );
													if( isTeamPaneShown ) {
														self.$.teamPaneWrapper.hide();
														self.$.teamDescPaneWrapper.removeClass( 'col-lg-10' ); self.$.teamDescPaneWrapper.removeClass( 'col-md-10' ); self.$.teamDescPaneWrapper.removeClass( 'col-sm-10' ); self.$.teamDescPaneWrapper.removeClass( 'col-xs-10' );
														self.$.teamDescPaneWrapper.addClass( 'col-lg-12' ); self.$.teamDescPaneWrapper.addClass( 'col-md-12' ); self.$.teamDescPaneWrapper.addClass( 'col-sm-12' ); self.$.teamDescPaneWrapper.addClass( 'col-xs-12' );
													} else {
														self.$.teamPaneWrapper.show();
														self.$.teamDescPaneWrapper.removeClass( 'col-lg-12' ); self.$.teamDescPaneWrapper.removeClass( 'col-md-12' ); self.$.teamDescPaneWrapper.removeClass( 'col-sm-12' ); self.$.teamDescPaneWrapper.removeClass( 'col-xs-12' );
														self.$.teamDescPaneWrapper.addClass( 'col-lg-10' ); self.$.teamDescPaneWrapper.addClass( 'col-md-10' ); self.$.teamDescPaneWrapper.addClass( 'col-sm-10' ); self.$.teamDescPaneWrapper.addClass( 'col-xs-10' );
													}
												},

	findElements 					: 			function() {
													var self = this;
													self.$container = self.$wrapper.find( 'div#main-container' );
													self.$.teamPaneWrapper = self.$container.find( 'div#team-pane-wrapper' );
													self.$.teamDescPaneWrapper = self.$container.find( 'div#team-desc-pane-wrapper' );
													self.$.popOverContainer = self.$container.find( 'div#popover-container' );

													self.$.teamPaneToggleFlap = self.$container.find( 'div#team-pane-toggle-flap' );
													self.$.teamPaneToggleFlapAnchor = self.$.teamPaneToggleFlap.find( 'a#team-pane-toggle-flap-a' );
													self.$.teamPaneToggleFlapIcon = self.$.teamPaneToggleFlap.find( 'i#team-pane-toggle-flap-i' );
													// self.$.teamPaneToggleIcon = 
													self.options.data.$.popOverContainer = self.$.popOverContainer;
												},

	attachEvents 					: 			function() {
													var self = this;
													$( window ).bind( 'resize', function( event ) { self.onResize( event ); } );
												},

	onResize 						: 			function( event ) {
													var self = this;
													var bodyHeight = $( window ).height();
													var mainContainerHeight = bodyHeight - self.headerHeight;
													self.$wrapper.css( { height: mainContainerHeight + 'px' } );
												},

	destroy 						: 			function() {
													var self = this;
													if( self.$container ) self.$container.remove();
													self.isRendered = false;
												},

} );