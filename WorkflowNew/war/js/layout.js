(function($){
/*
	var initLayout = function() {
		$('#date').DatePicker({
			flat: true,
			date: '2008-07-31',
			current: '2008-07-31',
			calendars: 1,
			starts: 1,
			view: 'years'
		});

		var currentId = $('.hdate').attr('id'); 

		var now = new Date();

		var now2 = new Date();
		now2.addDays(-5);
		now2.setHours(0,0,0,0);

		$('.hdate').DatePicker({
			flat: true,
			date: now,
			current: now,
			format: 'm/d/Y',			
			calendars: 1,
			starts: 1,
			view: 'days',
			onChange: function(formated, dates) {
				var currentId = $(this).parent().prev().attr('id');
				$("#"+currentId+"").val(formated);
			}			
		});
	};
*/

	var showTab = function(e) {
		var tabIndex = $('ul.navigationTabs a')
							.removeClass('active')
							.index(this);
		$(this)
			.addClass('active')
			.blur();
		$('div.tab')
			.hide()
				.eq(tabIndex)
				.show();
	};
	
//	EYE.register(initLayout, 'init');
})(jQuery);


function hideCalander(datePickerElement) {
	var dateContainer = datePickerElement.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;

	if(dateContainer.className == "hdate") {
		dateContainer.style.display = "none";
	}
}