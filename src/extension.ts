// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { posix } from "path";
import { parser } from "./utils";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "swagger-parser.generate",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (
        !editor ||
        posix.extname(editor.document.uri.path) !== ".json"
      ) {
        return vscode.window.showInformationMessage("请先打开swagger api-docs json文件！");
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
        path: posix.join(folderUri.path, "services.js"),
      });
      await vscode.workspace.fs.writeFile(
        targetFileUri,
        Buffer.from(target, "utf8")
      );

      vscode.window.showInformationMessage("转换完成，新文件保存在与源文件同目录下，请手动移至目标目录～");
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
