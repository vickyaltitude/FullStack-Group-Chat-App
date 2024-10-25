let userDetails = JSON.parse(localStorage.getItem('userId'));
let showTexts = document.getElementById('chat-texts')
const sendBtn = document.getElementById('send-btn');


async function fetchData(){
    let getData = await fetch('http://localhost:7878/chatmessages',{
        method: 'get',
        headers:{
            'Content-Type':'application/json',
            'Authorization' : userDetails.toString()
        }
    })

    let parsedresp = await getData.json();
    let dataMsg = parsedresp.data
    console.log(parsedresp)

    for (let i = 0; i < dataMsg.length; i++) {
        let p = document.createElement('p');
        
        p.style.padding = '10px';
        p.style.borderRadius = '8px';
        p.style.margin = '5px 0';
        p.style.fontSize = '1.4rem';
        p.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
        p.style.transition = 'background-color 0.3s ease';
        
        p.style.backgroundColor = i % 2 === 0 ? '#eaeaea' : '#f9f9f9';
        
        let userName = document.createElement('span');
        userName.innerText = dataMsg[i].id === parsedresp.user ? `${dataMsg[i].name}(you)` : dataMsg[i].name;
        userName.style.fontWeight = dataMsg[i].id === parsedresp.user ? 'bolder' : 'normal';
        userName.style.color = '#555'; 
        
        let userMsg = document.createElement('span');
        userMsg.innerText = dataMsg[i].message;
        userMsg.style.color = '#333'; 
        
        
        p.appendChild(userName);
        p.appendChild(document.createTextNode(' : ')); 
        p.appendChild(userMsg);
        
        
        showTexts.appendChild(p);
    }
    
}

fetchData()


sendBtn.addEventListener('click',async ()=>{

    let textVal = document.getElementById('texts').value;
       console.log(userDetails)
    let insertMsg = await fetch('http://localhost:7878/chathome',{
        method: 'post',
        headers:{
            'Content-Type':'application/json',
            'Authorization' : userDetails.toString()
        },
        body: JSON.stringify({msg:textVal})
    })


    let parsedReceived = await insertMsg.json();
    console.log(parsedReceived)
   
    document.getElementById('texts').value = '';
    if(insertMsg.state){
        window.location.reload();
    }
})