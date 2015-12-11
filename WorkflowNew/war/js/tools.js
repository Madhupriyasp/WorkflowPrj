$(document).ready(function() {
	
	var dateStart = $('#download_from_date')
    .datepicker({
        startDate: new Date()
    })
    .on('changeDate', function(ev){
        
        dateStart.datepicker('hide');
        dateEnd.focus();
    });

    var dateEnd = $('#download_to_date')
    .datepicker()
    .on('changeDate', function(ev){
        dateEnd.datepicker('hide');
    });
    
    
    
	var reschedule_date = $('#download_from_date')
	.datepicker({
	    startDate: new Date()
	})
	.on('changeDate', function(ev){
		reschedule_date.datepicker('hide');
	});
	
			$('#AddNewSkill').hide();
			$('#foo').hide();
			$('#newfunctionality').hide();
			$('#Add_skills_to_agent').addClass("selected");
			$('#newloading').hide();
			$('#newloading1').hide();
			$('#bchatwindowdiv').hide();
			$('#acc_status').hide();
			$('#enabled').hide();
			$('#curr_status_en').hide();
			$('#disabled').hide();
			$('#curr_status_dis').hide();
			$("#download_interactions_div").hide();
			$("#cache_manager").hide();
			$('#uploadcsv').hide();
			$('#bill-wrapper').hide();
			index	=	0;
//			$('#enable_disableoption').hide();
			
			$("#download_csv_button").on("click",function(){
				adminpanel.downloadInteractionsCsv();
			});
			
			
			
			$('#fetchme').click(function(){
				
				var pathname = location.href;
				var path	 = pathname.split('/')[2];	
				if($("#fetchinbox").val() == ""|| $("#fetchinbox").val() == undefined || $("#fetchinbox").val() == null){
					 $("#fetchinbox").attr("placeholder", "Enter Account Number");
				}else{
					var accNo	 =	 $("#fetchinbox").val();
					var url = "http://"+path+"/?fetch=true&accno="+accNo.trim();
					window.location.href=url;
				}
			});

   });
