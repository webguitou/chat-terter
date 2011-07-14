require.paths.unshift('./node_modules');
var net         = require('net');
var sys 		= require('sys');
var express = require('express'),
app = express.createServer();
var io  = require('socket.io').listen(app);

/*Serveur de fichier*/
app.configure(function(){
	app.use(express.static(__dirname + "/public"));
});

//Socket.io
var room = new Array();
var conversation = new Array();
io.sockets.on('connection', function(client){
	
	room.push(client.id);
	
	client.on('set nick', function(name){
		console.log(name.pseudo);
		client.perso = {pseudo : name.pseudo};
		client.emit('ready');
		console.log(client.perso.pseudo);
			});	
		
	client.on('suite',function(){
		client.emit('welcome', client.perso.pseudo);
		client.broadcast.emit('room', client.perso.pseudo)
	});
	
	
		client.on("chatline", function(data){
			conversation.push(data);
			console.log(data);
			io.sockets.emit("chatline", {'pseudo': client.perso.pseudo, 'text' :data});
			});

	
	//client.emit("poke");
	
	
	
	client.on('disconnect', function(){
		room.splice(room.indexOf(client.id),1);
		client.broadcast.emit("deco",{'deco': client.perso.pseudo});
		console.log('client--déconnecté-----------------------------------------');
	});

});

app.listen(process.env.VMC_APP_PORT|| 1337);
console.log(process.env.VMC_APP_PORT || 1337);