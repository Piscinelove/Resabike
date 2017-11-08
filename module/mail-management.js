
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
            from: email,
            to: 'jesuisuneputaindepoubelle@gmail.com',
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

function sendConfirmationEmail(firstname, lastname, group, departure, exit, date, bikes, token, email, valid) {
    return new Promise(function (resolve, reject) {

        console.log(firstname+" "+lastname+" "+group+" "+departure+" "+exit+" "+date+" "+token+" "+email);

        var table = '<p><b>Firstname : </b>'+firstname+'</p>' +
                    '<p><b>Lastname : </b>'+lastname+'</p>' +
                    '<p><b>Group : </b>'+group+'</p>' +
                    '<p><b>Departure : </b>'+departure+'</p>' +
                    '<p><b>Exit : </b>'+exit+'</p>' +
                    '<p><b>Date : </b>'+date+'</p>' +
                    '<p><b>Nombre de vélos : </b>'+bikes+'</p>';

        var message = '';
        if(valid)
            message += '<p>Pour annuler votre réservation, merci de la faire à l\'adresse suivante : http://wwww.localhost:3000/delete='+token+'</p>' +
                '<p>Cordialement RESABIKE</p>';
        else
            message += '<p>Malheureusement le nombre de places maximum pour ce trajet a été atteint.</p>' +
                '<p>Une validation par un de nos administrateurs est nécessaire. Un email de confirmation ou de refus vous sera envoyé dans les plus brefs délais</p>' +
                '<p>Nous nous excusons pour le désagrément</p>' +
                '<p>Si vous désirez annuler votre réservation, merci de la faire à l\'adresse suivante : http://wwww.localhost:3000/delete='+token+'</p>' +
                '<p>Cordialement RESABIKE</p>';

        var mailOptions = {
            from: 'jesuisuneputaindepoubelle@gmail.com',
            to: email,
            subject: 'Confirmation de réservation',
            html: '<p>Bonjour '+firstname+' '+lastname+',</p>' +
                  '<p>Nous vous remercions pour la réservation suivante : </p>' +
                  '<p>'+table+'</p>' + message
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                reject(error);

            } else {
                console.log('Email sent: ' + info.response);
                resolve("Confirmation mail sent");
            }
        });
    })
}

module.exports.sendContactEmail = sendContactEmail;
module.exports.sendConfirmationEmail = sendConfirmationEmail;