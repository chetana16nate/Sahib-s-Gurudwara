const https = require('https');
https.get('https://sahibgurudwara.com/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // extract fonts
        const fonts = data.match(/family=([^&'"]+)/g) || [];
        console.log('Fonts:', [...new Set(fonts)]);
        // extract background colors
        const bgColors = data.match(/background(?:-color)?:\s*(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)|[a-zA-Z]+)/g) || [];
        console.log('Styles:', [...new Set(bgColors)].slice(0, 20));
        // Check if there are any linked CSS files
        const links = data.match(/href="([^"]+\.css[^"]*)"/g) || [];
        console.log('Links:', links);
    });
}).on('error', err => console.error(err));
