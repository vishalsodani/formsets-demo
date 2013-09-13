var country_list = new Array;
var is_error_reported_on_form_validation = '';
$(document).ready(function () {
	
	is_error_reported_on_form_validation = $('#error').val();
	var from_country = $('#id_country').val();
	buildCountryList();

	if (is_error_reported_on_form_validation === '')
	{
	// This three will add selectboxes for 3 default countries Europe not EU,European Union and  Everywhere else
	addSelectBoxes();
	addSelectBoxes();
	addSelectBoxes();
	}
	
	if(is_error_reported_on_form_validation === '1'){
		
		selectboxHandler();
		
	}
	// these next 4 methods manually trigger change event for selectboxes
	$('#id_form-0-country').trigger('change',[from_country])
	
	if(is_error_reported_on_form_validation === '1')
	{
		var count = $('#sell_to').children().length;
		for (var i=0; i < count; i++) {
		  var ctry = $('#id_form-'+ i+ '-country').val();
		  if (ctry !== ''){
		  $('#id_form-'+ i+ '-country').trigger('change',ctry);
		  }
		};
	}
	else
	{
	$('#id_form-2-country').trigger('change',['5']); // the id of Europe not EU
	$('#id_form-1-country').trigger('change',['6']); // the id of European Union 
	$('#id_form-3-country').trigger('change',['7']);
	}
	
	$('select[id^="id_form"]').on('change',handleCountrySelection);
	
	$('#add_more').click(function(){
		   //the template defined in add_art called art-template
			var tmplMarkup = $('#art-template').html(); 
			//count no of forms
			var count = $('#sell_to').children().length;
			// pass the id
			var compiledTmpl = _.template(tmplMarkup, { id : count });
			var new_list = new Array;
			new_list = country_list;
			var selectboxes =  $('select[id^="id_form"]');
			
			$('select[id^="id_form"]').each(function(){
				
				var sel_obj = $(this);
				//filter the country list based on countries already selected in other select boxes
				new_list = _.reject(new_list,function(obj){return obj.id==sel_obj.val() ;});
			})
			
			$('#sell_to').append(compiledTmpl);
			$('#id_form-TOTAL_FORMS').attr('value', count+1);
			for (var i=0; i < new_list.length; i++) {
			  $('<option>').val(new_list[i].id).text(new_list[i].name)
			  .appendTo('#id_form-' + count + '-country');
			};
			
			selectboxHandler();
	});
});


var buildCountryList = function(){
	
	$("#id_form-0-country>option").each(function(){
		var country = {};
		country.id = $(this).val();
		country.name = $(this).text();
		country_list.push(country);
		_.reject(country_list,function(obj){return obj.id=='' ;});
	})
}

var handleCountrySelection = function (event,data) {
  
  if (typeof data !== 'undefined'){
  	
  	$(event.target).val(data);
  	
  }
  var countryid_selected = $(event.target).val();

  var id_of_select = $(event.target).attr('id');
  
  $(event.target).parent().children('span').show();
  
  $(event.target).parent().children('span').html($(event.target).find('option:selected').text());
  $(event.target).css('display','none')
  
  
  if (id_of_select === 'id_form-0-country' ){
  	
  	$(event.target).parent().children('span').insertAfter($('#id_form-0-country'))
 }
 
 if(is_error_reported_on_form_validation === '1'){
 	$(event.target).parent().children('span').insertAfter($('#' + id_of_select));
 }
  
  $('select[id^="id_form"]').each(function(){
				var id_box = $(this).attr('id');
				if(id_box !== id_of_select){
					$('#'+id_box + ' option[value=' + countryid_selected + ']').remove();
				}
			})
}

var handleRemoveRow = function(event){
	
	var parent = $(event.target).parent();
	//get selected option
	var select = $(parent).children('select');
	var id_of_select = $(select).attr('id');
	var val = $(select).val();
	if(val!==''){
		var ctry = _.filter(country_list,function(obj){return obj.id==val})
		$('select[id^="id_form"]').each(function(){
				var id_box = $(this).attr('id');
				if(id_box !== id_of_select){
					$('<option>').val(ctry[0].id).text(ctry[0].name)
			  .appendTo($(this));
				}
				
			})
	}
	$(parent).remove();
	var count = $('#sell_to').children().length;
	var forms = $('#sell_to');
	$('#id_form-TOTAL_FORMS').attr('value', count);
	prefix = "id_form"
    var i = 0;
    forms.children().each(function(){
    	
    	$(this).children().each(function(){
    		updateElementIndex(this, prefix, i);
    	})
    	i = i + 1;
    })
	
}

var addSelectBoxes = function(){
	
	
	
			var tmplMarkup = $('#art-template').html();
			var count = $('#sell_to').children().length;

			var compiledTmpl = _.template(tmplMarkup, { id : count });
			var new_list = new Array;
			new_list = country_list;
			var selectboxes =  $('select[id^="id_form"]');
			
			$('select[id^="id_form"]').each(function(){
				
				var sel_obj = $(this);
				new_list = _.reject(new_list,function(obj){return obj.id==sel_obj.val() ;});
			})
			
			$('#sell_to').append(compiledTmpl);
			$('#id_form-TOTAL_FORMS').attr('value', count+1);
			for (var i=0; i < new_list.length; i++) {
			  $('<option>').val(new_list[i].id).text(new_list[i].name)
			  .appendTo('#id_form-' + count + '-country');
			};
			
			$('select[id^="id_form"]').each(function(){
				
				var sel_obj = $(this);
				sel_obj.off();
				$('.remove_del').off();
				sel_obj.on('change',handleCountrySelection);
				$('.remove_del').on('click',handleRemoveRow);
				
			})
}

function updateElementIndex(el, prefix, ndx) {
		var id_regex = new RegExp('(' + prefix + '-\\d+)');
		var replacement = prefix + '-' + ndx;
		
		if ($(el).attr("for")) $(el).attr("for", $(el).attr("for").replace(id_regex, replacement));
		if (el.id) el.id = el.id.replace(id_regex, replacement);
		
		var prefix_name = "form";
		var id_regex_name = new RegExp('(' + prefix_name + '-\\d+)');
		var replacement_name = prefix_name + '-' + ndx;
		if (el.name) el.name = el.name.replace(id_regex_name, replacement_name);
	}

var selectboxHandler = function(){
	
	$('select[id^="id_form"]').each(function(){
				
				var sel_obj = $(this);
				sel_obj.off();
				$('.remove_del').off();
				sel_obj.on('change',handleCountrySelection);
				$('.remove_del').on('click',handleRemoveRow);
				
			})
	
}
