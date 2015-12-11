$(document).ready(function(){
    	  
    	  window.oldSkillbeforechange = "";  //to send the old skill that was changed to skillactivityJDO database
    	  
    	  $('.full_dtl img').attr('src', photoURL);
    	  $('.userimg img').attr('src', photoURL);
    	  
      $('.account-details').on('click','td.acc_wd,td.aglogin_wd,td.status_wd,td.dateadd_wd,td.datecom_wd,td.anstime_wd,td.timespt_wd',function(){
            $('#detail_listing').show();
            $('body').append('<div class="modal-backdrop fade in"></div>');
      });
        $(".tab_hold ul li,.pgshow_opt a").on('click',function() {
            $(this).siblings().removeClass('active'); 
            $(this).addClass('active');
        });
        $(".tab_hold ul li").hover(function() {
                // this function is fired when the mouse is moved over
                $(".out",   this).stop().animate({'top':    '75px'},    250); // move down - hide
                $(".over",  this).stop().animate({'top':    '0px'},     250); // move down - show
                }, function() {
                // this function is fired when the mouse is moved off
                $(".out",   this).stop().animate({'top':    '0px'},     250); // move up - show
                $(".over",  this).stop().animate({'top':    '-75px'},   250); // move up - hide
            });

        $('#detail_listing .close').on('click',function(){
            $(this).parent().parent().parent().parent().hide();
            $( ".modal-backdrop.fade.in" ).remove();
        });
             
        $('#log_dtl').on({
            mouseenter: function() {
            	var log_dtl = $('#log_dtl');
                log_dtl.show();
            },
            mouseleave : function(){
            	var log_dtl = $('#log_dtl');
                log_dtl.hide();
            }
        });
        
        
        $('.full_dtl img').on({
        	click: function() {
            var log_dtl = $('#log_dtl');
            if (log_dtl.css('display')=='none') {
                log_dtl.show();
            }else{
                log_dtl.hide();
            }
        },
            mouseenter: function() {
            	var log_dtl = $('#log_dtl');
                log_dtl.show();
            },
            mouseleave : function(){
            	var log_dtl = $('#log_dtl');
                log_dtl.hide();
            }
        });
        
        
        $('#fetchtab1').on('click',function(){
            var fetchdtl = $('#fetchdtl');

            if (fetchdtl.css('display')=='none') {
                fetchdtl.show();
            }else{
                fetchdtl.hide();
            }
            
            $('#fetchdtl .popover-content').find('.fch_input').focus();
        });
        
        $(document).ready(function() 
        {
        	$("[class^=picker]").click(function()
        	{
        	
        	if($(this).parent().hasClass('disabled'))
        		return;
        	
        	var optionIndex   = parseInt($(this).parent().attr('data-original-index')) + 1;
        	var isSelected    = $(this).parent().hasClass('selected');
        	var elementClass  = $(this).attr('class'); 
        	var elToBeUpdated = "";
        	
        	if("picker_ExceptionalDays" == elementClass )
        		elToBeUpdated = '.picker_ExcludeDays#excl'+optionIndex;
        	else
        		elToBeUpdated = '.picker_ExceptionalDays#excep'+optionIndex;
        		
        	$(elToBeUpdated).attr('disabled',!isSelected);
        	
        	if(elementClass.indexOf("ExcludeDays") > -1)
        		$('.exceptionalDaysPicker').selectpicker('render');
        	else
        		$('.excludeDaysPicker').selectpicker('render');
        	});
        });
        
        

        $('a[href="#status_dtl"]').on('click',function(){
            $('#status_dtl').css('display','block');
            $('#status').hide();
            $('.foot_btn').show();
        });
        $('a[href="#status"]').on('click',function(){
            $('#status').show();
            $('#status_dtl').css('display','none');
            $('.foot_btn').hide();
        });
        $('.pg_opt i,.pgshow_opt i').tooltip();
        try 
        {
	        document.getElementById('ar-Id').style.pointerEvents = 'none'
	        document.getElementById('chat-Id').style.pointerEvents = 'none'
	        document.getElementById('model-chat-Id').style.pointerEvents = 'none'
	    } catch( exception ) {
	    	console.log( 'Error while getting elemets : ar-Id');
	    }
        	//lets deside mode first b4 doing any thing else 
        
        	if(mode == 'STAGING')
        	{
        		$('.skill-Live').css('display','none');
        	}
        	else
        	{
        		$('.skill-Staging').css('display','none');	
        	}
        messageWindow = new MessageWindow();
        messageWindow.inject();
        scrollflag = true;
        
        
    //  for windows  use :   $('.panel4').scroll(function () {

        	$(window).scroll(function () {
        	console.log("scrolled");
        	if(scrollflag)
        	{
        		if($('.panel4').css( "display" ) == "block" && ($("#SkillTable").html()).trim() != '')
        		{
	        		scrollflag	=	false;
	        		if($('#mainSkill').hasClass('active'))
	        		{
	        			accountManager.getAgentDetailsBySkillRecursively(accountManager.mainSkillRecursiveMap);
	        			if(accountManager.mainSkillRecursiveMap.cursor != "No Cursor")
	        				setInterval(function(){scrollflag	=	true},2000);
	        		}
	        		else
	        		{
	        			accountManager.getAgentDetailsBySkillRecursively(accountManager.overflowSkillRecursiveMap);
	        			if(accountManager.overflowSkillRecursiveMap.cursor != "No Cursor")
	        				setInterval(function(){scrollflag	=	true},2000);
	        		}	
        		}
        	}
       	});
        	try
        	{
	        	if(!!accno)
	        	{
	        	$("#fetchinbox").val(accno);
	        	$('#fetch').trigger('click');
	        	}	
        	}catch(e)
        	{
        		
        	}
        $('#multi_skill_csv').tooltip('hide');
  });
$(window).load(function(){
    var winheight = $(window).height();
    $('.account-details .table_scroll').height(winheight-227);
    $('#detail_listing .modal-content').height(winheight);
    $('#detail_listing .dtl_scroll').height(winheight-287);
    $('.status_dtl').height(winheight-332);
    if ($('a[href="#status"]').hasClass('active')) {
        $('.foot_btn').hide();
    }

});
$(window).resize(function(){
    var winheight = $(window).height();
    $('.account-details .table_scroll').height(winheight-227);
    $('#detail_listing .modal-content').height(winheight);
    $('#detail_listing .dtl_scroll').height(winheight-287);
    $('.status_dtl').height(winheight-332);
});

$('#model-confirm_proceed').click(function()
{
		accountManager.createAccount = false;
		$(accountManager.Id).trigger('click');
});
$('#add-skillToAgent').click(function()
{
	//initialize popup
	
	$('#add-skillName').val('');
	$('#add-AgentLogin').val('');
	$('#add-AgentskillLevel').val('3');
	$('#add-Agenturl').val('');
	if(mode	==	"STAGING")
	{
		if($('#mainSkill').hasClass('active'))
		{
			var skilltitle	=	accountManager.AccountData.staging_skill;
		}
		else
		{
			var skilltitle	=	accountManager.AccountData.overflow_staging_skill;
		}	
	}
	else
	{	
		if($('#mainSkill').hasClass('active'))
		{
			var skilltitle	=	accountManager.AccountData.live_skill;
		}
		else
		{
			var skilltitle	=	accountManager.AccountData.overflow_live_skill;
		}		
	}
	$('#add-skillName').val(skilltitle);
});

$('#multi_skill_csv').on('click',function(){
$('#skill-file').trigger('click');
});
try
{
$('#skill-file').on('change', prepareAgentSkillUpload);
}catch(e)
{
console.log("No such Id exists in this tab.")
} 
$('#save-AgentSkill').click(function()
{
	if($('#add-skillName').val() != '' && $('#add-AgentLogin').val() != '' && $('#add-AgentskillLevel').val() != '')
		accountManager.addAgentToSkill();
	else
		messageWindow.popUpMessage( "Fill Required Fields", 2000 );
});
$('#mainSkill').click(function()
{
	accountManager.fillAgentSkillListToPage(accountManager.mainSkillList,"main",accountManager.mainSkillList.length);
});
$('#overflowSkill').click(function()
{
	accountManager.fillAgentSkillListToPage(accountManager.OverflowSkillList,"overflow",accountManager.OverflowSkillList.length);
});
$('#fetch').click(function()
{
	$('#fetchdtl').hide();
	if(accountManager.isModified || accountManager.createAccount == true)
	{
		accountManager.Id	=	"#fetch";
		$('#modalconfirm').trigger('click');
		accountManager.isModified	=	false;
		return;
	}
	if($("#fetchinbox").val() == ""|| $("#fetchinbox").val() == undefined || $("#fetchinbox").val() == null){
		messageWindow.popUpMessage( "Fetch Field is Empty", 1000 );
	}
	else
	{
		messageWindow.showMessage("Fetching Account...");
		accountManager.initializeFormField();
		accountManager.createAccount	=	false;
		var accountNo = $("#fetchinbox").val().trim();
		accountManager.getSubAccountList(accountNo);
		//reinitialize page
		$('#callDe-form').css('border-color','rgb(208, 208, 208)');
		$('#campDe-form').css('border-color','rgb(208, 208, 208)');
		$('#formname-form').css('border-color','rgb(208, 208, 208)');	
		$('#domin-form').css('border-color','rgb(208, 208, 208)');
		$('#campagin-val').css('border-color','rgb(208, 208, 208)');
		$( "#hide-fetch" ).trigger( "click" );
		if(mode	==	"LIVE")
		{
			$( "#skill-mode" ).html( "Live" );
		}
		else
		{
			$( "#skill-mode" ).html( "Staging" );
		}		
	}	
});
$('#update-button').click(function(){
	
	if(!!accountManager.AccountData && accountManager.AccountData.isAssigned == "false" )
		$('#create-acc').trigger('click');
	
	accountManager.postNewDataToUpdate("update");
	
});
$('#create-acc').click(function(){
	$('#model-domainName').css('border-color','rgb(208, 208, 208)');
 	$('#model-accountNo').css('border-color','rgb(208, 208, 208)');
 	$( ".collapse1" ).trigger( "click" );
});
$('#listened').change(function(){
	if(accountManager.createAccount	!=	true)
	{
		if(accountManager.AccountData.subAccountNumber != undefined)
			accountManager.isModified	=	true;
	}else
	{
		accountManager.isModified	=	true;
	}
});
 
$(document).on('click',function(e)
		{
			var tar	=	e.target.id;
			if(tar == "popup_chat_rad" || tar == "popup_ar_rad")
				{
					$('#model-chat-Id').find('span').removeAttr("style");
					$('#model-ar-Id').find('span').removeAttr("style");
					if(tar == "popup_chat_rad")
					{
						$('#chat-Id').addClass('active-radio');	
						$('#ar-Id').removeClass('active-radio');
					}
					else if(tar == "popup_ar_rad")
					{
						$('#ar-Id').addClass('active-radio');
						$('#chat-Id').removeClass('active-radio');	
					}
				}
});
$('#model-save').click(function(){
	$('.dis-sales').removeClass("active-li")
	var ar_checked	=	$('#model-ar-Id').hasClass('active-radio');
	var chat_cheked	=	$('#model-chat-Id').hasClass('active-radio');
	if($('#model-accountNo').val() != "" && $('#model-accountNo').val() != undefined )
	{
		 if($('#model-domainName').val() != "" && $('#model-domainName').val() != undefined )
	     {
			 if(ar_checked  ||  chat_cheked)
				 {
					 if(!(($('#model-campagin-val').html()).indexOf('Campagin') !=-1))
					 {
						 	if(accountManager.isModified == true || accountManager.createAccount ==	true)
							{
								accountManager.Id	=	"#model-save";
								$('.dis-sales').removeClass("active-li");
								$('#modalconfirm').trigger('click');
								accountManager.isModified	=	false;
								return;
							}
						 	var accountNo	=	$('#model-accountNo').val();
						 	var domainName =	$('#model-domainName').val();
						 	var interactionType = $( '#model-campagin-val' ).html();
					 		var interactionTypeId = getInterTypeBasedOnName(interactionType);
					 		var subAccountNumber = null;
					 		if(!!accountManager.AccountData && !!accountManager.AccountData.isAssigned && accountManager.AccountData.isAssigned.toLowerCase() == "false" && accountManager.AccountData.subAccountNumber != "") 
					 			subAccountNumber = accountManager.AccountData.subAccountNumber;
					 		//accountManager.getsubAccountNumber(accountNo,domainName, interactionTypeId);
						 	accountManager.createARAccount(accountNo, domainName, interactionTypeId,subAccountNumber);
					 		$('#model-domainName').css('border-color','rgb(208, 208, 208)');
					 		$('#model-accountNo').css('border-color','rgb(208, 208, 208)'); 		
					 }
					 else
			 		{
				 		$('#model-campagin-val').css('border-color','red');
			 		}
				 }
			 else
				 {
				 	$('#model-chat-Id').find('span').css('border-color','red');
				 	$('#model-ar-Id').find('span').css('border-color','red');
				 }
		 }
		 else
		 {
			 $('#model-accountNo').css('border-color','rgb(208, 208, 208)');
			 $('#model-domainName').css('border-color','red');
		 }
	}
	else
	{
		$('#model-accountNo').css('border-color','red');
	}	
});
$('#skillTi-form').blur(function()
{
	if(($('#skill-mode').html()).indexOf("Live") != -1)
		{
			accountManager.AccountData.live_skill				=	$('#skillTi-form').val();
		}
	if(($('#skill-mode').html()).indexOf("Staging") != -1)
		{
			accountManager.AccountData.staging_skill			=	$('#skillTi-form').val();
		}
	if(($('#skill-mode').html()).indexOf("Overflow staging") != -1)
		{
			accountManager.AccountData.overflow_staging_skill	=	$('#skillTi-form').val();
		}
	if(($('#skill-mode').html()).indexOf("Overflow live") != -1)
	{
			accountManager.AccountData.overflow_live_skill		=	$('#skillTi-form').val();
	}
});
$('#model-confirm_cancel').click(function(){
	accountManager.isModified	=	true;
	if(accountManager.Id	==	"#model-save")
		$('#close-modelconfirm').trigger('click');
});
$('#overflow-skill').click(function(){
	if(document.getElementById('overflow-skill').checked)
		messageWindow.popUpMessage( "Overflow Enabled", 1000 );
	else
		messageWindow.popUpMessage( "Overflow Disabled", 1000 );
});
function fillDrop(Id,value)
{
	$('#'+Id).html(value);
	if(Id==='skill-mode')
	{

		if(($('#skill-mode').html()).indexOf("Live") != -1)
			{
				$('#skillTi-form').val(accountManager.AccountData.live_skill);
				$('#defaultSkill').html('Current Skill: '+accountManager.AccountData.live_skill);
			}
		if(($('#skill-mode').html()).indexOf("Staging") != -1)
			{
				$('#skillTi-form').val(accountManager.AccountData.staging_skill);
				$('#defaultSkill').html('Current Skill: '+accountManager.AccountData.staging_skill);
			}
		if(($('#skill-mode').html()).indexOf("Overflow staging") != -1)
			{
				if(accountManager.AccountData.overflow_staging_skill	==	undefined)
				{
					$('#skillTi-form').val('OFF');
					$('#defaultSkill').html('Current Skill: '+'OFF');
				}
				else
				{
					$('#skillTi-form').val(accountManager.AccountData.overflow_staging_skill);
					$('#defaultSkill').html('Current Skill: '+accountManager.AccountData.overflow_staging_skill);
				}
			}
		if(($('#skill-mode').html()).indexOf("Overflow live") != -1)
			{
				if(accountManager.AccountData.overflow_staging_skill	==	undefined)
				{
					$('#skillTi-form').val('OFF');
					$('#defaultSkill').html('Current Skill: '+'OFF');
				}
				else
				{
					$('#skillTi-form').val(accountManager.AccountData.overflow_live_skill);
					$('#defaultSkill').html('Current Skill: '+accountManager.AccountData.overflow_live_skill);
				}
			}

	}
}

