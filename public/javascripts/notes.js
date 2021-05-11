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



$(function(){ 
    notelist_init();

    // const myInputElements = myForm.querySelectorAll('input')

    // Array.from(myInputElements).forEach(el => {
    // el.addEventListener('change', function (event) {
    //     console.log(event.target.value)
    // })
    // })
}); 