var localvar = "";
var index=null;
var validationData="";
var dataforskill="";
var result	= "";
var adminpanel = 
{
	hide_show: function(obj)
		{
			$(obj).addClass("selected");
			console.log("the obj selected is--->"+obj.id);
			if(obj.id==="Add_skills_to_agent")
				{
				$('#Add_skills_to_agent').addClass("selected");
				$('#Add_a_new_skill').removeClass("selected");
				$('#Add_a_new_functionality').removeClass("selected");
				$('#Activate_Deactivate_acc').removeClass("selected");
				$("#Download_Interactions").removeClass("selected");
				$("#Cache_Manager").removeClass("selected");
				$("#Upload_csv").removeClass("selected");
				$("#Billing").removeClass("selected");
				$('#CreateNewAgent').show();
				$('#AddNewSkill').hide();
				$('#newfunctionality').hide();
				$('#acc_status').hide();
				$("#download_interactions_div").hide();
				$("#cache_manager").hide();
				$('#uploadcsv').hide();
				$('#newBill').hide();
				$('#AddSkillToAgent').hide();
				index=0;
				}
			else if(obj.id==="statistics")
				{
				$('#foo').hide();
				$('#newfunctionality').show();
				$('#CreateNewAgent').hide();
				$('#bill-wrapper').hide();
				$('script[src="/js/emailListener.js"]').each(function(){$(this).remove()});
				$('head').append('<link rel="stylesheet" type="text/css" href="/css/statistic.css">');
				
				$('#Add_skills_to_agent').removeClass("selected");
				$('#Add_a_new_skill').addClass("selected");
				$('#Add_a_new_functionality').removeClass("selected");
				$('#Activate_Deactivate_acc').removeClass("selected");
				$("#Download_Interactions").removeClass("selected");
				$("#Cache_Manager").removeClass("selected");
				$("#Upload_csv").removeClass("selected");
				$("#Billing").removeClass("selected");
		    	$('#CreateNewAgent').hide();
				$('#AddNewSkill').show();
				$('#acc_status').hide();
				$("#download_interactions_div").hide();
				$("#cache_manager").hide();
				$('#uploadcsv').hide();
				$('#AddSkillToAgent').hide();
				index=1;
				}
			else if(obj.id==="emaillistener")
			{
				$('#foo').hide();
				$('#newfunctionality').hide();
				$('#CreateNewAgent').show();
				$('#bill-wrapper').hide();
				$('#AddSkillToAgent').hide();
				$('link[href="/css/statistic.css"]').each(function(){$(this).remove()});
				$('head').append('<script type="text/javascript" src="/js/emailListener.js"></script>');
				
				index=1;
			}
			else if(obj.id==="availableagents")
			{
				$('#foo').show();
				$('#newfunctionality').hide();
				$('#CreateNewAgent').hide();
				$('#bill-wrapper').hide();
				$('script[src="/js/emailListener.js"]').each(function(){$(this).remove()});
				$('link[href="/css/statistic.css"]').each(function(){$(this).remove()});
				
				$('#Add_skills_to_agent').removeClass("selected");
				$('#Add_a_new_skill').addClass("selected");
				$('#Add_a_new_functionality').removeClass("selected");
				$('#Activate_Deactivate_acc').removeClass("selected");
				$("#Download_Interactions").removeClass("selected");
				$("#Cache_Manager").removeClass("selected");
				$("#Upload_csv").removeClass("selected");
				$("#Billing").removeClass("selected");
		    	$('#CreateNewAgent').hide();
				$('#AddNewSkill').show();
				$('#acc_status').hide();
				$("#download_interactions_div").hide();
				$("#cache_manager").hide();
				$('#uploadcsv').hide();
				$('#AddSkillToAgent').hide();
				index=1;
			}
			else if(obj.id === "Billing")
		    {
				$('#foo').hide();
				$('#newfunctionality').hide();
				$('#bill-wrapper').show();
				$('#CreateNewAgent').hide();
				$('script[src="/js/emailListener.js"]').each(function(){$(this).remove()});
				$('head').append('<link rel="stylesheet" type="text/css" href="/css/statistic.css">');
				
				$('#Activate_Deactivate_acc').removeClass("selected");
				$('#Add_skills_to_agent').removeClass("selected");
				$('#Add_a_new_skill').removeClass("selected");
				$('#Add_a_new_functionality').removeClass("selected");
				$("#Download_Interactions").removeClass("selected");
				$("#Cache_Manager").removeClass("selected");
				$("#Upload_csv").removeClass("selected");
				$("#newBill").addClass("selected");
	    		$('#AddNewSkill').hide();
				$('#acc_status').hide();
				$("#download_interactions_div").hide();
				$("#cache_manager").hide();
				$('#uploadcsv').hide();
				$('#myform').hide();
				$('#AddSkillToAgent').hide();
		    }
		    else if(obj.id === "AgentSkill")
			{
				$('#foo').hide();
				$('#newfunctionality').hide();
				$('#CreateNewAgent').hide();
				$('#bill-wrapper').hide();
				$('#AddSkillToAgent').show();
				index=1;
			}
			else if(obj.id==="Add_a_new_functionality")
				{
				$('#Activate_Deactivate_acc').removeClass("selected");
				$('#Add_skills_to_agent').removeClass("selected");
				$('#Add_a_new_skill').removeClass("selected");
				$('#Add_a_new_functionality').addClass("selected");
				$("#Download_Interactions").removeClass("selected");
				$("#Cache_Manager").removeClass("selected");
				$("#Upload_csv").removeClass("selected");
				$("#Billing").removeClass("selected");
	    		$('#CreateNewAgent').hide();
	    		$('#AddNewSkill').hide();
	    		$('#newfunctionality').show();
	    		$('#acc_status').hide();
	    		$("#download_interactions_div").hide();
	    		$("#cache_manager").hide();
	    		$('#uploadcsv').hide();
				$('#newBill').hide();
	    		index=2;
				}
			else if(obj.id==="Activate_Deactivate_acc")
				{
					$('#Add_skills_to_agent').removeClass("selected");
					$('#newloading2').hide();
					$('#Add_a_new_skill').removeClass("selected");
					$('#Add_a_new_functionality').removeClass("selected");
					$('#Activate_Deactivate_acc').addClass("selected");
					$("#Download_Interactions").removeClass("selected");
					$("#Cache_Manager").removeClass("selected");
					$("#Upload_csv").removeClass("selected");
					$("#Billing").removeClass("selected");
					$('#CreateNewAgent').hide();
		    		$('#AddNewSkill').hide();
		    		$('#newfunctionality').hide();
					$('#acc_status').show();
					$("#download_interactions_div").hide();
					$("#cache_manager").hide();
					$('#uploadcsv').hide();
					$('#newBill').hide();
				}
			else if(obj.id === "Download_Interactions")
			{
				$('#Activate_Deactivate_acc').removeClass("selected");
				$('#Add_skills_to_agent').removeClass("selected");
				$('#Add_a_new_skill').removeClass("selected");
				$('#Add_a_new_functionality').removeClass("selected");
				$("#Download_Interactions").addClass("selected");
				$("#Cache_Manager").removeClass("selected");
				$("#Billing").removeClass("selected");
				$('#CreateNewAgent').hide();
	    		$('#AddNewSkill').hide();
	    		$('#newfunctionality').hide();
				$('#acc_status').hide();
				$("#Upload_csv").removeClass("selected");
				$("#download_interactions_div").show();
				$("#cache_manager").hide();
				$('#uploadcsv').hide();
				$('#newBill').hide();
		    }
			else if(obj.id === "Cache_Manager")
			{
				$('#Activate_Deactivate_acc').removeClass("selected");
				$('#Add_skills_to_agent').removeClass("selected");
				$('#Add_a_new_skill').removeClass("selected");
				$('#Add_a_new_functionality').removeClass("selected");
				$("#Download_Interactions").removeClass("selected");
				$("#Upload_csv").removeClass("selected");
				$("#Cache_Manager").addClass("selected");
				$("#Billing").removeClass("selected");
				$('#CreateNewAgent').hide();
	    		$('#AddNewSkill').hide();
	    		$('#newfunctionality').hide();
				$('#acc_status').hide();
				$("#download_interactions_div").hide();
				$("#cache_manager").show();
				$('#uploadcsv').hide();
				$('#newBill').hide();
		    }
		    else if(obj.id === "Upload_csv")
			{
				$('#Activate_Deactivate_acc').removeClass("selected");
				$('#Add_skills_to_agent').removeClass("selected");
				$('#Add_a_new_skill').removeClass("selected");
				$('#Add_a_new_functionality').removeClass("selected");
				$("#Download_Interactions").removeClass("selected");
				$("#Cache_Manager").removeClass("selected");
				$("#Billing").removeClass("selected");
				$('#CreateNewAgent').hide();
	    		$('#AddNewSkill').hide();
	    		$('#newfunctionality').hide();
				$('#acc_status').hide();
				$("#download_interactions_div").hide();
				$("#cache_manager").hide();
				$("#Upload_csv").addClass("selected");
				$('#uploadcsv').show();
				$('#myform').hide();
				$('#newBill').hide();
		    }
			return true;
		    
		},
//For adddAgent button in add skills to agent
getDetailsFromLogin : function()
 	{
	if(index == 0)
		{
			var loginName=$.trim($('#agentName').val());
			console.log("the mail id is=---?>"+loginName);
			 if(loginName == undefined || loginName	== null  || loginName	=== "")
			{
				 adminCommonActions.showVoiceBox("enter your mail Id",4000);
			}
			 else{
						 $('#newloading').show();
					   $('#instruction').css("display","none");
					   $('#enterURL').css("display","none");
					   adminCommonActions.doAjaxGet( '/getDataToDisplayInTableFromNEWCMS?login='+loginName,this.displayAgentSkillsNew );
			 }
		}
	else if(index == 2)
		{
		
		var loginName=$.trim($('#agentName1').val());
		console.log("the mail id is=---?>"+loginName);
		 if(loginName == undefined || loginName	== null  || loginName	=== "")
		{
			 adminCommonActions.showVoiceBox("enter your mail Id",4000);
		}
		 else{
					 $('#newloading').show();
				   $('#instruction').css("display","none");
				   $('#enterURL').css("display","none");
 	
 		
				   	console.log("the name coming is--->"+loginName);
 		
				   	adminCommonActions.doAjaxGet( '/getDataToDisplayInTableFromNEWCMS?login='+loginName,this.displayAgentSkillsNew );
	 	}
		}
	 },
	displayAgentSkillsNew : function(data)
 	{
		
		if(data==null)
		{
			adminCommonActions.showVoiceBox("Failed Fetching data",4000);
		}
		else{
			adminCommonActions.showVoiceBox("Fetched data successfully",4000);
 		data = jQuery.parseJSON(data);
 		localvar	=	data;
 		var name	=	"no name";
 		if(index===2)
 			{
 		var login	=	$("#agentName").val();
 			}
 		else{
 			var login	=	$("#agentName1").val();
 		}
 		
 		$('#message').show();
 		
 		if(index===2){
 			$('#newloading1').hide();
 			$('#newloading').hide();
 			$("#displayTable1").show();
 			$("#agent_skillstable1").html("");
 		}
 		else{
 			$('#newloading').hide();
 			$('#newloading1').hide();
 			$("#displayTable").show();
 			$("#agent_skillstable").html("");
 		}
 	/*	for(index in data)
 		{
 			var skillarray	=	new Array();
 			var skills	=	data[index].title;
 			skillarray.push(skills);
 		}*/
 		var url="";
 		var i = 1;
 		if(index===2)
 			{
 		$("#agent_skillstable1").append('<tr style="text-align:centre">'+
 				'<td>'+login+'</td>'+
 				'<td>skill Title</td>'+
 				'<td>Skill Type Id</td>'+
 				'<td>skill Level</td>'+
 				'<td>url</td>'+
 				'<td></td>'+
 				'<td></td>'+
 				'</tr><tr style="text-decoration:overline;"></tr>');
 		$.each(data, function(index, jsondata)
		{
 			//console.log(jasondata)
 			login	=	jsondata.login;
 			name	=	jsondata.name;
 			url		=	jsondata.url;
 			if(String(url).match("undefined"))
 				{
 				url=" ";
 				}
 			else{
 				url = url;
 			}
 			console.info(jsondata);
 			if(jsondata.skillSetTypeId == "70158413-3ae0-4896-80b7-50d411ad0cd2" || jsondata.skillSetTypeId == "d1add1d7-c4f3-45a4-886d-b7d778fa1f98")
 			{
 				$("#agent_skillstable1").append('<tr style="text-align:centre">'+
 			 			'<td id="login_'+jsondata.title+'_'+i+'">'+jsondata.login+'</td>'+
 			 			'<td id="skilltitle_'+jsondata.title+'_'+i+'">'+jsondata.title+'</td>'+
 			 			'<td id="skilltype_'+jsondata.title+'_'+i+'"><select id="type_'+jsondata.title+'"><option selected="selected">webchat</option><option>event to talk</option></select></td>'+
 			 			'<td id="skilllevel_'+jsondata.title+'_'+i+'"><input type="text" id="level_'+jsondata.title+'" value="'+jsondata.skillLevel+'"></td>'+
 			 	        '<td id="skillurl_'+jsondata.title+'_'+i+'"><input type="text" id="url_'+jsondata.skillSetId+'"  value="'+url+'"></td>'+
 			 	        '<td><input type="button" style="margin-left: 50px;width: 100px;" name="updateSkill" value="Update" class="'+jsondata.title+'_'+i+'" onclick="adminpanel.updateSkillOfAgentNew(this);"></td>'+
 			 	        '<td><input type="button" style="margin-left: 25px;width: 100px;" name="deleteSkill" value="Delete" class="'+jsondata.title+'_'+i+'" onclick="adminpanel.deleteSkillOfAgentNew(this);"></td>'+
 			 	        '</tr>');
 			}
 			else
			{
 				$("#agent_skillstable1").append('<tr style="text-align:centre">'+
 			 			'<td id="login_'+jsondata.title+'_'+i+'">'+jsondata.login+'</td>'+
 			 			'<td id="skilltitle_'+jsondata.title+'_'+i+'">'+jsondata.title+'</td>'+
 			 			'<td id="skilltype_'+jsondata.title+'_'+i+'"><select id="type_'+jsondata.title+'"><option>webchat</option><option selected="selected">event to talk</option></select></td>'+
 			 			'<td id="skilllevel_'+jsondata.title+'_'+i+'"><input type="text" id="level_'+jsondata.title+'" value="'+jsondata.skillLevel+'"></td>'+
 			 	        '<td id="skillurl_'+jsondata.title+'_'+i+'"><input type="text" id="url_'+jsondata.skillSetId+'"  value="'+url+'"></td>'+
 			 	        '<td><input type="button" style="margin-left: 50px;width: 100px;" name="updateSkill" value="Update" class="'+jsondata.title+'_'+i+'" onclick="adminpanel.updateSkillOfAgentNew(this);"></td>'+
 			 	        '<td><input type="button" style="margin-left: 25px;width: 100px;" name="deleteSkill" value="Delete" class="'+jsondata.title+'_'+i+'" onclick="adminpanel.deleteSkillOfAgentNew(this);"></td>'+
 			 	        '</tr>');
			}
 			i++;
		});
 		$("#agent_skillstable1").append('<tr id="accountnumselect" style="text-align:centre">'+
 				'<td id="login_addN">'+login+'</td>'+
 				'<td id="selection">'+
 				'<ul>'+'<li>Update using</li>'+
 				'<li>'+
 				'<select id="acc_skill" onchange="adminpanel.altertablerow(this)">'+
 				'<option>Client Id</option>'+
 				'<option>Skill Set</option>'+
 				'</select>'+
 				'</li></ul>'+
 				'</td>'+
 				'<td><ul><li>Client Id</li>'+
 				'<li><input type="text" id="t1clientid1"></li>'+
 				'</ul>'+
 				'</td>'+
				'<td><input type="button" readonly id="t1clientidSubmit" value="get Current skill" onclick="adminpanel.checkCurrentSkillModified()"></td>'+
 				'<td><ul><li>Interaction Type</li>'+
 				'<li><select id="t1interactiontype1">'+
				'<option>webchat</option>'+
				'<option>Event To Talk</option>'+
				'</select></li>'+'</td>'+
				'<td><ul><li>Routing Mode</li>'+
				'<li>'+
				'<select id="t1routingmode1" onchange="adminpanel.checkfortheCurrentSkill()">'+
				'<option>LIVE</option>'+
				'<option>DEV/STAGING</option>'+
				'<option>OVERFLOW_LIVE</option>'+
				'<option>OVERFLOW_DEV/STAGING</option>'+
				'</select>'+
				'</li>'+
				'</td>'+
				'<td><ul><li>Current Skill</li>'+
				'<li><input type="text" id="t1currentskilltitle1">'+
				'</li></td>'+
				'<td><input type="button" name="addSkill" value="Add" onclick="adminpanel.validateAgentSkill(this);"></td></tr>'+
				
				'<tr id="skillsetrow" style="text-align:centre"><td id="login_addN">'+login+'</td>'+
				'<td id="selection">'+
				'<ul>'+'<li>Update using</li>'+
 				'<li>'+
 				'<select id="acc_skill_set" onchange="adminpanel.altertablerow(this)">'+
 				'<option>Client Id</option>'+
 				'<option>Skill Set</option>'+
 				'</select>'+
 				'</li></ul>'+
 				'</td>'+
 				'<td id="title_addN"><ul><li>Skill Title</li><li><input type="text" id="skill_title"></li></ul></td>'+
 				'<td id="type_addN"><ul><li>Skill Type</li><li><select id="t1interactiontype1"><option selected="selected">webchat</option><option>event to talk</option></select></li></td>'+
 				'<td id="level_addN"><ul><li>Skill Level</li><li><input type="text" id="skill_level"></li></ul></td>'+
 				'<td id="url_addN"><ul><li>URL</li><li><input type="text" id="skill_typeId"></li></ul></td>'+
 				'<td><input type="button" name="addSkill" value="Add" onclick="adminpanel.validateAgentSkill(this);"></td>'+
 				'</tr>');
 				$('#skillsetrow').hide();
 			}
 		else{
 	 		$("#agent_skillstable").append('<tr style="text-align:centre">'+
 	 				'<td>'+login+'</td>'+
 	 				'<td>skill Title</td>'+
 	 				'<td>Skill Type Id</td>'+
 	 				'<td>skill Level</td>'+
 	 				'<td>url</td>'+
 	 				'<td></td>'+
 	 				'<td></td>'+
 	 				'</tr><tr style="text-decoration:overline;"></tr>');
 	 		$.each(data, function(index, jsondata)
 			{
 	 			login	=	jsondata.login;
 	 			name	=	jsondata.name;
 	 			console.info(jsondata);
 	 			url		=	jsondata.url;
 	 			if(String(url).match("undefined"))
 	 				{
 	 				url=" ";
 	 				}
 	 			else{
 	 				url = url;
 	 			}
 	 			if(jsondata.skillSetTypeId == "70158413-3ae0-4896-80b7-50d411ad0cd2" || jsondata.skillSetTypeId == "d1add1d7-c4f3-45a4-886d-b7d778fa1f98" )
 	 			{
 	 				$("#agent_skillstable").append('<tr style="text-align:centre">'+
 	 			 			'<td id="login_'+jsondata.title+'_'+i+'">'+jsondata.login+'</td>'+
 	 			 			'<td id="skilltitle_'+jsondata.title+'_'+i+'">'+jsondata.title+'</td>'+
 	 			 			'<td id="skilltype_'+jsondata.title+'_'+i+'"><select id="type_'+jsondata.title+'"><option selected="selected">webchat</option><option>event to talk</option></select></td>'+
 	 			 			'<td id="skilllevel_'+jsondata.title+'_'+i+'"><input type="text" id="level_'+jsondata.title+'" value="'+jsondata.skillLevel+'"></td>'+
 	 			 	        '<td id="skillurl_'+jsondata.title+'_'+i+'"><input type="text" id="url_'+jsondata.skillSetId+'"  value="'+url+'"></td>'+
 	 			 	        '<td><input type="button" name="updateSkill" value="Update" class="'+jsondata.title+'_'+i+'" onclick="adminpanel.updateSkillOfAgentNew(this);"></td>'+
 	 			 	        '<td><input type="button" name="deleteSkill" value="Delete" class="'+jsondata.title+'_'+i+'" onclick="adminpanel.deleteSkillOfAgentNew(this);"></td>'+
 	 			 	        '</tr>');
 	 			}
 	 			else
 				{
 	 				$("#agent_skillstable").append('<tr style="text-align:centre">'+
 	 			 			'<td id="login_'+jsondata.title+'_'+i+'">'+jsondata.login+'</td>'+
 	 			 			'<td id="skilltitle_'+jsondata.title+'_'+i+'">'+jsondata.title+'</td>'+
 	 			 			'<td id="skilltype_'+jsondata.title+'_'+i+'"><select id="type_'+jsondata.title+'"><option>webchat</option><option selected="selected">event to talk</option></select></td>'+
 	 			 			'<td id="skilllevel_'+jsondata.title+'_'+i+'"><input type="text" id="level_'+jsondata.title+'" value="'+jsondata.skillLevel+'"></td>'+
 	 			 	        '<td id="skillurl_'+jsondata.title+'_'+i+'"><input type="text" id="url_'+jsondata.skillSetId+'"  value="'+url+'"></td>'+
 	 			 	        '<td><input type="button" name="updateSkill" value="Update" class="'+jsondata.title+'_'+i+'" onclick="adminpanel.updateSkillOfAgentNew(this);"></td>'+
 	 			 	        '<td><input type="button" name="deleteSkill" value="Delete" class="'+jsondata.title+'_'+i+'" onclick="adminpanel.deleteSkillOfAgentNew(this);"></td>'+
 	 			 	        '</tr>');
 				}
 	 			
 	 			i++;
 			});
 	 		$("#agent_skillstable").append('<tr style="text-align:centre">'+
 	 				'<td id="login_addN">'+login+'</td>'+
 	 				'<td id="title_addN"><input type="text" id="skill_title"></td>'+
 	 				'<td id="type_addN"><select id=""><option selected="selected">webchat</option><option>event to talk</option></select></td>'+
 	 				'<td id="level_addN"><input type="text" id="skill_level"></td>'+
 	 				'<td id="url_addN"><input type="text" id="skill_typeId"></td>'+
 	 				'<td><input type="button" name="addSkill" value="Add" onclick="adminpanel.validateAgentSkill(this);"></td>'+
 	 				'</tr>');
 		}
 		if(index===2)
 		{	
 		$("#agentName_db1").val(name);
 		}
 		else{
 			$("#agentName_db").val(name);
 		}
		}
 	},
 	altertablerow		:	function(obj)
 	{
 		
 		console.info(obj.id);
 		var objiid = obj.id;
 		
 		
 		
 		result = $('#'+objiid).val();
 		console.info("result:::"+result);
 		
 		if(result == 'Client Id')
 			{
 			console.info("Inside the AccopuntNumber0");
 			$('#acc_skill_set').val('Client Id');
 			$('#acc_skill').val('Client Id');
 			$('#accountnumselect').show();
 			$('#skillsetrow').hide();
 			}
 		else if(result == 'Skill Set')
 			{
 			$('#acc_skill_set').val('Skill Set');
 			$('#acc_skill').val('Skill Set');
 			console.info("Inside the skillset");
 			$('#accountnumselect').hide();
 			$('#skillsetrow').show();
 			}
 	},
 
 	addSkillOfAgentNew : function(data)
 	{
 		console.log("the data here is--->"+data);
 		console.log("the result is--->"+result);
 		
 		if(index===2 && result != "Skill Set")
 		{
 			console.info("inside addSkillof agent new");
 	 		var login 			=		$("#login_addN").html();
 	 		console.log("the value of agent name--->"+login);
 	 		var skilltitle		=		$("#t1currentskilltitle1").val();
 	 		var skilltype		=		$("#t1interactiontype1").val();
 	 		var skilllevel		=		5;
 	 		var skillurl		=		$("#url_addN").children('input').val();
 	 		if(skillurl=="")
 	 			{
 	 			skillurl		=		"";
 	 			}
 	 		else{
 	 		skillurl			=		encodeURIComponent(skillurl);
 	 		}
 	 		adminCommonActions.doAjaxGet( '/alterSkillDataForAgentNEWCMS?lemail='+login+'&stitle='+skilltitle+'&slevel='+skilllevel+'&itype='+skilltype+'&url='+skillurl+'&operation=insert', this.addSkillOfAgentNewResult);
 		}
 		
 		
 		else if(index===2 && result==="Skill Set")
 		{
 			
 		console.info("inside addSkillof agent new else if");
 		
 		console.info($("#agentName").val());
 		console.info($("#skill_title").val());
 		console.info($("#t1interactiontype1").val());
 		console.info($("#skill_level").val());
 		
 		var login 			=		$("#login_addN").html()
 		var skilltitle		=		$("#skill_title").val();
 		var skilltype		=		$("#t1interactiontype1").val();
 		var skilllevel		=		$("#skill_level").val();
 		var skillurl		=		$("#skill_typeId").val();
 		if(skillurl=="")
 			{
 			skillurl		=		"";
 			}
 		else{
 			skillurl			=		encodeURIComponent(skillurl);
 		}
 		adminCommonActions.doAjaxGet( '/alterSkillDataForAgentNEWCMS?lemail='+login+'&stitle='+skilltitle+'&slevel='+skilllevel+'&itype='+skilltype+'&url='+skillurl+'&operation=insert', this.addSkillOfAgentNewResult); 
 		}
 		
 		
 		
 		
 		else if(index===0 || result==="")
 			{
 		
 			var login 			=		$("#login_addN").html()
 	 		var skilltitle		=		$("#skill_title").val();
 			var skilltype		=		$("#t1interactiontype1").val();
 			var skilllevel		=		$("#skill_level").val();
 			var skillurl		=		$("#skill_typeId").val();
 	 		if(skillurl=="")
 	 			{
 	 			skillurl		=		"";
 	 			}
 	 		else{
 	 			skillurl			=		encodeURIComponent(skillurl);
 	 		}
 	 		adminCommonActions.doAjaxGet( '/alterSkillDataForAgentNEWCMS?lemail='+login+'&stitle='+skilltitle+'&slevel='+skilllevel+'&itype='+skilltype+'&url='+skillurl+'&operation=insert', this.addSkillOfAgentNewResult);
 			}
 	},
 	
 	validateAgentSkill : function(data)
 	{
 		if(index===2 && result != "Skill Set")
 		{
 			var skilltitle		=		$("#t1currentskilltitle1").val();
 		}
 		else
 		{
 			var skilltitle		=		$("#skill_title").val();
 		}
 		var res = false;
 		$.each(localvar, function(index, jsondatalocal)
	 			{
					var localvalue	=	jsondatalocal.title;
					if(localvalue == skilltitle)
	 	 	 				{
	 	 	 							res = true;
	 	 	 				}
	 	 	 				else
	 	 	 				{
	 	 	 					console.log("they are different in here");
	 	 	 				}
	 	 	 	});
 		if(res == true)
 			{
 				console.log("this is true");
 				adminCommonActions.showVoiceBox("Data already present,update existing!! .. ",4000);
 				$('#t1currentskilltitle1').val('');
 				$('#skill_title').val('');
 				$("#skill_level").val('');
 				
 			}
 		else
 		{
 				console.log("this is false");
 				adminpanel.addSkillOfAgentNew(res);
 		}
 	},
 	deleteSkillOfAgentNew : function(data)
 	{
 		console.info("inside deleteSkillof agent new");
 		console.info($(data).attr("class"));
 		var id = $(data).attr("class");
 		
 		console.info($("#login_"+id).html());
 		console.info($("#skilltitle_"+id).html());
 		console.info($("#skilltype_"+id).children('select').val());
 		console.info($("#skilllevel_"+id).children('input').val());
 		console.info($("#skillurl_"+id).children('input').val());
 		
 		var login 			=		$("#login_"+id).html();
 		var skilltitle		=		$("#skilltitle_"+id).html();
 		var skilltype		=		$("#skilltype_"+id).children('select').val();
 		var skilllevel		=		$("#skilllevel_"+id).children('input').val();
 		var skillurl		=		$("#skillurl_"+id).children('input').val();
 		skillurl			=		encodeURIComponent(skillurl);
 		
 		adminCommonActions.doAjaxGet( '/alterSkillDataForAgentNEWCMS?lemail='+login+'&stitle='+skilltitle+'&slevel='+skilllevel+'&itype='+skilltype+'&url='+skillurl+'&operation=delete', this.deleteSkillOfAgentNewResult);  
 	},

 	deleteSkillOfAgentNewResult :function(data)
 	{
 		console.info(data);
 		data = jQuery.parseJSON(data);
 		if(data.isContactSkillSetDeleted == true)
 		{
 			adminCommonActions.showVoiceBox("data has been delted .. ",4000);
 			$('#addNewAgent').trigger('click');
 		}
 		else
 		{
 			adminCommonActions.showVoiceBox("failed deletion .. ",4000);
 		}
 	},
 	updateSkillOfAgentNew : function(data)
 	{
 		console.info("inside updateSkillof agent new");
 		console.info($(data).attr("class"));
 		var id = $(data).attr("class");
 		
 		/*console.info($("#login_"+id).html());
 		console.info($("#skilltitle_"+id).html());
 		console.info($("#skilltype_"+id).children('select').val());
 		console.info($("#skilllevel_"+id).children('input').val());
 		console.info($("#skillurl_"+id).children('input').val());
 		*/
 		var login 			=		$("#login_"+id).html();
 		var skilltitle		=		$("#skilltitle_"+id).html();
 		var skilltype		=		$("#skilltype_"+id).children('select').val();
 		var skilllevel		=		$("#skilllevel_"+id).children('input').val();
 		var skillurl		=		$("#skillurl_"+id).children('input').val();
 		skillurl			=		encodeURIComponent(skillurl);
 		
 		adminCommonActions.doAjaxGet( '/alterSkillDataForAgentNEWCMS?lemail='+login+'&stitle='+skilltitle+'&slevel='+skilllevel+'&itype='+skilltype+'&url='+skillurl+'&operation=update', this.updateSkillOfAgentNewResult); 
 	},
 	updateSkillOfAgentNewResult :function(data)
 	{
 		console.info(data);
 		data = jQuery.parseJSON(data);
 		console.log(data.isContactSkillSetUpdated);
 		if(data.isContactSkillSetUpdated == true)
 		{
 			adminCommonActions.showVoiceBox("data has been updated .. ",4000);
 			$('#addNewAgent').trigger('click');
 		}
 		else
 		{
 			adminCommonActions.showVoiceBox("failed updating .. ",4000);
 		}
 	},
 deleteAgentSkills : function(data)
   {
 		  adminpanel.getDetailsFromLogin();
 	  },
 addAgentSkills:function(data)
 	{  
 		  adminpanel.getDetailsFromLogin();
 	},
 addSkillOfAgentNewResult :function(data)
 	{
 		data = jQuery.parseJSON(data);
 		console.info(data);
 		if(data.isContactSkillSetInserted == true)
 		{
 			adminCommonActions.showVoiceBox("data has been inserted .. ",4000);
 			$('#addNewAgent').trigger('click');
 		}
 		else
 		{
 			adminCommonActions.showVoiceBox("failed insertion .. ",4000);
 		}
 	},
checkCurrentSkillModified		:	function()
	  {
 		 console.info("comes here super");
		  console.info($("#t1clientid").val());
		  var clientid		=	$("#t1clientid").val();
		  if(clientid === undefined)
		{
			  adminCommonActions.showVoiceBox("enter some clientId value",4000);
		}
		  else{
		  if(index===2)
			  {
			  $('#bchatwindowdiv').show();
			  console.log("the clientId is--->"+$("#t1clientid1").val());
			  this.getbChatWindow($("#t1clientid1").val());
	 		  adminCommonActions.doAjaxGet( '/checkskillforaccrmodified?clientid='+$("#t1clientid1").val(), this.checkCurrentSkillResultModified);
			  }
		  else{
		  console.info($("#t1routingmode").val());
		  
		  this.getbChatWindow($("#t1clientid").val());
		  adminCommonActions.doAjaxGet( '/checkskillforaccrmodified?clientid='+$("#t1clientid").val(), this.checkCurrentSkillResultModified); 
		  }
		  }
		  },
		  checkCurrentSkillResultModified	:	function(data)
	 	  {
	 		  console.info(data);
	 		  data = jQuery.parseJSON(data);
	 		 dataforskill = data;
//	 		  data=JSON.parse(data);
//	 		  console.info("the parsed data is--->"+data);
	 		  console.info(dataforskill);
	 		  var routtype_live	=	data["147"];
	 		  console.log("thw required data is--->"+routtype_live);
	 		  if(data != "")
	 		  {
	 			 var currentskill	=	data["147"];
	 			  if(index===2){
	 				  
	 			  $("#t1currentskilltitle1").val(currentskill);
	 			  }
	 			  else{
	 	 			  $("#t1currentskilltitle").val(currentskill);
	 			  }
	 			  }
	 		  else
	 		  {
	 			  console.log("in else");
	 			  if(index===2){
	 			  adminCommonActions.showVoiceBox("failed fetching current skill .. ",4000);
	 			  $("#t1currentskilltitle1").val(" ");
	 			  }
	 			  else{
	 				 adminCommonActions.showVoiceBox("failed fetching current skill .. ",4000);
	 	 			  $("#t1currentskilltitle").val(" ");
	 			  }
	 			  }
	 	  },
checkfortheCurrentSkill	:	function()
	 	 {
	$('#bchatwindowdiv').show();
	 		 if(dataforskill != "")
	 		  {
	 			  if(index===2){
	 				  var selectedroutignmode = $("#t1routingmode1").val();
	 				  if(selectedroutignmode==="LIVE")
	 				  {
	 						adminCommonActions.showVoiceBox("fetched current skill .. ",4000);

	 					 console.info("checkfortheCurrentSkill--" + dataforskill);
	 					  	console.log("the selected mode1 is--->"+selectedroutignmode);
	 					  	var currentskill	=	dataforskill["147"];
	 					  	$("#t1currentskilltitle1").val(currentskill);
	 				  }
	 				  else if(selectedroutignmode==="DEV/STAGING")
					  {
	 					  console.log("data coming here-->"+dataforskill);
	 					 console.log("the selected mode2 is--->"+selectedroutignmode);
					  	var currentskill	=	dataforskill["148"];
					  	$("#t1currentskilltitle1").val(currentskill);
					  }
	 				  else if(selectedroutignmode==="OVERFLOW_LIVE")
					  {
	 					 console.log("the selected mode3 is--->"+selectedroutignmode);
					  	var currentskill	=	dataforskill["149"];
					  	$("#t1currentskilltitle1").val(currentskill);
					  }
	 				  else if(selectedroutignmode==="OVERFLOW_DEV/STAGING")
	 				  {
	 					  console.log("the selected mode4 is--->"+selectedroutignmode);
					  	var currentskill	=	dataforskill["150"];
					  	$("#t1currentskilltitle1").val(currentskill);
					  }
	 			  }
	 			  else{
	 				  	$("#t1currentskilltitle").val(currentskill);
	 			  }
	 			  }
	 		  else
	 		  {
	 			  console.log("in else");
	 			  if(index===2){
	 			  adminCommonActions.showVoiceBox("failed fetching current skill .. ",4000);
	 			  $("#t1currentskilltitle1").val(" ");
	 			  }
	 			  else{
	 				 adminCommonActions.showVoiceBox("failed fetching current skill .. ",4000);
	 	 			  $("#t1currentskilltitle").val(" ");
	 			  }
	 			  } 
	 	 },
 	  checkCurrentSkill		:	function()
 	  {
 		
 		  console.info($("#t1clientid").val());
 		  var localval	=	$("#t1clientid").val();
 		 if(localval === undefined || localval	=== null  || localval	=== "")
 		 {
 			adminCommonActions.showVoiceBox("clientId cannot be null!!",4000);
 			 } 		
 		 
 		 else{
 		  if(index===2)
 			  {
 			 console.info($("#t1routingmode1").val());
 			  this.getbChatWindow($("#t1clientid1").val());
 	 		  adminCommonActions.doAjaxGet( '/checkskillforaccr?clientid='+$("#t1clientid1").val()+'&routetype='+$("#t1routingmode1").val(), this.checkCurrentSkillResult);
 			  }
 		  else{
 		  console.info($("#t1routingmode").val());
 		  
 		  this.getbChatWindow($("#t1clientid").val());
 		  adminCommonActions.doAjaxGet( '/checkskillforaccr?clientid='+$("#t1clientid").val()+'&routetype='+$("#t1routingmode").val(), this.checkCurrentSkillResult); 
 		  }
 		 }
 		  },
 	 checkCurrentSkillResult	:	function(data)
 	  {
 		
 		  console.info(data);
 		  data = jQuery.parseJSON(data);
 		  if(data != "")
 		  {
 			  if(index===2){
 			  $("#t1currentskilltitle1").val(data.value);
 			 $('#bchatwindowdiv').show();
 			  }
 			  else{
 	 			  $("#t1currentskilltitle").val(data.value);
 	 			 $('#bchatwindowdiv').show();
 			  }
 			  }
 		  else
 		  {
 			  if(index===2){
 			  adminCommonActions.showVoiceBox("failed fetching current skill .. ",4000);
 			  $("#t1currentskilltitle1").val(" ");
 			  }
 			  else{
 				 adminCommonActions.showVoiceBox("failed fetching current skill .. ",4000);
 	 			  $("#t1currentskilltitle").val(" ");
 			  }
 			  }
 	  },
 	  createNewSkillforAccResult	:	function(data)
 	  {
 		  	if (data =="true")
 		  	{
 				adminCommonActions.showVoiceBox("data has been Updated .. ",4000);
 			}
 			else
 			{
 				adminCommonActions.showVoiceBox("failed Updating Data .. ",4000);
 			}
 	  },
 	  
 	 createNewSkill : function()
 	  {
 		  var skilldesc 	= 	$("#t2skilldescription").val();
 		  var v2skillid		=	$("#t2v2skillid").val();
 		  var skillTitle	=	$("#t2skilltitle").val();
 		  var itype			=	$("#t2interactiontype").val();
 		  
 		  console.info("inside create new skill");
 		  
 		  if((skilldesc != null && skilldesc !="" && typeof skilldesc != 'undefined') && 
 				  (v2skillid != null && v2skillid !="" && typeof v2skillid != 'undefined') &&
 				  (skillTitle != null && skillTitle !="" && typeof skillTitle != 'undefined') &&
 				  (itype != null && itype !="" && typeof itype != 'undefined'))
 		  {
 			  console.info("inside if loop of create new skill");
 			  adminCommonActions.doAjaxGet( '/createNewskillset?itype='+itype+'&stitle='+skillTitle+'&sdescription='+skilldesc+'&v2id='+v2skillid, this.createNewSkillResult); 
 		  }
 		  else{
 			 adminCommonActions.showVoiceBox("Fields cannnot be null",4000);
 		  }
 	  },
 	  
 	  createNewSkillResult : function(data)
 	  {
 		  console.info(data);
 		  data = jQuery.parseJSON(data);
 		  if(data.isSkillSetCreated == true)
 		  {
 			  adminCommonActions.showVoiceBox("skill has been Created .. ",4000);
 		  }
 		  else
 		  {
 			  adminCommonActions.showVoiceBox("skill creation failed .. ",4000);
 		  }
 	  },
 	  
 	  createSkillforAcc		:	function()
 	  {
 		  console.info($("#t1interactiontype").val());		var inttype			=	$("#t1interactiontype").val();
 		  console.info($("#t1clientid").val());				var clntid			=	$("#t1clientid").val();
 		  console.info($('[name=stype]').val()); 			var stype			=	$('[name=stype]').val();
 		  console.info($("#t1routingmode").val());			var routmode		=	$("#t1routingmode").val();
 		  console.info($("#t1skilltitle").val());			var skiltitl		=	$("#t1skilltitle").val();
 		  if(inttype===""||clntid===""||stype===""||routmode===""||skiltitl==="")
 			  {
 			  	adminCommonActions.showVoiceBox("Fields cannot be null",4000);
 			  }
 		  else{
 		  if(index===2)
 			  {
 		  adminCommonActions.doAjaxGet( '/createskillforacc?itype='+$("#t1interactiontype1").val()+'&skilltitle='+$("#t1skilltitle").val()+'&clientid='+$("#t1clientid1").val()+'&routetype='+$("#t1routingmode1").val()+'&newtitle='+$('[name=stype]').val(), this.createNewSkillforAccResult); 
 			  }
 		  else{
 			 adminCommonActions.doAjaxGet( '/createskillforacc?itype='+$("#t1interactiontype").val()+'&skilltitle='+$("#t1skilltitle").val()+'&clientid='+$("#t1clientid").val()+'&routetype='+$("#t1routingmode").val()+'&newtitle='+$('[name=stype]').val(), this.createNewSkillforAccResult);
 		  }
 		  }
 			  },
 	 getbChatWindow	: function(subAcctNo)
 	 {
 		  var src = "http://webchat.conversionsupport.com/pages/BrandedChatWindow-exp.html?"+new Date().getTime()+"#"+subAcctNo;
 		  $("#bchatwindow").attr("src",src);
 	 },
  	
 	 // show account active or not
 	 	getSubAccountNumberStatusCms : function()
 	 	{
 	 		adminCommonActions.showLoading();
 	 		var subaccountnumber=$('#subaccnum').val();
 	 		if(subaccountnumber === "")
 	 			{
 	 				adminCommonActions.showVoiceBox("Fields cannot be null",4000);
 	 			}
 	 		else{
 	 		if(adminCommonActions.isNumeric(subaccountnumber))
 	 			{
 	 			adminCommonActions.doAjaxPost( "/getaccountstatus?" , 'subaccountnumber='+subaccountnumber, this.showAccountStatusMessage);
 	 			}
 	 		else
 	 		{
 	 			$('#accactivatesubaccountnumber').focus();
 	 			adminCommonActions.showVoiceBox("Please enter the  subAccountNumber ",4000);
 	 		}
 	 		}
 	 	},
 	 	showAccountStatusMessage : function(data)
 	 	{
 	 		console.log("data is coming as--->"+data);
 	 		adminCommonActions.hideLoading();
 	 		if(String(data).match("This Account is Active"))
 	 			{
 	 				$('#curr_status_en').show();
 	 				$('#curr_status_dis').hide();
 	 				$('#disabled').hide();
 	 				$('#enabled').hide();
 	 			}
 	 		else if(String(data).match("This Account is InActive"))
 	 			{
 	 				$('#curr_status_en').hide();
	 				$('#curr_status_dis').show();
	 				$('#disabled').hide();
 	 				$('#enabled').hide();
 	 			}
// 	 		$('#acc_status_res').remove();
// 	 		$('#getCurrentStatus').after('<label id="acc_status_res">'+data+'</label>');
 	 		adminCommonActions.showVoiceBox(data,4000);
 	 	},
 		getSubAccountNumberStatus : function(value)
 	 	{
 	 		adminCommonActions.showLoading();
 	 		var subaccountnumber=$('#subaccnum').val();
 	 		if(adminCommonActions.isNumeric(subaccountnumber))
 	 		{
 	 	        adminCommonActions.doAjaxPost( "/updateactivestatus?" , 'subaccountnumber='+subaccountnumber+'&status='+value ,this.showActivateAccountMessage);
 	 		}
 	 		else
 	 		{
 	 			$('#accactivatesubaccountnumber').focus();
 	 			adminCommonActions.showVoiceBox("Please enter the  subAccountNumber ",4000);
 	 		}
 	 	},
 	 	
 	 	// show the message getting from the server side
 	 	showActivateAccountMessage : function(data)
 	 	{
 	 		console.log("dats is-->"+data);
 	 		if(String(data).match("Your Account has been Activated"))
 	 			{
 	 				$('#enabled').show();
 	 				$('#disabled').hide();
 	 				$('#curr_status_en').hide();
 	 				$('#curr_status_dis').hide();
 	 			}
 	 		else if(String(data).match("Your Account has been Deactivated"))
 	 			{
 	 				$('#disabled').show();
 	 				$('#enabled').hide();
 	 				$('#curr_status_en').hide();
 	 				$('#curr_status_dis').hide();
 	 			}
 	 		adminCommonActions.hideLoading();
 	 		adminCommonActions.showVoiceBox(data,4000);
 	 		
 	 	},	  
 			  
 	clearlabel	:	function()
 	{
 		var accnum	=	$('#subaccnum').val();
 		console.log("the value on blur is--->"+accnum);
 		if(String(accnum).match("SubAccountNumber"))
 			{
 				$('#disabled').hide();
				$('#enabled').hide();
				$('#curr_status_en').hide();
				$('#curr_status_dis').hide();
 			}
	 	},
 	 	getFromDateFormatted	:	function()
 	 	{
 	 		var fDate	= $("#download_from_date").val();
 	 		console.info(fDate);
 	 		var fDateArray	=	fDate.split("/");
 	 		if(fDateArray.length == 3)
 	 		{
 	 			if(fDateArray[0]<10 && fDateArray[0].lenght<2){fDateArray[0]='0'+fDateArray[0];} if(fDateArray[1]<10 && fDateArray[1].lenght<2){fDateArray[1]='0'+fDateArray[1];}
 	 			fDate			=	fDateArray[0]+"-"+fDateArray[1]+"-"+fDateArray[2];
 	 		}
 	 		else
 	 		{
 	 			fDate			=	getFormattedTodayDate();
 	 		}
 	 		console.info(fDate);
 	 		return fDate;
 	 	},
	 	getToDateFormatted	:	function()
	 	{
	 		var tDate	= $("#download_to_date").val();
	 		console.info(tDate);
	 		var tDateArray	=	tDate.split("/");
	 		if(tDateArray.length == 3)
	 		{
	 			if(tDateArray[0]<10 && tDateArray[0].lenght<2){tDateArray[0]='0'+tDateArray[0];} if(tDateArray[1]<10 && tDateArray[1].lenght<2){tDateArray[1]='0'+tDateArray[1];}
	 			tDate			=	tDateArray[0]+"-"+tDateArray[1]+"-"+tDateArray[2];
	 		}
	 		else
	 		{
	 			tDate			=	getFormattedTodayDate();
	 		}
	 		console.info(tDate);
	 		return tDate;
	 	},
	 	ValidateDates	:	function(fromDate,toDate)
	 	{
	 		var currentDate	= new Date();
	 		if(fromDate <= currentDate || toDate <= currentDate)
	 		{	
	 		if(toDate >= fromDate)
	 			return true ;
	 		else 
	 		{
	 			alertBox.show('Alert!',"Oops. Date Range is not valid. Please check.");
	 			return false ;
	 		}
 	}
	 		else
	 			{
	 			alertBox.show('Alert!',"Oops. Date Range is not valid. Please check.");
	 				return false ;
	 			}

	 	},
 	 	downloadInteractionsCsv		:	function()
 	 	{
 	 		
 	 		var senderEmailAddress	= $("#sender_email").val();
 	 		if( senderEmailAddress == "Email Address" || senderEmailAddress == "" || !adminpanel.isValidEmailAddress(senderEmailAddress) )	
 			{
				$('#voice-box').css("display","block");
		        $('#voice-box span').html("Please enter the valid email address");
		        $('#voice-box').fadeOut(3000);
				$('#sender_email').focus();
				return false ;
 			}
 	 		if( $("#download_from_date").val() === "")
 	 		{
 	 			$('#voice-box').css("display","block");
		        $('#voice-box span').html("Please enter the valid from date");
		        $('#voice-box').fadeOut(3000);
				$('#download_from_date').focus();
				return false;
 	 		}
 	 		if( $("#download_to_date").val() === "")
 	 		{
 	 			$('#voice-box').css("display","block");
		        $('#voice-box span').html("Please enter the valid from date");
		        $('#voice-box').fadeOut(3000);
				$('#download_to_date').focus();
				return false;
 	 		}
 	 		checkFromDate			= new Date($("#download_from_date").val());
 	 		checkToDate				= new Date($("#download_to_date").val());
 	 		downloadFromDate		= adminpanel.getFromDateFormatted();
 	 		downloadToDate			= adminpanel.getToDateFormatted();
 	 		$('#voice-box').css("display","block");
	        $('#voice-box span').html("Sending Email...")
 	 		var validatedateresult	=	adminpanel.ValidateDates(checkFromDate,checkToDate);
 	 		
 	 		$.ajax({
 	 			type 	: "POST",
 	 			url 	: "/postArInteractionsCsvToMail/"+downloadFromDate+"/"+downloadToDate,
 	 			data	: {"senderEmail": senderEmailAddress },
 	 			success : function(data) 
 	 			{
 	 				try
 	 				{
 	 						$('#voice-box span').html("Email Sent to "+senderEmailAddress);
 	 	 					$('#voice-box').fadeOut(5000);
 	 	 					$("#download_from_date").val("");
 	 	 					$("#download_to_date").val("");
 	 				}
 	 				catch(e)
 	 				{
 	 					console.log("exception has ocured try later!!");
 	 				}
 	 			}
 	 		});
 	 		
 	 	},
	 	isValidEmailAddress			:	function(emailAddress)
	 	{
	 		var reg_forcheckingmailid = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	        console.info("inside the check email function ::");
	 	  
	  
	       var email = emailAddress.split(',');
	 	   for (var i = 0; i < email.length; i++) 
	 	   {
	 		   if(email[i] =='' || reg_forcheckingmailid.test(email[i]) == false) 
	   	   {	     
	 	      	//$('#check_emailid').html('Invalid Email Id');
	 			console.info("InValid EmailId");
	 	  	    return false;
	   	   }
	 	   }
	 	   return true;

	 	},
 	 	validateSubaccount			:	function()
 	 	{
 	 		adminpanel.displayErrorMessage("Loading..","blue");
 	 		var subAcc			=	"";
 	 		subAcc				=	$('#csv_subaccnum').val();
 	 		if( subAcc != "")
 	 			{
 	 				$.ajax({
	 	 	 			type 	: "POST",
	 	 	 			url 	: "/validatesubaccount?subacc="+subAcc,
	 	 	 			success : function(data) 
	 	 	 			{
	 	 	 				console.log("the data obtine diusajnal;fip'dsaj;k",data);
	 	 	 				if(data == "84d52042-cc6d-4df8-acf4-1ecc278f790e" || data =="8333d8c0-e22a-4e32-9bf5-0f578461823e" ||data == "b3485731-3c4e-4eeb-a15e-c5bc41286205" ||data == "a7359531-3e43-4da1-be98-5a1392638e42") 
	 	 	 					{
	 	 	 						adminpanel.displayErrorMessage("Valid Account!!","green");
	 	 	 						$('#validator').hide();
	 	 	 						$('#myform').show();
	 	 	 						document.getElementById('csvsubaccnum').value	=	subAcc;
	 	 	 						$('#csvsubaccnum').val(subAcc);
	 	 	 					}
	 	 	 				else
	 	 	 					{
	 	 	 						$('#myform').hide();
	 	 	 						adminpanel.displayErrorMessage("Oops!!Please make sure the sub account is of call list outbound type","red")
	 	 	 					}
	 	 	 			}
	 	 	 		});
 	 			}
 	 		else
 	 			{
 	 				adminpanel.displayErrorMessage("Please check the fields!","red")
 	 				return false;
 	 			}
 	 	},
	 	displayErrorMessage			:		function(message,color)
	 	{
	 			$('#csverror').html('');
				document.getElementById('csverror').style.display	=	"block";
				$('#csverror').css("color",color);
				$('#csverror').css('text-align','center');
				$('#csverror').html(message);
				setTimeout(function(){document.getElementById('csverror').style.display	=	"none";},2000);
	 	}
};



