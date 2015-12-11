<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%@ page import="com.acti.util.ModeUtil"%>
	<script type="text/javascript" src="/js/jquery-1.10.2.min.js"></script>
	 <script type="text/javascript" src="/js/AvailableagentsAppender.js"></script>

<%
ModeUtil sModeUtil = new ModeUtil();
String sWebChatUrl = sModeUtil.getWebchatUrlByMode();%>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>TEST JSP FILE FOR COMET</title>
  <script type="text/javascript">
       var timezone   =	'<c:out value="${Timezone}"/>';
		(function()
		{
			if( window.console == null || window.console == undefined || !window.console )
				console = { log: function() {}, info: function() {}, warn: function() {}, error: function() {}, trace: function() {}, debug: function() {} };
			else if(!console.debug)
				console.debug = function() {};
		
			var independentRouting	=	
			{
					
				targetWindow	:	null	,
				dataToPost		:	null	,
				busy			:	false	,
				
				postMessage		:	function( data )
				{
					console.log("inside the postmessage function for the data"+JSON.stringify(data));
					 ( this.targetWindow == null ) ? this.targetWindow = document.getElementById('irframe').contentWindow : console.info('');
					 
					 if( this.targetWindow != null ) {console.log("this is the place where postmessage gets called again!! ::"); this.targetWindow.postMessage( JSON.stringify( data ) , '*' );}
				},
				
				_receiveMessage	:	function( message )
				{
					console.info("inside the receive message function (cc):: "+message);
				},
				
				init			:	function( login , name )
				{
					console.log("the init is called at this point");
					this.dataToPost			=	new Object();
					this.dataToPost.action	=	'init';
					this.dataToPost.login	=	login;
					this.dataToPost.name	=	name;
					console.log("going to call postmessage for the data"+JSON.stringify(this.dataToPost));
					this.postMessage(this.dataToPost);
				}
			}
			
			console.log("exitted the $ir object and the next line is printed");
			if( !window.$ir ){window.$ir=independentRouting;}
			( window.addEventListener ) ? addEventListener( 'message' , $ir._receiveMessage , false ) : attachEvent( 'onmessage' , $ir._receiveMessage );	//Attaching post message listener
		})();
		 var webchatUrl = "<%=sWebChatUrl%>";
		window.onload	=	function()
		{
			var _irFrame	=	document.createElement('iframe');
			_irFrame.setAttribute( 'id' , 'irframe' );
			_irFrame.setAttribute( 'src' , webchatUrl+'/pages/SBIntegrated/workflowRouting.html?clearcache1');
			_irFrame.setAttribute( 'style' , 'display:none;' );
			_irFrame.setAttribute( 'height' , '00;' );
			_irFrame.setAttribute( 'width' , '00' );
			document.body.appendChild(_irFrame);
			
			if( window.addEventListener )
				_irFrame.addEventListener( 'load' , onIFrameLoad , false );
			else
				_irFrame.attachEvent( 'onload' , onIFrameLoad  );
		}
		
		if( window.addEventListener )
		{
			addEventListener( 'message' , _Listener , false );
		}
		else
		{
			attachEvent( 'onmessage' , _Listener);
		}
		
		function _Listener( event )		//This is to listen to messages from the parent window
		{
			console.info( event );
	//		$('#printpara').html(event.data);
			agentData.parseAndShowData(event.data);
			
		}
		
		function onIFrameLoad()
		{
			console.info('Lets start testing, Shall we?');
			$ir.init("workflowtest","workflowtest");
		}
		
</script>
</head>
<body>
<h1> showing only live interaction details in this part</h1>
<p id = "printpara"> </p>
<h1> showing only agent details in this next part</h1>
<p id = "booga"> </p>
<h1> we are parsing it here</h1>
<p id = "looga"> </p>
</body>
</html>