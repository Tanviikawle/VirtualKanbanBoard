
const nodemailer = require('nodemailer');
 
let mailTransporter =
    nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: 'tanvikawle77@gmail.com',
                pass: '9326154365'
            }
        }
    );
 
let mailDetails = {
    from: 'tanvikawle77@gmail.com',
    to: 'kawletanvi97@gmail.com',
    subject: 'Test mail',
    text: 'Node.js testing mail for GeeksforGeeks'
};
 
mailTransporter
    .sendMail(mailDetails,
        function (err, data) {
            if (err) {
                console.log('Error Occurs');
            } else {
                console.log('Email sent successfully');
            }
        });