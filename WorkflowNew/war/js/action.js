// JavaScript Document
var ZeroClipboard = ZeroClipboard || undefined;
$().ready(function() {
	$('#tta').tooltip();
	$('#ttapop').tooltip();
	var nowTemp = new Date();
	var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
	var checkin = $('#inputDate1').datepicker({
	    onRender: function (date) {
	        return date.valueOf() > now.valueOf() ? 'disabled' : '';
	    }
	}).on('changeDate', function (ev) {
	    
	    //made changes to condition below
	    var newDate = new Date(ev.date);
	    checkout.setValue(newDate);
	    checkin.hide();
	    $('#inputDate2')[0].focus();
	}).data('datepicker');
	var checkout = $('#inputDate2').datepicker({
	    onRender: function (date) {
	       //made changes to below line
	       var after = new Date(checkin.date);
	       after.setDate(after.getDate() + 30);
	       if(now.valueOf() > after.valueOf())
	    	   {
	    	   return (date.valueOf() <= after.valueOf()) && (date.valueOf()>= checkin.date.valueOf()) ? '' : 'disabled';	    	   
	    	   }
	       else if(after.valueOf() > now.valueOf())
	    	   {
		       return (date.valueOf() <= now.valueOf()) && (date.valueOf()>= checkin.date.valueOf()) ? '' : 'disabled';
	    	   }
	    }
	}).on('changeDate', function (ev) {
	    checkout.hide();
	}).data('datepicker');
	if(ZeroClipboard)
		ZeroClipboard.config( { swfPath: "../js/ZeroClipboard.swf" } );
    var dateEnd = $('#inputDate2')
    .datepicker()
    .on('changeDate', function(ev){
        dateEnd.datepicker('hide');
    });
    
    console.log("alertFromDate="+alertFromDate);
    console.log("alertToDate="+alertToDate);
    
  
    if(isValidDate(alertFromDate) & isValidDate(alertToDate))
    {
    	console.log("has from date info");
       	$('#inputDate1').datepicker("setValue", new Date(alertFromDate));
    	$('#inputDate2').datepicker("setValue", new Date(alertToDate));
    	alertFromDate = "";
    	alertToDate   = "";
    }
    else
    {
    	console.log('else part ');
    	$('#inputDate1').datepicker("setValue", new Date());
    	$('#inputDate2').datepicker("setValue", new Date());
    }
    account_acc_flag	=	"true";
    agentlogin_acc_flag = 	"true";
    domain_name_flag	=	"true";
    action_acc_flag		=	"true";
    dateadded_acc_flag  =	"true";
    compdate_acc_flag	=	"true";
    anstime_acc_flag	=	"true";
    timespent_acc_flag  =	"true";
    compTime_acc_flag	= 	"true";
    InternalData		=	"";
    current_rows		=	0;
    iteration			=	0;
    lengthToIterate		=	20;
   
    function isValidDate(subject)
    {
      if (subject.match(/^(?:(0[1-9]|1[012])[\- \/.](0[1-9]|[12][0-9]|3[01])[\- \/.](19|20)[0-9]{2})$/))
    	 return true;
      else
    	 return false;
    }
    
    var browserVersion = navigator.appVersion;
   if(browserVersion.indexOf("Windows") > -1 && browserVersion.indexOf("Chrome") > -1)
    {
        $('#tableScrollerdiv').scroll(function () {

        	console.log("entered chrome, windows");
        	if(iteration<currentdata.length)
        	 {
        			if ($("#tableScrollerdiv").scrollTop() + $("#tableScrollerdiv").height() > $('#table_data').height() - 20)
    	    	   {
    	    		   iteration = iteration + 20;
    	    		   appendTable(currentdata);
    	    		   var st = $(".active").attr('class').split(" ")[0];
    	    		   if(st !== 'completed' && st !== 'task'){
    	    			   $('.domain_wd').css('width','17%');
    	    			   $('.anstime_wd').css('width','7%');
    	    			   $('.timespt_wd').css('width','11%');
    	    			   $('.compTime_wd').css('width','12%');
    	    		   }
    				   else
    	    		   {
    					   $('.domain_wd').css('width','17%');
    					   $('.anstime_wd').css('width','8%');
    	    			   $('.timespt_wd').css('width','12%');
    					   $('.compTime_wd').css('width','8%');
    	    		   }
    	    	   }
        	    }
        	});
    
    
    }
   else if(browserVersion.indexOf("Macintosh") > -1)
	   {
	   $('#tableScrollerdiv').scroll(function () {		   
		   console.log ("entered a Mac browser scroll");
    	 if(iteration<currentdata.length)
    	    {
	    	   if ($('#tableScrollerdiv').scrollTop() > $(document).height() - $('#tableScrollerdiv').height()) 
    		 {
    		 
//    		  $(window).scroll(function () {
//		   console.log ("entered a Mac browser");
//    	 if(iteration<currentdata.length)
//    	    {
//	    	   if ($(window).scrollTop() > $(document).height() - $(window).height() - 10) 
//	    	   {
	    		   iteration = iteration + 20;
	    		   appendTable(currentdata);
	    		   var st = $(".active").attr('class').split(" ")[0];
	    		   if(st !== 'completed' && st !== 'task'){
	    			   $('.domain_wd').css('width','17%');
	    			   $('.anstime_wd').css('width','7%');
	    			   $('.timespt_wd').css('width','11%');
	    			   $('.compTime_wd').css('width','12%');
	    		   }
				   else
	    		   {
					   $('.domain_wd').css('width','17%');
					   $('.anstime_wd').css('width','8%');
	    			   $('.timespt_wd').css('width','12%');
					   $('.compTime_wd').css('width','8%');
	    		   }
	    	   }
    	    }
    	});
	   }
   
    else
    	{
    $('#tableScrollerdiv').scroll(function () {
    
    	console.log("entered a browser other than chrome, windows, Mac");
	
    //	console.log("scrolled"+"document height"+$(document).height()+"windowheight"+$(window).height())
   	 if(iteration<currentdata.length)
   	    {
	    	   if ($("#tableScrollerdiv").scrollTop() > $(document).height() - $(window).height() - 10) 
	    	   {
	    		   iteration = iteration + 20;
	    		   appendTable(currentdata);
	    		   var st = $(".active").attr('class').split(" ")[0];
	    		   if(st !== 'completed' && st !== 'task'){
	    			   $('.domain_wd').css('width','17%');
	    			   $('.anstime_wd').css('width','7%');
	    			   $('.timespt_wd').css('width','11%');
	    			   $('.compTime_wd').css('width','12%');
	    		   }
				   else
	    		   {
					   $('.domain_wd').css('width','17%');
					   $('.anstime_wd').css('width','8%');
	    			   $('.timespt_wd').css('width','12%');
					   $('.compTime_wd').css('width','8%');
	    		   }
	    	   }
    	    }
    	});
    	}
    $('.timezone').append(timezone);
    
    
    
    
    
    var nowTemp = new Date();
	var now 	= new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
	var download_from_date = $('#download_from_date')
    .datepicker({
    	onRender: function(date) {
    	    return date.valueOf() > now.valueOf() ? 'disabled' : '';
    	}
    })
    .on('changeDate', function(ev){
    	var newDate = new Date(ev.date);
     	download_to_date.setValue(newDate);
     	download_from_date.hide();
     	 $('#download_to_date')[0].focus();
    }).data('datepicker');
 
		$("#download_from_date").focus(function(){
		$("#download_to_date").datepicker("hide");

	});
	var download_to_date = $('#download_to_date')
    .datepicker({
    	onRender: function(date) {
    	   var after = new Date(download_from_date.date);
  	       after.setDate(after.getDate() + 30);
  	       if(now.valueOf() > after.valueOf())
  	    	   {
  	    	   return (date.valueOf() <= after.valueOf()) && (date.valueOf()>= download_from_date.date.valueOf()) ? '' : 'disabled';

  	    	   }
  	       else if(after.valueOf() > now.valueOf())
  	    	   {
  		       return (date.valueOf() <= now.valueOf()) && (date.valueOf()>= download_from_date.date.valueOf()) ? '' : 'disabled';

  	    	   }
    	}
    }).on('changeDate', function(ev){
    	download_to_date.hide();
    }).data('datepicker');
	$("#download_to_date").focus(function(){
		$("#download_from_date").datepicker("hide");

	});  
}); 

 
$('#domain_wd').click(function()
{
	sortDomainNames();
});
var tar					=	"";
$(document).click(function(event)
		{	
	
			tar	=	event.target.id;
			console.log(tar)
			if(tar == "manage")
			{
				$('#manageli').addClass('active');
				$('#internalli').removeClass('active');
			}
			else if(tar == "internalAction" || tar == "internal")
			{
				$('#internalli').addClass('active');
				$('#manageli').removeClass('active');
			}
		});
