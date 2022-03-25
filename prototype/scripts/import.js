//allows us to import html from another file.

//Source of this script: 
// https://unpkg.com/htmlimpjs@1.0.0/index.js

document.addEventListener("DOMContentLoaded", function() {

    let imports = document.getElementsByTagName('import');
    for (var i = 0; i < imports.length; i++) {
        let imp = imports[i];
        load_file(imports[i].attributes.src.value, function(text) {
            imp.insertAdjacentHTML('afterend', text);
            imp.remove();
        });
    }

    function load_file(filename, callback) {
        fetch(filename).then(response => response.text()).then(text => callback(text));
    }
});