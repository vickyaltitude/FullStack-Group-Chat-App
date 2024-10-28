let userDetails = JSON.parse(localStorage.getItem('userId'));

let showTexts = document.getElementById('chat-texts')
const sendBtn = document.getElementById('send-btn');
let create_form = document.getElementById('create-group-form');
let membersList = document.getElementById('members')
let add_User_grp = document.getElementById('add-user');
let remove_User_grp = document.getElementById('remove-user');
let delete_grp = document.getElementById('delete-group');
let cancel_au = document.getElementById('cancel-btn-au');
let cancel_ru = document.getElementById('cancel-btn-ru')


add_User_grp.addEventListener('click',async ()=>{
    
    let addUsersEle = document.getElementById('add-members-to-group')
    addUsersEle.innerHTML = ''
    document.getElementById('add-user-to-group-form').style.display = 'flex';
    let groups_users = localStorage.getItem('reqgrp');
    let userstoadd = await fetch(`http://localhost:7878/managegroups/userstoadd?gusers=${groups_users}`);

    let usersParsed = await userstoadd.json();

    if(usersParsed.usersToAdd.length){
        for(let i = 0;i<usersParsed.usersToAdd.length;i++){

            let newLabelfu = document.createElement('label')
            newLabelfu.innerHTML = `<input type="checkbox" value="${usersParsed.usersToAdd[i]}"> ${usersParsed.usersToAdd[i]}`
            addUsersEle.appendChild(newLabelfu)
    
          }
    }else{
         let alreadyPresent = document.createElement('h3');
         alreadyPresent.innerText = 'No users to add'
         alreadyPresent.style.color = 'whitesmoke';
         addUsersEle.appendChild(alreadyPresent)
    }

  


})

remove_User_grp.addEventListener('click',async ()=>{

     let remUsersEle = document.getElementById('remove-members-from-group')
    remUsersEle.innerHTML = ''

    document.getElementById('remove-user-from-group-form').style.display = 'flex';
    let groups_users = localStorage.getItem('reqgrp');
    let userstoremove = await fetch(`http://localhost:7878/managegroups/userstoremove?gusers=${groups_users}`);

    let usersremParsed = await userstoremove.json();
    console.log(usersremParsed.usersToRem);

    if(usersremParsed.usersToRem.length){
        for(let i = 0;i<usersremParsed.usersToRem.length;i++){

            let newLabelfu = document.createElement('label')
            newLabelfu.innerHTML = `<input type="checkbox" value="${usersremParsed.usersToRem[i]}"> ${usersremParsed.usersToRem[i]}`
            remUsersEle.appendChild(newLabelfu)
    
          }
    }else{
         let alreadyRem = document.createElement('h3');
         alreadyRem.innerText = 'All users were removed'
         alreadyRem.style.color = 'whitesmoke';
         remUsersEle.appendChild(alreadyRem)
    }
})

delete_grp.addEventListener('click',()=>{
    
})

cancel_au.addEventListener('click',(e)=>{
    e.preventDefault()
    document.getElementById('add-user-to-group-form').style.display = 'none';
})
cancel_ru.addEventListener('click',(e)=>{
    e.preventDefault()
    document.getElementById('remove-user-from-group-form').style.display = 'none';
})

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


async function getGroups(){

    let getGroupsList = await fetch(`http://localhost:7878/chatmessages/getgroupslist`,{
        method: 'get',
        headers:{
            'Content-Type':'application/json',
            'Authorization' : userDetails.toString()
        }
    })

   

    let parsedGroupsList = await getGroupsList.json();
  
    let groupsArr = parsedGroupsList.groups_created.map(group => group.group_name);

    localStorage.setItem('groupsCreated',JSON.stringify(groupsArr));

    let groups_C = JSON.parse(localStorage.getItem('groupsCreated'));
    let crnt_grp = localStorage.getItem('reqgrp');

    if(groups_C.indexOf(crnt_grp) !== -1){
       document.getElementById('manage-group').style.display = 'flex';
    }else{
       document.getElementById('manage-group').style.display = 'none';
    }



}