$('#Load_button').click(function(){

	//$(".task").trigger("click");
	spinnerload.spin(target);
	dd.initializeData();
	dd.initializeSpinner();
	//dd.currentSelection = "all";
	setTimeout(function(){loadInteractions_gae_all();},500);
	
	//setTimeout(function(){spinnerload.stop();},1000);
	
});
$('#fetch').click(function(){
	
	if($("#accNo").val() == ""|| $("#accNo").val() == undefined || $("#accNo").val() == null){
		 $("#accNo").attr("placeholder", "Enter Account Number");
	}else{
		fetch_flag 	  = "true";
		var value	  = "all";
		dd.currentSelection = "all";
	    dd.initializeData();
	    spinnerload.spin(target);
		dd.displayInteractionByStatus("all");
		$(".navbar-collapse .active").removeClass("active");
		$("#fetchtab").addClass("fetch-active");
		$(".task").trigger("click");
		setTimeout(function(){loadInteractions_gae_all()},500);
		setTimeout(function(){spinnerload.stop();},1000);
		$("#fetchdtl").hide();
	}	
});

	$('#internalAction').click(function()
		{
			internal_flag = "true";
			fetch_flag	 = "false";
			var value	  = "all";
			dd.currentSelection = "all";
	        dd.initializeData();
	        spinnerload.spin(target);
			dd.displayInteractionByStatus("all");
			$(".task").trigger("click");
			setTimeout(function(){loadInteractions_gae_all()},500);
			setTimeout(function(){spinnerload.stop();},1000);
		});
	$('.queue').click(function()
	{
		var value ="inqueue";
		iteration = 0;
		dd.currentSelection = "InQueue(IR)";
		dd.displayInteractionByStatus(value);
		$("#searchid").html("");
		$("#search_box").val("");
		$('.anstime_wd').css('width','7%');
		$('.timespt_wd').css('width','11%');
		$('.compTime_wd').css('width','12%');
		$("#checkbox_select_all").prop("checked", false);
	//	$("#search_box").trigger("keyup");
	});

	$('.completed').click(function()
	{
		var value ="completed";
		iteration = 0;
		dd.currentSelection = "Completed";
		dd.displayInteractionByStatus(value);
		$("#searchid").html("");
		$("#search_box").val("");
		$("#checkbox_select_all").prop("checked", false);
	//	$("#search_box").trigger("keyup");
	});
	
	$('.stuck').click(function()
	{
		var value ="waiting";
		iteration = 0;
		dd.currentSelection = "waiting";
		dd.displayInteractionByStatus(value);
		$("#searchid").html("");
		$("#search_box").val("");
		$('.anstime_wd').css('width','7%');
		$('.timespt_wd').css('width','11%');
		$('.compTime_wd').css('width','12%');
		$("#checkbox_select_all").prop("checked", false);
	//	$("#search_box").trigger("keyup");
	});
	$('.scheduled').click(function()
	{	
		var value ="scheduled";
		iteration = 0;
		dd.currentSelection = "Scheduled";
		dd.displayInteractionByStatus(value);
		$("#searchid").html("");
		$("#search_box").val("");
		$('.anstime_wd').css('width','7%');
		$('.timespt_wd').css('width','11%');
		$('.compTime_wd').css('width','12%');
		$("#checkbox_select_all").prop("checked", false);
	//	$("#search_box").trigger("keyup");
	});
	$('.pending').click(function()
			{	
				var value ="pending";
				iteration = 0;
				dd.currentSelection = "Pending";
				dd.displayInteractionByStatus(value);
				$("#searchid").html("");
				$("#search_box").val("");
				$('.anstime_wd').css('width','7%');
				$('.timespt_wd').css('width','11%');
				$('.compTime_wd').css('width','12%');
				$("#checkbox_select_all").prop("checked", false);
			//	$("#search_box").trigger("keyup");
			});

	$('.progess').click(function()
	{	
		var value ="inprogress";
		iteration = 0;
		dd.currentSelection = "In Progress";
		dd.displayInteractionByStatus(value);
		$("#searchid").html("");
		$("#search_box").val("");
		$('.anstime_wd').css('width','7%');
		$('.timespt_wd').css('width','11%');
		$('.compTime_wd').css('width','12%');
		$("#checkbox_select_all").prop("checked", false);
	//	$("#search_box").trigger("keyup");
	});
	$('.requed').click(function()
	{
		var value ="answered";
		iteration = 0;
		dd.currentSelection = "Answered";
		dd.displayInteractionByStatus(value);
		$("#searchid").html("");
		$("#search_box").val("");
		$('.anstime_wd').css('width','7%');
		$('.timespt_wd').css('width','11%');
		$('.compTime_wd').css('width','12%');
		$("#checkbox_select_all").prop("checked", false);
	//	$("#search_box").trigger("keyup");
	});
	$('.task').click(function()
	{
		var value ="all";
		iteration = 0;
		dd.currentSelection = "all";
		dd.displayInteractionByStatus(value);
		$("#searchid").html("");
		$("#search_box").val("");
		$('.domain_wd').css('width','18%');
		$("#checkbox_select_all").prop("checked", false);
	//	$("#search_box").trigger("keyup");
	});
 
	
	function inQueueClick()
	{
		$(".queue").trigger("click");
	}

	function completedClick()
	{
		$(".completed").trigger("click");
	}
	
	function stuckClick()
	{
		$(".stuck").trigger("click");
	}
	
	function scheduledClick()
	{	
		$(".scheduled").trigger("click");
	}
	function pendingClick()
	{	
		$(".pending").trigger("click");
	}

	function inprogressClick()
	{
		$(".progess").trigger("click");
	}
	
	function answeredClick()
	{
		$(".requed").trigger("click");
	}
	
	function allTaskClick()
	{
		$(".task").trigger("click");
	}

	
	$('#delselected').click(function()
			{
		var statuses = [];
		
		$(".chkbox:checked").each(function() {
			
			if(this.id != "" && this.id != null && this.id != " " && this.id!="checkbox_select_all")
				{
		statuses.push(this.id);
				}
		});
			if(statuses.length > 10)
				messageWindow.popUpMessage( "Select only 10 Interactions to be deleted at a time.", 3000 );	
			else
				intractionToDel(statuses);
			
	});
	$('#markselected').click(function()
			{
			var selectedStatuses = [];
			
			
			$(".chkbox:checked").each(function() {
				
				if(this.id != "" && this.id != null && this.id != " " && this.id!="checkbox_select_all")
					{
			selectedStatuses.push(this.id);
					}
			});
			if(selectedStatuses.length > 10)
				messageWindow.popUpMessage( "Select only 10 Interactions to be completed at a time.", 3000 );	
			else
				intractionToMarkComplete(selectedStatuses);

	});
	$('#markqueue').click(function()
			{
			var selectedStatuses = [];
			
			
			$(".chkbox:checked").each(function() 
			{	
				if(this.id != "" && this.id != null && this.id != " " && this.id!="checkbox_select_all")
					{
						selectedStatuses.push(this.id);
					}
			});
			console.log(selectedStatuses);
			if(selectedStatuses.length > 10)
				messageWindow.popUpMessage( "Select only 10 Interactions to be queued at a time.", 3000 );	
			else
				intractionToMarkInQueue(selectedStatuses);
	});
