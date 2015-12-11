BackboneData.ReportsRouter 		= 		Backbone.Router.extend({

    routes: {
        ""          		                                                                                          :         "entryPoint",
        ":accountNumber"                                                                                              :         "loadAccountNumber",
        ":accountNumber/:subAccountNumber"                                                                            :         "loadSubAccountNumber",
        ":accountNumber/:subAccountNumber/:fromDate"                                                                  :         "loadSubAccountNumber",
        ":accountNumber/:subAccountNumber/:fromDate/:toDate"                                                          :         "loadSubAccountNumberWithDateRange",
        ":accountNumber/:subAccountNumber/:fromDate/:toDate/:agentLogin"                                              :         "loadAccountSubAccountAgentLogin",
        ":accountNumber/:subAccountNumber/:fromDate/:toDate/:agentLogin/:interactionId/:interactionDetailsTab"        :         "loadTranscript",
    },

    origin                              :       'ReportsRouter',

    initialize                          :       function () {
                                                    var self = this;
                                                    console.log( self.origin + ' :: ' + 'Inside initialize.' );
                                                    self.options = self.options || { data: { userInfo: { photoId: photoURL, userName: '' }, collections: {}, views: { teamCardView: {}, memberCardView: {}, transcriptCardView: {}, }, routers: { reportsRouter: self }, linkedObjects: {}, currentTarget: {}, showing: {}, url: {}, $: {}, preferences: { ui: {}, dateRange: {} } } };
                                                    window.options = self.options;
                                                    self.currentDateString = moment().tz( 'America/Whitehorse' ).format( 'MM-DD-YYYY' );
                                                    self.asignInteractionTypeToOptions();
                                                },

    entryPoint                          :       function() {
                                                    var self = this;
                                                    console.log( self.origin + ' :: ' + 'Inside the route: entryPoint().' );
                                                    self.loadViews();
                                                },

    loadAccountNumber                   :       function( accountNumber ) {
                                                    var self = this;
                                                    console.log( self.origin + ' :: ' + 'Inside the route: loadAccountNumber( "' + accountNumber + '" ).' );
                                                    self.loadViews( accountNumber );
                                                },

    loadSubAccountNumber                :       function( accountNumber, subAccountNumber ) {
                                                    var self = this;
                                                    console.log( self.origin + ' :: ' + 'Inside the route: loadSubAccountNumber( "' + accountNumber + '", "' + subAccountNumber + '" ).' );
                                                    self.navigate( accountNumber + '/' + subAccountNumber + '/' + ( self.options.data.preferences.dateRange.fromDate ? self.options.data.preferences.dateRange.fromDate : self.currentDateString ) + '/' + ( self.options.data.preferences.dateRange.toDate ? self.options.data.preferences.dateRange.toDate : self.currentDateString ), { trigger: true, replace: true /* Will not create history */ } );
                                                },

    loadSubAccountNumberWithDateRange   :       function( accountNumber, subAccountNumber, fromDate, toDate ) {
                                                    var self = this;
                                                    self.loadViews( accountNumber, { subAccountNumber: subAccountNumber, fromDate: fromDate, toDate: toDate, } );
                                                },

    loadAccountSubAccountAgentLogin     :       function( accountNumber, subAccountNumber, fromDate, toDate, agentLogin ) {
                                                    var self = this;
                                                    self.loadViews( accountNumber, { subAccountNumber: subAccountNumber, fromDate: fromDate, toDate: toDate, }, agentLogin );
                                                },

    loadTranscript                      :       function( accountNumber, subAccountNumber, fromDate, toDate, agentLogin, interactionId, interactionDetailsTab ) {
                                                    var self = this;
                                                    self.loadViews( accountNumber, { subAccountNumber: subAccountNumber, fromDate: fromDate, toDate: toDate, }, agentLogin, { interactionId: interactionId, interactionDetailsTab: interactionDetailsTab } );
                                                },

    loadViews                           :       function( accountNumber, subAccountNumberDetails, agentLogin, interactionDetails ) {
                                                    var self = this;
                                                    if(!!subAccountNumberDetails && subAccountNumberDetails.subAccountNumber === 'Accounts' )
                                                    	subAccountNumberDetails.subAccountNumber = accountNumber;
                                                    if( !!accountNumber  && !!subAccountNumberDetails && !!subAccountNumberDetails.subAccountNumber && accountNumber != subAccountNumberDetails.subAccountNumber)
                                                    {
                                                    	 isMainAccountNumber = false;
                                                    }
                                                    console.log( self.origin + ' :: ' + ' Inside loadViews(' + ( accountNumber ? ( ' "' + accountNumber + '" ' ) : '' ) + ( subAccountNumberDetails ? ( ', ' + JSON.stringify( subAccountNumberDetails ) + ' ' ) : '' ) + ( agentLogin ? ( ', "' + agentLogin + '" ' ) : '' ) + ( interactionDetails ? ( ', ' + JSON.stringify( interactionDetails ) + ' ' ) : '' ) + ') : Loading the views...' );
                                                    self.options.data.url.accountNumber = accountNumber;
                                                    self.options.data.url.subAccountDetails = subAccountNumberDetails;
                                                    self.options.data.url.agentLogin = agentLogin;
                                                    self.options.data.url.interactionDetails = interactionDetails;
                                                    url = self; 
                                                    if( !self.options.data.views.appShellView || !self.options.data.views.appShellView.isRendered ) {
                                                        self.options.$wrapper = $( 'body #main-wrapper' );
                                                        self.options.data.views.appShellView = new BackboneData.AppShellView( self.options );
                                                        self.options.data.views.appShellView.render()
                                                            .done( function( data ) {  } )
                                                                .fail( function( data ) {  } );
                                                    }

                                                    if( !self.options.data.views.headerView || !self.options.data.views.headerView.isRendered ) {
                                                        self.options.$wrapper = self.options.data.views.appShellView.$container.find( 'div#header-wrapper' );
                                                        self.options.data.views.headerView = new BackboneData.HeaderView( self.options );
                                                        self.options.data.views.headerView.render()
                                                            .done( function( data ) { } )
                                                                .fail( function( data ) {  } );
                                                    }

                                                    if( !self.options.data.views.mainContainerView || !self.options.data.views.mainContainerView.isRendered ) {
                                                        self.options.$wrapper = self.options.data.views.appShellView.$container.find( 'div#main-container-wrapper' );
                                                        self.options.data.views.mainContainerView = new BackboneData.MainContainerView( self.options );
                                                        self.options.data.views.mainContainerView.render()
                                                            .done( function( data ) {  } )
                                                                .fail( function( data ) {  } );
                                                    }

                                                    if( !self.options.data.views.toolbarView || !self.options.data.views.toolbarView.isRendered ) {
                                                        self.options.$wrapper = self.options.data.views.mainContainerView.$container.find( 'div#toolbar-wrapper' );
                                                        self.options.data.views.toolbarView = new BackboneData.ToolbarView( self.options );
                                                        self.options.data.views.toolbarView.render()
                                                            .done( function( data ) {  } )
                                                                .fail( function( data ) {  } );
                                                    }

                                                    if( !self.options.data.views.memberListShellView || !self.options.data.views.memberListShellView.isRendered ) {
                                                        self.options.$wrapper = self.options.data.views.mainContainerView.$container.find( 'div#member-list-wrapper' );
                                                        self.options.data.views.memberListShellView = new BackboneData.MemberListShellView( self.options );
                                                        self.options.data.views.memberListShellView.render()
                                                            .done( function( data ) {  } )
                                                                .fail( function( data ) {  } );
                                                    }

                                                    if( !self.options.data.views.transcriptListShellView || !self.options.data.views.transcriptListShellView.isRendered ) {
                                                        self.options.$wrapper = self.options.data.views.mainContainerView.$container.find( 'div#transcripts-list-wrapper' );
                                                        self.options.data.views.transcriptListShellView = new BackboneData.TranscriptListShellView( self.options );
                                                        self.options.data.views.transcriptListShellView.render()
                                                            .done( function( data ) {  } )
                                                                .fail( function( data ) {  } );
                                                    }

                                                    if( !self.options.data.views.teamPaneShellView || !self.options.data.views.teamPaneShellView.isRendered ) {
                                                        self.options.$wrapper = self.options.data.views.mainContainerView.$container.find( 'div#team-pane-wrapper' );
                                                        self.options.data.views.teamPaneShellView = new BackboneData.TeamPaneShellView( self.options );
                                                        self.options.data.views.teamPaneShellView.render()
                                                            .done( function( data ) {  } )
                                                                .fail( function( data ) {  } );
                                                    }

                                                    if( !self.options.data.views.transcriptDetailsShellView || !self.options.data.views.transcriptDetailsShellView.isRendered ) {
                                                        self.options.$wrapper = self.options.data.views.mainContainerView.$container.find( 'div#transcript-details-wrapper' );
                                                        self.options.data.views.transcriptDetailsShellView = new BackboneData.TranscriptDetailsShellView( self.options );
                                                        self.options.data.views.transcriptDetailsShellView.render()
                                                            .done( function( data ) {  } )
                                                                .fail( function( data ) {  } );
                                                    }

                                                    if( subAccountNumberDetails ) {
                                                        self.options.data.views.toolbarView.setDateRange( moment( subAccountNumberDetails.fromDate.replace(/-/g,"/") ).format( 'MM/DD/YYYY' ), moment( subAccountNumberDetails.toDate.replace(/-/g,"/") ).format( 'MM/DD/YYYY' ) );
                                                    }

                                                    self.selectAccount( accountNumber )
                                                        .done(  function() {
                                                                    self.selectSubAccount( subAccountNumberDetails )
                                                                        .done(  function() {
                                                                                    self.selectAgent( agentLogin ).done(    function() { 
                                                                                                                                self.selectTranscript( interactionDetails )
                                                                                                                                    .done( function() {  } )
                                                                                                                                        .fail( function() {  } )
                                                                                                                            } )
                                                                                                                        .fail( function() {  } );
                                                                                } )
                                                                            .fail( function() {  } );
                                                                } )
                                                            .fail( function() {  } );

                                                },

    selectAccount                       :       function( accountNumber ) {
                                                    var self = this;
                                                    var deferred;
                                                    if( accountNumber ) {
                                                        deferred = self.options.data.views.teamPaneShellView.fetchAccount( accountNumber );
                                                    } else {
                                                        self.navigate( '8005251315', { trigger: true, replace: true /* Will not create history */ } );
                                                        deferred = new $.Deferred();
                                                        deferred.reject();
                                                    }
                                                    return deferred;
                                                },

    selectSubAccount                    :       function( subAccountNumberDetails ) {
                                                    var self = this;
                                                    var deferred = new $.Deferred();
                                                    if( subAccountNumberDetails ) {
                                                       // self.options.data.views.toolbarView.setDateRange( moment( subAccountNumberDetails.fromDate.replace(/-/g,"/") ).format( 'MM/DD/YYYY' ), moment( subAccountNumberDetails.toDate.replace(/-/g,"/") ).format( 'MM/DD/YYYY' ) ); //flow pending 
                                                        self.options.data.views.teamPaneShellView.fetchTranscripts( self.options.data.collections.selectedSubAccountCollection.pluck( 'subAccountNumber' ), subAccountNumberDetails.fromDate, subAccountNumberDetails.toDate ) //flow acc modify
                                                            .done(  function() {
                                                                        self.options.data.views.teamPaneShellView.selectSubAccount( subAccountNumberDetails.subAccountNumber, subAccountNumberDetails.fromDate, subAccountNumberDetails.toDate )
                                                                            .done( function() { deferred.resolve(); } )
                                                                                .fail( function() { deferred.reject(); } );
                                                                    } )
                                                                .fail( function() { console.error( self.origin, '::', 'Transcripts fetch failed.' ); deferred.reject(); } );
                                                    } else {
                                                        var subAccountNumber = self.options.data.url.accountNumber;
                                                        if( self.options.data.url.accountNumber && ( self.options.data.url.accountNumber.slice( 0, 3 ) == 'ett' || self.options.data.url.accountNumber.slice( 0, 3 ) == 'cht' || self.options.data.url.accountNumber.slice( 0, 6 ) == 'repeat' || self.options.data.url.accountNumber.slice( 0, 3 ) == 'rpt' || self.options.data.url.accountNumber.slice( 0, 6 ) == 'engage' ) ) {
                                                        	var subAccountModelArray;
                                                        	if(mode === "STAGING"){
                                                        		subAccountModelArray = self.options.data.collections.subAccountCollection.where( { 'staging_skill': self.options.data.url.accountNumber } );
                                                            }
                                                            else{
                                                            	subAccountModelArray = self.options.data.collections.subAccountCollection.where( { 'live_skill': self.options.data.url.accountNumber } );
                                                            }
                                                            
                                                            if( subAccountModelArray && subAccountModelArray.length == 1 ) {
                                                                var subAccountModel = subAccountModelArray[ 0 ];
                                                                subAccountNumber = subAccountModel.get( 'subAccountNumber' );
                                                            }
                                                        }
                                                        self.navigate( self.options.data.url.accountNumber + '/' + subAccountNumber + '/' + ( self.options.data.preferences.dateRange.fromDate ? self.options.data.preferences.dateRange.fromDate : self.currentDateString ) + '/' + ( self.options.data.preferences.dateRange.toDate ? self.options.data.preferences.dateRange.toDate : self.currentDateString ), { trigger: true, replace: true /* Will not create history */ } );
                                                        deferred.reject();
                                                    }
                                                    return deferred;
                                                },

    selectAgent                         :       function( agentLogin ) {
                                                    var self = this;
                                                    var deferred = new $.Deferred();
                                                    if( agentLogin ) {
                                                        return self.options.data.views.memberListShellView.selectAgent( agentLogin );
                                                    } else {
                                                        if( self.options.data.views.memberCardView[ 'All' ] ) {
                                                            self.navigate( self.options.data.url.accountNumber + '/' + self.options.data.url.subAccountDetails.subAccountNumber + '/' + self.options.data.url.subAccountDetails.fromDate + '/' + self.options.data.url.subAccountDetails.toDate + '/' + 'All', { trigger: true, replace: true /* Will not create history */ } );
                                                        }
                                                        deferred.reject();
                                                    }
                                                    return deferred;
                                                },

    selectTranscript                    :       function( interactionDetails ) {
                                                    var self = this;
                                                    var deferred = new $.Deferred();
                                                    if( interactionDetails ) {
                                                        self.options.data.preferences.ui.transcriptDetailsViewTab = ( interactionDetails.interactionDetailsTab == 'history' || interactionDetails.interactionDetailsTab == 'message' ) ? interactionDetails.interactionDetailsTab : self.options.data.preferences.ui.transcriptDetailsViewTab;
                                                        self.options.data.views.transcriptDetailsShellView.showTranscriptById( interactionDetails.interactionId )
                                                            .done( function( data ) { deferred.resolve(); } )
                                                                .fail( function( data ) { deferred.reject(); } );
                                                    } else {
                                                        deferred.reject();
                                                    }
                                                    return deferred;
                                                },

    attachEvents                        :       function() {
                                                },

    getDateStringForServer              :       function( date ) {
                                                    var self = this;
                                                    return  self.trimDigits( ( date.getMonth() + 1 ), 2 ) + '-' + self.trimDigits( date.getDate(), 2 ) + '-' + date.getFullYear();
                                                },

    trimDigits                          :       function( valueInteger, digits ) {
                                                    var valueString = valueInteger + '';
                                                    if( valueString.length > digits ) {
                                                        valueString = valueString.slice( valueString.length - digits, valueString.length );
                                                    } else {
                                                        var numberOfZeros = digits - valueString.length;
                                                        var zeroString = '';
                                                        for( var i = 0; i < numberOfZeros; i++ ) {
                                                            zeroString += '0';
                                                        }
                                                        valueString = zeroString + valueString;
                                                    }
                                                    return valueString;
                                                },

    asignInteractionTypeToOptions       :       function() {
                                                    var self = this;
                                                    self.options.data.linkedObjects.interactionType                 =           {
                                                                                                                                    '8333d8c0-e22a-4e32-9bf5-0f578461823e': { interactionTypeId: '8333d8c0-e22a-4e32-9bf5-0f578461823e', name: 'Click to Talk', color: '#32E600', icon: 'fa-hand-o-up', }, //Green
                                                                                                                                    '84d52042-cc6d-4df8-acf4-1ecc278f790e': { interactionTypeId: '84d52042-cc6d-4df8-acf4-1ecc278f790e', name: 'Email Response', color: '#FF6E6E', icon: 'fa-envelope', }, //Red
                                                                                                                                    'a7359531-3e43-4da1-be98-5a1392638e42': { interactionTypeId: 'a7359531-3e43-4da1-be98-5a1392638e42', name: 'Email Outbound', color: '#0073E6', icon: 'fa-envelope-o', }, //blue
                                                                                                                                    'b3485731-3c4e-4eeb-a15e-c5bc41286205': { interactionTypeId: 'b3485731-3c4e-4eeb-a15e-c5bc41286205', name: 'CallList Outbound', color: '#E6D600', icon: 'fa-phone', },  //yellow
                                                                                                                                    'b0fdad11-0bf5-457b-804a-2914d546d8c2': { interactionTypeId: 'b0fdad11-0bf5-457b-804a-2914d546d8c2', name: 'Group Chat', color: '#DE00E6' }, //Pink
                                                                                                                                    'ea8b2dae-0f01-4671-9c12-c8c7fd7f08fa': { interactionTypeId: 'ea8b2dae-0f01-4671-9c12-c8c7fd7f08fa', name: 'Repeats', color: '#E68600' },   //orange
                                                                                                                                    '70158413-3ae0-4896-80b7-50d411ad0cd2': { interactionTypeId: '70158413-3ae0-4896-80b7-50d411ad0cd2', name: 'Webchat', color: '#000000', icon: 'fa-comment'},   //Black
                                                                                                                                    'd1add1d7-c4f3-45a4-886d-b7d778fa1f98': { interactionTypeId: 'd1add1d7-c4f3-45a4-886d-b7d778fa1f98', name: 'OverflowedChat', color: '#000000' },
                                                                                                                                    '2e479857-7b74-4e6c-8b53-61e84cedddaa': { interactionTypeId: '2e479857-7b74-4e6c-8b53-61e84cedddaa', name: 'Disabled Skill', color: '' },
                                                                                                                                    '168d6505-2f63-44ae-887c-e279e6fedcf3': { interactionTypeId: '168d6505-2f63-44ae-887c-e279e6fedcf3', name: 'Branding', color: '' } ,
                                                                                                                                    '21f8349e-48b4-44cc-96a6-c8651962908b': { interactionTypeId: '21f8349e-48b4-44cc-96a6-c8651962908b', name: 'Disabled-Branding', color: '' },
                                                                                                                                    '56453114-8023-4612-a4c4-bb8184d5bfdd': { interactionTypeId: '56453114-8023-4612-a4c4-bb8184d5bfdd', name: 'Custom', color: '#A1FFF9' },
                                                                                                                                    'b7fe5108-377d-4601-b160-e19de2132aa3': { interactionTypeId: 'b7fe5108-377d-4601-b160-e19de2132aa3', name: 'User Skill Sets', color: '' },
                                                                                                                                    undefined                             : { interactionTypeId: undefined, name: 'Unknown', icon: 'fa-bolt', color: '#777' },
                                                                                                                                };

                                                    self.options.data.linkedObjects.clientObjectParamDesc           =           {
                                                                                                                                    1001            : { title: 'calldelay' },
                                                                                                                                    1002            : { title: 'campaigndelay' },
                                                                                                                                    1003            : { title: 'pauseevent' },
                                                                                                                                    1004            : { title: 'formname' },
                                                                                                                                    1005            : { title: 'pauseduration' },
                                                                                                                                    1006            : { title: 'internationaldialing' },
                                                                                                                                    1007            : { title: 'allowf8' },
                                                                                                                                    1020            : { title: 'emailaddress' },
                                                                                                                                    1021            : { title: 'emailpassword' },
                                                                                                                                    1022            : { title: 'clientemailaddress' },
                                                                                                                                    1023            : { title: 'clientpassword' },
                                                                                                                                    1024            : { title: 'alias' },
                                                                                                                                    1025            : { title: 'cc' },
                                                                                                                                    1026            : { title: 'bcc' },
                                                                                                                                    1201            : { title: 'stoptime' },
                                                                                                                                    1202            : { title: 'triggertime' },
                                                                                                                                    1203            : { title: 'excludedays' },
                                                                                                                                    1204            : { title: 'exceptionadays' },
                                                                                                                                    1205            : { title: 'exceptionadays' },
                                                                                                                                    1206            : { title: 'exceptionaldaystarttime' },
                                                                                                                                    1207            : { title: 'exceptionaldaystoptime' },
                                                                                                                                    1208            : { title: 'ignorerules' },
                                                                                                                                    1209            : { title: 'problemalertemailid' },
                                                                                                                                    1210            : { title: 'inqueuereqtime' },
                                                                                                                                    1211            : { title: 'inprogressreqtime' },
                                                                                                                                    1213            : { title: 'answeredreqtime' },
                                                                                                                                    1214            : { title: 'polintrate' },
                                                                                                                                    1215            : { title: 'status' },
                                                                                                                                    1217            : { title: 'isInterruptable' },
                                                                                                                                    1218            : { title: 'preferredurl' },
                                                                                                                                    1219            : { title: 'expirationTime' },

                                                                                                                                    10              : { title: 'oldpauseevent' },
                                                                                                                                    15              : { title: 'oldpauseduration' },
                                                                                                                                    8               : { title: 'oldcampaigndelay' },
                                                                                                                                    9               : { title: 'oldcalldelay' },
                                                                                                                                    24              : { title: 'oldinternationaldialing' },

                                                                                                                                    147             : { title: 'live_skill' },
                                                                                                                                    148             : { title: 'staging_skill' },
                                                                                                                                    149             : { title: 'overflow_live_skill' },
                                                                                                                                    150             : { title: 'overflow_staging_skill' },

                                                                                                                                };

                                                    self.options.data.linkedObjects.completedStatuses                   =       [ 'Completed', 'Completed-Resolved', 'Completed-F8', 'closed', 'Callended', 'Dialout', 'Completed-TabClose'];

                                                },

});

$( document ).ready(  function() {
    window.changeAllAnchorTagsEmptyHref();
    BackboneData.reportsRouter = new BackboneData.ReportsRouter();
    Backbone.history.start();
    $('div.full_dtl img').attr('src', photoURL);
    console.log( 'ReportsRouter started!' );
} );

window.changeAllAnchorTagsEmptyHref     =       function() {
                                                    var $anchorTags = $( 'a' );
                                                    for( var index in $anchorTags ) {
                                                         var anchorTag = $( 'a' ).get( index );
                                                         try {
                                                            if( anchorTag.getAttribute( 'href' ) == '#' )
                                                                anchorTag.setAttribute( 'href', 'javascript:void(0)' );
                                                        } catch( exception ) {}
                                                    }
                                                };