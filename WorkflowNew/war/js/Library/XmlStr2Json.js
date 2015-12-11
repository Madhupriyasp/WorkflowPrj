function xmlStr2Json(obj){
		
		$("#messagebody").html('');
		
		var escapedXmlData		=		obj;//$("#"+b).html();
		var xmlObj				=		null;

		escapedXmlData			=	escapedXmlData.replace(/&nbsp;/gi,'');//&not;
		escapedXmlData			=	escapedXmlData.replace(//gi,'&#172;');
		escapedXmlData			=	escapedXmlData.replace(/&/gi,'&amp;');
		escapedXmlData			=	escapedXmlData.replace(/\+/g,' ');
		var xml					=	unescape(escapedXmlData);

		var missing_fields="";

		xml		=		xml.replace('<?xml version="1.0" encoding="UTF-8"?>','');

		if (window.DOMParser)
		{
			parser=new DOMParser();
			xmlObj=parser.parseFromString(xml,"text/xml");
		}
		else // Internet Explorer
		{
			xmlObj=new ActiveXObject("Microsoft.XMLDOM");
			xmlObj.async=false;
			xmlObj.loadXML(xml); 
		}

		function escapeBackHtml(str) 
		{
		    return String(str).replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"');
		}

		var returnObject = {};
		for(var i=0;i<xmlObj.documentElement.childNodes.length;i++)
		{
			try{
				var tempLabel = xmlObj.documentElement.childNodes[i].childNodes[0].childNodes[0];

				if(  typeof tempLabel == "undefined" )
				{

				}
				else
				{ 

					Label = xmlObj.documentElement.childNodes[i].childNodes[0].childNodes[0].nodeValue;//Label
					Value = xmlObj.documentElement.childNodes[i].childNodes[1].childNodes[0].nodeValue;//.replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'"); //value

					var decodedValue = Value;

					if( decodedValue.indexOf( 'http://' ) != -1 )
						decodedValue =	decodeURIComponent(decodedValue);
					
					decodedValue     =  decodedValue.split('+').join(' ');

					decodedValue	 =	escapeBackHtml(decodedValue);
					
					returnObject[ Label ] = decodedValue;
					
				}
			}
			catch (e)
			{
				fieldsNotFoundFlag = true;
				missing_fields += xmlObj.documentElement.childNodes[i].childNodes[0].childNodes[0].nodeValue+", ";
				console.error( e );
			}
			
			
		}
		return returnObject;
	}	