const mongoose = require('mongoose');
//var uniqueValidator = require('mongoose-unique-validator');


const Schema = mongoose.Schema;
const cursosDocenteSchema = new Schema({
	docente : {
		type : Number, 
		require : true
	},
	curso : {
		type : Number, 
		require : true
	}
})


//inscritosSchema.plugin(uniqueValidator, { message: 'Ya existe un usuario con el documento ingresado.' });
cursosDocenteSchema.set('autoIndex', false);
const CursosDocente = mongoose.model('CursosDocente', cursosDocenteSchema);


module.exports = CursosDocente;