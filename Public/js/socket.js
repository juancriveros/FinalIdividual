socket = io({transports: ['websocket'], upgrade: false});
const numeroUsuarios = document.querySelector('#numeroUsuarios');
const listaUsuarios = document.querySelector('#listaUsuarios');
const chatForm = document.querySelector('#chatForm');
const chatText = document.querySelector('#chatText');
const chatMessages = document.querySelector('#chatMessages');
const usuario = document.querySelector('#nombreUsuario').innerHTML.trim();

socket.on("connect", () =>{
	console.log(usuario)
	socket.emit('usuarioNuevo', usuario);
})

socket.on('cambioUsuarios', (listadoUsuarios) => {
	listaUsuarios.innerHTML = '';
	listadoUsuarios.forEach(function(item){
		listaUsuarios.innerHTML = listaUsuarios.innerHTML + item.nombre + '<br>';
	})
	
})

socket.on('numeroUsuarios', (numero) => {
	numeroUsuarios.innerHTML = 'Hay ' + numero + ' usuarios conectados';
})

socket.on('mensaje', (listadoHistoria) => {
	chatMessages.innerHTML = '';
	listadoHistoria.forEach(function(item){
		chatMessages.innerHTML = chatMessages.innerHTML + item + '<br>';
	})
})

chatForm.addEventListener('submit', (datos) => {
	datos.preventDefault();
	socket.emit('mensaje', chatText.value, () => {
		chatText.value = '';
		chatText.focus();
	})
})


