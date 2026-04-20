(function () {
    function loadFragment(url, el, onLoad) {
        fetch(url)
            .then(function (r) { return r.text(); })
            .then(function (html) {
                el.innerHTML = html;
                if (onLoad) onLoad();
            });
    }

    var headerEl = document.querySelector('header');
    if (headerEl) {
        loadFragment('header.html', headerEl, function () {
            var toggle = document.querySelector('.mobile-menu-toggle');
            var menu = document.getElementById('nav-menu');
            if (!toggle || !menu) return;

            toggle.setAttribute('aria-expanded', 'false');
            toggle.addEventListener('click', function () {
                var expanded = menu.classList.toggle('active');
                toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            });

            menu.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', function () {
                    menu.classList.remove('active');
                });
            });

            document.addEventListener('click', function (e) {
                if (!e.target.closest('nav')) {
                    menu.classList.remove('active');
                }
            });
        });
    }

    var footerEl = document.querySelector('footer');
    if (footerEl) {
        loadFragment('footer.html', footerEl);
    }
})();
