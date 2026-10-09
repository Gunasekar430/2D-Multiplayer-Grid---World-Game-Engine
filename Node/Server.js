const WebSocket = require("ws");

const wss = new WebSocket.Server({
    port: 8080
});


const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "purple",
    "pink"
];


const PlayerList = [];


wss.on("connection", ws => {

    console.log( "New User Connected:", wss.clients.size );

    const username = "Player" + Math.floor(Math.random() * 1000);

    const row = Math.floor(Math.random() * 12);

    const column = Math.floor(Math.random() * 12);


    const color =  colors[Math.floor(Math.random() * colors.length)];

    const player = {

        username: username,

        row: row,

        column: column,

        color: color
    };


    // ADD PLAYER
    PlayerList.push(player);


    console.log( "Player List:", PlayerList );


    // SEND USERNAME
    
    ws.send(JSON.stringify({

        type: "username",

        username: username

    }));


    // SEND EXISTING PLAYERS

    PlayerList.forEach(p => {

        ws.send(JSON.stringify({

            type: "playerColor",

            username: p.username,

            row: p.row,

            column: p.column,

            color: p.color

        }));

    });


    // SEND NEW PLAYER TO ALL

    wss.clients.forEach(client => {

        if(client.readyState === WebSocket.OPEN) {

            client.send(JSON.stringify({

                type: "playerColor",

                username: player.username,

                row: player.row,

                column: player.column,

                color: player.color

            }));

        }

    });



    ws.on("message", message => {

        const data = JSON.parse(message);

        if(data.type === "move") {


            if(data.direction === "left") {

                player.column--;

            }


            if(data.direction === "right") {

                player.column++;

            }


            if(data.direction === "up") {

                player.row--;

            }


            if(data.direction === "down") {

                player.row++;

            }

            if(player.row < 0) {

                player.row = 0;

            }


            if(player.row > 11) {

                player.row = 11;

            }


            if(player.column < 0) {

                player.column = 0;

            }


            if(player.column > 11) {

                player.column = 11;

            }


            // SEND MOVEMENT TO ALL
            
            wss.clients.forEach(client => {

                if(client.readyState === WebSocket.OPEN) {

                    client.send(JSON.stringify({

                        type: "playerMove",

                        username: player.username,

                        row: player.row,

                        column: player.column,

                        color: player.color

                    }));

                }

            });

        }


        if(data.type === "chat") {

            console.log( player.username,":", data.message );

            wss.clients.forEach(client => {

                if(client.readyState === WebSocket.OPEN) {

                    client.send(JSON.stringify({

                        type: "chat",

                        username: player.username,

                        message: data.message

                    }));

                }

            });

        }

    });

    ws.on("close", () => {

        const index = PlayerList.indexOf(player);


        if(index !== -1) {

            PlayerList.splice(index, 1);

        }

        console.log( "User disconnected:", player.username );

    });

});


console.log(
    "2D Game Engine Running on ws://localhost:8080"
);