/****************************************************************************/

	$('#reschedule').on('click',function(){
		/*Updated by Priya**********Starts here*/
		var statuses = [];
		$(".chkbox:checked").each(function() {
			statuses.push(this.id);
		});
		if(statuses.length > 10)
			messageWindow.popUpMessage( "Select only 10 Interactions to be Scheduled at a time.", 3000 );	
		else if(statuses.length == 0)
			alertBox.show('Alert!','Please select an interaction to reschedule');
		else
		$('#reschedule_pop').toggle();
		$('.popover').css('z-index','900');
		$('#rescpop').css('height','250px');
		
		var nowTemp = new Date();
		var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
		var reschedule_date = $('#reschedule_date').datepicker({
	    	 onRender: function (date) {
			        return date.valueOf() < now.valueOf() ? 'disabled' : '';
			    }	    	
	    }).on('changeDate', function(ev){
	    	reschedule_date.datepicker('hide');
	    }).datepicker("setValue", new Date());
		
		var reschedule_time = $('#reschedule_time').timepicker({});
		/*Updated by Priya**********Ends here*/
	
		
		var utc =  moment.utc(new Date());
		var date = new Date().getTime();
		var zone = moment.tz.zone('America/Los_Angeles').abbr(date);
		if(zone == 'PDT')
	    {
		    console.log("UTC: " + utc.format('YYYY-MM-DD HH:mm'))
			var pdt = moment(utc).zone('-0700');
			console.log("PDT: " + pdt.format('HH:mm A'));
			var pdttime= pdt.format('HH:mm A');
			var pdtDate = pdt.format('MM/DD/YYYY');
			$('#reschedule_date').val(pdtDate);
			$('#reschedule_time').val(pdttime);
			$('#timezone_value').val("PDT");
		 	console.log("pdt time");
	    }
	   else
	   if(zone == 'PST')
	   {
		   	console.log("UTC: " + utc.format('YYYY-MM-DD HH:mm'))
			var pst = moment(utc).zone('-0800');
			console.log("PST: " + pst.format('HH:mm A'));
			var psttime= pst.format('HH:mm A');
			var pdtDate = pdt.format('MM/DD/YYYY');
			$('#reschedule_date').val(pdtDate);
			$('#reschedule_time').val(psttime);
			$('#timezone_value').val("PST");
	   }
		
		$('#reschedule_time').timepicker();
	});
