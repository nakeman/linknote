// this is the _notes_ main UI page back js
// 1 UI may have 1+ v objects to serve IX functon
// 2 every v object have a backend js to :
//      1 render ui
//      2 catch IX event
//      3 access the backend 

// _notes_ page has three UI v objects:
// 1 taglist 2 notelist 3 note


///# taglist//////////////
function tagslist_init(){

    let taglist_v = document.querySelector("#taglist_ul");

    let taglist_nl = taglist_v.querySelectorAll(".ul-tag");

    // item click
    taglist_v.addEventListener("click",e => {
        TagItemOnClick(e);
    });


    // searching
    // let $search_input = document.querySelector("#search");
    // $search_input.addEventListener("keypress", e => {
    //     if(e.keyCode == 13) {
    //         search($search_input.value);
    //     }
    // });
    // $search_input.addEventListener("keyup", e => {
    //     //alert(e.keyCode);
    //     if($search_input.value ==''){
    //         rebuildTheNotelist();
            
    //     }        
    // })
    
    // init

    getTags(100);    

}

function getTags(n){
    

}

function TagItemOnClick(e){

}
///# notelist//////////////

let activenote; // note that active editing



function notelist_init(){

    let notelist_v = document.querySelector("#notelist_ul");

    // item click
    notelist_v.addEventListener("click",e => {
        NoteItemOnClick(e);
    });

    // add new note
    let add_new_btn_v = document.querySelector("#newnote");
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
    
    activenote = await response.json();

    editor.setValue(activenote.content);
    let $notetitle = document.querySelector("#topic");
    $notetitle.focus();
    $notetitle.value = activenote.title;

    // add a note ui item on the top of notelist
    buildSingleNOteByTemplate(activenote);


}

// 将所有 note 的编辑同步到内存 唯一的 activenote， 以便统一更新
// 1 title content的编辑修改
// 2 tags 修改
function syncNotewithUI(){
    
}

async function search(key){
    let response = await fetch('api/notes/s/'+ key);
    let result = await response.json();

    buildTheNotelistByTemplate(result);

}

async function getOneNote(id){
    let response = await fetch('api/notes/'+ id);
    activenote = await response.json();
    editor.setValue(activenote.content);

    let $notetitle = document.querySelector("#topic");
    $notetitle.value = activenote.title;

    // tag chips
    let chips = [];
    activenote.tags.forEach(tag =>{
        chips.push({tag:tag.name})
    })
    tagChip(chips,[]);

    $notetitle.focus();
}

// TODO supply userid 
async function getNotes(n){
    let response = await fetch('api/notes/');
    let result = await response.json();
    
    buildTheNotelistByTemplate(result);
}

async function rebuildTheNotelist(){
    let response = await fetch('api/notes/');
    let result = await response.json();

    buildTheNotelistByTemplate(result)

}

function buildSingleNOteByTemplate(note){
    var $notelist_container = document.querySelector(".ul-notes");
    var listfragment = document.createDocumentFragment();
    let template = document.querySelector("#notelist_item_tp");
    const item = template.content.cloneNode(true);
    item.querySelector('.note-item').setAttribute('id',note._id);
    item.querySelector('.note_title').innerHTML = note.title;
    item.querySelector('.note_createdAt').innerHTML = note.time;

    item.querySelector('.note_desc').innerHTML = note.desc;
    item.querySelector('.day').innerHTML = note.day; 

    listfragment.appendChild(item);
    
    //将新note插入列表的第一个位置
    $notelist_container.insertBefore(listfragment,$notelist_container.firstChild);

    removeActive();
    $clickedEle = $notelist_container.firstChild;
    $clickedEle.classList.add("active");
}

