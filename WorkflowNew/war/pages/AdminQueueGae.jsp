<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
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
	var loginmap	= '<%=session.getAttribute("loginmap")%>';
	var accMap = '<%=accmap%>';
	var currentUser	=	'<%=agentname%>';	
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
	
	internal_flag = '<c:out value="${internal_flag}"/>'
	fetch_flag	  = '<c:out value="${fetch_flag}"/>'
	fatch_acc	  = '<c:out value="${fetch_accno}"/>'
	alertFromDate = '<c:out value="${fromdate}"/>'
	alertToDate	  = '<c:out value="${todate}"/>'

		if(internal_flag == null || internal_flag == '')
			internal_flag = "false";
		if(fetch_flag  ==null || fetch_flag  =='' )
			fetch_flag = "false";
		if(fatch_acc ==null || fatch_acc ==null)
			fatch_acc = "";
	
//	alert("internal flag:::"+internal_flag+"fetch flag:::"+fetch_flag+"fetch_accno"+fatch_acc);
	</script>
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
					 ( this.targetWindow == null ) ? this.targetWindow = document.getElementById('irframe').contentWindow : console.info('');
					 if( this.targetWindow != null ) this.targetWindow.postMessage( JSON.stringify( data ) , '*' );
				},
				
				_receiveMessage	:	function( message )
				{
					console.info("inside the receive message function (cc):: "+message);
				},
				
				init			:	function( login , name )
				{
					this.dataToPost			=	new Object();
					this.dataToPost.action	=	'init';
					this.dataToPost.login	=	login;
					this.dataToPost.name	=	name;
					this.dataToPost.channel	=	["/workflow/client"];
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
	//		console.info( event );
	//	    console.info("data showing from parent ::"+event.data);
		    dd.onMessageAction(event.data);
		}
		
		function onIFrameLoad()
		{
			console.info('Lets start testing, Shall we?');
			$ir.init("workflowtest","workflowtest");
		}
		
		
</script>
</head>
     
