// This file was automatically generated from ReportsViewTemplate.soy.
// Please don't edit this file by hand.

if (typeof acti == 'undefined') { var acti = {}; }
if (typeof acti.workflow == 'undefined') { acti.workflow = {}; }
if (typeof acti.workflow.reports == 'undefined') { acti.workflow.reports = {}; }


acti.workflow.reports.appShell = function(opt_data, opt_ignored) {
  return '\t\t<!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><!-- Workflow Shell View Starts --><div id="shell-view" class=""><!-- Header Wrapper Starts --><div id="header-wrapper"></div><!-- Header Wrapper Ends --><!-- Main Container Wrapper Starts --><div id="main-container-wrapper" class="main-container-wrapper"></div><!-- Main Container Wrapper Ends --></div><!-- Workflow Shell View Ends -->';
};


acti.workflow.reports.header = function(opt_data, opt_ignored) {
  return '\t\t\t<!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><!-- Header Starts --><nav id="header" class="navbar navbar-inverse" role="navigation"><div class="container-fluid"><div class="navbar-header pull-left"><button class="navbar-toggle collapsed pull-left" data-toggle="collapse" data-target=".navbar-collapse"><span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span></button><a href="#" class="navbar-brand">Workflow Management</a></div><ul class="nav nav-pills pull-right fetch_log"><li><a id="hide-fetch" href="javascript:void(0)">Fetch&nbsp;&nbsp;&nbsp;|</a><div class="popover bottom" id="fetchdtl"><div class="arrow"></div><div class="popover-content"><input id="fetchinbox" type="text" placeholder="Enter 8xx / 1xx / Skill" class="fch_input"><a id="fetch" class="btn btn-success btn-fch">Fetch</a></div></div><div class="popover bottom" id="selectType"><div class="arrow"></div><div class="popover-content"><a>Fetch By</a><select><option>Select</option></select></div></div></li><li class="sign pull-right"><div class="full_dtl"><img src="/images/user-icon.jpg" onerror=\'this.src = "/images/user-icon.jpg"\'></div><div class="popover bottom" id="log_dtl"><div class="arrow"></div><!-- <h3 class="popover-title">Popover bottom</h3> --><div class="popover-content"><div class="userimg pull-left"><img src="' + soy.$$escapeHtml(opt_data.attributes.photoURL) + '" onerror=\'this.src = "/images/user-icon.jpg"\' ></div><div class="userdtl pull-left"><h5 style="text-transform: lowercase;">' + soy.$$escapeHtml(opt_data.attributes.currentUser) + '</h5><span></span></div></div><div class="clearfix"></div><div class="sign_foot"><a class="btn btn-default pull-right" onclick="deleteCookie( \'' + soy.$$escapeHtml(opt_data.attributes.currentUser) + '\' )">Sign Out</a></div></div></div></li></ul><div class="navbar-collapse collapse"><ul class="nav navbar-nav"><li id="manageli"><a id="manage" href="/adminqueuegae">Manage Queue</a></li><li><a id="tools" href="/emaillistener">Tools</a></li><li id="internalli"><a href="/adminqueuegae?internalacc=true&fetch=false" id="internalAction" style="cursor: pointer;">Internal Accounts</a></li><li><a href="/toolsmanager">Account Manager</a></li><li class= "active"><a href="/reports">Reports</a></li><!-- <li><a href="#">report</a></li> --></ul><!--nav nav-pills--></div></div></nav><!-- Header Ends -->';
};


acti.workflow.reports.mainContainer = function(opt_data, opt_ignored) {
  return '<!-- Main Container Starts --><!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><div id="main-container" class="main-container row"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><div class="row"><!-- Team Pane Wrapper Starts --><div id="team-pane-wrapper" class="col-lg-2 col-md-2 col-sm-2 col-xs-2 zero-padding"></div><!-- Team Pane Wrapper Ends --><div id="team-desc-pane-wrapper" class="right-pane col-lg-10 col-md-10 col-sm-10 col-xs-10 zero-padding "><!-- Toolbar Wrapper Starts --><div id="toolbar-wrapper"></div><!-- Toolbar Wrapper Ends --><!-- Members List Wrapper Starts --><div id="member-list-wrapper" class="member-list-wrapper team-desc-pane"></div><!-- Members List Wrapper Starts --><div id="popover-container"></div><!-- Transcripts List Wrapper Starts --><div id="transcripts-list-wrapper" class="transcripts-list-wrapper"></div><!-- Transcripts List Wrapper Starts --><!-- Interaction Details Starts --><!--<div class="interaction-details-pane col-lg-9 col-md-9 col-sm-9 col-xs-9 zero-padding "></div>--><!-- Interaction Details Ends --><!-- Transcripts Details Wrapper Starts --><div id="transcript-details-wrapper" class="transcript-details-wrapper"></div><!-- Transcripts Details Wrapper Starts --><!-- Team Pane Flap Starts --><div id="team-pane-toggle-flap" class="team-pane-toggle-flap"><a id="team-pane-toggle-flap-a" class="team-pane-toggle-flap-a" href="javascript:void(0);" value="opened"><i id="team-pane-toggle-flap-i" class="team-pane-toggle-flap-i fa fa-chevron-left"></i></a></div><!-- Team Pane Flap Ends --></div></div></div></div><!-- Main Container Ends -->';
};


