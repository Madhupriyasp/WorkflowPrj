BackboneData.ContactCollection      =       Backbone.Collection.extend({

    fetchUrl                    :               '/getContacts',

    model                       :               BackboneData.ContactModel,

    fetchedContacts             :               [],

    initialize                  :               function() {
                                                },

    sync                        :               function( method, model, options ) {
                                                    var self = this;
                                                    options = options || {};
                                                    switch( method ) {
                                                        case 'read' :
                                                            options.url = self.fetchUrl + '?subAccountNumber=null&accountNumber=' + options.accountNumber;
                                                            break;
                                                    }
                                                    return Backbone.sync( method, model, options ); 
                                                },

    getContact                  :               function( login, options ) {
                                                    var self = this;
                                                    var deferred = new $.Deferred();
                                                    var options = options || {};
                                                    var contact = self.get( login );
                                                    if( contact ) {
                                                        deferred.resolve( contact );
                                                    } else {
                                                        self.getContacts( [ login ] )
                                                            .done( function( data ) { self.getContact( login, { deferred : deferred } ); } )
                                                                .fail( function() { deferred.reject(); } );
                                                    }
                                                    return deferred;
                                                },

    getContacts                 :               function( loginArray, options ) {
                                                    var self = this;
                                                    var options = options || {};
                                                    var deferred = options.deferred || new $.Deferred();
                                                    var requiredContactsObject = [];
                                                    var loginArrayToFetchFromServer = [];
                                                    var contact = null;
                                                    var login = null;
                                                    for( var index in loginArray ) {
                                                    	login = loginArray[index].toLowerCase();
                                                        if(self.fetchedContacts.indexOf(login) == -1) {
                                                        	if(!!login && login != 'na' && login != 'system' &&  login != 'visitor')
                                                               loginArrayToFetchFromServer.push( loginArray[ index ].toLowerCase() );
                                                        } else {
                                                            contact = self.get( loginArray[ index ] );
                                                            if( contact )
                                                                requiredContactsObject.push( contact );
                                                        }
                                                    }
                                                    console.log( 'Contacts to fetch from server :: ', loginArrayToFetchFromServer );
                                                    if(loginArrayToFetchFromServer.length > 0) {
                                                    	isLoaded = false;
                                                        self.fetchContactsFromServer( loginArrayToFetchFromServer )
                                                            .done( function( data ) { self.getContacts( loginArray, { deferred : deferred } ); } )
                                                                .fail( function() { deferred.reject(); } );
                                                    } else {
                                                        deferred.resolve( requiredContactsObject );
                                                    }
                                                    return deferred;
                                                },

    fetchContactsFromServer     :               function( loginArray ) {
                                                    var self = this;
                                                    var deferred = new $.Deferred();
                                                    var loginArrayStr = loginArray.toString();
                                                    if(fetchedContactCount.hasOwnProperty(loginArrayStr) )
                                                	{
                                                    	if(fetchedContactCount[loginArrayStr] > 2 )
	                                                    	for(var index =0 ; index < loginArray.length; index++)
	                                                    	   self.fetchedContacts.push(loginArray[index]);
                                                    	else
                                                    		fetchedContactCount[loginArrayStr] = fetchedContactCount[loginArrayStr] + 1;
                                                	}
                                                    else
                                                    	fetchedContactCount[loginArrayStr] = 1;
                                                    $.ajax( { url: self.fetchUrl, type: 'post',async: false, data: JSON.stringify( loginArray ), dataType: 'json', contentType : 'application/json' } )
                                                        .done( function( data ) {  var parsedData = self.parse( data ); for( var index in parsedData ) { if( self.fetchedContacts.indexOf( parsedData[ index ].login ) == -1 ) { self.fetchedContacts.push( parsedData[ index ].login ); } } self.add( parsedData ); deferred.resolve( parsedData ); } )
                                                            .fail( function( data ) { deferred.reject( data ); } );
                                                    return deferred;
                                                },

    parse                       :               function( response, xhr ) {
                                                    var returnData = undefined;
                                                    if( response.success ) {
                                                        returnData = response.contacts;
                                                    }
                                                    return returnData;
                                                },

} );