var branding_headerColor = '<c:out  value="${sessionScope.headerColorFromSession}"/>';
var branding_logo = '<c:out  value="${sessionScope.logoFromSession}"/>';
var subAccNum	=	'<c:out value="${subAcc}"/>';
var deletetedby = '<c:out value="${sessionScope.loginid}"/>';
var googleLogin = '<c:out value="${sessionScope.googleLogin}"/>';

var obj_id = "";
var objcountflag	=	"";
$(document).ready(function() 
		{
	        $('#notification').hide();
	        $('#AccntNum').val("");
	        $('#datepicker').val("");
	        $('#datepicker1').val("");
	        $('#billingAddress').val("");
	        $('#clientidval').hide();
	        obj_id = "all";
		});
function accounttype(value)
{
	console.log("came inside to accounttype :: "+value);
	if (value=="NewAccount")
		{
			console.log("for new account")
			document.getElementById("newaccount").style.display = "block";
			document.getElementById("existingaccount").style.display = "none";
			document.getElementById("updateexistingaccount").style.display = "none";
		}
	else if(value=="ExistingAccount")
		{
		    console.log("ExistingAccount");
			document.getElementById("existingaccount").style.display = "block";
			document.getElementById("newaccount").style.display = "none";
			document.getElementById("updateexistingaccount").style.display = "none";
		}
	else if(value == "UpdateExistingAccount")
		{
			console.log("for updating the account");
			document.getElementById("existingaccount").style.display = "none";
			document.getElementById("newaccount").style.display = "none";
			document.getElementById("updateexistingaccount").style.display = "block";
		}
}

	
$(function() 
{
    $( "#datepicker" ).datepicker();
    $( "#datepicker1" ).datepicker();
});
var registerDetails = new Object();
function validateEmail(sEmail) {
	
	    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	
	    if (filter.test(sEmail)) {	
	        return true;	
	    }	
	    else {	
	        return false;	
	    }	
	}

function validateMultipleEmailsCommaSeparated(emailcntl, seperator) {
    
        var emailcntl = emailcntl.split(seperator);
        for (var i = 0; i < emailcntl.length; i++) {
            if (emailcntl[i] != '') {
                if (!validateEmail(emailcntl[i])) {
                    return false;
                }
            }
        }
    
    return true;
}