acti.workflow.reports.teamPaneShell = function(opt_data, opt_ignored) {
  return '<!-- Team Pane Shell Starts --><!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><div id="team-pane-shell" class="team-pane row"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><div id="team-pane-header" class="row team-pane-header" style=""><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><div id="main-account-number" class="main-account-number" style="">' + soy.$$escapeHtml(opt_data.attributes.mainAccountNumber) + '</div></div></div><div class="row"><div id="team-list" class="team-list col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><div class="row"><table id="team-table" class="team-table col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><thead></thead><tbody id="team-cards-tbody"></tbody></table></div></div></div></div></div><!-- Team Pane Shell Ends -->';
};


acti.workflow.reports.toolbar = function(opt_data, opt_ignored) {
  return '\t\t\t\t\t\t\t\t\t<!-- Toolbar Starts --><!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><div id="toolbar" class="row"><div class="toolbar col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding "><div class="row"><div class="user-status-circle-div col-lg-1 col-md-1 col-sm-1 col-xs-1 zero-padding"><div class="inner"><svg height="12" width="6"><circle cx="0" cy="6" r="6" stroke="none" stroke-width="3" fill="#AAAAAA"></circle>Sorry, your browser does not support inline SVG.</svg><hr><svg class="user-status-svg" height="20" width="20"><circle cx="10" cy="10" r="8" stroke="#24E024" stroke-width="2" fill="none"></circle>Sorry, your browser does not support inline SVG.</svg></div></div><!--<div class="date-range col-lg-4 col-md-5 col-sm-5 col-xs-5 col-lg-offset-5 col-md-offset-4 col-sm-offset-4 col-xs-offset-4 zero-padding"><div class="row"><input id="from-date" type="text" class="date-picker-input col-lg-5 col-md-5 col-sm-5 col-xs-5 zero-padding"><div class="date-picker-to col-lg-1 col-md-1 col-sm-1 col-xs-1 zero-padding">To</div><input id="to-date" type="text" class="date-picker-input col-lg-5 col-md-5 col-sm-5 col-xs-5 zero-padding"><div class="go-date-range col-lg-1 col-md-1 col-sm-1 col-xs-1 zero-padding"><a id="go-date-range" href="javascript:void(0)" class="btn btn-default">Load</a></div></div></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 zero-padding"><div class="row"><div class="find-player right-inner-addon zero-padding"><i class="fa icon-search"></i><input id="find-player" type="search" class="form-control" placeholder="Search..." /></div></div></div>--><div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 zero-padding col-lg-offset-3 col-md-offset-3 col-sm-offset-3 col-xs-offset-3"><div class="row right-column-toolbar"><!-- Date Range Starts --><div class="date-range col-lg-8 col-md-8 col-sm-8 col-xs-8 zero-padding"><div class="row pull-right"><input id="from-date" type="text" class="date-picker-input col-lg-5 col-md-5 col-sm-5 col-xs-5 zero-padding"><div class="date-picker-to col-lg-1 col-md-1 col-sm-1 col-xs-1 zero-padding">to</div><input id="to-date" type="text" class="date-picker-input col-lg-5 col-md-5 col-sm-5 col-xs-5 zero-padding"><div class="go-date-range col-lg-1 col-md-1 col-sm-1 col-xs-1 zero-padding"><a id="go-date-range" href="javascript:void(0)" class="btn btn-default">Load</a></div></div></div><!-- Date Range Ends --><div class="find-player right-inner-addon col-lg-4 col-md-4 col-sm-4 col-xs-4 zero-padding"><i class="fa fa-search"></i><input id="find-player" type="search" class="form-control" placeholder="Search..." /></div></div></div></div></div></div><!-- Toolbar Ends -->';
};


acti.workflow.reports.teamCard = function(opt_data, opt_ignored) {
  return '<!-- Team Card Starts --><!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><tr id="' + soy.$$escapeHtml(opt_data.attributes.id) + '" class="team-card-tr"><td><div class="team-card"><div class="row"><div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 zero-padding"><div class="row"><div style="background-color: ' + soy.$$escapeHtml(opt_data.attributes.hexColorCode) + ';" class="color-code col-lg-3 col-md-3 col-sm-3 col-xs-3 zero-padding">&nbsp;</div></div></div><div class="team-name text-dot col-lg-11 col-md-11 col-sm-11 col-xs-11 zero-padding">' + soy.$$escapeHtml(opt_data.attributes.teamName) + '</div></div></td></tr><!-- Team Card Ends -->';
};


acti.workflow.reports.memberListShell = function(opt_data, opt_ignored) {
  return '\t\t\t\t\t\t\t\t\t<!-- Members List Shell Starts --><!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><div id="members-list-shell" class="members-list-shell row"><div class="members-pane col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding "><div class="row"><div class="members-table-wrapper col-lg-3 col-md-3 col-sm-3 col-xs-3 zero-padding"><table class="members-table"><thead></thead><!-- Members TBody Starts --><tbody id="members-tbody"></tbody><!-- Members TBody Ends --></table></div><div id="popover-container"></div></div></div><!-- Members List Shell Ends -->';
};


acti.workflow.reports.memberCard = function(opt_data, opt_ignored) {
  return '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<!-- Member Card Row Starts --><!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><tr id="' + soy.$$escapeHtml(opt_data.attributes.id) + '" class="member-card-tr"><td><button class="member-card-button zero-padding" href="javascript:void(0)" rel="popover"><div class="member-card"><div class="row"><div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 zero-padding"><div class="row"><img src="' + soy.$$escapeHtml(opt_data.attributes.agentPhotoURL) + '" class="member-img img-circle col-lg-12 col-md-12 col-sm-12 col-xs-12"></div></div><div class="member-card-details col-lg-8 col-md-8 col-sm-8 col-xs-8 zero-padding"><div class="row"><div class="member-name text-dot col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding">' + soy.$$escapeHtml(opt_data.attributes.agentName) + '</div></div><div class="row"><div class="interaction-total-heading text-dot col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding">Interaction Total :</div></div><div class="row"><div class="interaction-total text-dot col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding">' + soy.$$escapeHtml(opt_data.attributes.interactionTotal) + '</div></div></div></div></div></button><!-- Member Card Row Ends --></tr></td>';
};


