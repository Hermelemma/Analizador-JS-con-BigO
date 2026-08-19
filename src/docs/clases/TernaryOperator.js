import Type from './Type';
import Value from './Value';
import { add_complex_def } from './Reports';

class TernaryOperator {

    constructor(exp, _true, _false, _row, _column) {
        this.value = exp;
        this.node_left = _true;
        this.node_right = _false;
        this.row = _row;
        this.column = _column;
    }

    operate(tab) {
        let complex = new Value("CO", Type.TERNARY, Type.VALOR, this.row, this.column);
        let aux = this.value.operate(tab);
        complex.value = tab.compare_maxComplex(complex.value, aux.value);
        // es verdadero
        let retT = this.node_left.operate(tab);
        complex.value = tab.compare_maxComplex(complex.value, retT.value);

        let retF = this.node_right.operate(tab);
        complex.value = tab.compare_maxComplex(complex.value, retF.value);

        add_complex_def(new Value(complex.value, Type.TERNARY, Type.COMPLEX, this.row, this.column));
        return complex;
    }
}

export default TernaryOperator;
