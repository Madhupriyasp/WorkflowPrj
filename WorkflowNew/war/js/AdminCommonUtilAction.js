var adminCommonActions = 
{
		bindAdminTabEvents		:		function()
		{
			
			$('#clearcache').click(function() 
			{
				 adminCommonActions.showSelectedDiv('clear_cache');
				 adminCommonActions.tabnavselected("clearcache");		  
				 adminpanel.clearcache_buttons();
			});
			
			$('#fetchaccount').click(function() 
			{
				 adminCommonActions.showSelectedDiv('fetch_account');
				 adminCommonActions.tabnavselected("fetchaccount");	
			});
			
			
			$('#clientparameters').click(function() 
			{
				 adminCommonActions.showSelectedDiv('client_parameters');
				 adminCommonActions.tabnavselected('clientparameters');
				 $('#checkBoxID').attr("checked",true);
				 adminpanel.getClientParameters();
			});
	
			$('#storeclientparameters').click(function() 
			{
				  adminCommonActions.showSelectedDiv('store_clientparam');
				  adminCommonActions.tabnavselected('storeclientparameters');
				  $('#subaccountnumber').val("SubAccountNumber");
			});
			
			
			$('#AssignNewClientParameter').click(function() 
			{
				  adminCommonActions.showSelectedDiv('assignnewclientparam');
				  adminCommonActions.tabnavselected('AssignNewClientParameter');
				  $('#clientsubaccountnumber').val("");
				  $('#clientparamvalue').val("");
				  adminpanel.getParamTitles();
			});
			
			$('#brand').click(function() 
			{
				 
				  adminCommonActions.showSelectedDiv('branding');
				  adminCommonActions.tabnavselected('brand');
		
			});
			
			$('#subAccountNumberStatus').click(function() 
			{
				  adminCommonActions.showSelectedDiv('subaccstatus');
				  adminCommonActions.tabnavselected('subAccountNumberStatus');
				  $('#accactivatesubaccountnumber').val("SubAccountNumber");
		
			});
			
			$('#submitToAR').click(function() 
			{
				  adminCommonActions.showSelectedDiv('buildaraccount');
				  adminCommonActions.tabnavselected('submitToAR');
				  
			});
			
			
			$('#createEmailResponseAccount').click(function()
			{
				adminCommonActions.showSelectedDiv('emailresponseaccount');
				adminCommonActions.tabnavselected('createEmailResponseAccount');
				$('#clientemailid').val("");
		 		$('#clientpassword').val("");
		 		$('#cc').val("");
			});
			
			
			$('#EmailListAdmin').click(function()
			{
				adminCommonActions.showSelectedDiv('emaillistadmin');
				adminCommonActions.tabnavselected('EmailListAdmin');
				adminCommonActions.doAjaxPost( "/EmailListAdmin?" , "data=data" ,adminpanel.loadEmailListAdmin);
				
			});
			
			$('#createEmailListenerAccount').click(function()
			{
				adminCommonActions.showSelectedDiv('emaillisteneraccount');
				adminCommonActions.tabnavselected('createEmailListenerAccount');
				$('#clientemailid').val("");
		 		$('#clientpassword').val("");
		 		$('#cc').val("");
				
			});
			
			//$("#account_menu").click(function()
			$("#account_menu").live('mouseover' , function()
			{
				console.info("Onclick of account");
				$("#account_menu #account_id").css("display","block");
		    });
			
			$('#account_id').live('mouseleave' , function() 
					{
						$('#account_id').hide();
				    });		
			
			$("#addSkillToAgent").click(function(){
				console.log("Onclick of add skills to agent");
				adminCommonActions.showSelectedDiv('addSkillToAgentNow');
				adminCommonActions.tabnavselected('addSkillToAgentNow');
			});
			
			$('#addSkill').click(function()
					{
						adminCommonActions.showSelectedDiv('addskill');
						adminCommonActions.tabnavselected('addSkill');
						$('#t1interactiontype').val("");
						$('#t1clientid').val("");
						$('#t1currentskilltitle').val("");
						$('#t1skilltitle').val("");
						$('#t1v2skillid').val("");
						$('#t1skilldescription').val("");
						$('#t2skilltitle').val("");
						$('#t2v2skillid').val("");
						$('#t2skilldescription').val("");
						//$('#t1routingmode').attr("disabled","disabled");
						//$('#t1currentskilltitle').attr("disabled","disabled");
						//$('#t1skilltitle').attr("disabled","disabled");
						//$('#t2skilltitle').attr("disabled","disabled");
						//$('#t2v2skillid').attr("disabled","disabled");
						//$('#t2skilldescription').attr("disabled","disabled");
						//$('#t2skillsubmit').attr("disabled","disabled");
						//$('#t1skillsubmit').attr("disabled","disabled");
					});
					
					/*$("#t1new").click(function(){
						$('#t1skilltitle').removeAttr("disabled");
						$('#t1v2skillid').removeAttr("disabled");
						$('#t1skilldescription').removeAttr("disabled");
					});
					
					$("#t1existing").click(function(){
						$('#t1skilltitle').removeAttr("disabled");
						$('#t1v2skillid').attr("disabled","disabled");
						$('#t1skilldescription').attr("disabled","disabled");
					});
					*/
						
				
			
		},
		
		
		
		showSelectedDiv				:		function(divid)
		{
			console.info("Inside showSelectedDiv method");
			console.info("divid ::"+divid);
			$('.hideable').hide();
			$('#'+divid).css("display", "block");
		},
	
		tabnavselected : function(id)
		{
			console.info("tabid selected is"+id);
			 $(".adminpanel_nav > ul > li").removeClass("active");
			 $('#'+id).addClass("active");
			
		},
		
		doAjaxGet			:		function ( url , functionToBeInvoked )
		{
			console.info("Inside Get method");
			try
			{
				$.ajax({
							type : "GET",
							url : url,
							//async : false,
							success : function(data) 
							{
								console.info("data ::"+data);
								if(typeof functionToBeInvoked == 'function') 
							     {
										console.log('Function exists !');
										functionToBeInvoked(data);
							     }
								else
								{
									console.log('Function does not exist');
								}
							}
						});
			}
			catch(e)
			{
				console.error("Exception in ajax call get type");
			}
			
		},
		
		doAjaxPost			:		function ( url , data , functionToBeInvoked )
		{
			console.info("Inside post method");
			console.info("URL ::"+url);
			try
			{
				$.ajax({
						type : "POST",
						url  : url,
						//async: false,
						data : data,
						success : function(data) 
						{
							//console.info("Data ::"+data);
							if(typeof functionToBeInvoked == 'function') 
						     {
									console.log('Function exists !');
									functionToBeInvoked(data);
						     }
							else
							{
								console.log('Function does not exist');
							}
						}
				});
			}
			catch(e)
			{
				console.error("Exception in ajax call POST type");
			}
			
		},	
				
//		getBrandingFromSession		:	function ()
//		{
//
//			if(branding_headerColor == null ||  branding_headerColor == "null" || typeof branding_headerColor == "undefined" || branding_headerColor == "")
//			{
//				branding_headerColor			=	"#3d93cc";
//			}
//			if (branding_logo == null || branding_logo == "null" || typeof branding_logo == "undefined" || branding_logo == "" || branding_logo == " "  )
//			{
//				console.info("INside the If lopp and logo is null::"+branding_headerColor);
//				 branding_logo				=	"";
//				 $('#defaultbrand').html('Conversion Support');
//			     $('.header_holder').css('background-color', branding_headerColor);
//			 }
//			 else
//			 {
//				 console.info("INside the else lopp and logo and headercolor is nto null");
//			    $('.header_holder').css('background', 'url('+branding_logo+') 32px 5px no-repeat '+branding_headerColor+'');
//			 }
//			
//			
//			   $('#home').css('background-color', branding_headerColor);
//			   $('#transcriptpage').css('background-color', branding_headerColor);
//			   $('#settingspage').css('background-color', branding_headerColor);
//			
//		},
		
		isNumeric					:	function(value)
		{
			console.info("Inside isNumeric method");
			try
			{
				  if (value == "" || value == null || !value.toString().match(/^[-]?\d*\.?\d*$/))
				  {
					  return false;  
				  }
				  else
				  {
					  return true;  
				  }
			}
			catch(e)
			{
				console.error("Exception in isNumeric :: "+e);
			}
		},
		
		showVoiceBox	:	function( msg)
		{
			$('#showmsg').html(msg);
			$('#voice-box').css( 'display' , 'block' );
			$('#voice-box').delay(3000).fadeOut(3000);
		},
		
		showLoading		:	function(msg)
		{
			$('#showmsg').html(msg);
			$('#voice-box').css( 'display' , 'block' );
		},
		
		hideLoading		:	function()
		{
			$('#voice-box').fadeOut(1000);
		},
		
		showTabWithChanges	:	function()
		{
			if( typeof chatbuilder != 'undefined' && chatbuilder.isEditInProgress )
			{
				$('#chatbuilderpage').click();
				//this.showConfirmBox('Do you wish to abandon your changes?');
			}
			else if( typeof manageUsers != 'undefined' && manageUsers.editAgentData)
			{
				$('#agentpage').click();
				//this.showConfirmBox('Do you wish to abandon your changes?');
			}
			else
			{
				commonActions.deleteCookie("tabselectedvalue");
				window.location.href	= '/logout' ;
			}
		},
		doAjaxGet			:		function ( url , functionToBeInvoked )
		{
			console.info("Inside Get method"+url);
			try
			{
				$.ajaxSetup ({
				    // Disable caching of AJAX responses
				    cache: false
				});

				$.ajax({
							type : "GET",
							url : url,
							success : function(data) 
							{
								if(typeof functionToBeInvoked == 'function') 
							     {
										functionToBeInvoked(data);
							     }
								else
								{
									console.log('Function does not exist');
								}
							}
						});
			}
			catch(e)
			{
				console.error("Exception in ajax call get type");
			}
			
		},
		
		doAjaxPost			:		function ( url , data , functionToBeInvoked )
		{
			console.info("URL ::"+url);
			try
			{
				$.ajaxSetup ({
				    // Disable caching of AJAX responses
				    cache: false
				});

				
				$.ajax({
						type : "POST",
						url  : url,
						data : data,
						success : function(data) 
						{
							if(typeof functionToBeInvoked == 'function') 
						     {
									functionToBeInvoked(data);
						     }
							else
							{
								console.log('Function does not exist');
							}
						}
				});
			}
			catch(e)
			{
				console.error("Exception in ajax call POST type");
			}
			
		},
		
		logout : function()
		{
			//tab_cookie.deleteCookie("tabselectedvalue");
			window.location.href	= '/logout' ;
		},
		
		makepaymentlogout : function()
		{
			window.location.href	= '/logout' ;
			
		},
		
//		showamdinpanel : function()
//		{
//			window.location.href = conversionsupporturl+'/adminpanel';
//		},
//		showVoiceBox	:	function( msg , timeout )
//		{
//			$('#showmsg').html(msg);
//			$('#voice-box').css( 'display' , 'block' );
//			$('#voice-box').fadeOut(timeout);
//		},
		

	};

$(document).ready(function()
{ 
	console.info('Inside document ready function in admincommonutilaction js file');
	adminCommonActions.bindAdminTabEvents();
	adminCommonActions.tabnavselected('clearcache');
//	adminCommonActions.getBrandingFromSession();
	
});
