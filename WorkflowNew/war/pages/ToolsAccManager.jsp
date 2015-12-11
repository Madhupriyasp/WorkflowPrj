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
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" type="text/css" href="/css/bootstrap.css" media="screen">
      <link rel="stylesheet" type="text/css" href="/css/style4accountmanger.css">
	  <link rel="stylesheet" type="text/css" href="css/style_new2.css">
      <link rel="stylesheet" type="text/css" href="/css/tools.css">
      <link rel="stylesheet" type="text/css" href="/css/font-awesome.css">
      <link rel="stylesheet" type="text/css" href="/css/font-awesome4.css">
      <link rel="stylesheet" type="text/css" href="/css/Library/bootstrap-select.css">
<!--             <link rel="stylesheet" type="text/css" href="/css/Library/bootstrap-datetimepicker.min.css"> -->
      <link rel="stylesheet" href="/css/theme.default.css">
      <script type="text/javascript">
 			var googleLogin = '<%=session.getAttribute("googleLogin")%>';
 			var photoURL	= '<%=session.getAttribute("photoURL")%>';
      var currentUser = '<%=agentname%>';
 			if(photoURL == null || photoURL == "null")
 				photoURL = "images/user-icon.jpg";
 			var mode	  = '<c:out value="${mode}"/>'
 			var accno	 = '<c:out value="${fetch_accno}"/>'
 			var timezone = '<c:out value="${timezone}"/>'
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
				<div class="popover bottom"  id="log_dtl">
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
			<li class="pull-right"><div id="fetchtab1">
					<span>Fetch&nbsp&nbsp&nbsp|</span>
				</div>
				<div class="popover bottom" id="fetchdtl">
					<div class="arrow"></div>
					<div class="popover-content">
						<input id="fetchinbox" type="text" placeholder="Enter 8xx / 1xx / Skill"
							class="fch_input"
							onkeydown="Javascript: if(event.keyCode==13) $('#fetch').trigger('click');">
							<a id="fetch" class="btn btn-success btn-fch">Fetch</a>
					</div>
				</div></li>

		</ul>
		<div class="navbar-collapse collapse">
			<ul class="nav navbar-nav">
				<li><a id="manage" href="/adminqueuegae">Manage Queue</a></li>
				<li><a id="tools" href="/emaillistener">Tools</a></li>
				<li><a href="/adminqueuegae?internalacc=true&fetch=false" id="internal" class="internal" >Internal Accounts</a></li>
				<!-- <li><a href="/emaillistener">Email Listener</a></li>
				<li><a href="/routingTable">Available Agents</a></li> -->
				<li class= "active"><a href="/toolsmanager">Account Manager</a></li>
				<li><a href="/reports">Reports</a></li>
				<!-- <li><a href="/statisticController">Stats</a></li> -->
				<!-- <li><a href="#">report</a></li> -->
			</ul>
			<!--nav nav-pills-->
		</div>
	</div>
