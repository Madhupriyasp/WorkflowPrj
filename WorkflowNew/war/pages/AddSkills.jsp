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
	  			<a href="#" class="logo pull-left">Add Skills</a>
	  			
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

  			
        <div id = realTimeMessage style="display: none">
 <div id="jError" style="opacity: 1; min-width: 250px; top: 64px; left: 409px;"></div>

        
</div>

	<script type="text/javascript" src="js/jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="/js/spin.js"></script>
    <script type="text/javascript" src="js/action_new.js"></script>
    <script type="text/javascript" src="js/bootstrap.js"></script>
    <script type="text/javascript" src="js/MessageWindow.js"></script>
  <script type="text/javascript" src="/js/dataretreival_new.js"></script>



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
<br/>
<br/>
Upload Your CSV File For Adding Agent  According To There Skill...


<a ><button type="button" class="btn btn-default" id="newsave_csv" title="Upload CSV"  data-toggle="popover">Upload File</button><input id="newchoose-file" type="file" name="myFile" style="display:none;"></a>	
 
 <div id="deleting_status"class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
       <div id="dynamicModalstartdiv">
       </div>
    </div>
  </div>  
    
    </body>
  </html>
