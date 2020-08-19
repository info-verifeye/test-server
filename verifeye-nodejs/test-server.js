// a test server stub 
const express = require('express');
const bodyParser = require("body-parser");
const fs = require('fs');
const app = express();

// output location of received data - creates new if not existing
const dirUploads = './uploads/';
const portWebhook = 12001;
const enablePreload = false; // add fileload on startup - helps for debugging

app.use(bodyParser.urlencoded({
    extended: true
})); 

// note the overcompensated file size limits
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '100mb'}));

app.all('/*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.post('/webhook', async function (req, res, next) {
    try {
        processWebhookData(req.body);

        res.status(202);
    }
    catch (error) {
        console.error(error);
        res.status(500);
    }
    finally {
        res.end();
    }
})

app.listen(portWebhook);

function logHelperFilename(filename){
    console.log('created file: ' + filename);
    return filename;
}

function processWebhookData(data){
    console.log('Files have been accepted on datetime:');
    console.log(Date());
    console.log();


    if (!fs.existsSync(dirUploads)){
        console.log('upload diroctory not found..');
        fs.mkdirSync(dirUploads);
        console.log('directory created at: ' + dirUploads);
    }

    fs.writeFileSync(logHelperFilename(dirUploads + data.customerUuid + '.json'), JSON.stringify(data, null, 2), 'utf8')

    if(data.frontImage){
        fs.writeFileSync(logHelperFilename(dirUploads + data.customerUuid + '-frontImage.jpeg'), Buffer.from(data.frontImage.replace('data:image/jpeg;base64,', ''), 'base64'));
    }
    
    if(data.backImage){
        fs.writeFileSync(logHelperFilename(dirUploads + data.customerUuid + '-backImage.jpeg'), Buffer.from(data.backImage.replace('data:image/jpeg;base64,', ''), 'base64'));
    }
    
    if(data.addressImage){
        fs.writeFileSync(logHelperFilename(dirUploads + data.customerUuid + '-addressImage.jpeg'), Buffer.from(data.addressImage.replace('data:image/jpeg;base64,', ''), 'base64'));
    }
    
    if(data.selfie){
        fs.writeFileSync(logHelperFilename(dirUploads + data.customerUuid + '-selfie.jpeg'), Buffer.from(data.selfie.replace('data:image/jpeg;base64,', ''), 'base64'));
    }
    
    if(data.customerAudioFile){
        fs.writeFileSync(logHelperFilename(dirUploads + data.customerUuid + '-customerAudioFile.webm'), Buffer.from(data.customerAudioFile.replace('data:audio/webm;base64,', ''), 'base64'));
    }
    
    if(data.agentAudioFile){
        fs.writeFileSync(logHelperFilename(dirUploads + data.customerUuid + '-agentAudioFile.webm'), Buffer.from(data.agentAudioFile.replace('data:audio/webm;base64,', ''), 'base64'));
    }
    
    if(data.customerVideoFile){
        fs.writeFileSync(logHelperFilename(dirUploads + data.customerUuid + '-customerVideoFile.webm'), Buffer.from(data.customerVideoFile.replace('data:video/webm;base64,', ''), 'base64'));
    }
    
    if(data.agentVideoFile){
        fs.writeFileSync(logHelperFilename(dirUploads + data.customerUuid + '-agentVideoFile.webm'), Buffer.from(data.agentVideoFile.replace('data:video/webm;base64,', ''), 'base64'));
    }

    console.log();

}

console.log();
console.log("======== test-server listening to /webhook port:" + portWebhook + " ========");
console.log();

if (enablePreload){
    let outputData = fs.readFileSync(dirUploads + 'output-old.json');
    processWebhookData(JSON.parse(outputData));

}



