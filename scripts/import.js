//allows us to import html from another file.

//Source of this script: 
//https://unpkg.com/htmlincludejs@1.0.0/index.js

document.addEventListener("DOMContentLoaded", import1);
//document.addEventListener("readystatechange", import1);


function import1() {
    let imports = document.getElementsByTagName('import');
    for (var i = 0; i < imports.length; i++) {
        let imp = imports[i];
        load_file(imports[i].attributes.src.value, function(text) {
            //console.log(text);
            imp.insertAdjacentHTML('afterend', text);
            //console.log(document.body.innerHTML);
            imp.remove();
        });

        function load_file(filename, callback) {
            fetch(filename).then(response => response.text()).then(text => callback(text));
        }
    }
}