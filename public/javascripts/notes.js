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

    // item click
    taglist_v.addEventListener("click",e => {
        TagItemOnClick(e);
    });

    getTags();    

}

async function getTags(){
    let response = await fetch('api/tags/');
    let result = await response.json();
    //alert(result.length);
    buildTheTaglistByTemplate(result);
    return;

}

let $clickedTag;

function TagItemOnClick(e){
    // 0 清除样式
    removeTagActive();
    $clickedTag = e.target;

    // 找到可以改变active样式的父节点
    while(!$clickedTag.classList.contains("tag-item"))
        $clickedTag = $clickedTag.parentNode;
    $clickedTag.classList.add("active");

    // 2 
    getNoteByTag($clickedTag.id);
}

function removeTagActive(){
    // if($clickedTag){
    //     $clickedTag.classList.remove("active");
    // } else{
    let nl = $taglist_container.querySelectorAll('.tag-item');
    for(var i = 0; i < nl.length;i++){
        if(nl[i].classList.contains("active"))
            nl[i].classList.remove("active");
    }        
    // }
};

function resetTagList(){
    removeTagActive();
    rebuildTheNotelist();

}

let $taglist_container;
let tag_chips = {}; // 用来填充 tag chip控件 autocompelete list 

function buildTheTaglistByTemplate(tagjson){
    //console.log("buildTheTaglistByTemplate ");
    $taglist_container = document.querySelector(".ul-tags");
    let listfragment = document.createDocumentFragment();
    let template = document.querySelector("#taglist_item_tp");
    //1 clear list first
    while ($taglist_container.firstChild) $taglist_container.removeChild($taglist_container.firstChild);

    //2 build the new list
    for (var i = 0; i < tagjson.length; i++) {
        const item = template.content.cloneNode(true);
        item.querySelector('.tag-item').setAttribute('id',tagjson[i]._id);
        item.querySelector('.tag').innerHTML = tagjson[i].name;

        item.querySelector('.notecount').innerHTML = tagjson[i].notecount;


        listfragment.appendChild(item);

        //let tag = {tag:tagjson[i].name,image:null};
        tag_chips[tagjson[i].name] = null;
        //tag_chips.push(tag);

    }
    $taglist_container.appendChild(listfragment);
    
}

async function getNoteByTag(tag){
    let response = await fetch('api/notes/t/'+tag); 
    let result = await response.json();
    
    buildTheNotelistByTemplate(result);

}
///# notelist//////////////========================================================================================

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
    getNotes();    

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
    $notelist_container = document.querySelector(".ul-notes");
    let nl = $notelist_container.querySelectorAll('.note-item');
    for(var i = 0; i < nl.length;i++){
        if(nl[i].classList.contains("active"))
            nl[i].classList.remove("active");
    }   
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

    syncNotewithUI();
    // add a note ui item on the top of notelist
    buildSingleNOteByTemplate(activenote);

}

// 将所有 note 的编辑同步到内存 唯一的 activenote， 以便统一更新
// 1 title content的编辑修改
// 2 tags 修改
function syncNotewithUI(){
    //console.log("syncNotewithUI");
    //1 editor
    editor.setValue(activenote.content);

    //2 topic input
    let $notetitle = document.querySelector("#topic");
    $notetitle.value = activenote.title;

    //3 tag chips
    let chips = [];
    activenote.tags.forEach(tag =>{
        chips.push({tag:tag.name})
    })
    tagChip(chips,tag_chips);

    //4 tag list
    syncTaglist(chips);

    //5 note list
    let $notelist_container = document.querySelector("#notelist");
    let nl = $notelist_container.querySelectorAll(".note-item");
    for(var i = 0; i < nl.length;i++){
        if(nl[i].getAttribute("id") == activenote.id)
            nl[i].classList.add("active");
    }

    $notetitle.focus();
    
}

function syncTaglist(chips){
    //console.log("syncTaglist");
    let nl = $taglist_container.querySelectorAll('.tag-item');
    //alert(nl.length);
    for(var i = 0; i < nl.length;i++){
        //clear first
        nl[i].classList.remove("active");
        let tag = nl[i].querySelector('.tag').innerHTML;
        //alert(tag);
        chips.forEach(chip =>{
            if(chip.tag == tag)
                nl[i].classList.add("active");
        })
    }
}

async function search(key){
    let response = await fetch('api/notes/s/'+ key);
    let result = await response.json();

    buildTheNotelistByTemplate(result);
}

async function getOneNote(id){
    let response = await fetch('api/notes/'+ id);
    activenote = await response.json();
    let result = !!activenote;
    
    if(result){
        syncNotewithUI();
    }
    return result;
}

async function getNotes(){
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
        // set the lastest note as activenote on every notelist ui rebuild
        if(i == 0) activenote = notejson[i];

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
let tags;

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

            activenote.createdAt = Date.now();
              
              let response = await fetch('/api/notes/'+activenote.id, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(activenote)
              });
              
              let result = await response.json();
              
              //3 update tag list ui
              // 重新获取taglist 数据
              await getTags(); // getTags 是异步的async函数，调用时必须await，不然逻辑会乱，后面的代码会先执行
              // 
              syncNotewithUI();
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

            activenote.createdAt = Date.now();
            activenote.tags = newtags;
              
              response = await fetch('/api/notes/'+activenote.id, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(activenote)
              });
              
              result = await response.json();

              //3 update tag list ui
              // 重新获取tag 数据
              await getTags(); // getTags 是异步的async函数，调用时必须await，不然逻辑会乱，后面的代码会先执行
              // 
              syncNotewithUI();
        
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
    tagChip([],tag_chips);

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

// setting up the lastest note or new note(for new user)
function setupTheEditingNote(){
    if(activenote){
        syncNotewithUI();
    }else{
        addNew();
    }

}

async function saveNote(e){
      
      let response = await fetch('/api/notes/'+activenote.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(activenote)
      });
      
      let result = await response.json();
      updateSingleNOteByTemplate(result);
      tata.success("ok","保存成功。",{position:"tm"});

}

$(function(){ 
    notelist_init();
    tagslist_init();
    // note pan有控件依赖服务器数据，所以初始化顺序不能随意
    note_init();

    // TODO： notelist tagslist都是异步（因为依赖服务数据），以下功能函数是个不完善实现，最好在两个list完成异步后再执行（现在是同步的），有待使用自定义事件改进
    setTimeout(() => {
        setupTheEditingNote();
    }, 1000);
    
}); 


