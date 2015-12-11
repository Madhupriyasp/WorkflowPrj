BackboneData.SubAccountCollection      =       Backbone.Collection.extend( {

    fetchUrl                    :               '/fetchSubaccounts',

    fetchUrlBySkill            :               'getAccountBySkill',

    fetchedAccounts             :               [],

    sortKey                     :               'date',

    model                       :               BackboneData.SubAccountModel,

    initialize                  :               function( models, options ) {
                                                    var self = this;
                                                    self.options = options;
                                                },

    isFetched                   :               function( accountNumber ) {
                                                    var self = this;
                                                    return ( self.fetchedAccounts.indexOf( accountNumber ) != -1 );
                                                },

    sync                        :               function( method, model, options ) {
                                                    var self = this;
                                                    options = options || {};
                                                    switch( method ) {
                                                        case 'read' :
                                                            options.url = self.fetchUrl + '?subAccountNumber=null&accountNumberorSkill=' + options.accountNumber;
                                                            break;
                                                    }
                                                    return Backbone.sync( method, model, options ); 
                                                },

    fetchAccountCore            :               function( options ) {
                                                    var self = this;
                                                    var deferred = new $.Deferred();
                                                    options = options || {};
                                                    options.url = options.url || self.fetchUrl;
                                                    options.url = self.fetchUrl + '?subAccountNumber=null&accountNumberorSkill=' + options.accountNumber;
                                                    $.ajax( { url: options.url, dataType: "json" } )
                                                        .done( function( data ) { deferred.resolve( self.parse( data ) ); } )
                                                            .fail( function( data ) { var rejectObject = { error: { message: 'Failed to fetch the account. URL: ' + options.url } }; deferred.reject( rejectObject ); console.error( rejectObject.error.message ); } );
                                                    return deferred;
                                                },

    fetchAccountBySkillCore     :               function( options ) {
                                                    var self = this;
                                                    var deferred = new $.Deferred();
                                                    options = options || {};
                                                    options.url = options.url || self.fetchUrl;
                                                    options.url = self.fetchUrlBySkill + '?skill=' + options.accountNumber /* in this case the skill */;
                                                    $.ajax( { url: options.url, dataType: "json",  } )
                                                        .done( function( data ) { deferred.resolve( self.parseForFetchBySkill( data ) ); } )
                                                            .fail( function( data ) { var rejectObject = { error: { message: 'Failed to fetch the account by skill. URL: ' + options.url } }; deferred.reject( rejectObject ); console.error( rejectObject.error.message ); } );
                                                    return deferred;
                                                },

    parse                       :               function( response, xhr ) {
                                                    for( var index in response ) {
                                                        if( ! response[ index ].subAccountNumber ) { response.splice( index, 1 ); console.log( 'SubAccountCollection :: Inside parse() : Rejected at index : ', index ); } //flow acc modify
                                                    }
                                                    return response;
                                                },

    parseForFetchBySkill        :               function( response, xhr ) {
                                                    var self = this;
                                                    var arrayToReturn = [];
                                                    if( response.success ) {
                                                        for( var index in response.accounts ) {
                                                            var account = response.accounts[ index ];
                                                            for( var index in account.clientParametersJDOList ) {
                                                                var clientParamDetail =  self.options.data.linkedObjects.clientObjectParamDesc[ account.clientParametersJDOList[ index ].paramtypeid ];
                                                                if( clientParamDetail ) account[ clientParamDetail.title ] = account.clientParametersJDOList[ index ].value;
                                                            }
                                                            if( account.subAccountNumber ) account.clientId = account.subAccountNumber;
                                                            if( account.interActionTypeId ) account.campaign = account.interActionTypeId;
                                                            arrayToReturn.push( account );
                                                        }
                                                    }
                                                    return arrayToReturn;
                                                },

    getSubAccountCollectionByAccountNumber :    function( accountNumber, isFetchedBySubAccount ) {
                                                    var self = this;
                                                    var subAccountCollection = new BackboneData.SubAccountCollection( self.where( { accountNumber: accountNumber } ), self.options );
                                                    if(subAccountCollection.length > 0)
                                                    	return subAccountCollection;
                                                    else
                                                    	return new BackboneData.SubAccountCollection( self.where( { subAccountNumber: accountNumber } ), self.options );
                                                },

    getSubAccountCollectionBySkill   :          function( skill ) {
                                                    var self = this;
                                                    var subAccountCollection = new BackboneData.SubAccountCollection([],self.options);
                                                    if(mode === "STAGING"){
                                                    	subAccountCollection.add(self.where( {'staging_skill' : skill }));
                                                    	subAccountCollection.add(self.where( {'overflow_staging_skill' : skill }));
                                                    }
                                                    else{
                                                    	subAccountCollection.add(self.where( {'live_skill' : skill }));
                                                    	subAccountCollection.add(self.where( {'overflow_live_skill' : skill }));
                                                    }
                                                    return subAccountCollection;	 	
                                                },

    fetchAccount              		  :               function( accountNumber, options ) {
                                                    var self = this;
                                                    options = options || { accountNumber: accountNumber };
                                                    var returnDeferred = new $.Deferred();                                         
                                                    var isSubAccount = self.isSubAccountNumber(accountNumber);
                                                    if( self.isFetched( accountNumber ) || isSubAccount ) {
                                                        if( accountNumber && ( accountNumber.slice( 0, 3 ) == 'ett' || accountNumber.slice( 0, 3 ) == 'cht' || accountNumber.slice( 0, 6 ) == 'repeat' || accountNumber.slice( 0, 3 ) == 'rpt' || accountNumber.slice( 0, 6 ) == 'engage' ) ) {
                                                            returnDeferred.resolve( self.getSubAccountCollectionBySkill( accountNumber /* in this case the user gives skill title */ ) );
                                                        } else {
                                                            returnDeferred.resolve( self.getSubAccountCollectionByAccountNumber( accountNumber, isSubAccount ) );
                                                        }
                                                    } else {
                                                        var fetchedAccountDeferred = null;
                                                        if( accountNumber && ( accountNumber.slice( 0, 3 ) == 'ett' || accountNumber.slice( 0, 3 ) == 'cht' || accountNumber.slice( 0, 6 ) == 'repeat' || accountNumber.slice( 0, 3 ) == 'rpt' || accountNumber.slice( 0, 6 ) == 'engage' ) ) {
                                                            fetchedAccountDeferred = self.fetchAccountCore( options );   //self.fetchAccountBySkillCore( options /* in this case the user gives skill title as accountNumber */ );
                                                        } else {
                                                            fetchedAccountDeferred = self.fetchAccountCore( options );
                                                        }
                                                        fetchedAccountDeferred
                                                            .done(  function( data ) { 
                                                                                var isFetchedBySubAccount = false;
                                                                                var dataToResolve =  new BackboneData.SubAccountCollection( null, self.options );
                                                                                self.add( data );
                                                                               // self = self.excludeByInteractionType();
                                                                                self.fetchedAccounts.push( accountNumber );
                                                                                if( data.length > 0 ) {
                                                                                    var subAccountModel = new BackboneData.SubAccountModel( data[0] );
                                                                                    if( accountNumber && ( accountNumber.slice( 0, 3 ) == 'ett' || accountNumber.slice( 0, 3 ) == 'cht' || accountNumber.slice( 0, 6 ) == 'repeat' || accountNumber.slice( 0, 3 ) == 'rpt' || accountNumber.slice( 0, 6 ) == 'engage' ) ) {
                                                                                        dataToResolve = self.getSubAccountCollectionBySkill( accountNumber );
                                                                                        isFetchedBySubAccount = true;
                                                                                    } else {
                                                                                        isFetchedBySubAccount = subAccountModel.isFetchedBySubAccount( accountNumber );
                                                                                        dataToResolve = self.getSubAccountCollectionByAccountNumber( accountNumber, isFetchedBySubAccount )
                                                                                    }
                                                                                }
                                                                                returnDeferred.resolve( dataToResolve );
                                                                            } )
                                                                        .fail( function() { 
                                                                        	returnDeferred.reject(); 
                                                                        	messageWindow.popUpMessage("Failed", 1*2000, true);
                                                                        	} );
                                                    }
                                                    return returnDeferred;
                                                },

    search                      :               function( phrase ) {
                                                    var self = this;
                                                    var subAccountNumber, domainName;
                                                    var subAccountModels = self.models.filter( function( model ) { //flow acc modify
                                                    												subAccountNumber = model.get( 'subAccountNumber' ) || '';
                                                                                                    domainName = model.get( 'domainName' ) || '';
                                                                                                    return  (
                                                                                                    			subAccountNumber.toLowerCase().indexOf( phrase.toLowerCase() ) != -1         ||
                                                                                                                domainName.toLowerCase().indexOf( phrase.toLowerCase() ) != -1
                                                                                                            );
                                                                                                } );
                                                    return subAccountModels;
                                                },

    comparator                  :               function( a, b ) {
                                                    var self = this;
                                                    a = a.get( self.sortKey );
                                                    b = b.get( self.sortKey );
                                                    return a > b ?  1
                                                         : a < b ? -1
                                                         :          0;
                                                },

    sortByKey                   :               function( sortKey ) {
                                                    var self = this;
                                                    if( sortKey ) self.sortKey = sortKey;
                                                    self.sort();
                                                },
    excludeByInteractionType	: 				function() {   //flow modify
									        	filtered = this.filter(function(account) {
												            return account.get("interactionTypeId") 	=== "8333d8c0-e22a-4e32-9bf5-0f578461823e" ||   //Click to Talk
												            	   account.get("interactionTypeId")		=== "84d52042-cc6d-4df8-acf4-1ecc278f790e" ||	//Email Response
												            	   account.get("interactionTypeId")		=== "a7359531-3e43-4da1-be98-5a1392638e42" ||   //Email Outbound
												            	   account.get("interactionTypeId") 	=== "b9eafcf0-a770-412d-a557-6ec203641bb0" ||	//ar.interaction.email.TaskRouter
												            	   account.get("interactionTypeId") 	=== "8405312c-4f51-42a9-bb55-3543d22e4569" ||   //ar.interaction.email.V2WorkItems
												            	   account.get("interactionTypeId") 	=== "70158413-3ae0-4896-80b7-50d411ad0cd2"
												            });
									          return new BackboneData.SubAccountCollection(filtered);
									        },									    
    isSubAccountNumber			:              function(accountNumber){
		    										 var isSubAccount = false;
		    										 var self		  = this;
		    	                                     if((self.where( { accountNumber: accountNumber } ).length == 0) && ( self.pluck( 'subAccountNumber' ).indexOf( accountNumber ) != -1 ) ){
		    	                                    	 isSubAccount = true;
		    	                                     }
		    										return isSubAccount;	
    										},
} );