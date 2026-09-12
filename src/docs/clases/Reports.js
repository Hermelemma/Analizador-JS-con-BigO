import Arithmetical from "./Arithmetical";
import Break from "./Break";
import Call from "./Call";
import IfList from "./IfList";
import Switch from "./Switch";
import Continue from "./Continue";
import Declaration from "./Declaration";
import DoWhile from "./DoWhile";
import For from "./For";
import Logical from "./Logical";
import Print from "./Print";
import Relational from "./Relational";
import Return from "./Return";
import TernaryOperator from "./TernaryOperator";
import While from "./While";
import Value from "./Value";
import Type from "./Type";

export function add_error_E(errores) {
     let arr = JSON.parse(localStorage.getItem('errores_E'));
     arr.push({ Tipo: errores.type, Descripción: errores.error, Línea: errores.line, Columna: errores.column });
     localStorage.setItem('errores_E', JSON.stringify(arr));
}

export function add_simbol_E(simbol_table) {
     let arr = JSON.parse(localStorage.getItem('simbtable_E'));
     arr.push({ Nombre: simbol_table.name, Tipo: simbol_table.type, Ambito: simbol_table.ambit, Fila: simbol_table.row, Columna: simbol_table.column });
     localStorage.setItem('simbtable_E', JSON.stringify(arr));
}

export function add_console(text) {
     let arr = localStorage.getItem('console');
     arr += text + "\n";
     localStorage.setItem('console', arr);
}

export function add_complex_def(simbol) {
     simbol.value = simbol.value.substring(0, 2);
     let arr = JSON.parse(localStorage.getItem('complex_simbols'));
     arr.push(simbol);
     localStorage.setItem('complex_simbols', JSON.stringify(arr));
}

export function add_complex_func(id, func) {
     let map = new Map(JSON.parse(localStorage.getItem('functions_complex')));
     map.set(id, func);
     localStorage.setItem('functions_complex', JSON.stringify(Array.from(map.entries())));
}

export function get_complex_func(func) {
     let map = new Map(JSON.parse(localStorage.getItem('functions_complex')));
     let d = map.get(func);
     return d;
}

export function add_running_function(id) {
     let arr = JSON.parse(localStorage.getItem('functions_running'));
     arr.push(id);
     localStorage.setItem('functions_running', JSON.stringify(arr));
}

export function remove_running_function() {
     let arr = JSON.parse(localStorage.getItem('functions_running'));
     arr.pop();
     localStorage.setItem('functions_running', JSON.stringify(arr));
}

export function is_running_function(func) {
     let arr = JSON.parse(localStorage.getItem('functions_running'));
     return arr.includes(func);
}

export function add_complex_def_ins(inst, complex) {

     switch (inst.constructor) {
          case Arithmetical:
               add_complex_def(new Value(complex.value, Type.ARITHMETICAL, Type.COMPLEX, complex.row, complex.column));
               break;
          case Break:
               add_complex_def(new Value(complex.value, Type.BREAK, Type.COMPLEX, complex.row, complex.column));
               break;
          case Call:
               add_complex_def(new Value(complex.value, Type.CALL, Type.COMPLEX, complex.row, complex.column));
               break;
          case Continue:
               add_complex_def(new Value(complex.value, Type.CONTINUE, Type.COMPLEX, complex.row, complex.column));
               break;
          case Declaration:
               add_complex_def(new Value(complex.value, Type.DECLARATION, Type.COMPLEX, complex.row, complex.column));
               break;
          case DoWhile:
               add_complex_def(new Value(complex.value, Type.DOWHILE, Type.COMPLEX, complex.row, complex.column));
               break;
          case For:
               add_complex_def(new Value(complex.value, Type.FOR, Type.COMPLEX, complex.row, complex.column));
               break;
          case Logical:
               add_complex_def(new Value(complex.value, Type.LOGICAL, Type.COMPLEX, complex.row, complex.column));
               break;
          case Print:
               add_complex_def(new Value(complex.value, Type.PRINT, Type.COMPLEX, complex.row, complex.column));
               break;
          case Relational:
               add_complex_def(new Value(complex.value, Type.RELATIONAL, Type.COMPLEX, complex.row, complex.column));
               break;
          case Return:
               add_complex_def(new Value(complex.value, Type.RETURN, Type.COMPLEX, complex.row, complex.column));
               break;
          case Switch:
               add_complex_def(new Value(complex.value, Type.SWITCH, Type.COMPLEX, complex.row, complex.column));
               break;
          case TernaryOperator:
               add_complex_def(new Value(complex.value, Type.TERNARY, Type.COMPLEX, complex.row, complex.column));
               break;
          case While:
               add_complex_def(new Value(complex.value, Type.WHILE, Type.COMPLEX, complex.row, complex.column));
               break;
          default:
               break;
     }
}

export function get_complex(node, row, column) {
     let arr = JSON.parse(localStorage.getItem('complex_simbols'));
     let complex = arr.filter(e => e.row === row && e.column === column)[0];
     if (complex) {
          /* vendors contains the element we're looking for */
          node.color = get_color(complex.value);
          node.row = row;
          node.column = column;
     }
}

function get_color(complex) {
     complex = complex.substring(0, 2);
     switch (complex) {
          case "CO":
               return "colorscheme=blues8 , color=2,";
          case "LO":
               return "colorscheme=blues8 , color=5,";
          case "LI":
               return "colorscheme=blues8 , color=8,";
          case "LL":
               return "color=orange,";
          case "CU":
               return "color=orange3,";
          case "AL":
               return "color=orangered,";
          case "EX":
               return "color=orangered3,";
          case "FA":
               return "color=red,";
          default:
               return "colorscheme=blues8 , color=2,";
     }
}