function validateBillingDates(fromDate,toDate)
{
	var currentDate	= new Date();
	fromDate = new Date(fromDate);
	toDate = new Date(toDate);
	console.log("the current date iss--->"+currentDate);
	console.log("the from date is--->"+fromDate);
	console.log("the cto date iss--->"+toDate);
	if(fromDate <= currentDate && toDate <= currentDate)
	{	
		
		
			if(toDate >= fromDate)
			{
				var date1 = new Date(fromDate);
				var date2 = new Date(toDate);
				var timeDiff = Math.abs(date2.getTime() - date1.getTime());
				var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
				var totalDays = diffDays + 1;
				console.log("totalDays="+totalDays);
				
				if(totalDays <=92)
					return true;
				else
				{
					var status = "Date Range can be a maximum of 3 months, not beyond that.!";
					$('#notification').html(status);	
					$('#notification').show();
					$('#notification').css({"color":"red"});		
					//$('#inputDate1').val('');
					//$('#inputDate2').val('');
					$('#date').css('border-color','red');
					$('#date2').css('border-color','red');
					return false ;
				}
			}
			else 
			{
				var status = "From Date can't be greater than To Date..!";
				$('#notification').html(status);	
				$('#notification').show();
				$('#notification').css({"color":"red"});		
				//$('#inputDate1').val('');
				//$('#inputDate2').val('');
				$('#date1').css('border-color','red');
				$('#date2').css('border-color','red');
				return false ;
			}
	}
	else
	{
		 var status = "Dates given is greater than the present Date.";
		 $('#notification').html(status);	
		 $('#notification').show();
		 $('#notification').css({"color":"red"});		
		 $('#date1').css('border-color','red');
		 $('#date2').css('border-color','red');
		 return false ;
	}

}
	function callme()
	{
		//$('#AccntNum, #datepicker, #datepicker1, #billingAddress').css("border-color","white");
		$('#OptionSelect,#OptionSelecttype').css('border-color','black');
		var accnum			=	$('#AccntNum').val();
		var fromdate		=	$('#date1').val();
		var todate			=	$('#date2').val();
		var email			= 	$('#billingAddress').val();
		var interactionsb	=	$('#model-chat-Id').hasClass('active-radio');
		var interactionar	=	$('#model-ar-Id').hasClass('active-radio');
		var billingall		=	$('#all').hasClass('active-radio');
		var billingspecific	=	$('#specific').hasClass('active-radio');
		var type			= "";
		if(billingspecific == true){
				objcountflag	=	1;
		}else{
				objcountflag	=	0;
		}
		if(interactionsb == true){
			type = "chat";
		}else{
			type = "ar";
		}		
		
		if(fromdate != "" && todate != "")
		{	
			console.log("works");
		
			if(validateBillingDates(fromdate,todate))
			{
				var fromDateArray = new Array();
				var toDateArray = new Array();
				fromDateArray = fromdate.split("/");
				toDateArray = todate.split("/");
				
						if((parseInt(String(fromDateArray[0]))>12) || (parseInt(String(fromDateArray[1]))>31) || (parseInt(String(toDateArray[0]))>12) || (parseInt(String(toDateArray[1]))>31))
						 {
							 var status = "Please check the data entered";
							 $('#notification').html(status);	
							 $('#notification').show();
							 $('#notification').css({"color":"red"});
						 }
						 else if((  (!(jQuery.trim(fromdate).length > 0)) || (!(jQuery.trim(todate).length > 0))  || (!(jQuery.trim(email).length > 0))))
						 {
							 var status = "Fields can't be null";
							 $('#notification').html(status);	
							 $('#notification').show();
							 $('#notification').css({"color":"red"});
						 }	
						console.log("email before="+email);
						email = email.replace(/\s/g, '');
								
			            if ($.trim(email).length == 0) 
			            {	
	         				console.log("got here as well");
	         				var status = "Email-Id is Empty";
							$('#notification').html(status);
							$('#notification').show();  
							$('#notification').css({"color":"red"});
							$('#billingAddress').css("border-color",'red');
							return null; 
			            }
			             
						console.log("the email id validation is----->"+validateEmail(email));
				        if (validateMultipleEmailsCommaSeparated(email,",")) 
				        {	   
				            	 if(validateacc(accnum))
				            	{
				            		 fromdate = fromdate.replace('/','-');
				            		 fromdate = fromdate.replace('/','-');
				            		 todate = todate.replace('/','-');
				            		 todate = todate.replace('/','-');
				            		 if(accnum.trim() == "" || String(billingall).match('true'))
				            			 accnum = "null";
				            		 
				            		 console.log("email after="+email);
				            		 
				            		 var billurl = "/getBillforGivenDateRange/"+fromdate+"/"+todate+"/"+email+"/"+type+"/"+accnum+"/false";
				            		 console.log("this is the url = "+billurl);
				            		 $.ajax({
						 					type : "POST",
						 					url  : billurl,
						 					async : false,
						 					success : function(data) 
						 					{
						 						console.log("data returned is="+data);
						 						if(data == "success")
						 							var status = "Billing Reports sent to the MailId Specified";
						 						else
						 							var status = "Request was not processed. Try Again";
						 						$('#notification').html(status);
						 						$('#notification').show();
						 						$('#notification').css({"color":"green"});
						 						$('#datepicker').val('');
						 						$('#datepicker1').val('');
						 						$('#AccntNum').val('');
						 						$('#billingAddress').val('');
						 					}
				 					   });
				             		}
				            	 else{
				            		 console.log("coming in else");
				            	 }
				          	   }	    
				             else 
				             {	 
						            	 console.info("false");
						            	 var status = "EmailId is Invalid";
										 $('#notification').html(status);
										 $('#notification').show();     
										 $('#notification').css({"color":"red"});
										 $('#billingAddress').css("border-color",'red');
				             }	 				
						}
			 else
				 {
				 console.log('validateDates function has returned false');
				 }
				 
				}
		 else 
		 {
				if(fromdate == ''){
					$('#date1').css("border-color","red");
					var status = "From Date cannot be empty";}
				else if(todate == ''){	
					$('#date2').css("border-color","red");
				    var status = "To Date cannot be empty";}
				
				$('#notification').html(status);
				$('#notification').show();  
				$('#notification').css({"color":"red"});
        }	
	}

	
	
	
	function validateacc(accnum)
	{
		if(objcountflag	==	0)
		{
			return true;
		}
		else{
				console.log("the obj_id--->"+obj_id);
				if(obj_id == "specific")
				{
					console.log("THE LENGTH OF THE ACCNT NUMBERS--->"+String(accnum).length);
					console.log("THE LENGTH OF THE ACCNT NUMBERS--->"+accnum);
					var length	=	String(accnum).length;
						if(accnum == "" || length < 10)
						{
							if(accnum == "")
							var status = "The Account Number cannot be Empty....!";
							else
							var status = "Check the Account Number entered";
							 $('#notification').html(status);	
							 $('#notification').show();
							 $('#notification').css({"color":"red"});
							 $('#AccntNum').css("border-color","red");
								return false;
						}	
						else
							{
								return true;
							}
				}
				else if(obj_id=="all" ) 
				{
					return true;
				}
				objcountflag++;
		}
	}
	
	function validate(evt)
	{
		if ((!( evt.keyCode==46)) && (!( evt.keyCode==8)) && (!( evt.keyCode==37)) && (!( evt.keyCode==39))  && (!( evt.keyCode==188))  && (!( evt.keyCode==9)))
		{
			$('#notification').hide();
			  var theEvent = evt || window.event;
			  var key = theEvent.keyCode || theEvent.which;
			  key = String.fromCharCode( key );
			  var regex = /[0-9]|\,/;
			  if(!regex.test(key) ) {
			    theEvent.returnValue = false;
			    if(theEvent.preventDefault)
			    	{
			    	theEvent.preventDefault();
			    	var status = "Please enter only numbers";
					 $('#notification').html(status);
					 $('#notification').show();    
			    	}
			  }
		}
			
		
	}
	function datevalidate(evt) {
		if ((!( evt.keyCode==46)) && (!( evt.keyCode==8)) && (!( evt.keyCode==37)) && (!( evt.keyCode==39)))
		{
			
		$('#notification').hide();
		  var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  key = String.fromCharCode( key );
		  var regex = /[0-9,/]|\,/;
		  if( !regex.test(key) ) {
		    theEvent.returnValue = false;
		    if(theEvent.preventDefault) theEvent.preventDefault();
		  }
		}
		}
	function IsEmail(email) {
		  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			 	
		  return regex.test(email);
		}
	function show_hide(obj)
	{
		console.log(obj.id);
		 obj_id = obj.id;
		if(obj_id == "all")
		{
			 $('#clientidval').hide();
		}
		else if(obj_id == "all_sub"){
			$('#specific_clientids').hide();
		}
		else if(obj_id == "specific_sub"){
			$('#specific_clientids').show();
		}
		else if(obj_id == "subscribe"){
			$('#unsubscribe_div').hide();
			$('#subscribe_div').show();
		}
		else if(obj_id == "unsubscribe"){
			$('#unsubscribe_div').show();
			$('#subscribe_div').hide();
		}
		else {
			 $('#clientidval').show();
		}
	}
	
	$().ready(function() {	
		var nowTemp = new Date();
		var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
		var checkin = $('#date1').datepicker({
		    onRender: function (date) {
		        return date.valueOf() > now.valueOf() ? 'disabled' : '';
		    }
		}).on('changeDate', function (ev) {
		    
		    //made changes to condition below
		    var newDate = new Date(ev.date)
		    checkout.setValue(newDate);
		    checkin.hide();
		    $('#date2')[0].focus();
		}).data('datepicker');
		var checkout = $('#date2').datepicker({
		    onRender: function (date) {
		       //made changes to below line
		       var after = new Date(checkin.date);
		       after.setDate(after.getDate() + 91);
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
	    var dateEnd = $('#date2')
	    .datepicker()
	    .on('changeDate', function(ev){
	        dateEnd.datepicker('hide');
	    });
	    $('#date1').datepicker("setValue", new Date());
		$('#date2').datepicker("setValue", new Date());
		
		$('#billingAddress').focus(function (){clearErrorMessage(); $('#billingAddress').css("border-color",'');});
		$('#AccntNum').focus(function (){clearErrorMessage(); $('#AccntNum').css("border-color",'');});
		
		
		$('.radio-btn li').click(clearErrorMessage);
	});
	
	function clearErrorMessage()
	{
		$('#notification').html("");
		$('#notification').hide();  
		$('#notification').css({"color":""});
	}