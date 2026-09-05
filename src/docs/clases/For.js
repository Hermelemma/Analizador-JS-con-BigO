import Type from './Type';
import SymbolTable from './SymbolTable';
import Assignment from './Assignment';
import Value from './Value';
import IfList from './IfList'
import Switch from './Switch'
import { add_complex_def, add_complex_def_ins } from './Reports';
class For {
    constructor(_declaration, _exp, _assignment, _body, _row, _col) {
        this.declaration = _declaration;
        this.exp = _exp;
        this.assignment = _assignment;
        this.body = _body;
        this.row = _row;
        this.column = _col;
        this.type_exp = Type.SENTENCIA;
    }

    operate(tab) {
        let s = new SymbolTable(tab);
        let auxtab = s;
        auxtab.setFalseVars();
        let complex = new Value("CO", Type.FOR, Type.VALOR, this.row, this.column);
        let tabs = [];

        if(this.declaration != null)
            this.declaration.operate(auxtab)
        if(this.assignment != null)
            this.assignment.operate(auxtab)

        if (this.exp === "in" || this.exp === "of") {

            if (this.exp === "in") {
                let as = new Assignment(new Value(this.declaration.id, Type.ID, Type.VALOR, this.row, this.column), new Value("C/P", Type.ENTERO, Type.VALOR, this.row, this.column), this.row, this.column);
                as.operate(auxtab);
            }
            else if (this.exp === "of") {
                let as = new Assignment(new Value(this.declaration.id, Type.UNKNOWN, Type.VALOR, this.row, this.column), new Value([new Value(this.assignment.value, Type.ARREGLO, Type.VALOR, this.row, this.column)], Type.ARREGLO, Type.VALOR, this.row, this.column), this.row, this.column);
                as.value.value[0].add_positions([new Value('CO/P', Type.ENTERO, Type.VALOR, this.row, this.column)]);
                as.operate(auxtab);
            }
            //primero ejecutamos una vez el body.
            complex = this.execute_body(auxtab, tabs);
            complex.type = Type.FOR;
            complex.value = tab.get_product(complex.value, "LI");

            add_complex_def(complex);
            return complex;
        }

        if(this.exp === null){
            //Esto es un ciclo while true dependera unicamente de un break o return;
            //primero ejecutamos una vez el body.
            complex = this.execute_body(auxtab, []);

            if(!complex.exit)
                complex.value = "FA";
        }else{
            //Este es un ciclo basico
            //primero ejecutamos una vez el body.
            auxtab.setFalseVars();
            complex = this.execute_body(auxtab, tabs);
            complex.type = Type.FOR;

            //ejecutamos la condicion para obtener complejidad de salida por condicion del while
            let complex_method = new Value("CO", Type.CADENA, Type.VALOR, this.row, this.column);
            tabs.forEach(tab => {
                tab.setTrueVars();
                if(this.exp.type_exp === Type.VALOR && this.exp.value === true)
                    complex_method.value = tab.compare_maxComplex('FA', complex_method.value);
                else
                    complex_method.value = tab.compare_maxComplex(this.exp.operate(tab).complex_exp, complex_method.value);
            });

            if(complex_method.value === "CO"){
                //esto es un while true verificar si hay break
                if(!complex.exit)
                    complex.value = "FA";
            }

            complex.value = tab.get_product(complex.value, complex_method.value);
        }
        add_complex_def(complex);
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
            if (this.body[i] instanceof IfList || this.body[i] instanceof Switch)
            {
                tabs.forEach(tab => tabs.push(tab));;
                this.body[i].tabs = null;
            }

            if (eT !== null && eT.type_exp === Type.BREAK) {
                complex.exit = true;
                return complex;
            } else if (eT !== null && eT.type_exp === Type.CONTINUE) {
                return complex;
            }
        }
        return complex;
    }
}

export default For;