//# ADMIN Skill Manipulations

adminpanel.mainskillList = [];

function getSkillListFromLogin()
{
	loginName = $.trim($('#agentLogin').val());
	if(!!!loginName)
	{
		loginName =adminpanel.agentLogin;
		$('.btn-success').blur();
		messageWindow.popUpMessage( "Agent Login is Empty", 2000 );
		return;
	}
	messageWindow.showMessage("Fetching Skills...");
	fetchAndDisplaySkillSet(loginName);
	if(!!!adminpanel.mainskillList.length)
	{
		messageWindow.popUpMessage( "No Skills", 2000 );
	}
	else
		messageWindow.popUpMessage( "Skills Fetched !!", 2000 );
	
	$('.user-mgment').css('max-height',$(window).height()-200);
}

$("#agentLogin").keyup(function(e){
	if(e.keyCode == 13)
		getSkillListFromLogin();
});


$('#add-skillToAgentLogin').click(function()
	{
		$('#add-skillName').val('');
		$('#add-AgentLogin').val('');
		$('#add-AgentskillLevel').val('3');
		$('#add-Agenturl').val('');
		
		$('#add-skillName').prop("disabled",false);
		$('#add-AgentLogin').prop("disabled",true);
		
		if(!!adminpanel.agentLogin)
			$('#add-AgentLogin').val(adminpanel.agentLogin);
	});