/****************************************************************************/
								
	$('#markType').click(function(){		
		var statuses = [];
		$(".chkbox:checked").each(function() {
			statuses.push(this.id);
		});
		if(statuses.length > 10)
			messageWindow.popUpMessage( "Select only 10 Interactions to be Scheduled at a time.", 3000 );	
		else if(statuses.length == 0)
			alertBox.show('Alert!','Please select an interaction to reschedule');
		else
			{
			$('#markType_pop').toggle();
			
		$('#markType_pop').css('height','200px');
		var interactionIdArray = new Array();
		var chkId;
		var interactionId;
		var accNoWithInteractionId;
		var accountId;
		var accNoList;
		if(internal_flag === 'true'){
			$('#markTypeValue').val('External');
		}	
		else{
			$('#markTypeValue').val('Internal');
		}
		$('.chkbox:checked').each(function() 
		{
			if (this.id == "")
		    {
		    return true; //continue statement for jqeury
		    }
			chkId = this.id;
			interactionId = chkId.split("_")[1];
			accNoWithInteractionId = 'accNo_'+interactionId;
			accountId = document.getElementById(accNoWithInteractionId).innerHTML;
			if($.inArray(accountId, interactionIdArray)===-1)
			{
				interactionIdArray.push(accountId);
			}
		});
		accNoList 						= 	interactionIdArray.join(',');
		$('#accNos').val(accNoList);
		$('#accNos').attr('title',accNoList);
			}
	});
	$('#markTypeSelected').click(function()
			{						
				var accountIds 	= $('#accNos').val();
				var markType 	= $('#markTypeValue').val();
				$("#markType_pop").hide();
				var arrayOfAccountIdSelected;
				var arrayOfTR;
				var arrayOfTD;
				var accNo;
				var trIdArray;
				var markType;
				var confirm;
				if(accountIds !== '' && accountIds != undefined)
				{
					arrayOfAccountIdSelected 	= 	accountIds.split(',');
					arrayOfTR 					= 	$("#table_data").children();
					markType 					= 	$('#markTypeValue').val();
					trIdArray 					= 	new Array();
					
					$.each(arrayOfAccountIdSelected, function(index, value){
						for(var i=0;i<arrayOfTR.length;i++)
						{
							arrayOfTD 			= 	$(arrayOfTR[i]).children();
							$.each(arrayOfTD, function(index1, value1){
								if($(value1).attr('class') == 'acc_wd'){
									accNo = $(value1).html();
									if(accNo == value)
										trIdArray.push($(arrayOfTR[i]).attr('id'));
								}
							});
						}
					});
					/*confirm 					= 	window.confirm('Are you sure you want to mark the selected account(s) as "'+markType+'"?');
					if(confirm)
						updateAccountsType(accountIds, markType, trIdArray, arrayOfAccountIdSelected);*/
					
					bootbox.dialog({
						message:'Are you sure you want to mark the selected account(s) as "'+markType+'"?',
						title:'Warning!',
						buttons:{
							success:{
								label:"Proceed",
								className:'btn-success',
								callback: function() {
										updateAccountsType(accountIds, markType, trIdArray, arrayOfAccountIdSelected);
									}
									},
							cancel:{
										label:'Cancel',
										className:'btn-default'
										}
									}
								});
				}
				else
					//alert('No item has been selected. Please select an item to be marked.');
					alertBox.show('Alert!','Please select an interaction to migrate.');
			});
	
	$('#trigger_ar').click(function()
	{							
		$('#ar_pop').toggle();
		$('#ar_pop').css('height','200px');
	$('#submitAr').prop('disabled',false);
	});
	
	$('#addAr').click(function()
	{
		if($('#ar_key').val()!='' && $('#ar_value').val()!=''){
		var i	=	++current_rows;
		current_rows	=	i;
		var appender	=		'<tr id= dynamic_'+i+'>'+
								'<td style="padding-bottom: 15px;">'+
									'<div class="input-group col-sm-4">'+
										'<input type="text" class="form-control ar_keys" id="ar_key_'+i+'" placeholder="Key" style="width:75px" value="'+$('#ar_key').val() +'"/>'+
									'</div>'+	
								'</td>'+
								'<td style="padding-bottom: 15px;padding-left:5px;">'+
									'<div class="input-group col-sm-4">'+
										'<input type="text" class="form-control ar_values" id="ar_value_'+i+'" placeholder="Value" style="width:75px;margin-left: -15px;" value="'+ $('#ar_value').val()+'"/>'+
											'<span id="minusAr" class="input-group-addon" style="position: absolute;margin-left: 75px;margin-top:-30px;" onclick = "minus('+i+')"><i id="minusArsign" class="fa fa-minus" style="margin-left: -4px;"></i></span>'+
									'</div>'+	
								'</td>'+
								'</tr>';
		$('#dynamic_attributes').append(appender);
		$('#ar_key').val('');
		$('#ar_value').val('');
		}else{
			messageWindow.popUpMessage("Please fill all fields!",3000);
		}
		
		
	});
