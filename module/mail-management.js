
const nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jesuisuneputaindepoubelle@gmail.com',
        pass: 'groscaca'
    }
});



function sendContactEmail(name, email, message) {
    return new Promise(function (resolve, reject) {

        var mailOptions = {
            from: 'jesuisuneputaindepoubelle@gmail.com',
            to: email,
            subject: 'Sending Email using Node.js',
            text: message
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                reject(error);

            } else {
                console.log('Email sent: ' + info.response);
                resolve("Contact mail sent");
            }
        });
    })
}