$('#save-SkillToAgent').click(function()
{
	$('#save-SkillToAgent').attr('disabled','true');
	var login		= adminpanel.agentLogin;
	var skilltitle	= $.trim($('#add-skillName').val());
	var skilllevel	= $('#add-AgentskillLevel').val();
	var skilltype	= null;
	var skillurl	= $('#add-Agenturl').val();
	var skillList   = adminpanel.mainskillList;
	
	try
	{
		if(!!!skilltitle || (!!skilltitle && skilltitle.indexOf(" ") != -1))
		{
			messageWindow.popUpMessage( "Enter the valid Skill", 2000 );
			$('#save-SkillToAgent').removeAttr('disabled');
			return true;
		}
		if(!!!login || !!!skilltitle || !!!skilllevel || isNaN(skilllevel) || skilllevel > 9 || skilllevel < 1)
		{
			messageWindow.popUpMessage( "Fill Required Fields Correctly", 2000 );
			$('#save-SkillToAgent').removeAttr('disabled');
			return true;
		}
		for(i = 0 ; i<skillList.length ; i++ )
		{
			if(skillList[i].title == skilltitle )
			{
				messageWindow.popUpMessage( "Already Skilled", 2000 );
				$('#save-SkillToAgent').removeAttr('disabled');
				return true;
			}
		}
		messageWindow.showMessage("Saving Skill...");
		$('#close-modelAddskill').click();
		checkAndCreateSkill(skilltitle);
		checkAndProcessSkillSet(login, skilltitle, skilllevel, skilltype, skillurl, 'insert');
		$('#save-SkillToAgent').removeAttr('disabled');
	
	}
	catch(exception)
	{
		console.log("Error Occured while Saving"+ exception);
	}
});

