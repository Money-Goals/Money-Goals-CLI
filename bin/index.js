#!/usr/bin/env node

const chalk = require("chalk");
let prompt = require("prompt-sync")();
// const inquirer = require("inquirer");

// console.log(inquirer
//   .prompt([
//     "What is your monthly income?"
//   ])
//   .then((answers) => {
//     // Use user feedback for... whatever!!
//   })
//   .catch((error) => {
//     if (error.isTtyError) {
//       // Prompt couldn't be rendered in the current environment
//     } else {
//       // Something else went wrong
//     }
//   }));

console.log(chalk.bold.underline.bgWhite.cyan("Welcome to Money Goals!"));

const email = prompt("Hello. What is your email? ");

console.log(chalk.bold.red(`Hello ${email}!`));

const password = prompt.hide("What is your password? ");

console.log(password);