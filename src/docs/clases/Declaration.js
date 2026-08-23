import Symbol from './Symbol';
import { add_error_E, add_console, add_complex_def } from './Reports';
import Type from'./Type';
import Value from './Value';

class Declaration {
    constructor(_id, _value, _type, _type_exp, _type_var, _type_c, /*_type_o,*/ _row, _column) {
        this.id = _id;
        this.value = _value;
        this.type = _type;
        this.type_exp = _type_exp;
        this.type_var = _type_var;
        this.type_c = _type_c;
        this.row = _row;
        this.column = _column;
    }
    operate(tab) {
        let a = tab.getSymbol_dec(this.id);
        let tmpExp;
        let complex = new Value("CO", Type.DECLARATION, Type.VALOR, this.row, this.column);
        if(this.value !== undefined && this.value.type === Type.OBJETO)
            this.value.type = this.type;
        if(this.value !== undefined && this.type !== Type.ARREGLO)
        {
            tmpExp = this.value.operate(tab);
            if(tmpExp === null)
            {
                try{ add_console("La variable: " + this.id + ", no se pudo crear revisar reporte de errores" + ", Linea: " + this.row + ", Columna: " + this.column); }catch(e){ console.log(e); }
                return null;
            }
            complex = tmpExp;
        }

        
        if (a === null) {
            if (this.value !== undefined && this.type === Type.ARREGLO)
            {
                let arreglo = new Symbol(this.id, [], this.type, this.type_exp, this.type_var, this.type_c,/* this.type_o,*/ this.row,this.column)
                if(this.value instanceof Array)
                {
                    for(let element of this.value){
                        let tmpExp = element.operate(tab);
                        if (tmpExp !== null) {
                            arreglo.value.push(tmpExp);
                        }
                        complex.value = tab.compare_maxComplex(complex.value, tmpExp.value);
                    }
                    tab.addSymbol(arreglo);
                }
            }
            else if(this.value !== undefined && (tmpExp.type === this.type || this.type === undefined))
            {
                if( tmpExp.type === Type.ENTERO || tmpExp.type === Type.BOOL || tmpExp.type === Type.CADENA || tmpExp.type === Type.UNKNOWN)
                {
                    tab.addSymbol(new Symbol(this.id, tmpExp.value, tmpExp.type, this.type_exp, this.type_var, this.type_c,/* this.type_o,*/ this.row,this.column));
                }
                else
                {
                    if(tmpExp.type === this.type)
                    {
                        tab.addSymbol(new Symbol(this.id, tmpExp.value, this.type, this.type_exp, this.type_var, this.type_c,/* this.type_o,*/ this.row,this.column));
                        //this.assign_recursive_type(tmpExp.type, tmpExp.value, tab);
                    }
                    else if(this.value.type === Type.CALL){
                        tab.addSymbol(new Symbol(this.id, tmpExp.value, Type.UNKNOWN, this.type_exp, this.type_var, this.type_c,/* this.type_o,*/ this.row,this.column));
                    }
                }
            }else if ( this.type === Type.ARREGLO)
            {
                tab.addSymbol(new Symbol(this.id, [], this.type, this.type_exp, this.type_var, this.type_c,/* this.type_o,*/ this.row,this.column));
            }else if (this.value === undefined && this.type === undefined)
            {
                tab.addSymbol(new Symbol(this.id, undefined, undefined, this.type_exp, this.type_var, this.type_c,/* this.type_o,*/ this.row,this.column));
            }else if (this.value === undefined && this.type !== undefined)
            {
                tab.addSymbol(new Symbol(this.id, undefined, this.type, this.type_exp, this.type_var, this.type_c,/* this.type_o,*/ this.row,this.column));
            }
            else
                try{ add_error_E( {error: "No se puede asignar un valor tipo: " + tmpExp.type + " a una variable de tipo" + this.type , type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            
            complex = this.verificar_complex(complex, tab);
            add_complex_def(new Value(complex.value, Type.DECLARATION, Type.COMPLEX, this.row, this.column));
            return complex;
        }else {
            try{ add_error_E( {error: "La variable ya existe " + this.id + ".", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
        }

        complex = this.verificar_complex(complex, tab);
        add_complex_def(new Value(complex.value, Type.DECLARATION, Type.COMPLEX, this.row, this.column));
        return complex;
    }

    verificar_complex(complex, tab){
        let c = new Value("CO", Type.COMPLEX, Type.VALOR, this.row, this.column);
        if(complex.type === Type.OBJETO){
            // hay que buscar cual atributo de todos tiene mayor complejidad
            complex.value.forEach(son =>{
                c.value = tab.compare_maxComplex(c.value, son[1].value);
            });
            return c;
        }
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

export default Declaration;