function checkAndCreateSkill(skillTitle)
{
	 var url 	=	"/getAgentsListBySkill?agentskill="+skillTitle+"&cursor=";
	   
		console.log(url);
		$.ajax
		({
			type : "GET",
			url : url,
			async: false,
			success : function(data)
			{
				if(data != "failure")
				{
					var responseJson	=	JSON.parse(data);
					if(responseJson.hasOwnProperty('error') && responseJson.error == "skillSet not found")
						createInvalidSkillSet([skillTitle]);
				}
			},
			error: function(e){
				  console.log("Error Occured in checkAndCreateSkill");
			}
		    
		});		
}


function checkAndProcessSkillSet(login, skilltitle, skilllevel, skilltype, skillurl, operation, queryString)
{
	if(!!!queryString)
	     queryString = "";
	url	=	'/alterSkillDataForAgentNEWCMS?lemail='+login+'&stitle='+skilltitle+'&slevel='+skilllevel+'&itype='+skilltype+'&url='+skillurl+'&operation='+operation+queryString;
											      			
	console.log(url);
	$.ajax
	({
		type 	: "GET",
		url 	: url,
	}).done(function(data)
			{
				var response = JSON.parse(data);
				fetchAndDisplaySkillSet(adminpanel.agentLogin);
				if(!!!response.isContactExist)
				{
					messageWindow.popUpMessage( "Login not Exist", 2000); 
				}
			}
	).fail(function(){
		console.log("Error while processing the skillSet")
	});
}