var card=function(data){
	this.subAccountNumber 	= data.subAccountNumber,
	this.domainName	= data.domainName,
	this.status 	= data.status,
	this.container='',
	this.render=function(dom){
			if(data.accountNumber != undefined && data.subAccountNumber != undefined)
				{	
						
				var builder='<tr class="dis-sales" id="'+data.subAccountNumber+'" onclick=accountManager.showFetchedSubAccountDetail('+data.subAccountNumber+',this)><td style="width:100%"><div style=" margin: 0px; margin-top:2px; margin-bottom:2px;"><table style="width: 100%;  margin-left: 0px;"><tbody><tr>';
					
				if(data.status=='true'||data.status==undefined||data.status=='')
				{
					builder+='<td class="color-code-td" style="background-color: #5cb85c;width: 5px; height:46px" rowspan="2"></td>';
				}else{
					builder+='<td class="color-code-td" style="background-color: #FF5050;width: 5px; height:46px" rowspan="2"></td>';
				}
				
				builder+='<td class="account-type-td" rowspan="2" style=" width: 40px; padding-left: 20px;">';
				
				var interactionType = "";
				
				if(data.interactionTypeId == undefined || data.interactionTypeId == null || data.interactionTypeId == "")
				{
					interactionType = data.interactionTypeId;
				}
				else
				{
					interactionType = data.interactionTypeId
				}
				
				if(interactionType == "8333d8c0-e22a-4e32-9bf5-0f578461823e")
				{
					 builder+=	'<i class="fa fa-hand-o-up" id="inticon" style=" font-size: 21px;"></i>';
				}
				
				else if(interactionType == "84d52042-cc6d-4df8-acf4-1ecc278f790e")
				{
					 builder+=	'<i class="fa fa-envelope" id="inticon" style=" font-size: 21px; padding-right:6px"></i>';
				}
				
				else if(interactionType == "a7359531-3e43-4da1-be98-5a1392638e42")
				{
					 builder+=	'<i class="fa fa-envelope-o" id="inticon" style=" font-size: 21px; padding-right:6px"></i>';
				}
				
				else if(interactionType == "b3485731-3c4e-4eeb-a15e-c5bc41286205")
				{
					 builder+=	'<i class="fa fa-phone" id="inticon" style=" font-size: 21px;"></i>';
				}
				else if(interactionType == "b9eafcf0-a770-412d-a557-6ec203641bb0")
				{
					 builder+=	'<i class="fa fa-phone" id="inticon" style=" font-size: 21px;"></i>';
				}
				else if(interactionType == "8405312c-4f51-42a9-bb55-3543d22e4569")
				{
					 builder+=	'<i class="fa fa-phone" id="inticon" style=" font-size: 21px;"></i>';
				}else if(interactionType == "70158413-3ae0-4896-80b7-50d411ad0cd2")
				{
					 builder+=	'<i class="fa fa-comment" id="inticon" style=" font-size: 21px;"></i>';
				}
				else{
					 builder+=	'<i class="fa fa-bolt" id="inticon" style=" font-size: 21px; padding-right: 12px;  padding-left: 5px;"></i>';
					}
				

				builder+='</td><td class="domain-name-td" style="font-size: 12px;  font-weight: bold;">';
				builder+='<div class="domain-name text-dot" style=" text-overflow: ellipsis;  overflow: hidden;  white-space: nowrap;">';
				if(data.domainName != undefined)
				    builder+=(data.domainName.length>20? data.domainName.substr(0,19)+"..." : data.domainName)+'</div></td></tr>';
				else
				    builder+='NA </div></td></tr>';
 
				builder+='<tr><td><div style="text-overflow: ellipsis;  overflow: hidden;  white-space: nowrap;">';
				builder+=data.subAccountNumber+'</div></td></tr></tbody></table></div></td><td style=""></td></tr>';	
			
		dom.append(builder);
		this.container=$('#'+this.subAccountNumber);
		
			}
	},
	
	this.destroy=function(){
		this.container.remove();
	}
}
var cards=[];
var tempCards={};

