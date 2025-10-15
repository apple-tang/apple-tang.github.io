const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'publications', 'awards']


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }

            })
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById(name + '-md').innerHTML = html;
            }).then(() => {
                // MathJax
                MathJax.typeset();
            })
            .catch(error => console.log(error));
    })

    // 访问计数器功能
    function initVisitCounter() {
        const counterElement = document.getElementById('visit-count');
        if (!counterElement) return;
        
        // 使用 CountAPI
        const namespace = 'apple-tang-website'; // 可以改为您的网站名称
        const key = 'main-visit-counter';
        
        fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
            .then(response => response.json())
            .then(data => {
                counterElement.textContent = data.value.toLocaleString();
            })
            .catch(error => {
                console.error('Error with CountAPI:', error);
                // 回退到本地存储
                fallbackToLocalStorage(counterElement);
            });
    }

    function fallbackToLocalStorage(counterElement) {
        let visitCount = localStorage.getItem('visitCount');
        if (visitCount === null) {
            visitCount = 1;
        } else {
            visitCount = parseInt(visitCount) + 1;
        }
        localStorage.setItem('visitCount', visitCount);
        counterElement.textContent = visitCount;
    }

    // 在页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', function() {
        initVisitCounter();
    });
});