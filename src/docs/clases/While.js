import Type from './Type';
import SymbolTable from './SymbolTable';
import Value from './Value';
import IfList from './IfList'
import Switch from './Switch'
import { add_complex_def, add_complex_def_ins } from './Reports';

class While {
    used = false;
    constructor(e, c, _row, _column) {
        this.row = _row;
        this.column = _column;
        this.exp = e;
        this.body = c;
        this.type_exp = Type.SENTENCIA;
    }

    operate(tab) {

        //primero ejecutamos una vez el body.
        let auxtab = tab;
        let tabs = [];
        auxtab.setFalseVars();
        let complex = this.execute_body(auxtab, tabs);

        //ejecutamos la condicion para obtener complejidad de salida por condicion del while
        let complex_method = new Value("CO", Type.COMPLEX, Type.VALOR, this.row, this.column);
        tabs.forEach(tab => {
            tab.setTrueVars();
            if(this.exp.type_exp === Type.VALOR && this.exp.value === true)
                complex_method.value = tab.compare_maxComplex('FA', complex_method.value);
            else
                complex_method.value = tab.compare_maxComplex(this.exp.operate(tab).complex_exp, complex_method.value);
        });

        complex.value = tab.get_product(complex.value, complex_method.value);

        add_complex_def(new Value(complex.value, Type.WHILE, Type.COMPLEX, this.row, this.column));
        return complex;
    }

    execute_body(tab, tabs) {
        tabs.push(tab);
        let s = new SymbolTable(tab);
        let complex = new Value("CO", Type.COMPLEX, Type.VALOR, this.row, this.column);
        for (let i = 0; i < this.body.length; i++) {
            if (this.body[i].type_exp === Type.RETURN) {
                let eT = this.body[i].operate(s);
                complex.value = tab.compare_maxComplex(complex.value, eT.value);
                complex.exit = true;
                add_complex_def_ins(this.body[i], eT);
                return complex;
            }
            this.body[i].used = true;
            let eT = this.body[i].operate(s);

            add_complex_def_ins(this.body[i], eT);
            complex.value = tab.compare_maxComplex(complex.value, eT.value);
            if (this.body[i] instanceof IfList || this.body[i] instanceof Switch) {
                this.body[i].tabs.forEach(tab => tabs.push(tab));;
                this.body[i].tabs = null;
            }

            if (eT !== null && eT.type_exp === Type.BREAK) {
                complex.exit = true;
                return complex;
            } else if (eT !== null && eT.type_exp === Type.CONTINUE) {
                complex.exit = false;
                return complex;
            }
        }
        return complex;
    }
}
export default While;