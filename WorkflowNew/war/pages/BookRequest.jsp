<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" import="java.util.ResourceBundle"%>
<%@ page import="com.acti.util.ModeUtil"%>
<%@ page import="com.acti.controller.AdminQueueGae"%>
<%
	ModeUtil sModeUtil = new ModeUtil();
	String sWebChatUrl = sModeUtil.getWebchatUrlByMode();
	
	AdminQueueGae aqc = new AdminQueueGae();
	String accmap	= aqc.getAccounts();
	String agentname	=	(String)session.getAttribute("username");
	
%>
<%
    response.setHeader("Cache-Control","no-store"); //HTTP 1.1
    response.setHeader("Pragma","no-cache"); //HTTP 1.0
    response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
%>
<html xmlns="http://www.w3.org/1999/xhtml">

  <head>
  	<title>Workflow</title>
  		<meta name="viewport" content="width=device-width, initial-scale=1.0">
	  	<link rel="stylesheet" type="text/css" href="../css/bootstrap.css" media="screen">
	  	<link rel="stylesheet" type="text/css" href="../css/bootstrap-timepicker.css">
	  	<link rel="stylesheet" type="text/css" href="css/style_new2.css">
      	<link rel="stylesheet" type="text/css" href="../css/font-awesome.css">
      	<link rel="stylesheet" type="text/css" href="../css/font-awesome4.css">
    <!--   <link rel="stylesheet" media="screen" type="text/css" href="/css/layout.css" /> -->
	<link rel="stylesheet" href="/css/datepicker.css" type="text/css" />
	<script type="text/javascript">
  var currentUser = '<%=agentname%>';
	var googleLogin = '<%=session.getAttribute("googleLogin")%>';
	var photoURL	= '<%=session.getAttribute("photoURL")%>';
	if(photoURL == null || photoURL == "null")
		photoURL = "images/user-icon.jpg";
	var accMap = '<%=accmap%>';
	if(accMap != "Failure")
 			accMap = JSON.parse(accMap);
 		else
 		{
 			accMap = new Object();
 			accMap.internal = new Array();
 			accMap.external = new Array();
 		}
 		

	var external_accounts 	= accMap.external,
	internal_accounts 	= accMap.internal;
	
	</script>
     </head>
     
 	 <body>
  		<div class="wrapper" id = "foo">
  			<header>
	  			<a href="#" class="logo pull-left">Book Request</a>
	  			
				<ul class="nav nav-pills pull-right fetch_log">
				<!-- <li id="fetchedaccount"></li> -->
					<li>
           	 <div class="popover bottom" id="fetchdtl">
              <div class="arrow"></div>
              <div class="popover-content">
                <input id="fetchinbox" type="text" placeholder="" class="fch_input" onkeydown="Javascript: if(event.keyCode==13) $('#fetchme').trigger('click');"/>
                <a id ="fetchme" class="btn btn-success btn-fch">Fetch</a>
         
              </div>
            </div>
					</li>
					<li class="sign pull-right">
            <div class="full_dtl">
							<img src="images/user-icon.jpg" /></div>
              <div class="popover bottom" id="log_dtl">
                <div class="arrow"></div>
                <!-- <h3 class="popover-title">Popover bottom</h3> -->
                <div class="popover-content">
                  <div class="userimg pull-left">
                    <img src="images/user-icon.jpg" />
                  </div>
                  <div class="userdtl pull-left"> 
                    <h5 style="text-transform: lowercase;"><c:out value="<%=agentname%>"/></h5>
                    <span><c:out value="${loginid}"></c:out></span>
                  </div>
                </div>
                <div class="clearfix"></div>
                <div class="sign_foot">
                  <a class="btn btn-default pull-right" onclick="deleteCookie('<c:out value="<%=agentname%>"/>')" >Sign Out</a>
                </div> 
            </div>            
          </li>
				</ul>	
  			</header><!--header-->

  			<div class="tabs tab_holdq">
  			
  			<div class = 'content'>Together we are building a 'culture of learning'.  Thanks for your role and leadership in reading.  We want to encourage people to read more books.  As long as you read one, we would like to get you another book (limit 2 at one time).</div>
  			<table style="margin: 0px 0px 0px 10px">
  					
  					<tr align="left"><td><b>What book did you just finish?</b></td></tr>
      				<tr align="left"><td><input id="finishedbook" type="text" class="form-controlq" placeholder="Book NAME" style="width: 100%" required/></td></tr>
  			</table>
  			<div class = 'content'>See the Full Creative Booklist<a target="blank" href=" http://goo.gl/1z6i8u."> http://goo.gl/1z6i8u.</a> Or choose non-fiction titles that improves your knowledge. (Sorry, no romance novels or sci-fi thrillers though we love those too.)</div>
  			<table style="margin: 0px 0px 0px 10px">
  					<tr align="left"><td><b>What book would you like to request next?</b></td></tr>
      				<tr align="left"><td><input id="nextbook" type="text" class="form-controlq" placeholder="Book NAME" style="width: 100%" required/></td></tr>
  			</table>
  			<div class = 'content'>Where should we send the book? ( Your Audible account id)</div>
  			<table style="margin: 0px 0px 0px 10px">
  					<tr align="left"><td><b>Where should we send the book?</b></td></tr>
  					<tr align='left'><td><input id="email" type="text" class="form-controlq" placeholder="Your Email" style="width: 100%" required/></td></tr>
					<tr colspan=2  align="center" style="padding: 7px 0px 0px 70px;"><td><input type="button" value="Submit" id="submit" onclick="triggerAR();"/></td></tr>
  			</table>
      				 
      				 <div id='showmsg' style="padding: 12px 1px 0px 175px;color: red;">
      				 </div>
      				 
        </div><!--tabs-->
        
        <div id = realTimeMessage style="display: none">
 <div id="jError" style="opacity: 1; min-width: 250px; top: 64px; left: 409px;"></div>

        
