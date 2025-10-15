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

    // 添加访问计数器功能（使用不蒜子服务）
    function setupVisitorCounter() {
        // 动态加载不蒜子脚本
        const script = document.createElement('script');
        script.async = true;
        script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
        script.onload = function() {
            // 检查不蒜子是否加载成功
            if (window.busuanzi) {
                // 直接使用不蒜子的访问次数
                setTimeout(() => {
                    const visitCount = document.getElementById('visit-count');
                    if (visitCount && window.busuanzi.cookie.get) {
                        const hits = window.busuanzi.cookie.get('busuanzi_visits');
                        visitCount.textContent = hits || '0';
                    }
                }, 500);
            }
        };
        
        // 备用方案：使用本地存储计数（如果不蒜子服务不可用）
        script.onerror = function() {
            console.log('不蒜子服务加载失败，使用本地计数');
            let count = parseInt(localStorage.getItem('visitorCount') || '0');
            count++;
            localStorage.setItem('visitorCount', count.toString());
            document.getElementById('visit-count').textContent = count;
        };
        
        document.head.appendChild(script);
    }
    
    // 调用计数器设置函数
    setupVisitorCounter();
});