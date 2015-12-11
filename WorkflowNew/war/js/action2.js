	$(document).ready(function(){
				// radio-btn
		$('#activatebutton').prop('disabled',true);
		$('#deactivatebutton').prop('disabled',true);
		$('#addclassbox').removeClass("panel-success");
		$('#addclassbox').removeClass("panel-danger");
	

				$('.radio-btn li').click(function(){
					$(this).addClass("active-radio");
					$(this).siblings().removeClass("active-radio");
					});

				// Check-Box

				$('.checkbox').click(function(){
					$(this).toggleClass('active-check');
				});

				// Check-list

				$('.checklist li').click(function(){
					$(this).toggleClass("active-checklist");
				});

				// Close-list

				$('body').on('click','.close-btn',function(){
                    $(this).parent().remove();
                });

				//Cancel-Mail

				$('.btn-cancel').click(function(){
                $('.auto-gen li').remove();
                $('.multi-input li').not('li:last').remove();
                $('.mail-input').val('').focus();
           		});

           		// Dynamic-Checklist

					$(".checklist li").click(function(){
						if($(this).hasClass("active-checklist"))
						{
							var value=$(this).find('b').text();
							$('.auto-gen').append("<li>"+value+"<span class='close-btn'>x</span></li>");
						}
						else
						{
							var temp=$('.auto-gen li').find('b').text();
							$('.auto-gen li').remove();
						}
				    });


						// Adding multiple-input

					    $(".mail-input").keyup(function(e){
					      	var value=$(".mail-input").val();
					      	
					        if (e.keyCode == 13) {

					        	if(value.length==0)
					        	{
					        		return false;
					        	}
					        	else
					        	{
					        		$('.multi-input li.temp-value').before('<li class="temp-li">'+value+'<span class="close-btn">x</span></li>');
					            	$('.mail-input').val('').focus();
					        	}
					        }
					        else if(e.keyCode==8){

					        	if(value.length==0)
						        {
						        	$('.multi-input li:last-child').prev().remove();
						        }
								else
								{
									return false;
								}
					        }
					    });

							// DeleteAll-User

								$('.user-mgment .checkbox').click(function(){
									 if($(".search-user b i").css("display")==="none")
									 {
									 	$(".search-user b i").css("display", "inline-block");
									 	$('.user-mgment span i').css("display", "inline-block");
									 	$('.user-mgment tr td b i').css("display", "none");

									 }
									 else
									 {
									 	$(".search-user b i").css("display", "none");
									 	$('.user-mgment span i').css("display", "none");
									 	$('.user-mgment tr td b i').css("display", "inline-block");
									 }
								});

								//collapse triggering button 
								$('#Step-2').click(function()
								{
									$( ".collapse2" ).trigger( "click" );
								});	
								$('#Step-3').click(function()
								{
									$( ".collapse3" ).trigger( "click" );
								});	
								$('#Step-4').click(function()
								{
									$( ".collapse4" ).trigger( "click" );
								});	
								
								
									// Collapse

										$('.collapse2').click(function()
										{
											if(($('#campagin-val').val()).indexOf('Chat') ==-1)
											{
												if(accountManager.AccountData.subAccountNumber	!= undefined && accountManager.AccountData.subAccountNumber	!= '')
												{
													if($('#domin-form').val() != '' && $('#domin-form').val() != undefined)
													{
														if(!(($('#campagin-val').val()).indexOf('Campagin') != -1))
														{
																if($(".panel2").css("display")==="none")
																{
																	$("#messageboxforactivate").slideUp();
																	$('.panel1').slideUp('slow');
																	$('.panel2').slideToggle('slow');
																	$('.panel3').slideUp('slow');
																	$('.panelPending').slideUp();
																	$('.panel4').slideUp();
																	$('.panel5').slideUp();
																	
																	$('#domin-form').css('border-color','rgb(208, 208, 208)');
																	$('#campagin-val').css('border-color','rgb(208, 208, 208)');
																	
																	if(($('#campagin-val').val()).indexOf('Email') != -1)
																		document.getElementById('email-table').style.display	=	"block";
																	else
																		document.getElementById('email-table').style.display	=	"none";
																}
														}
														else
														{
															$('#domin-form').css('border-color','rgb(208, 208, 208)');
															$('#campagin-val').css('border-color','red');
														}		
													}
													else
													{
														 $('#domin-form').css('border-color','red');
													}
												}
												else
												{
													$('#create-acc').trigger('click');
												}
											}
											else
											{
												if($(".panel4").css("display")==="none")
												{
													$("#messageboxforactivate").slideUp();
													$('.panel2').slideUp();
													$('.panel1').slideUp();
													$('.panel4').slideUp();
													$('.panel5').slideUp();
													$('.panelPending').slideUp();

													$('.panel4').slideToggle('slow');
													$('#callDe-form').css('border-color','rgb(208, 208, 208)');
													$('#campDe-form').css('border-color','rgb(208, 208, 208)');
													$('#formname-form').css('border-color','rgb(208, 208, 208)');	
												}
											
											}
										});	

										$('.collapse1').click(function()
										{
											if(!!accountManager.AccountData && !!accountManager.AccountData.isAssigned && accountManager.AccountData.isAssigned.toLowerCase() == "false" && accountManager.AccountData.subAccountNumber != "")
												$('#popup-subacc').html(accountManager.AccountData.subAccountNumber);
											else
												$('#popup-subacc').html("");
												
											if(($('#campagin-val').val()).indexOf('Chat') ==-1)
											{
												if($(".panel1").css("display")==="none")
												{
													$("#messageboxforactivate").slideUp();
													$('.panel2').hide();
													$('.panel3').hide();
													$('.panel4').slideUp();
													$('.panel5').hide();
													$('.panelPending').slideUp();
	
													$('.panel1').slideToggle('slow');
												}
											}
											else
											{
												if($(".panel4").css("display")==="none")
												{
													$("#messageboxforactivate").slideUp();
													$('.panel2').slideUp();
													$('.panel1').slideUp();
													$('.panel4').slideUp();
													$('.panel5').slideUp();
													$('.panelPending').slideUp();

													$('.panel4').slideToggle('slow');
													$('#callDe-form').css('border-color','rgb(208, 208, 208)');
													$('#campDe-form').css('border-color','rgb(208, 208, 208)');
													$('#formname-form').css('border-color','rgb(208, 208, 208)');	
												}
											
											}
										});
										$('.collapse3').click(function()
										{	
											if(($('#campagin-val').val()).indexOf('Chat') ==-1)
											{
												if($('#callDe-form').val() !='' && $('#callDe-form').val() !=undefined && $('#campDe-form').val() != '' && $('#campDe-form').val() != undefined && $('#formname-form').val() != '' && $('#formname-form').val() != undefined )
												{	
													if(($('#campagin-val').val()).indexOf('Email') !=-1)
													{
														if($('#email-form').val() !='' && $('#EmailPass-form').val() !='')
														{
															if($(".panel3").css("display")==="none")
															{
																$("#messageboxforactivate").slideUp();
																$('.panel2').slideUp();
																$('.panel1').slideUp();
																$('.panel4').slideUp();
																$('.panel5').slideUp();
																$('.panelPending').slideUp();
		
																$('.panel3').slideToggle('slow');
																$('#callDe-form').css('border-color','rgb(208, 208, 208)');
																$('#campDe-form').css('border-color','rgb(208, 208, 208)');
																$('#formname-form').css('border-color','rgb(208, 208, 208)');	
																$('#email-form').css('border-color','rgb(208, 208, 208)');
																$('#EmailPass-form').css('border-color','rgb(208, 208, 208)');
															}
														}else
														{
															if($('#callDe-form').val() =='')
															{$('#callDe-form').css('border-color','red');}else{$('#callDe-form').css('border-color','rgb(208, 208, 208)');}
															if($('#campDe-form').val() =='')
															{$('#campDe-form').css('border-color','red');}else{$('#campDe-form').css('border-color','rgb(208, 208, 208)');}
															if($('#formname-form').val() =='')
															{$('#formname-form').css('border-color','red');}else{$('#formname-form').css('border-color','rgb(208, 208, 208)');}
															if($('#email-form').val() =='')
															{$('#email-form').css('border-color','red');}else{$('#email-form').css('border-color','rgb(208, 208, 208)');}
															if($('#EmailPass-form').val() =='')
															{$('#EmailPass-form').css('border-color','red');}else{$('#EmailPass-form').css('border-color','rgb(208, 208, 208)');}
														}
													}else
													{
														if($(".panel3").css("display")==="none")
														{
															$("#messageboxforactivate").slideUp();
															$('.panel2').slideUp();
															$('.panel1').slideUp();
															$('.panel4').slideUp();
															$('.panel5').slideUp();
															$('.panelPending').slideUp();
															
															$('.panel3').slideToggle('slow');
															$('#callDe-form').css('border-color','rgb(208, 208, 208)');
															$('#campDe-form').css('border-color','rgb(208, 208, 208)');
															$('#formname-form').css('border-color','rgb(208, 208, 208)');	
														}
													}
												}
												else
												{
													if($('#callDe-form').val() =='')
													{$('#callDe-form').css('border-color','red');}else{$('#callDe-form').css('border-color','rgb(208, 208, 208)');}
													if($('#campDe-form').val() =='')
													{$('#campDe-form').css('border-color','red');}else{$('#campDe-form').css('border-color','rgb(208, 208, 208)');}
													if($('#formname-form').val() =='')
													{$('#formname-form').css('border-color','red');}else{$('#formname-form').css('border-color','rgb(208, 208, 208)');}
												}
											}
											else
											{
												if($(".panel4").css("display")==="none")
												{
													$("#messageboxforactivate").slideUp();
													$('.panel2').slideUp();
													$('.panel1').slideUp();
													$('.panel4').slideUp();
													$('.panel5').slideUp();
													$('.panelPending').slideUp();

													$('.panel4').slideToggle('slow');
													$('#callDe-form').css('border-color','rgb(208, 208, 208)');
													$('#campDe-form').css('border-color','rgb(208, 208, 208)');
													$('#formname-form').css('border-color','rgb(208, 208, 208)');	
												}
											}
											});
										
										$('.collapse5').click(function(){
											
															$("#messageboxforactivate").slideUp();
															$('.panel2').slideUp();
															$('.panel1').slideUp();
															$('.panel3').slideUp();
															$('.panel4').slideUp();
															$('.panelPending').slideUp();
															$('.panel5').slideToggle('slow');												
														
													
													if($(".panel5").css("display")==="none")
													{
														$('.panel2').slideUp();
														$('.panel1').slideUp();
														$('.panel3').slideUp();
														$('.panel4').slideUp();
														$('.panelPending').slideUp();
														$("#messageboxforactivate").slideUp();

														$('.panel5').slideToggle('slow');												
													}
												});
											
									$('.collapsePending').click(function(){
										
										if(!accountManager.AccountData.subAccountNumber)
											return;
										
										if(accountManager.pendIntLookupsList.length == 0 && accountManager.islookupsfetched == false)
											accountManager.getPendingInteractionsLookups(accountManager.AccountData.subAccountNumber);
										else
										{
											if(accountManager.pendIntLookupsList.length == 0 && accountManager.islookupsfetched == true )
												messageWindow.popUpMessage("No Lookups Present!",2000);
											else
											{
												$("#messageboxforactivate").slideUp();
												$('.panel2').slideUp();
												$('.panel1').slideUp();
												$('.panel3').slideUp();
												$('.panel5').slideUp();
												$('.panel4').slideUp();
												$('.panelPending').slideDown();
											}
										}
										});
										
										//
										$('.collapse4').click(function()
											{
											if(($('#campagin-val').val()).indexOf('Chat') ==-1)
											{
												if($('#callDe-form').val() !='' && $('#domin-form').val() != '')
												{
													if(accountRulesTimeValidator() && validateInvalidTriggerTime() && validateARFrequency())
													{
															if(($('#campagin-val').val()).indexOf('Email') !=-1)
															{
																if($('#email-form').val() !='' && $('#EmailPass-form').val() !='')
																{
																		$("#messageboxforactivate").slideUp();
																		$('.panel2').slideUp();
																		$('.panel1').slideUp();
																		$('.panel3').slideUp();
																		$('.panel5').slideUp();
																		$('.panelPending').slideUp();
																		$('.panel4').slideDown();
																}
															}else
															{
																	$("#messageboxforactivate").slideUp();
																	$('.panel2').slideUp();
																	$('.panel1').slideUp();
																	$('.panel3').slideUp();
																	$('.panel5').slideUp();
																	$('.panelPending').slideUp();
																	$('.panel4').slideDown();
															}
															$(".errTime").removeClass('errTime');
													}
													else
													{
														$('.collapse3').click();
													}
												}
											}
											else
											{
													$("#messageboxforactivate").slideUp();
													$('.panel2').slideUp();
													$('.panel1').slideUp();
													$('.panel3').slideUp();
													$('.panel5').slideUp();
													$('.panelPending').slideUp();
													$('.panel4').slideDown();
											}
										});
										
										//
										// Navigation
										
											$('.dis-sales').click(function(){
													$('.distributed').show();
													$('.panel1').show();
													$('.panel2').hide();	
													$('.service, .trello-sales').hide();
													$('.dis-sales').addClass('active-li');
													$(this).siblings().removeClass("active-li");

											});

											$('.dis-service').click(function(){
													$('.service').show();
													$('.panel1').show();
													$('.panel2').hide();	
													$('.trello-sales,.distributed').hide();
													$('.dis-service').addClass('active-li');
													$(this).siblings().removeClass("active-li");
											});	


											$('.trello').click(function(){
													$('.trello-sales').show();
													$('.panel1').show();
													$('.panel2').hide();	
													$('.service,.distributed').hide();
													$('.trello').addClass('active-li');
													$(this).siblings().removeClass("active-li");
											});		
			});
	
		
    $(window).load(function(){
		var header = $('header').height();
		var winheight = parseInt(document.documentElement.clientHeight);
		$('section').height((winheight)-(header)-3);
		$('aside').height((winheight)-(header)-5);
		$('article').height((winheight)-(header)-4);
		$('.right-pane').height((winheight)-(header)-3);
		$('.left_navbar').height((winheight)-(header)-112);
		$('.panel4').height((winheight)-(header)-265);
		$('.btm-lft').height((winheight)-(header)-110);
		$('.panel3').height((winheight)-(header)-265);
		$('.panel2').height((winheight)-(header)-270);
		$('.panelPending').height((winheight)-(header)-310);
    });

   $(window).resize(function(){
	   var header = $('header').height();
		var winheight = parseInt(document.documentElement.clientHeight);
		$('section').height((winheight)-(header)-3);
		$('aside').height((winheight)-(header)-5);
		$('article').height((winheight)-(header)-4);
		$('.right-pane').height((winheight)-(header)-3);
		$('.left_navbar').height((winheight)-(header)-112);
		$('.panel4').height((winheight)-(header)-265);
		$('.btm-lft').height((winheight)-(header)-110);
		$('.panel3').height((winheight)-(header)-265);
		$('.panel2').height((winheight)-(header)-270);
		$('.panelPending').height((winheight)-(header)-310);
	});
$("#skillTi-form").focusout(function(){
	var skill = $("#skillTi-form").val();
    skill = skill.replace(/ /g, "");
    $("#skillTi-form").val(skill);
});	

