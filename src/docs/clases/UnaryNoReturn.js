import Type from'./Type';
import Value from'./Value';
import { add_error_E, add_simbol_E } from './Reports';

class UnaryNoReturn{
   constructor(_id, _type, _row, _col){
      this.id = _id;
      this.type = _type;
      this.row = _row;
      this.column = _col;
   }

   operate(tab){
      let a;
      let complex = new Value("CO", Type.COMPLEX, Type.VALOR, this.row, this.column);
      if(this.id instanceof Array)
      {
         a = tab.getSymbol(this.id[0].value);
      }else
         a = tab.getSymbol(this.id);

      if(a === null && this.type)
      {
         try{ add_error_E( {error: "EXPRESION INVALIDA para el operador unario se esperaba ENTERO o DECIMAL.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
      }
      else if(a.type === Type.ENTERO || a.type === Type.UNKNOWN)
      {
         if (this.type === Type.INCREMENTO) {
            a.value = "CO/PLI";
            complex.value = "CO/PLI";
         }else if (this.type === Type.DECREMENTO) {
            a.value = "CO/NLI";
            complex.value = "CO/NLI";
         }

         if(a.type === Type.UNKNOWN)
            a.type = Type.ENTERO;
         return complex;
      }
      else if (a.type === Type.ARREGLO && this.type === ".push()")
      {
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
                               aux_return = r.value[this.id[i].positions[j].value];
                               if(i === this.id.length - 2)
                               {
                                  let s = this.id[this.id.length - 1].operate(tab);
    
                                  if(aux_return.type === Type.ARREGLO)
                                  {
                                     aux_return.value.push(s);
                                  }else if(aux_return.type === undefined && aux_return.value === undefined)
                                  {
                                     aux_return.type = Type.ARREGLO;
                                     aux_return.value = [];
                                     aux_return.value.push(s);
                                  }
                                  return complex;
                               }
                            }catch(e){ console.log(e); try{ add_error_E( {error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); } return null;}
                           j++;
                           while(j < this.id[i].positions.length)
                           {
                               try
                               {
                                   aux_return = r.value[this.id[i].positions[j].value];
                                   if(i === this.id.length - 2)
                                   {
                                    let s = this.id[this.id.length - 1].operate(tab);
        
                                      if(aux_return.type === Type.ARREGLO)
                                      {
                                         aux_return.value.push(s);
                                      }else if(aux_return.type === undefined && aux_return.value === undefined)
                                      {
                                         aux_return.type = Type.ARREGLO;
                                         aux_return.value = [];
                                         aux_return.value.push(s);
                                      }
                                      return complex;
                                   }
                                  }catch(e){ console.log(e); }
                               j++;
                           }
                        }else
                        {
                           aux_return = r;
                           if(i === this.id.length - 2)
                           {
                              let s = this.id[this.id.length - 1].operate(tab);

                              if(aux_return.type === Type.ARREGLO)
                              {
                                 aux_return.value.push(s);
                              }else if(aux_return.type === undefined && aux_return.value === undefined)
                              {
                                 aux_return.type = Type.ARREGLO;
                                 aux_return.value = [];
                                 aux_return.value.push(s);
                              }
                              return complex;
                           }
                        }

                     }else if(r.type === Type.ID)
                     {
                        aux_return = r;
                     }
                  }else {
                     try{ add_error_E( {error: "La variable: " + this.id.toString() + "no a sido encontrada", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                     return null;
                  }
               }else
               {
                   try
                   {
                       let find = false;
                       for(let dat of aux_return)
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
                           return null;
                       }

                       if(this.id[i].type === Type.ARREGLO)
                       {
                           aux_return = aux_return.value
                           let j = 0;
                           try
                           {
                              aux_return = aux_return.value[this.id[i].positions[j].value];
                              if(i === this.id.length - 2)
                              {
                                 let s = this.id[this.id.length - 1].operate(tab);
   
                                 if(aux_return.type === Type.ARREGLO)
                                 {
                                    aux_return.value.push(s);
                                 }else if(aux_return.type === undefined && aux_return.value === undefined)
                                 {
                                    aux_return.type = Type.ARREGLO;
                                    aux_return.value = [];
                                    aux_return.value.push(s);
                                 }
                                 return complex;
                              }
                           }catch(e){ console.log(e); try{ add_error_E( {error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); } return null;}
                           j++;
                           while(j < this.id[i].positions.length)
                           {
                              try
                              {
                                 aux_return = aux_return.value[this.id[i].positions[j].value];
                                 if(i === this.id.length - 2)
                                 {
                                    let s = this.id[this.id.length - 1].operate(tab);
      
                                    if(aux_return.type === Type.ARREGLO)
                                    {
                                       aux_return.value.push(s);
                                    }else if(aux_return.type === undefined && aux_return.value === undefined)
                                    {
                                       aux_return.type = Type.ARREGLO;
                                       aux_return.value = [];
                                       aux_return.value.push(s);
                                    }
                                    return complex;
                                 }
                              }catch(e){ console.log(e); }
                              j++;
                           }
                       }
                   }catch(e){ console.log(e); try{ add_error_E( {error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); } return null;}

               }
               i = i + 1;
            }     
         }
      }
      return complex;      
   }
}


export default UnaryNoReturn;