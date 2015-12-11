
      $(document).ready(function(){
    	  $('.full_dtl img').attr('src', photoURL);
    	  $('.userimg img').attr('src', photoURL);
      $('.account-details').on('click','td.acc_wd,td.domain_wd,td.aglogin_wd,td.status_wd,td.dateadd_wd,td.datecom_wd,td.anstime_wd,td.timespt_wd',function(event){
            //$('#detail_listing').show();
           // $('body').append('<div class="modal-backdrop fade in"></div>');
    	  if(event.target.id == "clientURL")
    		  return;
    	  $('#detail_listing').modal('show');
      });
      $('#detail_listing').on('shown.bs.modal', function() {
    	  positionHistoryTableHeaders();
      });
        $(".tab_hold ul li,.pgshow_opt a").on('click',function() {
            $(this).siblings().removeClass('active'); 
            $(this).addClass('active');
        });
        $(".tab_hold ul li").hover(function() {
                // this function is fired when the mouse is moved over
                $(".out",   this).stop().animate({'top':    '75px'},    100); // move down - hide
                $(".over",  this).stop().animate({'top':    '0px'},     100); // move down - show
                }, function() {
                // this function is fired when the mouse is moved off
                $(".out",   this).stop().animate({'top':    '0px'},     100); // move up - show
                $(".over",  this).stop().animate({'top':    '-75px'},   100); // move up - hide
            });

        $('#detail_listing .close').on('click',function(){
            $(this).parent().parent().parent().parent().hide();
          //  $( ".modal-backdrop.fade.in" ).remove();
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
        
        $('body').click(function(evt){    
        	if(evt.target.id == "fetchdtl")
        		return;
        	if(evt.target.id == "fetchtab")
        		return;
        	if($(evt.target).closest('#fetchdtl').length)
        		return;             
        	$('#fetchdtl').hide();
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
        $('a[href="#fetchdtl"]').on('click',function(){
            var fetchdtl = $('#fetchdtl');

            if (fetchdtl.css('display')=='none') {
                fetchdtl.show();
            }else{
                fetchdtl.hide();
            }
            
            $('#fetchdtl .popover-content').find('.fch_input').focus();
        });
        $('a[href="#status_dtl"]').on('click',function(){
            $('#status_dtl').css('display','block');
            $('#status').hide();
        });
        $('a[href="#status"]').on('click',function(){
            $('#status').show();
            $('#status_dtl').css('display','none');
            
        });
        $('.pg_opt i,.pgshow_opt i').tooltip();
        $('#save_csv').on('click',function(){
        $('#choose-file').trigger('click');
        });
        try
        {
        $('#choose-file').on('change', prepareUpload);
        }catch(e)
        {
        console.log("No such Id exists in this tab.")
        }     
        $('#newsave_csv').on('click',function(){
        $('#newchoose-file').trigger('click');
        });
        try
        {
        $('#newchoose-file').on('change', prepareAgentUpload);
        }catch(e)
        {
        console.log("No such Id exists in this tab.")
        }
        });
      
$(window).load(function(){
    var winheight = $(window).height();
    $('.account-details .table_scroll').height(winheight-277);
    $('#detail_listing .modal-content').height(winheight);
    $('#detail_listing .dtl_scroll').height(winheight-327);
    $('.status_dtl').height(winheight-250);
});
$(window).resize(function(){
    var winheight = $(window).height();
    $('.account-details .table_scroll').height(winheight-277);
    $('#detail_listing .modal-content').height(winheight);
    $('#detail_listing .dtl_scroll').height(winheight-327);
    $('.status_dtl').height(winheight-250);
});
function deleteCookie(name)
{
	/*if(name != "")
	{
		var cookieChecker	=	checkIfCookieExists(name);
		if(cookieChecker)
			deleteThisCookie(name);
	}*/
	if(googleLogin != null && googleLogin != undefined && googleLogin === "true")
	{
		window.location.href = "/logoutWithGoogle";
	}
	else
	{
		window.location.href="/logout";
	}	
}

function positionHistoryTableHeaders()
{
	var tdIndex ;
	var thIndex ;
	var tdElement ;
	var tdElementWidth ; 
	var thElement ; 
	
	try
	{
	$("#myTable2 tr:first td").each(function() {
		tdIndex = $(this).index();
		tdElement = $(this);
		tdElementWidth = $(this).width();
		
		$("#myTable th").each(function(){
			thElement = $(this);
			thIndex = thElement.index();
			if(tdIndex == thIndex)
			{
				thElement.width(tdElement.width());
			}
		});
	});
	}
	catch(err)
	{
		console.log("Exception occurred while positioning history table headers => "+err.message);
	}
}