<body>

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
							<input id="accNo" type="text" placeholder="Enter 8xx / 1xx / Skill" class="fch_input"
								onkeydown="Javascript: if(event.keyCode==13) $('#fetch').trigger('click');" />
							<a id="fetch" class="btn btn-success btn-fch">Fetch</a>
						</div>
					</div></li>

			</ul>
			<div class="navbar-collapse collapse">
				<ul class="nav navbar-nav">
					<li id="manageli"><a id="manage" href="/adminqueuegae">Manage Queue</a></li>
					<li><a id="tools" href="/emaillistener">Tools</a></li>
					<li id="internalli"><a href="javascript:void();" id="internalAction" style="cursor: pointer;">Internal Accounts</a></li>
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
	<!--header-->
	<div class="wrapper" id = "foo">  	
  			<div class="tabs tab_hold">
      				<ul class="nav nav-pills pull-left" >
      					<li class="task active">
                  <div class="over">
                      <b id="allTaskCounter1" class="tas">0</b>
                  <span class="tas inter_type" >All</span>
                  </div>
                            <div class="out">
                  <b id="allTaskCounter2" class="tas">0</b>
                            <span class="tas inter_type">All</span>
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
                 <li class="pending">
                     <div class="over">
           			<b id="pendingcounter1" class="sche">0</b>
                     <span class="sche">Pending</span>
                  </div>
                  <div class="out">
                  <b id="pendingcounter2" class="sche">0</b>
                  <span class="sche">Pending</span>
                  </div>
                        </li>
                        <li class="stuck">
                  <div class="over">
                            <b id="stuckcounter1" class="stu">0</b>
                            <span class="stu">Misc.</span>
                  </div>
                  <div class="out">
                  <b id="stuckcounter2" class="stu">0</b>
                  <span class="stu">Misc.</span>
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
      				</ul>
      				<div class="form-group pull-right">
                <div class="search-con">
                    <i class="fa fa-search"></i>
      					   <input id="search_box" type="text" class="form-control" placeholder="Search by name, ID, date">
                </div>
      				</div><!--form-group-->
        </div><!--tabs-->

        <div class="page-icon">
          <div class="">
            <div class="check_opt dropdown">
                <input type="checkbox" id='checkbox_select_all'>
                <span class="check_drop" data-toggle="dropdown"><i class="fa fa-caret-down"></i></span>
                <ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">
                		<li><a id="select_all" style="display:none;">All</a></li>
						<li><a id="select_all_SBChat">Chat</a></li>
						<li><a id="select_all_AR">AR</a></li>
					</ul>
            </div>
           
            <div class="pg_opt">
                 <a><i id="reschedule" class="fa fa-retweet icon-2x" data-container="body" data-toggle="popover" data-placement="bottom" data-original-title="" title="Reschedule" style="cursor:pointer"></i></a>
                 <a id="delselected"><i id="delete" class="fa fa-trash-o icon-2x" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus." data-original-title="" title="Delete" style="cursor:pointer"></i></a>
                 <a id="markselected"><i id="delete" class="fa fa-check icon-2x" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus." data-original-title="" title="Mark Complete" style="cursor:pointer"></i></a>
                 <a><i id="markType" class="fa fa-tag icon-2x" data-container="body" data-toggle="popover" data-placement="bottom" data-original-title="" title="Migrate Accounts" style="cursor:pointer"></i></a> 
                 <a><i id="trigger_ar" class="fa fa-flash icon-2x" data-container="body" data-toggle="popover" data-placement="bottom" data-original-title="" title="Trigger AR" style="cursor:pointer"></i></a>
                 <a><i class="fa fa-download" id="downloadCsv" title="Download CSV" data-placement="bottom" data-container="body" data-toggle="popover" style="cursor:pointer"></i></a>	
                 <a id="markqueue"><i id="delete" class="fa fa-wrench icon-2x" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus." data-original-title="" title="Mark InQueue(IR)" style="cursor:pointer"></i></a>
                 <a><i class="fa fa-upload" id="save_csv" title="Upload CSV" data-placement="bottom" data-container="body" data-toggle="popover" style="cursor:pointer"></i><input id="choose-file" type="file" name="myFile" style="display:none;"></a>	
           		<a><i class="fa fa-arrow-circle-down" id="downloadCsvChat" title="Download Chat CSV" data-placement="bottom" data-container="body" data-toggle="popover" style="cursor:pointer"></i></a>
            </div>
          </div>
          <form action = "/getChatTranscriptsCSV" method="POST" id="chatCSVForm">
          	<input type="hidden" name="jsonData" id= "jsonTobeSent">
          </form>
    	 <form action="/getCSVOfCurrentData" method="POST" id="csvFileToDownload"><input type="hidden" id="dataToBeSent" name="dataToBeSent"></form>
         <!--  <div class="order_opt">
              <div class="sort_arrow pull-right">
                <a href="" ><i class="fa fa-chevron-left"></i></a>
                <a href="" onclick="incrementor()"><i class="fa fa-chevron-right"></i></a>         
              </div>
            <div class="sort_no pull-right">
                <span>1 - 20 </span> of <span> 20 </span>
              </div>
                
          </div> -->
            <div class="order_opt">
              <div class="sort_arrow pull-right">
                  <input type="button" class="global_btn" id='Load_button' style="margin-left: 10px;" value="Load"/>
              </div>   
          </div>
          <div class="order_opt">
              <div class="sort_arrow pull-right">
                   <input type="text" id="inputDate2" name="" value=""	class="date_field" />
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
                   <input type="text" id="inputDate1" name="" value=""  class="date_field" />
								<p class="hdate"></p>
              </div>   
          </div>
          <div class="order_opt">
              <div class="sort_arrow pull-right">
                  <p  class ="searchupdate" id="searchid" style="margin-top: 0px;"></p>
              </div>   
          </div>
           
        </div><!--page-icon-->

                              <div class="account-details">

         <table class="table table-hover">

            <thead>

              <tr>

               
				<th><input class="chkbox1" type="checkbox" style="display:none"></th>
				<th><input class="chTy" style="display: none;"></th>
				<th><input class="acc_wd multi_conID" style="display: none;"></th>
                <th class="acc_wd1"     id ="acc_wd" style="cursor: pointer; padding-left: 1.5%;">Account ID</th>
                <th class="domain_wd1"  id ="domain_wd" style="cursor: pointer;padding-left: 2%;">Account Name</th>
                <th class="aglogin_wd1" id ="aglogin_wd" style="cursor: pointer; padding-left: 3%;" >Recieved By</th>
                <th class="status_wd1"  id ="status_wd"  style="cursor: pointer; padding-left: 1.5%;">Status</th>
                <th class="dateadd_wd1" id ="dateadd_wd" style="cursor: pointer; padding-left: 1.5%;">Received&nbsp<span class="timezone"></span> </th>
                <th class="datecom_wd1" id ="datecom_wd" style="cursor: pointer; padding-left: 1%;">Completed&nbsp<span class="timezone"></span></th>
           		<th class="anstime_wd1" id ="anstime_wd" style="cursor: pointer; padding-left: 1.5%;"><span id="tta" data-toggle="tooltip" title="" data-placement="top" data-original-title="Time To Answer">TTA</span></th>
                <th class="timespt_wd1" id ="timespt_wd" style="cursor: pointer; padding-right: 2%;">Duration</th>
                <th class="compTime_wd1" id="compTime_wd" style="cursor: pointer; padding-right: 1.5%;"><span id="ttc" data-toggle="tooltip" title="" data-placement="top" data-original-title="Time Taken to Complete">TTC</span></th>
              </tr>

            </thead>

          </table> 



                        <div class="table_scroll" id ="tableScrollerdiv">

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


       
      
        <div class="modal fade in" id="detail_listing" tabindex="-1">
  <div class="modal-dialog" style="width: 965px; z-index:900;">
    <div class="modal-content">
      <div class="modal-header">
        <button id =  "closemodel"type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title">Interaction Details</h4>
      </div>
      <div class="modal-body">
        
              <div class="page-icon">
          <div class="">
            
            <div class="pg_opt">
                <a><i id="reschedule_modal" class="fa fa-retweet" data-toggle="tooltip" title="Reschedule"></i></a>
                <a onclick="deletefromModal(document.getElementById('fieldinteractionId').value)"><i class="fa fa-trash-o" data-toggle="tooltip" title="Delete"></i></a>
                <a onclick="completefromModal(document.getElementById('fieldinteractionId').value)"><i class="fa fa-check" data-toggle="tooltip" title="Mark Completed"></i></a>
                <a onclick="markInQueueFromModal(document.getElementById('fieldinteractionId').value)"><i class="fa fa-wrench" data-toggle="tooltip" title="Mark InQueue(IR)"></i></a>
                <a class = "checkinqueue" onclick="checkInteractionInCache(document.getElementById('fieldinteractionId').value)"><i class="fa fa-cog" data-toggle="tooltip" title="Check in Cache"></i></a>
			</div>
          </div>

          <div class="order_opt">
              <div class="sort_arrow pull-right">
                <a style="cursor:pointer" onclick="decrementer()"><i class="fa fa-chevron-left"></i></a>
                <a style="cursor:pointer" onclick="incrementer()"><i class="fa fa-chevron-right"></i></a>         
              </div>
            <div class="pgshow_opt pull-right">
               <a href="#status_dtl" class="active"><i class="fa fa-envelope" data-toggle="tooltip" title="" data-original-title="Mail View"></i></a>
                <a href="#status" class="active"><i class="fa fa-table" data-toggle="tooltip" title="Table View"></i></a>
            </div>
                
          </div>
        </div><!--page-icon-->
        <div class="clearfix"></div>

          <div class="accounts">
            <table class="table pull-left">
              <tr>
                <td class="title">Account ID:</td>
                <td class="text" id="accountId">1666792424</td>
              </tr>
              <tr>
                <td class="title">Recieved By:</td>
                <td class="text" id="accountLogin">suzanne.glossop@a-cti.com</td>
              </tr>
              <tr>
                <td class="title">Status:</td>
                <td class="text" id="statusId">Completed</td>
              </tr>
      		  <tr>
                <td class="title">Scheduled Time:</td>
                <td class="text" id="scheduleTime">NA</td>
              </tr>
            </table>
            <div class="details">
                <table class="table pull-left">
                  <tr>
                    <td class="title">Recieved:</td>
                    <td class="text" id = "dateAdded">Nov 25 2013 </td>
                  </tr>
                  <tr>
                    <td class="title">Completed:</td>
                    <td class="text" id = "DateCompleted">Nov 25 2013 </td>
                    <td  style="display:none" class="text" id = "decrem_increm">ronak</td>
                  </tr>
                  <tr>
                   <td class="title" id = "answerTime"><span id="ttapop" data-toggle="tooltip" title="" data-placement="top" data-original-title="Time To Answer">TTA:</span></td>
                    <td class="text"  id = "ansTime">01:42:05</td>
                  </tr>
                  <tr>
                    <td class="title">Duration</td>
                    <td class="text" id = "timeSpent">00:14:30</td>
                  </tr>
                </table>
            </div>
          </div>
          <div class="status" id="status">
             <table class="table table-hover tablesorter" id="myTable">
                <thead>
                  <tr>
                    <th class="dt_wd">Date & Time&nbsp<span style="color: #9d9d9d" class="timezone"></span></th>
                    <th class="conid_wd">Connection ID</th>
                    <th class="sat_wd">Status</th>
                    <th class="agentlog_wd">Recieved By</th>
                   <!--  <th class="due_wd">Duration</th> -->
                  </tr>
                </thead>
              </table>
              <div class="dtl_scroll">
              <table class="table table-hover" id="myTable2">
                <tbody id = "IntractionHistoryTable">
                   <!--  <tr >
                    <td class="dt_wd">Dates and TIme</td>
                    <td class="conid_wd">Connection ID</td>
                    <td class="sat_wd">Status</td>
                    <td class="agentlog_wd">Agent Login</td>
                    <td class="due_wd">Duration</td>
                  </tr>
                  <tr>
                    <td>Dates and TIme</td>
                    <td>Connection ID</td>
                    <td>Status</td>
                    <td>Agent Login</td>
                    <td>Duration</td>
                  </tr> -->
                </tbody>
             </table>
           </div>
           </div>
           <div class="status_dtl" id="status_dtl" style="display:none;">
           	<!-- 	<div id="mailview"></div> -->
             <!--  <table width="600" style="margin-top:11px;" cellpadding="0" cellspacing="0" border="0" id="messagebody"> -->
                  <!-- <tr>
                    <td width="73" style="font-size:13px; color:#b9b9b9; font-weight:bold; padding-left:18px; padding-top: 14px; ">9:15 PM</td>
                    <td width="515"><p style="font-size:14px; padding: 14px 0px 0px; margin: 0px;"><strong>Jenny P.Answered</strong></p></td>
                  </tr>
                  <tr>
                    <td>&nbsp;</td>
                    <td><p style="font-size:14px;  padding: 14px 0px 0px; margin: 0px;"><strong>Call Type:</strong> Sales Call</p></td>
                  </tr>
                  <tr>
                    <td>&nbsp;</td>
                    <td><p style="font-size:14px; line-height:20px;  padding: 14px 0px 0px; margin: 0px;"><strong>Message : </strong> There isn't currently a way to customize the button without digging into the code and hacking it, but it can be done. With that done, when the page loads, everything will work as before, except you'd use your own image instead of ours. The downside to this solution is that if we update the loop-embed-code.js, you won't see the changes. Moreover, this would not be officially supported due to the overhead of not being synced up with our server. Of course, the most stable solution is to use the default Feedback and Support button</p></td>
                  </tr>
                  <tr>
                    <td style="font-size:13px; color:#b9b9b9; font-weight:bold; padding-left:18px; padding-top: 14px;">9:17 PM</td>
                    <td><p style="font-size:14px; padding: 14px 0px 0px; margin: 0px;"><strong>Call patched to (360)234-2345</strong></p></td>
                  </tr>
                  <tr>
                    <td style="font-size:13px; color:#b9b9b9; font-weight:bold; padding-left:18px;padding-top: 14px; ">9:25 PM</td>
                    <td><p style="font-size:14px;  padding: 14px 0px 0px; margin: 0px;"><strong>Jenny P.visited <a style="color:#000000; border-bottom:#7f7f7f 2px solid; text-decoration:none;" href="#">www.solestruck.com</a></strong></p></td>
                  </tr>
                  <tr>
                    <td style="font-size:13px; color:#b9b9b9; font-weight:bold; padding-left:18px; padding-top: 14px; ">9:28 PM</td>
                    <td><p style="font-size:14px;  padding: 14px 0px 0px; margin: 0px;"><strong>Call completed</strong></p></td>
                  </tr> -->
               <!--  </table> -->
                
         <!-- Start -->
         <div class= "dtl_scroll">
                <table  bgcolor="#ffffff" cellpadding="0" cellspacing="0">
                <tr height="41px" style="display:block; border-bottom:#cccccc 1px solid;">
                    <td>
                      <h2 style="padding:0px; margin:0px; font-size:23px;s" id="domain_Name"></h2>
                    </td>
                </tr>
                <tr>
                    <td>
                       <table style=" border-bottom:#cccccc 1px solid;">
                          <tr>
                            <td width="78" style="padding:10px 0;"><img src="images/user-icon.jpg" style="width: 73px;height: 73px;"/>
                            </td>
                            <td width="510" style=" padding-left:10px;">
                                <h3 style="text-transform:uppercase; font-size:14px; margin-top:0; margin-bottom:7px; margin-top:7px;" id="fromName"></h3>
                                
                                <!-- ======================================= -->
                                <span class="pull-left" style="font-size:14px; color:#999999; margin-top: 2px;" id="fromHeader"></span>
                                <div class="dropdown pull-left send_viewer" id="details_fromHeader" style= "width: 100%; margin-left: -1px; margin-top: 5px;" ></div>
                                <!-- ======================================= -->
                                
                            </td>
                         </tr>
                      </table>
                   </td>
                </tr>
                <tr>
                  <td>
              <table width="600" style="margin-top:11px;" cellpadding="0" cellspacing="0" border="0" id="messagebody">
                  <!-- <tr>
                    <td width="73" style="font-size:13px; color:#b9b9b9; font-weight:bold; padding-left:18px; padding-top: 14px; ">9:15 PM</td>
                    <td width="515"><p style="font-size:14px; padding: 14px 0px 0px; margin: 0px;"><strong>Jenny P.Answered</strong></p></td>
                  </tr>
                  <tr>
                    <td>&nbsp;</td>
                    <td><p style="font-size:14px;  padding: 14px 0px 0px; margin: 0px;"><strong>Call Type:</strong> Sales Call</p></td>
                  </tr>
                  <tr>
                    <td>&nbsp;</td>
                    <td><p style="font-size:14px; line-height:20px;  padding: 14px 0px 0px; margin: 0px;"><strong>Message : </strong> There isn't currently a way to customize the button without digging into the code and hacking it, but it can be done. With that done, when the page loads, everything will work as before, except you'd use your own image instead of ours. The downside to this solution is that if we update the loop-embed-code.js, you won't see the changes. Moreover, this would not be officially supported due to the overhead of not being synced up with our server. Of course, the most stable solution is to use the default Feedback and Support button</p></td>
                  </tr>
                  <tr>
                    <td style="font-size:13px; color:#b9b9b9; font-weight:bold; padding-left:18px; padding-top: 14px;">9:17 PM</td>
                    <td><p style="font-size:14px; padding: 14px 0px 0px; margin: 0px;"><strong>Call patched to (360)234-2345</strong></p></td>
                  </tr>
                  <tr>
                    <td style="font-size:13px; color:#b9b9b9; font-weight:bold; padding-left:18px;padding-top: 14px; ">9:25 PM</td>
                    <td><p style="font-size:14px;  padding: 14px 0px 0px; margin: 0px;"><strong>Jenny P.visited <a style="color:#000000; border-bottom:#7f7f7f 2px solid; text-decoration:none;" href="#">www.solestruck.com</a></strong></p></td>
                  </tr>
                  <tr>
                    <td style="font-size:13px; color:#b9b9b9; font-weight:bold; padding-left:18px; padding-top: 14px; ">9:28 PM</td>
                    <td><p style="font-size:14px;  padding: 14px 0px 0px; margin: 0px;"><strong>Call completed</strong></p></td>
                  </tr> -->
                </table>
                  </td>
               </tr>
             </table>
             </div>
     <!--  End -->
           </div>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
  <div id="reshcedule_modal_pop" class="popover fade right in" style="top: 30px; left: 300px; display: none; z-index: 900; height: 250px;">
				<div class="arrow" style="top: 44px!important;"></div><h3 class="popover-title">Reschedule</h3>
				<div class="popover-content">
						<table style="">
  					<tbody><tr>
  						<td style="padding-bottom: 10px;padding-top: 10px;">
  							<div class="input-group date col-sm-4">
								<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
								<input type="text" class="form-control reschedule_date_picker" id="reschedule_date_modal" data-date-format="mm/dd/yyyy" style="width:150px" required >
			  				</div>
  						</td>
  					</tr>
  					
  					<tr>
  						<td style="padding-bottom: 10px;">
							<div class="input-group col-sm-4 bootstrap-timepicker">
								<span class="input-group-addon"><i class="fa fa-clock-o"></i></span>
								<input type="text" class="form-control timepicker" id="reschedule_time_modal" value="11:30 PM" style="width:150px" required>
							</div>	
  						</td>
  					</tr>
  					
  					<tr>
  						<td style="padding-bottom: 15px;">
  							<div class="input-group col-sm-4 bootstrap-timepicker">
								<span class="input-group-addon"><i class="fa fa-globe"></i></span>
								<input type="text" class="form-control timezone_value" id="timezone_value_modal" value="PST" style="width:150px">
							</div>	
  						</td>
  					</tr>
  					
  					<tr>
  						<td align="center">
  							<button onclick="intractionToSche('single')" type="button" id ="Selected" class="btn btn-default" style="background-color: #f7f7f7!important;">Reschedule</button>
  						</td>
  					</tr>
  				</tbody></table>				
				</div>
			</div>
