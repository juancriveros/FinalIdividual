const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const usuarioSchema = new Schema({
	documento : {
		type : Number, 
		require : true,
		unique: true 
	},
	nombre : {
		type : String, 
		require : true,
		trim : true
	}, 
	correo : {
		type : String, 
		require : true,
		trim : true
	},
	telefono : {
		type : Number, 
		require : true
	}, 
	rol : {
		type : String,
		default : 'Aspirante'
	},
	password : {
		type : String, 
		require : true
	}, 
	avatar : {
		type : Buffer
	}
})

usuarioSchema.plugin(uniqueValidator, { message: 'Ya existe un usuario con el documento ingresado.' });

const Usuario = mongoose.model('Usuario', usuarioSchema);

let admin = new Usuario ({
	documento: 123456789,
	nombre: 'Juan Riveros',
	telefono: 30578477774,
	correo: 'admin@admin.com',
	rol: 'Coordinador',
	password:  bcrypt.hashSync('admin', 10)
})

let docente = new Usuario ({
	documento: 987654321,
	nombre: 'Andres Velandia',
	telefono: 3068574966,
	correo: 'docente@docente.com',
	rol: 'Docente',
	password:  bcrypt.hashSync('docente', 10)
})

Usuario.findOne({documento : admin.documento}, (err,result) => {
	if(err){
		return console.log(err)
	}


	if(result == null){
		admin.save((err, result) => {
			if(err){
				return console.log(err)
			}

		})
	}

})

Usuario.findOne({documento : docente.documento}, (err,result) => {
	if(err){
		return console.log(err)
	}

	if(result == null){
		docente.save((err, result) => {
			if(err){
				return console.log(err)
			}

		})
	}

})


module.exports = Usuario;