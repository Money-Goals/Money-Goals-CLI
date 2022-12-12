#!/usr/bin/env node

const chalk = require("chalk");
let prompt = require("prompt-sync")();
const fetch = require("cross-fetch");
const env = require("dotenv").config();
const cookie = require("cookie");
const { signInUser } = require("../auth-utils");
const { fetchSecrets } = require("../fetch-utils");

async function loadPrompts() {
  console.log(chalk.bold.underline.bgWhite.cyan("Welcome to Money Goals!"));

  const email = prompt("Hello. What is your email? ");

  console.log(chalk.bold.red(`Hello ${email}!`));
  const password = prompt.hide("What is your password? ");
  const cookieInfo = await signInUser(email, password);
  const secrets = await fetchSecrets(cookieInfo);
  console.log(secrets);
}

loadPrompts();

