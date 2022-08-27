$(function () {

	$('.js-check-all').on('click', function () {

		if ($(this).prop('checked')) {
			$('th input[type="checkbox"]').each(function () {
				$(this).prop('checked', true);
			})
		} else {
			$('th input[type="checkbox"]').each(function () {
				$(this).prop('checked', false);
			})
		}
	});
});

setTimeout(function () {
	$(".loader_bg").fadeToggle();
}, 900);