acti.workflow.reports.newNewMemberCard = function(opt_data, opt_ignored) {
  return '<!-- Member Card Row Starts --><!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><li id="' + soy.$$escapeHtml(opt_data.attributes.id) + '" class="member-card-li"><button class="member-card-button zero-padding" href="javascript:void(0)" rel="popover"><div class="member-card"><div class="row"><div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 zero-padding"><div class="row"><img src="' + soy.$$escapeHtml(opt_data.attributes.agentPhotoURL) + '" class="member-img img-circle col-lg-12 col-md-12 col-sm-12 col-xs-12"></div></div><div class="member-card-details col-lg-8 col-md-8 col-sm-8 col-xs-8 zero-padding"><div class="row"><div class="member-name text-dot col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding">' + soy.$$escapeHtml(opt_data.attributes.agentName) + '</div></div><div class="row"><table id="member-card-deep-details-table" class="member-card-deep-details-table col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><thead></thead><tbody><tr><td class="key">Total Interaction &nbsp;</td><td id="interaction-total" class="value">' + soy.$$escapeHtml(opt_data.attributes.interactionTotal) + '</td></tr><tr><td class="key">Avg Duration &nbsp;</td><td id="average-duration" class="value">' + soy.$$escapeHtml(opt_data.attributes.averageDuration) + '</td></tr><!--<tr><td class="key">Mean Duration &nbsp;</td><td id="mean-duration" class="value">' + soy.$$escapeHtml(opt_data.attributes.meanDuration) + '</td></tr>--><tbody></table></div></div></div></div></button><!-- Member Card Row Ends --></li><!-- Member Card Row Starts -->';
};


acti.workflow.reports.newNewNewMemberCard = function(opt_data, opt_ignored) {
  return '<!-- Member Card Row Starts --><!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><li id="' + soy.$$escapeHtml(opt_data.attributes.id) + '" class="member-card-li"><button class="member-card-button zero-padding" href="javascript:void(0)" rel="popover"><div class="member-card"><div class="row"><div class="member-name text-dot col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><div class="row"><div class="col-lg-10 col-md-10 col-sm-10 col-xs-10 zero-padding">' + soy.$$escapeHtml(opt_data.attributes.agentName) + '</div><div class="interaction-total col-lg-2 col-md-2 col-sm-2 col-xs-2 zero-padding pull-right">' + soy.$$escapeHtml(opt_data.attributes.interactionTotal) + '</div></div><!-- <span>' + soy.$$escapeHtml(opt_data.attributes.agentName) + '</span><span class="interaction-total">' + soy.$$escapeHtml(opt_data.attributes.interactionTotal) + '</span> --></div></div><div class="row"><div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 zero-padding"><div class="row"><img src="' + soy.$$escapeHtml(opt_data.attributes.agentPhotoURL) + '" onerror=\'this.src = "/images/user-icon.jpg"\' class="member-img img-circle col-lg-12 col-md-12 col-sm-12 col-xs-12"></div></div><div class="member-card-details col-lg-8 col-md-8 col-sm-8 col-xs-8 zero-padding"><div class="row"><table id="member-card-deep-details-table" class="member-card-deep-details-table col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><thead></thead><tbody><!-- <tr><td class="key">Total Interaction &nbsp;</td><td id="interaction-total" class="value">' + soy.$$escapeHtml(opt_data.attributes.interactionTotal) + '</td></tr> --><tr><td class="key">Avg Duration &nbsp;</td><td id="average-duration" class="value">' + soy.$$escapeHtml(opt_data.attributes.averageDuration) + '</td></tr><tr><td class="key">Avg TTA &nbsp;</td><td id="average-tta" class="value">' + soy.$$escapeHtml(opt_data.attributes.averageTTA) + '</td></tr><tr><td class="key">Avg TTC &nbsp;</td><td id="average-ttc" class="value">' + soy.$$escapeHtml(opt_data.attributes.averageTTC) + '</td></tr><tbody></table></div></div></div></div></button><!-- Member Card Row Ends --></li><!-- Member Card Row Starts -->';
};


acti.workflow.reports.interactionPopOverContent = function(opt_data, opt_ignored) {
  var output = '\t\t\t\t<!-- Interaction PopOver Content Starts --><!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><table class="interaction-pop-over-table"><thead><tr><td colspan="2">Account ID</td><td>Completed</td> <!-- <td>In-Queue</td> --> <tr></thead><tbody>';
  var interactionOptionsList100 = opt_data.attributes.interactionsOptionsArray;
  var interactionOptionsListLen100 = interactionOptionsList100.length;
  if (interactionOptionsListLen100 > 0) {
    for (var interactionOptionsIndex100 = 0; interactionOptionsIndex100 < interactionOptionsListLen100; interactionOptionsIndex100++) {
      var interactionOptionsData100 = interactionOptionsList100[interactionOptionsIndex100];
      output += '<tr><td class="color-code"><div style="background-color: ' + soy.$$escapeHtml(interactionOptionsData100.interactionTypeDetails.color) + ';">&nbsp;</div></td><td><div class="interaction-name">' + soy.$$escapeHtml(interactionOptionsData100.interactionTypeDetails.name) + '</div></td><td class="last interaction-count"><div>' + soy.$$escapeHtml(interactionOptionsData100.completedTranscriptLength) + '</div></td> <!-- <td class="last"><div>' + soy.$$escapeHtml(interactionOptionsData100.inqueueTranscriptLength) + '</div></td></tr> -->';
    }
  } else {
    output += '<tr><td class="color-code"><div style="background-color: #000000;">&nbsp;</div></td><td colspan="3"><div>No interaction</div></td></tr>';
  }
  output += '</tbody></table><!-- Interaction PopOver Content Ends -->';
  return output;
};


