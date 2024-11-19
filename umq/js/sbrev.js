function sendMail(content) {
    (function () {
        emailjs.init("vRIwfJE8T1jc5Kbgs");
    })();

    emailjs.send("service_0kv4wnl", "template_ku4g0dl", {
        to_name: "debarbouyette@gmail.com",
        from_name: "support@ulmed.fr",
        subject: "ulmed feedback",
        message: content,
    })
        .then(function (response) {
            console.log('Email sent successfully:', response);
        }, function (error) {
            console.log('Error sending email:', error);
        });

}
// console.log('SendMail : READY');
// sendMail("The cow jumped over the moon.");