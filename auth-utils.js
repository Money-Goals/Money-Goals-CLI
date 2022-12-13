const fetch = require("cross-fetch");
const cookie = require("cookie");
const chalk = require("chalk");


async function signInUser(email, password) {
    const resp = await fetch(`${process.env.API_URL}/api/v1/users/sessions`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    const data = await resp.json();
    if(!resp.ok) {
      throw new Error(data.message);
    }
    const cookieInfo = cookie.parse(resp.headers.raw()["set-cookie"][0]);
    // console.log(chalk.bold.green(cookieInfo.session));
    return cookieInfo;
  }

module.exports = { signInUser };
