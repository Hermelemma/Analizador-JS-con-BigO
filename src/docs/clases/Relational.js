import Type from './Type';
import Value from './Value';
import { add_error_E, add_complex_def } from './Reports';
class Relational {
    constructor(left, right, t, te, _row, _column) {
        this.type = t;
        this.node_left = left;
        this.node_right = right;
        this.type_exp = te;
        this.row = _row;
        this.column = _column;
    }

    operate(tab) {
        let tempL = null;
        let tempR = null;
        let complex = new Value("CO", Type.RELATIONAL, Type.VALOR, this.row, this.column);
        if (this.node_right !== null) {
            tempR = this.node_right.operate(tab);
        }

        if (this.node_left !== null) {
            tempL = this.node_left.operate(tab);
        }

        if (tempR !== null && tempL !== null) {

            let valueL;
            let valueR;
            if(tempL.puede_usarse)
                valueL = tempL.value.substring(tempL.value.length - 2, tempL.value.length);
            else
                valueL = tempL.value.substring(0, 2);

            if(tempR.puede_usarse)
                valueR = tempR.value.substring(tempR.value.length - 2, tempR.value.length);
            else
                valueR = tempR.value.substring(0, 2);

            let actual_complex = tab.compare_maxComplex(valueL, valueR);

            if(tempL.complex_exp !== undefined)
                actual_complex = tab.compare_maxComplex(actual_complex, tempL.complex_exp);
            if(tempR.complex_exp !== undefined)
                actual_complex = tab.compare_maxComplex(actual_complex, tempR.complex_exp);
                        
            if (tempR.type_exp === Type.VALOR && tempL.type_exp === Type.VALOR) {
                complex.complex_exp = actual_complex;
                complex.value = tab.compare_maxComplex(tempL.value, tempR.value);
                add_complex_def(new Value(complex.value, Type.RELATIONAL, Type.COMPLEX, this.row, this.column));
                return complex;
            }

        }
        try { add_error_E({ error: 'Operacion no permitida ' + this.type, type: 'SINTACTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); }
        add_complex_def(new Value(complex.value, Type.RELATIONAL, Type.COMPLEX, this.row, this.column));
        return complex;
    }

}

export default Relational;