function fetchAndDisplaySkillSet(loginName)
{
	var url = '/getDataToDisplayInTableFromNEWCMS?login='+loginName
	$.ajax({
		type	: "Get",
		url 	: url,
		async	: false,
		success : function(data)
		{
			if(!!data)
			{
				adminpanel.agentLogin = loginName;
				$('#add-skillToAgentLogin').css("display","inline");
				adminpanel.mainskillList = JSON.parse(data);
				fillAgentSkillListToTools(adminpanel.mainskillList, adminpanel.mainskillList.length);
				$('.btn-success').blur();
				messageWindow.hideMessage();
			}
		},
		error	: function(e)
		{
			console.log("Error occoured while fetching skills by login");
		}
	});
}

function fillAgentSkillListToTools(AgentList,count)
{
	try
	{
		$('.skillcount').html('<i class="fa fa-trash-o"></i>'+count);
		$("#SkillTable").html('');
		$.each(AgentList,function(index,agentData)
		{
		  var url			=	agentData.url;
		  var tableBuilder	= '<tr><td id="trashSkill_'+index+'" onclick="deleteAgentSkill(this)"><b><i class="fa fa-user"></i></b><span><i class="fa fa-trash-o"></i></span></td>'+
		  					  '<td id="agentSkillTitle_'+index+'">'+agentData.title+'</td>'+
		    				  '<td id="agentLogin_'+index+'">'+agentData.login+'</td>'+
		    				  '<td><div class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" id="skillurl_'+index+'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><span class="caret"></span></button><input style="display:none" id="urlValue_'+index+'" onblur="updateSkillSet(this)" class="form-control" placeholder="Paste URL"></input>'+
		    				  '<ul class="dropdown-menu" aria-labelledby="skillurl_'+index+'">'+getDefaultSkillUrl(index)+'</ul></div></td>'+
		    				  '<td id="skillLevel_'+index+'" style="display:none">'+agentData.skillLevel+'</td>'+
		    				  '<td>'+
		    				  '<ul class="color-icons" style = "cursor: pointer" >'+
		    				  '<li onclick="updateSkillSet(this)" id="lowlevel_'+index+'"><i class="fa fa-square" style="margin-right: 5px;'+(parseInt(agentData.skillLevel)>=1&&parseInt(agentData.skillLevel)<=3? "color:#ff6633; background:#ff6633; border:1px solid;border-radius: 3px; margin-top: -1px;" : "color:#F1AA93;")+'"></i></li>'+
		    				  '<li onclick="updateSkillSet(this)" id="midlevel_'+index+'"><i class="fa fa-square"style="margin-right: 5px; '+(parseInt(agentData.skillLevel)>=4&&parseInt(agentData.skillLevel)<=6? "color:#ff9933; background:#ff9933; border:1px solid;border-radius: 3px; margin-top: -1px;" : "color:#F5C696;")+'"></i></li>'+
		    				  '<li onclick="updateSkillSet(this)" id="higlevel_'+index+'"><i class="fa fa-square"style="margin-right: 5px;'+(parseInt(agentData.skillLevel)>=7&&parseInt(agentData.skillLevel)<=9? "color:#99ccff; background:#99ccff; border:1px solid;border-radius: 3px; margin-top: -1px;" : "color:#C6DDF3;")+'"></i></li>'+
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
			  $('#removeURL_'+index).attr("onclick","updateSkillSet(this)");
		  }
		  else
		  {
			  $('#skillurl_'+index).html("Select Application URL<span class='caret'></span>");
			  $('#urlValue_'+index).val("");
			  $('#removeURL_'+index).addClass('disabled');
			  $('#removeURL_'+index).removeAttr("onclick");
		  }
		});
		$('.checkbox').removeClass('active-check');
		$('#deleteAll').css('display','none');
	}
	catch(exception)
	{
		console.log("Error Occured in fillAgentSkillListToTools"+ exception);
	}
}


