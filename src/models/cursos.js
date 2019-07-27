const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const cursosSchema = new Schema({
	identificador : {
		type : Number, 
		require : true,
		unique: true 
	},
	nombre : {
		type : String, 
		require : true,
		trim : true
	}, 
	descripcion : {
		type : String, 
		require : true,
		trim : true
	},
	valor : {
		type : Number, 
		require : true
	}, 
	modalidad : {
		type : String, 
		trim : true,
		default : ''
	}, 
	intensidad : {
		type : Number,
		default : ''
	}, 
	estado : {
		type : String,
		default : 'Disponible'
	}
})

cursosSchema.plugin(uniqueValidator, { message: 'Ya existe un curso con el id ingresado.' });

const Curso = mongoose.model('Curso', cursosSchema);

module.exports = Curso;