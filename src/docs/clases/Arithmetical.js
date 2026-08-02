import Type from './Type';
import Value from './Value';
import { add_complex_def } from './Reports';

class Arithmetical {

    constructor(left, right, t, te, _row, _column) {
        this.type = t;
        this.node_left = left;
        this.node_right = right;
        this.type_exp = te;
        this.row = _row;
        this.column = _column;
    }

    operate(tab) {
        var tempL = null;
        var tempR = null;
        let complex = new Value("CO", Type.ARITHMETICAL, Type.VALOR, this.row, this.column);
        if (this.node_right !== null) {
            if (!(this.node_right instanceof Array)) {
                tempR = this.node_right.operate(tab);
            } else {
                tempR = this.node_right[0].operate(tab);
            }
        }

        if (this.node_left !== null) {
            if (!(this.node_left instanceof Array)) {
                tempL = this.node_left.operate(tab);
            } else {
                tempL = this.node_left[0].operate(tab);
            }
        }

        if (tempR !== null && tempL !== null) {

            //primero verificamos que los operandos sean menores a la complejidad resultatante de los operadores
            complex.value = tab.compare_maxComplex(tempL.value, tempR.value);
            if (!tab.esIgualComplex(["CO"], complex.value.split("/")[0])) {
                if (complex === tempL.value) {
                    add_complex_def(new Value(tempL.value, Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
                    return tempL;
                }
                else {
                    add_complex_def(new Value(tempR.value, Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
                    return tempR;
                }
            }

            if ((tempL.type === Type.ENTERO || tempL.type === Type.UNKNOWN) && (tempR.type === Type.ENTERO || tempR.type === Type.UNKNOWN)) {
                if (null !== this.type) {
                    switch (this.type) {
                        case Type.SUMA:
                            if (tempL.value.split("/").length > 1 && tempL.value.split("/")[1].substring(1) === "LO") {
                                add_complex_def(new Value(tempL.value, Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
                                return new Value(tempL.value, Type.ENTERO, Type.VALOR, this.row, this.column);
                            }
                            else if (tempL.value.split("/").length > 1 && tempR.value.split("/")[1] === "LO") {
                                add_complex_def(new Value(tempR.value, Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
                                return new Value(tempR.value, Type.ENTERO, Type.VALOR, this.row, this.column);
                            }
                            add_complex_def(new Value("CO/PLI", Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
                            return new Value("CO/PLI", Type.ENTERO, Type.VALOR, this.row, this.column);
                        case Type.RESTA:
                            if (tempL.value.split("/").length > 1 && tempL.value.split("/")[1].substring(1) === "LO") {
                                add_complex_def(new Value(tempL.value, Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
                                return new Value(tempL.value, Type.ENTERO, Type.VALOR, this.row, this.column);
                            } else if (tempL.value.split("/").length > 1 && tempR.value.split("/")[1].substring(1) === "LO") {
                                add_complex_def(new Value(tempR.value, Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
                                return new Value(tempR.value, Type.ENTERO, Type.VALOR, this.row, this.column);
                            } 
                            add_complex_def(new Value("CO/NLI", Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
                            return new Value("CO/NLI", Type.ENTERO, Type.VALOR, this.row, this.column);
                        case Type.MULTIPLICACION:
                            let cV = "CO/" + this.leySignos(tempR, tempL) + "LO";
                            add_complex_def(new Value(cV, Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
                            return new Value(cV, Type.ENTERO, Type.VALOR, this.row, this.column);
                        case Type.DIVISION:
                            let cV1 = "CO/" + this.leySignos(tempR, tempL) + "LO";
                            add_complex_def(new Value(cV1, Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
                            return new Value(cV1, Type.ENTERO, Type.VALOR, this.row, this.column);
                        case Type.POTENCIA:
                            add_complex_def(new Value("CO/PLO", Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
                            return new Value("CO/PLO", Type.ENTERO, Type.VALOR, this.row, this.column);
                        case Type.MODULO:
                            let cV2 = "CO/" + this.leySignos(tempR, tempL) + "LO";
                            add_complex_def(new Value(cV2, Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
                            return new Value(cV2, Type.ENTERO, Type.VALOR, this.row, this.column);
                        default:
                            add_complex_def(new Value("CO/NaN", Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
                            return new Value("CO/NaN", Type.CADENA, Type.VALOR, this.row, this.column);
                    }
                }
            } else if (tempL.type === Type.ENTERO && tempR.type === Type.CADENA) {
                if (null !== this.type) {
                    switch (this.type) {
                        case Type.SUMA:
                            let cV = "CO/" + tempL.value + tempR.value;
                            add_complex_def(new Value(cV, Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
                            return new Value(cV, Type.CADENA, Type.VALOR, this.row, this.column);
                        default:
                            add_complex_def(new Value("CO/NaN", Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
                            return new Value("CO/NaN", Type.CADENA, Type.VALOR, this.row, this.column);
                    }
                }
            } else if (tempL.type === Type.CADENA && tempR.type === Type.ENTERO) {
                if (null !== this.type) {
                    switch (this.type) {
                        case Type.SUMA:
                            let cV = "CO/" + tempL.value + tempR.value;
                            add_complex_def(new Value(cV, Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
                            return new Value(cV, Type.CADENA, Type.VALOR, this.row, this.column);
                        default:
                            add_complex_def(new Value("CO/NaN", Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
                            return new Value("CO/NaN", Type.CADENA, Type.VALOR, this.row, this.column);
                    }
                }
            } else if (tempL.type === Type.CADENA && tempR.type === Type.CADENA) {
                if (this.type === Type.SUMA) {
                    let cV = "CO/" + tempL.value + tempR.value;
                    add_complex_def(new Value(cV, Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
                    return new Value(cV, Type.CADENA, Type.VALOR, this.row, this.column);
                }
            } else if (tempL.type === Type.CADENA && tempR.type === Type.BOOL) {
                if (this.type === Type.SUMA) {
                    let cV = "CO/" + tempL.value + tempR.value;
                    add_complex_def(new Value(cV, Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
                    return new Value(cV, Type.CADENA, Type.VALOR, this.row, this.column);
                }
            } else if (tempL.type === Type.BOOL && tempR.type === Type.CADENA) {
                if (this.type === Type.SUMA) {
                    let cV = "CO/" + tempL.value + tempR.value;
                    add_complex_def(new Value(cV, Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
                    return new Value(cV, Type.CADENA, Type.VALOR, this.row, this.column);
                }
            }
            add_complex_def(new Value("CO/NaN", Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
            return new Value("CO/NaN", Type.CADENA, Type.VALOR, this.row, this.column);
        }
        add_complex_def(new Value(complex.value, Type.ARITHMETICAL, Type.COMPLEX, this.row, this.column));
        return complex;
    }

    leySignos(tempR, tempL) {
        if (tempR.value.split("/")[1].charAt(0) === "N" && tempL.value.split("/")[1].charAt(0) === "N")
            return "P"
        else if (tempR.value.split("/")[1].charAt(0) === "P" && tempL.value.split("/")[1].charAt(0) === "N")
            return "N"
        else if (tempR.value.split("/")[1].charAt(0) === "N" && tempL.value.split("/")[1].charAt(0) === "P")
            return "N"
        else
            return "P"
    }

}

export default Arithmetical;