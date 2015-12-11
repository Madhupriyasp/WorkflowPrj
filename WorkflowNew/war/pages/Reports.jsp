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
<html>

<head>
	<title>Reports - Workflow</title>

	<!-- CSS -->

	<!-- Library CSS -->
	<link rel="stylesheet" type="text/css" href="../css/Library/font-awesome.css">
	<link rel="stylesheet" type="text/css" href="../css/Library/Bootstrap.css" ></link>
	<link rel="stylesheet" type="text/css" href="../css/Library/Bootstrap-DatePicker.css" ></link>
	<link rel="stylesheet" type="text/css" href="/css/style4accountmanger.css" ></link>
	<!-- Design CSS -->
	<link rel="stylesheet" type="text/css" href="../css/Application/Global.css" ></link>	
	<link rel="stylesheet" type="text/css" href="../css/Application/Report/Report.css" ></link>
	<link rel="stylesheet" type="text/css" href="../css/Application/Report/InteractionDetailsReports.css">

<link rel="stylesheet" type="text/css" href="css/style_new2.css">
	<!-- Scripts -->

	<!-- Library Scripts -->
	<script type="text/javascript" src="../js/Library/JQuery-v1.10.2.js"></script>
	<script type="text/javascript" src="../js/Library/Underscore-1.5.2.js"></script>
	<script type="text/javascript" src="../js/Library/Backbone-1.1.0.js"></script>
	<script type="text/javascript" src="../js/Library/Bootstrap-Tooltip.js"></script>
	<script type="text/javascript" src="../js/bootstrap.js"></script>
	<script type="text/javascript" src="../js/Library/Bootstrap-PopOver.js"></script>
	<script type="text/javascript" src="../js/Library/Bootstrap.js"></script>
	<script type="text/javascript" src="../js/Library/Bootstrap-ClickOver.js"></script>
	<script type="text/javascript" src="../js/Library/soyutils.js"></script>
	<script type="text/javascript" src="../js/Library/Moment.js"></script>
	<script type="text/javascript" src="../js/Library/Moment-TimeZone.js"></script>
	<!-- <script type="text/javascript" src="../js/Library/Moment-TimeZone-Data.js"></script> -->
	<script type="text/javascript" src="../js/Library/JQueryFloatThread-v1.2.7.js"></script>
	<script type="text/javascript" src="../js/Library/Bootstrap-DatePicker.js"></script>
	<script type="text/javascript" src="../js/Library/XmlStr2Json.js"></script>

	<!-- Functional Scripts -->
	<script type="text/javascript" src="../js/MessageWindow.js"></script>
	<script type="text/javascript" src="../js/ZeroClipboard.js"></script>
	
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
		mode = '${mode}';
		isMainAccountNumber = true;
		isLoaded = false;
		fetchedContactCount = {};
		var timezone   =	'${Timezone}';
	</script>





	<!-- Helper Scripts -->
	<script type="text/javascript" src="../js/Application/Reports/Helper/Helper.js"></script>
	<script type="text/javascript" src="../js/dataAppender.js"></script>
	<script type="text/javascript" src="../js/helper.js"></script>
	
	<!-- Design Scripts -->
	<script type="text/javascript" src="../js/action4accountmanager.js"></script>
	<!-- <script type="text/javascript" src="../js/Application/Reports/Design.js"></script> -->

	<!-- View Templates -->
	<script type="text/javascript" src="../js/Application/Reports/ViewTemplates/ReportsViewTemplate.js"></script>	

	<!-- Backbone Scripts -->
	<script type="text/javascript" src="../js/Application/Reports/Backbone/BackboneData.js"></script>

	<!-- Backbone Model Scripts -->
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Models/SubAccountModel.js"></script>
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Models/TranscriptModel.js"></script>
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Models/ContactModel.js"></script>

	<!-- Backbone Collection Scripts -->
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Collections/SubAccountCollection.js"></script>
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Collections/TranscriptCollection.js"></script>
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Collections/ContactCollection.js"></script>

	<!-- Backbone View Scripts -->
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Views/AppShellView.js"></script>
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Views/HeaderView.js"></script>
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Views/MainContainerView.js"></script>
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Views/ToolbarView.js"></script>
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Views/MemberListShellView.js"></script>
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Views/MemberCardView.js"></script>
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Views/TeamPaneShellView.js"></script>
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Views/TeamCardView.js"></script>
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Views/TranscriptListShellView.js"></script>
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Views/TranscriptCardView.js"></script>
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Views/TranscriptDetailsShellView.js"></script>
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Views/TranscriptModalBodyShell.js"></script>
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Views/TranscriptDetailsToolbarView.js"></script>
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Views/TranscriptModalDetailsView.js"></script>
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Views/TranscriptHistoryDetailsView.js"></script>
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Views/TranscriptFullDetailsView.js"></script>
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Views/TranscriptFullDetailsMailView.js"></script>
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Views/TranscriptFullDetailsChatView.js"></script>

	<!-- Backbone Router Scripts -->
	<script type="text/javascript" src="../js/Application/Reports/Backbone/Routers/ReportsRouter.js"></script>

</head>

<body>

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

	<!-- Main Wrapper Starts -->
	<div id="main-wrapper" class="wrapper row">

	</div>
	<!-- Main Wrapper Ends -->

</body>

</html>