const fetch = require("cross-fetch");
const cookie = require("cookie");

async function fetchAccounts(cookieInfo) {
    const resp = await fetch(`${process.env.API_URL}/api/v1/accounts`, {
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

async function postAccounts(userAccountInfo, cookieInfo) {
    const resp = await fetch(`${process.env.API_URL}/api/v1/accounts`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: cookie.serialize("session", cookieInfo.session),
      },
      body: JSON.stringify(userAccountInfo),
      credentials: "include",
    });
    const data = await resp.json();
    return data;
}

async function postCC(userCCInfo, cookieInfo) {
    const resp = await fetch(`${process.env.API_URL}/api/v1/cc`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: cookie.serialize("session", cookieInfo.session),
      },
      body: JSON.stringify(userCCInfo),
      credentials: "include",
    });
    const data = await resp.json();
    return data;
}

module.exports = { fetchAccounts, postAccounts, postCC };
