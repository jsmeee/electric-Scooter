/* Category sidebar: accordion + product filtering */
(function () {
    'use strict';

    var GROUP_NAMES = {
        all: 'All Product',
        'new': 'New Arrival',
        bestseller: 'Best Seller',
        discount: 'On Discount'
    };

    var groups   = document.querySelectorAll('.cat-group');
    var toggles  = document.querySelectorAll('.cat-toggle');
    var links    = document.querySelectorAll('.cat-link');
    var sections = document.querySelectorAll('.category-block');
    var cards    = document.querySelectorAll('.product-card');
    var resultEl = document.getElementById('result-count');

    var state = { group: 'all', series: 'all' };

    function cardMatchesGroup(card, group) {
        if (group === 'all') { return true; }
        return (card.getAttribute('data-tags') || '').split(' ').indexOf(group) !== -1;
    }

    function countFor(group, seriesId) {
        var n = 0;
        cards.forEach(function (card) {
            var sec = card.closest('.category-block');
            if ((seriesId === 'all' || sec.id === seriesId) && cardMatchesGroup(card, group)) { n++; }
        });
        return n;
    }

    /* Fill in the numbers shown in the sidebar */
    function renderCounts() {
        toggles.forEach(function (btn) {
            btn.querySelector('.cat-badge').textContent = countFor(btn.dataset.group, 'all');
        });
        links.forEach(function (btn) {
            btn.querySelector('.cat-count').textContent = countFor(btn.dataset.group, btn.dataset.series);
        });
    }

    /* Show/hide sections + cards, update sidebar highlight */
    function applyFilter() {
        var visibleTotal = 0;

        sections.forEach(function (sec) {
            var seriesOk = state.series === 'all' || sec.id === state.series;
            var visibleInSection = 0;

            sec.querySelectorAll('.product-card').forEach(function (card) {
                var show = seriesOk && cardMatchesGroup(card, state.group);
                card.hidden = !show;
                if (show) { visibleInSection++; }
            });

            sec.hidden = visibleInSection === 0;
            visibleTotal += visibleInSection;
        });

        links.forEach(function (btn) {
            var active = btn.dataset.group === state.group && btn.dataset.series === state.series;
            btn.classList.toggle('active', active);
            if (active) { btn.setAttribute('aria-current', 'true'); }
            else { btn.removeAttribute('aria-current'); }
        });

        groups.forEach(function (g) {
            var gid = g.querySelector('.cat-toggle').dataset.group;
            g.classList.toggle('active', gid === state.group);
        });

        if (resultEl) {
            resultEl.textContent = 'Showing ' + visibleTotal + ' product' + (visibleTotal === 1 ? '' : 's') +
                ' in ' + GROUP_NAMES[state.group] +
                (state.series !== 'all'
                    ? ' \u203A ' + document.querySelector('#' + state.series + ' .category-heading')
                          .textContent.replace(/^\d+\.\s*/, '')
                    : '');
        }
    }

    function setOpen(group, open) {
        var btn = group.querySelector('.cat-toggle');
        group.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    /* Group header: expand/collapse and apply that group's filter */
    toggles.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var group = btn.closest('.cat-group');
            var willOpen = !group.classList.contains('open');

            /* accordion: close the others */
            groups.forEach(function (g) { if (g !== group) { setOpen(g, false); } });
            setOpen(group, willOpen);

            if (willOpen) {
                state.group = btn.dataset.group;
                state.series = 'all';
                applyFilter();
            }
        });
    });

    /* Sub item: filter by group + series */
    links.forEach(function (btn) {
        btn.addEventListener('click', function () {
            state.group = btn.dataset.group;
            state.series = btn.dataset.series;
            applyFilter();
            var sec = document.getElementById(state.series);
            if (sec) { sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });


    /* Open straight to a series if the URL has e.g. categories.html#cargo-delivery */
    var hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash) && document.getElementById(hash).classList.contains('category-block')) {
        state.series = hash;
    }

    renderCounts();
    applyFilter();
})();