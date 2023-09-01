import express from 'express';

const app = express();
const port = 3012;
app.use(express.static('./public'));
app.listen(port, () => { console.log(`Server for HelloWorld assets listening on http://localhost:${port}`)});
