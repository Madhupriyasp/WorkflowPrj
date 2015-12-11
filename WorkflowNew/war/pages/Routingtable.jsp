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
	<script type="text/javascript">
	var activeTab  =	null;
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
				 ( this.targetWindow == null ) ? this.targetWindow = document.getElementById('irframe').contentWindow : console.info('');
				 if( this.targetWindow != null ) this.targetWindow.postMessage( JSON.stringify( data ) , '*' );
			},
			
			_receiveMessage	:	function( message )
			{
				console.info("inside the receive message function (cc):: ",message);
			},
			
			init			:	function( login , name )
			{
				this.dataToPost			=	new Object();
				this.dataToPost.action	=	'init';
				this.dataToPost.login	=	login;
				this.dataToPost.name	=	name;
				this.dataToPost.channel	=	["/workflow/routing", "/workflow/monitoring"];
				this.postMessage(this.dataToPost);
			}
		}
		
		if( !window.$ir ){window.$ir=independentRouting;}
		( window.addEventListener ) ? addEventListener( 'message' , $ir._receiveMessage , false ) : attachEvent( 'onmessage' , $ir._receiveMessage );	//Attaching post message listener
	})();
	var webchatUrl = "<%=sWebChatUrl%>";
	window.onload	=	function()
	{
		var _irFrame	=	document.createElement('iframe');
		_irFrame.setAttribute( 'id' , 'irframe' );
		_irFrame.setAttribute( 'src' , webchatUrl+'/pages/SBIntegrated/workflowRouting.html?'+new Date().getTime());
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
	    console.info("data showing from parent ::"+event.data);
	    var json		=	JSON.parse(event.data);
		if(json.channel == "/workflow/routing")
		{
			var data = json.data;
			updateRoutingTable(data)
		}
		else 
		if(json.channel == "/workflow/monitoring")
		{
			var data = json.data;
			updateAdminTable(data)
		}			
	}
	
	function onIFrameLoad()
	{
		console.info('Lets start testing, Shall we?');
		$ir.init("workflowtest","workflowtest");
	}
	
	</script>
     </head>
     
 	 <body>
 	 <div id="foo">
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
				<li class="pull-right">
      <a href="#fetchdtl" >Fetch&nbsp&nbsp&nbsp|</a>
             <div class="popover bottom" id="fetchdtl">
              <div class="arrow"></div>
              <div class="popover-content">
                <input id="fetchinbox" type="text" placeholder="" class="fch_input" onkeydown="Javascript: if(event.keyCode==13) $('#fetchme').trigger('click');"/>
                <a id ="fetchme" class="btn btn-success btn-fch">Fetch</a>
         
              </div>
            </div></li>

			</ul>
			<div class="navbar-collapse collapse">
				<ul class="nav navbar-nav">
				<li><a id="manage" href="/adminqueuegae">Manage Queue</a></li>
				<li><a id="tools" href="/emaillistener">Tools</a></li>
				<li><a href="/adminqueuegae?internalacc=true&fetch=false"
					id="internal" class="internal">Internal Accounts</a></li>
				<li><a href="/emaillistener">Email Listener</a></li>
				<li class= "active"><a href="/routingTable">Available
						Agents</a></li>
				<li><a href="/toolsmanager">Account Manager</a></li>
				<li><a href="/reports">Reports</a></li>
				<li><a href="/statisticController">Stats</a></li>
				<!-- <li><a href="#">report</a></li> -->
			</ul>
				<!--nav nav-pills-->
			</div>
		</div>
	</nav>

  			

  			
      				<!-- <ul class="nav nav-pills pull-left" >
      					<li class="task active">
                  <div class="over">
                      <b id="allTaskCounter1" class="tas">0</b>
                  <span class="tas" >All Task</span>
                  </div>
                            <div class="out">
                  <b id="allTaskCounter2" class="tas">0</b>
                            <span class="tas">All Task</span>
                  </div>
                        </li>
                        <li class="queue " >
                  <div class="over">
                            <b id="inqueueCounter1" class="que">0</b>
                            <span class="que">in queue</span>
                  </div>
                  <div class="out">
                  <b id="inqueueCounter2" class="que">0</b>
                  <span class="que">in queue</span>
                  </div>
                        </li>
                        <li class="requed">
                  <div class="over">
                    <b  id="answeredCounter1" class="req">0</b>
                    <span class="req">answered</span>
                  </div>
                            <div class="out">
                    <b id="answeredCounter2" class="req">0</b>
                                <span class="req">answered</span>
                </div>
                        </li>
                        <li class="progess">
                  <div class="over">
                  <b id="progresscounter1" class="act">0</b>
                  <span class="act">in progress</span>
                  </div>
                            <div class="out">
                  <b id="progresscounter2" class="act">0</b>
                            <span class="act">in progress</span>
                  </div>
                        </li>
                        <li class="scheduled">
                            <div class="over">
                  <b id="scheduledcounter1" class="sche">0</b>
                            <span class="sche">scheduled</span>
                  </div>
                  <div class="out">
                  <b id="scheduledcounter2" class="sche">0</b>
                  <span class="sche">scheduled</span>
                  </div>
                        </li>
                        <li class="stuck">
                  <div class="over">
                            <b id="stuckcounter1" class="stu">0</b>
                            <span class="stu">stuck</span>
                  </div>
                  <div class="out">
                  <b id="stuckcounter2" class="stu">0</b>
                  <span class="stu">stuck</span>
                  </div>
                        </li>
                
                        <li class="completed">
                            <div class="over">
                  <b id="completedcounter1" class="comp">0</b>
                            <span class="comp">completed</span>
                  </div>
                  <div class="out">
                  <b id="completedcounter2" class="comp">0</b>
                  <span class="comp">completed</span>
                  </div>
      					</li>
      				</ul> -->



		<ul class="nav nav-tabs" role="tablist" id="myTab">
			<li role="presentation" class="active" id = "tab1"><a href="#routing"
				aria-controls="routingtable" role="tab" data-toggle="tab">Routing Table</a></li>
			<li role="presentation" id = "tab2"><a href="#admin"
				aria-controls="admintable" role="tab" data-toggle="tab">Admin Table</a></li>
		</ul>
		
			<div class="tab-content">
			<div role="tabpanel" class="tab-pane active" id="routing">
			<div class="tabs tab_hold">
				<div class="pg_opt" style="margin-top: 10px; margin-left: 10px;">
					<a onclick="callmetable()"><i id="reschedule"
						class="fa fa-retweet icon-2x" data-container="body"
						data-toggle="popover" data-placement="right"
						data-original-title="" title="" style="cursor: pointer"></i></a>
				</div>
				<div class="form-group pull-right">
					<div class="search-con">
						<i class="fa fa-search"></i> <input id="search_box" type="text"
							class="form-control"
							placeholder="Search by name, skill,skill level"
							onkeyup='search_filter(this,"sampleTable")'>
					</div>
				</div>
				<!--form-group-->
			</div>
			<!--tabs-->
			<div class="account-details">
				<table class="table table-hover" style="width: 100%;">
					<thead>

						<tr>

							<th class="acc_wd" id="tblheading1" style="cursor: pointer">Skill</th>
							<th class="domain_wd" id="tblheading2" style="cursor: pointer">Agent
								Login</th>
							<th id="tblheading3" style="cursor: pointer">Skill Level</th>
							<th id="tblheading4" style="cursor: pointer">Alias Name</th>
							<th class="dateadd_wd" id="tblheading5" style="cursor: pointer">Status</th>
						</tr>

					</thead>
				</table>
				<div class="table_scroll" id="agenttable">
					<table class="table table-hover" id="sampleTable">

						<!-- <tr>
				<td><strong>skill</strong></td>
				<td><table class="routingtable  ">
						<tr>
						<td Style ="padding-bottom: 18px;border-bottom: 0;position: relative;">agent name</td>
						<td Style ="padding-bottom: 18px;border-bottom: 0;position: relative;">skill Level</td>
						<td Style ="padding-bottom: 18px;border-bottom: 0;position: relative;">Alias Name</td>
						<td Style ="padding-bottom: 18px;border-bottom: 0;position: relative;">Status</td>
						</tr>
					</table></td>
		</tr>  -->
					</table>



					<!--    <div class="table_scroll"> -->

					<table class="table table-hover tablesorter" id="detail_table">
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

				</div>
				<!--account-details-->

			</div>
			<!--wrapper-->





		</div>

		<div role="tabpanel" class="tab-pane" id="admin">
			<div class="tabs tab_hold">
				<div class="pg_opt" style="margin-top: 10px; margin-left: 10px;">
					<a onclick="getAdminTable()"><i id="admindatarefresh"
						class="fa fa-retweet icon-2x" data-container="body"
						data-toggle="popover" data-placement="right"
						data-original-title="" title="" style="cursor: pointer"></i></a>
				</div>
				<div class="form-group pull-right">
					<div class="search-con">
						<i class="fa fa-search"></i> <input id="search_box1" type="text"
							class="form-control"
							placeholder="Search by name, skill,skill level"
							onkeyup='search_filter(this,"adminTablebody")'>
					</div>
				</div>
			</div>
			<div class="account-details">
				<table class="table table-hover" style="width: 100%;">
					<thead>


						<tr>

							<th class="acc_wd" id="tblheading6" style="cursor: pointer">Skill</th>
							<th class="domain_wd" id="tblheading7" style="cursor: pointer">Agent
								Name </th>
							<th id="tblheading8" style="cursor: pointer">Client ID</th>
						</tr>

				

					</thead>
				</table>
			<div class="table_scroll" id="adminTabledata">
				<table class="table table-hover" id - "adminTable">
					
					<tbody id = "adminTablebody">
					
					</tbody>
				</table>
			</div>
			</div>
		</div>
	</div>
</div>
	<script type="text/javascript" src="js/jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="/js/spin.js"></script>
    <script type="text/javascript" src="js/action_new.js"></script>
    <script type="text/javascript" src="js/bootstrap.js"></script>
     <script type="text/javascript" src="js/routingTable.js"></script>
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
</script>
<!-- End LoopTodo Feedback Form Code -->
    </body>
  </html>