getGroups();

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
    getGroups();

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

   if(localStorage.getItem('reqgrp') == undefined){
       reqgrp = 'messages'
   }else{
    reqgrp = localStorage.getItem('reqgrp');
   }


    let getFromLocals = localStorage.getItem('dataFromDB');
        if(getFromLocals == undefined){
       
            let getData = await fetch(`http://localhost:7878/chatmessages?reqgrp=${reqgrp}`,{
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
        if(dataFromLocal.data.length){
         
            let lastMsg = dataFromLocal.data[dataFromLocal.data.length-1].id || 0;
        let getData = await fetch(`http://localhost:7878/getlatest?lastMsg=${lastMsg}&reqgrp=${reqgrp}`,{
            method: 'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization' : userDetails.toString()
            }
        })
        let parsedLocal = await getData.json();
        dataFromLocal.user = parsedLocal.id;
        dataFromLocal.uName = parsedLocal.name;

        if(parsedLocal.data.length == 0){

            localStorage.setItem('dataFromDB',JSON.stringify(dataFromLocal));
        }else{
            dataFromLocal.data = [...dataFromLocal.data,...parsedLocal.data]
            localStorage.setItem('dataFromDB',JSON.stringify(dataFromLocal));
        }
     
               fetchData();
        }
        
               
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

},1000)


let btn_check = false;

function showGroups(groups){

    if(btn_check){
        document.getElementById('messages').removeEventListener('click',handleClickGroup);
        const buttonClass = 'grp-btn';
        const buttons = document.querySelectorAll(`.${buttonClass}`);
        buttons.forEach(button => {
            button.removeEventListener('click', handleClickGroup);
          
        });
    }


    let group_head = document.getElementById('grp-lists-show');
    group_head.innerHTML = ''
    let global_btn = document.createElement('button');
    global_btn.type = 'button'
    global_btn.innerText = 'Global room';
    global_btn.className = 'grp-btn';
    global_btn.id = 'messages';
    global_btn.addEventListener('click',handleClickGroup);
    group_head.appendChild(global_btn)

      //console.log(groups.data)
     for(let i = 0;i<groups.data.length;i++){
        let grp_btn = document.createElement('button');
        grp_btn.type = 'button'
        grp_btn.innerText = groups.data[i].group_name;
        grp_btn.className = 'grp-btn'
        grp_btn.id = `${groups.data[i].group_name}`
        grp_btn.addEventListener('click',handleClickGroup);
       
        group_head.appendChild(grp_btn);
        //console.log(a)
     }
     btn_check = true;
}

 function handleClickGroup(e){

     localStorage.setItem('reqgrp',e.target.id);
     localStorage.removeItem('dataFromDB');

     let groups_C = JSON.parse(localStorage.getItem('groupsCreated'));

     if(groups_C.indexOf(e.target.id) !== -1){
        document.getElementById('manage-group').style.display = 'flex';
     }else{
        document.getElementById('manage-group').style.display = 'none';
     }

     getGroups();

 }
 

    function fetchData(){

        let welcomeUser = document.getElementById('userWelcome');
        let grpName = document.getElementById('show-grp-name'); 
        let grpNameLS = localStorage.getItem('reqgrp')
        let getFromLocalst = localStorage.getItem('dataFromDB');
        let dataFromLocal = JSON.parse(getFromLocalst);
        grpName.innerText = `Group Name :  ${grpNameLS == 'messages' ? 'Global' : grpNameLS}`
        welcomeUser.innerText = ` Welcome ${dataFromLocal.uName}`;
        let data = dataFromLocal.data;
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
    let insert_grp = localStorage.getItem('reqgrp')

    let textVal = document.getElementById('texts').value;
    let insertMsg = await fetch(`http://localhost:7878/chathome?insertgrp=${insert_grp}`,{
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




