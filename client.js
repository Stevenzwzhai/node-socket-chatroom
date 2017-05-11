const net = require('net')
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
//建立客户端
//设定发送消息固定格式（协议）
const send = {
    name:"",
    message:"",
    to:""
}

rl.question('What is your name >', (name) => {
    if(name){
        const client = net.connect({
            port:4433,
            host:'172.20.131.140'
        }, (data) => {
            console.log('welcome to chatroom 4433!');
            
            client.on('data', (data) => {
                //这里data是一个buffer;
                let receive = JSON.parse(data.toString().trim());
                process.stdout.write(`\n${receive.name}>${receive.message}\n`);
                rl.prompt();
            }).on('error', (err) => {
                console.log('\n服务器断了稍后连接！')
                process.exit(0);
            })

            process.stdin.on('data', (chunck) => {

            })  

            send.name = name.trim();
            send.to = "login";
            send.message = "上线了";
            client.write(JSON.stringify(send));
            rl.setPrompt(`${name.trim()}>`);
            rl.prompt();
            rl.on('line', (line) => {
                let stdinInfo = line.trim().split(':');
                if(stdinInfo.length == 2){
                    send.to = stdinInfo[0];
                    send.message = stdinInfo[1];
                }else{
                    send.to = "server";
                    send.message = stdinInfo[0];
                }
                client.write(JSON.stringify(send));
                rl.prompt();
            }).on('close', () => {
                console.log('outline');
                process.exit(0);
            });   
        })
        
        
    client.on('end', () => {
        console.log('disconnected from server');
    });
    }else{
        process.stdout.write('please input you name\r\n')
    }
});

