import Type from'./Type';
import Value from'./Value';
import { get_complex_func, is_running_function } from './Reports';

class Call {
    constructor(_id, _type, _type_exp, _param, _row, _column) {
        this.id = _id;
        this.type = _type;
        if (_param === null) {
            this.param = []
        } else {
            this.param = _param;
        }
        this.type_exp = _type_exp;
        this.column = _column;
        this.row = _row;

    }

    operate(tab) {
        let complex = new Value("CO", Type.CALL, Type.VALOR, this.row, this.column);
        complex = get_complex_func(this.id);
        if(!complex){
            //verificamos si se esta llamando a si misma sino continuamos
            if(is_running_function(this.id)){
                complex = new Value("EX", Type.CALL, Type.VALOR, this.row, this.column);
                return complex
            }

            //hay que mandar a ejecutar la funcion para obtener su complejidad
            let f = tab.getFunction(this.id);
            if(f){
                f.operate(tab);
                complex = get_complex_func(this.id);
            }else{
                //no existe la funcion a ejecutar posible mejora
                if(!complex)
                    complex = new Value("CO", Type.CALL, Type.VALOR, this.row, this.column);
            }
        }
        return complex;
    }

}

export default Call;