
async function SignUp(){
    let email, password;
    email = document.querySelector("#email").value;
    password = document.querySelector("#password").value;
    let user = {email,password};
    
    //alert(JSON.stringify(user));
    let response = await fetch('/users/signup', {
        method: 'POST',
        headers: {
         'Content-Type': 'application/json;charset=utf-8'
         },
        body: JSON.stringify(user)
    });
    
    let result = await response.json();
    //result => {success,message}
    console.log(result);
    if(result.success){
        tata.success("ok",result.message,{position:"tm",onClose:function(){window.location.replace("/users/signin");}});

    }
    else{
        tata.error("NO!",result.message,{position:"tm"});
    }
}

async function SignIn(){
    let email, password;
    email = document.querySelector("#email").value;
    password = document.querySelector("#password").value;
    let user = {email,password};
    
    //alert(JSON.stringify(user));
    let response = await fetch('/users/signin', {
        method: 'POST',
        headers: {
         'Content-Type': 'application/json;charset=utf-8'
         },
        body: JSON.stringify(user)
    });
    
    let result = await response.json();
    //result => {success,message}
    //console.log(result);
    if(result.success){
        tata.success("ok",result.message,{position:"tm",onClose:function(){window.location.replace("/notes");}});

    }
    else{
        tata.error("NO!",result.message,{position:"tm"});
    }
}

// function redirect(url,time){
//     setTimeout(function(){


//     },time)
// }

// tata.text('Hello', 'Have a nice day.', {// config})
// tata.log('Hello', 'Have a nice day.', {// config})
// tata.info('Hello', 'Have a nice day.', {// config})
// tata.success('Hello', 'Have a nice day.', {// config})
// tata.warn('Hello', 'Have a nice day.', {// config})
// tata.error('Hello', 'Have a nice day.', {// config})

// Config
// name 	tpye 	default 	Description
// position 	string 	tr 	tr, tm, tl, mr, mm, ml, bl, bm, br
// duration 	number 	3000 	show haw many time
// progress 	boolean 	true 	dispaly a progress bar
// holding 	boolean 	false 	no disappear
// closeBtn 	boolean 	true 	show close button
// animate 	string 	fade 	fade or slide
// onClick 	function 	null 	callback function on click
// onClose 	function 	null 	callback function on close