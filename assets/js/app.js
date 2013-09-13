var NO_ERROR = '';
var ERROR_REPORTED = '1';
var country_list = new Array;
var is_error_reported_on_form_validation = NO_ERROR;
var ID_OF_FIRST_TO_COUNTRY = 'id_form-0-country';
var PATTERN_OF_ID_OF_SELECT = 'select[id^="id_form"]';
var FORMSET_DIV_ID = '#sell_to';

$(document).ready(function() {
	is_error_reported_on_form_validation = $('#error').val();
	var from_country = $('#id_country').val();
	buildCountryList();
	initialize();
	var default_country_to_select = $('#id_form-0-country');
	default_country_to_select.trigger('change', [from_country]);
	$(PATTERN_OF_ID_OF_SELECT).on('change', handleCountrySelection);

	$('#add_more').click(function() {

		addSelectBoxes();

	});
});
var countForms = function() {
	return $(FORMSET_DIV_ID).children().length;
}
var compileTemplate = function(value_for_id) {
	var tmplMarkup = $('#art-template').html();
	var compiledTmpl = _.template(tmplMarkup, {
		id : value_for_id
	});
	return compiledTmpl;
}
var buildCountryList = function() {

	$("#id_form-0-country>option").each(function() {
		var country = {};
		country.id = $(this).val();
		country.name = $(this).text();
		if(country.id !== '') {
			country_list.push(country);
		}
	})
}
var handleCountrySelection = function(event, data) {

	var select_box = $(event.target);
	if( typeof data !== 'undefined') {

		select_box.val(data);

	}
	var countryid_selected = select_box.val();
	var id_of_select = select_box.attr('id');
	var replace_selectbox_with = select_box.parent().children('span');
	replace_selectbox_with.show(); 
	//displayCountryNameinSpan
	replace_selectbox_with.html(select_box.find('option:selected').text());
	//hidedropdown 
	select_box.hide();
	replace_selectbox_with.insertAfter($('#' + id_of_select));

	$('select[id^="id_form"]').each(function() {
		var id_box = $(this).attr('id');
		if(id_box !== id_of_select) {
			$(this).children('option[value=' + countryid_selected + ']').remove();
		}
	})
}
var handleRemoveRow = function(event) {

	var parent = $(event.target).parent();
	//get selected option
	var select = $(parent).children('select');
	var id_of_select = $(select).attr('id');
	var val = $(select).val();
	if(val !== '') {
		var ctry = _.filter(country_list, function(obj) {
			return obj.id == val
		})
		$('select[id^="id_form"]').each(function() {
			var id_box = $(this).attr('id');
			if(id_box !== id_of_select) {
				$('<option>').val(ctry[0].id).text(ctry[0].name).appendTo($(this));
			}

		})
	}
	$(parent).remove();
	var count = $(FORMSET_DIV_ID).children().length;
	var forms = $(FORMSET_DIV_ID);
	$('#id_form-TOTAL_FORMS').attr('value', count);
	prefix = "id_form"
	var i = 0;
	forms.children().each(function() {

		$(this).children().each(function() {
			updateElementIndex(this, prefix, i);
		})
		i = i + 1;
	})
}
var addSelectBoxes = function() {

	var count = countForms();
	var compiledTmpl = compileTemplate(count);
	var new_list = new Array;
	new_list = country_list;

	$(PATTERN_OF_ID_OF_SELECT).each(function() {

		var sel_obj = $(this);
		new_list = _.reject(new_list, function(obj) {
			return obj.id == sel_obj.val();
		});
	})

	$(FORMSET_DIV_ID).append(compiledTmpl);
	$('#id_form-TOTAL_FORMS').attr('value', count + 1);
	for(var i = 0; i < new_list.length; i++) {
		$('<option>').val(new_list[i].id).text(new_list[i].name).appendTo('#id_form-' + count + '-country');
	};

	selectboxHandler();
}
function updateElementIndex(el, prefix, ndx) {
	var id_regex = new RegExp('(' + prefix + '-\\d+)');
	var replacement = prefix + '-' + ndx;

	if($(el).attr("for"))
		$(el).attr("for", $(el).attr("for").replace(id_regex, replacement));
	if(el.id)
		el.id = el.id.replace(id_regex, replacement);

	var prefix_name = "form";
	var id_regex_name = new RegExp('(' + prefix_name + '-\\d+)');
	var replacement_name = prefix_name + '-' + ndx;
	if(el.name)
		el.name = el.name.replace(id_regex_name, replacement_name);
}

var selectboxHandler = function() {

	$(PATTERN_OF_ID_OF_SELECT).each(function() {

		var sel_obj = $(this);
		sel_obj.off();
		$('.remove_del').off();
		sel_obj.on('change', handleCountrySelection);
		$('.remove_del').on('click', handleRemoveRow);

	})
}
var initialize = function() {

	if(is_error_reported_on_form_validation === NO_ERROR) {
		// This three will add selectboxes for 3 default countries Europe not EU,European Union and  Everywhere else
		addSelectBoxes();
		addSelectBoxes();
		addSelectBoxes();
		$('#id_form-2-country').trigger('change', ['5']);
		$('#id_form-1-country').trigger('change', ['6']);
		$('#id_form-3-country').trigger('change', ['7']);
	}

	if(is_error_reported_on_form_validation === ERROR_REPORTED) {

		selectboxHandler();
		var count = $(FORMSET_DIV_ID).children().length;
		for(var i = 0; i < count; i++) {
			var ctry = $('#id_form-' + i + '-country').val();
			if(ctry !== '') {
				$('#id_form-' + i + '-country').trigger('change', ctry);
			}
		};

	}
}