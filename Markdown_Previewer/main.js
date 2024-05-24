let preview = document.querySelector("#preview");
let editorValue = document.querySelector("#editor").value;

var markedUpValue = marked(editorValue);

function previewText() {

    preview.innerHTML = markedUpValue;
}