acti.workflow.reports.newMemberListShell = function(opt_data, opt_ignored) {
  return '\t\t\t\t\t\t\t\t\t<!-- Members List Shell Starts --><!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><div id="members-list-shell" class="members-list-shell row"><div class="members-pane col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding "><div class="row"><div class="member-pane-bar col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><!--<div class="member-all col-lg-1 col-md-1 col-sm-1 col-xs-1 zero-padding"><a id="member-all-a" class="member-all-a btn btn-default">All</a></div>--><div id="member-list-left-scroll-arrow" class="member-list-left-scroll-arrow"><a id="member-pane-left-arrow" class="member-pane-left-arrow" href="javascript:void(0);"><i class="fa fa-caret-left fa-3x" style=""></i></a></div><div id="member-list-right-scroll-arrow" class="member-list-right-scroll-arrow"><a id="member-pane-right-arrow" class="member-pane-right-arrow" href="javascript:void(0);"><i class="fa fa-caret-right fa-3x" style=""></i></a></div><div class="members-ul-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><ul id="members-ul" class="members-ul"></ul></div></div></div></div><!-- Members List Shell Ends -->';
};


acti.workflow.reports.newMemberCard = function(opt_data, opt_ignored) {
  return '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<!-- Member Card Row Starts --><!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><li id="' + soy.$$escapeHtml(opt_data.attributes.id) + '" class="member-card-li"><button class="member-card-button zero-padding" href="javascript:void(0)" rel="popover"><div class="member-card"><div class="row"><div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 zero-padding"><div class="row"><img src="' + soy.$$escapeHtml(opt_data.attributes.agentPhotoURL) + '" onerror=\'this.src = "/images/user-icon.jpg"\'  class="member-img img-circle col-lg-12 col-md-12 col-sm-12 col-xs-12"></div></div><div class="member-card-details col-lg-8 col-md-8 col-sm-8 col-xs-8 zero-padding"><div class="row"><div class="member-name text-dot col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding">' + soy.$$escapeHtml(opt_data.attributes.agentName) + '</div></div><div class="row"><div class="interaction-total-heading text-dot col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding">Total Interaction :</div></div><div class="row"><div class="interaction-total text-dot col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding">' + soy.$$escapeHtml(opt_data.attributes.interactionTotal) + '</div></div></div></div></div></button><!-- Member Card Row Ends --></li>';
};


acti.workflow.reports.transcriptListShell = function(opt_data, opt_ignored) {
  return '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<!-- Transcript List Shell Starts --><!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><div id="transcript-list-shell" class="transcript-list-shell"><div class="row"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><!-- Transcript Toolbar Starts --><div class="row"><div id="transcript-toolbar" class="transcript-toolbar col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"></div></div><!-- Transcript Toolbar Ends --><!-- Transcript List Div Starts --><div class="row"><div id="transcript-table-wrapper" class="transcript-table-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><table id="transcript-table" class="transcript-table table table-hover" ><thead><tr><th class="acc_wdt"></th><th><a id="sort-by-account-id">Account ID</a></th><th><a id="sort-by-account-name">Account Name</a></th><th><a id="sort-by-recieved-by">Recieved By</a></th><th><a id="sort-by-status">Status</a></th><th><a id="sort-by-recieved">Recieved<span>' + soy.$$escapeHtml(opt_data.attributes.timeZone) + '</span></a></th><th><a id="sort-by-completed">Completed<span>' + soy.$$escapeHtml(opt_data.attributes.timeZone) + '</span></a></th><th><a id="sort-by-tta">TTA</a></th><th><a id="sort-by-duration">Duration</a></th><th><a id="sort-by-ttc">TTC</a></th></tr></thead><tbody id="transcript-table-tbody" class="transcript-table-tbody"></tbody></table></div></div><!-- Transcript List Div Ends --></div></div></div><!-- Transcript List Shell Ends -->';
};


acti.workflow.reports.transcriptCard = function(opt_data, opt_ignored) {
	  return '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<!-- Transcript List Shell Starts --><!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><tr id="' + soy.$$escapeHtml(opt_data.attributes.id) + '" class="transcript-card-tr">' + ((opt_data.attributes.multiConId) ? '<td class="acc_wdt multi_conID"></td>' : '<td class="acc_wdt"></td>') + '<td>' + soy.$$escapeHtml(opt_data.attributes.subAccountNumber) + '</td><td>' + soy.$$escapeHtml(opt_data.attributes.subAccountName) + '</td><td>' + soy.$$escapeHtml(opt_data.attributes.agentLogin) + '</td><td><span style="background-color: ' + soy.$$escapeHtml(opt_data.attributes.statusColor) + ';" class="label label-success">' + soy.$$escapeHtml(opt_data.attributes.status) + '</span></td><td>' + soy.$$escapeHtml(opt_data.attributes.recievedTime) + '</td><td>' + soy.$$escapeHtml(opt_data.attributes.completedTime) + '</td><td>' + soy.$$escapeHtml(opt_data.attributes.timeTakenToAnswer) + '</td><td>' + soy.$$escapeHtml(opt_data.attributes.duration) + '</td><td>' + soy.$$escapeHtml(opt_data.attributes.timeTakenToComplete) + '</td></tr><!-- Transcript List Shell Ends -->';
};


