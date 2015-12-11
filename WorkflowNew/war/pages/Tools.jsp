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
    <title>Tools</title>
    	<style>
  			.stat_td
  			{
  				font-size: 15px;
  				font-weight: 600;
  				width : 20%;
  			}
  			.account-details .table tr td
  			{
				border-bottom: 1px solid #e4e4e4;
				position: relative;
			}
		</style>
		
      
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      
      <link rel="stylesheet" type="text/css" href="/css/bootstrap.css" media="screen">
      <link rel="stylesheet" type="text/css" href="../css/bootstrap-timepicker.css">
      <link rel="stylesheet" type="text/css" href="/css/style4accountmanger.css">
	  <link rel="stylesheet" type="text/css" href="css/style_new2.css">
      <link rel="stylesheet" type="text/css" href="/css/tools.css">
      <link rel="stylesheet" type="text/css" href="/css/font-awesome.css">
      <link rel="stylesheet" type="text/css" href="/css/font-awesome4.css">
      <link rel="stylesheet" href="/css/theme.default.css">
      <link rel="stylesheet" href="/css/datepicker.css" type="text/css" />
      
      
      
      <script type="text/javascript">
 			var googleLogin = '<%=session.getAttribute("googleLogin")%>';
 			var photoURL	= '<%=session.getAttribute("photoURL")%>';
     		var currentUser = '<%=agentname%>';
 				if(photoURL == null || photoURL == "null")
 					photoURL = "images/user-icon.jpg";
 			var mode	  = '<c:out value="${mode}"/>'
 			console.log(mode);
 			if(mode.indexOf('LIVE') != -1)
 				{
 					mode	=	"LIVE";
 				}
 			else
 				{
 					mode	=	"STAGING";
 				}
	  </script>
	  
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
		<script type="text/javascript">
			var googleLogin = '<%=session.getAttribute("googleLogin")%>';
			var photoURL	= '<%=session.getAttribute("photoURL")%>';
			if(photoURL == null || photoURL == "null")
				photoURL = "images/user-icon.jpg"; 
		</script>
		
		<style type="text/css">
			input
			{
				line-height: 30px;
				font-size: 14px;
				
			}
			
			
		</style>
    	
      	<script type="text/javascript" src="/js/jquery-1.10.2.min.js"></script>
		<script type="text/javascript" src="/js/billingjs.js"></script>
	</head>
