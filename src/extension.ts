// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { posix } from "path";
import { Content, Definitions } from "./types";

function getParams(params: any[], definitions:Definitions) {
  return params?.map(para => {
    if (para.schema && para.schema.$ref) {
      const def = para.schema.$ref.replace('#/definitions/', '');
      const { type, properties, title, description } = definitions[def] || {};
      const prop = Object.entries(properties).map(([k, v]) => {
        return `${k}: ${v.type} ${v.description||''}`;
      }).join('\n * ');
      return prop;
    } else if (para.type) {
      return `${para.name}: ${para.type} ${para.description||''}`;
    }
  }).join('\n * ');
}

function comments(summary: string, tags: string[], parameters: any, definitions: any) {
  return `/* 
 *【${tags.toString()}】${summary} 
 * ${getParams(parameters, definitions)||''}
 */\n`;
}

function parser(content:any) {
  let data:Content = content;
  if (typeof content === "string") {
    data = JSON.parse(content);
  }
  let target = "import { get, post } from '@/utils/fetch';\n";
  const { paths, definitions } = data;

  Object.entries(paths).forEach(([key, val]) => {
    const { get, post, put, delete: del } = val;
    if (get) {
      // https://www.runoob.com/regexp/regexp-syntax.html
      const reg = /(?<=\{)[a-zA-Z0-9]+(?=\})/g;
      const param = key.match(reg);
      const { operationId, summary, tags, parameters } = get;
      target += `\n${comments(summary, tags, parameters, definitions)}export const ${operationId} = (${param || ''}) => get(\`${key.replaceAll("/{", "/${")}\`)\n`;
    } else if (del) {
      // https://www.runoob.com/regexp/regexp-syntax.html
      const reg = /(?<=\{)[a-zA-Z0-9]+(?=\})/g;
      const param = key.match(reg);
      const { operationId, summary, tags, parameters } = del;
      target += `\n${comments(summary, tags, parameters, definitions)}export const ${operationId} = (${param || ''}) => del(\`${key.replaceAll("/{", "/${")}\`)\n`;
    } else if (post) {
      const { operationId, summary, tags, parameters } = post;
      target += `\n${comments(summary, tags, parameters, definitions)}export const ${operationId} = (params) => post('${key}', params)\n`;
    } else if (put) {
      const { operationId, summary, tags, parameters } = put;
      target += `\n${comments(summary, tags, parameters, definitions)}export const ${operationId} = (params) => put('${key}', params)\n`;
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
        path: posix.join(folderUri.path, "services.js"),
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
export function deactivate() { }
