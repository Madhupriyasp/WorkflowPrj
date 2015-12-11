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
  	<style>
  	.stat_td
  	{
  		font-size: 15px;
  		font-weight: 600;
  		width : 20%;
  	}
  	.account-details .table tr td {
	border-bottom: 1px solid #e4e4e4;
	position: relative;
</style>
  		<meta name="viewport" content="width=device-width, initial-scale=1.0">
	  	<link rel="stylesheet" type="text/css" href="../css/bootstrap.css" media="screen">
	  	<link rel="stylesheet" type="text/css" href="../css/bootstrap-timepicker.css">
	  	<link rel="stylesheet" type="text/css" href="css/style_new2.css">
	  	<link rel="stylesheet" type="text/css" href="css/statistic.css">
      	<link rel="stylesheet" type="text/css" href="../css/font-awesome.css">
      	<link rel="stylesheet" type="text/css" href="../css/font-awesome4.css">
	<link rel="stylesheet" href="/css/datepicker.css" type="text/css" />
	<script type="text/javascript">
		var googleLogin = '<%=session.getAttribute("googleLogin")%>';
		var photoURL	= '<%=session.getAttribute("photoURL")%>';
		if(photoURL == null || photoURL == "null")
			photoURL = "images/user-icon.jpg"; 
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
							<input id="accNo" type="text" placeholder="" class="fch_input"
								onkeydown="Javascript: if(event.keyCode==13) $('#fetch').trigger('click');" />
							<a id="fetch" class="btn btn-success btn-fch">Fetch</a>
						</div>
					</div></li>

			</ul>
			<div class="navbar-collapse collapse">
				<ul class="nav navbar-nav">
					<li><a href="/adminqueuegae">Manage Queue</a></li>
					<li><a href="/emaillistener" >Tools</a></li>
					<li><a href="/adminqueuegae?internalacc=true&fetch=false" id="internal" class="internal" >Internal Accounts</a></li>
					<!-- <li><a href="/emaillistener" >Email Listener</a></li>
					<li><a href="/routingTable">Available Agents</a></li> -->
					<li><a href="/toolsmanager">Account Manager</a></li>
					<li><a href="/reports">Reports</a></li>
					<!-- <li class= "active"><a href="/statisticController">Stats</a></li> -->
					<!-- <li><a href="#">report</a></li> -->
				</ul>
				<!--nav nav-pills-->
			</div>
		</div>
	</nav>
  <div class="wrapper" id = "foo">							  
  	<div class="page-icon">
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
			
	<script type="text/javascript" src="js/jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="/js/spin.js"></script>
	 <script type="text/javascript" src="js/action_new.js"></script>
	<script type="text/javascript" src="/js/bootstrap-datepicker.js"></script>
 	<script type="text/javascript" src="../js/bootstrap-timepicker.js"></script>
 	<script type="text/javascript" src="/js/MessageWindow.js"></script>
    <script type="text/javascript" src="js/bootstrap.js"></script>
     <script type="text/javascript" src="js/statistic.js"></script>
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
