import Type from './Type';
import Value from './Value';
import { add_error_E, add_complex_def } from './Reports';

class Unary {
   constructor(_id, _type, _row, _col) {
      this.id = _id;
      this.type = _type;
      this.row = _row;
      this.column = _col;
   }

   operate(tab) {
      let a;
      if (this.id instanceof Array) {
         a = tab.getSymbol(this.id[0].value);
      } else
         a = tab.getSymbol(this.id);
      if (a !== null && a.type === Type.ENTERO) {
         if (this.type === Type.INCREMENTO) {
            add_complex_def(new Value("CO", Type.UNARY, Type.COMPLEX, this.row, this.column));
            return new Value("CO/PLI", a.ENTERO, a.VALOR, a.row, a.column);
         } else if (this.type === Type.DECREMENTO) {
            add_complex_def(new Value("CO", Type.UNARY, Type.COMPLEX, this.row, this.column));
            return new Value("CO/NLI", a.ENTERO, a.VALOR, a.row, a.column);
         }
      }
      else if (this.type === Type.RESTA) {
         let tmpExp = this.id.operate(tab);
         if (tmpExp.type === Type.UNKNOWN) {
            add_complex_def(new Value("CO", Type.UNARY, Type.COMPLEX, this.row, this.column));
            return new Value("CO/NLI", Type.ENTERO, Type.VALOR, tmpExp.row, tmpExp.column);
         }
         else if (tmpExp.type === Type.ENTERO) {
            add_complex_def(new Value("CO", Type.UNARY, Type.COMPLEX, this.row, this.column));
            if (tmpExp.value.split("/")[1] === "P")
               return new Value("CO/NLI", Type.ENTERO, Type.VALOR, tmpExp.row, tmpExp.column);
            else
               return new Value("CO/PLI", Type.ENTERO, Type.VALOR, tmpExp.row, tmpExp.column);
         } else if (tmpExp.type === Type.BOOL) {
            add_complex_def(new Value("CO/PLI", Type.UNARY, Type.COMPLEX, this.row, this.column));
            if (tmpExp.value === true)
               return new Value("CO/NLI", Type.ENTERO, Type.VALOR, tmpExp.row, tmpExp.column);
            else
               return new Value("CO/P", Type.ENTERO, Type.VALOR, tmpExp.row, tmpExp.column);
         }
         else {
            add_complex_def(new Value("CO", Type.UNARY, Type.COMPLEX, this.row, this.column));
            return new Value("NaN", Type.CADENA, Type.VALOR, tmpExp.row, tmpExp.column);
         }
      } else if (a === null) {
         try { add_error_E({ error: "EXPRESION INVALIDA para el operador unario se esperaba ENTERO o DECIMAL.", type: 'SEMANTICO', line: this.row, column: this.column }); } catch (e) { console.log(e); }
      }
      add_complex_def(new Value("CO", Type.UNARY, Type.COMPLEX, this.row, this.column));
      return new Value("CO", Type.ENTERO, Type.VALOR, this.row, this.column);;
   }
}


export default Unary;