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

// Listen for click event on button
document.getElementById("back-to-top-btn").addEventListener("click", function () {
	// Scroll to the top of the page using smooth scrolling
	window.scrollTo({
		top: 0,
		behavior: "smooth"
	});
});

// Listen for scroll event
window.addEventListener("scroll", function () {
	// If the user has scrolled more than 20px
	if (window.pageYOffset > 20) {
		// Show the button
		document.getElementById("back-to-top-btn").style.display = "block";
	} else {
		// Hide the button
		document.getElementById("back-to-top-btn").style.display = "none";
	}
});