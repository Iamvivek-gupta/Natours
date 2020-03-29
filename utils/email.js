const nodemailer = ('nodemailer');

const sendEmail =async options =>{
    // 1) create a Transporter
    const transporter = nodemailer.createTransporter({
             host : process.env.EMAIL_HOST,
             port : process.env.EMAIL_PORT,
             auth : {
                 user : process.env.USER_EMAIL,
                 password : process.env.USER_PASSWORD
             }
    });
    // 2) Define the Mail Options
    const mailOptions ={
        from : 'Vivek Gupta <vivekvivek367@gmail.com>',
        to : options.email,
        subject : options.subject,
        text : options.message
        // html
    };

    // 3) Actually send the Mail
    await transporter.sendMail(mailOptions);
};


module.exports = sendEmail;