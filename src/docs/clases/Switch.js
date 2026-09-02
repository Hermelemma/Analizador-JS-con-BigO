import Type from './Type';
import SymbolTable from './SymbolTable';
import Value from './Value';
import IfList from './IfList';
import { add_error_E, add_complex_def, add_complex_def_ins } from './Reports';

class Switch {
    //used = false
    constructor(_exp, _body, _default, _row, _column) {
        this.exp = _exp;
        this.cases = _body;
        this.rdefault = _default;
        this.row = _row;
        this.column = _column;
        //this.elsebody = new LinkedList<>();
        this.type_exp = Type.SENTENCIA;
        this.tabs = [];
    }

    operate(tab) {
        //let count = new Count();
        this.tabs = [];
        let complex = new Value("CO", Type.SWITCH, Type.COMPLEX, this.row, this.column);
        if (this.exp === null) {
            try { add_error_E({ error: "Se necesita una EXPRESION para comparar en el Switch.", type: 'SINTACTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); }
            //count.putError(Type.SINTACTICO, "Se necesita una EXPRESION pra comparar en el Switch.", this.row, this.column);
            return null;
        }
        let tmpExp = this.exp.operate(tab);
        let expresion = tab.compare_maxComplex(complex.value, tmpExp.value);
        for (let i = 0; i < this.cases.length; i++) {
            let tmpV = this.cases[i].exp.operate(tab);
            if (tmpV === null || tmpV.type_exp !== Type.VALOR) {
                //error
                try { add_error_E({ error: "Error al Evaluar la EXPRESSION en el Switch, se esperaba VALOR.", type: 'SINTACTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); }
                //count.putError(Type.SEMANTICO, "Error al Evaluar la EXPRESSION en el Switch, se esperaba VALOR.", this.row, this.column);
                return null;
            }
            complex.value = tab.compare_maxComplex(complex.value, tmpV.value);
            let s = new SymbolTable(tab);
            for (let nn = 0; nn < this.cases[i].body.length; nn++) {
                if (this.cases[i].body[nn].type_exp === Type.RETURN) {
                    let reE = this.cases[i].body[nn].operate(s);
                    complex.value = tab.compare_maxComplex(complex.value, reE.value);
                    add_complex_def_ins(this.cases[i].body[nn], reE);
                    complex.exit = true;
                    continue;
                } else {
                    this.cases[i].body[nn].used = true;
                    let eT = this.cases[i].body[nn].operate(tab);

                    add_complex_def_ins(this.cases[i].body[nn], eT);
                    complex.value = tab.compare_maxComplex(complex.value, eT.value);
                    if (this.body[i] instanceof IfList || this.body[i] instanceof Switch) {
                        this.tabs.concat(this.body[i].tabs);
                        this.body[i].tabs = null;
                    }

                    if (eT.type_exp === Type.BREAK) {
                        complex.exit = true;
                        continue;
                    } else if (eT.type_exp === Type.CONTINUE) {
                        continue;
                    }
                }

            }
        }
        let s = new SymbolTable(tab);
        if (this.rdefault !== null) {
            for (let i = 0; i < this.rdefault.length; i++) {
                if (this.rdefault[i].type_exp === Type.RETURN) {
                    let reE = this.rdefault[i].operate(s);
                    complex.value = tab.compare_maxComplex(complex.value, reE.value);
                    complex.exit = true;
                    add_complex_def_ins(this.rdefault[i], reE);
                    continue;
                } else {
                    this.rdefault[i].used = this.used;
                    let eT = this.rdefault[i].operate(tab);

                    add_complex_def_ins(this.rdefault[i], eT);
                    complex.value = tab.compare_maxComplex(complex.value, eT.value);
                    if (this.body[i] instanceof IfList || this.body[i] instanceof Switch) {
                        this.tabs.concat(this.body[i].tabs);
                        this.body[i].tabs = null;
                    }

                    if (eT.type_exp === Type.BREAK) {
                        complex.exit = true;
                        continue;
                    } else if (eT.type_exp === Type.CONTINUE) {
                        continue;
                    }
                }
            }

        }
        complex.value = tab.compare_maxComplex(complex.value, expresion);
        add_complex_def(new Value(complex.value, Type.SWITCH, Type.COMPLEX, this.row, this.column));
        return complex;
    }

}

export default Switch;