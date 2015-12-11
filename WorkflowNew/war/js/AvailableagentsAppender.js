var agentData = 
{
		parseAndShowData	:	function(incomingJsonData)
		{
		console.log("entered the function");	
		var jsonData = JSON.parse(incomingJsonData);
		try
		{
			if( JSON.parse(jsonData.data).newInteraction != undefined )
			{
				console.log("this is the data values you need to check :: "+JSON.parse(jsonData.data).newInteraction+" :: "+jsonData.data.chatType)
				$('#printpara').html(JSON.stringify(jsonData));
				return;
			}
		}
		catch(exceptionObject1)
		{
			console.log("this is the chat type :: "+jsonData.data.chatType)
			if( jsonData.data.chatType != undefined )
			{
				console.log("this is the data values you need to check :: "+jsonData.data.newInteraction+" :: "+jsonData.data.chatType)
				$('#printpara').html(JSON.stringify(jsonData));
				return;
			}
		}
		parseAndCreateTable(jsonData);
		$('#booga').html(JSON.stringify(jsonData));
		return;
		}

}

	function parseAndCreateTable(jsonData)
	{
	var AgentData = jsonData.data;
	$('#looga').html(AgentData);
	}