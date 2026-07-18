import Type from './Type';
import Value from './Value';
import { add_complex_def } from './Reports';

class Break {

    constructor(_type_exp, _row, _column) {
        this.type_exp = _type_exp;
        this.row = _row;
        this.column = _column;
        this.used = false;
    }

    operate(tab) {
        let ret = new Value("CO", null, Type.BREAK, this.row, this.column);
        ret.used = false;
        add_complex_def(new Value(ret.value, Type.BREAK, Type.COMPLEX, this.row, this.column));
        return ret;
    }
}

export default Break;