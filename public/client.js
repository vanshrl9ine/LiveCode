require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor/min/vs' }});

require(['vs/editor/editor.main'], function() {
    var editor = monaco.editor.create(document.getElementById('editor'), {
        value: [
            'function x() {',
            '\tconsole.log("Hello world!");',
            '}'
        ].join('\n'),
        language: 'javascript',
        theme: 'vs-dark'
    });

    var socket = io();

    editor.onDidChangeModelContent(() => {
        var code = editor.getValue();
        socket.emit('codeChange', code);
    });

    socket.on('codeChange', (code) => {
        if (editor.getValue() !== code) {
            editor.setValue(code);
        }
    });

    const templates = {
        javascript: [
            'function x() {',
            '\tconsole.log("Hello world!");',
            '}'
        ].join('\n'),
        python: [
            'def x():',
            '\tprint("Hello world!")'
        ].join('\n'),
        java: [
            'public class Main {',
            '    public static void main(String[] args) {',
            '        System.out.println("Hello, World!");',
            '    }',
            '}'
        ].join('\n'),
        cpp: [
            '#include <iostream>',
            'using namespace std;',
            'int main() {',
            '    cout << "Hello, World!";',
            '    return 0;',
            '}'
        ].join('\n'),
        html: [
            '<!DOCTYPE html>',
            '<html>',
            '<head>',
            '    <title>Hello World</title>',
            '</head>',
            '<body>',
            '    <h1>Hello, World!</h1>',
            '</body>',
            '</html>'
        ].join('\n'),
        css: [
            'body {',
            '    font-family: Arial, sans-serif;',
            '    background-color: #f0f0f0;',
            '    margin: 0;',
            '    padding: 0;',
            '}',
            'h1 {',
            '    color: #333;',
            '}'
        ].join('\n')
    };

    document.getElementById('language-selector').addEventListener('change', function() {
        var newLanguage = this.value;
        var template = templates[newLanguage] || '';
        monaco.editor.setModelLanguage(editor.getModel(), newLanguage);
        editor.setValue(template);
    });
});
