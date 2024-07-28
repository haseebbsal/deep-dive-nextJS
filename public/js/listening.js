(function () {
    window.onload = (() => {
        let ip;
        var script = document.createElement('script');
        script.src = "https://unpkg.com/socket.io-client@4.7.5/dist/socket.io.min.js";
        script.onload = async function () {
            var socket = io('http://localhost:4070', { auth: { sessionid:sessionStorage.getItem('deep_dive') ,pageUrl:window.location.href} });
            socket.connect()
            function fetchWithRetry(url) {
                return fetch(url)
                    .then(response => {
                        // Check if the response is okay (status in the range 200-299).
                        // If so, return the response, otherwise throw an error.
                        if (response.ok) {
                            return response;
                        } else {
                            throw new Error('Server response was not ok.');
                        }
                    })
                    .catch(error => {
                        return fetchWithRetry(url); // Retry
                    });
            }
            // Usage
            fetchWithRetry('https://api.ipify.org?format=json')
                .then(response => response.json())
                .then(data => {
                    ip = data.ip
                    console.log('IP',ip) //IpStack for get User Loc,Regions.
                    //test code
                    fetch(`http://ip-api.com/json/${ip}?access_key=5ef9428bfe1631e7872a71a3a0719e50`).then(e=>e.json()).then((e)=>{
                    console.log("City:", e.city)
                    console.log("City:", e.timezone)
                    console.log("City:", e.countryCode)
                    console.log("City:", e.country)
                    const weblink = window.location.href
                        const domain = new URL(weblink).origin
                    console.log(e)
                    socket.emit('reportIP', { ip, city: e.city, continent_name: e.timezone, country_code: e.countryCode, country_name: e.country,domain })
                    let userId = document.querySelector("script[window_extracting='deep-dive-analytics']").getAttribute('data-id')
                    socket.emit('DomainVerification', { userId, domain,sessionid:sessionStorage.getItem('deep_dive'),country:e.country,countrycode:e.countryCode })
                    socket.on('serverDomainVerification', function (message) {
                        console.log('Message from server:', message);
                        verified = message
                        if (message.sessionid) {
                            sessionStorage.setItem('deep_dive', message.sessionid)
                        }
                        
                        if (message.isverified) {
                            const sessionid = sessionStorage.getItem('deep_dive')        
                                document.addEventListener('click', (e) => {
                                    if (e.isTrusted) {
                                        // console.log(e)
                                        console.log(e.target)
                                        let isNavigate;
                                        try {
                                            isNavigate = e.target.closest('a').href
                             
                                            console.log('navigate', isNavigate)
                                            var clickData = { type: 'click', x: e.clientX, y: e.clientY, button: e.button, element: JSON.stringify(e.target.outerHTML), ip, userId, isNavigate, sessionid };
                                            socket.emit('on-click', clickData);
                                            socket.auth.sessionid=sessionid
                                            socket.auth.pageUrl = isNavigate
                                            socket.disconnect().connect();
                                           
                                            
                                        }
                                        catch (e) {
                                          
                                            isNavigate=null
                                        }
                                    }
                                });
                            document.addEventListener('mousemove', (e) => {
                                // console.log(e)
                                // var clickData = { type: 'click', x: e.clientX, y: e.clientY, button: e.button, element: JSON.stringify(e.target.outerHTML), ip, userId, isNavigate, sessionid };
                                    var mouseData = { type: 'mousemove', x: e.clientX, y: e.clientY, element: JSON.stringify(e.target.outerHTML), ip, userId, sessionid };
                                    socket.emit('on-mousemove', mouseData);
                            });

                            window.onscroll = (event) => {
                                var scrollData = { type: 'scroll', x: window.scrollX, y: window.scrollY, ip, userId, sessionid }
                                socket.emit('on-scroll',scrollData)
                            }
                        }
                            else {
                                console.log('It is not in the domains table')
                                socket.emit('AddDomain', { userId, domain })
                        }
                        });
                })
        })
            .catch (error => console.error('Failed after retries:', error));
    };

    document.head.appendChild(script);
})
}) ()