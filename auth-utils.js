const fetch = require("cross-fetch");
const cookie = require("cookie");
const chalk = require("chalk");


async function signInUser(email, password) {
    const resp = await fetch(`http://localhost:7890/api/v1/users/sessions`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    console.log(resp.headers.raw());
    const cookieInfo = cookie.parse(resp.headers.raw()["set-cookie"][0]);
    console.log(chalk.bold.green(cookieInfo.session));
    const data = await resp.json();
    return cookieInfo;
  }

module.exports = { signInUser };
