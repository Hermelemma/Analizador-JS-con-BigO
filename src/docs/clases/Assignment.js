import Type from './Type';
import { add_error_E, add_complex_def } from './Reports';
import Value from './Value';

class Assignment {
    constructor(_id, val, _row, _column) {
        this.value = val;
        this.id = _id;
        this.row = _row;
        this.column = _column;
        this.type = null;
        this.type_exp = Type.SENTENCIA;
    }

    change_tipe(tipo)
    {
        this.type = tipo;
    }

    operate(tab) {
        let complex = new Value("CO", Type.ASSIGNMENT, Type.COMPLEX, this.row, this.column);

        if(this.id instanceof Array)
        {
            let i = 0;
            let aux_return = null;
            while(i < this.id.length)
            {
                if (i === 0)
                {
                    let a = tab.exists(this.id[i].value+"");
                    if (a) {
                        let r = tab.getSymbol(this.id[i].value+"");

                        if(r.type === Type.ARREGLO)
                        {
                            if(this.id[i].positions.length > 0)
                            {
                                let j = 0;
                                try
                                {
                                    let position = this.id[i].positions[j].operate(tab);
                                    if(i === this.id.length - 1 && j === this.id[i].positions.length - 1)
                                    {
                                        if (this.value === undefined && this.type === Type.ARREGLO)
                                        {
                                            r.value[position.value] = new Value([], Type.ARREGLO, Type.VALOR, this.row, this.column);
                                        }else if (this.value !== undefined)
                                        {
                                            let tmpExp = this.value.operate(tab);                                                
                                            if(tmpExp !== null)
                                                r.value[position.value] = new Value(tmpExp.value, tmpExp.type, tmpExp.type_exp, this.row, this.column);
                                            complex.value = tab.compare_maxComplex(complex.value, tmpExp.value);
                                        }
                                        add_complex_def(new Value(complex.value, Type.ASSIGNMENT, Type.COMPLEX, this.row, this.column));
                                        return complex;
                                    }
                                    aux_return = r.value[position.value];
                                }catch(e){ console.log(e); try{ add_error_E( {error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); } return null;}
                                j++;
                                while(j < this.id[i].positions.length)
                                {
                                    try
                                    {
                                        let position = this.id[i].positions[j].operate(tab);
                                        if(i === this.id.length - 1 && j === this.id[i].positions.length - 1)
                                        {
                                            if (this.value === undefined && aux_return.type === Type.ARREGLO)
                                            {
                                                aux_return.value[position.value] = new Value([], Type.ARREGLO, Type.VALOR, this.row, this.column);
                                            }else if (this.value !== undefined)
                                            {
                                                let tmpExp = this.value.operate(tab);
                                                if(r.type === Type.ARREGLO && aux_return === undefined)
                                                {
                                                    aux_return = new Value([], Type.ARREGLO, Type.VALOR, this.row, this.column);
                                                }
                                                if(tmpExp !== null)
                                                {
                                                    aux_return.value[position.value] = new Value(tmpExp.value, tmpExp.type, tmpExp.type_exp, this.row, this.column);
                                                }
                                                complex.value = tab.compare_maxComplex(complex.value, tmpExp.value);
                                            }
                                            add_complex_def(new Value(complex.value, Type.ASSIGNMENT, Type.COMPLEX, this.row, this.column));
                                            return complex;
                                        }
                                        aux_return = r.value[position.value];
                                    }catch(e){ console.log(e); }
                                    j++;
                                }
                            }else
                            {
                               aux_return = r;
                               if(i === this.id.length - 1)
                               {
                                   if (this.value === undefined && this.type === Type.ARREGLO)
                                   {
                                       r.value = new Value([], Type.ARREGLO, Type.VALOR, this.row, this.column);
                                   }else if (this.value !== undefined)
                                   {
                                        let tmpExp = this.value.operate(tab);
                                        if(r.type === Type.ARREGLO && aux_return === undefined)
                                        {
                                           aux_return = new Value([], Type.ARREGLO, Type.VALOR, this.row, this.column);
                                        }
                                        if(tmpExp !== null)
                                            r.value = new Value(tmpExp.value, tmpExp.type, tmpExp.type_exp, this.row, this.column);
                                        complex.value = tab.compare_maxComplex(complex.value, tmpExp.value);
                                    }
                                    add_complex_def(new Value(complex.value, Type.ASSIGNMENT, Type.COMPLEX, this.row, this.column));
                                   return complex;
                               }
                            }
                        }else if(r.type !== Type.ENTERO && r.type !== Type.BOOL && r.type !== r.CADENA && r.type !== r.ID)
                        {
                            aux_return = r;
                        }
                    } else {
                        try{ add_error_E( {error: "La variable: " + this.id.toString() + "no a sido encontrada", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                        add_complex_def(new Value(complex.value, Type.ASSIGNMENT, Type.COMPLEX, this.row, this.column));
                        return complex;
                    }
                }else
                {
                    try
                    {
                        let find = false;
                        for(let dat of aux_return.value)
                        {
                            if(this.id[i].value === dat[0])
                            {
                                aux_return = dat[1];
                                find = true;
                                break;
                            }
                        }
                        if(!find)
                        {
                            try{ add_error_E( {error: "El atributo no existe", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                            add_complex_def(new Value(complex.value, Type.ASSIGNMENT, Type.COMPLEX, this.row, this.column));
                            return null;
                        }

                        if(this.id[i].type === Type.ARREGLO)
                        {
                            aux_return = aux_return.value
                            let j = 0;
                            try
                            {
                                let position = this.id[i].positions[j].operate(tab);
                                if(i === this.id.length - 1 && j === this.id[i].positions.length - 1)
                                {
                                    if (this.value === undefined && this.type === Type.ARREGLO)
                                    {
                                        aux_return.value[position.value] = new Value([], Type.ARREGLO, Type.VALOR, this.row, this.column);
                                    }else if (this.value !== undefined)
                                    {
                                        let tmpExp = this.value.operate(tab);
                                        if(this.id[i].type === Type.ARREGLO && aux_return === undefined)
                                        {
                                            aux_return = new Value([], Type.ARREGLO, Type.VALOR, this.row, this.column);
                                        }
                                        if(tmpExp !== null)
                                            aux_return.value[position.value] = new Value(tmpExp.value, tmpExp.type, tmpExp.type_exp, this.row, this.column);
                                        complex.value = tab.compare_maxComplex(complex.value, tmpExp.value);
                                    }
                                    add_complex_def(new Value(complex.value, Type.ASSIGNMENT, Type.COMPLEX, this.row, this.column));
                                    return complex;
                                }
                                aux_return = aux_return.value[position.value];
                            }catch(e){ console.log(e); try{ add_error_E( {error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); } return null;}
                            j++;
                            while(j < this.id[i].positions.length)
                            {
                                try
                                {
                                    let position = this.id[i].positions[j].operate(tab);
                                    if(i === this.id.length - 1 && j === this.id[i].positions.length - 1)
                                    {
                                        if (this.value === undefined && aux_return.type === Type.ARREGLO)
                                        {
                                            aux_return.value[position.value] = new Value([], Type.ARREGLO, Type.VALOR, this.row, this.column);
                                        }else if (this.value !== undefined)
                                        {
                                            let tmpExp = this.value.operate(tab);
                                            if(this.id[i].type === Type.ARREGLO && aux_return === undefined)
                                            {
                                                aux_return = new Value([], Type.ARREGLO, Type.VALOR, this.row, this.column);
                                            }
                                            if(tmpExp !== null)
                                                aux_return.value[position.value] = new Value(tmpExp.value, tmpExp.type, tmpExp.type_exp, this.row, this.column);
                                            complex.value = tab.compare_maxComplex(complex.value, tmpExp.value);
                                        }
                                        add_complex_def(new Value(complex.value, Type.ASSIGNMENT, Type.COMPLEX, this.row, this.column));
                                        return complex;
                                    }
                                    aux_return = aux_return.value[position.value];
                                }catch(e){ console.log(e); }
                                j++;
                            }
                        }
                    }catch(e){ console.log(e); try{ add_error_E( {error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); } return null;}

                }
                i = i + 1;
            }
            if(this.value.type === Type.OBJETO)
                this.value.type = aux_return.type;
            let tmpExp = this.value.operate(tab);
                
            if(aux_return.type === tmpExp.type)
            {
                aux_return.type_exp = tmpExp.type_exp;
                aux_return.value = tmpExp.value;
            }
            complex.value = tab.compare_maxComplex(complex.value, tmpExp.value);
        }else
        {
            let a = tab.getSymbol(this.id.value);
            let tmpExp = this.value.operate(tab);
    
            if (tmpExp !== null) {
                if (a === null) {
                    try{ add_error_E( {error: "La variable no existe: " + this.id, type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                }else {
                    if(tmpExp.type === a.type)
                    {
                        a.type_exp = tmpExp.type_exp;
                        a.value = tmpExp.value;
                    }else if (a.value === undefined && a.type === undefined)
                    {
                        a.value = tmpExp.value;
                        a.type = tmpExp.type;
                    }else if(tmpExp.type === undefined && tmpExp.value === undefined)
                    {
                        a.type = undefined;
                        a.value = undefined;
                    }
                }
            } else {
                try{ add_error_E( {error: "Hubo un error al realizar la asignacion de la variable " + this.id + ".", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                add_complex_def(complex);
                return null;
            }
            complex.value = tab.compare_maxComplex(complex.value, tmpExp.value);
        }
        add_complex_def(complex);
        return complex;
    }

    assign_recursive_type(types, value, tab)
    {
        let value_return = [];
        let type = tab.find_type(types);
        if(type !== null)
        {
            if(type.atributes.length === value.length)
            {
                for(let at of value)
                {
                    let bol = false;
                    for(let at2 of type.atributes)
                    {
                        if(at[0] === at2.name)
                        {
                            bol = true;
                            if(tab.find_type(at2.name) === null)
                            {
                                let temp = at[1].operate(tab);
                                if(temp === null || temp.type !== at2.type)
                                {
                                    try{ add_error_E( {error: "El atributo no es del tipo correcto: " + temp.type + "con el del type: " + at2.type, type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                    return null;
                                }
                                value_return.push([at2.name, temp.value]);
                            }else
                            {
                                return this.assign_recursive_type(at2.name, at[1], tab)
                            }
                        }
                    }
                    if(!bol)
                    {
                        try{ add_error_E( {error: "El atributo no existe: " + at[0] , type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                        return null;
                    }
                }
                return value_return;
            }else
                try{ add_error_E( {error: "Faltan atributos", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
        }else
        {
            try{ add_error_E( {error: "Tipo " + this.type + " no Valido.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            return null;
        }
    }

}

export default Assignment;