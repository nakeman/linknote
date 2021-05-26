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
let 
notelist_nl, // nodelist
notelist_el,addNewbtn_el, // node tag 
$notetitle; // node


notelist_el = "#notelist";
addNewbtn_el = "#newnote";

function notelist_init(){
    //let notelist_v = document.querySelector("#notelist_div");
    let notelist_v = document.querySelector("#notelist_ul");

    notelist_nl = notelist_v.querySelectorAll(".ul-note");

    // item click
    notelist_v.addEventListener("click",e => {
        NoteItemOnClick(e);
    },false);

    // add new note
    let add_new_btn_v = document.querySelector(addNewbtn_el);
    add_new_btn_v.addEventListener("click",e =>{
        addNew(e);
    });

    // searching
    let $search_input = document.querySelector("#search");
    $search_input.addEventListener("keypress", e => {
        if(e.keyCode == 13) {
            search($search_input.value);
        }
    });
    $search_input.addEventListener("keyup", e => {
        //alert(e.keyCode);
        if($search_input.value ==''){
            rebuildTheNotelist();
            
        }        
    })
    
    // init
    getNotes(100);    

}

let $clickedEle;

function NoteItemOnClick(e){
    // 0 清除样式
    removeActive();
    $clickedEle = e.target;

    while(!$clickedEle.classList.contains("note-item"))
        $clickedEle = $clickedEle.parentNode;

    //alert($clickedEle.id);
    $clickedEle.classList.add("active");

    // 2 
    getOneNote($clickedEle.id);
}

function removeActive(){
    if($clickedEle)
        $clickedEle.classList.remove("active");
}

async function addNew(e){
    //alert(e.length);
    let note = {
        title: Date.now(),
        content: 'this a new note'
      };
      
    let response = await fetch('/api/notes/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(note)
    });
    
    let result = await response.json();

    editor.setValue(result.content);
    $notetitle = document.querySelector("#topic");
    $notetitle.focus();
    $notetitle.value = result.title;
    noteid = result._id;


}

async function search(key){
    let response = await fetch('api/notes/s/'+ key);
    let result = await response.json();
    //document.write(result);
    buildTheNotelistByTemplate(result);

}

async function getOneNote(id){
    let response = await fetch('api/notes/'+ id);
    let result = await response.json();
    editor.setValue(result.content);
    //alert(editor.getValue());
    $notetitle = document.querySelector("#topic");
    $notetitle.value = result.title;
    $notetitle.focus();
    noteid = result._id;
}

// TODO supply userid 
async function getNotes(n){
    let response = await fetch('api/notes/');
    let result = await response.json();
    
    buildTheNotelistByTemplate2(result);
}

async function rebuildTheNotelist(){
    let response = await fetch('api/notes/');
    let result = await response.json();

    buildTheNotelistByTemplate2(result)

}


function buildTheNotelistByTemplate(notejson){
    var $notelist_container = document.querySelector(".ul-notes");
    var listfragment = document.createDocumentFragment();
    let template = document.querySelector("#notelist_item_tp");
    //1 clear list first
    while ($notelist_container.firstChild) $notelist_container.removeChild($notelist_container.firstChild);

    //2 build the new list
    for (var i = 0; i < notejson.length; i++) {
        const item = template.content.cloneNode(true);
        item.querySelector('.note-item').setAttribute('id',notejson[i]._id);
        item.querySelector('.note_title').innerHTML = notejson[i].title;
        //alert(item.querySelector('.note_createdAt'));
        item.querySelector('.note_createdAt').innerHTML = notejson[i].time;
        //alert(notejson[i].desc);
        item.querySelector('.note_desc').innerHTML = notejson[i].desc;
        item.querySelector('.day').innerHTML = notejson[i].day;

        listfragment.appendChild(item);
    }
    $notelist_container.appendChild(listfragment);
    
}

///# note//////////////
let editor, savenote_btn_el;
let noteid;
savenote_btn_el = "#savenote";

function note_init(){

    var $preview, mobileToolbar, toolbar;
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

    //////save note button
    let savenote_btn_v = document.querySelector(savenote_btn_el);
    savenote_btn_v.addEventListener("click",e =>{
        saveNote(e);
    });
}

async function saveNote(e){
    $notetitle = document.querySelector("#topic");
    let note = {
        title: $notetitle.value,
        content: editor.getValue()
      };
      
      let response = await fetch('/api/notes/'+noteid, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(note)
      });
      
      let result = await response.json();
      alert(result.result);


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


