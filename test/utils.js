const path = require("path");
const prompt = require("prompt");
prompt.start();

let wait = (t_ms) => {
  return new Promise((res) => setTimeout(() => res(true), t_ms));
};

const consoleColors = {
  success: "\x1b[30m\x1b[42m%s\x1b[0m",
  error: "\x1b[30m\x1b[41m%s\x1b[0m",
  title: "\x1b[30m\x1b[47m%s\x1b[0m",
};

const successIcon = "\u{2714}";
const failIcon = "\u{2716}";

class Test {
  constructor(file = undefined, message = undefined) {
    let __name = "";
    let __message = "";

    if (file) {
      __name = path.basename(file, ".js");
    }
    if (message) {
      __message = message;
    }

    this.asserts = [];

    this.name = __name;
    this.message = __message;

    this.header();
  }

  header() {
    const title = `Test "${this.name}" start.`;
    console.log("--- ".repeat(20));
    console.log(consoleColors.title, " " + title + " ");
    console.log(consoleColors.title, " " + this.message + " ");
  }

  assert(condition, message = undefined) {
    const __message = message ? message : "";
    this.asserts.push({
      condition: condition,
      message: __message,
    });
  }

  end({ exit = undefined } = {}) {
    const assertsFailed = this.asserts.filter((assert) => !assert.condition);
    if (!assertsFailed.length) {
      console.log(consoleColors.success, `Test passed ${successIcon} `);
      console.log(
        consoleColors.success,
        `${assertsFailed.length}/${this.asserts.length} errors `
      );
      this.asserts.forEach((assert) => {
        console.log(
          consoleColors.success,
          ` - Success: ${assert.message} ${successIcon} `
        );
      });
    } else {
      console.log(consoleColors.error, `Test failed ${failIcon} `);
      console.log(
        consoleColors.error,
        `${assertsFailed.length}/${this.asserts.length} errors `
      );
      assertsFailed.forEach((assert) => {
        console.log(
          consoleColors.error,
          ` - Fail: ${assert.message} ${failIcon} `
        );
      });
    }
    if(exit) {
      process.exit();
    }
  }

}

module.exports = { wait, Test, prompt };
