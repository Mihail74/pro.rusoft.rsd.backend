module.exports = ({ username, baseURL, check }) => ({
  subject: 'Signup Confirmation',
  content: `
    <html>
      <body>
        <p><b>Welcome to Rusoft Investing Platform!</b></p>
        <p>
          Your username is ${username}. To activate your account, please click on the below link:
        </p>
        <p>
          <a href='${baseURL}/confirm/${check}'>${baseURL}/confirm/${check}</a>
        </p>
        <p>
          Thank you for using RuSoft.pro.
        </p>
        <p>
          <a href='${baseURL}'>RuSoft.pro</a>
        </p>
      </body>
    </html>
  `
})
