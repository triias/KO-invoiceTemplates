const fs = require('fs')
const http = require('http')
const pdf = require('../../')
const path = require('path')
// Available templates
const upFront = fs.readFileSync(require.resolve('../templates/invoiceUpFront.html'), 'utf8')
const instalment = fs.readFileSync(require.resolve('../templates/invoiceInstalment.html'), 'utf8')

// define template to show
const tmpl = process.argv[2] === 'upFront' ? upFront : instalment

console.log('Current Template: ', process.argv[2])
console.log('Options: npm run instalment | npm run upFront')
console.log('path: ', `file://${path.resolve()}/src/templates/style.css`)

const config = {
    base: `file://${path.resolve()}/src/templates/style.css`,
    format: 'A4',
    orientation: 'portrait', // portrait or landscape
    renderDelay: 3000,
    border: {
        top: '40mm', // default is 0, units: mm, cm, in, px
        right: '15mm',
        bottom: '10mm',
        left: '15mm',
    },
}

const server = http.createServer(function (req, res) {
    if (req.url === '/favicon.ico') return res.end('404')
    pdf.create(tmpl, config).toStream((err, stream) => {
        if (err) return res.end(err.stack)
        res.setHeader('Content-type', 'application/pdf')
        stream.pipe(res)
    })
})

server.listen(8080, function (err) {
    if (err) throw err
    console.log('Listening on http://localhost:%s', server.address().port)
})