function minus(currrow) {
	$('#dynamic_attributes').find('#dynamic_' + currrow).hide();
	$('#dynamic_' + currrow).attr('class', 'remove_it');
	$('#dynamic_' + currrow).attr('id', "dynamic_remove" + currrow);
	$('#dynamic_remove' + currrow).find('.ar_keys').attr('class', 'remove_it');
	$('#dynamic_remove' + currrow).find('.ar_values')
			.attr('class', 'remove_it');
	
	// $('#dynamic_'+current_rows).remove();
	// --current_rows;
};
	
$('#submitAr')
		.click(
				function() {
					$('#submitAr').prop('disabled',true);
		var accNum	=	"";
		var arKey	=	new Array();
		var arval	=	new Array();
		var arObj	=	new Object();
		accNum		=	$('#aracc_num').val();
		var Key		=	$('#ar_key').val().trim();
		var val		=	$('#ar_value').val().trim();
					$('.remove_it').remove();
					if (current_rows == 0) {
						if (Key == "" || val == "" || accNum == "") {
							messageWindow
									.popUpMessage(
											"Please enter Account number and one key-value pair!",
											3000);
							$('#submitAr').prop('disabled',false);
						} else {
							if (Key != "" && val != "") {
								arKey.push(Key);
								arval.push(val);
							}
							spinnerload.spin(target);
							triggerActiveResponse(accNum,arKey,arval);
							current_rows = 0;
					}
					} else if (current_rows > 0) {
						if (Key == "" || val == "" || accNum == "") {
							messageWindow
									.popUpMessage(
											"Please fill all fields and click submit!",
											3000);
							$('#submitAr').prop('disabled',false);
						} else {
					
							var ar_keys = document
									.getElementsByClassName('ar_keys');
							var ar_values = document
									.getElementsByClassName('ar_values');

							for (var i = 0; i < ar_keys.length; i++) {
								if (ar_keys[i].value != "" && ar_values[i].value != ""){
									arKey.push(ar_keys[i].value);
									arval.push(ar_values[i].value);
					}
					}
							if (Key && val && Key != "" && val != ""){
								arKey.push(Key);
								arval.push(val);
							}
							/*
							 * for(var num=1;num<=current_rows;num++) { var key =
							 * $('#ar_key_'+num).val(); var Val =
							 * $('#ar_value_'+num).val(); arKey.push(key);
							 * arval.push(Val); }
							 */
							spinnerload.spin(target);
						triggerActiveResponse(accNum,arKey,arval);
						$('#dynamic_attributes').empty();
				}
			}
	});
	
	$('#close_ar').on('click',function(){
		document.getElementById('ar_pop').style.display	=	"none";
	});

	$('.timezone_value').on('click',function(){
		cur_val = $('#timezone_value').val();
		var utc =  new Date().getTime();
		var zone = moment.tz.zone('America/Los_Angeles').abbr(utc);
		if(cur_val == zone) alertBox.show('Alert!',"The current time zone is "+ zone);
		$('.timezone_value').val((cur_val === "PST") ? "PDT" : "PST");
	});