<body>
		<!--  Header starts here -->
		
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
							<div class="popover bottom " id="log_dtl">
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
						
					</ul>
					<div class="navbar-collapse collapse">
						<ul class="nav navbar-nav">
							<li><a id="manage" href="/adminqueuegae">Manage Queue</a></li>
							<li  class= "active"><a id="tools" href="/emaillistener">Tools</a></li>
							<li><a href="/adminqueuegae?internalacc=true&fetch=false" id="internal" class="internal" >Internal Accounts</a></li>
							<!-- <li><a href="/emaillistener">Email Listener</a></li>
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
			
 		<!-- Header ends here -->

             
		<!--     for getting the last element in url -->
		<%-- 	<%		
			
				String modifiedPath1 = request.getAttribute("javax.servlet.forward.request_uri").toString(); //services/order_taking
				int lastIndex = modifiedPath1.lastIndexOf("/");
				modifiedPath1 = modifiedPath1.substring(lastIndex,modifiedPath1.length());
				modifiedPath1=modifiedPath1.replaceAll("/","");
				System.out.println("the modified path" +modifiedPath1);
				
			%> --%>
			
		<!-- If url ends with emaillistener -->
			<%-- <%
				if(modifiedPath1.equalsIgnoreCase("emaillistener"))
				{
			%> --%>
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
		    <script type="text/javascript" src="/js/emailListener.js"></script>

			<div class="wrapper" id = "CreateNewAgent">
				 <section>
					  <aside>
			                <h3><center>Tools</center></h3>
			                    <div style="cursor:pointer;" class="search-holder" id="emaillistener" onclick="adminpanel.hide_show(this)"><p class="list" name="Add a new skill"><b><font color="black">Email Listener </font></b></p></div>
			                    <div style="cursor:pointer;" class="search-holder" id="availableagents" onclick="adminpanel.hide_show(this)"><p class="list" name="asfa"><font color="black">Available Agents</font></p></div>
			                    <div style="cursor:pointer;" class="search-holder" id="statistics" onclick="adminpanel.hide_show(this)"><p class="list" name="Add new functionality"><font color="black">Stats </font></p></div>
			                    <div style="cursor:pointer;" class="search-holder" id="Billing" onclick="adminpanel.hide_show(this)"><p class="list" name="Billing"><font color="black">Billing </font></p></div>
			                    <div style="cursor:pointer;" class="search-holder" id="AgentSkill" onclick="adminpanel.hide_show(this)"><p class="list" name="AgentSkill"><font color="black">Add Skill To Agent </font></p></div>
			          </aside> 
					  <articlenew class="distributednew" id="listened" style="overflow:hidden">
					  <div class="tabs tab_hold">
		      				<ul class="nav nav-pills pull-left"  >
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
		      					   		<input id="search_box" type="text" class="form-control" placeholder="Search by emailId clientId..." onkeyup='search_filter(this,"table_data")'>
		               			 </div>
		      				</div>
			           </div><!--tabs tabs-hold ends here-->
				<div class="account-details">
						
						         <table class="table table-hover">
						            <thead>
						              <tr>
						                <!-- <th id ="acc_wd" style="width:10%;">Listener ID    </th> -->
						                <th id ="aglogin_wd" style="width:9%;">Client ID   </th>
						                <th id ="dateadd_wd" style="width:27%;">Email Address    </th>
						                <!-- <th id ="anstime_wd" style="width:10%;">Polling Rate   </th> -->
						                <th id ="timespt_wd" style="width:8%;">Start   </th>
						                <th id ="timespt_wd" style="width:7%;">Stop    </th>
						                <th id ="status_wd" style="width:10%;">Status 	   </th>
						                <!-- <th id ="timespt_wd" style="width:10%;">Label    </th> -->
						              </tr>
						            </thead>
						          </table> 
						
						            <div class="table_scroll">
						
						            <table class="table table-hover tablesorter" id = "detail_table new">  
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
		         </section>
					 </articlenewnew>
				</div>
		<%-- <%
		}
		else if(modifiedPath1.equalsIgnoreCase("routingTable"))
		{
		%> --%>
		    <script type="text/javascript" src="js/routingTable.js"></script>
		
		<div id="foo" >
			 <section>
				            <aside>
				                <h3><center>Tools</center></h3>
				                  
				                    <div style="cursor:pointer;" class="search-holder" id="emaillistener" onclick="adminpanel.hide_show(this)"><p class="list" name="Add a new skill"><font color="black">Email Listener </font></p></div>
				                  				                  
				                    <div style="cursor:pointer;" class="search-holder" id="availableagents" onclick="adminpanel.hide_show(this)"><p class="list" name="asfa"><b><font color="black">Available Agents</font></b></p></div>
				                 				                  
				                    <div style="cursor:pointer;" class="search-holder" id="statistics" onclick="adminpanel.hide_show(this)"><p class="list" name="Add new functionality"><font color="black">Stats </font></p></div>
				                 
				                    <div style="cursor:pointer;" class="search-holder" id="Billing" onclick="adminpanel.hide_show(this)"><p class="list" name="Billing"><font color="black">Billing </font></p></div>
				                    
				                    <div style="cursor:pointer;" class="search-holder" id="AgentSkill" onclick="adminpanel.hide_show(this)"><p class="list" name="AgentSkill"><font color="black">Add Skill To Agent </font></p></div>
				            </aside> 
			
			 <articlenew class="distributednew" id="listened" style="overflow:hidden">
			 
			
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

					<table class="table table-hover tablesorter" id="detail_table new">
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
				<table class="table table-hover" id = "adminTable">
					
					<tbody id = "adminTablebody">
					
					</tbody>
				</table>
			</div>
			</div>
		</div>
	</div>
	
	<!-- </div>
	</div>
		</div> -->
		</articlenew>
		
			 </section>
			 
		</div>
		
	<%-- <%
	}
	else if(modifiedPath1.equalsIgnoreCase("statisticController"))
	{
	%> --%>
	
	 <script type="text/javascript" src="/js/MessageWindow.js"></script> 
	<script type="text/javascript" src="js/statistic.js"></script>
	<div  class="wrapper" id="newfunctionality">
			 <section>
				            <aside>
				                <h3><center>Tools</center></h3>
				                  
				                    <div style="cursor:pointer;" class="search-holder" id="emaillistener" onclick="adminpanel.hide_show(this)"><p class="list" name="Add a new skill"><font color="black">Email Listener </font></b></p></div>
				                  
				                  
				                    <div style="cursor:pointer;" class="search-holder" id="availableagents" onclick="adminpanel.hide_show(this)"><p class="list" name="asfa"><font color="black">Available Agents</font></div>
				                 
				                  
				                    <div style="cursor:pointer;" class="search-holder" id="statistics" onclick="adminpanel.hide_show(this)"><p class="list" name="Add new functionality"><b><font color="black">Stats </font></b></p></div>
				                 
				                    <div style="cursor:pointer;" class="search-holder" id="Billing" onclick="adminpanel.hide_show(this)"><p class="list" name="Billing"><font color="black">Billing </font></p></div>
				            		
				            		<div style="cursor:pointer;" class="search-holder" id="AgentSkill" onclick="adminpanel.hide_show(this)"><p class="list" name="AgentSkill"><font color="black">Add Skill To Agent </font></p></div>
				            </aside> 
			
			 
			 <articlenew class="distributednew" id="listened" style="overflow:hidden">
			 	<div class="wrapper" id = "foo">							  
  	<div class="page-icon">
  			<div class="order_opt">
              <div class="sort_arrow pull-right">
                  <input type="button" class="global_btn" id='Load_button' style="margin-left: 10px;width:70px;height:24px;line-height:20px;" value="Load"/>
              </div>   
          </div>
 			<div class="order_opt">
              <div class="sort_arrow pull-right">
                   <input type="text" id="inputDate2" name="" value=""	class="date_field" style="line-height:20px;" />
								<p class="hdate"></p>
              </div>   
          </div>
          <div class="order_opt">
              <div class="sort_arrow pull-right">
                  <h4 style="margin: 1px;">&nbsp&nbsp to &nbsp&nbsp</h4>
              </div>   
          </div>
          <div class="order_opt">
              <div class="sort_arrow pull-right">
                   <input type="text" id="inputDate1" name="" value=""  class="date_field" style="line-height:20px;"/>
								<p class="hdate"></p>
              </div>   
          </div>
         </div>
         <div class="account-details">

         <table class="table table-hover">
            <thead>
              <tr>
                <th id="acc_wd" 	style="width:20%;font-weight: bolder;">Date </th>
                <th id="acc_wd" 	style="width:20%;font-weight: bolder;">Status </th>
                <th id="status_wd" 	style="width:20%;font-weight: bolder;">Extrernal AR Stats </th>
                <th id="timespt_wd" style="width:20%;font-weight: bolder;">Internal AR Stats </th>
                <th id="timespt_wd" style="width:20%;font-weight: bolder;">External CHAT Stats </th>
              </tr>
            </thead>
          </table> 

            <div class="table_scroll" style="height: 400px;">

            <table class="table table-hover tablesorter" id="detail_table">  
			
          
            <tbody id="table_data">

            </tbody>

         <!--  </div> -->

          </table>
			
        </div><!--account-details-->
      </div>
  			
      </div><!--wrapper-->
			 </articlenew>
			</section>
	</div>
	<%-- <%
		}
		else if(modifiedPath1.equalsIgnoreCase("billing"))
		{
		%> --%>
		
		<div  class="wrapper" id="bill-wrapper">
			 <section>
				            <aside>
				                <h3><center>Tools</center></h3>
				                  
				                    <div style="cursor:pointer;" class="search-holder" id="emaillistener" onclick="adminpanel.hide_show(this)"><p class="list" name="Add a new skill"><font color="black">Email Listener </font></p></div>
				                  
				                  
				                    <div style="cursor:pointer;" class="search-holder" id="availableagents" onclick="adminpanel.hide_show(this)"><p class="list" name="asfa"><font color="black">Available Agents</font></p></div>
				                 
				                  
				                    <div style="cursor:pointer;" class="search-holder" id="statistics" onclick="adminpanel.hide_show(this)"><p class="list" name="Add new functionality"><font color="black">Stats </font></p></div>
				                 
				                    <div style="cursor:pointer;" class="search-holder" id="Billing" onclick="adminpanel.hide_show(this)"><p class="list" name="Billing"><b><font color="black">Billing </font></b></p></div>
				                    
				                    <div style="cursor:pointer;" class="search-holder" id="AgentSkill" onclick="adminpanel.hide_show(this)"><p class="list" name="AgentSkill"><font color="black">Add Skill To Agent </font></p></div>
				            </aside> 
			
			 
			 <articlenew class="distributednew" id="listened" style="overflow:hidden">
								 
								 <div id="newBill" class="min_screens hideable" style="font-weight: normal; margin-left: 28%">
										<div class="page-icon" style="margin-left: -40%;">
										<h2	style=" padding-top: 1.5%; font-weight: bold; font-size: 16px; position: relative; margin-left: 40%;">Billing Details</h2>
										</div>
										<div style="display: block; min-height: 40px; margin-left: 13%; margin-top: 2%;">
											<span id="notification"	style="display:none; font-size: 16px;display: block">Please	check the data entered</span>
										</div>	
										<table	style="margin-top: 15px; font-size: 14px; list-style: none; line-height: 3.5;">
										
										<tr>
										<td>From Date :</td>
										<td style="padding-left: 15%;"> 
										<input type="text" id="date1" class="frm-input date_field" onkeydown="return datevalidate(event)" placeholder="mm/dd/yyyy" name="AccntNum" ">
										</td></tr>
										
										<tr><td>To Date :</td> 
										<td style="padding-left: 15%;"><input type="text" id="date2" class="frm-input date_field" onkeydown="return datevalidate(event)" placeholder="mm/dd/yyyy" name="AccntNum" >
										</td></tr>
										
										<tr> 
										<td><font>Billing Mode:</font></td>	
										<td style="padding-left: 15%;"><font > JBilling Report </font></td>
										</tr>
										
										<tr><td>Email Address:</td>
										<td style="padding-left: 15%;"><input class="frm-input date_field" type="text" onblur="return IsEmail(event)" id="billingAddress"	placeholder="We will email you the report" >
										</td></tr>
										
										<tr><td>Type:</td>
										<td style="padding-left: 15%;">
										<ul class="radio-btn" >
										<li class="active-radio" id="model-chat-Id"><span><cite></cite></span><b style="margin-top: -20%;"><i class="fa fa-comment"></i>Chat</b></li>
										<li id="model-ar-Id" style="display: inline-block"><span><cite></cite></span><b style="margin-top: -26%"><i class="fa fa-bolt"></i>AR</b></li>
										</ul>
										<!-- <input style="margin-left:17%" type="radio" class="interactiontype" name="interaction" checked="checked" id="SBChat"><span>Chat</span><input style="margin-left:10.3%" type="radio" name="interaction" class="interactiontype" id="AR"><span>AR</span>
										-->	 </td></tr>
										
										<tr><td>Billing Type :</td>
										<td style="padding-left: 15%;">
										<ul class="radio-btn" >
										<li class="active-radio" id="all" onclick="show_hide(this)"><span><cite></cite></span><b style="margin-top: -30%; margin-left: -20%;"><i class="fa"></i>All</b></li>
										<li id="specific" onclick="show_hide(this)"><span><cite></cite></span><b style="margin-top: -11%; margin-left: -7%"><i class="fa"></i>Specific Client Id</b></li>
										</ul>
										</td></tr>
										<!-- <input style="margin-left:10%" type="radio" name="bill" id="all" checked="checked" onclick="show_hide(this)">
										<span>All Client Id</span> <input style="margin-left:3%" type="radio" name="bill" id="specific" onclick="show_hide(this)"><span>Specific Client Id</span></li>
										-->
										<tr id="clientidval" style="display: none;">
										<td>Client ID : </td>
										<td style="padding-left: 15%;"><input type="text" onkeydown="return validate(event)" class="frm-input textValue" id="AccntNum" name="AccntNum" >
										</td></tr>
										
										<tr><td colspan="2"><input type="button" class="btn btn-success" id="sub" value="Submit" onclick="callme()" style="margin-top: 2%; height: 40px; width: 90px;margin-left:38%;"></td></tr>
										</table>
										
										<!-- </div> -->
										</div>
			 
			 </articlenew>
			</section>
		</div>
		
		<%-- <% } %> --%>
   <div class="wrapper" id = "AddSkillToAgent" style="display:none">
				 <section>
					  <aside>
			                <h3><center>Tools</center></h3>
			                    <div style="cursor:pointer;" class="search-holder" id="emaillistener" onclick="adminpanel.hide_show(this)"><p class="list" name="Add a new skill"><font color="black">Email Listener </font></p></div>
			                    <div style="cursor:pointer;" class="search-holder" id="availableagents" onclick="adminpanel.hide_show(this)"><p class="list" name="asfa"><font color="black">Available Agents</font></p></div>
			                    <div style="cursor:pointer;" class="search-holder" id="statistics" onclick="adminpanel.hide_show(this)"><p class="list" name="Add new functionality"><font color="black">Stats </font></p></div>
			                    <div style="cursor:pointer;" class="search-holder" id="Billing" onclick="adminpanel.hide_show(this)"><p class="list" name="Billing"><font color="black">Billing </font></p></div>
			                    <div style="cursor:pointer;" class="search-holder" id="AgentSkill" onclick="adminpanel.hide_show(this)"><p class="list" name="AgentSkill"><b><font color="black">Add Skill To Agent </font></b></p></div>
			          </aside> 
					  <articlenew class="distributednew" id="listened" style="overflow:hidden">
					  
					  		<div id="agentPanel">

                                       		<div class="form-field">
   							 <div class="user-nav">
                                 <div class="tabs tab_hold">

                                   <ul class="nav nav-pills pull-left" >
                                     <li id	="mainSkills" class="group-1 active">
                                         <div class="out">
                                         <b class="skillcount"><i class="fa fa-trash-o"></i>0</b>
                                         <span>Skills</span>
                                         </div>

                                     </li>
                                   </ul>
                                 </div><!--tab-hold-->
                             </div><!--user-nav-->

                     <div class="search-user">
                             <!-- <input id="search_box" type="text"  placeholder="Search To Add Agent" class="srh-user" data-toggle="dropdown"  onkeyup='accountManager.search_filter(this,"SkillTable")'>
                             --> 
                              <input id="search_box" type="text"  placeholder="Search Skill" class="srh-user" data-toggle="dropdown"  onkeyup='accountManager.search_filter(this,"SkillTable","table")'>
                               <button id="add-skillToAgentLogin" class="btn-add" data-toggle="modal" data-target="#add-skillToAgentModal" style="display:none;">+</button>
                               <b><i id="deleteAll" class="fa fa-trash-o"></i></b>
                               <div class="fetch-field">
                               		<input type="text" id="agentLogin" placeholder="Agent Login" class="frm-input">                                         
                                    <button type="button" class="btn btn-success" onclick=getSkillListFromLogin();>Fetch</button>
                                </div>
                             
                             	<div class="modal fade" id="add-skillToAgentModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
   			                <div class="modal-dialog popup">
   			                  <div class="modal-content">
   			                    <div class="modal-header">
   			                      <button id="close-modelAddskill" type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
   			                      <h4 class="modal-title" id="myModalLabel">Add Skill To Agent!</h4>
   			                    </div><!--modal-header-->
   			                    <div class="modal-body">
   			                    <div>
   			                    <table>
                                        <tr class="form-tr">
                                        <td class="form-tdvalue"> <input id="add-skillName" type="text" placeholder="Skill Name" class="frm-input" disabled></td>
                                        <td class="form-tdvalue"> <input id="add-AgentLogin" type="text" placeholder="Agent Login" class="frm-input"></td>
                                        </tr>
                                        <tr class="form-tr">
                                        <td class="form-tdvalue"> <input id="add-AgentskillLevel" type="text" placeholder="Skill Level" class="frm-input"></td>
                                        <td class="form-tdvalue"> <input id="add-Agenturl" type="text" placeholder="Application Url" class="frm-input"></td>
                                        </tr>
                                        
                                    </table>
   			                    </div>
   			                            <div class="modal-footer">
   			                              <button id="save-SkillToAgent" type="button" class="btn btn-success">Save</button>
   			                              <button id="cancel-AgentSkill" type="button" class="btn-close" data-dismiss="modal">Cancel</button>
   			                               <button id="add-skillToAgenthide" type="button" class="btn btn-success" data-dismiss="modal" style="display:None">Save</button>
   			                            </div><!--modal-footer-->
   			                    </div><!--modal-body-->
   			                  </div><!--modal-content-->
   			                </div><!--popup-->  
   			              </div><!--modal-->

                     </div><!--search-user-->

                       <div class="user-mgment" style="min-height: 700px; overflow-y: scroll;">
                             <table class="table table-hover">
                               <thead>
                                 <tr>
                                   <th><div class="checkbox">
                                   <span><cite></cite></span>
                                   </div></th>
                                   <th>Skill Title</th>
                                   <th>Agent Login</th>
                                   <th>Application To Load</th>
                                   <th>Skill Level</th>
                                   <th></th>
                                 </tr>
                               </thead>
                               <tbody id="SkillTable">
                                 
                               </tbody>
                             </table>
                           </div><!--user-mgment-->
                    </div>
					  
					  
					  </articlenewnew>
		         </section>
		         
		         
		         <button class="btn-add" data-toggle="modal" id="modal-confirm-deletion" data-target="#conformModal-delete" style="display:none">+</button>
		     		 <div class="modal fade" id="conformModal-delete" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		                <div class="modal-dialog popup">
		                  <div class="modal-content">
		                    <div class="modal-header">
		                      <button onclick="accountManager.removeIdOfDelete(this)" type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		                      <h4 class="modal-title" id="myModalLabel">Warning!</h4>
		                    </div><!--modal-header-->
		                    <div class="modal-body">
		                    <div>
		                   <h3 id="modal_comform_message" style=" margin-top: 0px;font-size: 24px">Are you sure you want to remove Skill?</h3>
		                    </div>
		                            <div class="modal-footer">
		                              <button type="button" class="btn btn-success model-confirm_delete" onclick="updateSkillSet(this)" data-dismiss="modal">Delete</button>
		                              <button type="button" class="btn-close" data-dismiss="modal"  onclick="accountManager.removeIdOfDelete(this)" >Cancel</button>
		                            </div><!--modal-footer-->
		                    </div><!--modal-body-->
		                  </div><!--modal-content-->
		                </div><!--popup-->  
		              </div><!--modal-->   
				</div>
     
    <script type="text/javascript" src="/js/jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="/js/action2.js"></script>
    <script type="text/javascript" src="/js/spin.js"></script>
    <script type="text/javascript" src="js/action_new.js"></script>
    <script type="text/javascript" src="/js/MessageWindow.js"></script> 
    <script type="text/javascript" src="/js/bootstrap.js"></script>
    <script type="text/javascript" src="/js/jquery.tablesorter.js"></script>
   <!--  <script type="text/javascript" src="js/action.js"></script> -->
    <script type="text/javascript" src="/js/action4accountmanager.js"></script>
    <script type="text/javascript" src="/js/loading.js"></script> 
    <script type="text/javascript" src="/js/layout.js"></script> 
	<script type="text/javascript" src="/js/tools.js"></script>
  
    
    <script type="text/javascript" src="/js/bootstrap-datepicker.js"></script>
 	<script type="text/javascript" src="../js/bootstrap-timepicker.js"></script>
    
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
