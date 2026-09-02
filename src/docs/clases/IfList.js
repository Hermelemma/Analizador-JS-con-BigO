import Type from './Type';
import SymbolTable from './SymbolTable';
import Value from './Value';
import Switch from './Switch';
import { add_complex_def, add_complex_def_ins } from './Reports';

class IfList {
	used = false;
	constructor() {
		this.lif = [];
		this.elsebody = [];
		this.type_exp = Type.SENTENCIA;
		this.tabs = [];
	}

	operate(tab) {
		let complex = new Value("CO", Type.IF, Type.VALOR, this.row, this.column);
		this.tabs = [];
		for (let j = 0; j < this.lif.length; j++) {
			let nTab = tab;
			//ejecutamos la condicion para obtener complejidad de salida por condicion del if
			let rr = this.lif[j].exp.operate(nTab);
			complex.value = tab.compare_maxComplex(complex.value, rr.value);

			//primero ejecutamos una vez el body.
			let bComplex = this.execute_elifBody(nTab, j);
			complex.value = tab.compare_maxComplex(complex.value, bComplex.value);
			this.tabs.push(nTab);
			if(j === 0)
				add_complex_def(new Value(bComplex.value, Type.IF, Type.COMPLEX, this.lif[j].row, this.lif[j].column));
			else
				add_complex_def(new Value(bComplex.value, Type.ELSEIF, Type.COMPLEX, this.lif[j].row, this.lif[j].column));
		}
		if (this.elsebody !== null) {
			//ejecutar else body
			let nTab = tab;
			let bComplex = this.execute_elseBody(nTab);
			complex.value = tab.compare_maxComplex(complex.value, bComplex.value);
			this.tabs.push(nTab);
			add_complex_def(new Value(bComplex.value, Type.ELSE, Type.COMPLEX, this.elsebody.row, this.elsebody.column));
		}
		return complex;
	}

	execute_elifBody(tab, j) {
		let s = new SymbolTable(tab);
		let complex = new Value("CO", Type.IF, Type.VALOR, this.row, this.column);
		for (let i = 0; i < this.lif[j].body.length; i++) {
			if (this.lif[j].body[i].type_exp === Type.RETURN) {
				let reE = this.lif[j].body[i].operate(s);
				add_complex_def_ins(this.lif[j].body[i], reE);
				//Calculando complejidad resultante
				complex.value = tab.compare_maxComplex(complex.value, reE.value);
				complex.exit = true;
				return complex;
			} else {
				this.lif[j].body[i].used = this.used;
				let eT = this.lif[j].body[i].operate(s);
				add_complex_def_ins(this.lif[j].body[i], eT);

				//Calculando complejidad resultante
				complex.value = tab.compare_maxComplex(complex.value, eT.value);
				if (this.lif[j].body[i] instanceof IfList || this.lif[j].body[i] instanceof Switch) {
					this.tabs.concat(this.lif[j].body[i].tabs);
					this.lif[j].body[i].tabs = null;
				}

				if (eT.type_exp === Type.BREAK) {
					complex.exit = true;
					return complex;
				} else if (eT.type_exp === Type.CONTINUE) {
					return complex;
				}
			}
		}
		return complex;
	}

	execute_elseBody(tab) {
		let body = this.elsebody.body;
		let s = new SymbolTable(tab);
		let complex = new Value("CO", Type.COMPLEX, Type.VALOR, this.row, this.column);
		for (let i = 0; i < body.length; i++) {
			if (body[i].type_exp === Type.RETURN) {
				let reE = body[i].operate(s);
				add_complex_def_ins(this.elsebody.body[i], reE);
				//Calculando complejidad resultante
				complex.value = tab.compare_maxComplex(complex.value, reE.value);
				complex.exit = true;
				return complex;
			} else {
				body[i].used = this.used;
				let eT = body[i].operate(s);
				add_complex_def_ins(this.elsebody.body[i], eT);
				
				//Calculando complejidad resultantebody
				complex.value = tab.compare_maxComplex(complex.value, eT.value);
				if (this.elsebody.body[i] instanceof IfList || this.elsebody.body[i] instanceof Switch) {
					this.tabs.concat(this.elsebody.body[i].tabs);
					this.elsebody.body[i].tabs = null;
				}

				if (eT.type_exp === Type.BREAK) {
					complex.exit = true;
					return complex;
				} else if (eT.type_exp === Type.CONTINUE) {
					return complex;
				}
			}

		}
		return complex;
	}

}

export default IfList;