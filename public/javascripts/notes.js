// this is the _notes_ main UI page back js
// 1 UI may have 1+ v objects to serve IX functon
// 2 every v object have a backend js to :
//      1 render ui
//      2 catch IX event
//      3 access the backend 

// _notes_ page has three UI v objects:
// 1 taglist 2 notelist 3 note


///# taglist//////////////
///# notelist//////////////
var notelist, notelist_el;
notelist_el = "#notelist"

function notelist_init(){
    notelist_v = document.querySelector(notelist_el);

    notelist = notelist_v.querySelectorAll(".ul-item");

    for(var i=0; i < notelist.length; i++){
        notelist[i].addEventListener("click",e => {
            NoteItemOnClick(e);
        });
    }

}

function NoteItemOnClick(e){
    removeActive();
    e.target.parentNode.classList.add("active");
}

function removeActive(){
    Array.from(notelist).forEach(n => {
        n.classList.remove("active");
    })

}

///# note//////////////

function note_init(){
    // var editor = new Simditor({
    //     textarea: $('#editor')
    //     //optional options
    //   });
    var $preview, editor, mobileToolbar, toolbar;
    Simditor.locale = 'en-US';
    toolbar = ['title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', '|', 'ol', 'ul', 'blockquote', 'code', 'table', '|', 'link', 'hr', '|', 'indent', 'outdent', 'alignment'];
    mobileToolbar = ["bold", "underline", "strikethrough", "color", "ul", "ol"];
    // if (mobilecheck()) {
    //     toolbar = mobileToolbar;
    // }
    editor = new Simditor({
        textarea: $('#editor'),
        toolbarFloat:true,
        placeholder: '这里输入文字...',
        toolbar: toolbar
        
    });
    // $preview = $('#preview');
    // if ($preview.length > 0) {
    // return editor.on('valuechanged', function(e) {
    //     return $preview.html(editor.getValue());
    // });
    // }

    $('.chips-autocomplete').chips({
    placeholder: 'Enter a tag',
    secondaryPlaceholder: '+Tag',
    autocompleteOptions: {
        data: {
        'Apple': null,
        'Microsoft': null,
        'Google': null
        },
        limit: Infinity,
        minLength: 1
    }
    });
}


$(function(){ 
    notelist_init();
    note_init();

    // const myInputElements = myForm.querySelectorAll('input')

    // Array.from(myInputElements).forEach(el => {
    // el.addEventListener('change', function (event) {
    //     console.log(event.target.value)
    // })
    // })
}); 


