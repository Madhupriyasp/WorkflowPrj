var timezone   =	'<c:out value="${Timezone}"/>';

$().ready(function() {
	
	var optsrouting = {
			  lines: 13, // The number of lines to draw
			  length: 15, // The length of each line
			  width: 15, // The line thickness
			  radius: 36, // The radius of the inner circle
			  corners: 1.0, // Corner roundness (0..1)
			  rotate: 71, // The rotation offset
			  direction: 1, // 1: clockwise, -1: counterclockwise
			  color: '#000', // #rgb or #rrggbb or array of colors
			  speed: 1, // Rounds per second
			  trail: 64, // Afterglow percentage
			  shadow: false, // Whether to render a shadow
			  hwaccel: false, // Whether to use hardware acceleration
			  className: 'spinner', // The CSS class to assign to the spinner
			  zIndex: 200, // The z-index (defaults to 200)
			  top: '350px', // Top position relative to parent in px
			  left: 'auto' // Left position relative to parent in px
			};
			target2 = document.getElementById('foo');
			spinner2 = new Spinner(optsrouting);
			$('body').append('<div class="modal-backdrop fade in"></div>');
			callmetable();
			
			$('#tab1').bind('click', function (e) {
				callmetable();
				activeTab 	=	e.target;
				console.log(activeTab)
		    });
			
			$('#tab2').bind('click', function (e) {
				getAdminTable();
				activeTab	=	e.target;
				console.log(activeTab)
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



function callmetable(){
	
	spinner2.spin(target2)
	$('#sampleTable').html('');
	 datamap = new Object();
	 $.ajax({
			type : "POST",
			url  : "/getRoutingTableData",
			success : function(data)
			{
				if(data != null)
				{
					updateRoutingTable(data);
				}
			}
		 });
		setTimeout(function(){stopspinner()},1000);
}
function search_filter(phrase, _id){
//	console.log("phrase :: "+phrase);
	var words = phrase.value.toLowerCase().split(' ').join('');
	var matchedArray = [];
	words = words.split(",");
		var table = document.getElementById(_id);
//	console.log(words);
		var ele;
		for (var r = 0; r < table.rows.length; r++){
			ele = table.rows[r].innerHTML.replace(/<[^>]+>/g,"");
		        var displayStyle = 'none';
		        for (var i = 0; i < words.length; i++) {
				    if (ele.toLowerCase().indexOf(words[i]) >= 0){
				    	//console.log("matched");
				    	displayStyle = '';
						break;
				    }
				    else {
						displayStyle = 'none';
				    }
		        }
			table.rows[r].style.display = displayStyle;
		}
}
function stopspinner(){
	
	$( ".modal-backdrop.fade.in" ).remove();
	spinner2.stop();
}

function getAdminTable(){
		spinner2.spin(target2);
		datamap = new Object();
		$('#adminTablebody').html('');
		$.ajax({
			type : "POST",
			url  : "/getAdminMapTable",
			success : function(data)
			{
				if(data != null)
				{
					updateAdminTable(data)
				}
			}
		
		});
		setTimeout(function(){stopspinner()},1000);
}


function updateRoutingTable(data)
{
	if(data != null)
	{
		$('#sampleTable').html('');
//		//data='[{"cht1002205390":[{"activeResponseRequestAnswered":"","activeResponseRequestAvailable":false,"activeResponseRequestRecieved":false,"activeResponseSessionBean":null,"agentActiveRespStatus":"","agentChatStatus":"READY_FOR_SBChat","agentLogin":"DIS@A-CTI.COM","agentLoginStatus":"true","agentSkillLevel":"6","agentSkillSet":"cht1002205390","agentStausAliveTime":0,"agentUniquePin":"7MPAS","aliasName":"Angela%20A","chatSessionBean":null,"chatWaiter":null,"cometSecretKey":"","interactionType":"SBChat","isChatAvailable":false,"isChatReceivedFlag":false,"loggedInFrom":"oc","status":"Ready","userFullName":"sdfsdsf%20Pavan"},{"activeResponseRequestAnswered":"","activeResponseRequestAvailable":false,"activeResponseRequestRecieved":false,"activeResponseSessionBean":null,"agentActiveRespStatus":"","agentChatStatus":"READY_FOR_SBChat","agentLogin":"PAVANKUMAR.VENGAL@CONVERSIONSUPPORT.COM","agentLoginStatus":"true","agentSkillLevel":"6","agentSkillSet":"cht1002205390","agentStausAliveTime":0,"agentUniquePin":"7MPAS","aliasName":"Sdfsdsf P.","chatSessionBean":null,"chatWaiter":null,"cometSecretKey":"","interactionType":"SBChat","isChatAvailable":false,"isChatReceivedFlag":false,"loggedInFrom":"oc","status":"Ready","userFullName":"sdfsdsf%20Pavan"},{"activeResponseRequestAnswered":"","activeResponseRequestAvailable":false,"activeResponseRequestRecieved":false,"activeResponseSessionBean":null,"agentActiveRespStatus":"","agentChatStatus":"READY_FOR_SBChat","agentLogin":"pavankumar.vengal@conversionsupport.com","agentLoginStatus":"true","agentSkillLevel":"6","agentSkillSet":"cht1002205390","agentStausAliveTime":0,"agentUniquePin":"7MPAS","aliasName":"Sdfsdsf P.","chatSessionBean":null,"chatWaiter":null,"cometSecretKey":"","interactionType":"SBChat","isChatAvailable":false,"isChatReceivedFlag":false,"loggedInFrom":"oc","status":"Ready","userFullName":"Pavan"}]},{"ett8002205390":[{"activeResponseRequestAnswered":"","activeResponseRequestAvailable":false,"activeResponseRequestRecieved":false,"activeResponseSessionBean":null,"agentActiveRespStatus":"","agentChatStatus":"READY_FOR_SBChat","agentLogin":"pavankumar.vengal@conversionsupport.com","agentLoginStatus":"true","agentSkillLevel":"9","agentSkillSet":"ett8002205390","agentStausAliveTime":0,"agentUniquePin":"7MPAS","aliasName":"Sdfsdsf P.","chatSessionBean":null,"chatWaiter":null,"cometSecretKey":"","interactionType":"SBChat","isChatAvailable":false,"isChatReceivedFlag":false,"loggedInFrom":"oc","status":"Ready","userFullName":"sdfsdsf%20Pavan"}]},{"cht1930000103":[{"activeResponseRequestAnswered":"","activeResponseRequestAvailable":false,"activeResponseRequestRecieved":false,"activeResponseSessionBean":null,"agentActiveRespStatus":"","agentChatStatus":"READY_FOR_SBChat","agentLogin":"pavankumar.vengal@conversionsupport.com","agentLoginStatus":"true","agentSkillLevel":"6","agentSkillSet":"cht1930000103","agentStausAliveTime":0,"agentUniquePin":"7MPAS","aliasName":"Sdfsdsf P.","chatSessionBean":null,"chatWaiter":null,"cometSecretKey":"","interactionType":"SBChat","isChatAvailable":false,"isChatReceivedFlag":false,"loggedInFrom":"oc","status":"Ready","userFullName":"sdfsdsf%20Pavan"}]},{"chtAdmin":[{"activeResponseRequestAnswered":"","activeResponseRequestAvailable":false,"activeResponseRequestRecieved":false,"activeResponseSessionBean":null,"agentActiveRespStatus":"","agentChatStatus":"READY_FOR_SBChat","agentLogin":"pavankumar.vengal@conversionsupport.com","agentLoginStatus":"true","agentSkillLevel":"9","agentSkillSet":"chtAdmin","agentStausAliveTime":0,"agentUniquePin":"7MPAS","aliasName":"Sdfsdsf P.","chatSessionBean":null,"chatWaiter":null,"cometSecretKey":"88xac6shyijlm1rxpr5o6duylo","interactionType":"SBChat","isChatAvailable":false,"isChatReceivedFlag":false,"loggedInFrom":"oc","status":"Ready","userFullName":"sdfsdsf%20Pavan"}]},{"cht1005956534":[{"activeResponseRequestAnswered":"","activeResponseRequestAvailable":false,"activeResponseRequestRecieved":false,"activeResponseSessionBean":null,"agentActiveRespStatus":"","agentChatStatus":"READY_FOR_SBChat","agentLogin":"pavankumar.vengal@conversionsupport.com","agentLoginStatus":"true","agentSkillLevel":"7","agentSkillSet":"cht1005956534","agentStausAliveTime":0,"agentUniquePin":"7MPAS","aliasName":"Sdfsdsf P.","chatSessionBean":null,"chatWaiter":null,"cometSecretKey":"","interactionType":"SBChat","isChatAvailable":false,"isChatReceivedFlag":false,"loggedInFrom":"oc","status":"Ready","userFullName":"sdfsdsf%20Pavan"}]}]';

		console.log("this is the data we got for agent logins :: "+data);
		var displayinteraction ='';
		var sub = '';
		tablecontent='';
		var	res=jQuery.parseJSON(data);
		if(res=='')
		{
			console.log("no data");
		}
		
		$.each(res,function(key,value)
		{
			$.each(value,function(key2,value2)
			{
			 console.log("this is the value :: "+key2); 
			 tablecontent = tablecontent+'<tr id="'+key2+'">';

			if(value2!='')
			{
				tablecontent+='<td style="width : 15%;"><strong>'+key2+'</strong></td>';
				sub='<table style="border-collapse: initial; min-width:100%;"><thead><th width="42%"></th><th width="18%"></th><th width="20%"></th><th width="23.5%"></th><!--<th width="150px">User Full Name</th>--></thead><tbody><tr>'; 
					
				$.each(value2,function(key3,value3)
				{
					try
					{
						$.each(value3,function(key4,value4)
						{
						if(key4=='aliasName')
							sub+='<td Style ="padding-bottom: 3px;padding-top: 0px;border-bottom: 0;position: relative;">'+value4.replace('%20',' ')+'</td>';
						else if(key4=='status')
							sub+='<td Style ="padding-bottom: 3px;padding-top: 0px;border-bottom: 0;position: relative;">'+value4+'</td>';	
						else if(key4=='agentSkillLevel')
							sub+='<td Style ="padding-bottom: 3px;padding-top: 0px;border-bottom: 0;position: relative;" id="'+value4+'">'+value4+'</td>';
						else if(key4=='agentLogin')
							sub+='<td Style ="padding-bottom: 3px;padding-top: 0px;border-bottom: 0;position: relative;">'+value4+'</td>';
						});
					}
					catch(err)
					{
						console.log("Exception: Please Check, One of the Agent Login Could be null for the skill= "+key2);
						return;
					}
					sub+='<tr>';
				});
				
				sub+='<tr><tbody></table>';
				tablecontent+='<td>'+sub+'</td></tr>';
			}	
			});
		});
		
		$('#sampleTable').append(tablecontent);
	}
}

function updateAdminTable(data)
{
	if(data != null)
	{
		$('#adminTablebody').html('');
		tabledata="";
		if(data != "")
		{
			console.log("Success got thie data"+data);
			var json = JSON.parse(data);
			var agentlogin = '';
			var clientid = '';
			//console.log("This is the data we got after parsing"+ json);
			$.each(json, function(key,value){
				//console.log("This the key "+ key + "This is a value " + value);
				$.each(value, function(key2, value2){
					//console.log("This the key2 "+ key2 + "This is a value2 " + value2);
					var skill = key2.split('/');
					tabledata +="<tr id="+skill[2]+"><td style='width:20%'><strong>"+skill[2]+"</strong></td>";
					$.each(value2, function(key3, value3){
						//console.log("This the key3 "+ key3 + "This is a value3 " + value3);
						agentlogin += key3+'<BR>';
						clientid += value3+'<BR>';
					});
					tabledata +="<td style='width:40%'>"+agentlogin+"</td><td style='width:40%'>"+clientid+"</td></tr>";
					agentlogin ='';
					clientid = '';
				});
			});
			//console.log(tabledata);
		}
		$('#adminTablebody').append(tabledata);
	}
}
