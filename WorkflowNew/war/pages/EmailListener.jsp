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
		var googleLogin = '<%=session.getAttribute("googleLogin")%>';
		var photoURL	= '<%=session.getAttribute("photoURL")%>';
		if(photoURL == null || photoURL == "null")
			photoURL = "images/user-icon.jpg"; 
 		var emailListenerClientDetails 	 =	${emailListenerDetails},
 		activeListenersCount		  	 = 0,
 		inactiveListenersCount	 		 = 0,
 		currentUserMail					 = "<%=agentname%>";
 		
</script>

     </head>
     
 	 <body>
  		<div class="wrapper" id = "foo">
  		<nav class="navbar navbar-inverse" role="navigation">
		<div class="container-fluid">
			<div class="navbar-header pull-left">
				<button class="navbar-toggle collapsed pull-left"
					data-toggle="collapse" data-target=".navbar-collapse">
					<span class="icon-bar"></span> <span class="icon-bar"></span> <span
						class="icon-bar"></span>
				</button>
				<a href="#" class="navbar-brand">Workflow Management</a>
			</div>

			<ul class="nav navbar-nav navbar-right" style="margin-right: 20px;">

				<li class="pull-right">
					<div class="full_dtl">
						<img class="profpic" src="images/user-icon.jpg" />
					</div>
					<div class="popover bottom" id="log_dtl">
						<div class="arrow"></div>
						<!-- <h3 class="popover-title">Popover bottom</h3> -->
						<div class="popover-content">
							<div class="userimg pull-left">
								<img src="images/user-icon.jpg" />
							</div>
							<div class="userdtl pull-left">
								<h5 style="text-transform: lowercase;">
									<c:out value="<%=agentname%>" />
								</h5>
								<span><c:out value="${loginid}"></c:out></span>
							</div>
						</div>
						<div class="clearfix"></div>
						<div class="sign_foot">
							<a class="btn btn-default pull-right"
								onclick="deleteCookie('<c:out value="<%=agentname%>"/>')">Sign
								Out</a>
						</div>
					</div>
				</li>
				<!-- <li id="fetchedaccount"></li> -->
				<li class="pull-right"><a href="#fetchdtl" id="fetchtab">Fetch&nbsp&nbsp&nbsp|</a>
					<div class="popover bottom" id="fetchdtl">
						<div class="arrow"></div>
						<div class="popover-content">
							<input id="accNo" type="text" placeholder="" class="fch_input"
								onkeydown="Javascript: if(event.keyCode==13) $('#fetch').trigger('click');" />
							<a id="fetch" class="btn btn-success btn-fch">Fetch</a>
						</div>
					</div></li>

			</ul>
			<div class="navbar-collapse collapse">
				<ul class="nav navbar-nav">
					<li><a id="manage" href="/adminqueuegae"
						>Manage Queue</a></li>
					<li><a id="tools" href="/emaillistener">Tools</a></li>
					<li><a href="/adminqueuegae?internalacc=true&fetch=false" id="internal" class="internal" >Internal Accounts</a></li>
					<!-- <li class= "active"><a href="/emaillistener">Email Listener</a></li>
					<li><a href="/routingTable">Available Agents</a></li> -->
					<li><a href="/toolsmanager">Account Manager</a></li>
					<li><a href="/reports">Reports</a></li>
					<!-- <li><a href="/statisticController">Stats</a></li> -->
					<!-- <li><a href="#">report</a></li> -->
				</ul>
				<!--nav nav-pills-->
			</div>
		</div>
	</nav>
  			<div class="tabs tab_hold">
      				<ul class="nav nav-pills pull-left" >
      					<li id="allListenersClick" class="task">
                  <div class="over">
                      <b class="tas allListeners">0</b>
                  <span class="tas" >All Listeners</span>
                  </div>
                            <div class="out">
                  <b class="tas allListeners">0</b>
                            <span class="tas">All Listeners</span>
                  </div>
                        </li>
                        <li class="completed active" id="activeListenersClick">
                  <div class="over">
                            <b class="que activeListeners">0</b>
                            <span class="que">Active</span>
                  </div>
                  <div class="out">
                  <b class="que activeListeners">0</b>
                  <span class="que">Active</span>
                  </div>
                        </li>
                        <li class="stuck" id="inactiveListenersClick">
                  <div class="over">
                    <b class="req inactiveListeners">0</b>
                    <span class="req">Inactive</span>
                  </div>
                            <div class="out">
                    <b class="req inactiveListeners">0</b>
                                <span class="req">Inactive</span>
                </div>
                        </li>
      				</ul>
      				<div class="form-group pull-right">
                <div class="search-con">
                    <i class="fa fa-search"></i>
      					   <input id="search_box" type="text" class="form-control" placeholder="Search by emailId clientId listenerId..." onkeyup='search_filter(this,"table_data")'>
                </div>
      				</div>
        </div><!--tabs-->


               <div class="account-details">

         <table class="table table-hover">
            <thead>
              <tr>
                <th id ="acc_wd" style="width:10%;">Listener ID    </th>
                <th id ="aglogin_wd" style="width:9%;">Client ID   </th>
                <th id ="dateadd_wd" style="width:17%;">Email Address    </th>
                <th id ="anstime_wd" style="width:10%;">Polling Rate   </th>
                <th id ="timespt_wd" style="width:8%;">Start    </th>
                <th id ="timespt_wd" style="width:7%;">Stop    </th>
                <th id ="status_wd" style="width:10%;">Status 	   </th>
                <!-- <th id ="timespt_wd" style="width:10%;">Label    </th> -->
              </tr>
            </thead>
          </table> 

            <div class="table_scroll">

            <table class="table table-hover tablesorter" id = "detail_table">  
<!-- 
            <thead style="display:none;" >

              <tr>

             

                <th class="acc_wd"     id ="acc_org">Account ID</th>

                <th class="aglogin_wd" id ="aglogin_org">Agent Login</th>

                <th class="status_wd"  id ="status_org">Status</th>

                <th class="dateadd_wd" id ="dateadd_org">Added Date</th>

                <th class="datecom_wd" id ="datecom_org">Completed Date </th>

                <th class="anstime_wd" id ="anstime_org">Answer Time</th>

                <th class="timespt_wd" id ="timespt_org">Time Spent</th>

              </tr>

            </thead> -->

            <tbody id="table_data">

            </tbody>

         <!--  </div> -->

          </table>

        </div><!--account-details-->

      </div><!--wrapper-->


       
      
</div>

			
			
	<script type="text/javascript" src="js/jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="/js/spin.js"></script>
    <script type="text/javascript" src="js/action_new.js"></script>
    <script type="text/javascript" src="js/bootstrap.js"></script>
	<script type="text/javascript" src="/js/loading.js"></script> 
    <script type="text/javascript" src="/js/layout.js"></script> 
    <script type="text/javascript" src="/js/emailListener.js"></script>
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