var accountManager =
{
		
		createAccount				:	false,
		isModified					:   false,
		AccountData					:	new Object(),
		mainSkillList				:	new Object(),
		OverflowSkillList			:	new Object(),
		overflowSkillRecursiveMap	:	new Object(),
		pendIntLookupsList          :   new Object(),
		mainSkillRecursiveMap		:	new Object(),
		Id							:	"",
		datastring					:	"[]",
		//fetch data for subAccountNumber
		getSubAccountList	:	function(accountNo){
			var url 	=	"/fetchSubaccounts?subAccountNumber=null&accountNumberorSkill="+accountNo;
			console.log(url);
			$.ajax
			({
				type : "GET",
				url : url,
				async:true,
				success : function(data)
				{
					
					var accountList				=	JSON.parse(data);
					accountList					=   validateStatusandAccount(accountList); 
					accountManager.datastring	=	JSON.stringify(accountList);
					
					if(accountList.length==0){
						messageWindow.popUpMessage( "Invalid Account", 3000);
						$('#subacc_table_data').html("");
						$('#callDe-form').val('');
						$('.panel2').slideUp();
						$('.panel1').slideDown();
						$('.panel3').slideUp();
						$('.panel5').slideUp();
						$('.panel4').slideUp();
						$('.panelPending').slideUp();
						
						$('#fetchtab1').trigger('click');
						$('#fetchinbox').select();
						$('#fetchinbox').focus();
						return;
					}
					
					$('#fetchinbox').val('');
					accountList.sort(function(a,b){
					      if( a['subAccountNumber'] > b['subAccountNumber']){
					    	  return 1;
					      }else if( a['subAccountNumber'] < b['subAccountNumber'] ){
					    	  return -1;
					      }
					      return 0;
					   });
					   console.log("accountList is"+accountList.length);
					var TempActiveList=[];
					var TempInactiveList=[];
					for(var ele in accountList){
						if(accountList[ele].status=='false')
							TempInactiveList.push(accountList[ele]);
						else
							TempActiveList.push(accountList[ele]);
					}	
					var accountList=TempActiveList.concat(TempInactiveList);
					accountManager.AccountData = accountList[0];
					
					if(accountManager.AccountData.accountNumber != "" && accountManager.AccountData.accountNumber != undefined)
					{
						accountManager.fillAccounDataToPage();	
						if(mode	==	"STAGING")
						{
							if(accountManager.AccountData.staging_skill != undefined)
								accountManager.getAgentDetailsBySkill(accountManager.AccountData.staging_skill,"main")
							if(accountManager.AccountData.overflow_staging_skill != undefined)
							accountManager.getAgentDetailsBySkill(accountManager.AccountData.overflow_staging_skill,"overflow")
						}
						else
						{
							if(accountManager.AccountData.live_skill != undefined)
								accountManager.getAgentDetailsBySkill(accountManager.AccountData.live_skill,"main")
							if(accountManager.AccountData.overflow_live_skill != undefined)
								accountManager.getAgentDetailsBySkill(accountManager.AccountData.overflow_live_skill,"overflow")
						}
						messageWindow.popUpMessage( "Account Fetched Successfully", 3000);
						$("#profile_Detail").html("Profile Details : "+accountManager.AccountData.subAccountNumber);
						
						//deactivate menu
						console.log("the first part");
						console.log(JSON.stringify(accountManager.AccountData));
						console.log(accountManager.AccountData.status);

						
					var statusvalue = accountManager.AccountData.status;
						
						//var statusvalue = "false";
						if (statusvalue == "true")
							{
								
								$("#paraforActivate").html("");
								$("#dynamicslideractivate").html("Deactivate account");
								$('#activatebutton').prop('disabled',true);
								$('#activatebutton').removeClass('btn-success');
								$('#deactivatebutton').addClass('btn-danger');
								$('#deactivatebutton').prop('disabled',false);
								$('#addclassbox').removeClass("panel-success");
								$('#addclassbox').addClass("panel-danger");
								$('#actboxheading').html("Deactivation");
								$('#actboxcontent').html("Are you sure you want to deactivate the account : "+accountManager.AccountData.subAccountNumber+" ?<br><br><button id = 'deactivateyes'type='button' class='btn btn-danger'>Yes</button> <button id = 'deactivateno'type='button' class='btn btn-success'>No</button>");
								$('#deactivateyes').click(function()
								{
									accountManager.AccountData.activeStatus = "false";
									accountManager.AccountData.status = "false";
									accountManager.postNewDataToUpdate("deactivate");									
								});
								$('#deactivateno').click(function()
								{

									$('#messageboxforactivate').slideToggle('slow');

								});

					}
						else if (statusvalue == "false")
							{
								$("#paraforActivate").html("");
								$("#dynamicslideractivate").html("Activate account");
								$('#activatebutton').prop('disabled',false);
								$('#deactivatebutton').prop('disabled',true);
								$('#deactivatebutton').removeClass('btn-danger');
								$('#activatebutton').addClass('btn-success');
								$('#addclassbox').removeClass("panel-danger");
								$('#addclassbox').addClass("panel-success");
								$('#actboxheading').html("Activation");
								$('#actboxcontent').html("Are you sure you want to activate the account : "+accountManager.AccountData.subAccountNumber+"?<br><br><button id = 'activateyes'type='button' class='btn btn-success'>Yes</button> <button id = 'deactivateno'type='button' class='btn btn-danger'>No</button>");
								$('#activateyes').click(function()
								{
									accountManager.AccountData.activeStatus ="true";
									accountManager.AccountData.status = "true";
									accountManager.postNewDataToUpdate("activate");									
								});
									$('#deactivateno').click(function()
								{
									$('#messageboxforactivate').slideToggle('slow');

								});
								
					}
					else
					{
							
						$("#paraforActivate").html("");
						$("#dynamicslideractivate").html("Deactivate account");
						$('#activatebutton').prop('disabled',true);
						$('#activatebutton').removeClass('btn-success');
						$('#deactivatebutton').addClass('btn-danger');
						$('#deactivatebutton').prop('disabled',false);
						$('#addclassbox').removeClass("panel-success");
						$('#addclassbox').addClass("panel-danger");
						$('#actboxheading').html("Deactivation");
						$('#actboxcontent').html("Are you sure you want to deactivate the account : "+accountManager.AccountData.subAccountNumber+" ?<br><br><button id = 'deactivateyes'type='button' class='btn btn-danger'>Yes</button> <button id = 'deactivateno'type='button' class='btn btn-success'>No</button>");
						$('#deactivateyes').click(function()
						{
							accountManager.AccountData.status = "false";
							accountManager.postNewDataToUpdate("deactivate");									
						});
						$('#deactivateno').click(function()
						{

							$('#messageboxforactivate').slideToggle('slow');

						});
							}
					//
					}
					else
					{
						messageWindow.popUpMessage( "Enter a valid SubAccountNumber", 2000 );
					}
					accountManager.buildSideBar(accountList,null);
					
					cards = accountList;
					}
			});
			
		},
		buildSideBar			: 	function(data,subAccountNumber)
		{
			$('.left_navbar').html('');
			data.sort(function(a,b){
			      if( a['subAccountNumber'] > b['subAccountNumber']){
			          return 1;
			      }else if( a['subAccountNumber'] < b['subAccountNumber'] ){
			          return -1;
			      }
			      return 0;
			   });

			var TempActiveList=[];
			var TempInactiveList=[];
			for(var ele in data){
				if(data[ele].status=='false')
					TempInactiveList.push(data[ele]);
				else
					TempActiveList.push(data[ele]);
			}	
			var accountList=TempActiveList.concat(TempInactiveList);
			for(var data in accountList)
			{
				tempCards[accountList[data].subAccountNumber]=new card(accountList[data]);
				tempCards[accountList[data].subAccountNumber].render($('#subacc_table_data'));
			}
			
			if(subAccountNumber == null)
			{
				$('#subacc_table_data').find('tr:first').addClass('active-li');
			}
			else
			{
				$.each(accountList,function(index,eachData)
				{
					if(eachData.subAccountNumber == subAccountNumber)
						$('#'+subAccountNumber).addClass('active-li');
				});
			}
			},
		showFetchedSubAccountDetail			:	function (subAccountNumber,domElement)
		{
			$("#messageboxforactivate").slideUp();
			accountManager.initializeFormField();
			var current = null ;
			if(!!domElement){
				current	=	domElement.id;
				$('#'+current).addClass('active-li');
				$('.dis-sales').not(domElement).removeClass('active-li');
			}
			else{
				current	=	subAccountNumber;
				$('.dis-sales').removeClass('active-li');
				$('#'+current).addClass('active-li');
			}
			console.log("The subaccount number obtained is--->",subAccountNumber);
			var accountList	=	JSON.parse(accountManager.datastring);;
			$.each(accountList,function(index,Accountpara)
			{
				if(Accountpara.subAccountNumber == subAccountNumber)
				{
					accountManager.AccountData 			=  Accountpara;
				}
			})
			accountManager.mainSkillList		=	new Array();
			accountManager.OverflowSkillList	=	new Array();
			
			if(accountManager.AccountData.accountNumber != "" && accountManager.AccountData.accountNumber != undefined)
			{
				accountManager.fillAccounDataToPage();	
				if(mode	==	"STAGING")
				{
					if(accountManager.AccountData.staging_skill != undefined)
						accountManager.getAgentDetailsBySkill(accountManager.AccountData.staging_skill,"main")
					if(accountManager.AccountData.overflow_staging_skill != undefined)
					accountManager.getAgentDetailsBySkill(accountManager.AccountData.overflow_staging_skill,"overflow")
				}
				else
				{
					if(accountManager.AccountData.live_skill != undefined)
						accountManager.getAgentDetailsBySkill(accountManager.AccountData.live_skill,"main")
					if(accountManager.AccountData.overflow_live_skill != undefined)
						accountManager.getAgentDetailsBySkill(accountManager.AccountData.overflow_live_skill,"overflow")
				}
				
				$("#profile_Detail").html("Profile Details : "+accountManager.AccountData.subAccountNumber);
			
				//	 deactivate menu
				console.log("this is the accountsdata"+JSON.stringify(accountManager.AccountData));
				var statusvalue = accountManager.AccountData.status;
			//	var statusvalue = "false";

				if (statusvalue == "true")
					{
						
					$("#paraforActivate").html("");
					$("#dynamicslideractivate").html("Deactivate account");
					$('#activatebutton').prop('disabled',true);
					$('#activatebutton').removeClass('btn-success');
					$('#deactivatebutton').addClass('btn-danger');
					$('#deactivatebutton').prop('disabled',false);
					$('#addclassbox').removeClass("panel-success");
					$('#addclassbox').addClass("panel-danger");
					$('#actboxheading').html("Deactivation");
					$('#actboxcontent').html("Are you sure you want to deactivate the account : "+accountManager.AccountData.subAccountNumber+" ?<br><br><button id = 'deactivateyes'type='button' class='btn btn-danger'>Yes</button> <button id = 'deactivateno'type='button' class='btn btn-success'>No</button>");
					$('#deactivateyes').click(function()
							{
						accountManager.AccountData.status = "false";
						accountManager.postNewDataToUpdate("deactivate");									
							});
					$('#deactivateno').click(function()
							{
										$('#messageboxforactivate').slideToggle('slow');

							});


					}
				else if (statusvalue == "false")
					{
						$("#paraforActivate").html("");
						$("#dynamicslideractivate").html("Activate account");
						$('#activatebutton').prop('disabled',false);
						$('#deactivatebutton').prop('disabled',true);
						$('#deactivatebutton').removeClass('btn-danger');
						$('#activatebutton').addClass('btn-success');
						$('#addclassbox').removeClass("panel-danger");
						$('#addclassbox').addClass("panel-success");
					
						$('#actboxheading').html("Activation");
						$('#actboxcontent').html("Are you sure you want to activate the account : "+accountManager.AccountData.subAccountNumber+"?<br><br><button id = 'activateyes'type='button' class='btn btn-success'>Yes</button> <button id = 'deactivateno'type='button' class='btn btn-danger'>No</button>");
						$('#activateyes').click(function()
								{
							accountManager.AccountData.status = "true";
							accountManager.postNewDataToUpdate("activate");									
								});
						$('#deactivateno').click(function()
								{
											$('#messageboxforactivate').slideToggle('slow');

								});

						
					}
				else
					{
					
					$("#paraforActivate").html("");
					$("#dynamicslideractivate").html("Deactivate account");
					$('#activatebutton').prop('disabled',true);
					$('#activatebutton').removeClass('btn-success');
					$('#deactivatebutton').addClass('btn-danger');
					$('#deactivatebutton').prop('disabled',false);
					$('#addclassbox').removeClass("panel-success");
					$('#addclassbox').addClass("panel-danger");
					$('#actboxheading').html("Deactivation");
					$('#actboxcontent').html("Are you sure you want to deactivate the account : "+accountManager.AccountData.subAccountNumber+" ?<br><br><button id = 'deactivateyes'type='button' class='btn btn-danger'>Yes</button> <button id = 'deactivateno'type='button' class='btn btn-success'>No</button>");
					$('#deactivateyes').click(function()
					{
						accountManager.AccountData.status = "false";
						
						accountManager.postNewDataToUpdate("deactivate");									
					});
					$('#deactivateno').click(function()
					{

						$('#messageboxforactivate').slideToggle('slow');

					});
					}
				//
				
			}
			$( ".collapse4" ).trigger( "click" );
		},
		getPendingInteractionsLookups  :   function(subAccountNumber)
		{
			messageWindow.showMessage("Fetching Lookups...");
			if("" != subAccountNumber)
			{
				$.ajax({
						type    : "POST",
						url     : "/getNumberofUploadsBySubAccountNo?subacc="+subAccountNumber , 
				}).done(function(data){
						accountManager.pendIntLookupsList = JSON.parse(data);
						accountManager.fillPendingInteractionLookupsInDOM(accountManager.pendIntLookupsList);
						accountManager.islookupsfetched = true;
				
				if(!accountManager.pendIntLookupsList || accountManager.pendIntLookupsList == "")
				{
					messageWindow.popUpMessage("No Lookups Present!",1500);
				}
				else
				{
					$('.totalUploaded').html('Loading...');
					$('.noOfPendingInteractions').html('Loading...');
					messageWindow.popUpMessage("Lookups Fetched Successfully.!",1500);
					accountManager.getPendingInteractions();
				}
			});
			}
		},
		getPendingInteractions : function()
		{
			$("#messageboxforactivate").slideUp();
			$('.panel2').slideUp();
			$('.panel1').slideUp();
			$('.panel3').slideUp();
			$('.panel5').slideUp();
			$('.panel4').slideUp();
			$('.panelPending').slideDown();
			
			if(accountManager.pendIntLookupsList.length>0)
			{
				var lookupList = accountManager.pendIntLookupsList;
				var lookupEntry = [];
				
				for(var i=0;i<lookupList.length;i++)
				{
					lookupEntry[0] =  lookupList[i];
					$.ajax({
					url 		: '/getNumberOfPendingInteractions',
					type 		: 'POST',
					data 		: JSON.stringify(lookupEntry),
					contentType	: "application/json",
					success		: function(responseData)
					{
						if(responseData != "")
						{
							var pendingInteractionsMap = JSON.parse(responseData);
							var totalPending = 0;
							var IntIdList 	 = [];
							for(var uploadTime in pendingInteractionsMap)
							{
								totalPending = 0;
								IntIdList	 = [];
								$('#totalUploaded_'+uploadTime).html(pendingInteractionsMap[uploadTime].length);
								for(var i=0;i<pendingInteractionsMap[uploadTime].length;i++)
								{
									if(pendingInteractionsMap[uploadTime][i].interactionStatusList[(pendingInteractionsMap[uploadTime][i].interactionStatusList).length - 1].status == "Pending")
									{
										totalPending = totalPending + 1;
										IntIdList[IntIdList.length] = pendingInteractionsMap[uploadTime][i].interactionId;
									}
								}
								$('#noOfPendingInteractions_'+uploadTime).html(totalPending);
							}
							
						}
					},
					error		: function(data)
					{
						console.log("Its a failure, you are dead meat");
					}
				});
				}
			}
		
			
		},
		fillPendingInteractionLookupsInDOM 	: function(lookupsList)
		{
			var lookupEntryObj = {};
 			var trEntry	= "";
 			var fileName = "";
			$('#lookupTable').html('');
			for(var i=0;i<lookupsList.length;i++)
			{
				lookupEntryObj = lookupsList[i];
				var dateUploaded  = getPDTDateTime(new Number(lookupEntryObj.uploadTime));
				if(lookupEntryObj.fileName)
					fileName = lookupEntryObj.fileName;
				else
					fileName = "NA";
				trEntry = "<tr id='lookEntry_"+lookupEntryObj.uploadTime+"'><td id='uploadTime_"+lookupEntryObj.uploadTime+"'>"+dateUploaded+"</td><td>"+fileName+"</td><td class='totalUploaded' id='totalUploaded_"+lookupEntryObj.uploadTime+"'>Loading...</td><td class='noOfPendingInteractions' id='noOfPendingInteractions_"+lookupEntryObj.uploadTime+"'>Loading...</td><td id='status_"+lookupEntryObj.uploadTime+"'>"+(((lookupEntryObj.status) == true) ? "Active" : "Disabled")+"<td><button type='button' onclick='accountManager.activateordeactivatePendingLookup(this)' id='activatePending_"+lookupEntryObj.uploadTime+"' class='btn btn-success' "+(((lookupEntryObj.status) == true) ? "disabled" : "")+"><span class='glyphicon glyphicon-ok-sign' aria-hidden='true'></span></button>&nbsp&nbsp<button type='button' onclick='accountManager.activateordeactivatePendingLookup(this)' id='deactivatePending_"+lookupEntryObj.uploadTime+"' class='btn btn-danger' "+(((lookupEntryObj.status) == true) ? "" : "disabled")+"><span class='glyphicon glyphicon-remove-sign' aria-hidden='true'></span></button></td></tr>";
				$('#lookupTable').append(trEntry);
			}
		},
		fillAccounDataToPage	:	function()
		{			
			var accountData		=	accountManager.AccountData;
			var campaginValue	=	"";
			
			if(accountData.interactionTypeId == undefined || accountData.interactionTypeId == null || accountData.interactionTypeId == "")
			{
				var interactiontype = accountData.interactionTypeId;
			}			
			else
			{
				var interactiontype = accountData.interactionTypeId;
			}
			if(interactiontype == "84d52042-cc6d-4df8-acf4-1ecc278f790e" || interactiontype == "a7359531-3e43-4da1-be98-5a1392638e42")
			{
				//1ecc278f790e email response
				//5a1392638e42 email outbound
				if(interactiontype == "84d52042-cc6d-4df8-acf4-1ecc278f790e")
					campaginValue	=	"Email Response";
				if(interactiontype == "a7359531-3e43-4da1-be98-5a1392638e42")
					campaginValue	=	"Email Outbound";	
				document.getElementById('email-table').style.display	=	"block";
				$('.collapse2').show();
				$('.collapse3').show();
			}
		else if(interactiontype == "8333d8c0-e22a-4e32-9bf5-0f578461823e" || interactiontype == "b3485731-3c4e-4eeb-a15e-c5bc41286205"
				|| interactiontype == "b9eafcf0-a770-412d-a557-6ec203641bb0" || interactiontype == "8405312c-4f51-42a9-bb55-3543d22e4569")
			{
				//0f578461823e click to talk
				//c5bc41286205 calllist outbound
			if(interactiontype == "8333d8c0-e22a-4e32-9bf5-0f578461823e")
				campaginValue	=	"Click to Talk";
			if(interactiontype == "b3485731-3c4e-4eeb-a15e-c5bc41286205")
				campaginValue	=	"Calllist Outbound";
			if(interactiontype == "b9eafcf0-a770-412d-a557-6ec203641bb0")
				campaginValue	=	"Task Router";
			if(interactiontype == "8405312c-4f51-42a9-bb55-3543d22e4569")
				campaginValue	=	"V2 Work Items";
			document.getElementById('email-table').style.display	=	"none";
			$('.collapse2').show();
			$('.collapse3').show();
			$('.collapsePending').show();
			}
		else if(interactiontype == "70158413-3ae0-4896-80b7-50d411ad0cd2" )
			{
				campaginValue	=	"Chat Interaction"
				document.getElementById('email-table').style.display	=	"none";
				$('.collapse2').hide();
				$('.collapse3').hide();
				$('.collapsePending').hide();
			}
			//profile detail filler
			document.getElementById('ar-Id').className = "";
			document.getElementById('chat-Id').className = "";
			if(accountData.interactionTypeId == "8333d8c0-e22a-4e32-9bf5-0f578461823e" || accountData.interactionTypeId == "84d52042-cc6d-4df8-acf4-1ecc278f790e" 
					|| accountData.interactionTypeId == "a7359531-3e43-4da1-be98-5a1392638e42" || accountData.interactionTypeId == "b3485731-3c4e-4eeb-a15e-c5bc41286205" 
							|| accountData.interactionTypeId == "b9eafcf0-a770-412d-a557-6ec203641bb0" || accountData.interactionTypeId == "8405312c-4f51-42a9-bb55-3543d22e4569")
			{
				document.getElementById('ar-Id').className = "active-radio";
				$('#domin-form').val(accountData.domainName);
			}
			else
			{
				document.getElementById('chat-Id').className = "active-radio";
				$('#domin-form').val("no Domain");
			}
			$('#profile-form').val(accountData.subAccountNumber);
			
			
			//Email type fields
			
			$('#email-form').val(!!accountData.emailAddress?accountData.emailAddress: "null");
			$('#EmailPass-form').val(!!accountData.emailPassword?accountData.emailPassword: "null");
			$('#client-email').val(accountData.clientEmailAddress);
			$('#client-EmailPass').val(accountData.clientPassword);
			$('#Alias-form').val(accountData.alias);
			$('#cc-form').val(accountData.cc);
			$('#bcc-form').val(accountData.bcc);
			
			
			//additional Configuration filler
			
			$('#callDe-form').val(accountData.callDelay);
			$('#campDe-form').val(accountData.campaignDelay);
			$('#formname-form').val(accountData.formName);
			$('#pauseD-form').val('65535');
			$('#pause_button').html(accountData.pauseEvent);
			$('#campagin-val').val(campaginValue);
			$('#inter-drop').html(accountData.internationalDialing);
			$('#allow-drop').html(accountData.allowf8);
			$('#intrupt-drop').html(accountData.isInterruptable);
			$('#prefered-form').val(accountData.preferredurl);
			$('#expirtime-form').val(accountData.expirationTime);
			
			$(".errTime").removeClass('errTime');
			$('.timezone').selectpicker('val','PDT');
			
			var timeObj = null;
			timeObj = splitTimeStamp(accountData.startTime, false);
			$('#startTime').val(timeObj.time);
			$('.timezone').selectpicker('val',timeObj.zone);
			
			timeObj = splitTimeStamp(accountData.stopTime, false);
			$('#stopTime').val(timeObj.time);
			$('.timezone').selectpicker('val',timeObj.zone);
			
			timeObj = splitTimeStamp(accountData.triggerTime, false);
			$('#triggerTime').val(timeObj.time);
			$('.timezone').selectpicker('val',timeObj.zone);
			
			try
			{
				var excludeDays = accountData.excludeDays.split(',');
				$('.excludeDaysPicker').selectpicker('val',excludeDays);
				
				$.each(excludeDays,function(index,value)
				{
					$('.exceptionalDaysPicker').find('[value='+value+']').prop('disabled',true);
				});
				$('.exceptionalDaysPicker').selectpicker('render');
			}
			catch(e)
			{
				$('.excludeDaysPicker').selectpicker('val',"");
			}
			
			try
			{
				var exceptionalDays = accountData.exceptionalDays.split(',');
				$('.exceptionalDaysPicker').selectpicker('val',exceptionalDays);
				
				$.each(exceptionalDays,function(index,value)
				{
					$('.excludeDaysPicker').find('[value='+value+']').prop('disabled',true);
				});
				$('.excludeDaysPicker').selectpicker('render');
			}
			catch(e)
			{
				$('.exceptionalDaysPicker').selectpicker('val',"");
			}
			
			$('#expectedtimeToCompl').val(accountData.expectedTimeToComplete);
			$('#arFrequency-rules').val(accountData.arFrequency);
			
			timeObj = splitTimeStamp(accountData.exceptionalDayStartTime, false);
			$('#exceptionalDayStartTime').val(timeObj.time);
			$('.timezone').selectpicker('val',timeObj.zone);
			
			timeObj = splitTimeStamp(accountData.exceptionalDayStopTime, false);
			$('#exceptionalDayStopTime').val(timeObj.time);
			$('.timezone').selectpicker('val',timeObj.zone);
		
			if(!!accountData.ignoreRules && accountData.ignoreRules.toLowerCase() == "false"	)
				$('#ignore-rules').html('false');
			else
				$('#ignore-rules').html('true');
			
			if(!!accountData.actionOnExcludeDays && accountData.actionOnExcludeDays == "InActive"	)
				$('#excludeDays-rules').html('Ignore Interactions');
			
			$('#probAlerEmail-rules').val(accountData.problemAlertEmailId);
			$('#inqueReqTime-rules').val(accountData.inQueueReqTime);
			$('#inprogtime-rules').val(accountData.inProgressReqTime);
			$('#ansreqtime-rules').val(accountData.answeredReqTime);
			$('#auto-reschd-drop').html(accountData.autoRescheduling);
			
			//skill configuration
			if(mode	==	"LIVE")
				{
					$('#skillTi-form').val(accountData.live_skill);
					$('#defaultSkill').html('Current skill : '+accountData.live_skill);
				}
			else
				{
					$('#skillTi-form').val(accountData.staging_skill);
					$('#defaultSkill').html('Current skill : '+accountData.staging_skill);
				}
			if(mode == "LIVE")
			{
				if(accountData.overflow_live_skill	==	undefined || accountData.overflow_live_skill	==	'OFF')
				{
					document.getElementById('overflow-skill').checked =false;
				}
				else
				{
					document.getElementById('overflow-skill').checked =true;
				}
			}
			else
			{
				if(accountData.overflow_staging_skill	==	undefined || accountData.overflow_staging_skill	==	'OFF')
				{
					document.getElementById('overflow-skill').checked =false;
				}
				else
				{
					document.getElementById('overflow-skill').checked =true;
				}
			}
			
			var tempFlag=false;
			//profile details
			if(!$('#chat-Id').hasClass('active-radio') && !$('#ar-Id').hasClass('active-radio'))
			{
				$('#chat-Id').find('span').css('border-color','red');
			 	$('#ar-Id').find('span').css('border-color','red');
			 	tempFlag=true;
			}else{
				if(!tempFlag)
					tempFlag=false;
				$('#chat-Id').find('span').css('border-color','rgb(208, 208, 208)');
			 	$('#ar-Id').find('span').css('border-color','rgb(208, 208, 208)');
			}
			
			if($('#domin-form').val() == '' || $('#domin-form').val() == undefined)
			{
				$('#domin-form').css('border-color','red');
				tempFlag=true;
			}	
			else{
				$('#domin-form').css('border-color','rgb(208, 208, 208)');
				if(!tempFlag)
					tempFlag=false;
			}
			if($('#campagin-val').val() == '' || $('#campagin-val').val() == undefined){
				$('#campagin-val').css('border-color','red');
				tempFlag=true;
			}else{
				$('#campagin-val').css('border-color','rgb(208, 208, 208)');
				if(!tempFlag)
					tempFlag=false;
			}
			if(tempFlag){
				$( ".collapse1" ).trigger( "click" );
				return;
			}
			
			//addition configuration
			if($('#callDe-form').val() == '' || $('#callDe-form').val() == undefined)
			{
				$('#callDe-form').css('border-color','red');
				tempFlag=true;
			}else{
				console.log('wroking false');
				$('#callDe-form').css('border-color','rgb(208, 208, 208)');
				if(!tempFlag)
					tempFlag=false;
			}
			if($('#campDe-form').val() == '' || $('#campDe-form').val() == undefined)
			{
				$('#campDe-form').css('border-color','red');
				tempFlag=true;
			}else{
				$('#campDe-form').css('border-color','rgb(208, 208, 208)');if(!tempFlag)
					tempFlag=false;
			}
			if($('#formname-form').val() == '' || $('#formname-form').val() == undefined)
			{
				$('#formname-form').css('border-color','red');
				tempFlag=true;
			}else{
				$('#formname-form').css('border-color','rgb(208, 208, 208)');if(!tempFlag)
					tempFlag=false;
			}
			
			if($('#email-table').css('display')=='block'){
				if($('#email-form').val() == '' || $('#email-form').val() == undefined)
				{
					$('#email-form').css('border-color','red');
					tempFlag=true;
				}else{
					$('#email-form').css('border-color','rgb(208, 208, 208)');if(!tempFlag)
						tempFlag=false;
				}
				if($('#EmailPass-form').val() == '' || $('#EmailPass-form').val() == undefined)
				{
					$('#EmailPass-form').css('border-color','red');
					tempFlag=true;
				}else{
					$('#EmailPass-form').css('border-color','rgb(208, 208, 208)');if(!tempFlag)
						tempFlag=false;
				}		
				}
			
			if(tempFlag){
				$( ".collapse2" ).trigger( "click" );
				return;
			}else
				{
				$( ".collapse4" ).trigger( "click" );
				}
			
		},
		
		getDataFromPage		:	function()
		{
			var newAccountMap 					=		accountManager.AccountData;
			newAccountMap.domainName 			=		$('#domin-form').val();
			newAccountMap.emailAddress			=		$('#email-form').val();
			newAccountMap.emailPassword			=		$('#EmailPass-form').val();
			newAccountMap.clientEmailAddress	=		$('#client-email').val();
			newAccountMap.clientPassword		=		$('#client-EmailPass').val();
			newAccountMap.alias					=		$('#Alias-form').val();
			newAccountMap.cc					=		$('#cc-form').val();
			newAccountMap.bcc					=		$('#bcc-form').val();
			newAccountMap.callDelay				=		$('#callDe-form').val();
			newAccountMap.campaignDelay			=		$('#campDe-form').val();
			newAccountMap.pauseDuration			=		$('#pauseD-form').val();
			newAccountMap.formName				=		$('#formname-form').val();
			newAccountMap.pauseEvent			=		$('#pause_button').html();
		//	newAccountMap.intertype				=		"8333d8c0-e22a-4e32-9bf5-0f578461823e";
			newAccountMap.internationalDialing	=		$('#inter-drop').html();
			newAccountMap.allowf8				=		$('#allow-drop').html();
			newAccountMap.isInterruptable		=		$('#intrupt-drop').html();
			newAccountMap.preferredurl			=		encodeURIComponent($('#prefered-form').val());
			newAccountMap.expirationTime		=		$('#expirtime-form').val();
			//ettrull filler
			newAccountMap.startTime				=		!!$('#startTime').val() ?  $('#startTime').val() +' ' + $('#startZone').val():"";
			newAccountMap.stopTime				=		!!$('#stopTime').val() ?  $('#stopTime').val() +' ' + $('#stopZone').val():"";
			newAccountMap.triggerTime			=		!!$('#triggerTime').val() ?  $('#triggerTime').val() +' ' + $('#triggerZone').val():"";
			
			try
			{
				newAccountMap.excludeDays		=       $('.excludeDaysPicker').val().join(",");
			}
			catch(e)
			{
				newAccountMap.excludeDays 	    =       "";
			}
			
			try
			{
				newAccountMap.exceptionalDays   =		$('.exceptionalDaysPicker').val().join(",");
			}
			catch(e)
			{
				newAccountMap.exceptionalDays   =        "";
			}
			
			
			newAccountMap.exceptionalDayStartTime	=		!!$('#exceptionalDayStartTime').val() ?  $('#exceptionalDayStartTime').val() +' ' + $('#exStartZone').val():"";
			newAccountMap.exceptionalDayStopTime	=		!!$('#exceptionalDayStopTime').val() ?  $('#exceptionalDayStopTime').val() +' ' + $('#exStopZone').val():"";
			newAccountMap.ignoreRules				=		$('#ignore-rules').html();
			newAccountMap.autoRescheduling          =       $('#auto-reschd-drop').html();
			newAccountMap.expectedTimeToComplete    =       $('#expectedtimeToCompl').val();
			newAccountMap.arFrequency   			=       $('#arFrequency-rules').val();
			
			if($('#excludeDays-rules').html() == "Ignore Interactions")
				newAccountMap.actionOnExcludeDays	= "InActive";
			else if($('#excludeDays-rules').html() == "Schedule Interactions")
				newAccountMap.actionOnExcludeDays	= "Schedule";
			
			newAccountMap.problemAlertEmailId	=		$('#probAlerEmail-rules').val();
			newAccountMap.inQueueReqTime		=		$('#inqueReqTime-rules').val();
			newAccountMap.inProgressReqTime		=		$('#inprogtime-rules').val();
			newAccountMap.answeredReqTime		=		$('#ansreqtime-rules').val();
			newAccountMap.oldSkill				=		"";
			if(newAccountMap.status == undefined || newAccountMap.status == "")
			{
				newAccountMap.status = "true";
			}
			
			
			
			
			if($('#campagin-val').val()		==	"Email Response")
				newAccountMap.campaign		=	"84d52042-cc6d-4df8-acf4-1ecc278f790e";
			else if($('#campagin-val').val()	==	"Email Outbound")
				newAccountMap.campaign		=	"a7359531-3e43-4da1-be98-5a1392638e42";
			else if($('#campagin-val').val()	==	"Click to Talk")
				newAccountMap.campaign		=	"8333d8c0-e22a-4e32-9bf5-0f578461823e";	
			else if($('#campagin-val').val()	==	"Calllist Outbound")
				newAccountMap.campaign		=	"b3485731-3c4e-4eeb-a15e-c5bc41286205";
			else if($('#campagin-val').val()	==	"Task Router")
				newAccountMap.campaign		=	"b9eafcf0-a770-412d-a557-6ec203641bb0";
			else if($('#campagin-val').val()	==	"V2 Work Items")
				newAccountMap.campaign		=	"8405312c-4f51-42a9-bb55-3543d22e4569";
			    newAccountMap.intertype			=	newAccountMap.campaign;
			    newAccountMap.interactionTypeId			=	newAccountMap.campaign;
			    
			if(accountManager.AccountData.live_skill ==	undefined	|| accountManager.AccountData.live_skill== '')
				newAccountMap.live_skill				=	"OFF";
			if(accountManager.AccountData.overflow_live_skill ==	undefined	|| accountManager.AccountData.overflow_live_skill== '')
				newAccountMap.overflow_live_skill		=	"OFF";	
			if(accountManager.AccountData.staging_skill ==	undefined	|| accountManager.AccountData.staging_skill== '')
				newAccountMap.staging_skill				=	"OFF";
			if(accountManager.AccountData.overflow_staging_skill ==	undefined	|| accountManager.AccountData.overflow_staging_skill== '')
				newAccountMap.overflow_staging_skill	=	"OFF";
					
			if(mode	==	"LIVE")
			{
				if(document.getElementById('overflow-skill').checked == false)
				{
					newAccountMap.overflow_live_skill		=	"OFF";	
				}
			}else
				if(document.getElementById('overflow-skill').checked == false)
				{
					newAccountMap.overflow_staging_skill	=	"OFF";	
				}
			if(document.getElementById('chat-Id').classList.contains("active-radio"))
			{
				newAccountMap.itype							=		"webchat";	
			}
			else
			{
				newAccountMap.itype							=		"ar";	
			}
			
	//		to fill only changed values in map
			if(!(accountManager.createAccount))
			{
				var tempMap		=	new Object();
				var accountList		=	JSON.parse(accountManager.datastring);
				$.each(accountList,function(index,dataparam)
				{
					if(dataparam.subAccountNumber ==	accountManager.AccountData.subAccountNumber)
					{
						tempMap		=		dataparam;
					}
				});
				
				var tempMap1  	=   new Object();
				$.each(newAccountMap, function(key, value) 
				{
					if( tempMap[key] != undefined)
					{
						if(newAccountMap[key] != tempMap[key])
					    {
					    	tempMap1[key]	   = newAccountMap[key];
					    }
					}
					else
					{
						if(newAccountMap[key] !="")
						{
							tempMap1[key]	   = newAccountMap[key];
						}
					}
				    	
				});
				if(!tempMap.hasOwnProperty("actionOnExcludeDays") && tempMap1.hasOwnProperty("actionOnExcludeDays"))
				{
					if("Schedule" == tempMap1["actionOnExcludeDays"])
					{
						delete tempMap1["actionOnExcludeDays"];
					}
				}
				
				tempMap1.intertype	    	= 	newAccountMap.intertype;
				tempMap1.campaign 			= 	newAccountMap.campaign;
				tempMap1.itype 				= 	newAccountMap.itype;
				tempMap1.subAccountNumber 	= 	newAccountMap.subAccountNumber;
				newAccountMap				=	tempMap1;
			}
			return 	newAccountMap;
		},
		postNewDataToUpdateNew		: 	function()
		{
			var statString  = 	statString;
			var newMap		=	accountManager.getDataFromPage();
			console.log("This is the value of newMap"+JSON.stringify(newMap));
			if(Object.keys(newMap).length == 4)
			{
				messageWindow.popUpMessage("No change to Update..", 1000);
				return;
			}
			if(mode == "LIVE")
			{
				if(newMap.live_skill == "OFF" && newMap.overflow_live_skill	==	"OFF")
				{
					messageWindow.popUpMessage( "Assign skill to proceed", 1000 );
					return;
				}
			}
			else
			{
				if(newMap.staging_skill == "OFF" && newMap.overflow_staging_skill	==	"OFF")
				{
					messageWindow.popUpMessage( "Assign skill to proceed", 1000 );
					return;
				}
			}
			if(mode	==	"LIVE")
			{
			    newMap.oldSkill  = oldSkillbeforechange;
			}
			else
			{
				newMap.oldSkill = oldSkillbeforechange;
			}
			newMap			=	accountManager.skillConstruction(newMap);
			var newString	=	JSON.stringify(newMap)
			if(statString == "update")
			{
				messageWindow.showMessage( "Saving Account...");
			}
			else if(statString == "activate")
			{
				messageWindow.showMessage( "Activating Account...");
			}
			else if(statString == "deactivate")
			{
				messageWindow.showMessage( "deactivating Account...");
			}
			var ListJson = JSON.parse(accountManager.datastring);
			var tempList = new Array();
			if(accountManager.createAccount)
			{
				ListJson.push(newMap);
				accountManager.datastring	=	JSON.stringify(ListJson);
				accountManager.buildSideBar(ListJson,newMap.clientId);
			}
			messageWindow.hideMessage();
			if(statString == "update")
			{
			messageWindow.popUpMessage( "Account Saved", 1000 );
			}
			else if(statString == "activate")
			{
				messageWindow.popUpMessage( "Account Activated", 1000 );
			}
			else if(statString == "deactivate")
			{
				messageWindow.popUpMessage( "Account Deactivated", 1000 );
			}
		
			accountManager.createAccount	= false;
			accountManager.isModified		=	false;
			$( "#profile_Detail" ).trigger( "click" );
		},
		
		postNewDataToUpdate 	:	function(statString)
		{
			var statString = statString;
			var newMap		=	accountManager.getDataFromPage();
			console.log("This is the value of newMap"+JSON.stringify(newMap));
			
			if(Object.keys(newMap).length == 4)
			{
					messageWindow.popUpMessage("No change to Update..", 1000);
					return;
			}
			
			if(mode == "LIVE")
			{
				if(newMap.live_skill == "OFF" && newMap.overflow_live_skill	==	"OFF")
				{
					messageWindow.popUpMessage( "Assign skill to proceed", 1000 );
					return;
				}
			}
			else
			{
				if(newMap.staging_skill == "OFF" && newMap.overflow_staging_skill	==	"OFF")
				{
					messageWindow.popUpMessage( "Assign skill to proceed", 1000 );
					return;
				}
			}
			newMap.oldSkill  = oldSkillbeforechange;
			if(newMap.itype != "webchat")
				newMap			=	accountManager.skillConstruction(newMap);
			var newString	=	JSON.stringify(newMap)
			var url 	=	"/updatearaccountskills";
			if(accountManager.createAccount)
			{
				var url 	=	"/createNewAccount";
			}
			console.log(url);
			if(statString == "update")
				{
			messageWindow.showMessage( "Saving Account...");
				}
			else if(statString == "activate")
			{
			messageWindow.showMessage( "Activating Account...");
			}
			else if(statString == "deactivate")
			{
			messageWindow.showMessage( "deactivating Account...");
			}
						
			$.ajax
			({
				type : "POST",
				url : url,
				async:true,
				data: newString,
			    contentType: "application/json",
				success : function(data)
				{
					var subAccountNumber = accountManager.AccountData.subAccountNumber;
					var ListJson = JSON.parse(accountManager.datastring);
					var tempList = new Array();
					if(accountManager.createAccount)
					{
							ListJson.push(newMap);
							accountManager.datastring	=	JSON.stringify(ListJson);
							accountManager.buildSideBar(ListJson,newMap.clientId);
					}
					else
					{
						$.each(ListJson,function(index,accountData)
						{
							if(accountData.subAccountNumber == newMap.subAccountNumber)
							{
								$.each(newMap, function(key, value) 
								{
									accountData[key] = newMap[key];
								});
							}	
							tempList.push(accountData);	
						});
						accountManager.datastring	=	JSON.stringify(tempList);
						$('#subacc_search_box').val('');
						accountManager.buildSideBar(ListJson,newMap.clientId);
					}
					messageWindow.hideMessage();
					if(statString == "update")
					{
					messageWindow.popUpMessage( "Account Saved", 1000 );
					}
					else if(statString == "activate")
					{
						messageWindow.popUpMessage( "Account Activated", 1000 );
					}
					else if(statString == "deactivate")
					{
						messageWindow.popUpMessage( "Account Deactivated", 1000 );
					}
				
					accountManager.createAccount	= false;
					accountManager.isModified		=	false;
					$( "#profile_Detail" ).trigger( "click" );
//
					var statusvalue = newMap.status;
					//		var statusvalue = "false";

							if (statusvalue == "true")
								{
									
									$("#paraforActivate").html("");
									$("#dynamicslideractivate").html("Deactivate account");
									$('#activatebutton').prop('disabled',true);
									$('#activatebutton').removeClass('btn-success');
									$('#deactivatebutton').addClass('btn-danger');
									$('#deactivatebutton').prop('disabled',false);
									$('#addclassbox').removeClass("panel-success");
									$('#addclassbox').addClass("panel-danger");
									$('#actboxheading').html("Deactivation");
									$('#actboxcontent').html("Are you sure you want to deactivate the account : "+newMap.subAccountNumber+"?<br><br><button id = 'deactivateyes'type='button' class='btn btn-danger'>Yes</button> <button id = 'deactivateno'type='button' class='btn btn-success'>No</button>");
									$('#deactivateyes').click(function()
											{
										accountManager.AccountData.status = "false";
										accountManager.postNewDataToUpdate("deactivate");									
											});
									$('#deactivateno').click(function()
											{
														$('#messageboxforactivate').slideToggle('slow');

											});


								}
							else if (statusvalue == "false")
								{
									$("#paraforActivate").html("");
									$("#dynamicslideractivate").html("Activate account");
									$('#activatebutton').prop('disabled',false);
									$('#deactivatebutton').prop('disabled',true);
									$('#deactivatebutton').removeClass('btn-danger');
									$('#activatebutton').addClass('btn-success');
									$('#addclassbox').removeClass("panel-danger");
									$('#addclassbox').addClass("panel-success");
									$('#actboxheading').html("Activation");
									$('#actboxcontent').html("Are you sure you want to activate the account : "+newMap.subAccountNumber+"?<br><br><button id = 'activateyes'type='button' class='btn btn-success'>Yes</button> <button id = 'deactivateno'type='button' class='btn btn-danger'>No</button>");
									$('#activateyes').click(function()
											{
										accountManager.AccountData.status = "true";
										accountManager.postNewDataToUpdate("activate");									
											});
									$('#deactivateno').click(function()
											{
														$('#messageboxforactivate').slideToggle('slow');

											});

									
								}
							else
								{
								
								$("#paraforActivate").html("");
								$("#dynamicslideractivate").html("Deactivate account");
								$('#activatebutton').prop('disabled',true);
								$('#activatebutton').removeClass('btn-success');
								$('#deactivatebutton').addClass('btn-danger');
								$('#deactivatebutton').prop('disabled',false);
								$('#addclassbox').removeClass("panel-success");
								$('#addclassbox').addClass("panel-danger");
								$('#actboxheading').html("Deactivation");
								$('#actboxcontent').html("Are you sure you want to deactivate the account : "+accountManager.AccountData.subAccountNumber+" ?<br><br><button id = 'deactivateyes'type='button' class='btn btn-danger'>Yes</button> <button id = 'deactivateno'type='button' class='btn btn-success'>No</button>");
								$('#deactivateyes').click(function()
								{
									accountManager.AccountData.status = "false";
									accountManager.postNewDataToUpdate("deactivate");									
								});
								$('#deactivateno').click(function()
								{

									$('#messageboxforactivate').slideToggle('slow');

								});
								}
							//
					
							accountManager.showFetchedSubAccountDetail(subAccountNumber);
				}
			});
			
		},
		skillConstruction		:	function(updatedMap)
		{
			if(mode	==	"LIVE")
			{
				if(updatedMap.live_skill	!= undefined)
				{
					if((updatedMap.live_skill).toLowerCase()	!=	"off")
					{
						if(((updatedMap.live_skill).substr(0, 3))	!=	"ett")
							updatedMap.live_skill	=	"ett"+updatedMap.live_skill;
					}
				}
				if(updatedMap.overflow_live_skill	!= undefined)
				{
					if((updatedMap.overflow_live_skill).toLowerCase()	!=	"off")
					{
						if(((updatedMap.overflow_live_skill).substr(0, 3))	!=	"ett")
							updatedMap.overflow_live_skill	=	"ett"+updatedMap.overflow_live_skill;
					}
				}
			}
			else
			{
				if(updatedMap.staging_skill	!= undefined)
				{
					if((updatedMap.staging_skill).toLowerCase()	!=	"off")
					{
						if(((updatedMap.staging_skill).substr(0, 3))	!=	"ett")
							updatedMap.staging_skill	=	"ett"+updatedMap.staging_skill;
					}
				}
				if(updatedMap.overflow_staging_skill	!= undefined)
				{
					if((updatedMap.overflow_staging_skill).toLowerCase()	!=	"off")
					{
						if(((updatedMap.overflow_staging_skill).substr(0, 3))	!=	"ett")
							updatedMap.overflow_staging_skill	=	"ett"+updatedMap.overflow_staging_skill;
					}
				}
			}
			return updatedMap;
		},
		getsubAccountNumber 	:	function(AccountNo,DomainName)
		{
			messageWindow.showMessage("Creating Account...")
			var url 	=	"/getClientId?accountNumber="+AccountNo+"&domainName="+DomainName;
			console.log(url);
			$.ajax
			({
				type : "POST",
				url : url,
				async:true,
				success : function(data)
				{
					var responseJson	=	JSON.parse(data);
					if(responseJson.success)
					{
						var innerJson	=	responseJson.response;
						accountManager.initializeFormField();
						//fill client parameters for these values
							
							$('#profile_Detail').html('Profile Details : '+innerJson.clientId);
							// for deactivate menu
						
							console.log("third part");
							var statusvalue = innerJson.status;
							//	var statusvalue = "false";

							if (statusvalue == "true")
								{
									
									$("#paraforActivate").html("");
									$("#dynamicslideractivate").html("Deactivate account");
									$('#activatebutton').prop('disabled',true);
									$('#activatebutton').removeClass('btn-success');
									$('#deactivatebutton').addClass('btn-danger');
									$('#deactivatebutton').prop('disabled',false);
									$('#addclassbox').removeClass("panel-success");
									$('#addclassbox').addClass("panel-danger");
									$('#actboxheading').html("Deactivation");
									$('#actboxcontent').html("Are you sure you want to deactivate the account : "+innerJson.clientId+"?<br><br><button id = 'deactivateyes'type='button' class='btn btn-danger'>Yes</button> <button id = 'deactivateno'type='button' class='btn btn-success'>No</button>");
									$('#deactivateyes').click(function()
											{
										accountManager.AccountData.status = "false";
										accountManager.postNewDataToUpdate("deactivate");									
											});
									$('#deactivateno').click(function()
											{
														$('#messageboxforactivate').slideToggle('slow');

											});


								}
							else if (statusvalue == "false")
								{
									$("#paraforActivate").html("");
									$("#dynamicslideractivate").html("Activate account");
									$('#activatebutton').prop('disabled',false);
									$('#deactivatebutton').prop('disabled',true);
									$('#deactivatebutton').removeClass('btn-danger');
									$('#activatebutton').addClass('btn-success');
									$('#addclassbox').removeClass("panel-danger");
									$('#addclassbox').addClass("panel-success");
									$('#actboxheading').html("Activation");
									$('#actboxcontent').html("Are you sure you want to activate the account : "+innerJson.clientId+"?<br><br><button id = 'activateyes'type='button' class='btn btn-success'>Yes</button> <button id = 'deactivateno'type='button' class='btn btn-danger'>No</button>");
									$('#activateyes').click(function()
											{
										accountManager.AccountData.status = "true";
										accountManager.postNewDataToUpdate("activate");									
											});
									$('#deactivateno').click(function()
											{
														$('#messageboxforactivate').slideToggle('slow');

											});

									
								}
							else
								{
								
								$("#paraforActivate").html("");
								$("#dynamicslideractivate").html("Deactivate account");
								$('#activatebutton').prop('disabled',true);
								$('#activatebutton').removeClass('btn-success');
								$('#deactivatebutton').addClass('btn-danger');
								$('#deactivatebutton').prop('disabled',false);
								$('#addclassbox').removeClass("panel-success");
								$('#addclassbox').addClass("panel-danger");
								$('#actboxheading').html("Deactivation");
								$('#actboxcontent').html("Are you sure you want to deactivate the account : "+accountManager.AccountData.subAccountNumber+" ?<br><br><button id = 'deactivateyes'type='button' class='btn btn-danger'>Yes</button> <button id = 'deactivateno'type='button' class='btn btn-success'>No</button>");
								$('#deactivateyes').click(function()
								{
									accountManager.AccountData.status = "false";
									accountManager.postNewDataToUpdate("deactivate");									
								});
								$('#deactivateno').click(function()
								{

									$('#messageboxforactivate').slideToggle('slow');

								});
								}
							//
							
							$('#domin-form').val(innerJson.domainName);
							$('#campagin-val').val($('#model-campagin-val').html());
								accountManager.createAccount	=	true;
								accountManager.AccountData.accountNumber	=	$('#model-accountNo').val();
								accountManager.AccountData.SubAccountNumber			=	innerJson.clientId;
								accountManager.AccountData.live_skill		=	'ett'+innerJson.clientId;
								accountManager.AccountData.staging_skill	=	'ettstaging';
								//clear model fields to avoid confusion for the fields
								$('#model-accountNo').val('');
								$('#model-domainName').val('');
								if(mode	==	"LIVE")
								{
									$('#skill-mode').html('Live');
									$('#skillTi-form').val(accountManager.AccountData.live_skill);
									$('#defaultSkill').html('Current Skill : '+accountManager.AccountData.live_skill);
								}else
								{
									$('#skill-mode').html('Staging');
									$('#skillTi-form').val(accountManager.AccountData.staging_skill);
									$('#defaultSkill').html('Current Skill : '+accountManager.AccountData.staging_skill)
								}
								messageWindow.popUpMessage("Account Created.", 1000);
					}
					else
						{
							accountManager.initializeFormField();
							messageWindow.popUpMessage( "Enter a valid AccountNumber", 2000 );
						}
					accountManager.postNewDataToUpdate();
					$( "#close-model" ).trigger( "click" );
				}
			});	
		},
		
		createARAccount 	:	function(AccountNo,DomainName, interactionTypeId,subAccountNumber)
		{
			
			messageWindow.showMessage("Creating Account...")
			    if(!!subAccountNumber && subAccountNumber != "")
				    var url 	=	"/getClientId?accountNumber="+AccountNo+"&domainName="+DomainName+'&interactionTypeId=' + interactionTypeId + "&subAccountNumber=" + subAccountNumber;
			    else
			    	var url 	=	"/getClientId?accountNumber="+AccountNo+"&domainName="+DomainName+'&interactionTypeId=' + interactionTypeId;
			console.log(url);
			$.ajax
			({
				type : "POST",
				url : url,
				async:true,
				success : function(data)
				{
					var innerJson	=	JSON.parse(data);
					var status      =	checkAccListToAddorUpdate(innerJson)
					 
					if(status == "updated") {
						
						var accountList = null;
						accountManager.initializeFormField();
						
						$('#model-accountNo').val('');
						$('#model-domainName').val('');
						$('#model-campagin-val').html("Campagin <span class='caret'></span>");
						$(".popup-radio .radio-btn li").removeClass("active-radio");
						messageWindow.popUpMessage("Account Created.", 1000);
					    $( "#close-model" ).trigger( "click" );
					    
					    accountList = JSON.parse(accountManager.datastring)
					    accountManager.buildSideBar(accountList,null);
					    
					    accountManager.showFetchedSubAccountDetail(innerJson.subAccountNumber);
					   
						return true;
					}
					
					
					if(innerJson.success)
					{   
						accountManager.initializeFormField();
						//fill client parameters for these values
							
						$('#profile_Detail').html('Profile Details : '+innerJson.subAccountNumber);
						// for deactivate menu
						console.log("third part");
						var statusvalue = innerJson.status;
						//		var statusvalue = "false";

						if (statusvalue == "true")
						{
							$("#paraforActivate").html("");
							$("#dynamicslideractivate").html("Deactivate account");
							$('#activatebutton').prop('disabled',true);
							$('#activatebutton').removeClass('btn-success');
							$('#deactivatebutton').addClass('btn-danger');
							$('#deactivatebutton').prop('disabled',false);
							$('#addclassbox').removeClass("panel-success");
							$('#addclassbox').addClass("panel-danger");
							$('#actboxheading').html("Deactivation");
							$('#actboxcontent').html("Are you sure you want to deactivate the account : "+innerJson.subAccountNumber+"?<br><br><button id = 'deactivateyes'type='button' class='btn btn-danger'>Yes</button> <button id = 'deactivateno'type='button' class='btn btn-success'>No</button>");
							$('#deactivateyes').click(function()
							{
								accountManager.AccountData.status = "false";
								accountManager.postNewDataToUpdate("deactivate");									
							});
							$('#deactivateno').click(function()
							{
								$('#messageboxforactivate').slideToggle('slow');
							});
						}
						else if (statusvalue == "false")
						{
							$("#paraforActivate").html("");
							$("#dynamicslideractivate").html("Activate account");
							$('#activatebutton').prop('disabled',false);
							$('#deactivatebutton').prop('disabled',true);
							$('#deactivatebutton').removeClass('btn-danger');
							$('#activatebutton').addClass('btn-success');
							$('#addclassbox').removeClass("panel-danger");
							$('#addclassbox').addClass("panel-success");
							$('#actboxheading').html("Activation");
							$('#actboxcontent').html("Are you sure you want to activate the account : "+innerJson.subAccountNumber+"?<br><br><button id = 'activateyes'type='button' class='btn btn-success'>Yes</button> <button id = 'deactivateno'type='button' class='btn btn-danger'>No</button>");
							$('#activateyes').click(function()
							{
								accountManager.AccountData.status = "true";
								accountManager.postNewDataToUpdate("activate");									
							});
							$('#deactivateno').click(function()
							{
								$('#messageboxforactivate').slideToggle('slow');
							});
						}
						else
						{
							$("#paraforActivate").html("");
							$("#dynamicslideractivate").html("Deactivate account");
							$('#activatebutton').prop('disabled',true);
							$('#activatebutton').removeClass('btn-success');
							$('#deactivatebutton').addClass('btn-danger');
							$('#deactivatebutton').prop('disabled',false);
							$('#addclassbox').removeClass("panel-success");
							$('#addclassbox').addClass("panel-danger");
							$('#actboxheading').html("Deactivation");
							$('#actboxcontent').html("Are you sure you want to deactivate the account : "+accountManager.AccountData.subAccountNumber+" ?<br><br><button id = 'deactivateyes'type='button' class='btn btn-danger'>Yes</button> <button id = 'deactivateno'type='button' class='btn btn-success'>No</button>");
							$('#deactivateyes').click(function()
							{
								accountManager.AccountData.status = "false";
								accountManager.postNewDataToUpdate("deactivate");									
							});
							$('#deactivateno').click(function()
							{
								$('#messageboxforactivate').slideToggle('slow');

							});
						}
						$('#domin-form').val(innerJson.domainName);
						$('#campagin-val').val($('#model-campagin-val').html());
						accountManager.createAccount	=	true;
						accountManager.AccountData.accountNumber	=	$('#model-accountNo').val();
						accountManager.AccountData.subAccountNumber	=	innerJson.subAccountNumber;
						accountManager.AccountData.live_skill		=	'ett'+innerJson.subAccountNumber;
						accountManager.AccountData.staging_skill	=	'ettstaging';
						//clear model fields to avoid confusion for the fields
						$('#model-accountNo').val('');
						$('#model-domainName').val('');
						if(mode	==	"LIVE")
						{
							$('#skill-mode').html('Live');
							$('#skillTi-form').val(accountManager.AccountData.live_skill);
							$('#defaultSkill').html('Current Skill : '+accountManager.AccountData.live_skill);
						}
						else
						{
							$('#skill-mode').html('Staging');
							$('#skillTi-form').val(accountManager.AccountData.staging_skill);
							$('#defaultSkill').html('Current Skill : '+accountManager.AccountData.staging_skill)
						}
						messageWindow.popUpMessage("Account Created.", 1000);
					}
					else
					{
						accountManager.initializeFormField();
						messageWindow.popUpMessage( "Enter a valid AccountNumber", 2000 );
					}
					accountManager.postNewDataToUpdateNew();
					$( "#close-model" ).trigger( "click" );
				}
			});	
		},
		getAgentDetailsBySkill  :  function(Skill,skillType)
		{			
			if(skillType != "overflow")
			{
				oldSkillbeforechange = Skill;
			}
			
			if(Skill.toLowerCase() != "off" && Skill.trim() != "")
			{
				var url 	=	"/getAgentsListBySkill?agentskill="+Skill+"&cursor=";
				console.log(url);
				$.ajax
				({
					type : "GET",
					url : url,
					async:true,
					success : function(data)
					{
						if(data != "failure")
						{
							var responseJson	=	JSON.parse(data);
							var AgentList		=	responseJson.loginList;
							var cursor			=	responseJson.cursor;
							if(skillType	==	"main")
							{
								accountManager.fillAgentSkillListToPage(AgentList,"main",AgentList.length);
								accountManager.mainSkillList	=	AgentList;
							//	$('.skillcount').html('<i class="fa fa-trash-o"></i>'+accountManager.mainSkillList.length);
							}
							if(skillType	==	"overflow")
							{
								accountManager.OverflowSkillList	=	AgentList;
								$('.overflowcount').html('<i class="fa fa-trash-o"></i>'+accountManager.OverflowSkillList.length);
							}
							if(responseJson.moreData)
							{
								var tempmap				=	new Object();
									tempmap.cursor		=	responseJson.cursor;
									tempmap.skill		=	Skill;
									tempmap.skilltype	=	skillType;
									if(skillType	==	"main")
									{
										accountManager.mainSkillRecursiveMap		=	tempmap;
									}
									else
									{
										accountManager.overflowSkillRecursiveMap	=	tempmap;
									}
							}
							else
							{
								var tempmap				=	new Object();
									tempmap.cursor		=	"No Cursor";
									tempmap.skill		=	Skill;
									tempmap.skilltype	=	skillType;
									if(skillType	==	"main")
									{
										accountManager.mainSkillRecursiveMap		=	tempmap;
									}
									else
									{
										accountManager.overflowSkillRecursiveMap	=	tempmap;
									}
							}			
						}
					}
				});
			}else
			{
				var AgentList	= new Array();
				if(skillType	==	"main")
				{
					accountManager.fillAgentSkillListToPage(AgentList,"main",AgentList.length);
					accountManager.mainSkillList	=	AgentList;
				}
				if(skillType	==	"overflow")
				{
					accountManager.OverflowSkillList	=	AgentList;
					$('.overflowcount').html('<i class="fa fa-trash-o"></i>'+accountManager.OverflowSkillList.length);
				}
				accountManager.mainSkillRecursiveMap		=	new Object();
				accountManager.overflowSkillRecursiveMap	=	new Object();
			}
		},
		getAgentDetailsBySkillRecursively  :  function(recuesiveData)
		{
			if(recuesiveData.cursor == "No Cursor")
			{
				messageWindow.popUpMessage( "No Data", 3000);
				return;
			}
			if(recuesiveData.cursor == undefined)
			{
				messageWindow.popUpMessage( "No Data", 3000);
				return;
			}
			messageWindow.showMessage( "Loading...");
			var Skill	 	= recuesiveData.skill;
			var skillType 	= recuesiveData.skilltype;
			var cursor		= recuesiveData.cursor
			var url 	=	"/getAgentsListBySkill?agentskill="+Skill+"&cursor="+cursor;
			$.ajax
			({
				type : "GET",
				url : url,
				async:true,
				success : function(data)
				{
					if(data != "failure")
					{
						var responseJson	=	JSON.parse(data);
						var AgentList		=	responseJson.loginList;
							cursor			=	responseJson.cursor;
						if(skillType	==	"main")
						{
							accountManager.mainSkillList	=	accountManager.mainSkillList.concat(AgentList);
							
							if($('#mainSkill').hasClass('active'))
			        		{
								accountManager.fillAgentSkillListToPage(accountManager.mainSkillList,"main",accountManager.mainSkillList.length);
			        		}
			        	}
						if(skillType	==	"overflow")
						{
							accountManager.OverflowSkillList	=	accountManager.OverflowSkillList.concat(AgentList);
							if(!($('#mainSkill').hasClass('active')))
			        		{
								accountManager.fillAgentSkillListToPage(accountManager.OverflowSkillList,"overflow",accountManager.OverflowSkillList.length);
			        		}							
						}
						messageWindow.popUpMessage( "Updated..", 1000);
						if(responseJson.moreData)
						{
							var tempmap				=	new Object();
								tempmap.cursor		=	cursor;
								tempmap.skill		=	Skill;
								tempmap.skilltype	=	skillType;
								if(skillType	==	"main")
								{
									accountManager.mainSkillRecursiveMap		=	tempmap;
								}
								else
								{
									accountManager.overflowSkillRecursiveMap	=	tempmap;
								}
						}
						else
						{
							var tempmap				=	new Object();
								tempmap.cursor		=	"No Cursor";
								tempmap.skill		=	Skill;
								tempmap.skilltype	=	skillType;
								if(skillType	==	"main")
								{
									accountManager.mainSkillRecursiveMap		=	tempmap;
								}
								else
								{
									accountManager.overflowSkillRecursiveMap	=	tempmap;
								}
						}			
					}
				}
			});
		},
		fillAgentSkillListToPage	:	function(AgentList,skillType,count)
		{
			if(skillType == "main")
			{
				$('.skillcount').html('<i class="fa fa-trash-o"></i>'+count);
			}
			else
			{
				$('.overflowcount').html('<i class="fa fa-trash-o"></i>'+count);
			}
			
			$("#SkillTable").html('');
			$.each(AgentList,function(index,agentData)
			{
				var url		=	agentData.url;
			  var tableBuilder	= '<tr><td id="trashSkill_'+index+'" onclick="accountManager.deleteAgentFromSkill(this)"><b><i class="fa fa-user"></i></b><span><i class="fa fa-trash-o"></i></span></td>'+
			  					  '<td id="agentName_'+index+'">'+agentData.firstName+'&nbsp'+agentData.lastName+'</td>'+
                				  '<td id="agentLogin_'+index+'">'+agentData.login+'</td>'+
                				  '<td><div class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" id="skillurl_'+index+'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><span class="caret"></span></button><input style="display:none" id="urlValue_'+index+'" onblur="accountManager.callToUpdateAgentSkill(this)" class="form-control" placeholder="Paste URL"></input>'+
                				  '<ul class="dropdown-menu" aria-labelledby="skillurl_'+index+'">'+accountManager.getDSUrlsByMode(index)+'</ul></div></td>'+
                				  '<td id="skillLevel_'+index+'" style="display:none">'+agentData.skillLevel+'</td>'+
                				  '<td>'+
                				  '<ul class="color-icons" style = "cursor: pointer" >'+
                				  '<li onclick="accountManager.callToUpdateAgentSkill(this)" id="lowlevel_'+index+'"><i class="fa fa-square" style="margin-right: 5px;'+(parseInt(agentData.skillLevel)>=1&&parseInt(agentData.skillLevel)<=3? "color:#ff6633; background:#ff6633; border:1px solid;border-radius: 3px; margin-top: -1px;" : "color:#F1AA93;")+'"></i></li>'+
                				  '<li onclick="accountManager.callToUpdateAgentSkill(this)" id="midlevel_'+index+'"><i class="fa fa-square"style="margin-right: 5px; '+(parseInt(agentData.skillLevel)>=4&&parseInt(agentData.skillLevel)<=6? "color:#ff9933; background:#ff9933; border:1px solid;border-radius: 3px; margin-top: -1px;" : "color:#F5C696;")+'"></i></li>'+
                				  '<li onclick="accountManager.callToUpdateAgentSkill(this)" id="higlevel_'+index+'"><i class="fa fa-square"style="margin-right: 5px;'+(parseInt(agentData.skillLevel)>=7&&parseInt(agentData.skillLevel)<=9? "color:#99ccff; background:#99ccff; border:1px solid;border-radius: 3px; margin-top: -1px;" : "color:#C6DDF3;")+'"></i></li>'+
                				    '</ul></td></tr>';
			  $("#SkillTable").append(tableBuilder);
			  
			  if(url)
			  {
				  var displayURL = "";
				  if(url.length > 72)
					  displayURL = url.substring(0,72) + "...";
				  else
					  displayURL = url;
				  $('#skillurl_'+index).html(displayURL+"<span class='caret'></span>");
				  $('#urlValue_'+index).val(url);
				  $('#removeURL_'+index).removeClass('disabled');
				  $('#removeURL_'+index).attr("onclick","accountManager.callToUpdateAgentSkill(this)");
			  }
			  else
			  {
				  $('#skillurl_'+index).html("Select Application URL<span class='caret'></span>");
				  $('#urlValue_'+index).val("");
				  $('#removeURL_'+index).addClass('disabled');
				  $('#removeURL_'+index).removeAttr("onclick");
			  }
			});
		},
		getDSUrlsByMode			:   function(AgentIndex)
		{
			var optionElements = "";
			var optionURL	   = "";
			
			var urlTypes 	   = ["Lead","Task","Deal","Account"];
			var dsURL 		   = "";
			
			if(mode == "LIVE")
				dsURL = "https://my.distributedsource.com/crm#";
			else
			    dsURL = "https://dist-sourcetest.appspot.com/crm#";
			
			for(var index in urlTypes)
			{
				optionURL      = dsURL+urlTypes[index].toLowerCase()+'/?%3Fconnid=?&userpin=?';
				optionElements = optionElements + '<li onclick="accountManager.callToUpdateAgentSkill(this)" id="skill'+urlTypes[index]+'url_'+AgentIndex+'_'+optionURL+'"><a href="#">DS '+urlTypes[index]+' URL</a></li>';
			}
			optionElements = optionElements +  '<li role="separator" class="divider"></li><li id="addAppURL_'+AgentIndex+'" onclick="accountManager.addAppURL(this)"><a href="#">Paste URL</a></li>' + '<li id="removeURL_'+AgentIndex+'" onclick="accountManager.callToUpdateAgentSkill(this)"><a href="#">Remove URL</a></li>';
			
		return optionElements;
			
		},
		addAppURL  	: function(trObj)
		{
			var index = trObj.id.split("_")[1];
			
			$('#skillurl_'+index).hide();
			$('#urlValue_'+index).show();
			$('#urlValue_'+index).focus();
			$('#urlValue_'+index).select();
		},
		deleteAgentFromSkill	:	function(trObj)
		{
			var id = trObj.id;
			console.log("this is id :: "+id+" and this is id's length"+id.length);
			var tempAgentName = "";
				if(id.length<13)
				{
					tempAgentName='agentName'+id.substr(id.length-2,id.length-1);
				}
			if(id.length==13)
				{
					tempAgentName='agentName'+id.substr(id.length-3,id.length-1);
				}	
			if(id.length==14)
			{
					tempAgentName='agentName'+id.substr(id.length-4,id.length-1);
			}	
			
			tempAgentName=document.getElementById(tempAgentName).innerHTML; 
			tempAgentName=tempAgentName.split("&nbsp;")[0];

			if(tempAgentName.length>1)
		   {
		    document.getElementById('modal_comform_message').innerHTML="Are you sure you want to remove "+tempAgentName+" ?";
		   }
			else
		   {
		    document.getElementById('modal_comform_message').innerHTML="Are you sure you want to remove "+document.getElementById('agentLogin'+id.substr(id.length-2,id.length-1)).innerHTML+" ?";
		   }
			
			$('#modal-confirm-deletion').trigger('click');
			$('.model-confirm_delete').attr("id",id);
		
		},
		removeIdOfDelete		:	function()
		{
			 $(".model-confirm_delete").removeAttr("id");
		},
		callToUpdateAgentSkill	:	function(trObj)
		{
			var operation	  =	"delete";
			var id			  = trObj.id;
			var isURLChanged  = true;

			if(id.split("_")[0]	!= "trashSkill")
			{
				operation	=	"update";
			}
			var index		= 	id.split("_")[1]
			var login		= 	$('#agentLogin_'+index).html();
			var skillurl	=   $('#urlValue_'+index).val();
			var skilllevel	=	$('#skillLevel_'+index).html();
			var skilltype	=	accountManager.AccountData.campaign;
				if(operation == "update")
				{
					if(id.split("_")[0] == "lowlevel")
						skilllevel	=	"3";
					if(id.split("_")[0] == "midlevel")
						skilllevel	=	"6";
					if(id.split("_")[0] == "higlevel")
						skilllevel	=	"9";
					console.log("skillurl=",skillurl);
					if(id.split("_")[0] == "skillLeadurl" || id.split("_")[0] == "skillTaskurl" || id.split("_")[0] == "skillAccounturl" || id.split("_")[0] == "skillDealurl") 
						skillurl	=	id.split("_")[2];
					if(id.split("_")[0] == "removeURL")
						skillurl	=	"";					
				}
				console.log("skillurl=",skillurl);
				
				skillurl	=	encodeURIComponent(skillurl);
				
			if(mode	==	"STAGING")
			{
				if($('#mainSkill').hasClass('active'))
				{
					var skilltitle	=	accountManager.AccountData.staging_skill;
				}
				else
				{
					var skilltitle	=	accountManager.AccountData.overflow_staging_skill;
				}	
			}
			else
			{	
				if($('#mainSkill').hasClass('active'))
				{
					var skilltitle	=	accountManager.AccountData.live_skill;
				}
				else
				{
					var skilltitle	=	accountManager.AccountData.overflow_live_skill;
				}		
			}
				var skilldata				=	new Object();
					skilldata.login			=	login;
					skilldata.skillLevel	=	skilllevel;
					skilldata.url			=	decodeURIComponent(skillurl);
												
				var oldSkillLevel			=	"";
				var oldURL					=	"";
				var type					=	"";
				
				$.each(accountManager.mainSkillList,function(index,skillList)
				{
					if(skillList.login == skilldata.login)
					{
						if(skillList.skillLevel != skilldata.skillLevel)
						{
							oldSkillLevel	=	skillList.skillLevel;
							console.log("oldSkillLevel = "+oldSkillLevel);
							type			=	"skilllevel";
							console.log(type);
						}
						if(skillList.url != $.trim(skilldata.url))
						{
							oldURL			=	skillList.url;
							console.log("oldURL = "+oldURL);
							type			=	"url";
							console.log(type);
						}
						else
							isURLChanged = false;
					}
				});
				
				
				if(isURLChanged == false && id.split("_")[0] == "urlValue")
				{
					$("#urlValue_"+index).hide();
					$("#skillurl_"+index).show();
					return;
				}
				
				messageWindow.showMessage("updating...");
				
				var AccoNum = $('#profile_Detail').html();
				if(!!AccoNum)
					AccoNum = AccoNum.slice(18)
				else
					AccountNum= null;
				url	=	'/alterSkillDataForAgentNEWCMS?lemail='+login+'&stitle='+skilltitle+'&clientId='+AccoNum+'&slevel='+skilllevel+'&itype='+skilltype+'&url='+skillurl+'&operation='+operation+'&oldskilllevel='+oldSkillLevel+'&oldurl='+oldURL+'&type='+type;
				$.ajax
				({
					type : "GET",
					url : url,
					async:true,
					success : function(data)
					{
						var list = new Array();
						if(operation	==	"delete")
						{
							if($('#mainSkill').hasClass('active'))
							{
								$.each(accountManager.mainSkillList,function(index,skillList)
								{
									if(skillList.login != login)
									{
										list.push(skillList);
									}		
								});
								accountManager.mainSkillList	=	list;
								accountManager.fillAgentSkillListToPage(accountManager.mainSkillList,"main",accountManager.mainSkillList.length);
							}
							else
							{
								$.each(accountManager.mainSkillList,function(index,skillList)
								{
									if(skillList.login != login)
									{
										list.push(skillList);
									}
								});
								accountManager.OverflowSkillList	= list;
								accountManager.fillAgentSkillListToPage(accountManager.OverflowSkillList,"overflow",accountManager.OverflowSkillList.length);
							}	
						}
						else
						{
							if($('#mainSkill').hasClass('active'))
							{
								if(mode == "STAGING")
								{
									$.each(accountManager.mainSkillList,function(index,skillList)
									{
										if(skillList.login == skilldata.login)
										{
											skillList.skillLevel      = skilldata.skillLevel;
											skillList.url      		  = skilldata.url;
										}
										list.push(skillList);
									});
									accountManager.mainSkillList	=	list;
									accountManager.fillAgentSkillListToPage(accountManager.mainSkillList,"main",accountManager.mainSkillList.length);
								}
								else
								{
									$.each(accountManager.mainSkillList,function(index,skillList)
											{
												if(skillList.login == skilldata.login)
												{
													skillList.skillLevel      = skilldata.skillLevel;
													skillList.url      		  = skilldata.url;
												}
												list.push(skillList);
											});
											accountManager.mainSkillList	=	list;
											accountManager.fillAgentSkillListToPage(accountManager.mainSkillList,"main",accountManager.mainSkillList.length);
								}
							}
							else
							{
								if(mode == "STAGING")
								{	
									$.each(accountManager.OverflowSkillList,function(index,skillList)
									{
										if(skillList.login == skilldata.login)
										{
											skillList.skillLevel      = skilldata.skillLevel;
											skillList.url      		  = skilldata.url;
										}
										list.push(skillList);
									});
									accountManager.OverflowSkillList	=	list;
									accountManager.fillAgentSkillListToPage(accountManager.OverflowSkillList,"overflow",accountManager.OverflowSkillList.length);
								}
								else
								{
									$.each(accountManager.OverflowSkillList,function(index,skillList)
									{
										if(skillList.login == skilldata.login)
										{
											skillList.skillLevel      = skilldata.skillLevel;
											skillList.url      		  = skilldata.url;
										}
										list.push(skillList);
									});
									accountManager.OverflowSkillList	=	list;
									accountManager.fillAgentSkillListToPage(accountManager.OverflowSkillList,"overflow",accountManager.OverflowSkillList.length);
								}
							}		
						}
						messageWindow.popUpMessage( "Updated Successfully", 1000);
					}
				});	
				 $(".model-confirm_delete").removeAttr("id");
		},
		activateordeactivatePendingLookup   :   function(dom)
		{
			var id = dom.id;
			var uploadTime = id.split("_")[1];
			var buttonName = id.split("_")[0];
			var lookupToBeUpdated = {};
			
			lookupToBeUpdated = accountManager.getorUpdateLookupData(uploadTime,"get");
			
			if(buttonName == "activatePending")
				lookupToBeUpdated.status = true;
			else
				lookupToBeUpdated.status = false;	
			messageWindow.showMessage("updating...");
			$.ajax({
				type : 'POST',
				url  : '/updatePendingInteractionsBySubAccountNo',
				contentType : 'application/json',
				data : JSON.stringify(lookupToBeUpdated),
				success : function(data)
				{
					var updatedLookup = JSON.parse(data);
					if(updatedLookup.status==true)
					{
						$('#activatePending_'+updatedLookup.uploadTime).prop('disabled',true);
						$('#deactivatePending_'+updatedLookup.uploadTime).prop('disabled',false);
						$('#status_'+updatedLookup.uploadTime).html('Active');
						accountManager.getorUpdateLookupData(updatedLookup.uploadTime, "activate");
					}
					else
					{
						$('#activatePending_'+updatedLookup.uploadTime).prop('disabled',false);
						$('#deactivatePending_'+updatedLookup.uploadTime).prop('disabled',true);
						$('#status_'+updatedLookup.uploadTime).html('Disabled');
						accountManager.getorUpdateLookupData(updatedLookup.uploadTime, "deactivate");
					}
					messageWindow.popUpMessage("Updated Successfully", 2000);
				},
				error : function(data)
				{
					console.log("error");
				}
			})
			
		},
		getorUpdateLookupData    :   function(uploadTime,operation)
		{
			var lookupToBeUpdated = {};
			
			if(accountManager.pendIntLookupsList.length>0)
			{
				var lookupList = accountManager.pendIntLookupsList;
				
				for(var lookupIndex in lookupList)
				{
					if(lookupList[lookupIndex].uploadTime == uploadTime)
					{
						if(operation == "get")
						{
							lookupToBeUpdated = lookupList[lookupIndex];
							return lookupToBeUpdated;
						}
						else if(operation == "activate")
						{
							lookupList[lookupIndex].status = true;
							accountManager.pendIntLookupsList = lookupList;
						}
						else if(operation == "deactivate")
						{
							lookupList[lookupIndex].status = false;
							accountManager.pendIntLookupsList = lookupList;
						}
					}
				}
			}
		},
		addAgentToSkill			:	function()
		{
			var url 		= 	"";
			var proceed		=	true;
			var login		=	$("#add-AgentLogin").val();
			var skilltitle	=	$("#add-skillName").val();
			var	skilltype	=	accountManager.AccountData.campaign;
			var skillurl	=	$("#add-Agenturl").val();
			var skilllevel	=	$("#add-AgentskillLevel").val();
				skillurl	=	encodeURIComponent(skillurl);
				
				if(!!!skilltitle || (!!skilltitle && skilltitle.indexOf(" ") != -1))
				{
					messageWindow.popUpMessage( "Enter the valid Skill", 2000 );
					return true;
				}
				if(!!!login || !!!skilltitle || !!!skilllevel || isNaN(skilllevel) || skilllevel > 9 || skilllevel < 1)
				{
					messageWindow.popUpMessage( "Fill Required Fields Correctly", 2000 );
					return true;
				}
				messageWindow.showMessage("updating...");
				if($('#mainSkill').hasClass('active'))
				{
					$.each(accountManager.mainSkillList,function(index,skillData)
					{
						if(skillData.login == login)
							proceed		=	false;
					});
				}
				else
				{
					$.each(accountManager.OverflowSkillList,function(index,skillData)
					{
						if(skillData.login == login)
							proceed		=	false;
					});
				}	
				if(!proceed)
				{
					messageWindow.popUpMessage("Agent Already Exists..", 2000);
					$('#add-skillToAgenthide').trigger('click');
					return;
				}
				var tempMap 	=	new Object();
					tempMap.firstName	=	" ";
					tempMap.lastName	=	" ";
					tempMap.login		=	login;
					tempMap.skillLevel	=	skilllevel;
					tempMap.url			=	skillurl;
										
			url	=	'/alterSkillDataForAgentNEWCMS?lemail='+login+'&stitle='+skilltitle+'&slevel='+skilllevel+'&itype='+skilltype+'&url='+skillurl+'&operation=insert';
			console.log(url);
			$.ajax
			({
				type : "GET",
				url : url,
				async:true,
				success : function(data)
				{
					var response = JSON.parse(data);
					if(response.isContactExist)
					{	
						if($('#mainSkill').hasClass('active'))
						{
							accountManager.mainSkillList.push(tempMap);
							accountManager.fillAgentSkillListToPage(accountManager.mainSkillList,"main",accountManager.mainSkillList.length);
						}
						else
						{
							accountManager.OverflowSkillList.push(tempMap);
							accountManager.fillAgentSkillListToPage(accountManager.OverflowSkillList,"overflow",accountManager.OverflowSkillList.length);
							
						}	
						messageWindow.popUpMessage("Agent Added Successfully", 2000);
					}
					else
					{
						messageWindow.popUpMessage("No Contact Exist..", 2000);
					}
					$('#add-skillToAgenthide').trigger('click');	
				}
			});	
		},
		initializeFormField 	:	function()
		{
			$('#profile-form').val('');
			$('#domin-form').val('');
			$('#email-form').val('');
			$('#EmailPass-form').val('');
			$('#client-email').val('');
			$('#client-EmailPass').val('');
			$('#Alias-form').val('');
			$('#cc-form').val('');
			$('#bcc-form').val('');
			$('#callDe-form').val('120');
			$('#campDe-form').val('0');
			$('#formname-form').val('noform');
			$('#pause_button').html('True');
			$('#campagin-val').html('Campagin');
			$('#inter-drop').html('True');
			$('#allow-drop').html('Enabled');
			$('#startTime').val('');
			$('#stopTime').val('');
			$('#triggerTime').val('');
			$('.excludeDaysPicker').selectpicker('val',"");
			$('.exceptionalDaysPicker').selectpicker('val',"");
			$('#exceptionalDayStartTime').val('');
			$('#exceptionalDayStopTime').val('');
			$('#ignore-rules').html('IgnoreRules');
			$('#auto-reschd-drop').html('');
			$('#expectedtimeToCompl').val('');
			$('#arFrequency-rules').val('');
			$('#excludeDays-rules').html('Schedule Interactions');
			$('#probAlerEmail-rules').val('');
			$('#inqueReqTime-rules').val('');
			$('#inprogtime-rules').val('');
			$('#ansreqtime-rules').val('');
			$('#skillTi-form').val('');
			$('#defaultSkill').html('Current Skill : ');
			$("#profile_Detail").html("Profile Details ");
//initialising deactivate menu
			$("#paraforActivate").html("");
			$('#activatebutton').prop('disabled',true);
			$('#deactivatebutton').prop('disabled',true);
//
			$('#search_box').html('');
			$('#intrupt-drop').html('False');
			$('#prefered-form').val('');
			$('#expirtime-form').val('');
			document.getElementById('overflow-skill').checked =false;
			if(mode	==	"LIVE")
			{
				$('#skill-mode').html('Live');		
			}
			else
			{
				$('#skill-mode').html('Staging');
			}
			
			$('desc-form').val('');
			accountManager.mainSkillList  		=   new Array();
			accountManager.OverflowSkillList	=	new Array();
			accountManager.pendIntLookupsList	=   new Array();
			accountManager.islookupsfetched     =   false;
			$('.skillcount').html('<i class="fa fa-trash-o"></i>'+0);
			$('.overflowcount').html('<i class="fa fa-trash-o"></i>'+0);
			$('#SkillTable').html('');
			scrollflag = true;
			document.getElementById('mainSkill').className = "group-1 active";
			document.getElementById('overflowSkill').className = "group-2";
			
			$(".errTime").removeClass('errTime');
			$('.timezone').selectpicker('val','PDT');
			
			$('[class^=picker]').prop('disabled',false);
			
			accountManager.AccountData = new Object();			
		},	

		 search_filter       : function(phrase, _id,flag)
		   {
		   var words = phrase.value.toLowerCase().split(' ').join('');
		   var matchedArray = [];
		   words = words.split(",");
		    var ele;
		    if(flag=='table'){
		     var table = document.getElementById(_id);
		     for (var r = 0; r < table.rows.length; r++){
		      ele = table.rows[r].innerHTML.replace(/<[^>]+>/g,"");
		             var displayStyle = 'none';
		             for (var i = 0; i < words.length; i++) {
		              
		           if (ele.toLowerCase().indexOf(words[i]) >= 0){
		            displayStyle = '';
		         break;
		           }
		           else {
		         displayStyle = 'none';
		           }
		             }
		      table.rows[r].style.display = displayStyle;
		     }
		    }else if(flag=='list'){
		               
			    var matchedCards=[];
		    	for(var ele in cards){
		    		for(var i = 0; i < words.length; i++){
						
						var domain    =  cards[ele].domainName;
						if(domain == undefined)
						{
							cards[ele].domainName = "NA";
						}
		    			if (cards[ele].domainName.toLowerCase().indexOf(words[i])>=0 ||cards[ele].subAccountNumber.indexOf(words[i])>=0)
		    			{
		    				matchedCards.push(cards[ele]);
		    				break;
		    			}
		         }
		    		
		    	}
		    	accountManager.buildSideBar(matchedCards,null);
		    	if(navigator.platform.indexOf('Mac')==0)
		    		{
		    		$('.dis-sales').find('div').css('display','block');
		    		$('.dis-sales').find('div').css('display','inline-block');
		     }
		    }
		     
		  }
}

