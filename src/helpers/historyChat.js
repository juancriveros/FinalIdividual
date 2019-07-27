class HistoryChat {

	constructor(){
		this.historia = [];
	}

	agregarHistoria(texto){
		this.historia.push(texto);
		let tamano = this.historia.length;
		if(this.historia.length > 100){
			this.historia = this.historia.slice(tamano-100, tamano);
		}

		return this.historia
	}

	obtenerHistoria(){
		let tamano = this.historia.length;
		if(this.historia.length > 100){
			this.historia = this.historia.slice(tamano-100, tamano);
		}

		return this.historia
	}
}

module.exports = {
	HistoryChat
}