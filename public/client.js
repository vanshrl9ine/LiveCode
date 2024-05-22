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
});
