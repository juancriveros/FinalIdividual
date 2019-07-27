class UsuariosChat {

	constructor(){
		this.usuarios = [];
	}

	agregarUsuario(id, nombre){
		let usuario = {id, nombre}
		console.log(this.usuarios)
		if(this.obtenerUsuario(id).length == 0){
			console.log('agregado')
			this.usuarios.push(usuario);
		}
		return this.usuarios;
	}

	obtenerUsuarios(){
		return this.usuarios;
	}

	obtenerUsuario(id){
		let usuarioFiltrado = this.usuarios.filter(user => user.id == id);
		return usuarioFiltrado;
	}

	eliminarUsuario(id){
		let usuarioBorrado = this.obtenerUsuario(id);
		this.usuarios = this.usuarios.filter(user => user.id != id);
		return usuarioBorrado;
	}


}

module.exports = {
	UsuariosChat
}