module.exports = ({ username, baseURL, check }) => ({
  subject: 'Signup Confirmation',
  content: `
    <html>
      <body>
        <p><b>Welcome to Ople.ai!</b></p>
        <p>
          Your username is ${username}. To activate your account, please click on the below link:
        </p>
        <p>
          <a href='${baseURL}/confirm/${check}'>${baseURL}/confirm/${check}</a>
        </p>
        <p>
          Thank you for using Ople.ai.
        </p>
        <p>
          <a href='${baseURL}'>Ople.ai</a><br/>
          Fundamentally changing Data Science.
        </p>
      </body>
    </html>
  `
})
