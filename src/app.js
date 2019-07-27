require('./config/config');

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const server = require('http').createServer(app);
const io = require('socket.io')(server);


const directorioPublico = path.join(__dirname, '../Public');

const directorioBootstrap = path.join(__dirname, '../node_modules/bootstrap/dist/css');
const directorioJSBootstrap = path.join(__dirname, '../node_modules/bootstrap/dist/js');
const directorioJquery = path.join(__dirname, '../node_modules/jquery/dist');
const directorioPopper = path.join(__dirname, '../node_modules/popper.js/dist');
const directorioJs = path.join(__dirname, '../Public/js');

app.use(express.static(directorioPublico));
app.use('/bootstrap', express.static(directorioBootstrap));
app.use('/bootstrapjs', express.static(directorioJSBootstrap));
app.use('/jquery', express.static(directorioJquery));
app.use('/popper', express.static(directorioPopper));
app.use('/js', express.static(directorioJs));



app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}))


app.use((req, res, next) => {
	if(req.session.usuario){
		res.locals.sesion = true
		res.locals.admin = req.session.admin
		res.locals.docente = req.session.docente
		res.locals.usuario = req.session.usuario
		res.locals.nombre = req.session.nombre
		res.locals.rol = req.session.rol
	}
	next()
})


app.use(bodyParser.urlencoded({extended:false}));
app.use(require('./routes/index'));

const {UsuariosChat} = require('./helpers/usuariosChat');
const usuarios = new UsuariosChat();

const {HistoryChat} = require('./helpers/historyChat');
const history = new HistoryChat();

var userCount = 0;

io.on('connection', client => {
	userCount++;
	
	client.on('usuarioNuevo', (nombreUsuario) =>{
		let listadoUsuarios = usuarios.agregarUsuario(client.id, nombreUsuario);
		console.log(listadoUsuarios)
		io.emit('cambioUsuarios', listadoUsuarios);
		io.emit('numeroUsuarios', listadoUsuarios.length)
		let listadoHistoria = history.obtenerHistoria();
		io.emit('mensaje', (listadoHistoria)); 
	})

	client.on('mensaje', (text, callback) => {
		let usuario = usuarios.obtenerUsuario(client.id);
		let texto = `${usuario[0].nombre} : ${text}`;
		let listadoHistoria = history.agregarHistoria(texto);
		console.log(listadoHistoria.length)
		io.emit('mensaje', (listadoHistoria));
		callback();
	})

	client.on('disconnect', () => {
		let usuarioBorrado = usuarios.eliminarUsuario(client.id);
		let listadoUsuarios = usuarios.obtenerUsuarios();
		io.emit('numeroUsuarios', listadoUsuarios.length)
		io.emit('cambioUsuarios', listadoUsuarios)
	})
});


//'mongodb+srv://admin:admin@jspartout-rmaoq.mongodb.net/JsPartout?retryWrites=true&w=majority'
mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err, result) => {
	if(err)
		return console.log("Error al conectarse");

	console.log("conectado correctamente");
});

server.listen(process.env.PORT, () => { 
	console.log('servidor en el puerto ' + process.env.PORT);
})