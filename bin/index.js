#!/usr/bin/env node

const chalk = require("chalk");
let prompt = require("prompt-sync")();
const fetch = require("cross-fetch");
const cookie = require("cookie");

require("dotenv").config();

const { signInUser } = require("../auth-utils");
const { fetchAccounts } = require("../fetch-utils");

async function loadPrompts() {
  console.log(chalk.bold.underline.bgWhite.cyan("Welcome to Money Goals!"));

  let validUser = false;
  let cookieInfo;
  while(!validUser){
      const email = prompt("Hello. What is your email? ");
      console.log(chalk.bold.red(`Hello ${email}!`));
      const password = prompt.hide("What is your password? ");
    try {
        cookieInfo = await signInUser(email, password);
        validUser = true;
    } catch (e) {
        console.log(chalk.bold.red(e.message));
    }
  }
  const secrets = await fetchAccounts(cookieInfo);
  console.log(secrets);
}

loadPrompts();

