import Type from './Type';
import Value from './Value';
import { add_error_E, add_complex_def } from './Reports';

class Logical {
    constructor(left, right, t, te, _row, _column) {
        this.type = t;
        this.node_left = left;
        this.node_right = right;
        this.type_exp = te;
        this.row = _row;
        this.column = _column;
    }

    operate(tab) {
        //let cont = new Cont();
        let complex = new Value("CO", Type.LOGICAL, Type.VALOR, this.row, this.column);
        let tempL = null;
        let tempR = null;

        if (this.node_left !== null) {
            tempL = this.node_left.operate(tab);
        }

        if (this.node_right !== null) {
            tempR = this.node_right.operate(tab);
        }

        if (tempR !== null && tempL !== null) {
            if (tempL.type_exp === Type.VALOR && tempR.type_exp === Type.VALOR) {
                let complex_exp = undefined;
                if(tempL.complex_exp !== undefined || tempR.complex_exp !== undefined)
                    complex_exp = tab.compare_maxComplex(tempL.complex_exp, tempR.complex_exp);
                switch (this.type) {
                    case Type.AND:
                        let getMin = this.get_min(tempL.value, tempR.value);
                        add_complex_def(new Value(getMin, Type.LOGICAL, Type.COMPLEX, this.row, this.column));
                        complex = new Value(getMin, Type.BOOL, Type.VALOR, this.row, this.column);
                        break;
                    case Type.OR:
                        let getMax = this.get_max(tempL.value, tempR.value);
                        add_complex_def(new Value(getMax, Type.LOGICAL, Type.COMPLEX, this.row, this.column));
                        complex = new Value(getMax, Type.BOOL, Type.VALOR, this.row, this.column);
                        break;
                    default:
                        try { add_error_E({ error: "No se puede ejecutar la operacion " + this.type + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); }
                        return null;
                }
                if(complex_exp)
                    complex.complex_exp = complex_exp;
                return complex;
                
            }
        } else if (tempR === null && tempL !== null) {
            if (tempL.type_exp === Type.VALOR) {
                if (this.type === Type.NOT) {
                    //Se retorna la funcion de complejidad una negacion es constante
                    add_complex_def(new Value(tempL.value, Type.LOGICAL, Type.COMPLEX, this.row, this.column));
                    return new Value(tempL.value, Type.BOOL, Type.VALOR, this.row, this.column);
                }
            }
            try { add_error_E({ error: "No se puede ejecutar la operacion " + this.type + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); }
            //cont.putError(Type.SEMANTICO, "No se puede ejecutar la operacion " + this.type + ", No reconocida o No Permitida.", this.row, this.column);
            add_complex_def(new Value(complex.value, Type.LOGICAL, Type.COMPLEX, this.row, this.column));
            return complex
        }
        try { add_error_E({ error: "No se puede ejecutar la operacion " + this.type + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); }
        //cont.putError(Type.SEMANTICO, "No se puede ejecutar la operacion " + this.type + ", No reconocida o No Permitida.", this.row, this.column);
        add_complex_def(new Value(complex.value, Type.LOGICAL, Type.COMPLEX, this.row, this.column));
        return complex;
    }

    get_max(l, r) {
        try {
            if (this.isf(l) && this.isf(r))
                return (l === "LI" || r === "LI") ? "LI" : "LO"
            else if (this.isf(l))
                return l
            else if (this.isf(r))
                return r
            else
                return "CO/BL"
        } catch (error) {
            return "CO/BL";
        }
    }

    get_min(l, r) {
        try {
            if (this.isf(l) && this.isf(r))
                return (l === "LO" || r === "LO") ? "LO" : "LI"
            else if (this.isf(l))
                return l
            else if (this.isf(r))
                return r
            else
                return "CO/BL"
        } catch (error) {
            return "CO/BL";
        }
    }

    isf(valor) {
        return (valor === "LI" || valor === "LO") ? true : false;
    }

}

export default Logical;