function updateSkillSet(trObj)
{
	var operation	  =	"delete";
	var id			  = trObj.id;
	var isURLChanged  = true;
	var queryString   = "";

	try
	{
		if(id == "deleteAllSkills")
		{
			deleteAllAgentSkills();
			return;
		}
		if(id.split("_")[0]	!= "trashSkill")
		{
			operation	=	"update";
			$('.checkbox').removeClass('active-check');
			$('#deleteAll').css('display','none');
		}
		var index		= 	id.split("_")[1]
		var login		= 	$('#agentLogin_'+index).html();
		var skillurl	=   $('#urlValue_'+index).val();
		var skilllevel	=	$('#skillLevel_'+index).html();
		var skilltitle	=	$('#agentSkillTitle_'+index).html();
		var skilltype	= 	null;
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
		
		var oldSkillLevel			=	"";
		var oldURL					=	"";
		var type					=	"";
		
		$.each(adminpanel.mainskillList,function(index,skillList)
		{
			if(skillList.title == skilltitle)
			{
				if(skillList.skillLevel != skilllevel)
				{
					oldSkillLevel	=	skillList.skillLevel;
					console.log("oldSkillLevel = "+oldSkillLevel);
					type			=	"skilllevel";
					console.log(type);
				}
				if(skillList.url != $.trim(skillurl))
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
		if(operation == 'delete')
			messageWindow.showMessage("Deleting Skill...");
		else
			messageWindow.showMessage("Updating Skill...");
			
	   queryString  =	'&oldskilllevel='+oldSkillLevel+'&oldurl='+encodeURIComponent(oldURL)+'&type='+type;
	   checkAndProcessSkillSet(login, skilltitle, skilllevel, skilltype, encodeURIComponent(skillurl), operation, queryString);
	}
	catch(exception)
	{
		console.log("Error Occured in updateSkillSet"+ exception);
	}
}

function getDefaultSkillUrl(AgentIndex)
{
	var optionElements = "";
	var optionURL	   = "";
	try
	{
		var urlTypes 	   = ["Lead","Task","Deal","Account"];
		var dsURL 		   = "";
		
		if(mode == "LIVE")
			dsURL = "https://my.distributedsource.com/crm#";
		else
		    dsURL = "https://dist-sourcetest.appspot.com/crm#";
		
		for(var index in urlTypes)
		{
			optionURL      = dsURL+urlTypes[index].toLowerCase()+'/?%3Fconnid=?&userpin=?';
			optionElements = optionElements + '<li onclick="updateSkillSet(this)" id="skill'+urlTypes[index]+'url_'+AgentIndex+'_'+optionURL+'"><a href="#">DS '+urlTypes[index]+' URL</a></li>';
		}
		optionElements = optionElements +  '<li role="separator" class="divider"></li><li id="addAppURL_'+AgentIndex+'" onclick="accountManager.addAppURL(this)"><a href="#">Paste URL</a></li>' + '<li id="removeURL_'+AgentIndex+'" onclick="updateSkillSet(this)"><a href="#">Remove URL</a></li>';
	}
	catch(exception)
	{
		console.log("Error Occured in getDefaultSkillUrl"+ exception);
	}
	return optionElements;
}

function deleteAgentSkill(trObj)
{
	var idName = trObj.id;
	$('#modal_comform_message').html( 'Are you sure you want to delete '+ $('#agentSkillTitle_'+ idName.substring(idName.length-1)).html() +'?');
	$('#modal-confirm-deletion').trigger('click');
	$('.model-confirm_delete').attr("id",idName);
}

$('#deleteAll').on('click',function(){
	$('#modal_comform_message').html( 'Are you sure you want to delete all Skills?');
	$('#modal-confirm-deletion').trigger('click');
	$('.model-confirm_delete').attr("id","deleteAllSkills");
});

function deleteAllAgentSkills()
{
	try
	{
		var index;
		var encodedUrl= "";
		for(index= 0; index < adminpanel.mainskillList.length; index++)
		{
			updateSkillSet($("#trashSkill_"+index)[0]);
		}
	}
	catch(exception)
	{
		console.log("Error Occured While Deleteing all Skills"+ exception);
	}
}
