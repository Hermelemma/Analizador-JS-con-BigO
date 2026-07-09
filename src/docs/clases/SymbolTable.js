import { add_error_E, add_simbol_E } from './Reports';
class SymbolTable {

    constructor(_tsuper) {
        if (_tsuper !== null) {
            this.functions = _tsuper.functions;
        } else
            this.functions = [];
        this.symbols = [];
        this.tsuper = _tsuper;
        this.types = undefined;
    }

    add_types(types) {
        this.types = types;
    }

    find_type(value) {
        let global;
        let types;
        if (this.tsuper === null) {
            global = null;
            types = this.types;
        } else
            global = this.tsuper;
        while (global !== null) {
            types = global.types;
            global = global.tsuper;
        }
        for (let type of types) {
            if (type.name === value)
                return type;
        }
        return null;
    }

    find_global() {
        let global = this.tsuper;
        let prev = this.tsuper;
        while (global !== null) {
            prev = global;
            global = global.tsuper;
        }
        return prev;
    }

    addSymbol(symb) {
        this.symbols.push(symb);
        return true;
    }

    addSymbolDirect(symb) {
        this.symbols.push(symb);
        return true;
    }

    getSymbol(name) {
        for (let i = 0; i < this.symbols.length; i++) {
            if (name === this.symbols[i].id) {
                return this.symbols[i];
            }
        }
        if (this.tsuper !== null) {
            return this.tsuper.getSymbol(name);
        }
        return null;
    }

    getSymbol_dec(name) {
        for (let i = 0; i < this.symbols.length; i++) {
            if (name === this.symbols[i].id) {
                return this.symbols[i];
            }
        }
        return null;
    }

    add_simbols_report() {
        //{name: $1, type: "undefined", ambit: undefined, row: @1.first_line, column: @1.first_column}
        for (let i = 0; i < this.symbols.length; i++) {
            add_simbol_E({ name: this.symbols[i].id, type: this.symbols[i].type, ambit: this.symbols[i].type_var, row: this.symbols[i].row, column: this.symbols[i].column });
        }
        if (this.tsuper !== null) {
            return this.tsuper.getSymbol();
        }
        return null;
    }

    exists(val) {
        for (let i = 0; i < this.symbols.length; i++) {
            if (this.symbols[i].id === val) {
                return true;
            }
        }
        if (this.tsuper !== null) {
            return this.tsuper.exists(val);
        }
        return false;
    }

    existsDirect(val) {
        for (let i = 0; i < this.symbols.length; i++) {
            if (this.symbols[i].id === val) {
                return true;
            }
        }
        return false;
    }

