const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require ('./config.json');
const ytdl = require("ytdl-core");
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.login(token);
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); 

const PREFIX = 'S!';

var servers = {};

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();
client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('Pokemon Sun')
});
//////////////messages eanglish
client.on('message', message => {
if(message.author.bot) return;
if (message.content.includes('Hi') ||
message.content.includes('Hi!') ||
message.content.includes('hi!') ||
message.content.includes('hello') ||
message.content.includes('hello!') ||
message.content.includes('Hello') ||
message.content.includes('Hello')) {
message.channel.send('Hello!');
}
else if (message.content === 'hi') {
message.channel.send('Hello!')
}
else if (message.content.includes('bye') ||
message.content.includes('bye!') ||
message.content.includes('Bye!') ||
message.content.includes('Bye')) {
message.channel.send('See you later!');
}
else if(message.content.includes('Alola!') ||
message.content.includes('alola!')) {
message.channel.send('Alola!')
}
else if(message.content.includes('Solgaleo I choose you!')) {
message.channel.send('Ready for battle!');
}
else if(message.content.includes('How are you today?')) {
message.channel.send('Im good today.How about you?')
}
else if(message.content.includes('Good Job') ||
message.content.includes('Good job') ||
message.content.includes('good Job')) {
message.channel.send('Thanks')
}
else if(message.content === 'I love you Solgaleo') {
message.channel.send('Love you too! :heart:')
}
/////////////messages spanish
else if (message.content.includes('Hola') ||
message.content.includes('hola') ||
message.content.includes('Hola!') ||
message.content.includes('hola!')) {
message.channel.send('Hola que tal?')
}
else if(message.content.includes('Adios!') ||
message.content.includes('adios') ||
message.content.includes('Adios!') ||
message.content.includes('adios!')) {
message.channel.send('Hasta pronto!')
}
else if(message.content.includes('Como estas?')) {
message.channel.send('Yo bien y tu?')
}
else if(message.content === 'Solgaleo te elijo a ti!') {
messages.channel.send('listos para el combate')
}
});
/////////////Command handler
client.on('message', message => {
if (!message.content.startsWith(prefix) || message.author.bot) return;

const args = message.content.slice(prefix.length).split(/ +/);
const commandName = args.shift().toLowerCase();

const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

if (!command) return;

if (command.guildOnly && message.channel.type !== 'text') {
	return message.reply('I can\'t execute that command inside DMs!');
}
if (command.args && !args.length) {
	let reply = `You didnt say any arguments,${message.author}!`;

	if (command.usage) {
		reply += `\nthe porper usage would be: \`${prefix}${command.name} ${command.usage}\``;
	}

	return message.channel.send(reply);
}
if (!cooldowns.has(command.name)) {
	cooldowns.set(command.name, new Discord.Collection());
}

const now = Date.now();
const timestamps = cooldowns.get(command.name);
const cooldownAmount = (command.cooldown || 3) * 1000;

if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
	    const timeLeft = (expirationTime - now) / 1000;
		return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
	}	
}
timestamps.set(message.author.id, now);
setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
try {
	command.execute(message, args)
} catch (error) {
	console.error(error);
	message.reply('there was an error trying to execute that command!'); 
} 
});
//////////Grettings English
client.on('ready', () => {
});
// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
// Send the message to a designated channel on a server:
const channel = member.guild.channels.find(ch => ch.name === 'welcome');
// Do nothing if the channel wasn't found on this server
if (!channel) return;
// Send the message, mentioning the member
channel.send(`Welcome to the server, ${member} please read the rules before posting!We hope you enjoy your stay :smiley:`);
});
//////////Grettings Español
client.on('ready', () => {
});
// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
// Send the message to a designated channel on a server:
const channel = member.guild.channels.find(ch => ch.name === 'bienvenidos');
// Do nothing if the channel wasn't found on this server
if (!channel) return;
// Send the message, mentioning the member
channel.send(`Bienvenidos al servidor, ${member} Esperemos que disfrutes de tu estancia y recuerda ser respetuoso con los demas :D(Por q si no te elimino)`);
});
/////////////music
client.on('message', message => {
let args = message.content.substring(PREFIX.length).split(" ");

switch(args[0]){ 
	case 'play':
	   
	   function play(connection, message){
		   var server = servers[message.guild.id];

		   server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

			server.queue.shift();

			server.dispatcher.on("end", function(){
				if(server.queue[0]){
					play(connection, message);
				} else {
					connection.disconnect();
				}
			});

	   }

		if(!args[1]){
			message.channel.send("you need to provide a link!");
			return;
		 } 
		
		if(!message.member.voiceChannel){
			message.channel.send("you need to be in a voice channel!");
			return;
		}
	   
		if(!servers[message.guild.id]) servers[message.guild.id] = {
			queue: []
		}
		
		var server = servers[message.guild.id];

		server.queue.push(args[1]);

		if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
			play(connection, message);
		message.channel.send("The song was queued!");
		})

	   break;

	   case 'skip':
		var server = servers[message.guild.id];
		if(server.dispatcher) server.dispatcher.end();
			message.channel.send("Skipping the song!")
		break;

		case 'stop':
			var server = servers[message.guild.id];
			 if(message.guild.voiceConnection){
				 for(var i = server.queue.length -1; i >=0; i--){
					 server.queue.splice(i, 1);
				 }
				 
				 server.dispatcher.end();
				 message.channel.send("Ending the queue and leaving the voice channel!")
				 console.log('stopped the queue')
			 }

			 if(message.guild.connection) message.guild.voiceConnection.disconnect();
		break;
}
});