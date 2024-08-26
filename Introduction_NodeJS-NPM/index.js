const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

////////////////////////////////////////////
// *FILES

// ?Blocking, Sync way
// const testIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(testIn)

// const textOut = `This is new things : ${testIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);

// console.log('File Written!');

// ?Nonblocking , async way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//      if (err) return console.log(err)
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2)
//         fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3)

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//                 console.log('Data files written! :)')
//             })
//         })
//     })
// })

// console.log("Will read the file")

////////////////////////////////////////////
// *Server

const tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf-8'
);
const tempCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    'utf-8'
);
const tempProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
    console.log(req.url);

    const { query, pathname } = url.parse(req.url, true);

    // const pathname = req.url;

    // Overview Page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html',
        });

        const cardsHtml = dataObj
            .map((el) => replaceTemplate(tempCard, el))
            .join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

        // res.end(tempOverview);
        // res.end('This is overview');

        // Product Page
    } else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html',
        });

        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

        // res.end("This is product");

        // API Page
    } else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-Type': 'application/json',
        });
        res.end(data);
        // fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
        //     const productData = JSON.parse(data);
        //     // console.log(productData);
        //     res.writeHead(200, { 'Content-Type': 'application/json' });
        //     res.end(data);
        // });

        res.end('This is API');

        // Not Found Page
    } else {
        res.writeHead(404, {
            'Content-type': 'text / html',
            'my-own-header': 'hello-world',
        });
        res.end('<h1 style="color:red">Page not found!</h1>');
    }

    // res.end('Hello from the server!');
});

server.listen(5000, '127.0.0.1', () => {
    console.log('The server starting..');
});
