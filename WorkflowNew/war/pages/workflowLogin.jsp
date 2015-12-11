



<!DOCTYPE html>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">

<link rel="stylesheet" type="text/css" href="css/login.css" media="all" />
<link href="css/style.css" type="text/css" rel="stylesheet" />
<link rel="stylesheet" type="text/css" href="css/full_theme.css" media="all" />
<link rel="stylesheet" type="text/css" href="css/CustomStyle.css" media="all" />
<link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet">
<script type="text/javascript" src="js/jquery-1.10.2.min.js"></script>
<script src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/aes.js"></script>
<!-- <script type="text/javascript" src="/js/cookies.js"></script> --> 
<script type="text/javascript" src="/js/loginpage.js"></script>
</head>
<script type="text/javascript">
var wrongpassword		=	"<c:out value="${wrongpassword}"></c:out>";
var userName			=	"<c:out value="${userName}"></c:out>";
if(wrongpassword == null || wrongpassword == '')
	{
		wrongpassword		= "<c:out value="${param['wrongpassword']}"></c:out>";
		userName 			= "<c:out value="${param['userName']}"></c:out>";
	}
console.log(wrongpassword);
console.log('user name : ',userName);
</script>
<%-- <% 
	if(session.getAttribute("loginmap") == null){
		
		response.sendRedirect("pages/workflowLogin");
		
	}else{
		response.sendRedirect("/AdminQueueGae");
	}



%> --%>


<%
  HttpServletResponse hsr = (HttpServletResponse) response;
  hsr.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  hsr.setHeader("Pragma", "no-cache");
  hsr.setHeader("Expires", "0");
  hsr.setDateHeader("Expires", -1);
 %>

<body class="login_backImage" style="font-family: sans-serif;" >
	<div class="wrapper">
		<header style="height: 55px; background-color: #1f1f1f;">
	  			<a href="#" class="logo pull-left" style="text-decoration: none;margin: 1px 24px;color: #ffffff;font-family: open sans;font-size: 18px;font-weight: 400;text-transform: capitalize; border: 0px;">Workflow Management</a>
				
                <div class="logo pull-right"><span style="position: relative;float: right;top: 0px;left: -8px;"><a style="color: whitesmoke;left: 1px;position: relative;">Have a Question?</a><br><a style="color: whitesmoke; position: relative;top: 6px">Speak with us 800.220.5390</a></span></div>
  		</header>
		<!-- <div id="header_wrapper">

        <div class="tool_nav">
        <div id="voice-box"><span>Loading..</span></div>
            <ul>
                                       
                <li style="background:url('http://commondatastorage.googleapis.com/conversionsupportimages/conversionsupportimages/logo1.jpg') no-repeat none; background-size:30px;padding: 10px "><a href="http://www.conversionsupport.com/" target="_blank" style="position:relative;top: 2px;" class="selected">Work Flow</a> <span></span></a></li>
                <span style="position: relative;float: right;top: 3px;left: -8px;"><a style="color: whitesmoke;left: 1px;position: relative;">Have a Question?</a><br><a style="color: whitesmoke; position: relative;top: 6px">Speak with us 800.220.5390</a></span>
            </ul>
            </div>
             header_ac_holder
        </div> tool_nav -->
</div> <!--  wrapper  -->
 <div id="newlogo" ></div>
