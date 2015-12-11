var Helper = {
	
	clone									: 				function( obj ) {

															    if (null == obj || "object" != typeof obj) return obj;
															    var copy = obj.constructor();
															    for (var attr in obj) {
															        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
															    }
															    return copy;

															},

	getArrayFromObject						: 				function( object ) {

																var returnArray = [];

																for( var key in object ) {

																	returnArray.push( object[ key ] );

																}

																return returnArray;

															},

	getObjectFromArray 						: 				function( key, array ) {

																var returnObject = {};

																for( var index in array ) {

																	if( key ) {
																		returnObject[ array[ index ][ key ] ] = array[ index ];
																	} else {
																		returnObject[ array[ index ].id ] = array[ index ];
																	}

																}

																return returnObject;

															},

	sortComparator 							: 				function( property ) {

															    return function( a, b ) { return a[ property ] - b[ property ]; };

															},

	ISODateString 							: 				function ( dateObject ){

 																function pad( number ) { return number < 10 ? '0' + number : number }

																return dateObject.getUTCFullYear()+'-'
																		+ pad(dateObject.getUTCMonth()+1)+'-'
																		+ pad(dateObject.getUTCDate())+'T'
																		+ pad(dateObject.getUTCHours())+':'
																		+ pad(dateObject.getUTCMinutes());

															},

	removeDuplicatesFromArray				: 				function( arrayWithDuplicateElements ) {

																var arrayWithUniqueElements = [];
						                                        $.each( arrayWithDuplicateElements, function( index, element ){
						                                            if( $.inArray( element, arrayWithUniqueElements ) === -1)
						                                            	arrayWithUniqueElements.push( element );
						                                        });
						                                        return arrayWithUniqueElements;

															},


	// Gets the param value from the url															
	gup                                     :                function gup( url, paramLabel ) {

                                                                paramLabel = paramLabel.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
                                                                var regexS = "[\\#&]"+paramLabel+"=([^&#]*)";
                                                                var regexN = "[\\#?]"+paramLabel+"=([^&#]*)";
                                                                var regex = new RegExp( regexS );
                                                                var regen = new RegExp( regexN );
                                                                var results = regex.exec( url );
                                                                var results1 = regen.exec( url );

                                                                if( results == null )
                                                                    if( results1 == null )
                                                                        return '';
                                                                    else 
                                                                        return results1[1].replace( '%20', ' ' );
                                                                else
                                                                    return results[1].replace( '%20', ' ' );

                                                            },

    /* Strips out the html tags and gives returns only the texts */
    stripHtml 								: 				function( html ) {
															   var tmp = document.createElement("DIV");
															   tmp.innerHTML = html;
															   return tmp.textContent || tmp.innerText || "";
															},

	getPDT 									: 				function( date ) {
 																return new Date( Helper.offsetconversion( Helper.toGMT( new Date() ) ) );
															},

	//for converting the date to pst/pdt timezone
    offsetconversion            			:    			function( dbdate ) {
			                                                    var date = new Date(dbdate);
			                                                    var datemill    =   date.getTime();
			                                                    var pdtoffset   =   "";
			                                                    if(timezone == "PST")
			                                                        pdtoffset   =   480;
			                                                    else
			                                                        pdtoffset   =   420;
			                                                    dateoffset  =   date.getTimezoneOffset();
			                                                    if(dateoffset<0)
			                                                        {
			                                                            dateoffset  =   -(dateoffset);
			                                                            pdtoffset   =   pdtoffset+dateoffset;
			                                                            var pdfoffsetmilli  =   pdtoffset   * 60000;
			                                                            pdfoffsetmilli  =   datemill    -   pdfoffsetmilli;
			                                                            return pdfoffsetmilli;
			                                                        }
			                                                    else if(dateoffset>0)
			                                                        {
			                                                            pdtoffset   =   pdtoffset - dateoffset;
			                                                            var pdfoffsetmilli  =   pdtoffset   * 60000;
			                                                            pdfoffsetmilli  =   datemill    -   pdfoffsetmilli;
			                                                            return pdfoffsetmilli;
			                                                        }
			                                                    else if(dateoffset == 0)
			                                                        {
			                                                            var pdfoffsetmilli  =   pdtoffset   * 60000;
			                                                            pdfoffsetmilli  =   datemill    -   pdfoffsetmilli;
			                                                            return pdfoffsetmilli;
			                                                            
			                                                        }
			                                                },

	toGMT                       			:       		function( date ) {
			                                                    return new Date( date.getTime() + ( date.getTimezoneOffset() * 60 * 1000 ) );
			                                                },
			                                                		
    generateUniqueId            			: 		        ( function() {
			                                                    function s4() {
			                                                        return Math.floor((1 + Math.random()) * 0x10000)
			                                                               .toString(16)
			                                                               .substring(1);
			                                                    }
			                                                    return function() {
			                                                                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
			                                                            };
			                                                } )(),
    getDisplayDomainName 					:               function(domainName){
    	
			                                                if(domainName.indexOf("http://") > -1)
			                                                	domainName = domainName.replace("http://","");
			                                                else if(domainName.indexOf("https://") > -1)
			                                                	domainName = domainName.replace("https://","");

			                                                if(domainName.length>30)
			                                                	domainName = domainName.substring(0,28)+"...";

			                                                return domainName;
			                                                },


};