const signupForm = document.getElementById('signup-form');
console.log('javascript')

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('clicked')
    let uName = document.getElementById('name').value;
    let uEmail = document.getElementById('email').value;
    let uPhone = document.getElementById('phone').value;
    let uPassword = document.getElementById('password').value;

    try {
        let sendNewUserDetails = await fetch('http://localhost:7878/insertnewuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uName, uEmail, uPhone, uPassword })
        });

        let responseParsed = await sendNewUserDetails.json();
        console.log(responseParsed);

        if (sendNewUserDetails.ok) {
            if (responseParsed.msg === 'message inserted successfully') {
                displayMessage('User created successfully!');
             
            }
        } else {
            if (responseParsed.msg === 'user already exists') {
                displayMessage('User already exists! Please login.');
                
            }
        }
    } catch (error) {
        console.error('Error:', error);
        displayMessage('An error occurred. Please try again.');
    }
});


function displayMessage(text) {
   if(text == 'User created successfully!'){
    let success = document.getElementById('user-created')
    success.style.display = 'block'
    setTimeout(() => {
       success.style.display = 'none'
    }, 3000);

   }
   else if(text == 'User already exists! Please login.'){

    let success = document.getElementById('user-exists')
    success.style.display = 'block'
    setTimeout(() => {
       success.style.display = 'none'
    }, 3000);

   }else{
    let success = document.getElementById('uncaught-error')
    success.style.display = 'block'
    setTimeout(() => {
       success.style.display = 'none'
    }, 3000);


   }
   
}