</nav>
   
      <div id="wrapper"> 
        <section>
            <aside>
                <h3>Workflow Account</h3>
                  <div class="search-holder">
                    <input type="text" placeholder="Search" id='subacc_search_box' class="srh-input" onkeyup="accountManager.search_filter(this,'unorder_list_data','list')">
                     <!-- <input type="text" placeholder="Search" class="srh-input" onkeyup="accountManager.search_filter_list(this,'unorder_list_data')"> -->
                     <button id="create-acc" class="btn-add" data-toggle="modal" data-target="#myModal">+</button>
                  </div><!--Search holder-->
           
                      <table id="subacc_table" class="team-table col-lg-12 col-md-12 col-sm-12 col-xs-12" style="color: #909090; font-family: helvetica; font-size: 14px;">
                      <thead></thead><tbody id="subacc_table_data" class="left_navbar">

						</tbody></table>
            </aside> 
               <article class="distributed" id="listened" style="overflow:hidden">
                             <h3 id= "profile_Detail" class="collapse1">Profile Details</h3>
                       <div class="panel1">
                               <figure>
                                 <img class="logo-img" src="/images/distributed.png">
                               </figure>
                                       <ul class="radio-btn">
                                         <li id = "chat-Id">
                                           <span><cite></cite></span>
                                           <b><i class="fa fa-comment"></i>Chat Interaction</b>
                                         </li>
                                         <li id = "ar-Id">
                                           <span><cite></cite></span>
                                           <b><i class="fa fa-bolt"></i>AR Interaction</b>
                                         </li>  
                                       </ul>

                                         <div class="form-field">
                                         <input id="campagin-val" type="text" placeholder="Campagin" class="frm-input" disabled> 
                                         <input id="domin-form" type="text" placeholder="Profile Title" class="frm-input">
                                           
                                           <textarea id="desc-form" rows="3" placeholder="Description" class="frm-des" style="display: none"></textarea>
                                           <button id = "Step-2"type="button" class="btn btn-success">Next</button>
                                         </div><!--form-field-->
                       </div><!--panel1-->
                         <h3 class="collapse2">Additional Configuration</h3>
                         <div class="panel2">
                                   <br>
                                       <div class="form-field">
                                       <table>
                                        <tr class="form-tr"><td class="form-td">Call Delay : &nbsp</td><td class="form-tdvalue"> <input id="callDe-form" type="text" placeholder="call delay" class="frm-input"></td>
                                            <td class="form-td">Campagin Delay : &nbsp</td><td class="form-tdvalue"> <input id="campDe-form" type="text" placeholder="Campagin Delay" class="frm-input"></td>
                                        </tr>
                                        <tr class="form-tr"><td class="form-td">Pause Event :&nbsp</td>
                                        <td class="form-tdvalue"> 
                                         <div class="color-group">
                                           <button type="button" class="option-drop" id="pause_button" data-toggle="dropdown" style="margin-left: -27px;">Pause Event <span class="caret"></span></button>
                                               <ul class="dropdown-menu" role="menu">
                                                 <li onclick="fillDrop('pause_button','True')"><a href="#"><i class="fa fa-square"></i>True</a></li>
                                                 <li class="divider"></li>
                                                 <li onclick="fillDrop('pause_button','False')"><a href="#"><i class="fa fa-square"></i>False</a></li>
                                              </ul>
                                       </div>
                                        </td>
                                           <td class="form-td">Pause Duration : &nbsp</td><td class="form-tdvalue"> <input type="text" id="pauseD-form"  placeholder="Pause Duration " class="frm-input" value="65535" disabled></td>
                                        </tr>
                                        <tr class="form-tr"><td class="form-td">Form Name : &nbsp</td><td class="form-tdvalue"> <input type="text" id="formname-form" placeholder="Form Name" class="frm-input"></td>
                                         <td class="form-td">Allow F8 : &nbsp</td><td class="form-tdvalue"> 
     									<div class="color-group">
                                           <button id="allow-drop"type="button" class="option-drop"  data-toggle="dropdown" style="margin-left: -27px;">Allow F8 <span class="caret"></span></button>
                                               <ul class="dropdown-menu" role="menu">
                                                 <li onclick="fillDrop('allow-drop','Enabled')"><a href="#"><i class="fa fa-square"></i>Enabled</a></li>
                                                 <li class="divider"></li>
                                                 <li onclick="fillDrop('allow-drop','Disabled')"><a href="#"><i class="fa fa-square"></i>Disabled</a></li>
                                                </ul>
                                       </div> 
                                       </td>
                                                       </tr>
                                        <tr class="form-tr"><td class="form-td">International Dialing : &nbsp</td><td class="form-tdvalue">
                                         <div class="color-group">
                                           <button id="inter-drop" type="button" class="option-drop"  data-toggle="dropdown" style="margin-left: -27px;">International Dialing <span class="caret"></span></button>
                                               <ul class="dropdown-menu" role="menu">
                                                 <li onclick="fillDrop('inter-drop','True')"><a href="#"><i class="fa fa-square"></i>True</a></li>
                                                 <li class="divider"></li>
                                                 <li onclick="fillDrop('inter-drop','False')"><a href="#"><i class="fa fa-square"></i>False</a></li>
                                              </ul>
                                       </div>
                                         </td>
                                         <td class="form-td">Interruptable : &nbsp</td><td class="form-tdvalue">
                                         <div class="color-group">
                                           <button id="intrupt-drop" type="button" class="option-drop"  data-toggle="dropdown" style="margin-left: -27px;">False <span class="caret"></span></button>
                                               <ul class="dropdown-menu" role="menu">
                                                 <li onclick="fillDrop('intrupt-drop','True')"><a href="#"><i class="fa fa-square"></i>True</a></li>
                                                 <li class="divider"></li>
                                                 <li onclick="fillDrop('intrupt-drop','False')"><a href="#"><i class="fa fa-square"></i>False</a></li>
                                              </ul>
                                       </div>
                                         </td>
                                           
                                        </tr>
                                       <tr class="form-tr"><td class="form-td">Preferred Url : &nbsp</td><td class="form-tdvalue"> <input id="prefered-form" type="text" placeholder="Preferred url" class="frm-input"></td>
                                            <td class="form-td">Expiration Time : &nbsp</td><td class="form-tdvalue"> <input id="expirtime-form" type="text" placeholder="Expiration Time (Hr)" class="frm-input"></td>
                                        </tr>
                                        
                                        <tr class="form-tr"><td class="form-td">Expected Time To Complete : &nbsp</td><td class="form-tdvalue"> <input id="expectedtimeToCompl" type="text" placeholder="Time to Complete" class="frm-input"></td>
                                        </tr>
                                        
                                        </table>
                                        
                                        <table id = "email-table" style ="margin-top: 50px;">
                                        <tr class="form-tr"><td class="form-td">Email Address : &nbsp</td><td class="form-tdvalue"> <input id="email-form" type="text" placeholder="Email Address " class="frm-input"></td>
                                            <td class="form-td">Email Password : &nbsp</td><td class="form-tdvalue"> <input id="EmailPass-form" type="text" placeholder="Email Password" class="frm-input"></td>
                                        </tr>
                                        <tr class="form-tr"><td class="form-td">Client Email : &nbsp</td><td class="form-tdvalue"> <input id="client-email" type="text" placeholder="Client Email Address " class="frm-input"></td>
                                            <td class="form-td">Client Password : &nbsp</td><td class="form-tdvalue"> <input id="client-EmailPass" type="text" placeholder="Client Email Password" class="frm-input"></td>
                                        </tr>
                                        <tr class="form-tr"><td class="form-td">Alias : &nbsp</td><td class="form-tdvalue"> <input id="Alias-form" type="text" placeholder="Alias" class="frm-input"></td>
                                            <td class="form-td">Cc : &nbsp</td><td class="form-tdvalue"> <input id="cc-form" type="text" placeholder="Cc" class="frm-input"></td>
                                        </tr>
                                        <tr class="form-tr">
                                            <td class="form-td">Bcc : &nbsp</td><td class="form-tdvalue"> <input id="bcc-form" type="text" placeholder="Bcc" class="frm-input"></td>
                                        </tr>
                                        </table>
                                      <button id = "Step-3"type="button" class="btn btn-success">Next</button>
                          	</div><!--form-field-->

                         </div><!--panel2-->
                         <h3 class="collapse3">Schedule Rules</h3>
                      <div class="panel3" style= "display:none; overflow:scroll;" >
                                 <br>
                                       <div class="form-field">
                                       <h4>BusinessRules :</h4>
                                       <table>
                                        <tr class="form-tr">
                                        	 <td class="form-td">StartTime : &nbsp</td><td class="form-tdvalue"> 
                                        	    <div style="float: left">
																<div class='input-group date' id='startTimePicker' style="width:137px;float: left;">
														                    <input id="startTime" type='text' onkeyup="return false" class="form-control" />
														                    <span class="input-group-addon">
														                        <span class="glyphicon glyphicon-time"></span>
														                    </span>
														         </div>
														
			    												<select class="timezone startZone" id="startZone" data-size="7">
			                                           				<option>PDT</option>
			                                           				<option>PST</option>
			                                           				<option>IST</option>
			                                           				<option>EDT</option>
			                                           				<option>EST</option>
			                                           				<option>CDT</option>
			                                           				<option>CST</option>
			                                           				<option>MDT</option>
			                                           				<option>MST</option>
			                                           				<option>HDT</option>
			                                           				<option>HST</option>
			                                           				<option>AKDT</option>
			                                           				<option>AKST</option>
			                                           				<option>AST</option>
			                                           				<option>ADT</option>
			                                           				<option>UTC</option>
			                                           				<option>GMT</option>
			                                            	</select>
										         </div>       
                                        	 </td>
                                            <td class="form-td">StopTime : &nbsp</td><td class="form-tdvalue"> 
                                            
		                                             	 <div style="float: left">
																<div class='input-group date' id='stopTimePicker' style="width:142px;float: left;">
														                    <input id="stopTime" type='text' class="form-control" />
														                    <span class="input-group-addon">
														                        <span class="glyphicon glyphicon-time"></span>
														                    </span>
														         </div>
																	
			    												<select class="timezone stopZone" id="stopZone" data-size="7">
			                                           				<option>PDT</option>
			                                           				<option>PST</option>
			                                           				<option>IST</option>
			                                           				<option>EDT</option>
			                                           				<option>EST</option>
			                                           				<option>CDT</option>
			                                           				<option>CST</option>
			                                           				<option>MDT</option>
			                                           				<option>MST</option>
			                                           				<option>HDT</option>
			                                           				<option>HST</option>
			                                           				<option>AKDT</option>
			                                           				<option>AKST</option>
			                                           				<option>AST</option>
			                                           				<option>ADT</option>
			                                           				<option>UTC</option>
			                                           				<option>GMT</option>
			                                            		</select>
												         </div>       
                                            </td>
                                        </tr>
                                        <tr class="form-tr">
                                        	 <td class="form-td">TriggerTime : &nbsp</td>
                                        	 <td class="form-tdvalue"> 
	                                        	 <div style="float: left">
																	<div class='input-group date' id='triggerTimePicker' style="width:137px;float: left;">
															                    <input id="triggerTime" type='text' class="form-control" />
															                    <span class="input-group-addon">
															                        <span class="glyphicon glyphicon-time"></span>
															                    </span>
															         </div>
															
				    												<select class="timezone triggerZone" id="triggerZone" data-size="7">
				                                           				<option>PDT</option>
				                                           				<option>PST</option>
				                                           				<option>IST</option>
				                                           				<option>EDT</option>
				                                           				<option>EST</option>
				                                           				<option>CDT</option>
				                                           				<option>CST</option>
				                                           				<option>MDT</option>
				                                           				<option>MST</option>
				                                           				<option>HDT</option>
				                                           				<option>HST</option>
				                                           				<option>AKDT</option>
				                                           				<option>AKST</option>
				                                           				<option>AST</option>
				                                           				<option>ADT</option>
				                                           				<option>UTC</option>
				                                           				<option>GMT</option>
				                                            	</select>
											         </div>
                                        	 </td>
                                            <td class="form-td">ExcludeDays : &nbsp</td>
                                            <td class="form-tdvalue"> 
                                            	<select class="excludeDaysPicker" multiple title="Not Selected">
                                           				<option value="Monday" id="excl1" class="picker_ExcludeDays">Monday</option>
                                           				<option value="Tuesday" id="excl2" class="picker_ExcludeDays">Tuesday</option>
                                           				<option value="Wednesday" id="excl3" class="picker_ExcludeDays">Wednesday</option>
                                           				<option value="Thursday" id="excl4" class="picker_ExcludeDays">Thursday</option>
                                           				<option value="Friday" id="excl5" class="picker_ExcludeDays">Friday</option>
                                           				<option value="Saturday" id="excl6" class="picker_ExcludeDays">Saturday</option>
                                           				<option value="Sunday" id="excl7" class="picker_ExcludeDays">Sunday</option>
                                            	</select>
                                            </td>
                                        </tr>
                                         <tr class="form-tr">
                                         	 <td class="form-td">ExceptionalDays : &nbsp</td>
                                         	 <td class="form-tdvalue"> 
                                         			<select class="exceptionalDaysPicker" multiple title="Not Selected">
                                           				<option value="Monday" id="excep1" class="picker_ExceptionalDays">Monday</option>
                                           				<option value="Tuesday" id="excep2" class="picker_ExceptionalDays">Tuesday</option>
                                           				<option value="Wednesday" id="excep3" class="picker_ExceptionalDays">Wednesday</option>
                                           				<option value="Thursday" id="excep4" class="picker_ExceptionalDays">Thursday</option>
                                           				<option value="Friday" id="excep5" class="picker_ExceptionalDays">Friday</option>
                                           				<option value="Saturday" id="excep6" class="picker_ExceptionalDays">Saturday</option>
                                           				<option value="Sunday" id="excep7" class="picker_ExceptionalDays">Sunday</option>
                                            	</select>
                                         	 </td>
                                            <td class="form-td">ExceptionalDayStartTime : &nbsp</td>
                                            <td class="form-tdvalue"> 
                                            		<div style="float: left">
																<div class='input-group date' id='exceptionalDayStartTimePicker' style="width:142px;float: left;">
														                    <input id="exceptionalDayStartTime" type='text' class="form-control" />
														                    <span class="input-group-addon">
														                        <span class="glyphicon glyphicon-time"></span>
														                    </span>
														         </div>
														
			    												<select class="timezone exStartZone" id="exStartZone" data-size="7">
			                                           				<option>PDT</option>
			                                           				<option>PST</option>
			                                           				<option>IST</option>
			                                           				<option>EDT</option>
			                                           				<option>EST</option>
			                                           				<option>CDT</option>
			                                           				<option>CST</option>
			                                           				<option>MDT</option>
			                                           				<option>MST</option>
			                                           				<option>HDT</option>
			                                           				<option>HST</option>
			                                           				<option>AKDT</option>
			                                           				<option>AKST</option>
			                                           				<option>AST</option>
			                                           				<option>ADT</option>
			                                           				<option>UTC</option>
			                                           				<option>GMT</option>
			                                            	</select>
										         </div>       
                                            </td>
                                        </tr>
                                         <tr class="form-tr">
                                         	 <td class="form-td">ExceptionalDayStopTime : &nbsp</td>
                                         	 <td class="form-tdvalue"> 
	                                         	 			<div style="float: left">
																	<div class='input-group date' id='exceptionalDayStopTimePicker' style="width:137px;float: left;">
															                    <input id="exceptionalDayStopTime" type='text' class="form-control" />
															                    <span class="input-group-addon">
															                        <span class="glyphicon glyphicon-time"></span>
															                    </span>
															         </div>
				    												<select class="timezone exStopZone" id="exStopZone" data-size="7">
				                                           				<option>PDT</option>
				                                           				<option>PST</option>
				                                           				<option>IST</option>
				                                           				<option>EDT</option>
				                                           				<option>EST</option>
				                                           				<option>CDT</option>
				                                           				<option>CST</option>
				                                           				<option>MDT</option>
				                                           				<option>MST</option>
				                                           				<option>HDT</option>
				                                           				<option>HST</option>
				                                           				<option>AKDT</option>
				                                           				<option>AKST</option>
				                                           				<option>AST</option>
				                                           				<option>ADT</option>
				                                           				<option>UTC</option>
				                                           				<option>GMT</option>
				                                            		</select>
													         </div>
                                         	 </td>
                                         	 <td class="form-td">Exclude Days rules : &nbsp</td>
                                         	 <td class="form-tdvalue"> 
                                         	 <div class="color-group">
													<button id="excludeDays-rules" type="button" class="option-drop" data-toggle="dropdown" style="margin-left: -27px;">Exclude Rules<span class="caret"></span>
													</button>	
													<ul class="dropdown-menu" role="menu">
														<li onclick="fillDrop('excludeDays-rules','Ignore Interactions')"><a href="#"><i class="fa fa-square"></i>Ignore Interactions</a></li>
														<li class="divider"></li>
														<li onclick="fillDrop('excludeDays-rules','Schedule Interactions')"><a href="#"><i class="fa fa-square"></i>Schedule Interactions</a></li>
													</ul>
												</div>
                                         	 </td>
                                        </tr>
										<tr class="form-tr">
										    <td class="form-td">IgnoreRules : &nbsp</td>
                                            <td class="form-tdvalue">
												<div class="color-group">
													<button id="ignore-rules" type="button" class="option-drop" data-toggle="dropdown" style="margin-left: -27px;"> IgnoreRules  <span class="caret"></span>
													</button>
													<ul class="dropdown-menu" role="menu">
														<li onclick="fillDrop('ignore-rules','true')"><a href="#"><i class="fa fa-square"></i>True</a></li>
														<li class="divider"></li>
														<li onclick="fillDrop('ignore-rules','false')"><a href="#"><i class="fa fa-square"></i>False</a></li>
													</ul>
												</div>
											</td>
											<td class="form-td">AutoRescheduling : &nbsp</td>
											<td class="form-tdvalue">
												<div class="color-group">
													<button id="auto-reschd-drop" type="button" class="option-drop" data-toggle="dropdown" style="margin-left: -27px;"> AutoRescheduling  <span class="caret"></span>
													</button>
													<ul class="dropdown-menu" role="menu">
														<li onclick="fillDrop('auto-reschd-drop','true')"><a href="#"><i class="fa fa-square"></i>True</a></li>
														<li class="divider"></li>
														<li onclick="fillDrop('auto-reschd-drop','false')"><a href="#"><i class="fa fa-square"></i>False</a></li>
													</ul>
												</div>
											</td>
										</tr>
										<tr class="form-tr">
											 <td class="form-td">AR Frequency : &nbsp</td><td class="form-tdvalue"> <input id="arFrequency-rules" type="text" placeholder="1 - 500" class="frm-input"></td>
										</tr>
									</table>
                                        <br>
                                         <h4>Requeue Rules :</h4>
                                        <table>
                                         <tr class="form-tr">
                                         	 <td class="form-td">ProblemAlertEmailId : &nbsp</td><td class="form-tdvalue"> <input id="probAlerEmail-rules" type="text" placeholder="Ex.mailId@domain.com" class="frm-input"></td>
                                            <td class="form-td">InQueueReqTime(mins) : &nbsp</td><td class="form-tdvalue"> <input id="inqueReqTime-rules" type="text" placeholder="Ex:[-1=Disable,0=MailNotification,1 to 140 mins]" class="frm-input"></td>
                                        </tr>
                                         <tr class="form-tr">
                                         	 <td class="form-td">InProgressReqTime(mins) : &nbsp</td><td class="form-tdvalue"> <input id="inprogtime-rules" type="text" placeholder="Ex:[-1=Disable,0=MailNotification,1 to 140 mins]" class="frm-input"></td>
                                            <td class="form-td">AnsweredReqTime(mins) : &nbsp</td><td class="form-tdvalue"> <input id="ansreqtime-rules" type="text" placeholder="Ex:[-1=Disable,0=MailNotification,1 to 140 mins]" class="frm-input"></td>
                                        </tr>
                                 		</table>
                                       <button id = "Step-4"type="button" class="btn btn-success">Next</button>
                          	</div>
                         </div><!--panel3-->
                        <h3 class="collapsePending">Pending Interaction Lookups</h3>
                        <div class="panelPending" style= "display:none; overflow:scroll;">
                        	 <div class="pendinglookups-mgment">
                        	 <br>
                             <table class="table table-hover">
                               <thead>
                                 <tr>
                                   <th>Uploaded Date & Time&nbsp<span style="color: #9d9d9d">PDT</span></th>
                                   <th>File Name</th>
                                   <th>Total Uploaded</th>
                                   <th>Total Pending</th>
                                   <th>Status</th>
                                   <th>Enable/Disable</th>
                                 </tr>
                               </thead>
                               <tbody id="lookupTable">
                                 <tr>
                                   <td>Upload time</td>
                                   <td>test.csv</td>
                                   <td>uploaded</td>
                                   <td>Pending</td>
                                   <td>52</span></td>
                                   <td>Active</td>
                                   <td>
                                   <button type="button" class="btn btn-success">
  												<span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>
									</button>
									<button type="button" class="btn btn-danger">
  									<span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>
									</button></td>
                                 </tr>
                                 
                               </tbody>
                             </table>
                           </div>
                        </div>
                         
                         
                         <h3 class="collapse4">Skill Configuration &nbsp&nbsp<a><i class="fa fa-upload" id="multi_skill_csv"  data-placement="right" data-container="body" data-toggle="popover" style="cursor:pointer;color:black" data-original-title="Update Skills to multiple users"></i><input id="skill-file" type="file" name="myFile" style="display:none;"></a></h3>
                         <div class="panel4" style= "display:none; overflow:scroll;">
                         
                                   <div class="option">

                                    <h4 id="defaultSkill" style="margin-top: 10px;">Current Skill:</h4>

                                      <div id="overflow-chk"class="checkbox">
                                      <input type="checkbox" id="overflow-skill" class="checkbox"style= "margin: 1px 5px 0px 3px;"onclick="fillDrop('overflow-skill','overflow')">
                                         <%--   <span><cite></cite></span>  --%>
                                           <b>Overflow</b>
                                         </div>  

                                       <div class="color-group">
                                           <button id="skill-mode" type="button" class="option-drop"  data-toggle="dropdown">Live <span class="caret"></span></button>
                                               <ul class="dropdown-menu" role="menu">
                                                <li   class="skill-Live" onclick="fillDrop('skill-mode','Live')"><a href="#"><i class="fa fa-square"></i>Live</a></li>
                                                <li   class="divider skill-Live"></li>
                                                 <li  class="skill-Live" onclick="fillDrop('skill-mode','Overflow live')"><a href="#"><i class="fa fa-square"></i>Overflow live</a></li>
                                               
                                                 <li  class="skill-Staging"  onclick="fillDrop('skill-mode','Staging')"><a href="#"><i class="fa fa-square"></i>Staging</a></li>
                                                  <li class="skill-Staging" class="divider"></li>
                                                 <li  class="skill-Staging"  onclick="fillDrop('skill-mode','Overflow staging')"><a href="#"><i class="fa fa-square"></i>Overflow staging</a></li>
                                             </ul>
                                       </div><!--color-group-->
                                   </div><!--option-->

                                       <div class="form-field">
                                         <input type="text" id= "skillTi-form"placeholder="Skill Title" class="frm-input">
                                         <textarea  rows="3" placeholder="Description" class="frm-des" style="display:none"></textarea>
                                         <button id = "update-button"type="button" class="btn btn-success">Save</button>
                                       </div><!--form-field-->

   							 <div class="user-nav">
                                 <div class="tabs tab_hold">

                                   <ul class="nav nav-pills pull-left" >
                                     <li id	=	"mainSkill" class="group-1 active">

                                         <div class="over">
                                         <b class="skillcount" ><i class="fa fa-trash-o"></i>0</b>
                                         <span>Users</span>
                                         </div>

                                         <div class="out">
                                         <b class="skillcount"><i class="fa fa-trash-o"></i>0</b>
                                         <span>Users</span>
                                         </div>

                                     </li>

                                     <li id	=	"overflowSkill" class="group-2">

                                         <div class="over">
                                           <b class="overflowcount"><i class="fa fa-trash-o"></i>0</b>
                                           <span>Users</span>
                                         </div>

                                         <div class="out">
                                           <b class="overflowcount"><i class="fa fa-trash-o"></i>0</b>
                                           <span>Users</span>
                                       </div>
                                     </li>
                                   </ul>
                                 </div><!--tab-hold-->
                             </div><!--user-nav-->

                     <div class="search-user">
                             <!-- <input id="search_box" type="text"  placeholder="Search To Add Agent" class="srh-user" data-toggle="dropdown"  onkeyup='accountManager.search_filter(this,"SkillTable")'>
                             --> 
                              <input id="search_box" type="text"  placeholder="Search To Add Agent" class="srh-user" data-toggle="dropdown"  onkeyup='accountManager.search_filter(this,"SkillTable","table")'>
                             <button id="add-skillToAgent" class="btn-add" data-toggle="modal" data-target="#add-skillToAgentModal">+</button>
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
   			                              <button id="save-AgentSkill" type="button" class="btn btn-success">Save</button>
   			                              <button id="cancel-AgentSkill" type="button" class="btn-close" data-dismiss="modal">Cancel</button>
   			                               <button id="add-skillToAgenthide" type="button" class="btn btn-success" data-dismiss="modal" style="display:None">Save</button>
   			                            </div><!--modal-footer-->
   			                    </div><!--modal-body-->
   			                  </div><!--modal-content-->
   			                </div><!--popup-->  
   			              </div><!--modal-->
                             
                                   <!-- <ul class="dropdown-menu" role="menu">
                                         <li><a href="#"><i class="fa fa-user"></i>hari.selvaraj@a-cti.com</a></li>
                                         <li class="divider"></li>
                                         <li><a href="#"><i class="fa fa-user"></i>hari.selvaraj@a-cti.com</a></li>
                                         <li class="divider"></li>
                                         <li><a href="#"><i class="fa fa-user"></i>hari.selvaraj@a-cti.com</a></li>
                                         <li class="divider"></li>
                                   </ul> -->
                                         <b><i class="fa fa-trash-o"></i></b>
                     </div><!--search-user-->

                       <div class="user-mgment">
                             <table class="table table-hover">
                               <thead>
                                 <tr>
                                   <th><div class="checkbox">
                                   <span><cite></cite></span>
                                   </div></th>
                                   <th>Agent Name</th>
                                   <th>Agent Login</th>
                                   <th>Application To Load</th>
                                   <th>Skill Level</th>
                                   <th></th>
                                 </tr>
                               </thead>
                               <tbody id="SkillTable">
                                 <tr>
                                   <td><b><i class="fa fa-user"></i></b><span><i class="fa fa-trash-o"></i></span></td>
                                   <td>Hari kumar</td>
                                   <td>Harikumar.selvaraj@a-cti.com</td>
                                   <td>http://sampletest.comdssdafsffdsasda</span></td>
                                   <td>Higher</td>
                                   <td>
                                     <ul class="color-icons">
                                       <li><i class="fa fa-square"></i></li>
                                       <li><i class="fa fa-square"></i></li>
                                       <li><i class="fa fa-square"></i></li>
                                     </ul>
                                     </td>
                                 </tr>
                                 
                               </tbody>
                             </table>
                           </div><!--user-mgment-->
                    </div><!--panel4-->
                    
                
                    <h3 class="collapse5" id="dynamicslideractivate">Activate / Deactivate Acount</h3>
                         
                    <div class="panel5" style="display: none">
                                    
                                  <div class="form-field" >
                                  <p id="paraforActivate"> </p>
                                  <button id = "deactivatebutton"type="button" class="btn btn-danger">Deactivate</button>
                                  <button id = "activatebutton"type="button" class="btn btn-success">Activate</button> 
                                  
                                  <div id="messageboxforactivate" style="display:none;">
                                  <div class="panel" id="addclassbox">
                                  <div class ="panel-heading">
                                  <h4 class ="panel-title" id="actboxheading"></h4>
                                 </div>
                                  <div class="panel-body" id="actboxcontent">
                         
                                  </div>
                                  </div> 
                                  </div>
                    </div>
                    
                   
                    </div>
                         
                         
                      </div> <!--wrapper-->
                         
               </article>
               
               

               <article class="service">
                             <h3 class="collapse1">Profile Details</h3>
                       <div class="panel1">
                               <figure>
                                 <img class="logo-img" src="/images/distributed.png">
                               </figure>
                                       <ul class="radio-btn">
                                         <li>
                                           <span><cite></cite></span>
                                           <b><i class="fa fa-comment"></i>Chat Interaction</b>
                                         </li>
                                         <li>
                                           <span><cite></cite></span>
                                           <b><i class="fa fa-bolt"></i>AR Interaction</b>
                                         </li>  
                                       </ul>

                                     <div class="form-field">
                                       <input type="text" placeholder="Profile Title" class="frm-input">
                                       <input type="text" placeholder="Domain Name" class="frm-input">
                                       <textarea  rows="3" placeholder="Description" class="frm-des"></textarea>
                                     </div><!--form-field-->
                       </div><!--panel1-->

                         <h3 class="collapse2">Skill Configuration</h3>
                         <div class="panel2">
                                   <div class="option">

                                    <h4>Default Skill: ettDefault</h4>

                                        <%--  <div class="checkbox">
                                           <span><cite></cite></span>
                                           <b>Overflow</b>
                                         </div> --%>

                                       <div class="color-group">
                                           <button type="button" class="option-drop"  data-toggle="dropdown">Group Color <span class="caret"></span></button>
                                               <ul class="dropdown-menu" role="menu">
                                                 <li><a href="#"><i class="fa fa-square"></i>Red</a></li>
                                                 <li class="divider"></li>
                                                 <li><a href="#"><i class="fa fa-square"></i>Blue</a></li>
                                                 <li class="divider"></li>
                                                 <li><a href="#"><i class="fa fa-square"></i>Green</a></li>
                                                 <li class="divider"></li>
                                               </ul>
                                       </div><!--color-group-->
                                   </div><!--option-->

                                 <div class="form-field">
                                   <input type="text" placeholder="Skill Title" class="frm-input">
                                   <input type="text" placeholder="V2 Skill" class="frm-input">
                                   <textarea  rows="3" placeholder="Description" class="frm-des"></textarea>
                                   <button type="button" class="btn btn-success">Save</button>
                                 </div><!--skill-form-->

                             <div class="user-nav">
                                 <div class="tabs tab_hold">

                                   <ul class="nav nav-pills pull-left" >
                                     <li class="group-1 active">

                                         <div class="over">
                                         <b><i class="fa fa-trash-o"></i>5</b>
                                         <span>Group ab</span>
                                         </div>

                                         <div class="out">
                                         <b><i class="fa fa-trash-o"></i>5</b>
                                         <span>Group ab</span>
                                         </div>

                                     </li>

                                     <li class="group-2">

                                         <div class="over">
                                           <b><i class="fa fa-trash-o"></i>8</b>
                                           <span>Group V2</span>
                                         </div>

                                         <div class="out">
                                           <b><i class="fa fa-trash-o"></i>8</b>
                                           <span>Group V2</span>
                                       </div>
                                     </li>
                                   </ul>
                                 </div><!--tab-hold-->
                             </div><!--user-nav-->

                     <div class="search-user">
                             <input type="text"  placeholder="search To Add Agent" class="srh-user" data-toggle="dropdown">
                                   <ul class="dropdown-menu" role="menu">
                                         <li><a href="#"><i class="fa fa-user"></i>hari.selvaraj@a-cti.com</a></li>
                                         <li class="divider"></li>
                                         <li><a href="#"><i class="fa fa-user"></i>hari.selvaraj@a-cti.com</a></li>
                                         <li class="divider"></li>
                                         <li><a href="#"><i class="fa fa-user"></i>hari.selvaraj@a-cti.com</a></li>
                                         <li class="divider"></li>
                                   </ul>
                                         <b><i class="fa fa-trash-o"></i></b>
                     </div><!--search-user-->

                       <div class="user-mgment">
                             <table class="table table-hover">
                               <thead>
                                 <tr>
                                   <th><div class="checkbox">
                                   <span><cite></cite></span>
                                   </div></th>
                                   <th>Agent Name</th>
                                   <th>Agent Login</th>
                                   <th>Application To Load</th>
                                   <th>Skill Level</th>
                                   <th></th>
                                 </tr>
                               </thead>
                               <tbody>
                                 <tr>
                                   <td><b><i class="fa fa-user"></i></b><span><i class="fa fa-trash-o"></i></span></td>
                                   <td>Hari kumar</td>
                                   <td>Harikumar.selvaraj@a-cti.com</td>
                                   <td>SwitchBoard</span></td>
                                   <td>Higher</td>
                                   <td>
                                     <ul class="color-icons">
                                       <li><i class="fa fa-square"></i></li>
                                       <li><i class="fa fa-square"></i></li>
                                       <li><i class="fa fa-square"></i></li>
                                     </ul>
                                 </tr>
                                 <tr>
                                   <td><b><i class="fa fa-user"></i></b><span><i class="fa fa-trash-o"></i></span></td>
                                   <td>Hari kumar</td>
                                   <td>Harikumar.selvaraj@a-cti.com</td>
                                   <td>SwitchBoard</span></td>
                                   <td>Medium</td>
                                   <td>
                                     <ul class="color-icons">
                                       <li><i class="fa fa-square"></i></li>
                                       <li><i class="fa fa-square"></i></li>
                                       <li><i class="fa fa-square"></i></li>
                                     </ul>
                                   </td>
                                 </tr>
                                 <tr>
                                   <td><b><i class="fa fa-user"></i></b><span><i class="fa fa-trash-o"></i></span></td>
                                   <td>Hari kumar</td>
                                   <td>Harikumar.selvaraj@a-cti.com</td>
                                   <td>SwitchBoard</span></td>
                                   <td>Lower</span></td>
                                   <td>
                                     <ul class="color-icons">
                                       <li><i class="fa fa-square"></i></li>
                                       <li><i class="fa fa-square"></i></li>
                                       <li><i class="fa fa-square"></i></li>
                                     </ul>
                                   </td>
                                 </tr>
                                 <tr>
                                   <td><b><i class="fa fa-user"></i></b><span><i class="fa fa-trash-o"></i></td>
                                   <td>Hari kumar</td>
                                   <td>Harikumar.selvaraj@a-cti.com</td>
                                   <td>SwitchBoard</td>
                                   <td>Middle</td>
                                   <td>
                                     <ul class="color-icons">
                                       <li><i class="fa fa-square"></i></li>
                                       <li><i class="fa fa-square"></i></li>
                                       <li><i class="fa fa-square"></i></li>
                                     </ul>
                                   </td>
                                 </tr>
                                 <tr>
                                   <td></td>
                                   <td></td>
                                   <td></td>
                           		 <td></td> 
                                   <td></td>
                                   <td></td>
                                 </tr>
                               </tbody>
                             </table>
                           </div><!--user-mgment-->
                       </div><!--panel2-->
                    
                    <!--  -->
        <!-- adding new collapsible thing -->
                   
                    <h3 class="collapse5" id="dynamicslideractivate">Activate / Deactivate Acount</h3>
                         
                    <div class="panel5" style="display: none">
                                    
                                  <div class="form-field" >
                                  <p id="paraforActivate"> </p>
                                  <button id = "deactivatebutton"type="button" class="btn btn-danger">Deactivate</button>
                                  <button id = "activatebutton"type="button" class="btn btn-success">Activate</button> 
                                  
                                  <div id="messageboxforactivate" style="display:none;">
                                  <div class="panel" id="addclassbox">
                                  <div class ="panel-heading">
                                  <h4 class ="panel-title" id="actboxheading"></h4>
                                 </div>
                                  <div class="panel-body" id="actboxcontent">
                                 
                                  </div>
                                  </div> 
                                  </div>
                    </div>
                    
                   
                    </div>
                    
         <!-- new collapsible thing ends here -->           
                   
                    
                   
                    
       
                    <!--  -->
           
               </article><!--service-->

               <article class="trello-sales">
                               <h3 class="collapse1">Profile Details</h3>
                         <div class="panel1">
                             <figure>
                               <img class="logo-img" src="/images/trello-logo.png">
                             </figure>
                             <div class="form-field">
                               <input type="text" placeholder="SalesFlow" class="frm-input">
                               <input type="text" placeholder="Domain Name" class="frm-input">
                               <textarea  rows="3" placeholder="Description" class="frm-des"></textarea>
                             </div><!--form-field-->
                         </div>

                               <h3 class="collapse2">Trello Board Setup</h3>
                               <div id="con-wrap-btm" class="panel2">

                                   <div class="btm-lft">
                                             <h6> Trello Board Lists</h6>
                                                 <ul class="checklist">
                                                       <li><span><cite></cite></span><b>Solestruck</b></li>
                                                       <li><span><cite></cite></span><b>48 Site</b></li>
                                                       <li><span><cite></cite></span><b>Online Client Access</b></li>
                                                       <li><span><cite></cite></span><b>AnswerF4</b></li>
                                                 </ul>
                                   </div><!--btm-lft-->

                                   <div class="btm-rgt">
                                           <h6>Share Board</h6>

                                       <div class="control-group">
                                           <p>Share Users to</p>
                                               <ul class="auto-gen">
                                                 
                                               </ul>

                                                   <div class="mail-holder">
                                                       <ul class="multi-input">
                                                         <li class="temp-value"><input type="text" placeholder="Email" class="mail-input"/></li>
                                                       </ul>
                                                     <div class="button-holder">
                                                      <button type="button" class="btn btn-success">Share Users</button>
                                                      <button type="button" class="btn-cancel">Cancel</button>
                                                     </div>
                                                   </div><!--mail-holder-->

                                       </div><!--control-group-->
                                   </div><!--btm-rgt-->
                               </div><!--con-wrap-btm-->
               </article><!--trello-sales-->

        </section>
      </div><!--wrapper-->

      <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div class="modal-dialog popup">
                  <div class="modal-content">
                    <div class="modal-header">
                      <button id="close-model" type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="myModalLabel">Profile Detials<span id= "popup-subacc" style="font-size: 16px; margin-left: 9px;"></span></h4>
				</div><!--modal-header-->
                    <div class="modal-body">
                        <!-- <div class="dropdown trello-group"> -->
                        <div class="color-group" >
                          <button id="model-campagin-val"type="button" class="drop-1"  data-toggle="dropdown"  style ="margin-left: -29px;">Campagin <span class="caret"></span></button>
                             <ul class="dropdown-menu" role="menu">
                                              <li onclick="fillDrop('model-campagin-val','Email Response')"><a href="#"><i class="fa fa-square activeAR"></i>Email Response</a></li>
                                              <li class="divider"></li>
                                              <li onclick="fillDrop('model-campagin-val','Email Outbound')"><a href="#"><i class="fa fa-square activeAR"></i>Email Outbound</a></li>
                                              <li class="divider"></li>
                                              <li onclick="fillDrop('model-campagin-val','Click to Talk')"><a href="#"><i class="fa fa-square activechat"></i>Click to Talk</a></li>
                                              <li class="divider"></li>
                                              <li onclick="fillDrop('model-campagin-val','Calllist Outbound')"><a href="#"><i class="fa fa-square activechat"></i>Calllist Outbound</a></li>                   
                                              <li class="divider"></li>
                                              <li onclick="fillDrop('model-campagin-val','Task Router')"><a href="#"><i class="fa fa-square activechat"></i>Task Router</a></li>                   
                                              <li class="divider"></li>
                                              <li onclick="fillDrop('model-campagin-val','V2 Work Items')"><a href="#"><i class="fa fa-square activechat"></i>V2 Work Items</a></li>                   
                                            </ul>
                             </div>
                     <!--    </div>trello-group -->
                     <br><br>
                            <div class="popup-radio">
                              <ul class="radio-btn">
                                      <li id = "model-chat-Id">
                                        <span id="popup_chat_rad"><cite></cite></span>
                                        <b><i class="fa fa-comment"></i>Chat Interaction</b>
                                      </li>
                                      <li id = "model-ar-Id">
                                        <span id="popup_ar_rad"><cite></cite></span>
                                        <b><i class="fa fa-bolt"></i>AR Interaction</b>
                                      </li>  
                                    </ul>
                            </div><!--popup-radio-->
                            <div class="popup-middle">
                              <input id = "model-accountNo" type="text" placeholder="Account Number/UniquePin" class="tle-input">
                              <input id = "model-domainName" type="text" placeholder="Domain Name" class="tle-input">
                            </div><!--popup-middle-->
                            <ul>
                              <li class="popup-divider"></li>
                            </ul>
                            <div class="modal-footer">
                              <button id="model-save" type="button" class="btn btn-success">Save</button>
                              <button id="model-cancel" type="button" class="btn-close" data-dismiss="modal">Cancel</button>
                            </div><!--modal-footer-->
                    </div><!--modal-body-->
                  </div><!--modal-content-->
                </div><!--popup-->  
              </div><!--modal-->
