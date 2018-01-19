module.exports = ({ baseURL, check }) => ({
  subject: 'Password Recovery',
  content: `
    <html>
      <body>
        <p><b>Hi,</b></p>
        <p>
          You recently notified us that you forgot your Ople Password and want to
          regain access to your account. To do so, click on the below link:
        </p>
        <p>
          <a href='${baseURL}/recover/${check}'>${baseURL}/recover/${check}</a>
        </p>
        <p>
          Please note that Ople.ai has no access to your account and can't reset
          your password.
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
