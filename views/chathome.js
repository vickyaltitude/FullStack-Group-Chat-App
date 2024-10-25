let userDetails = JSON.parse(localStorage.getItem('userId'));
let showTexts = document.getElementById('chat-texts')
const sendBtn = document.getElementById('send-btn');

setInterval(async () => {
    let getData = await fetch('http://localhost:7878/chatmessages',{
        method: 'get',
        headers:{
            'Content-Type':'application/json',
            'Authorization' : userDetails.toString()
        }
    })
    
    let parsed = await getData.json();
    let dataMsg = parsed.data
    console.log(parsed)
    fetchData(parsed,dataMsg)
}, 500);
 

function fetchData(parsedresp,data){
    
    showTexts.innerHTML = '';

    for (let i = 0; i < data.length; i++) {
        let p = document.createElement('p');
        
        p.style.padding = '10px';
        p.style.borderRadius = '8px';
        p.style.margin = '5px 0';
        p.style.fontSize = '1.4rem';
        p.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
        p.style.transition = 'background-color 0.3s ease';
        
        p.style.backgroundColor = i % 2 === 0 ? '#eaeaea' : '#f9f9f9';
        
        let userName = document.createElement('span');
        userName.innerText = data[i].id === parsedresp.user ? `${data[i].name}(you)` : data[i].name;
        userName.style.fontWeight = data[i].id === parsedresp.user ? 'bolder' : 'normal';
        userName.style.color = '#555'; 
        
        let userMsg = document.createElement('span');
        userMsg.innerText = data[i].message;
        userMsg.style.color = '#333'; 
        
        
        p.appendChild(userName);
        p.appendChild(document.createTextNode(' : ')); 
        p.appendChild(userMsg);
        
        
        showTexts.appendChild(p);
    }
    
}




sendBtn.addEventListener('click',async (e)=>{

    e.preventDefault();

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
  
})