<button class="btn-add" data-toggle="modal" id="modalconfirm" data-target="#conformModal" style="display:none">+</button>
      <div class="modal fade" id="conformModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div class="modal-dialog popup">
                  <div class="modal-content">
                    <div class="modal-header">
                      <button id="close-modelconfirm" type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      <h4 class="modal-title" id="myModalLabel">Warning!</h4>
                    </div><!--modal-header-->
                    <div class="modal-body">
                    <div>
                    <h3>Are you sure  to proceed?Any unsaved changes will not be saved!!</h3>
                    </div>
                            <div class="modal-footer">
                              <button id="model-confirm_proceed" type="button" class="btn btn-success" data-dismiss="modal">Proceed</button>
                              <button id="model-confirm_cancel" type="button" class="btn-close" data-dismiss="modal">Cancel</button>
                            </div><!--modal-footer-->
                    </div><!--modal-body-->
                  </div><!--modal-content-->
                </div><!--popup-->  
              </div><!--modal-->
              <!-- Delete skill agent confirmation-->
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
                   <h3 id="modal_comform_message" style=" margin-top: 0px;">Are you sure you want to remove</h3>
                    </div>
                            <div class="modal-footer">
                              <button type="button" class="btn btn-success model-confirm_delete" onclick="accountManager.callToUpdateAgentSkill(this)" data-dismiss="modal">Delete</button>
                              <button type="button" class="btn-close" data-dismiss="modal"  onclick="accountManager.removeIdOfDelete(this)" >Cancel</button>
                            </div><!--modal-footer-->
                    </div><!--modal-body-->
                  </div><!--modal-content-->
                </div><!--popup-->  
              </div><!--modal-->           
    <script type="text/javascript" src="/js/jquery-1.10.2.min.js"></script>
    <script type="text/javascript" src="/js/MessageWindow.js"></script>
    <script type="text/javascript" src="/js/bootstrap.js"></script>
    <script type="text/javascript" src="/js/jquery.tablesorter.js"></script>
    <script type="text/javascript" src="../js/Library/moment-with-locales.js"></script>
    <script type="text/javascript" src="/js/Library/bootstrap-select.js"></script>
    <script type="text/javascript" src="/js/Library/bootstrap-datetimepicker.min.js"></script>
     <script type="text/javascript" src="/js/action2.js"></script>
    <script type="text/javascript" src="/js/action4accountmanager.js"></script>
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
    
    $('.excludeDaysPicker').selectpicker();
    $('.exceptionalDaysPicker').selectpicker();
    
    $('.timezone').selectpicker();
    
    $('#startTimePicker,#stopTimePicker,#triggerTimePicker,#exceptionalDayStartTimePicker,#exceptionalDayStopTimePicker').datetimepicker({
    		format : 'LT',
    });
    
    $('#startTimePicker').data("DateTimePicker").minDate(moment({h:0}));
    $('#startTimePicker').data("DateTimePicker").maxDate(moment({h:24}));
    
    $('#stopTimePicker').data("DateTimePicker").minDate(moment({h:0}));
    $('#stopTimePicker').data("DateTimePicker").maxDate(moment({h:24}));
    
    $('#triggerTimePicker').data("DateTimePicker").minDate(moment({h:0}));
    $('#triggerTimePicker').data("DateTimePicker").maxDate(moment({h:23, m:59}));
    
    $('#exceptionalDayStartTimePicker').data("DateTimePicker").minDate(moment({h:0}));
    $('#exceptionalDayStartTimePicker').data("DateTimePicker").maxDate(moment({h:24}));
    
    $('#exceptionalDayStopTimePicker').data("DateTimePicker").minDate(moment({h:0}));
    $('#exceptionalDayStopTimePicker').data("DateTimePicker").maxDate(moment({h:24}));
    
  </script>
<!-- End LoopTodo Feedback Form Code -->
<div id="deleting_status"class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
   
    <div class="modal-dialog modal-lg">
    
       <div id="dynamicModalstartdiv">
      
       </div>
    </div>
  </div>
    </body>
  </html>