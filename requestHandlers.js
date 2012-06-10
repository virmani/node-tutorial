var querystring = require('querystring'),
        fs = require("fs"),
        formidable = require("formidable");

var S3_KEY = '<your key here>';
var S3_SECRET = '<your secret here>';
var S3_BUCKET = '<your bucket here>';

var knox = require('knox').createClient({
    key: S3_KEY,
    secret: S3_SECRET,
    bucket: S3_BUCKET
});

function start(response) {
    console.log("Request handler 'start' was called.");

    var body = '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" ' +
        'content="text/html; charset=UTF-8" />' +
        '</head>' +
        '<body>' +
        '<form action="/upload" enctype="multipart/form-data" ' +
        'method="post">' +
        '<input type="file" name="upload">' +
        '<input type="submit" value="Upload file" />' +
        '</form>' +
        '</body>' +
        '</html>';

    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(body);
    response.end();

}

function upload(response, request) {
    console.log("Request handler 'upload' was called.");
    var form = new formidable.IncomingForm();

    form.parse(request, function (error, fields, files) {
        if (error != null) {
            console.log('Failed to read the form. Error: ' + error);
            response.writeHead(500, { "Content-Type": "text/html" });
            response.write("Failed to upload<br/>");
            response.end();
        }

        try {
            knox.putFile(files.file.path, 'tests/' + files.file.name, { 'Content-Type': 'image/jpeg' },
                function (err, result) {
                    if (200 == result.statusCode) {
                        console.log('Uploaded to Amazon S3');
                        response.writeHead(200, { "Content-Type": "text/html" });
                        response.write("Image Received <br/><br/>");
                        response.write("<img src='https://s3.amazonaws.com/appmania-food-images/sampleFile.png' />");
                        response.end();
                    }
                    else {
                        console.log('Failed to upload file to Amazon S3');
                        response.writeHead(500, { "Content-Type": "text/html" });
                        response.write("Failed to upload<br/>");
                        response.end();
                    }
                });
        } catch (error) {
            console.log('Exception occured while using Knox. Error: ' + error);
            response.writeHead(500, { "Content-Type": "text/html" });
            response.write("Failed to upload<br/>");
            response.end();
        }
    });

}

function show(response, postData) {
    console.log("Request handler 'show' was called.");

    fs.readFile("/tmp/test.png", "binary", function (error, file) {
        if (error) {
            response.writeHead(500, { "Content-Type": "text/plain" });
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, { "Content-Type": "image/png" });
            response.write(file, "binary");
            response.end();
        }
    });
}

exports.start = start;
exports.upload = upload;
exports.show = show;
