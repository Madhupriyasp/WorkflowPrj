var Actions = 
{
		showVoiceBox	:	function( msg)
		{
			$('#showmsg').html(msg);
			$('#voice-box').css( 'display' , 'block' );
			$('#voice-box').fadeOut(3000);
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
};