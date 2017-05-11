const net  = require('net');

const DealInfo = {
    clients:{},
    login (receive, socket) {
        console.log(`${receive.name}>${receive.message}`);
        this.clients[receive.name] = socket;
        for(let key in this.clients){
            console.log(key, receive.name)
            if(key != receive.name){
                this.clients[key].write(JSON.stringify(receive));
            }
        }
    },
    server (receive, socket) {
        for(let key in this.clients){
            console.log(key, receive.name)
            if(key != receive.name){
                this.clients[key].write(JSON.stringify(receive));
            }
        }
    },
    client (receive, socket) {
        for(let key in this.clients){
            if(key == receive.to){
                 this.clients[key].write(JSON.stringify(receive));
            }
        }
    }
}
//创建服务端
const server = net.createServer((socket) => {

    //获取当前连接的用户数
    // server.getConnections((err, count) => {
    //     if(err){
    //         throw err;
    //     }
    //     console.log('client connect ' + count);
    // })
    //服务器信息：prot, host, family(IPv4)
    // console.log(socket.address())
    //客户端的ip, family, port, 这里的端口是分配给客户端的端口，随机分配。
    console.log(socket.remoteAddress, socket.remoteFamily, socket.remotePort);
    //暂停socket.pause(),重新开始socket.resume();
    //发送消息成功返回true，失败false
    // let returnInfo = socket.write('welcome come to here\r\n', 'utf8', () => {
        // console.log('send:'+data)
        // console.log(returnInfo)
    // });
    // socket.pipe(socket);

    socket.on('data', (data) => {
        let receive = JSON.parse(data.toString().trim());
        switch(receive.to){
            case "login":
                DealInfo.login(receive, socket);
                break;
            case "server":
                DealInfo.server(receive, socket);
                break;
            default:
                DealInfo.client(receive, socket);
                break;
        }
        
        

    }).on('error', (err) => {
        var deleteKey;
        for (var username in DealInfo.clients) {
            if (DealInfo.clients.hasOwnProperty(username)) {
                var client = DealInfo.clients[username];
                if (socket === client) {
                    deleteKey = username;
                }
            }
        }
        delete DealInfo.clients[deleteKey];
        // DealInfo.clients.splice(DealInfo.clients.indexOf(socket), 1);
        server.getConnections((err, count) => {
            if(err){
                throw err;
            }
            console.log(`${deleteKey}下线了 当前在线人数${count}`);
        })
        
    })

    socket.on('end', () => {
        console.log('client disconnected');
    })
}).on('error', (err) => {
    throw err;
})
server.listen({
    port:4433,
    host:'127.0.0.1'//要想别人访问到，要写服务启动所在机子的ip地址，默认localhost
}, () => {
    console.log('server bound')
})