function deleteCookie(name)
{
		if(googleLogin != null && googleLogin === "true")
		{
			window.location.href = "/logoutWithGoogle";
		}
		else
		{
			window.location.href="/logout";
		}	
}
$('#deactivatebutton').click(function()
		{		
	console.log("clicked");
	
	$('#messageboxforactivate').slideToggle('slow');

		});

$('#activatebutton').click(function()
		{
	
	$('#messageboxforactivate').slideToggle('slow');

		});
function getInterTypeBasedOnName(interactionType)
{
	var interactionTypeId;
	switch(interactionType)
	{
		case 'Email Response':
			interactionTypeId = '84d52042-cc6d-4df8-acf4-1ecc278f790e';
			break;
		case 'Email Outbound':
			interactionTypeId = 'a7359531-3e43-4da1-be98-5a1392638e42';
			break;
		case 'Click to Talk':
			interactionTypeId = '8333d8c0-e22a-4e32-9bf5-0f578461823e';
			break;
		case 'Task Router':
			interactionTypeId = 'b9eafcf0-a770-412d-a557-6ec203641bb0';
			break;
		case 'V2 Work Items':
			interactionTypeId = '8405312c-4f51-42a9-bb55-3543d22e4569';
			break;
		case 'Calllist Outbound':
			interactionTypeId = 'b3485731-3c4e-4eeb-a15e-c5bc41286205';
			break;
	}
	return interactionTypeId;
}
function checkAccListToAddorUpdate(responseData){
	
	var accMap = JSON.parse(accountManager.datastring);
	var subAccountNumber = responseData.subAccountNumber;
	
	for(index in accMap){
		
		if(accMap[index].subAccountNumber == subAccountNumber ){
			
			for(key in responseData){
				if(key != "success")
				  accMap[index][key] = responseData[key];
			}
			accMap[index].isAssigned = "true" ;
			accountManager.datastring = JSON.stringify(accMap);
        return "updated";			
		}
	}
	return "append";
}

