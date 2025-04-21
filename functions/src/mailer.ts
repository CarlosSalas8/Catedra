const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs/promises");
const {defineString} = require("firebase-functions/params");
const {onInit} = require("firebase-functions/v2/core");
const {log} = require("firebase-functions/logger");

const readHTMLFile = async function(path: string) {
  return await fs.readFile(path, {encoding: "utf-8"});
};

// Define some parameters
const user = defineString("USER_EMAIL");
const pass = defineString("PASSWORD_EMAIL");
const secondaryEmail = defineString("SECONDARY_EMAIL");
const secondaryPass = defineString("SECONDARY_PASSWORD_EMAIL");

const smtpTransport2 = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: secondaryEmail.value(),
    pass: secondaryPass.value(),
  },
});

const smtpTransport1 = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: user.value(),
    pass: pass.value(),
  },
  secure: false,
  tls: {
    ciphers: "SSLv3",
  },
});

let smtpTransport = smtpTransport1;

onInit(() => {
  if (smtpTransport) {
    smtpTransport.close();
  }

  smtpTransport1.verify((err: Error | null, success: true) => {
    if (err) {
      log("Verify: " + err);
      smtpTransport = smtpTransport2;
    } else {
      log("Server is ready to take our messages");
      log("Success: " + success);
    }
  });
});


/**
 * Sends an email with the specified subject and content to the given
 *  recipient(s).
 *
 * @param {string | string[]} to - The recipient email address(es).
 * @param {string} subject - The subject of the email.
 * @param {any} replacements - The data to be used for replacing
 *  placeholders in the email template.
 * @param {boolean} [sendCopy=true] - Whether to send a copy of
 *  the email to additional recipients.
 * @return {Promise<any>} A promise that resolves when the
 *  email has been sent.
 */
export async function sendEmail(
  to: string | string[],
  subject: string,
  replacements: any,
  cc: string[] = [],
) {
  const html = await readHTMLFile(__dirname + "/email.html");

  const template = handlebars.compile(html);

  const htmlToSend = template(replacements);
  const mailOptions: any = {
    from: user.value(),
    to: to,
    subject: subject,
    html: htmlToSend,
  };

  if (cc.length == 0) {
    mailOptions.cc = [user.value(),
      secondaryEmail.value(),
    ];
  } else {
    mailOptions.cc = [
      user.value(),
      // secondaryEmail.value(),
      ...cc,
    ];
    mailOptions.cc = cc;
    // mailOptions.bcc = ['aarivera7@utpl.edu.ec']
  }
  

  return await smtpTransport.sendMail(mailOptions);
}
