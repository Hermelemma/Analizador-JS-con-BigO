import { add_complex_def } from './Reports';
import Type from './Type';
import Value from './Value';

class Print {
    constructor(val, _type, _type_exp, _row, _column) {
        this.value = val;
        this.type = _type;
        this.type_exp = _type_exp;
        this.row = _row;
        this.column = _column;
    }

    operate(tab) {
        let complex = new Value("CO", Type.PRINT, Type.VALOR, this.row, this.column);
        //let count = new Count();

        for(let i = 0; i < this.value.length; i++) {
            let e = this.value[i].operate(tab);
            complex.value = tab.compare_maxComplex(complex.value, e.value);
        }

        add_complex_def(complex);
        return complex;
    }
}
export default Print;