function validateStatusandAccount(accountList)
{
	var tempAccountList = new Array();
	for(index in accountList)
	{
		
			if(!!!accountList[index].status)
				accountList[index].status = "true";
			if(accountList[index].interactionTypeId != '168d6505-2f63-44ae-887c-e279e6fedcf3')
				tempAccountList.push(accountList[index]);
				
	}
	return tempAccountList;
}

//#Fetching all the agents before uploading the csv 
function getAgentsSkill()
{
	
		var returnDeferred = new $.Deferred();
		invalidSkillTitle = [];
		var operationToPerform = [];
		var options = {};
		
		for(var skillTitle in agentSkillLogin)
		{
			options.skillTitle = skillTitle ; 
			options.cursor 	   = "";	
			var deferredAgentCollection = getAgentSkillCollection(options);
			operationToPerform.push(deferredAgentCollection);
		}
		
		$.when.apply($,operationToPerform)
		.done(
				function( ) 
				{
					returnDeferred.resolve(agentSkillLogin);
				} 
			)
			.fail( function() { } );
	
	return returnDeferred;
}



function getAgentSkillCollection(options)
{
	var self = options;
    var deferred = new $.Deferred();
    var onSuccessOfFetchAgents =   function( data ) { //flow modify
                                            if( !!data.hasMoreData ) {
                                                    var optionsTemp = {};
                                                    optionsTemp.skillTitle = data.skillTitle;
                                                    optionsTemp.cursor = data.cursor;
                                                    getAgentSkillCore( optionsTemp )
                                                        .done( function( data ) { onSuccessOfFetchAgents( data ); } )
                                                            .fail( function( data ) { deferred.reject( data ); } )
                                            } else {
                                                deferred.resolve();
                                            }
                                        };
    getAgentSkillCore( options )
        .done( function( data ) { onSuccessOfFetchAgents( data ); } )
            .fail( function( data ) { deferred.reject( data ); } );
    return deferred;
	
}


