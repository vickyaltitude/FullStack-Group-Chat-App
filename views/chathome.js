let userDetails = JSON.parse(localStorage.getItem('userId'));

let showTexts = document.getElementById('chat-texts')
const sendBtn = document.getElementById('send-btn');
let create_form = document.getElementById('create-group-form');
let membersList = document.getElementById('members')

async function getusersList(){

    membersList.innerHTML = '';

    let getUsersName = await fetch(`http://localhost:7878/chatmessages/getusers`,{
        method: 'get',
        headers:{
            'Content-Type':'application/json',
            'Authorization' : userDetails.toString()
        }
    })
    
    let parsedUname = await getUsersName.json()
        
    let uName = parsedUname.data
    
       
      for(let i = 0;i<uName.length;i++){

        let newLabel = document.createElement('label')
        newLabel.innerHTML = `<input type="checkbox" value="${uName[i].name}"> ${uName[i].name}`
        membersList.appendChild(newLabel)

      }

 }

getusersList();

create_form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let getGrpName = document.getElementById('group-name').value;
    document.getElementById('create-group-form').style.display = 'none';


    const checkedCheckboxes = document.querySelectorAll('#members input[type="checkbox"]:checked');
    const selectedMembers = Array.from(checkedCheckboxes).map(checkbox => checkbox.value);
    document.querySelectorAll('#members input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.getElementById('group-name').value = ''

    let getData = await fetch('http://localhost:7878/newgroup', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': userDetails.toString()
        },
        body: JSON.stringify({ getGrpName, selectedMembers })
    });

    let parsedresp = await getData.json();

   if(!getData.status){
            let duplicate_grp = document.getElementById('duplicate-msg');
            duplicate_grp.style.display = 'block';

            setTimeout(()=>{
                duplicate_grp.style.display = 'none';
            },2000)
   }


});


document.getElementById('crt-grp-btn').addEventListener('click', function() {
    document.getElementById('create-group-form').style.display = 'flex';
});


document.getElementById('cancel-btn').addEventListener('click', function() {
    document.getElementById('create-group-form').style.display = 'none';
    document.querySelectorAll('#members input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.getElementById('group-name').value = ''
});


setInterval(async()=>{


    let getFromLocals = localStorage.getItem('dataFromDB');
        if(getFromLocals == undefined){
    
            let getData = await fetch('http://localhost:7878/chatmessages',{
                method: 'get',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization' : userDetails.toString()
                }
            })
            
            let parsed = await getData.json();
            localStorage.setItem('dataFromDB',JSON.stringify(parsed));
            
                fetchData()
              
        
    
    }else{
        let dataFromLocal = JSON.parse(getFromLocals);
        let lastMsg = dataFromLocal.data[dataFromLocal.data.length-1].id;
        let getData = await fetch(`http://localhost:7878/getlatest/${lastMsg}`,{
            method: 'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization' : userDetails.toString()
            }
        })
        let parsedLocal = await getData.json();
        dataFromLocal.user = parsedLocal.id;
        if(parsedLocal.data.length == 0){

            
            localStorage.setItem('dataFromDB',JSON.stringify(dataFromLocal));
        }else{
            dataFromLocal.data = [...dataFromLocal.data,...parsedLocal.data]
            localStorage.setItem('dataFromDB',JSON.stringify(dataFromLocal));
        }
       
               fetchData();
               
    }

    
    let grp_prsnt = await fetch('http://localhost:7878/chatmessages/groupsin',{

        method: 'get',
        headers:{
            'Content-Type':'application/json',
            'Authorization' : userDetails.toString()
        }
    })

      let parsed_grp_details = await grp_prsnt.json();
      showGroups(parsed_grp_details);

},500)


function showGroups(groups){


    let group_head = document.getElementById('grp-lists-show');
    group_head.innerHTML = ''

      //console.log(groups.data)
     for(let i = 0;i<groups.data.length;i++){
        let a = document.createElement('a');
        a.innerText = groups.data[i].group_name;
        a.href = `/get/${groups.data[i].group_name}`
        group_head.appendChild(a);
        //console.log(a)
     }
    
}

 

    function fetchData(){
    
        showTexts.innerHTML = '';
        let getFromLocalst = localStorage.getItem('dataFromDB');
        let dataFromLocal = JSON.parse(getFromLocalst);
        let data = dataFromLocal.data;
        
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
            userName.innerText = data[i].user_id === dataFromLocal.user ? `${data[i].name}(you)` : data[i].name;
            userName.style.fontWeight = data[i].user_id === dataFromLocal.user ? 'bold' : 'normal';
            userName.style.color = '#555'; 
            
            let userMsg = document.createElement('span');
            userMsg.innerText = data[i].message;
            userMsg.style.color = '#333'; 
    
    
    
            let msgDate = document.createElement('span')
            let dateFormat = new Date(data[i].created_date)
            msgDate.innerText = dateFormat.toLocaleString('en-US', { month: '2-digit',day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: true });
            msgDate.style.fontSize = '0.8rem';
            msgDate.style.display = 'block';
            
            p.appendChild(userName);
            p.appendChild(document.createTextNode(' : ')); 
            p.appendChild(userMsg);
            p.appendChild(msgDate);
            
            
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