acti.workflow.reports.newTeamPaneShell = function(opt_data, opt_ignored) {
  return '\t\t\t\t\t\t\t\t<!-- Team Pane Shell Starts --><!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><div id="team-pane-shell" class="team-pane row"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><!--<div id="team-pane-header" class="row team-pane-header" style=""><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><div id="main-account-number" class="main-account-number" style="">' + soy.$$escapeHtml(opt_data.attributes.mainAccountNumber) + '</div></div></div>--><div id="team-pane-header" class="row team-pane-header" style=""><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><div class="row"><div class="team-pane-heading col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding">Workflow Account</div></div><div class="row"><div class="search-team col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><input type="search" id="search-team-input" placeholder="Search..."/></div></div></div></div><div class="row"><div id="team-list" class="team-list col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><div class="row"><table id="team-table" class="team-table col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><thead></thead><tbody id="team-cards-tbody"></tbody></table></div></div></div></div></div><!-- Team Pane Shell Ends -->';
};


acti.workflow.reports.newTeamCard = function(opt_data, opt_ignored) {
  return '<!-- Team Card Starts --><!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><tr id="' + soy.$$escapeHtml(opt_data.attributes.id) + '" class="team-card-tr-new"><td class="team-card-td-new"><div id="' + soy.$$escapeHtml(opt_data.attributes.id) + '" class="team-card-new row"><table class="team-card-inner-table col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><tbody><tr><td class="color-code-td" style="background-color: ' + soy.$$escapeHtml(opt_data.attributes.hexColorCode) + ';" rowspan="2"></td><td class="account-type-td" rowspan="2"><i  id="account-type-icon" class="account-type-icon fa ' + soy.$$escapeHtml(opt_data.attributes.accountTypeIcon) + '"></i></td><td class="domain-name-td"><div class="domain-name text-dot">' + ((opt_data.attributes.domainName) ? soy.$$escapeHtml(opt_data.attributes.domainName) : '&nbsp;') + '</div></td></tr><tr><td class="account-number-td"><div class="account-number text-dot">' + ((opt_data.attributes.accountNumber) ? soy.$$escapeHtml(opt_data.attributes.accountNumber) : '&nbsp;') + '</div></td></tr></tbody></table></div></td></tr><!-- Team Card Ends -->';
};


acti.workflow.reports.transcriptDetailsShell = function(opt_data, opt_ignored) {
  return '\t<!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><div id="transcript-details-shell" class="transcript-details-shell modal fade" id="detail_listing" aria-hidden="false"><div class="modal-dialog" style="width: 965px; z-index:900;"><div class="modal-content" style="height: 472px;"><div class="modal-header"><button id="closemodel" type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button><h4 class="modal-title">Interaction Details</h4></div><div id="transcript-modal-body-wrapper" class="transcript-modal-body-wrapper modal-body"><!-- Transcript Modal Body --></div><div class="modal-footer"><p style="text-align: center;">Powered by Workflow  </p></div></div><!-- /.modal-content --></div><!-- /.modal-dialog --><div id="reshcedule_modal_pop" class="popover fade right in" style="top: 30px; left: 300px; display: none; z-index: 900; height: 250px;"><div class="arrow" style="top: 44px!important;"></div><h3 class="popover-title">Reschedule</h3><div class="popover-content"><table style=""><tbody><tr><td style="padding-bottom: 10px;padding-top: 10px;"><div class="input-group date col-sm-4"><span class="input-group-addon"><i class="fa fa-calendar"></i></span><input type="text" class="form-control reschedule_date_picker" id="reschedule_date_modal" data-date-format="mm/dd/yyyy" style="width:150px" required=""></div></td></tr><tr><td style="padding-bottom: 10px;"><div class="input-group col-sm-4 bootstrap-timepicker"><span class="input-group-addon"><i class="fa fa-clock-o"></i></span><input type="text" class="form-control timepicker" id="reschedule_time_modal" value="11:30 PM" style="width:150px" required=""></div></td></tr><tr><td style="padding-bottom: 15px;"><div class="input-group col-sm-4 bootstrap-timepicker"><span class="input-group-addon"><i class="fa fa-globe"></i></span><input type="text" class="form-control timezone_value" id="timezone_value_modal" value="PST" style="width:150px"></div></td></tr><tr><td align="center"><button onclick="intractionToSche(\'single\')" type="button" id="Selected" class="btn btn-default" style="background-color: #f7f7f7!important;">Reschedule</button></td></tr></tbody></table></div></div></div>';
};


acti.workflow.reports.transcriptModalBodyShell = function(opt_data, opt_ignored) {
  return '<!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><!-- Transcript Modal Body Shell Starts --><div id="transcript-modal-body-shell" class="transcript-modal-body-shell"><div class="transcript-toolbar-wrapper"><!-- Transcript Toolbar Wrapper --></div><div class="clearfix"></div><div id="transcript-modal-details-wrapper" class="transcript-details-wrapper accounts"><!-- Transcript Details --></div><div id="transcript-history-details-wrapper" class="transcript-history-details-wrapper status"><!-- Transcript History Details --></div><div id="transcript-full-details-wrapper" class="transcript-full-details-wrapper status_dtl"><!-- Transcript Full Details --></div></div><!-- Transcript Modal Body Shell Ends -->';
};


