BackboneData.TranscriptFullDetailsChatView	= 		Backbone.View.extend( {

	isRendered 						: 			false,

	fetchedAccount 					: 			null,

	origin 							: 			'TranscriptFullDetailsChatView',

	initialize 						: 			function ( options ) {
													var self = this;
													self.options = options;
													self.$ = {};
													self.$wrapper = options.$wrapper;
													self.$el = self.$wrapper;
													self.transcriptModel = self.options.data.currentTarget.transcriptModel;
													self.transcriptMessageObject = self.options.data.currentTarget.transcriptModel.getMessageObject();
											    },

	render 							: 			function() {
													var self = this;
													var deferred = new $.Deferred();
													var messageArray = [];
													var messageObjectData = null;
													var metaDataArray = [];
													var gustName = '';
													var gustEmail= 'Unknown';
													if(!!self.transcriptModel.get('metaData') && self.transcriptModel.get('metaData') != "NA")
													{
														try
														{
															var metaDataObject = JSON.parse(self.transcriptModel.get('metaData'));
														}
														catch(exception)
														{ 
														  //# Added To handle older formate Chat metaData	
                                                          var metaDataObject = {};
														  var messageStringArray = self.transcriptModel.get('metaData').replace(/{/g,"").replace(/}/g,"").split(",");
														  for(var index in messageStringArray)
														  {
														  	messageAttribute = messageStringArray[index].split("=");
														  	metaDataObject[messageAttribute[0]] = messageAttribute[1];
														  }
														}
														for( var key in metaDataObject ) 
														{
															if(key.toLowerCase().indexOf('cookie') == -1)
																metaDataArray.push( { key: key, value: metaDataObject[ key ] } );
															if(key.toLowerCase() == 'guestname')
																gustName = metaDataObject[ key ];
															else if(key.toLowerCase() == 'guestemail')
																gustEmail = metaDataObject[ key ];	
														} 
													}
													
													messageObjectData = self.transcriptModel.getMessageObject();
													if(!!messageObjectData.gustName)
														gustName = messageObjectData.gustName;
													if(!!messageObjectData.gustEmail)
														gustEmail = messageObjectData.gustEmail;
													
													
													var htmlString = acti.workflow.reports.transcriptFullDetailChat( { attributes: { test: 'TEST', messages: messageObjectData.chatMessages, metaData: metaDataArray, messageDetails: { domainName: Helper.getDisplayDomainName(self.transcriptModel.get( 'domain' )), userImage: 'images/user-icon.jpg', from: gustEmail, to: '', name : gustName} } } );
													self.$wrapper.html( htmlString );
													self.findElements();
													self.attachEvents();
													self.onResize();
													self.isRendered = true;
													deferred.resolve();
													return deferred;
												},

	events							: 			{
													
												},

	show 							: 			function() {
													var self = this;
													if( self.$container ) { self.$wrapper.show(); }
												},

	hide 							: 			function() {
													var self = this;
													if( self.$container ) { self.$wrapper.hide(); }
												},

	findElements 					: 			function() {
													var self = this;
													self.$container = self.$wrapper.find( 'div#transcript-full-details' );
												},

	attachEvents 					: 			function() {
													var self = this;
													$( window ).resize( function( event ) { self.onResize( event, this ); } );
												},

	onResize 						: 			function( event, element ) {
													var self = this;
													var windowHeight = $( window ).height();
												},

	destroy 						: 			function() {
													var self = this;
													if( self.$container ) self.$container.remove();
													delete self.options.data.views.transcriptFullDetailsView;
													self.isRendered = false;
												},

} );