/****************************************************************************/

	$('#reschedule_modal').on('click',function(){
		$('#reshcedule_modal_pop').toggle();
		$('#reschedule_time_modal').timepicker();
		
		/*Updated by Priya**********Starts here*/
		//$('#reschedule_date').datepicker("setValue", new Date());
		var nowTemp = new Date();
		var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
		var reschedule_date_modal = $('#reschedule_date_modal').datepicker({
	    	 onRender: function (date) {
			        return date.valueOf() < now.valueOf() ? 'disabled' : '';
			    }	    	
	    }).on('changeDate', function(ev){
	    	reschedule_date_modal.datepicker('hide');
	    }).datepicker("setValue", new Date());
		/*Updated by Priya**********Ends here*/
	
		
		/*	var reschedule_date_modal = $('#reschedule_date_modal')
		.datepicker({
			startDate: new Date()
		})
		.on('changeDate', function(ev){
			reschedule_date_modal.datepicker('hide');
		});*/

		var utc =  moment.utc(new Date())
		var date = new Date().getTime();
		var zone = moment.tz.zone('America/Los_Angeles').abbr(date);

		if(zone == 'PDT')
		{
			console.log("UTC: " + utc.format('YYYY-MM-DD HH:mm'))
			var pdt = moment(utc).zone('-0700');
			console.log("PDT: " + pdt.format('HH:mm A'));
			var pdttime= pdt.format('HH:mm A');
			var pdtDate = pdt.format('MM/DD/YYYY');
			$('#reschedule_date_modal').val(pdtDate);
			$('#reschedule_time_modal').val(pdttime);
			$('#timezone_value_modal').val("PDT");
			console.log("pdt time");
		}
		else
			if(zone == 'PST')
			{
				console.log("UTC: " + utc.format('YYYY-MM-DD HH:mm'))
				var pst = moment(utc).zone('-0800');
				console.log("PST: " + pst.format('HH:mm A'));
				var psttime= pst.format('HH:mm A');
				var pdtDate = pdt.format('MM/DD/YYYY');
				$('#reschedule_date_modal').val(pdtDate);
				$('#reschedule_time_modal').val(psttime);
				$('#timezone_value_modal').val("PST");
			}
		$('#reschedule_time').timepicker();

	});

	/****************************************************************************/

	$('#markTypeValue').on('click',function(){
		cur_val = $('#markTypeValue').val();
		$('#markTypeValue').val((cur_val === "Internal") ? "External" : "Internal");
	});


	$(document).click(function (e)
		{
	    var container = $("#reschedule_pop"),
	    	clickbutton = $('#reschedule');
	    if (!container.is(e.target) && !clickbutton.is(e.target) // if the target of the click isn't the container...
	        && container.has(e.target).length === 0) // ... nor a descendant of the container
	    {
	    	$("#reschedule_pop").hide();
	    }
	    var containerinner = $("#reshcedule_modal_pop"),
    		clickbutton = $('#reschedule_modal');
	    if (!containerinner.is(e.target) && !clickbutton.is(e.target) // if the target of the click isn't the container...
        && containerinner.has(e.target).length === 0) // ... nor a descendant of the container
    	{
    		$("#reshcedule_modal_pop").hide();
    	}
	    
	    var containerForMark = $("#markType_pop"),
	    		clickButtonForMark = $("#markType");
	    if (!containerForMark.is(e.target) && !clickButtonForMark.is(e.target) // if the target of the click isn't the container...
		        && containerForMark.has(e.target).length === 0) // ... nor a descendant of the container
		    {
		    	$("#markType_pop").hide();
		    }
	    
	    var containerForAR = $('#ar_pop');
	    		clickButtonForAR = $('#trigger_ar');
	    if (!containerForAR.is(e.target) && !clickButtonForAR.is(e.target) // if the target of the click isn't the container...
	        && containerForAR.has(e.target).length === 0) // ... nor a descendant of the container
	    {
	    	$("#ar_pop").hide();
	    }
	    var containerForAr = $("#ar_pop"),
	    		clickButtonForAr = $("#trigger_ar");
	    if (!containerForAr.is(e.target) && !clickButtonForAr.is(e.target) // if the target of the click isn't the container...
		        && containerForAr.has(e.target).length === 0 && (e.target.id != "minusArsign" && e.target.id != "minusAr")) // ... nor a descendant of the container
		    {
		    	$("#ar_pop").hide();
		    }
	    var containerForAr = $("#ar_pop"),
	    clickButtonForAr = $("#trigger_ar");
	    if (!containerForAr.is(e.target) && !clickButtonForAr.is(e.target) // if the target of the click isn't the container...
        && containerForAr.has(e.target).length === 0 && (e.target.id != "minusArsign" && e.target.id != "minusAr")) // ... nor a descendant of the container
	    {
	    	$("#ar_pop").hide();
	    }
	    
	    var containerToDownload = $("#download_pop"),
		clickButtonToDownload = $("#downloadCsv");
	    if (!containerToDownload.is(e.target) && !clickButtonToDownload.is(e.target) // if the target of the click isn't the container...
	    		&& containerToDownload.has(e.target).length === 0) // ... nor a descendant of the container
	    {
	    	$("#download_pop").hide();
	    }
	    
	    var containerForChatTranscript = $("#downloadChat_pop"),
	    clickButtonForChatTranscript = $("#downloadCsvChat");
	    if (!containerForChatTranscript.is(e.target) && !clickButtonForChatTranscript.is(e.target) // if the target of the click isn't the container...
	    		&& containerForChatTranscript.has(e.target).length === 0) // ... nor a descendant of the container
	    {
	    	$("#downloadChat_pop").hide();
	    }
	});
	
	$('#rescSelected').click(function()
			{
	
		var statuses = [];
			$(".chkbox:checked").each(function() {
			statuses.push(this.id);
			});
			if(statuses.length > 10)
				messageWindow.popUpMessage( "Select only 10 Interactions to be Scheduled at a time.", 3000 );	
			else
				intractionToSche(statuses);
	});
	
	
