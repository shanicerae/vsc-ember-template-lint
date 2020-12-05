const vscode = require("vscode");
const fs = require("fs");
const TemplateLinter = require("ember-template-lint");
var channel, linter;

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
  const config = require(`${rootPath}/.template-lintrc.js`);

  channel = await vscode.window.createOutputChannel("Template Linter");

  linter = new TemplateLinter({ config });

  vscode.workspace.onDidSaveTextDocument((e) => {
    _lintTemplate(e.fileName);
  });

  const templateLintCommand = vscode.commands.registerCommand(
    "vsc-ember-template-lint.lintTemplate",
    () => {
      _lintTemplate();
    }
  );

  const showChannelCommand = vscode.commands.registerCommand(
    "vsc-ember-template-lint.showChannel",
    () => {
      channel.show();
    }
  );

  context.subscriptions.push(templateLintCommand);
  context.subscriptions.push(showChannelCommand);

  channel.appendLine("Template linter is activated.");
}
exports.activate = activate;

function deactivate() {}

async function _lintTemplate(fileName) {
  channel.appendLine("\n");
  channel.appendLine(`[${new Date().toLocaleTimeString()}]`);
  channel.appendLine("Template linter is running...");

  const currentlyOpen = fileName
    ? fileName
    : vscode.window.activeTextEditor.document.fileName;

  const templateFile = fs.readFileSync(currentlyOpen, {
    encoding: "utf8",
  });

  const results = await linter.verify({
    source: templateFile,
    filePath: currentlyOpen,
    moduleId: currentlyOpen,
  });

  if (!results.length) {
    channel.appendLine(`No problems found in ${currentlyOpen}.`);
    return;
  }

  channel.appendLine(
    `${results.length} ${
      results.length === 1 ? "problem" : "problems"
    } found in ${currentlyOpen}.`
  );

  results.forEach((result) => {
    if (result.severity <= 0) {
      return;
    }

    const type = result.severity >= 2 ? "error" : "warning";
    const message = `${result.line}:${result.column} [${type}] ${result.message}. Rule: ${result.rule}`;
    channel.appendLine(message);
  });
}

module.exports = {
  activate,
  deactivate,
};
