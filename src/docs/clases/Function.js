import { add_complex_func, add_complex_def_ins, add_running_function, remove_running_function } from './Reports';
import Value from './Value';
import Type from './Type';
import SymbolTable from './SymbolTable';
class Function {

    constructor(_type, _type_exp, _id, _param, _body, _row, _col) {
        this.type = _type;
        this.type_exp = _type_exp;
        this.id = _id;
        if (_param === null) {
            this.param = []
        } else {
            this.param = _param;
        }
        this.body = _body;
        this.row = _row;
        this.column = _col;
        this.symbolTab = null;
        this.complex = new Value("CO", Type.COMPLEX, Type.VALOR, this.row, this.column);
        this.executed = false;
    }

    operate(tab) {
        // Agregamos la funcion en ejecución
        add_running_function(this.id);
        let s = new SymbolTable(tab);

        //guardamos el nombre de la funcion a ejecutar

        for (let i = 0; i < this.param.length; i++) {
            this.param[i].operate(s);
        }

        for (let i = 0; i < this.body.length; i++) {
            if (this.body[i].type_exp === Type.RETURN) {

                let reE = this.body[i].operate(s);
                this.complex.value = tab.compare_maxComplex(this.complex.value, reE.value);
                this.complex.exit = true;
                add_complex_def_ins(this.body[i], reE);
                this.type = reE.type;
                break;
            }
            let eT = this.body[i].operate(s);
            add_complex_def_ins(this.body[i], eT);

            this.complex.value = tab.compare_maxComplex(this.complex.value, eT.value);
        }
        add_complex_func(this.id, new Value(this.complex.value, Type.FUNCTION, Type.COMPLEX, this.row, this.column));
        remove_running_function();
        this.executed = true;
        return null;
    }
}

export default Function;