const socket = io();
//elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button'); 
const $messages = document.querySelector('#messages');

//templates
const messageTemplates = document.querySelector('#message-template').innerHTML 
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML


const { username,room } = Qs.parse(location.search,{ignoreQueryPrefix: true})

const autoscroll = () =>{
    $messages.scrollTop = $messages.scrollHeight   //autoscroll
}
    

socket.on('message',(message)=>{
    console.log(message);
    const htmlRender = Mustache.render(messageTemplates,{
        username:message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', htmlRender)
    autoscroll()

})

socket.on('locationMessage',(URLmessage)=>{
    console.log(URLmessage);
    const htmlRender = Mustache.render(locationTemplate,{
        username: URLmessage.username ,
        url:URLmessage.url,
        createdAt :  moment(URLmessage.createdAt).format('h:mm a')

    })
    $messages.insertAdjacentHTML('beforeend', htmlRender) //
    autoscroll()
})

socket.on('roomData',({room,users})=>{
    const htmlRender = Mustache.render(sidebarTemplate,{
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML = htmlRender
})

$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled'); //disabling "send" button when message is being sent 

    const message = e.target.elements.message.value

    socket.emit('SendMessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled'); //after message is sent enabling "send" button to send more messages
        $messageFormInput.value = ''
        $messageFormInput.focus()

    }) 
})

document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation)
    {
        return alert('Geolocation not supported by current browser.')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        
        socket.emit('SendLocation',{ 
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        })
    })

})

socket.emit('join',{ username,room },(error)=>{
    if(error)
    {
        alert(error)
        location.href = '/'
    }
})