$(document).ready(function() 
{
	var checker	=	document.getElementById('checking').checked;
				storage.checkforCookie();
});
      var storage = 
      {
       cookies  : null ,
       counter  : 0  ,
       cookieName : null ,
       cookieValue : null ,
   
       checkforCookie	:	function()
       {
    	   myval	=	document.cookie;
    	   	try
			{
			if(myval != "")
			{
				 for(var i=0;i<myval.split(";").length;i++)
	    		 {
	    		   		cookval	=	myval.split(";")[i];
	    		   		c_name=unescape(cookval);
	    				c_name	=	cookval.split("=")[0];
	    		   		c_name= c_name.trim();
	    		   		if(c_name != "JSESSIONID" && c_name != "tabselectedvalue" ) 
	    				{
	    					if((c_name != "__utma" && c_name != "__utmc"  && c_name != "__utmz" ) )
	    						{
				    		   		if(storage.validateEmail(c_name))
				    		   			
				    		   			{
				    		   				$('#checking').attr('checked','checked');
				    		   				c_value	=	cookval.split("=")[1];
											c_value= unescape(c_value);
											document.getElementById('username').value	=	c_name;
											document.getElementById('Password').value	=	c_value;
											$('#login').submit();
				    		   			}
	    					}
	    			}
	    		 }
			}
			else
			{
					document.getElementById('username').value	=	"";
					document.getElementById('Password').value	=	"";	
					$('#checking').removeAttr('checked');
			}  
			}
			catch ( e)
			{
				console.log("an eception occuerd"+e);
			}
       },
   
       setCookie : function (c_name,value,exdays)
       {
        var exdate=new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
        document.cookie=c_name + "=" + c_value;
       },
       
       getCookie	:	function (obj)
       {
   		c_id	=	obj.id;
   		c_name	=	document.getElementById(c_id).value ;
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start == -1)
          {
          c_start = c_value.indexOf(c_name + "=");
          }
        if (c_start == -1)
          {
        	c_value = null;
          }
        else
          {
          c_start = c_value.indexOf("=", c_start) + 1;
          var c_end = c_value.indexOf(";", c_start);
          if (c_end == -1)
          {
        c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start,c_end));
        }
        document.getElementsByName('password')[0].value = c_value;
        if(c_value != null)
        {
        		$('#checking').attr('checked','checked');
        }
        return c_value;
        },
        validateEmail : function (sEmail) {
    	    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    	
    	    if (filter.test(sEmail)) {	
    	        return true;	
    	    }	
    	    else {	
    	        return false;	
    	    }	
    	},
       
       check  : function(name)
       {
        if( this.getCookie(name) )
        {
         return name;
        }
        else
        {
         console.log('Looks like the cookie is unavailable');
        }
       },
      };
      var storeData = 
      {
        check  : function(name)
        {
         return storage.check(name);
         window.csStorage = storeData;
        },
        set   : function(name,value,days)
        {
         storage.setCookie(name, value, days);
         window.csStorage = storeData;
        },
     };

var tab_cookie = {
		setSelectedTabInCookie			:	function(selectedtab)
		{
			document.cookie="tabselectedvalue" + "=" + selectedtab;
		},
		getSelectedTabFromCookie		:	function(c_name)
		{
			var i,x,y,ARRcookies=document.cookie.split(";");
			for (i=0;i<ARRcookies.length;i++)
			{
			  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
			  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
			  x=x.replace(/^\s+|\s+$/g,"");
			  if (x==c_name)
			  {
				  return unescape(y);
			  }
			}
		},
		deleteCookie				:	function(name)
		{
			var d = new Date();
			 document.cookie = name +'=; expires=' + d.toGMTString() + ";" + ";";
		},
};
var internationalization_lang = {
		setlangcookie			:	function(lang)
		{
			document.cookie="org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE" + "=" + lang;
		},
		
		getlangcookie		:	function()
		{
			var i,x,y,ARRcookies=document.cookie.split(";");
			for (i=0;i<ARRcookies.length;i++)
			{
			  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
			  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
			  x=x.replace(/^\s+|\s+$/g,"");
			  if (x=='org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE')
			  {
				  return unescape(y);
			  }
			}
		},
		
		deleteCookie				:	function()
		{
			 var d = new Date();
			 document.cookie = 'org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE' +'=; expires=' + d.toGMTString() + ";" + ";";
		},
};
