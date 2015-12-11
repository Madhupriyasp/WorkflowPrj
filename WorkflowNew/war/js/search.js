/**
 * @author balu
 * @param term
 * @param _id
 * @param cellNr
 */
var opts = {
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
query_counter	=	1;
var spinnerload	= new Spinner(opts);
var target = document.getElementById('foo');
var spinner = new Spinner(opts).spin(target);
$('body').append('<div class="modal-backdrop fade in"></div>');
function filter (term, _id, cellNr){
	var suche = term.value.toLowerCase();
	var table = document.getElementById(_id);
	var ele;
	for (var r = 1; r < table.rows.length; r++){
		ele = table.rows[r].cells[cellNr].innerHTML.replace(/<[^>]+>/g,"");
		if (ele.toLowerCase().indexOf(suche)>=0 )
			table.rows[r].style.display = '';
		else table.rows[r].style.display = 'none';
	}
}
function search_filter(phrase, _id){
	var words = phrase.value.toLowerCase().split(' ').join('');
	var matchedArray = [];
	words = words.split(",");
		var table = document.getElementById(_id);
		var ele;
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
}

	$("#search_box").on("keyup",function(e){
		if (e.keyCode == 44) 
		{
			matchedArray			= [];
		}
		iteration=0;
		var searchMap				= {},
			matchedArray			= [],
			searcharray				= $("#search_box").val().trim().toLowerCase(),
			searchvaluearray		= [],
			presentClass			= "",
			totalCount				= 0,
			searchValue				= "",
			searchCount				= 0;
		
		searchvaluearray = searcharray.split(',');

		if( $(".active").hasClass("task") ){
			searchMap		= dd.allmap;
			presentClass	= "allTaskCounter";
		}
		else if( $(".active").hasClass("queue") ){
			searchMap	= dd.inqueuemap;
			presentClass	= "inqueueCounter";
		}
		else if( $(".active").hasClass("requed") ){
			searchMap	= dd.answeredmap;
			presentClass	= "answeredCounter";
		}
		else if( $(".active").hasClass("progess") ){
			searchMap	= dd.inprogressmap;
			presentClass	= "progresscounter";
		}
		else if( $(".active").hasClass("pending") ){
			searchMap	= dd.pendingmap;
			presentClass	= "pendingcounter";
		}
		else if( $(".active").hasClass("scheduled") ){
			searchMap	= dd.scheduledmap;
			presentClass	= "scheduledcounter";
		}
		else if( $(".active").hasClass("stuck") ){
			searchMap	= dd.waitingmap;
			presentClass	= "waitingcounter";
		}
		else{
			searchMap	= dd.completedmap;
			presentClass	= "completedcounter";
		}
		
			for(index in searchMap){
				var tempString	= JSON.stringify( searchMap[index] ).toLowerCase();
				for( var i=0; i<searchvaluearray.length; i++){
					var searchValue	= searchvaluearray[i].trim();
					if( tempString.indexOf(searchValue) >= 0 ){
						matchedArray.push(searchMap[index]);
						break;
					}
				}
			}
		
		
		searchCount = matchedArray.length;
		if(searchValue == undefined || searchValue == null)
		{
			searchValue = "";
		}
		
		if( searchValue.trim() === ""){
			matchedArray = [];
			for(index in searchMap){
				matchedArray.push(searchMap[index]);
			}
			$("#searchid").html("");
			recreateDataToSort(matchedArray, "search");
		}
		else{
			$("#searchid").html(searchCount+" entries matches your search");
			recreateDataToSort(matchedArray, "search");
		}
		
	});
