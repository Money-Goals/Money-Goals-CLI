#!/usr/bin/env node

const chalk = require("chalk");
let prompt = require("prompt-sync")();

console.log(chalk.bold.underline.bgWhite.cyan("Welcome to Money Goals!"));

const email = prompt("Hello. What is your email? ");

console.log(chalk.bold.red(`Hello ${email}!`));

const password = prompt.hide("What is your password? ");

console.log(password);