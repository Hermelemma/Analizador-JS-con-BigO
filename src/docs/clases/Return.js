import Type from'./Type';
import Value from'./Value';
import { add_complex_def } from './Reports'

class Return {

    constructor( _value, _type, _type_exp, _row, _column) {
        this.value = _value;
        this.type = _type;
        this.type_exp = _type_exp
        this.row = _row;
        this.column = _column;
    }

    operate(tab) {
        let complex = new Value("CO", Type.RETURN, Type.VALOR, this.row, this.column);
        if (this.value !== null) {
            let ret = this.value.operate(tab);
            if (ret !== null) {
                ret.used = false;
                complex = ret;
                complex.value = tab.compare_maxComplex(complex.value, ret.value);
            }
        }else {
            return new Value("null",Type.CADENA,Type.NULL,this.row,this.column);
        }
        add_complex_def(new Value(complex.value, Type.RETURN, Type.COMPLEX, this.row, this.column));
        return complex;
    }

}

export default Return;