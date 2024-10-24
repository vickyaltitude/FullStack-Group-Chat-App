const logInForm = document.getElementById('login-form');

logInForm.addEventListener('submit',async(e)=>{
    e.preventDefault();
    let getEmail = document.getElementById('email').value;
    let getPassword = document.getElementById('password').value;

    try{
          let loginCheck = await fetch('http://localhost:7878/login',{
            method: 'post',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({getEmail,getPassword})
          })

          let parsedResponse = await loginCheck.json();
          console.log(parsedResponse.userId)

          if(loginCheck.status){
             
             console.log(parsedResponse.msg)
             localStorage.setItem('userId',parsedResponse.userId);
             displayMessage(parsedResponse.msg)
            
          }else if(!loginCheck.status){
            console.log(parsedResponse.msg)
            displayMessage(parsedResponse.msg)
          }
    }
    catch(err){
         console.log('something went wrong',err)
         displayMessage('something went wrong')
    }
})


function displayMessage(text) {
    if(text == 'user email not found'){
     let success = document.getElementById('email-error')
     success.style.display = 'block'
     setTimeout(() => {
        success.style.display = 'none'
     }, 3000);
 
    }
    else if(text == 'entered password is incorrect'){
 
     let success = document.getElementById('password-error')
     success.style.display = 'block'
     setTimeout(() => {
        success.style.display = 'none'
     }, 3000);
 
    }else if(text == 'something went wrong'){
     let success = document.getElementById('uncaught-error')
     success.style.display = 'block'
     setTimeout(() => {
        success.style.display = 'none'
     }, 3000);
 
 
    }else{
        let success = document.getElementById('login-success')
     success.style.display = 'block'
     setTimeout(() => {
        success.style.display = 'none'
     }, 3000);
    }
    
 }
 