    addFunction(fun) {
        let funciones = this.functions;
        let aux = this.tsuper;
        while (aux !== null) {
            funciones = aux.functions;
            aux = aux.tsuper;
        }

        if (!this.existsFunction(fun.id)) {
            funciones.push(fun);
            return true;
        } else {
            try { add_error_E({ error: "Funcion: " + fun.id + ", Ya Declarada.", type: 'SINTACTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); }
        }
        return false;
    }

    getFunction(name) {
        let funciones = this.functions;
        let aux = this.tsuper;
        while (aux !== null) {
            funciones = aux.functions;
            aux = aux.tsuper;
        }

        for (let f = 0; f < funciones.length; f++) {
            if (name === funciones[f].id) {
                return funciones[f];
            }
        }
        return null;
    }

    existsFunction(val) {
        let funciones = this.functions;
        let aux = this.tsuper;
        while (aux !== null) {
            funciones = aux.functions;
            aux = aux.tsuper;
        }

        for (let f = 0; f < funciones.length; f++) {
            if (funciones[f].id === val) {
                return true;
            }
        }
        return false;
    }

    compare_maxComplex(value1, value2) {
        value1 = value1.substring(0, 2);
        value2 = value2.substring(0, 2);
        value1 = this.correjir_complex(value1);
        value2 = this.correjir_complex(value2);
        try {
            switch (value1) {
                case "CO":
                    if (value2 !== "CO")
                        return value2;
                    else
                        return value1;
                case "LO":
                    if (value2 !== "CO")
                        return value2;
                    else
                        return value1;
                case "LI":
                    if (value2 !== "CO" && value2 !== "LO")
                        return value2;
                    else
                        return value1;
                case "LL":
                    if (value2 !== "CO" && value2 !== "LO" && value2 !== "LI")
                        return value2;
                    else
                        return value1;
                case "CU":
                    if (value2 === "AL" || value2 === "EX" || value2 === "FA")
                        return value2;
                    else
                        return value1;
                case "AL":
                    if (value2 === "EX" || value2 === "FA")
                        return value2;
                    else
                        return value1;
                case "EX":
                    if (value2 === "FA")
                        return value2;
                    else
                        return value1;
                case "FA":
                    return value1;
                default:
                    return "CO"
            }
        } catch (error) {
            return "CO";
        }
    }

    compare_minComplex(value1, value2) {
        value1 = value1.substring(0, 2);
        value2 = value2.substring(0, 2);
        value1 = this.correjir_complex(value1);
        value2 = this.correjir_complex(value2);
        try {
            switch (value1) {
                case "CO":
                    return value1;
                case "LO":
                    if (value2 === "CO")
                        return value2;
                    else
                        return value1;
                case "LI":
                    if (value2 === "CO" && value2 === "LO")
                        return value2;
                    else
                        return value1;
                case "LL":
                    if (value2 === "CO" && value2 === "LO" && value2 === "LI")
                        return value2;
                    else
                        return value1;
                case "CU":
                    if (value2 !== "AL" || value2 !== "EX" || value2 !== "FA")
                        return value2;
                    else
                        return value1;
                case "AL":
                    if (value2 !== "EX" || value2 !== "FA")
                        return value2;
                    else
                        return value1;
                case "EX":
                    if (value2 !== "FA")
                        return value2;
                    else
                        return value1;
                case "FA":
                    return value1;
                default:
                    return "CO"
            }
        } catch (error) {
            return "CO";
        }
    }

    correjir_complex(complex) {
        switch (complex) {
            case "CO":
            case "LO":
            case "LI":
            case "LL":
            case "CU":
            case "AL":
            case "EX":
            case "FA":
                return complex;
            default:
                return "CO";
        }
    }

    get_product(value1, value2) {
        try {
            switch (value1) {
                case "CO":
                    return value2
                case "LO":
                    switch (value2) {
                        case "CO":
                            return value1;
                        case "LO":
                        case "LL":
                        case "CU":
                        case "AL":
                        case "EX":
                        case "FA":
                            return value2;
                        case "LI":
                            return "LL";
                    }
                case "LI":
                    switch (value2) {
                        case "CO":
                            return value1;
                        case "LO":
                            return "LL";
                        case "LI":
                            return "LL";
                        case "LL":
                            return "CU";
                        case "CU":
                            return "AL";
                        case "AL":
                        case "EX":
                        case "FA":
                            return value2;
                    }
                case "LL":
                    switch (value2) {
                        case "CO":
                        case "LO":
                            return value1;
                        case "LI":
                        case "LL":
                            return "CU";
                        case "CU":
                            return "AL";
                        case "AL":
                        case "EX":
                        case "FA":
                            return value2;
                    }
                case "CU":
                    switch (value2) {
                        case "CO":
                        case "LO":
                            return value1;
                        case "LI":
                        case "LL":
                        case "CU":
                            return "AL";
                        case "AL":
                        case "EX":
                        case "FA":
                            return value2;
                    }
                case "AL":
                    switch (value2) {
                        case "CO":
                        case "LO":
                        case "LI":
                        case "LL":
                        case "CU":
                        case "AL":
                            return value1;
                        case "EX":
                        case "FA":
                            return value2;
                    }
                case "EX":
                    switch (value2) {
                        case "CO":
                        case "LO":
                        case "LI":
                        case "LL":
                        case "CU":
                        case "AL":
                        case "EX":
                            return value1;
                        case "FA":
                            return value2;
                    }
                case "FA":
                    return value1;
                default:
                    return "CO"
            }
        } catch (error) {
            return "CO";
        }
    }

    esIgualComplex(arr, value) {
        let esIgual = false;
        arr.forEach(element => { if (value === element ? true : false) esIgual = true });
        return esIgual;
    }

    setFalseVars() {
        for (let i = 0; i < this.symbols.length; i++) {
            this.symbols[i].puede_usarse = false;
        }
        if (this.tsuper !== null) {
            return this.tsuper.setFalseVars();
        }
        return null;
    }

    setTrueVars() {
        for (let i = 0; i < this.symbols.length; i++) {
            this.symbols[i].puede_usarse = true;
        }
        if (this.tsuper !== null) {
            return this.tsuper.setTrueVars();
        }
        return null;
    }

}

export default SymbolTable;
