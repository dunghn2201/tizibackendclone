var users = [];
module.exports = socket=>{
    //admmin
    socket.on("active_product", data=>{
        data.forEach(obj=>{
            var user = users.find(user=>user.about.id==obj.id_user);
            if(user) user.sockets.forEach(id_socket=>{
                socket.to(id_socket).emit("notification", obj);
            });
        });
    });
    // end admin

    socket.on("send_message", data=>{
        var user_receive = users.find(user=>user.about.id==data.id_user2);
        var user_send = users.find(user=>user.about.id==data.id_user1);

        if(user_receive) user_receive.sockets.forEach(id_socket=>{ 
            socket.to(id_socket).emit("receive_message", data);
            socket.to(id_socket).emit("message_page");
        });
        
        if(user_send) user_send.sockets.forEach(id_socket=>{ 
            if(id_socket != socket.id){
                socket.to(id_socket).emit("receive_message", data);
                socket.to(id_socket).emit("message_page");
            }else socket.emit("message_page");
        });
    });
    socket.on("check_online", data=>{
        if(users.findIndex(user=>user.about.id==data.id) >=0 ) socket.emit("online", true);
        else socket.emit("online", false);
    });
    socket.on("user_connect", (data)=>{
        if(data){
            var index = users.findIndex((user=>user.about.id==data.id));
            if(index >= 0){
                var stt = users[index].sockets.findIndex(socket_id => socket_id==socket.id);
                // chống bị trùng id socket
                if(stt == -1) users[index].sockets.push(socket.id);
            }else users.push({ about: data, sockets:[socket.id] });
            
            // truong hop dang ol tu customer -> member
            index = users.findIndex((user=>user.about.id==0));
            if(index >= 0){
                var key = users[index].sockets.findIndex((socket_id=>socket_id==socket.id));
                users[index].sockets.splice(key,1);
                if(users[index].sockets.length==0) users.splice(index,1);
            }
        }else{
            index = users.findIndex((user=>user.about.id==0));
            if(index >= 0){
                var stt = users[index].sockets.findIndex(socket_id => socket_id==socket.id);
                // chống bị trùng id socket
                if(stt == -1) users[index].sockets.push(socket.id);
            }else users.push({ about: {id:0}, sockets:[socket.id] });
        }
        
        socket.broadcast.emit("users_online", users);
        socket.emit("users_online", users);
        
        console.log(`ol: ${users.length} nguoi`);
    });
    socket.on("user_logout", (data)=>{
        var index = users.findIndex((e=>e.about.id==data.id));
        if(index >= 0) {
            var key = users[index].sockets.findIndex(id=>id==socket.id);
            if(key >= 0){
                users[index].sockets.splice(key,1);
                if(users[index].sockets.length==0) users.splice(index,1);
            }
        }

        // khi logout thanh socket vang lai
        index = users.findIndex((e=>e.about.id==0));
        if(index >= 0) users[index].sockets.push(socket.id);
        else users.push({ about: {id:0}, sockets:[socket.id] });
        
        socket.broadcast.emit("users_online", users);
        socket.emit("users_online", users);
        
        console.log(`ol: ${users.length} nguoi`);
    });
    socket.on("disconnect", ()=>{
        for(var i=0; i < users.length; i++){
            var index = users[i].sockets.findIndex(socket_id=>socket_id==socket.id);
            if(index >= 0){
                console.log(users[i].sockets.splice(index,1));
                if(users[i].sockets.length == 0) users.splice(i,1);
                i=users.length;
            }
        }
        console.log(users);
        socket.broadcast.emit("users_online", users);

        console.log(`ol: ${users.length} nguoi`);
    });
}