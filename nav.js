// Mobile menu toggle - shared by every page so the navigation behaves the same everywhere
document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    function setOpen(open) {
        nav.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', open);
        toggle.querySelector('.menu-icon').innerHTML = open ? '&#10005;' : '&#9776;';
    }

    toggle.addEventListener('click', function () {
        setOpen(!nav.classList.contains('open'));
    });

    // close the menu after choosing a link, or when the screen grows past mobile size
    nav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { setOpen(false); });
    });
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) setOpen(false);
    });
});
