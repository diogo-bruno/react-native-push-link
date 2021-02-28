console.log(`
██████╗ ██╗   ██╗███████╗██╗  ██╗    ██╗     ██╗███╗   ██╗██╗  ██╗
██╔══██╗██║   ██║██╔════╝██║  ██║    ██║     ██║████╗  ██║██║ ██╔╝
██████╔╝██║   ██║███████╗███████║    ██║     ██║██╔██╗ ██║█████╔╝ 
██╔═══╝ ██║   ██║╚════██║██╔══██║    ██║     ██║██║╚██╗██║██╔═██╗ 
██║     ╚██████╔╝███████║██║  ██║    ███████╗██║██║ ╚████║██║  ██╗
╚═╝      ╚═════╝ ╚══════╝╚═╝  ╚═╝    ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝

`);

var colorsConsole = {
  reset: '\x1b[0m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

module.exports.print = (color, msg, consoleLines) => {
  if (msg) {
    if (!color) color = 'reset';
    let color_ = typeof color === 'string' ? colorsConsole[color] : colorsConsole.reset;
    if (!color_) color_ = colorsConsole.reset;
    console.log(color_, msg);
  }
  if (parseInt(color)) {
    consoleLines = parseInt(color);
  }
  if (consoleLines) {
    for (let index = 0; index < consoleLines; index++) {
      console.log(colorsConsole['reset'], '');
    }
  }
};

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};