//sorting in ascending
	
	$('#acc_wd').click(function(){
		
		if(account_acc_flag	==	"true"){
			account_acc_flag	="false";
			sortByAccountNum();
		}
		else{
			account_acc_flag = "true";
			sortByAccountNumDec();
		}
	});

	$('#domain_wd').click(function(){
		
		if(domain_name_flag == "true"){
			domain_name_flag	=	"false";
			sortByDomainName();
		}else{
			domain_name_flag	=	"true";
			sortByDomainNameDec();
		}
	});
	$('#aglogin_wd').click(function(){
		
		if(agentlogin_acc_flag == "true"){
			agentlogin_acc_flag	=	"false";
			sortByAgentLogin();
		}else{
			agentlogin_acc_flag	=	"true";
			sortByAgentLoginDec();
		}
	});
	$('#status_wd').click(function(){
		
		if(action_acc_flag ==	"true"){
			action_acc_flag = "false";
			sortByAction();
		}else{
			action_acc_flag = "true";
			sortByActionDec();
		}
	});
	$('#dateadd_wd').click(function(){
		
		if(dateadded_acc_flag ==	"true"){
			dateadded_acc_flag = "false";
		sortByDateAdded();
		}else{
			dateadded_acc_flag = "true";
			sortByDateAddedDec();
		}
	});
	$('#datecom_wd').click(function(){
		
		if(compdate_acc_flag == "true"){
			compdate_acc_flag = "false";
		sortByCompletedDate();
		}else{
			compdate_acc_flag = "true";
			sortByCompletedDateDec();
		}
	});
	$('#anstime_wd').click(function(){
	
		if(anstime_acc_flag == "true"){
			anstime_acc_flag = "false";
		sortByAnswerTime();
		}else{
			anstime_acc_flag = "true";
			sortByAnswerTimeDec();
		}
		
	});
	$('#timespt_wd').click(function(){
		if(timespent_acc_flag == "true"){
			timespent_acc_flag = "false";
		sortByTimeSpent();
		}else{
			timespent_acc_flag = "true";
			sortByTimeSpentDec();
		}
		
	});
	$('#compTime_wd').click(function(){
		if(compTime_acc_flag == "true"){
			compTime_acc_flag = "false";
		sortByTimeCompleted();
		}else{
			compTime_acc_flag = "true";
			sortByTimeCompletedDec();
		}
		
	});
	
// To select all checkbox
$('#checkbox_select_all').click(function() {
	$('.chkbox').prop('checked', false);
	chkBoxElements = $('.chkbox');
	for(index = 0; index <chkBoxElements.length ; index++)
	{
	  $('#'+chkBoxElements[index].id).prop('checked',this.checked);
	  if(index == 9)
		  break;
	}
});

$('#select_all_SBChat').click(function() {
	$('#checkbox_select_all').attr('checked', false);
	spinnerload.spin(target);
	dd.interactionType='SBChat';
	dd.initializeData();
	interactionsManipulator.addInteractionsList(actualJsonData,null,0);
	chooseTheCurrentSelection(dd.currentSelection);
	$('.inter_type').html('Chat');
	$("#select_all").removeAttr("style");
	$("#select_all_AR").removeAttr("style");
	$("#select_all_SBChat").css("display", "none");
	setTimeout(function(){spinnerload.stop();},1000);

});

$('#select_all_AR').click(function() {
	$('#checkbox_select_all').attr('checked', false);
	spinnerload.spin(target);
	dd.interactionType='AR';
	dd.initializeData();
	interactionsManipulator.addInteractionsList(actualJsonData,null,0);
	chooseTheCurrentSelection(dd.currentSelection);
	$('.inter_type').html('AR');
	$("#select_all").removeAttr("style");
	$("#select_all_SBChat").removeAttr("style");
	$("#select_all_AR").css("display", "none");
	setTimeout(function(){spinnerload.stop();},1000);

});
$('#select_all').click(function(){
	$('#checkbox_select_all').attr('checked', false);
	spinnerload.spin(target);
	dd.interactionType='All';
	dd.initializeData();
	interactionsManipulator.addInteractionsList(actualJsonData,null,0);
	chooseTheCurrentSelection(dd.currentSelection);
	$('.inter_type').html('All');
	$("#select_all_AR").removeAttr("style");
	$("#select_all_SBChat").removeAttr("style");
	$("#select_all").css("display", "none");
	setTimeout(function(){spinnerload.stop();},1000);
});

$('#downloadCsv').click(function(){
	$('#download_pop').toggle();
	$('#download_pop').css('height','220px');
});

