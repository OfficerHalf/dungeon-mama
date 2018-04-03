const tags = [ // eslint-disable-line
    '@',
    '^',
    '#',
    '$',
    '!',
    '%',
    '*',
    '-',
    '§'
];
let logs = [];
const timeout = 400;
let highlightTimeout = null;
let pellContent = '';


const logContainer = document.querySelector('#all-entries');

function showLogs() {
    logContainer.innerHTML = '';
    logs.forEach((logObj) => {
        const timestamp = document.createElement('span');
        timestamp.innerHTML = logObj.timestamp;
        timestamp.classList.add('timestamp');
        const log = document.createElement('div');
        log.classList.add('highlight', 'log-entry');
        log.innerHTML = logObj.log;
        log.appendChild(timestamp);
        logContainer.appendChild(log);
    });
}

function highlight() {
    console.log('Highlighting');
}

function handlePellInput(html) {
    pellContent = html;
    if (highlightTimeout !== null) {
        window.clearTimeout(highlightTimeout);
    }
    highlightTimeout = window.setTimeout(highlight, timeout);
}

/* Create pell element */
pell.init({
    // <HTMLElement>, required
    element: document.getElementById('note-input'),

    // <Function>, required
    // Use the output html, triggered by element's `oninput` event
    onChange: handlePellInput,

    // <string>, optional, default = 'div'
    // Instructs the editor which element to inject via the return key
    defaultParagraphSeparator: 'div',

    // <boolean>, optional, default = false
    // Outputs <span style="font-weight: bold;"></span> instead of <b></b>
    styleWithCSS: false,

    // <Array[string | Object]>, string if overwriting, object if customizing/creating
    // action.name<string> (only required if overwriting)
    // action.icon<string> (optional if overwriting, required if custom action)
    // action.title<string> (optional)
    // action.result<Function> (required)
    // Specif the actions you specifically want (in order)
    actions: [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'quote',
        'olist',
        'ulist'
    ],

    // classes<Array[string]> (optional)
    // Choose your custom class names
    classes: {
        actionbar: 'pell-actionbar',
        button: 'pell-button',
        content: 'pell-content',
        selected: 'pell-button-selected'
    }
});

const editorContent = document.querySelector('.pell-content'); // the contenteditable div that is pell
editorContent.classList.add('highlight');

/* Hook up tag buttons */
function addTagToSelection() {
    const tagChar = this.firstChild.textContent;
    let sel;
    let range;
    if (window.getSelection) {
        sel = window.getSelection();
        // we don't care about the button click if the focus isn't inside the editor. return.
        if (!editorContent.contains(sel.anchorNode) || !editorContent.contains(sel.focusNode)) {
            return;
        }
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.insertNode(document.createTextNode(tagChar));
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            range.text = tagChar;
        }
        if (range) {
            range.collapse();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
}

const tagButtons = Array.from(document.querySelectorAll('.tagbtn'));
tagButtons.forEach((btn) => {
    btn.addEventListener('click', addTagToSelection);
});

function saveLog() {
    if (pellContent === '') {
        return;
    }
    logs.unshift({
        timestamp: getTimestamp(),
        log: pellContent
    });
    editorContent.innerHTML = '';
    pellContent = '';
    showLogs();
}

function exportLog() {
    const download = document.createElement('a');
    download.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(logs))}`);
    download.setAttribute('download', getTimestampFilename());
    download.style.display = 'none';
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
}

function importLog() { // eslint-disable-line
    const upload = document.querySelector('#importFile');
    if (upload.files && upload.files.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
            logs = JSON.parse(e.target.result);
            showLogs();
            upload.value = '';
        };
        reader.readAsText(upload.files[0]);
    }
}

const saveButton = document.querySelector('#savebtn-main');
const importButton = document.querySelector('#import-logs');
const exportButton = document.querySelector('#export-logs');
saveButton.addEventListener('click', saveLog);
importButton.addEventListener('click', () => {
    const upload = document.querySelector('#importFile');
    upload.click();
});
exportButton.addEventListener('click', exportLog);