acti.workflow.reports.transcriptModalDetails = function(opt_data, opt_ignored) {
  return '\t\t\t<!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><!-- Transcript Details Starts --><div id="transcript-modal-details" class="transcript-modal-details"><table class="table pull-left"><tbody><tr><td class="title">Account ID:</td><td class="text" id="accountId"><a href="/toolsmanager?accno=' + soy.$$escapeHtml(opt_data.attributes.subAccountNumber) + '" target="_blank" id="subAccCache">' + soy.$$escapeHtml(opt_data.attributes.subAccountNumber) + '</a></td></tr><tr><td class="title">Recieved By:</td><td class="text" id="accountLogin">' + soy.$$escapeHtml(opt_data.attributes.agentName) + '</td></tr><tr><td class="title">Status:</td><td class="text" id="statusId">' + soy.$$escapeHtml(opt_data.attributes.status) + '</td></tr></tbody></table><div class="details"><table class="table pull-left"><tbody><tr><td class="title">Recieved:</td><td class="text" id="dateAdded">' + soy.$$escapeHtml(opt_data.attributes.recievedTime) + '&nbsp;<span>' + soy.$$escapeHtml(opt_data.attributes.timeZone) + '</span></td></tr><tr><td class="title">Completed:</td><td class="text" id="DateCompleted">' + soy.$$escapeHtml(opt_data.attributes.completedTime) + '&nbsp;<span>' + soy.$$escapeHtml(opt_data.attributes.timeZone) + '</span></td><td style="display:none" class="text" id="decrem_increm">trid_84944514-aa40-42dc-8275-1ffdac98cd2e_history</td></tr><tr><td class="title" id="answerTime"><span id="ttapop" data-toggle="tooltip" title="" data-placement="top" data-original-title="Time To Answer">TTA:</span></td><td class="text" id="ansTime">' + soy.$$escapeHtml(opt_data.attributes.timeTakenToAnswer) + '</td></tr><tr><td class="title">Duration</td><td class="text" id="timeSpent">' + soy.$$escapeHtml(opt_data.attributes.duration) + '</td></tr></tbody></table></div><!-- Transcript Details Ends -->';
};


acti.workflow.reports.transcriptHistoryList = function(opt_data, opt_ignored) {
	  var output = '<!-- Transcript History List Starts --><!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><div id="transcript-history-details" class="transcript-history-details"><div class="row"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><div class="row"><table id="transcript-history-details-table" class="transcript-history-details-table table table-hover col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding" ><thead><tr><th>Date and Time</th><th>Connection ID</th><th>Status</th><th>Recieved By</th>' + ((opt_data.attributes.hasPhone) ? '<th id=\'phno_head\' class=\'due_wd\'>Phone</th><th id=\'obHead\' class=\'obID\' style=\'visiblity:hidden\'></th>' : '') + '</tr></thead><tbody id="transcript-table-tbody" class="transcript-table-tbody">';
	  var interactionHistoryList192 = opt_data.attributes.interactionHistories;
	  var interactionHistoryListLen192 = interactionHistoryList192.length;
	  if (interactionHistoryListLen192 > 0) {
	    for (var interactionHistoryIndex192 = 0; interactionHistoryIndex192 < interactionHistoryListLen192; interactionHistoryIndex192++) {
	      var interactionHistoryData192 = interactionHistoryList192[interactionHistoryIndex192];
	      output += '<tr><td>' + soy.$$escapeHtml(interactionHistoryData192.dateString) + '</td><td>' + soy.$$escapeHtml(interactionHistoryData192.connectionId) + '</td><td>' + soy.$$escapeHtml(interactionHistoryData192.action) + '</td><td>' + soy.$$escapeHtml(interactionHistoryData192.AgentLogin) + '</td>' + ((! ! interactionHistoryData192.phoneNumber) ? (interactionHistoryData192.outboundConnectionID == 'NA' && interactionHistoryData192.phoneNumber == 'NA') ? '<td class=\'due_wd\' title=\'NA\'>' + soy.$$escapeHtml(interactionHistoryData192.phoneNumber) + '</td><td class=\'obID\'><div id=\'d_clip_button\' class=\'clip_button fa fa-files-o\' data-clipboard-text=\'NA\' title=\'Click to copy.\' style=\'float: right;cursor: pointer;margin-top:1px;visibility:hidden\'></div></td>' : '<td class=\'due_wd\' title=\'' + soy.$$escapeHtml(interactionHistoryData192.outboundConnectionID) + '\'>' + soy.$$escapeHtml(interactionHistoryData192.phoneNumber) + '</td><td class=\'obID\'><div id=\'d_clip_button\' class=\'clip_button fa fa-files-o\' data-clipboard-text=\'' + soy.$$escapeHtml(interactionHistoryData192.outboundConnectionID) + '\' title=\'Click to copy.\' style=\'float: right;cursor: pointer;margin-top:1px;\'></div></td>' : '') + '</tr>';
	    }
	  } else {
	    output += '<td colspan="4">No History</td>';
	  }
	  output += '</tbody></table></div></div></div></div><!-- Transcript History List Ends -->';
	  return output;
};