</div><!-- /.modal -->
</div>
	<div id="reschedule_pop" class="popover fade right in" style="top: 58px; left: 116px; display: none; z-index: 900; height: 250px;">
		<div class="arrow" style="margin-top: -42px;"></div>
		<h3 class="popover-title">Reschedule</h3>
		<button id="close_resc" type="button" class="close" aria-hidden="true" style="position: absolute;margin-top: -30px;margin-left: 225px;">x</button>
		<div class="popover-content" id="rescpop">
  				<table style="">
  					<tbody><tr>
  						<td style="padding-bottom: 10px;padding-top: 10px;">
  							<div class="input-group date col-sm-4">
								<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
								<input type="text" class="form-control reschedule_date_picker" id="reschedule_date" data-date-format="mm/dd/yyyy" style="width:150px">
			  				</div>
  						</td>
  					</tr>
  					<tr>
  						<td style="padding-bottom: 10px;">
							<div class="input-group col-sm-4 bootstrap-timepicker">
								<span class="input-group-addon"><i class="fa fa-clock-o"></i></span>
								<input type="text" class="form-control timepicker" id="reschedule_time" value="11:30 PM" style="width:150px">
							</div>	
  						</td>
  					</tr>
  					<tr>
  						<td style="padding-bottom: 15px;">
  							<div class="input-group col-sm-4 bootstrap-timepicker">
								<span class="input-group-addon"><i class="fa fa-globe"></i></span>
								<input type="text" class="form-control timezone_value" id="timezone_value" value="PST" style="width:150px">
							</div>	
  						</td>
  					</tr>
  					<tr>
  						<td align="center">
  							<button type="button" id = "rescSelected" class="btn btn-default" style="background-color: #f7f7f7!important;">Reschedule</button>
  						</td>
  					</tr>
  				</tbody>
  			</table>
		</div>
	</div>

		<div id="markType_pop" class="popover fade right in" style="top: 58px; left: 242px; z-index: 900; height: 200px; display: none;">
			<div class="arrow" style="margin-top: -22px;"></div>
			<h3 class="popover-title">Mark Account As</h3>
			<button id="close_migr" type="button" class="close" aria-hidden="true" style="position: absolute;margin-top: -30px;margin-left: 225px;">x</button>
			
			<div class="popover-content">
  				<table style="">
  					<tbody>
  						<tr>
  							<td style="padding-bottom: 10px;padding-top: 10px;">
  								<div class="input-group col-sm-4">
									<span class="input-group-addon"><i class="fa fa-user"></i></span>
									<input type="text" class="form-control" id="accNos" disabled="disabled" style="width:150px">
			  					</div>
  							</td>
  						</tr>
  						<tr>
  							<td style="padding-bottom: 15px;">
  								<div class="input-group col-sm-4">
									<span class="input-group-addon"><i class="fa fa-flag"></i></span>
									<input type="text" class="form-control" id="markTypeValue" disabled="disabled" style="width:150px">
								</div>	
  							</td>
  						</tr>
  						<tr>
  							<td align="center">
  								<button type="button" id="markTypeSelected" class="btn btn-default" style="background-color: #f7f7f7!important;">Mark</button>
  							</td>
  						</tr>
  					</tbody>
  				</table>
			</div>
		</div>
		
		<div id="ar_pop" class="popover fade right in" style="top: 65px; left: 285px; z-index: 900; height: 200px; display: none;">
			<div class="arrow" style="margin-top: -22px;"></div>
			<h3 class="popover-title">Trigger AR</h3>
			<button id="close_ar" type="button" class="close" data-dismiss="modal" aria-hidden="true" style="position: absolute;margin-top: -30px;margin-left: 245px;">x</button>
			<div class="popover-content">
			<div style="overflow:scroll;height:150px;">
  				<table style="">
  					<tbody>
  						<tr>
  							<td style="padding-bottom: 10px;padding-top: 10px;">
  								<div class="input-group col-sm-4">
									<!-- <span class="input-group-addon"><i class="fa fa-user"></i></span> -->
									<input type="text" class="form-control" id="aracc_num" style="width: 170px;" placeholder="AccountNumber">
			  					</div>
  							</td>
  						</tr>
  						<tr id="dynamic_attributes"></tr>
  						<tr >
  							<td style="padding-bottom: 15px;">
  								<div class="input-group col-sm-4">
									<!-- <span class="input-group-addon"><i class="fa fa-flag"></i></span> -->
									<input type="text" class="form-control" id="ar_key" placeholder="Key" style="width:75px">
								</div>	
  							</td>
  							<td style="padding-bottom: 15px;padding-left:5px;">
  								<div class="input-group col-sm-4">
									<!-- <span class="input-group-addon"><i class="fa fa-flag"></i></span> -->
									<input type="text" class="form-control" id="ar_value" placeholder="Value" style="width:75px;margin-left: -110px;">
									<span id="addAr" class="input-group-addon" style="position:absolute;margin-top: -30px;margin-left: -20px;"><i  class="fa fa-plus" style="margin-left: -4px;" ></i></span>
								</div>	
  							</td>
  						</tr>
  						
  						<tr>
  							<!-- <td align="center">
  								<button type="button" id="addAr" class="btn btn-default" style="background-color: #f7f7f7!important;">Add</button>
  							</td> -->
  							<td align="center">
  								<button type="button" id="submitAr" class="btn btn-default" style="background-color: #f7f7f7!important;">Submit</button>
  							</td>
  						</tr>
  					</tbody>
  				</table>
  				</div>
			</div>
		</div>
		<div id="download_pop" class="popover fade right in" style="top: 55px; left: 318px; z-index: 900; height: 220px; width: 200px; display: none;">
			<div class="arrow" style="margin-top: -15px;"></div>
			<h3 class="popover-title">Download CSV of</h3>
			<button id="close_downld" type="button" class="close" aria-hidden="true" style="position: absolute; top: 5px; left: 175px;">x</button>
			<div class="popover-content">
				<table style="">
	  					<tbody>
	  						<tr>
	  							<td>
	  								<div class="input-group col-sm-12">
										<div class="radio">
	  										<label>
	    										<input type="radio" name="interactionTypeRadio" id="arRadio" value="AR" checked>Active Response
											</label>
										</div>
				  					</div>
	  							</td>
	  						</tr>
	  						<tr>
	  							<td>
	  								<div class="input-group col-sm-12">
										<div class="radio">
	  										<label>
	    										<input type="radio" name="interactionTypeRadio"  id="chatRadio" value="SBChat">Chat
	  										</label>
										</div>
									</div>	
	  							</td>
	  						</tr>
	  						<tr>
	  							<td style="padding-bottom: 2px;">
	  								<div class="input-group col-sm-12">
										<div class="radio">
		  									<label>
	    										<input type="radio" name="interactionTypeRadio" id="allRadio" value="All">All
	  										</label>
										</div>
									</div>	
	  							</td>
	  						</tr>
	  					</tbody>
	  			</table>
	  			<button type="button" id="requestDownload" class="btn btn-default btn-block" style="background-color: #f7f7f7!important;">Download</button>
			</div>
		</div>	
		<div id="downloadChat_pop" class="popover fade right in" style="top: 55px; left: 450px; z-index: 900; height: 255px; width: 250px; display: none;">
			<div class="arrow" style="margin-top: -42px;"></div>
			<h3 class="popover-title">Download Chat Transcripts</h3>
			<button id="close_downloadChat" type="button" class="close" aria-hidden="true" style="position: absolute;margin-top: -30px;margin-left: 225px;">x</button>
			<div class="popover-content">
				<form>
	  				<table style="">
	  					<tbody>
		  					<tr>
		  						<td style="padding-bottom: 10px;padding-top: 10px;">
		  							<div class="input-group date col-sm-4">
										<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
										<input type="text" class="form-control datepicker" id="download_from_date" data-date-format="mm/dd/yyyy" style="width:150px" placeholder="From">
					  				</div>
		  						</td>
		  					</tr>
		  					<tr>
		  						<td style="padding-bottom: 10px;padding-top: 10px;">
		  							<div class="input-group date col-sm-4">
										<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
										<input type="text" class="form-control datepicker" id="download_to_date" data-date-format="mm/dd/yyyy" style="width:150px" placeholder="To">
					  				</div>
		  						</td>
		  					</tr>
		  					<tr>
	  							<td style="padding-bottom: 10px;padding-top: 10px;">
	  								<div class="input-group col-sm-4">
										<!-- <span class="input-group-addon"><i class="fa fa-user"></i></span> -->
										<input type=text class="form-control" id="chat_subacc" style="width: 187px;" placeholder="Account Number">
				  					</div>
	  							</td>
	  						</tr>
		  					<tr>
		  						<td align="center">
		  							<button type="button" id = "downloadChatSubmit" class="btn btn-default" style="background-color: #f7f7f7!important;">Download</button>
		  						</td>
		  					</tr>
	  					</tbody>
	  				</table>
	  			</form>
			</div>
		</div>			
			
	<script type="text/javascript" src="/js/jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="../js/Library/Moment.js"></script>
	<script type="text/javascript" src="../js/Library/Moment-TimeZone.js"></script>
	<script type="text/javascript" src="/js/ZeroClipboard.js"></script>
	<script type="text/javascript" src="/js/spin.js"></script>
	<script type="text/javascript" src="/js/search.js"></script>
	 <script type="text/javascript" src="/js/dynamicDataManipulator.js"></script>
    <script type="text/javascript" src="js/action_new.js"></script>
    <script type="text/javascript" src="js/bootstrap.js"></script>
    <script type="text/javascript" src="js/action.js"></script>
    <script type="text/javascript" src="/js/interactionsManipulator.js"></script>
    <script type="text/javascript" src="/js/MessageWindow.js"></script>
    <script type="text/javascript" src="/js/dataretreival_new.js"></script>
 	<script type="text/javascript" src="/js/bootstrap-datepicker.js"></script>
 	<script type="text/javascript" src="../js/bootstrap-timepicker.js"></script>
	<script type="text/javascript" src="/js/loading.js"></script> 
    <script type="text/javascript" src="/js/layout.js"></script> 
    <script type="text/javascript" src="/js/dataAppender.js"></script>
    <script type="text/javascript" src="/js/helper.js"></script>
    <script type="text/javascript" src="/js/sorting.js"></script>
    
    