function getAgentSkillCore(options)
{
	newSkillTitle = [];
	var skillTitle = options.skillTitle;
	var cursor = options.cursor;
	
	   var url 	=	"/getAgentsListBySkill?agentskill="+skillTitle+"&cursor="+cursor;
	   var deferred = new $.Deferred();
	   
		console.log(url);
		$.ajax
		({
			type : "GET",
			url : url,
			async:true,
			success : function(data)
			{
				if(data != "failure")
				{
					var responseJson	=	JSON.parse(data);
					var agentList		=	responseJson.loginList;
					var cursor			=	responseJson.cursor;
					var agentLogins     = 	[];
					var hasMoreData		=   responseJson.moreData;
					for(var index in agentList)
					{
						agentLogins.push(agentList[index].login); 
					}
					if(responseJson.hasOwnProperty('error') && responseJson.error == "skillSet not found")
						newSkillTitle.push(skillTitle);
					agentSkillLogin[skillTitle] = agentSkillLogin[skillTitle].concat(agentLogins);
				}
				if(data === 'failure')
					invalidSkillTitle.push(skillTitle);
				deferred.resolve({cursor : cursor, skillTitle : skillTitle, hasMoreData : hasMoreData });
			},
			error: function(e){
				  console.log("Error Occured while fetching Agents");
			}
		    
		});		
		return deferred;
}