acti.workflow.reports.transcriptDetailsToolbar = function(opt_data, opt_ignored) {
  return '\t\t<!-- Transcript Toolbar Starts --><!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><div id="transcript-details-toolbar" class="transcript-details-toolbar page-icon"><div class=""><div id="transcript-options-div" class="transcript-options pg_opt"><a id="reshedule-transcript" href="javascript:void(0);"><i id="reschedule_modal" class="fa fa-retweet" data-toggle="tooltip" title="" data-original-title="Reschedule"></i></a><a id="delete-transcript" href="javascript:void(0);"><i class="fa fa-trash-o" data-toggle="tooltip" title="" data-original-title="Delete"></i></a><a id="mark-completed-transcript" href="javascript:void(0);"><i class="fa fa-check" data-toggle="tooltip" title="" data-original-title="Mark Completed"></i></a></div></div><div id="transcript-details-toggle-div" class="transcript-view-toggle order_opt"><div class="sort_arrow pull-right"><a id="next-transcript" href="javascript:void(0);"><i class="fa fa-chevron-left"></i></a><a id="prev-transcript" href="javascript:void(0);"><i class="fa fa-chevron-right"></i></a></div><div  id="transcript-navigate-div" class="transcript-navigate-div pgshow_opt pull-right"><a id="message-view" href="javascript:void(0);" class=""><i class="fa fa-envelope" data-toggle="tooltip" title="Mail View" data-original-title="Mail View"></i></a><a id="table-view" href="javascript:void(0);" class=""><i class="fa fa-table" data-toggle="tooltip" title="Table View" data-original-title="Table View"></i></a></div></div></div><!-- Transcript Toolbar Ends -->';
};


acti.workflow.reports.transcriptFullDetail = function(opt_data, opt_ignored) {
	  var output = '\t\t\t<!-- Transcript Full Detail Starts --><!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><div id="transcript-full-details" class="transcript-full-details"><div class="row"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><div class="row"><table id="transcript-full-details-table" class="transcript-full-details-table col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding" ><thead><tr id="transcript-details-domain-name-tr" class="transcript-details-domain-name-tr"><th colspan="2">' + soy.$$escapeHtml(opt_data.attributes.messageDetails.domainName) + '</th></tr><tr id="from-to-details-tr" class="from-to-details-tr"><th colspan="2"><table id="transcript-full-details-user-details" class="transcript-full-details-user-details"><tr><td rowspan="2"> <img src="' + soy.$$escapeHtml(opt_data.attributes.messageDetails.userImage) + '" id="transcript-full-details-img" class="transcript-full-details-img"/> </td><td>' + soy.$$escapeHtml(opt_data.attributes.messageDetails.from) + '</td></tr></table></th></tr></thead><tbody id="transcript-full-details-tbody" class="transcript-full-details-tbody">';
	  var messageList210 = opt_data.attributes.messages;
	  var messageListLen210 = messageList210.length;
	  if (messageListLen210 > 0) {
	    for (var messageIndex210 = 0; messageIndex210 < messageListLen210; messageIndex210++) {
	      var messageData210 = messageList210[messageIndex210];
	      output += '<tr><th>' + soy.$$escapeHtml(messageData210.key) + '</th>' + ((messageData210.key == 'uniquepin') ? '<td><a target="_blank" href="' + soy.$$escapeHtml(messageData210.value) + '">' + soy.$$escapeHtml(messageData210.value) + '</a></td>' : '<td>' + soy.$$escapeHtml(messageData210.value) + '</td>') + '</tr>';
	    }
	  } else {
	    output += '<td colspan="4">No Message</td>';
	  }
	  output += '</tbody></table></div></div></div></div><!-- Transcript Full Detail Ends -->';
	  return output;
	};


acti.workflow.reports.transcriptFullDetailMail = function(opt_data, opt_ignored) {
  var output = '\t\t\t<!-- Transcript Full Detail Starts --><!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><div id="transcript-full-details" class="transcript-full-details"><div class="row"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><div class="row"><table id="transcript-full-details-table" class="transcript-full-details-table col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding" ><thead><tr id="transcript-details-domain-name-tr" class="transcript-details-domain-name-tr"><th colspan="2">' + soy.$$escapeHtml(opt_data.attributes.messageDetails.domainName) + '</th></tr><tr id="from-to-details-tr" class="from-to-details-tr"><th colspan="2"><table id="transcript-full-details-user-details" class="transcript-full-details-user-details"><tr><td rowspan="2"> <img src="' + soy.$$escapeHtml(opt_data.attributes.messageDetails.userImage) + '" id="transcript-full-details-img" class="transcript-full-details-img"/> </td><td>' + soy.$$escapeHtml(opt_data.attributes.messageDetails.from) + '</td></tr><tr><td class="from-td">From:&nbsp;&nbsp;<span>' + soy.$$escapeHtml(opt_data.attributes.messageDetails.from) + '</span></td><td><div class="dropdown pull-left send_viewer" id="details_fromHeader"><a data-toggle="dropdown" href="#"><i class="fa fa-caret-down"></i></a><ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"><li class="scroll_li"><ul class="viewer_list"><li> <div class="view_info">to:</div><div class="view_dtl">' + soy.$$escapeHtml(opt_data.attributes.messageDetails.to) + '<br></div> </li><li> <div class="view_info">from:</div><div class="view_dtl">' + soy.$$escapeHtml(opt_data.attributes.messageDetails.from) + '<br></div></li></ul></li></ul></div></td></tr></table></th></tr></thead><tbody id="transcript-full-details-tbody" class="transcript-full-details-tbody">';
  var messageList282 = opt_data.attributes.messages;
  var messageListLen282 = messageList282.length;
  if (messageListLen282 > 0) {
    for (var messageIndex282 = 0; messageIndex282 < messageListLen282; messageIndex282++) {
      var messageData282 = messageList282[messageIndex282];
      output += '<tr><th>' + soy.$$escapeHtml(messageData282.key) + '</th><td>' + messageData282.value + '</td></tr>';
    }
  } else {
    output += '<td colspan="4">No Message</td>';
  }
  output += '</tbody></table></div></div></div></div><!-- Transcript Full Detail Ends -->';
  return output;
};


