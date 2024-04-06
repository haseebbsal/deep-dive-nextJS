(function () {
    window.onload = (() => {
        let ip;
        var script = document.createElement('script');
        script.src = "https://cdn.socket.io/4.4.1/socket.io.min.js";
        script.onload = async function () {
            var socket = io('http://localhost:4070');
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
                    socket.emit('reportIP', { ip, city: e.city, continent_name: e.timezone, country_code: e.countryCode, country_name: e.country })
                    let userId = document.querySelector("script[window_extracting='deep-dive-analytics']").getAttribute('data-id')
                        const weblink = window.location.href
                        const domain=new URL(weblink).host
                    socket.emit('DomainVerification', { userId, domain })
                    socket.on('serverDomainVerification', function (message) {
                            console.log('Message from server:', message);
                            verified = message
                            if (message) {
                                document.addEventListener('click', (e) => {
                                    if (e.isTrusted) {
                                        console.log(e)
                                        console.log(e.target)
                                        console.log(ip)
                                        var clickData = { type: 'click', x: e.clientX, y: e.clientY, button: e.button, element: JSON.stringify(e.target.outerHTML), ip, userId };
                                        socket.emit('on-click', clickData);
                                    }
                                });
                                // mouse movement
                                document.addEventListener('mousemove', (e) => {
                                    var mouseData = { type: 'mousemove', x: e.clientX, y: e.clientY, element: JSON.stringify(e.target.outerHTML), ip, userId };
                                    socket.emit('on-mousemove', mouseData);
                                });
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