function prepareAgentSkillUpload(event)
{
	file = event.target.files[0];
	try 
	{
		validateAndUploadSkill();
		
	} 
	catch (e) 
	{
			$.getScript("../js/Library/papaparse.js", function(){
				validateAndUploadSkill();
			});
	}

}

//#Skill Upload Starts Here 
function validateAndUploadSkill()
{
	var csvData = [];
	var csvKey  = []; 
	var skillIndex = -1;
	var skillTitle = "";
	agentSkillLogin = {};
	skillHistory = [];
	Papa.parse(file, {
		complete: function(results) {
			csvData =results.data;
			if(!!csvData && csvData.length>0){
				for(var index=0; index <= csvData[0].length-1 ; index++ ){
					if(csvData[0][index].toLowerCase() == "skill")
					{ 
						csvData[0][index] = "skill";
						skillIndex = index;
					}	
					else if(csvData[0][index].toLowerCase() == "login")
						csvData[0][index] = "login";
					else if(csvData[0][index].toLowerCase() == "level")
						csvData[0][index] = "level";
					else if(csvData[0][index].toLowerCase() == "url")
						csvData[0][index] = "url";
					csvKey.push(csvData[0][index]);
				}
			}
			if(skillIndex > -1 )
			{
				for(index = 1; index <= csvData.length-1 ; index++ )
				{   if(!!csvData[index][skillIndex])
					{
						skillTitle = csvData[index][skillIndex].trim();
						csvData[index][skillIndex] = skillTitle;
				    	agentSkillLogin[csvData[index][skillIndex]] = [];
				    	
					}
				}
			}		
			console.log("Keys for Skill Upload is" + csvKey);
					
			if (csvKey.length>0 && (csvKey.indexOf('skill') != -1) && (csvKey.indexOf('login') != -1)  && (csvKey.indexOf('level') != -1)  && csvData.length > 0)
			{
				messageWindow.showMessage("Checking Skills....");
				 agentsSkill = getAgentsSkill();
				 agentsSkill.done(function(data){
					             createInvalidSkillSet(newSkillTitle);
								 messageWindow.showMessage("Uploading Skills....");
								 var operationsToPerform = [];
									failedSkillsToUpload = [];
								  for(var i = 1 ; i < csvData.length ; i++ )
								  {
									  var uploadedDiffered = uploadSkill(csvData[i],csvKey);
									  operationsToPerform.push(uploadedDiffered);
								  }
								  
								  $.when.apply($,operationsToPerform)
									.done(
											function( agentSkillCollection ) 
											{												
												console.log("agentSkillCollection" + JSON.stringify(agentSkillCollection));
												if(failedSkillsToUpload.length > 0)
													displayFailedSkillCsv(failedSkillsToUpload);
												else
													messageWindow.popUpMessage( "Uploaded Successfully", 1000 );
												$('#skill-file').val("");
											} 
										)
										.fail( function() { } );
				 });
			}
			else
				displayInvalidSkillCsv();
		}
	});
}

function createInvalidSkillSet(newSkillList)
{
	for (i = 0; i < newSkillList.length; i++) 
	{
		var url = '/createSkillSet?skillTitle='+newSkillList[i]+'&iType=ar';
		if(newSkillList[i].indexOf(' ') == -1)
			$.ajax({
				type 	: "GET",
				url 	: url,
				async 	: false,
				success : function(data) {
					console.log("Successfully Created Skill");
				},
				error 	: function(e) {
					console.log("Error occoured while creating Invalid Skill");
				}
			});
	}
}

function uploadSkill(csvSkill,csvKey)
{
	var returnDeferred = new $.Deferred();
	var skilltitle = "";
	var login = "" ; 
	var skilllevel = "" ;
	var skillurl = "";
	var skilltype = null;
	var history = null;
    for(var i = 0; i < csvKey.length ; i ++ )
    {
	   if(csvKey[i] === 'skill')
		   skilltitle = csvSkill[i];
	   else if(csvKey[i] === 'login')
		   login = csvSkill[i];
	   else if(csvKey[i] === 'level')
		   skilllevel = csvSkill[i];
	   else if(csvKey[i] === 'url')
		   skillurl = csvSkill[i];
      
   }
   history = {skilltitle: skilltitle, login: login };
   historyStr = JSON.stringify(history);
   skillHistoryStr = JSON.stringify(skillHistory); 
   
	if(!!skilltitle && !!login  && !!skilllevel && agentSkillLogin[skilltitle].indexOf(login) == -1 && invalidSkillTitle.indexOf(skilltitle) ==-1 &&  skillHistoryStr.indexOf(historyStr) == -1)
	{
		url	=	'/alterSkillDataForAgentNEWCMS?lemail='+login+'&stitle='+skilltitle+'&slevel='+skilllevel+'&itype='+skilltype+'&url='+skillurl+'&operation=insert';
		console.log(url);
		$.ajax
		({
			type : "GET",
			url : url,
		}).done(function(data)
				{
					var response = JSON.parse(data);
					if(!!!response.isContactExist)
					{
						failedSkillsToUpload.push({skill : skilltitle, login : login , message : "Login not Exist"}); 
					}
					if(!!!response.isContactSkillSetInserted)
						failedSkillsToUpload.push({skill : skilltitle, login : login , message : "InValid Skill"}); 
					returnDeferred.resolve();
				}
		).fail(function(){
				returnDeferred.resolve();
		});	
		 skillHistory.push(history);
	}
	else
	{  if(csvSkill.length > 1)
	    if(!!!skilltitle )
	    	failedSkillsToUpload.push({skill : skilltitle, login : login, message : "Skill is Empty" });
	    else if(!!!login)
	    	failedSkillsToUpload.push({skill : skilltitle, login : login, message : "Login is Empty" });
	    else if(!!!skilllevel)
	    	failedSkillsToUpload.push({skill : skilltitle, login : login, message : "Level is Empty" });
	    else if(invalidSkillTitle.indexOf(skilltitle) != -1)
	    	failedSkillsToUpload.push({skill : skilltitle, login : login, message : "InValid Skill" });
	    else if(!!skilltitle && agentSkillLogin[skilltitle].indexOf(login) != -1)
	    	failedSkillsToUpload.push({skill : skilltitle, login : login, message : "Skill already Assigned." });
		else if(skillHistoryStr.indexOf(historyStr) != -1 )
			failedSkillsToUpload.push({skill : skilltitle, login : login, message : "Assigning Multiple Times" });
		returnDeferred.resolve();
	}
	return returnDeferred;
}

