const users = []

// add user, remove user, getUser, getUsersin room

const addUser = ({id,username,room}) => {
    //clean data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //validate the data
    if(!username || !room)
    {
        return{
            error : "err.. an error seems to have occurred .please check username/room again"
        }
    }

    //check for existing username
    const existingUser = users.find((user)=>{
        return user.name === room && user.username === username
    })

    if(existingUser)
    {
        return{
            error : "Users already present in the room!"
        }
    } 

    const user = {id,username,room}
    users.push(user)
    return { user }
}


const removeUser = (id) =>{
    const index = users.findIndex((user)=>user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0]  //--> users.splice will return an array but we need to remove one user at a time

    }
}

const getUser = (id) =>{
    return users.find((user)=>user.id === id)
}

const getUserinRoom = (room) =>{
    room = room.trim().toLowerCase();
    return users.filter((user)=>user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserinRoom
}