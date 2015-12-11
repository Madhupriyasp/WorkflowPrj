//for remember me functionality using cookies
/*function callme()
	{
	 	var	LoginId 		= document.getElementById("username").value ;
		var	LoginPassword = document.getElementById("Password").value;
			if(document.getElementById('checking').checked)
			{
				storage.setCookie(LoginId,LoginPassword,730);
			}
		else
		{
					
	//		console.log("comes in else");
			tab_cookie.deleteCookie(LoginId);
		}
	
	}*/
	//ends here

//validates the fields
function check()
{
	clientLoginId 		= document.getElementById("username").value ;
	clientLoginPassword = document.getElementById("Password").value;

	if((clientLoginId!="Email Address")&&(clientLoginPassword!="") &&(checkEmailIDFormat()))
	{
		callme();
	}
	else
	{
		if( ( (clientLoginId=="Email Address") || (clientLoginId=="") )&& ( (clientLoginPassword=="") ||(clientLoginPassword=="") ) )
		{
			document.getElementById('error').style.display	=	"block";
			document.getElementById('error').innerHTML	=	'Fields cannot be null';
			$('#username').focus();
			setTimeout(function(){
				document.getElementById('error').style.display	=	"none";
			},3000);
		}
		else if((!checkEmailIDFormat()))
		{
			document.getElementById('error').style.display	=	"block";
			document.getElementById('error').innerHTML	=	'Invalid Email id';
			$('#username').focus();
			setTimeout(function(){
				document.getElementById('error').style.display	=	"none";
			},3000);
			
		}else if(clientLoginPassword=='')
		{
			document.getElementById('error').style.display	=	"block";
			document.getElementById('error').innerHTML	=	'Password is required';
			$('#Password').focus();
			setTimeout(function(){
				document.getElementById('error').style.display	=	"none";
			},3000);
		}
	 
	return false;
	}
}
//ends here

//checking the mail id format
function checkEmailIDFormat()
{
 
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  var address = document.getElementById('username').value;
  if(reg.test(address) == false) 
  {
      return false;
  }
  else
  {
	  return true;
  }
}

function fullAuth(){
	
	var fullOAuthUrl;
	var serviceAccountId;
	var redirectUrl;
	var errorUrl;
	var host = 'http://' + window.location.host;
	var key = "workflowURL";
	
	if(host.indexOf('conversionsupportlive-hrd') != -1){
		fullOAuthUrl		= 'http://live-fullauthservices.appspot.com/oauth/2/authentication/google';
		serviceAccountId	= '03be43cf-eb6b-40f6-9bac-18e4f1dec3b5';
		redirectUrl			= encodeURIComponent(host + '/fullOAuthCallback');
		errorUrl			= encodeURIComponent(host + '/fullOAuthErrorCallback');
		key					+= "Live";
	}
	else if(host.indexOf('conversionsupportstaging-hrd') != -1){
		fullOAuthUrl		= 'http://staging-fullauthservices.appspot.com/oauth/2/authentication/google';
		serviceAccountId	= 'e7b8b1de-c006-4452-9004-74fc2b73ad0e';
		redirectUrl			= encodeURIComponent(host + '/fullOAuthCallback');
		errorUrl			= encodeURIComponent(host + '/fullOAuthErrorCallback');
		key					+= "Staging";
	}
	else{
		fullOAuthUrl		= 'http://staging-fullauthservices.appspot.com/oauth/2/authentication/google';
		serviceAccountId	= 'e7b8b1de-c006-4452-9004-74fc2b73ad0e';
		redirectUrl			= encodeURIComponent('http://localhost:8888/fullOAuthCallback');
		errorUrl			= encodeURIComponent('http://localhost:8888/fullOAuthErrorCallback');
		key					+= "Local";
	}
	
	var allowExternalUser	= 'true';
	var reauthenticate		= 'true';
	var signInWithGoogleUrl = fullOAuthUrl+'?serviceAccountId='+serviceAccountId+'&redirectUrl='+redirectUrl+'&errorUrl='+errorUrl+'&allowExternalUser='+allowExternalUser+'&reauthenticate='+reauthenticate;	
	
	console.log('url : '+signInWithGoogleUrl);
	$.ajax({
		type: 'GET',
		url: '/setValueInSession?key=' + key + '&value=' + host,
		async: false,
		success: function(data)
		{
			console.log('Success');
		}
	});
	window.location 		= signInWithGoogleUrl;
}


//ends here