<!-- LoopTodo Feedback Form Code -->
<script id="looptodo_loop_embed_code" type="text/javascript" src="http://my.loopto.do/form/js/loop-embed-code.js?loopKey=agtzfmxvb3BhYmFja3IRCxIETG9vcBiAgICQn5nmCAw&domain=my.loopto.do">
</script>
<script type="text/javascript">
var looptodo_load_chain = window.onload;
window.onload = function() {
	if(internal_flag == 'true')
	  $('#internalli').addClass('active');
	else
	  $('#manageli').addClass('active');
    //looptodo_feedback_btn_init({ name : "John Doe", email : "test@example.com", allowAnonymous: true, hideNameEmail: false });
    looptodo_feedback_btn_init();
    if(looptodo_load_chain) 
        looptodo_load_chain();
};
</script>
<!-- End LoopTodo Feedback Form Code -->
   
   
   

		<div id="rescheduling_status"class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
 		 <div class="modal-dialog modal-lg">
  			  <div class="modal-content">
  			  <div class="modal-header">
  			  <button type="button" class="close" data-dismiss="modal" aria-hidden="true"><%="x"%></button>
  			  <h4 class="modal-title" id="myLargeModalLabel">Rescheduling Status</h4>
  			  </div>
  			  <div id="Rescheduling_modal_content" style="margin: 10px 15px 10px 15px;">
  			  </div>
  			  
   			 </div>
 		 </div>
		</div>
		   
   
   
    
    
    
    
<div id="deleting_status"class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
   
    <div class="modal-dialog modal-lg">
    
       <div id="dynamicModalstartdiv">
      
       </div>
    </div>
  </div>
        
    </body>
  </html>
