import * as vscode from 'vscode';

let decorationType: vscode.TextEditorDecorationType | null = null;

export function activate(context: vscode.ExtensionContext) {
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            highlightTODOs(editor);
        };
    });

    vscode.workspace.onDidChangeTextDocument(event => {
        const editor = vscode.window.activeTextEditor;
        if (editor && event.document === editor.document) {
            highlightTODOs(editor);
        };
    });

    if (vscode.window.activeTextEditor) {
        highlightTODOs(vscode.window.activeTextEditor);
    };
}

function highlightTODOs(editor: vscode.TextEditor) {
    if (!editor) {
        return;
    };

    if (decorationType) {
        decorationType.dispose();
    };

    decorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255, 165, 0, 0.5)',
        borderRadius: '3px',
        overviewRulerColor: 'orange',
        overviewRulerLane: vscode.OverviewRulerLane.Right
    });

    const text = editor.document.getText();
    const todoDecorations: vscode.DecorationOptions[] = [];
    const todoRegex = /\bTODO\b/g;

    let match;
    while ((match = todoRegex.exec(text)) !== null) {
        const startPos = editor.document.positionAt(match.index);
        const endPos = editor.document.positionAt(match.index + match[0].length);

        if (editor.document.lineAt(startPos.line).text.includes("TODO")) {
            todoDecorations.push({ range: new vscode.Range(startPos, endPos) });
        };
    };

    editor.setDecorations(decorationType, todoDecorations);
}

export function deactivate() {
    if (decorationType) {
        decorationType.dispose();
    };
}