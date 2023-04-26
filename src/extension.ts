// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { posix } from "path";

function parser(content) {
  let data = content;
  if (typeof content === "string") {
    data = JSON.parse(content);
  }
  let target = "import { get, post } from '@/utils/fetch';\n";
  const { paths, definitions } = data;

  Object.entries(paths).forEach(([key, val]) => {
    const { get, post, put, delete: del } = val;
    if (get) {
      const reg = /\{([^()]*)\}/g;
      const param = key.match(reg) || [""];
      console.log(param);
      const { operationId, summary, tags } = get;
      target += `\n
/* 【${tags.toString()}】${summary} */
export const ${operationId} = (${param[0].substring(
        1,
        param[0].length - 1
      )}) => get(\`${key.replace("/{", "/${")}\`)`;
    }
  });

  return target;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "swagger-parser" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  // let disposable = vscode.commands.registerCommand('swagger-parser.helloWorld', () => {
  // 	// The code you place here will be executed every time your command is executed
  // 	// Display a message box to the user
  // 	vscode.window.showInformationMessage('Hello World from swagger-parser!');
  // });

  if (
    !vscode.window.activeTextEditor ||
    posix.extname(vscode.window.activeTextEditor.document.uri.path) !== ".json"
  ) {
    return vscode.window.showInformationMessage("Open a Json file first");
  }

  let disposable = vscode.commands.registerCommand(
    "swagger-parser.generate",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return vscode.window.showInformationMessage("Open a file first");
      }
      const content = editor.document.getText();

      // 处理json数据
      // console.log(JSON.parse(content));
      const target = parser(content);

      const fileUri = editor.document.uri;
      const folderPath = posix.dirname(fileUri.path);
      const folderUri = fileUri.with({ path: folderPath });

      // 目标文件路径
      const targetFileUri = folderUri.with({
        path: posix.join(folderUri.path, "api.js"),
      });
      await vscode.workspace.fs.writeFile(
        targetFileUri,
        Buffer.from(target, "utf8")
      );

      vscode.window.showInformationMessage("Done!");
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