function updateSingleNOteByTemplate(note){
    var $notelist_container = document.querySelector(".ul-notes");
    var updatednote_fg = document.createDocumentFragment();
    let template = document.querySelector("#notelist_item_tp");
    const item = template.content.cloneNode(true);
    // 1 下面替换后 id数字开头不能引用，加一个ID
    item.querySelector('.note-item').setAttribute('id','ID'+ note._id);
    item.querySelector('.note_title').innerHTML = note.title;
    item.querySelector('.note_createdAt').innerHTML = note.time;

    item.querySelector('.note_desc').innerHTML = note.desc;
    item.querySelector('.day').innerHTML = note.day; 

    updatednote_fg.appendChild(item);

    $clickedEle.replaceWith(updatednote_fg);
    $clickedEle = $notelist_container.querySelector("#ID"+note._id);
    $clickedEle.classList.add("active");
    // 2 引用处理完后改回来
    $clickedEle.setAttribute('id',note._id);

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

        item.querySelector('.note_createdAt').innerHTML = notejson[i].time;

        item.querySelector('.note_desc').innerHTML = notejson[i].desc;
        item.querySelector('.day').innerHTML = notejson[i].day;

        listfragment.appendChild(item);
    }
    $notelist_container.appendChild(listfragment);
    
}

///# note//////////////
let editor, savenote_btn_el;
savenote_btn_el = "#savenote";

function tagChip(tagsdata,autocompleteOptions){
    $('.chips-autocomplete').chips({
        placeholder: 'Enter a tag',
        secondaryPlaceholder: '+Tag',
        data:tagsdata,
        autocompleteOptions: {
            data: autocompleteOptions,  //{'Apple': null,'Microsoft': null,'Google': null},
            limit: Infinity,
            minLength: 1
        },
        onChipAdd:async function(e){
            //console.log(e);
            const c = M.Chips.getInstance($('.chips-autocomplete'));
            const cd =c.chipsData;
            const end = cd[cd.length-1];
            //M.toast({html: end.tag});
    
            //1 update tag doc first
            let res = await fetch('/api/tags/',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name:end.tag})
            });
    
            let newtag = await res.json();
    
    
            //2 update note doc on success
    
            activenote.tags.push({id:newtag.id,name:newtag.name});
            //alert(activenote.tags.length);
    
            $notetitle = document.querySelector("#topic");
            let note = {
                title: $notetitle.value,
                content: editor.getValue(),
                createdAt: Date.now(),
                tags:activenote.tags
              };
              
              let response = await fetch('/api/notes/'+activenote.id, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(note)
              });
              
              let result = await response.json();
              
              //3 update tag list ui
        },
        onChipDelete: async (event, chip) => {

            //1 update tag doc first
            let deleltetag = chip.firstChild.data;
            let response = await fetch('/api/tags/n/'+deleltetag, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({})
              });
              
              let result = await response.json();
              
            //2 update note doc on success
            let newtags = activenote.tags.filter( tag => {
                return tag.name != deleltetag;
            });
            //console.log(newtags);
            $notetitle = document.querySelector("#topic");
            let note = {
                title: $notetitle.value,
                content: editor.getValue(),
                createdAt: Date.now(),
                tags:newtags
              };
              
              response = await fetch('/api/notes/'+activenote.id, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(note)
              });
              
              result = await response.json();

              //3 update tag list (result);
        
        }
        });

}

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
    
    editor.on('valuechanged', (e, src) => {
        activenote.content = editor.getValue();
    });

    // init tag chips UI
    tagChip([],[]);
    

    //////save note button
    let savenote_btn_v = document.querySelector(savenote_btn_el);
    savenote_btn_v.addEventListener("click",e =>{
        saveNote(e);
    });

    ///
    let $notetitle = document.querySelector("#topic");
    $notetitle.addEventListener("keyup",e =>{
        activenote.title = $notetitle .value;
    })

}

async function saveNote(e){
    $notetitle = document.querySelector("#topic");
    let note = {
        title: $notetitle.value,
        content: editor.getValue(),
        createdAt: Date.now()
      };
      
      let response = await fetch('/api/notes/'+activenote.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(note)
      });
      
      let result = await response.json();
      updateSingleNOteByTemplate(result);
      alert('ok');


}

$(function(){ 
    notelist_init();
    tagslist_init();
    note_init();
    // const myInputElements = myForm.querySelectorAll('input')

    // Array.from(myInputElements).forEach(el => {
    // el.addEventListener('change', function (event) {
    //     console.log(event.target.value)
    // })
    // })
}); 