</div>

	<script type="text/javascript" src="js/jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="/js/spin.js"></script>
    <script type="text/javascript" src="js/action_new.js"></script>
    <script type="text/javascript" src="js/bootstrap.js"></script>
    <script type="text/javascript" src="js/MessageWindow.js"></script>
   <!--  <script type="text/javascript" src="js/action.js"></script> -->
<!-- LoopTodo Feedback Form Code -->
<script id="looptodo_loop_embed_code" type="text/javascript" src="http://my.loopto.do/form/js/loop-embed-code.js?loopKey=agtzfmxvb3BhYmFja3IRCxIETG9vcBiAgICQn5nmCAw&domain=my.loopto.do">
</script>
<script type="text/javascript">
var looptodo_load_chain = window.onload;
window.onload = function() {
    //looptodo_feedback_btn_init({ name : "John Doe", email : "test@example.com", allowAnonymous: true, hideNameEmail: false });
    looptodo_feedback_btn_init();
    if(looptodo_load_chain) 
        looptodo_load_chain();
};

//$('#email').val(currentUser)
var messageWindow = new MessageWindow();


function triggerAR()
{
	var finishedbook 	 = $('#finishedbook').val();
	var nextbook   		 = $('#nextbook').val();
	var email  			 = $('#email').val();
	console.log('inside trigger function'+finishedbook+"----"+nextbook+"---"+email);
	
	 if(finishedbook == ""||nextbook == ""||email == "")
		{
		 $('#showmsg').html("All the fields are manditory");
		$('#showmsg').show();
		setTimeout(function(){
			   $('#showmsg').hide();
			}, 5000);
		//messageWindow.popUpMessage( "All the fields are manditory", 3000 );
		
		} 
	else
		{
		$.ajax({
			type : "GET",
			url  : "/activeresponse?finishedbook="+finishedbook+"&nextbook="+nextbook+"&email="+email,
			async:true,
			success : function(data)
			{
				console.log('triggered fine');
				
				 $('#showmsg').html("successfully submited");
				$('#showmsg').show();
				setTimeout(function(){
					   $('#showmsg').hide();
					}, 5000);
				//messageWindow.popUpMessage( "Successfully submited", 3000 );
				$('#finishedbook').val("");
				$('#nextbook').val("");
				$('#email').val("");
				
				/* $('#realTimeMessage').css('display','block');
				$('#jError').append('successfully submited'); */
				
			}
		 });		
		}
	
	}



</script>

<style type = "text/css" >
td{
padding: 10px 0px 0px 10px

}
.content{
margin: 10px 0px 0px 20px;
width: 750px;
}
}

</style>

<!-- End LoopTodo Feedback Form Code -->
    </body>
  </html>
