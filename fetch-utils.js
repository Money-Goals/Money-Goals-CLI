const fetch = require("cross-fetch");
const cookie = require("cookie");

async function fetchSecrets(cookieInfo) {
    const resp = await fetch("http://localhost:7890/api/v1/users/sessions", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Cookie: cookie.serialize("session", cookieInfo.session)
        },
        credentials: "include",
    });
    const data = await resp.json();
    return data;
}

module.exports = { fetchSecrets };