function displayInvalidSkillCsv()
{
	messageWindow.hideMessage();
	$('#dynamicModalstartdiv').html('');
	$('#dynamicModalstartdiv').html('<div id="dynamicModalstartdiv"><div class="modal-content"> <div class="modal-header">  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>  <h4 class="modal-title" id="myLargeModalLabel">Upload Status : Failed</h4>     </div> <div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;"><h4 id="deltablecreated">Invalid CSV File : </h4><table class="table"><thead><tr><th>Compulsory headers : </th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div></div></th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div>');
 	$('#faildeleted_items').html("<tr><td>Skill</td></tr><tr><td>Login</td></tr><tr><td>Level</td></tr><tr><td>Url (Optional)</td></tr>");
 	$('#deleting_status').modal('show');
}


function displayFailedSkillCsv(skillsFailed)
{
	messageWindow.hideMessage();
	$('#dynamicModalstartdiv').html('');
	$('#dynamicModalstartdiv').html('<div id="dynamicModalstartdiv"><div class="modal-content"> <div class="modal-header">  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>  <h4 class="modal-title" id="myLargeModalLabel">Upload status</h4>     </div> <div id="failedDeleting_modal_content" style="margin: 10px 15px 10px 15px;max-height: 1000px;overflow-y: auto;"><h4 id="deltablecreated">Failed Logins And Skills Are: </h4><table class="table"><tbody id="faildeleted_items"></tbody></table></div> </div></div></th></tr></thead><tbody id="faildeleted_items"></tbody></table></div> </div>');
	$('#faildeleted_items').append("<tr><td>Login</td><td>Skill</td><td>Message</td></tr>");
	for(var i = 0 ; i< skillsFailed.length ; i++)
		$('#faildeleted_items').append("<tr><td>" + skillsFailed[i]["login"] + "</td><td>" + skillsFailed[i]["skill"] + "</td><td>" + skillsFailed[i]["message"] + "</td></tr>");
 	$('#deleting_status').modal('show');
}

function getPDTDateTime(dbdate)
{
	var dbdateNumber = new Number(dbdate);
	var date = new Date(dbdateNumber);
	var datemill	=	date.getTime();
	var pdtoffset	=	"";
	var uploadPDTDate = "";
	var pdfoffsetmilli;
	
	var monthNames        = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
	
	console.log("TimeZone="+timezone);
	
	if(timezone == "PST")
		pdtoffset	=	480;
	else
		pdtoffset	=	420;
	dateoffset	=	date.getTimezoneOffset();
	if(dateoffset<0)
	{
		dateoffset	=	-(dateoffset);
		pdtoffset	=	pdtoffset+dateoffset;
		var pdfoffsetmilli	=	pdtoffset	* 60000;
		pdfoffsetmilli	=	datemill	-	pdfoffsetmilli;
	}
	else if(dateoffset>0)
	{
		pdtoffset	=	pdtoffset - dateoffset;
		var pdfoffsetmilli	=	pdtoffset	* 60000;
		pdfoffsetmilli	=	datemill	-	pdfoffsetmilli;
	}
	else if(dateoffset == 0)
	{
		var pdfoffsetmilli	=	pdtoffset	* 60000;
		pdfoffsetmilli	=	datemill	-	pdfoffsetmilli;		
	}
	var uploadedDate  = new Date(pdfoffsetmilli);
	uploadPDTDate = formatDateElement(uploadedDate.getDate())+" "+monthNames[uploadedDate.getMonth()]+" "+uploadedDate.getFullYear()+" "+formatDateElement(uploadedDate.getHours())+":"+formatDateElement(uploadedDate.getMinutes())+":"+formatDateElement(uploadedDate.getSeconds());
	return uploadPDTDate;
}

function formatDateElement(dateElement)
{
	if(dateElement <10)
	{
		var formatElement = "0";
		dateElement = formatElement.concat(dateElement);
	}	
  return dateElement;
}

//Zone Change
$('.timezone').change(function(e){
	$('.timezone').selectpicker('val',this.value);
	accountManager.isModified = true;
	console.log(this.id);
	});

//TimePicker Change
$("#startTimePicker").on("dp.hide", function (e) {
	if(accountRulesTimeValidator() && !!$('#stopTime').val())
		validateInvalidTriggerTime();
});
		
$("#startTimePicker").on("dp.show", function (e) {
	$(this).removeClass('errTime');
	accountManager.isModified = true;
});

$("#startTimePicker").on("dp.error", function (e) {
	$(this).addClass('errTime');
});

$("#stopTimePicker").on("dp.hide", function (e) {
	if(accountRulesTimeValidator() && !!$('#startTime').val())
		validateInvalidTriggerTime(); 
});

$("#stopTimePicker").on("dp.show", function (e) {
	$(this).removeClass('errTime');
	accountManager.isModified = true;
});

$("#triggerTimePicker").on("dp.change", function (e) {
	accountRulesTimeValidator();
	$(this).removeClass('errTime');
	accountManager.isModified = true;
});

$("#triggerTimePicker").on("dp.hide", function (e) {
	validateInvalidTriggerTime(); 
});

$("#exceptionalDayStartTimePicker").on("dp.hide", function (e) {
	accountRulesTimeValidator();
	$(this).removeClass('errTime');
	accountManager.isModified = true;
});

$("#exceptionalDayStopTimePicker").on("dp.hide", function (e) {
	accountRulesTimeValidator();
	$(this).removeClass('errTime');
	accountManager.isModified = true;
});

$("#startTime").focus( function(){$('#startTimePicker').removeClass("errTime");} );
$("#stopTime").focus( function(){$('#stopTimePicker').removeClass("errTime");} );
$("#triggerTime").focus( function(){$('#triggerTimePicker').removeClass("errTime");} );
$("#exceptionalDayStartTime").focus( function(){$('#exceptionalDayStartTimePicker').removeClass("errTime");} );
$("#exceptionalDayStopTime").focus( function(){$('#exceptionalDayStartTimePicker').removeClass("errTime");} );


function splitTimeStamp(time, _24HoursFormat)  // Time formate is 08:52 AM PDT
{
	var hours,minutes,zone,meridiem;
	var timeObject = new Object();

	try 
	{
		if(!!time)
		{
			timeAry = time.split(" ");
	
			meridiem = timeAry[1];
			zone = timeAry[2];
			hours = timeAry[0].split(":")[0];
			minutes = timeAry[0].split(":")[1];
	
			if (_24HoursFormat && meridiem == "PM" && hours < 12) {
	
				hours = (12 + parseInt(hours)).toString();
			}
			else if(_24HoursFormat && meridiem == "AM" && hours == 12 )
			{
				hours = "0";
			}
	
			timeObject.hours = hours.trim();
			timeObject.minutes = minutes.trim();
			timeObject.meridiem = meridiem.trim();
			timeObject.time = timeObject.hours+":"+timeObject.minutes+" "+timeObject.meridiem;
			timeObject.zone	= zone.trim();
			timeObject.invalidTime	= false;
			
			if(isNaN(hours) || isNaN(minutes) || (meridiem != "AM" && meridiem != "PM") )
			{
				timeObject.hours = "";
				timeObject.minutes = "";
				timeObject.meridiem = "";
				timeObject.zone	= !!$('.timezone').val() ? $('.timezone').val() : "PDT";
				timeObject.time = "";
				timeObject.invalidTime	= true;
			}
		}
	} 
	catch (exception)
	{
		timeObject.hours = "";
		timeObject.minutes = "";
		timeObject.meridiem = "";
		timeObject.zone	= !!$('.timezone').val() ? $('.timezone').val() : "PDT";
		timeObject.time = "";
		timeObject.invalidTime	= true;
	}
	return timeObject;
}



function reInitializeDatePicker(element, disableIntervals,minDate,maxDate)
{
	try
	{
		$(element).data("DateTimePicker").destroy();
		$(element).datetimepicker({
	    	format : 'LT',
			disabledTimeIntervals: disableIntervals // format : [[moment({ h: 0 }), moment({ h: 8 })], [moment({ h: 18 }), moment({ h: 24 })]]
	    });
		$(element).data("DateTimePicker").minDate(minDate);
	    $(element).data("DateTimePicker").maxDate(maxDate);
	}
	catch(exception)
	{
		console.log("Error While ReInitializing");
	}
	
}

function accountRulesTimeValidator()
{
	$(".errTime").removeClass('errTime');
	var autoReschd = "";
	
	if(!!!$("#startTime").val() && !!$("#stopTime").val())
	{
		messageWindow.popUpMessage( "Select the StartTime !!!", 3000 );
		$("#startTime").focus();
		$("#startTimePicker").addClass('errTime');
		return false;
	}
	
	
	if( (!!!$("#startTime").val() || !!!$("#stopTime").val() ) &&  !!$("#triggerTime").val())
	{
		
		$("#triggerTime").val("");
		
		if(!!!$("#startTime").val() && !!!$("#stopTime").val() )
		{
			messageWindow.popUpMessage( "Select the Start and Stop Time!!!", 3000 );
			$("#startTimePicker,#stopTimePicker").addClass('errTime');
			$("#startTime").focus();
		}
		else if(!!!$("#startTime").val())
		{
			messageWindow.popUpMessage( "Select the Start Time!!!", 3000 );
			$("#startTimePicker").addClass('errTime');
			$("#startTime").focus();
		}
		else if(!!!$("#stopTime").val())
		{
			messageWindow.popUpMessage( "Select the Stop Time!!!", 3000 );
			$("#stopTimePicker").addClass('errTime');
			$("#stopTime").focus();
		}
		return false;
	}
	
	if(!!$("#startTime").val() && !!$("#stopTime").val()  && !!!$("#triggerTime").val())
	{
		$("#triggerTime").val($("#startTime").val());
	}
	
	if(!!!$("#exceptionalDayStartTime").val() && !!$("#exceptionalDayStopTime").val() )
	{
		messageWindow.popUpMessage( "Select the ExceptionalDay StartTime!!!", 3000 );
		$("#exceptionalDayStartTimePicker").addClass('errTime');
		$("#exceptionalDayStartTime").focus();
		return false;
	}
	
	if(!!$("#exceptionalDayStartTime").val()  &&  !!!$("#exceptionalDayStopTime").val() )
	{
		messageWindow.popUpMessage( "Select the ExceptionalDay StopTime!!!", 3000 );
		$("#exceptionalDayStopTimePicker").addClass('errTime');
		$("#exceptionalDayStopTime").focus();
		return false;
	}
	
	
	if(!!$("#startTime").val() && !!!$("#stopTime").val())
	{
		$("#stopTimePicker").addClass('errTime');
		return false;
	}
	
	autoReschd = $('#auto-reschd-drop').html();
	if(!!autoReschd && autoReschd == "true" &&  (!!!$("#startTime").val() || !!!$("#stopTime").val()) )
	{
		messageWindow.popUpMessage( "Select Timing or Change AutoRescheduling Rule", 3000 );
		return false;
	}
		
	return true;
}


//Validates the Invalid trigger time and as well it sets the default trigger time if it has invalid Time
function validateInvalidTriggerTime()  
{
	try
	{
		if(!!$("#startTime").val() && !!$("#stopTime").val())
		{
					var startTimeObj = splitTimeStamp($('#startTime').val()+ ' ' + $('#startZone').val() , true);
					var stopTimeObj	= splitTimeStamp($('#stopTime').val()+ ' ' + $('#stopZone').val() , true);
					
					var startHours = parseInt(startTimeObj.hours);
					var startMinutes = parseInt(startTimeObj.minutes);
					var stopHours = parseInt(stopTimeObj.hours);
					var stopMinutes = parseInt(stopTimeObj.minutes);
					var startTimeMilli = null;
					var startTimeMilli = null;
					var triggerTimeObj =  null;
					var triggerTimeMilli = null;
					
					var disableIntervals = new Array();
					
					if(startHours < stopHours || (startHours == stopHours  && startMinutes <= stopMinutes) )
					{
						if(!!$('#triggerTime').val())
						{
							startTimeMilli 		= parseInt( moment({h: startHours, m: startMinutes}).format('x') );
							stopTimeMilli  		= parseInt( moment({h: stopHours, m: stopMinutes}).format('x') );
							triggerTimeObj 	 	= splitTimeStamp($('#triggerTime').val()+ ' ' + $('#triggerZone').val() , true);
							triggerTimeMilli 	= parseInt( moment({h: triggerTimeObj.hours, m: triggerTimeObj.minutes}).format('x') );
						}
					}
					else 
					{
						if(!!$('#triggerTime').val())
						{
							startTimeMilli		= moment({h: startHours, m: startMinutes}).format('x');
							stopTimeMilli  		= moment({h: startHours}).add(24 - startHours + stopHours,'h').add(stopMinutes,'m').format('x');
							triggerTimeObj 	 	= splitTimeStamp($('#triggerTime').val()+ ' ' + $('#triggerZone').val() , true);
							if(parseInt(triggerTimeObj.hours) < startHours )
								triggerTimeMilli = parseInt( moment({h: triggerTimeObj.hours, m: triggerTimeObj.minutes}).add(1,'d').format('x') ); 
							else
								triggerTimeMilli = parseInt( moment({h: triggerTimeObj.hours, m: triggerTimeObj.minutes}).format('x') );
						}
						
					}
					
					if(!!$('#triggerTime').val() && !(startTimeMilli <= triggerTimeMilli  && triggerTimeMilli <= stopTimeMilli ))
					{
						
						$('#triggerTimePicker').addClass('errTime');
						$('#triggerTime').val('');
						$('#triggerTimePicker').data("DateTimePicker").date(moment({ h: startHours ,m: startMinutes }));
						messageWindow.popUpMessage( "Trigger Time Re-Setted !!!", 3000 );
						console.log("Previously It has Invalid Trigger Time");
						return false;
					}
					else
					{
						return true;
					}
		}
	}
	catch(exception)
	{
		console.error("Error occoured while TriggerTime Validation" + exception);
		return false;
	}
	return true;
}

function validateARFrequency()
{
	var Message  = "";
	var invalidInput  = false;

	var value = $('#arFrequency-rules').val().trim();
	
	if(!!value && isNaN(value))
	{
		Message = "AR Frequency is Not a Valid Number";
		invalidInput = true;
	}
	else if(!!value && (value<1 || value>500))
	{
		Message = "AR frequency is not within Range";	
		invalidInput = true;
	}
	
	if(invalidInput)
	{
		$('.collapse3').trigger('click');
		$('#arFrequency-rules').val('');
		$('#arFrequency-rules').focus();
		messageWindow.popUpMessage(Message, 1000);
		return false;
	}
	return true;
}

$("#startTime, #stopTime, #triggerTime, #exceptionalDayStartTime, #exceptionalDayStopTime").keyup(
		function(e)
		{
			try
			{
				$('.errTime').removeClass('errTime');
				if(!!$(this).val())
				{
					var timeObj = splitTimeStamp( $(this).val() +' '+ $('.timeZone').val());
					if(timeObj.invalidTime)
					{
						$(this).val("");
						if(e.keyCode!= 8)
							messageWindow.popUpMessage( "Select the Valid Time", 2000 );
						$($(this).attr("id") + 'Picker').addClass("errTime");
					}
				}
			}
			catch(exception)
			{
				console.log(exception)
			}
		}
	);