<div id="content">
    <div id="content_inner_wrapper"> <!-- controls the width of layout -->

		<div class="login_wrapper">
		<div><a style="position: relative;top: -30px;color: rgb(102, 99, 99);font-size: 34px;left: -2px; font-family: sans-serif;">Sign In</a></div>
		<div id="error" style="display:none;position: relative;top: -4px;color:red;font-family: sans-serif;"><script type="text/javascript">
		$('#error').html(wrongpassword)
		if(wrongpassword.length > 0)
		{
			document.getElementById('error').style.display	=	"block";
			setTimeout(function(){document.getElementById('error').style.display	=	"none";},3000);
		}
		</script></div>
		<div id="formalignment">
              <form  class="login_form" method="post" id="login"  action="ManageQueue<c:if test="${redirectUrl != ''}">?redirectUrl=${redirectUrl}</c:if>" style="width:200px;" onsubmit="javascript :return check()">
           <i class="icon-user icon-2x"></i>
             <i class="icon-lock icon-2x"></i>
             <form action="/ManageQueue<c:if test="${redirectUrl != ''}">?redirectUrl=${redirectUrl}</c:if>" autocomplete="off">
              <input type="text" name="username" placeholder = "User Name" autocomplete="off" id="username"   style="bottom: 10px;width:230px;	font-family : sans-serif; margin:0px 0px 3px;	background-color: whitesmoke;	border-radius: 5px;	left: -75px;	position: relative;	-webkit-box-shadow: 0 0 0 50px whitesmoke inset;padding: 14px 3px 14px 43px;border: solid 1px #bbb;font-size: 14px;font-weight: normal;line-height: 20px;color: #555;"/>
              <span style="position: relative;top: 10px;"> 
               <input type="password" name="password" placeholder="Password" autocomplete="off" id = "Password" style="width:230px;	margin:0px 0px 3px;	background-color: whitesmoke; font-family : sans-serif;	border-radius: 5px;	left: -75px;	position: relative;	-webkit-box-shadow: 0 0 0 50px whitesmoke inset;	padding: 14px 3px 14px 43px;border: solid 1px #bbb;font-size: 14px;font-weight: normal;line-height: 20px;color: #555;" />   </span>
                       <input type="submit" class="newsignin" onsubmit="" id="submit_cridentiials" style="position: absolute;top: 150px;" />
                <ul style="width:200px;height:20px;position: relative;left: -80px;top: 20px;">
                <li style="display: inline;float:left;"><input type="checkbox" name="remember_checkbox" id="checking"  onclick="callme();" style="display: inline;float:left;position: relative;left: 10px;
                "></li>
                <li><a style="display: inline;font-family: sans-serif;position: relative;padding-left: 10px;right: -8px;top: 3px;color: #D6D3D3;
font-size: 10px;">Remember Me</a></li>
                </ul>       
                </form>
               	
                <div class="button_holder1" style="position: relative;top: 60px;margin-left:-65px;">  
                	<div class="googleSignIn googleimage" align="center" onclick="fullAuth();">
                		
                	</div>
                </div>
                <div class="signuptext" style=" margin-left: -1%; margin-top: 95px;">

				</div>
            </form>
            </div>
        <div class="clear_all"></div>
        
	    <!--     <div id="login_thirdParty_authentication"  style="border-radius : 3px;">
			        <span style="position: relative;left: 115px;position: relative;top: 15px;">
					<span id="login_with_facebook_account" class="product-image-2"><img src="../images/facebook_blue_old.png" style="height: 36px;width: 36px;position: relative;left: 90px;border-radius: 2px;"/></span>
					</span>
					<span style="position: relative;top:-15px;left: -60px;top: 30px;">
					<span  id="login_with_google_account" class="product-image-2"><img src="../images/newgoogle.png" style="height: 40px;width: 46px;position: relative;left: 195px;top: -13px;"/></span>
					</span>
					<a style="position: relative;">OR</a>
					<span id="signuptextplace">	
					<a href="Javascript:void(0)" class="signup" style="font-family: sans-serif" id = "signup" >New User? Sign up Now!</a>
						<img src="../images/newsignup.png" style="height: 50px;width: 50px;position: relative;left: 150px;"/>
						<span><input type="button" value="Sign-up Now" id="signupbutton" autocomplete="off"></span>
					</a>
					</span>
	       <span></span>
	        <div style="color: #555; margin-bottom: 12px;">---------------   or Login with   ---------------</div>
	          <div id="login_with_facebook_account"> </div>
	          <div id="login_with_google_account"> </div>
	        </div>  -->
	          	 		
        </div> <!-- login_wrapper -->
    </div> <!-- content_inner_wrapper -->
</div> <!-- content -->
    <div class="popup_window" id="more_action">
     <div class="popup_wrapper"> <!-- inner div to align -->
          <div class="close_popup">Cancel</div>
              <div class="popup_content" id="delete_agent">
                  <h3>Do you want to delete this chat agent forever?</h3>
                   <div class="clear_all"></div>
                  <a href="#" class="global_btn"><span class="delete"></span>Delete Forever</a>   
               <div class="clear_all"></div>
              </div> <!-- popup_content lead_delete -->          
          
    </div><!-- popup_wrapper -->
    </div><!-- popup_window more_action-->
    
<div class="black_screen"></div>  <!-- black_screen -->
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
</script>
<!-- End LoopTodo Feedback Form Code -->
</body>
</html>