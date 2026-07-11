import Type from './Type'
import { add_error_E } from './Reports';

class Value {
    type_var = '';
    used = false
    constructor(val, t, te, _row, _column) {
        this.value = val;
        this.type = t;
        this.type_exp = te;
        this.row = _row;
        this.column = _column;
        this.positions = [];
    }

    add_positions(positions) {
        this.positions = positions;
    }

    operate(tab) {
        //const cont = new count();
        if (this.type_exp === Type.VALOR + "") {
            switch (this.type) {
                case Type.ENTERO:
                    return new Value(this.value, this.type, this.type_exp, this.row, this.column);
                case Type.DECIMAL:
                    return new Value(this.value, this.type, this.type_exp, this.row, this.column);
                case Type.DEFAULT:
                    return new Value(this.value, this.type, this.type_exp, this.row, this.column);
                case Type.CADENA:
                    this.value = this.value.replace(/\\n/g, '\n');
                    this.value = this.value.replace(/\\t/g, '\t');
                    this.value = this.value.replace(/\\r/g, '\r');
                    if (this.value.toString().startsWith("\"") || this.value.toString().startsWith("'") || this.value.toString().startsWith("`")) {
                        this.value = this.value.toString().substring(1, this.value.toString().length - 1);
                    }
                    this.value = this.value.toString().replace(/\\\"/g, "\"");
                    return new Value("CO/" + this.value, this.type, this.type_exp, this.row, this.column);
                case Type.BOOL:
                    return new Value("CO/" +this.value, this.type, this.type_exp, this.row, this.column);
                case Type.NULL:
                    return new Value("CO", undefined, Type.VALOR, this.row, this.column);
                case Type.CARACTER:
                    let ret = this.value.replace(/'/g, '');

                    if (String(ret) === "\\n") {
                        return new Value(10, Type.CARACTER, Type.VALOR, this.row, this.column);
                    } else if (ret === "\\r") {
                        return new Value(8, Type.CARACTER, Type.VALOR, this.row, this.column);
                    } else if (ret === "\\t") {
                        return new Value(9, Type.CARACTER, Type.VALOR, this.row, this.column);
                    }
                    return new Value("CO/" +ret.charCodeAt(0), Type.CARACTER, Type.VALOR, this.row, this.column);
                case Type.ID:
                    let a = tab.exists(this.value + "");
                    if (a) {
                        let r = tab.getSymbol(this.value + "");
                        r.column = this.column;
                        r.row = this.row;
                        return r;
                    } else {
                        try { add_error_E({ error: "La variable: " + this.value.toString() + "no a sido encontrada", type: 'SEMANTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); }
                        //olc2_p1.IDE.et.putError(new error.Error(error.Error.TypeError.SEMANTICO, "Variable " + value.toString() + " no encontrada.", row, column));
                        return null;
                    }
                case Type.ARREGLO:
                    let i = 0;
                    let aux_return = null;
                    while (i < this.value.length) {
                        if (i === 0) {
                            let a = tab.exists(this.value[i].value + "");
                            if (a) {
                                let r = tab.getSymbol(this.value[i].value + "");
                                if (r.type === Type.ARREGLO) {
                                    let j = 0;
                                    try {
                                        let rett = this.is_pop_push(i, r);
                                        if (rett !== undefined)
                                            return rett;
                                        let position = this.value[i].positions[j].operate(tab);

                                        //el valor acceder es desconocido pero retornamos valor uknown
                                        aux_return = r.value[position.value];
                                        if(!aux_return)
                                            aux_return = new Value("CO",Type.UNKNOWN,Type.VALOR, position.row, position.column);
                                        
                                        if (aux_return === undefined)
                                            aux_return = r.value[Math.round(position.value)];
                                    } catch (e) { console.log(e); try { add_error_E({ error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); } return null; }
                                    j++;
                                    while (j < this.value[i].positions.length) {
                                        try {
                                            let rett = this.is_pop_push(i, aux_return);
                                            if (rett !== undefined)
                                                return rett;
                                            let position = this.value[i].positions[j].operate(tab);
                                            aux_return = aux_return.value[position.value];
                                            if (aux_return === undefined)
                                                aux_return = r.value[Math.round(position.value)];
                                        } catch (e) { console.log(e); }
                                        j++;
                                    }
                                } else if (r.type !== Type.ENTERO && r.type !== Type.BOOL && r.type !== r.CADENA && r.type !== r.ID)
                                    aux_return = r;
                            } else {
                                try { add_error_E({ error: "La variable: " + this.value.toString() + "no a sido encontrada", type: 'SEMANTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); }
                                return null;
                            }
                        } else {
                            try {
                                let find = false;
                                for (let dat of aux_return.value) {
                                    if (this.value[i].value === dat[0]) {
                                        aux_return = dat[1];
                                        find = true;
                                        break;
                                    }
                                }
                                if (!find) {
                                    try { add_error_E({ error: "El atributo no existe", type: 'SEMANTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); }
                                    return null;
                                }

                                if (this.value[i].type === Type.ARREGLO) {
                                    aux_return = aux_return.value
                                    let j = 0;
                                    try {
                                        let rett = this.is_pop_push(i, aux_return);
                                        if (rett !== undefined)
                                            return rett;
                                        let position = this.value[i].positions[j].operate(tab);
                                        aux_return = aux_return.value[position.value];
                                        if (aux_return === undefined)
                                            aux_return = aux_return.value[Math.round(position.value)];
                                    } catch (e) { console.log(e); try { add_error_E({ error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); } return null; }
                                    j++;
                                    while (j < this.value[i].positions.length) {
                                        try {
                                            let rett = this.is_pop_push(i, aux_return);
                                            if (rett !== undefined)
                                                return rett;
                                            let position = this.value[i].positions[j].operate(tab);
                                            aux_return = aux_return[position.value];
                                            if (aux_return === undefined)
                                                aux_return = aux_return.value[Math.round(position.value)];
                                        } catch (e) { console.log(e); try { add_error_E({ error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); } return null; }
                                        j++;
                                    }
                                }
                            } catch (e) { console.log(e); try { add_error_E({ error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); } return null; }

                        }
                        let rett = this.is_pop_push(i, aux_return);
                        if (rett !== undefined)
                            return rett;
                        i = i + 1;
                    }
                    return new Value(aux_return.value, aux_return.type, aux_return.type_exp, this.row, this.column);
                case Type.OBJETO:
                    return this.assign_recursive_type(this.value, tab);
                case Type.UNKNOWN:
                    return new Value(this.value, this.type, this.type_exp, this.row, this.column);
                default:
                    try { add_error_E({ error: "Tipo " + this.type + " no Valido.", type: 'SEMANTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); }
                    return null;
            }
        } else {

        }
    }

    is_pop_push(i, aux_return) {
        if (i < this.value.length - 1 && this.value[i + 1].value === ".pop()") {
            if (aux_return.type === Type.ARREGLO && aux_return.value.length > 0) {
                let aux = aux_return.value.pop();
                if (aux instanceof Value) {
                    return aux;
                }
            } else {
                try { add_error_E({ error: "La variable no es un arreglo o no tiene elementos", type: 'SEMANTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); }
                return null;
            }
        } else if (i < this.value.length - 1 && this.value[i + 1].value === "length") {
            if (aux_return.type === Type.ARREGLO) {
                return new Value('CO/P', Type.ENTERO, Type.VALOR, this.row, this.column);
            } else {
                try { add_error_E({ error: "La variable no es un arreglo no se puede devolver el tamaño", type: 'SEMANTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); }
                return null;
            }
        }
        else
            return undefined;
    }

    assign_recursive_type(value, tab) {
        let value_return = [];
        if (value === null) {
            return new Value(undefined, undefined, Type.VALOR, this.row, this.column);;
        }
        for (let at of value) {
            let temp = at[1].operate(tab);
            if (temp === null)
                return null;
            value_return.push([at[0], temp]);
        }
        return new Value(value_return, Type.OBJETO, Type.VALOR, this.row, this.column);
    }

}

export default Value;