acti.workflow.reports.transcriptFullDetailChat = function(opt_data, opt_ignored) {
  var output = '\t\t\t<!-- Transcript Full Detail Chat Starts --><!-- ' + soy.$$escapeHtml(opt_data.attributes.test) + ' --><div id="transcript-full-details" class="transcript-full-details"><div class="row"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><div class="row"><table id="transcript-full-details-table" class="transcript-full-details-table col-lg-12 col-md-12 col-sm-12 col-xs-12 zero-padding"><thead><tr id="transcript-details-domain-name-tr" class="transcript-details-domain-name-tr"><th colspan="2">' + soy.$$escapeHtml(opt_data.attributes.messageDetails.domainName) + '</th></tr><tr id="from-to-details-tr" class="from-to-details-tr"><th colspan="3"><table id="transcript-full-details-user-details" class="transcript-full-details-user-details"><tr><td rowspan="2"><img src= "' + soy.$$escapeHtml(opt_data.attributes.messageDetails.userImage) + '"  id="transcript-full-details-img" class="transcript-full-details-img" /></td><td>' + ((! ! opt_data.attributes.messageDetails.name) ? '<p>' + soy.$$escapeHtml(opt_data.attributes.messageDetails.name) + '</p><span style="font-size:14px; color:#999999; margin-top: 2px;">' + soy.$$escapeHtml(opt_data.attributes.messageDetails.from) + '</span>' : soy.$$escapeHtml(opt_data.attributes.messageDetails.from)) + '</td></tr></table></th></tr></thead><tbody id="transcript-full-chat-details-tbody" class="transcript-full-chat-details-tbody"><tr><td class="chatheader">User</td><td class="chatheader">Chat</td><td class="chatheader">Dates and Time</td></tr>';
  if (opt_data.attributes.metaData != null) {
    output += '<tr><td></td><td class="chatmsg"><table>';
    var metaDataList279 = opt_data.attributes.metaData;
    var metaDataListLen279 = metaDataList279.length;
    for (var metaDataIndex279 = 0; metaDataIndex279 < metaDataListLen279; metaDataIndex279++) {
      var metaDataData279 = metaDataList279[metaDataIndex279];
      output += '<tr><td>' + soy.$$escapeHtml(metaDataData279.key) + '</td><td>: ' + soy.$$escapeHtml(metaDataData279.value) + '</td></tr>';
    }
    output += '</table></td><td></td></tr>';
  }
  var messageList287 = opt_data.attributes.messages;
  var messageListLen287 = messageList287.length;
  for (var messageIndex287 = 0; messageIndex287 < messageListLen287; messageIndex287++) {
    var messageData287 = messageList287[messageIndex287];
    if (messageData287.user == 'Prechatsurvey' || messageData287.user == 'Offlineform') {
      if (! ! messageData287.chat && messageData287.chat.length > 0) {
        output += '<tr><td class="chatuser"><p>' + soy.$$escapeHtml(messageData287.user) + '</p></td><td><table>';
        var formDataList295 = messageData287.chat;
        var formDataListLen295 = formDataList295.length;
        for (var formDataIndex295 = 0; formDataIndex295 < formDataListLen295; formDataIndex295++) {
          var formDataData295 = formDataList295[formDataIndex295];
          output += '<tr><td>' + soy.$$escapeHtml(formDataData295.key) + '</td><td>: ' + soy.$$escapeHtml(formDataData295.value) + '</td></tr>';
        }
        output += '</table></td><td><p><span>' + soy.$$escapeHtml(messageData287.time) + '</span></p></td></tr>';
      }
    } else if (messageData287.user == 'feedback') {
      output += '<tr><td style="font-size:13px; color:#64696d; font-weight:bold; vertical-align: top;padding-left:9px; padding-top: 14px; padding-right: 20px;">Visitor</td><td class="visitor-feedback" style="width: 70%;">';
      var feedBackDataList307 = messageData287.chat;
      var feedBackDataListLen307 = feedBackDataList307.length;
      for (var feedBackDataIndex307 = 0; feedBackDataIndex307 < feedBackDataListLen307; feedBackDataIndex307++) {
        var feedBackDataData307 = feedBackDataList307[feedBackDataIndex307];
        if (feedBackDataData307.key == 'rating' && ! ! feedBackDataData307.value) {
          output += '<p style="font-size:14px;  padding: 2px 0px 0px; margin: 0px;"><label>Ratings:</label><ul class="ratings">';
          for (var i311 = 0; i311 < 5; i311++) {
            output += (i311 < feedBackDataData307.value) ? '<li class="rated hover"></li>' : '<li></li>';
          }
          output += '</ul> </p>';
        }
        output += (feedBackDataData307.key == 'feedback' && ! ! feedBackDataData307.value) ? '<p style="font-size:14px;  padding: 5px 5px 0px; margin: 0px;"> <label>Feedback:</label> <span>' + soy.$$escapeHtml(feedBackDataData307.value) + '</span> </p>' : '';
      }
      output += '</td><td><p><span>' + soy.$$escapeHtml(messageData287.time) + '</span></p></td></tr>';
    } else {
      output += '<tr><td class="chatuser"><p>' + soy.$$escapeHtml(messageData287.user) + '</p></td>' + ((! messageData287.user && ! messageData287.time) ? '<td class="chatmsg"><p><b><center>' + soy.$$escapeHtml(messageData287.chat) + '</center></b></p></td>' : '<td class="chatmsg"><p>' + ((messageData287.chat.indexOf('Visitor navigated to') != -1) ? messageData287.chat :  soy.$$escapeHtml(messageData287.chat)) + '</p></td>') + '<td><p><span>' + soy.$$escapeHtml(messageData287.time) + '</span></p></td></tr>';
    }
  }
  output += '</tbody></table></div></div></div></div><!-- Transcript Full Detail Chat Ends -->';
  return output;
};