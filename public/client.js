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
        
        
    };

    document.getElementById('language-selector').addEventListener('change', function() {
        var newLanguage = this.value;
        var template = templates[newLanguage] || '';
        monaco.editor.setModelLanguage(editor.getModel(), newLanguage);
        editor.setValue(template);
    });

    document.getElementById('run-button').addEventListener('click', function() {
        var code = editor.getValue();
        var input = document.getElementById('input').value;
        var language = document.getElementById('language-selector').value;
        
        fetch('/run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: code,
                input: input,
                language: language
            })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('output').value = data.output;
        });
    });
});