$('#requestDownload').click(function(){
	var interactionType = $('.radio label input:checked').val();
	console.log(' Type : '+interactionType);
	$('#download_pop').hide();
	if(currentdata.length == 0)
	{
		messageWindow.popUpMessage('Sorry! No data to download.');
		return;
	}
	var fromDate 		= $('#inputDate1').val();
	var toDate 			= $('#inputDate2').val();
	var dataToBeSent 	= new Array();
	if(interactionType === 'AR')
	{
		$.each(currentdata, function(i, value){
				if(value.interactionType === "AR")
				{
					dataToBeSent.push(value);
					delete dataToBeSent[dataToBeSent.length-1].messages;
				}
		});
		if(dataToBeSent.length == 0)
		{
			messageWindow.popUpMessage('Sorry! No AR data to download.');
			return;
		}
	}
	else if(interactionType === 'SBChat')
	{
		$.each(currentdata, function(i, value){
				if(value.interactionType === "SBChat")
				{
					dataToBeSent.push(value);
					delete dataToBeSent[dataToBeSent.length-1].messages;
				}
		});
		if(dataToBeSent.length == 0)
		{
			messageWindow.popUpMessage('Sorry! No Chat data to download.');
			return;
		}
	}
	else
	{
		dataToBeSent = currentdata;
		$.each(dataToBeSent, function(i, value){
				delete value.messages;
		});
	}
	var postData = new Object();
	postData.timeZone			=	timezone;
	postData.fromDate			=	fromDate;
	postData.toDate		    	=	toDate;
	postData.data		    	=	dataToBeSent;
	postData.interactionType	=	interactionType;

	$('#dataToBeSent').val(JSON.stringify(postData));  
	$('#csvFileToDownload').submit();
});
$('#downloadCsvChat').click(function(){
	$('#downloadChat_pop').toggle();
	$('#downloadChat_pop').css('height','272px');
	var nowTemp = new Date();
	$('#download_from_date').datepicker("setValue", nowTemp);
	$('#download_to_dates').datepicker("setValue", new Date());
	$("#download_from_date").val('');
	$("#download_to_date").val('');
	$("#chat_subacc").val('');
});
	//Added this code by Priya
/*	$('#chat_subacc').blur(function()
	{
		var accNo 		= $("#chat_subacc").val();

		if( (accNo == '')||(isNaN(accNo)) )
		{
			alertBox.show('Alert!',"Please Enter a Valid Account Number.");

		}
		

});*/

$('#chat_subacc').blur(function()
		{
			var accNo 		= $("#chat_subacc").val();

			if( (accNo == '')||(isNaN(accNo)) )
			{
				var status ="Enter a Valid Account Number.!";
				$('#notification').html(status);	
				$('#notification').show();
				$('#chat_subacc').css('border-color','red');

			//	alertBox.show('Alert!',"Please Enter a Valid Account Number.");

			}
			else
				{
				$('#notification').hide();
				$('#chat_subacc').css('border-color','#cccccc');
	}

		
	});

	$("#chat_subacc").focus(function(){
		$("#download_from_date").datepicker("hide");
		$("#download_to_date").datepicker("hide");
	}); 
$('#downloadChatSubmit').click(function(e){
	
	var fromDate	= $("#download_from_date").val();
	var toDate 		= $("#download_to_date").val();
	var accNo 		= $("#chat_subacc").val();
	var from;
	var to;
	var dateFlag = false;
	var accountNumberList = [];
	var datetRegex = new RegExp(/\b\d{1,2}[\/-]\d{1,2}[\/-]\d{4}\b/);

	if(accNo != '' && fromDate != '' && toDate != '')
	{
		
		if(accNo)
		{
			try
			{
				accNo = parseInt(accNo);
				if(!isNaN(accNo))
				{
					accountNumberList.push(accNo.toString());
				}

			}
			catch(e)
			{
				console.error('Entered invalid acc no : ' + e);
			}
		}
		if(fromDate && toDate)
		{
			from = new Date(fromDate);
			to	 = new Date(toDate);
			if( from > to)
				dateFlag = false;
			else
				dateFlag = true;
			ValidateDates(from,to);
		}
		if(dateFlag && (!accountNumberList || accountNumberList.length <= 0))
		{
			alertBox.show('Alert!',"Oops! Please Enter a Valid Account Number.");
			setTimeout(function(){dd.hideLoadingSpinner("everything");},100);	
		}
		if(accountNumberList && accountNumberList.length > 0 && dateFlag)
		{
			var data = {};
			data.accountNumberList 	= accountNumberList;
			data.fromDate 			= fromDate;
			data.toDate 			= toDate;
			console.log('account number list : ' + accountNumberList);
			$('#jsonTobeSent').val(JSON.stringify(data));
			$('#chatCSVForm').submit();
		}
		$('#downloadChat_pop').hide();
	}
	else
	{
		messageWindow.popUpMessage( "Please enter valid Account Number, From date and To date.", 3000 );
	}
});
$('#close_resc').click(function()
{
	$('#reschedule_pop').hide();	
});



$('#close_migr').click(function()
{
	$('#markType_pop').hide();		
});

$('#close_downld').click(function(){
	$('#download_pop').hide();
});
$('#close_downloadChat').click(function(){
	$('#downloadChat_pop').hide();
});
