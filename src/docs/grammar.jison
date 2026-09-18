
%{
     let id = 0;
     let root;

     function createAST(root) {
          let ret = "digraph FLUJO_COMPLEJIDAD {node[shape=rectangle];\n";
          ret += loopAST(root);
          ret += "\n}";
          return ret;
     }

     function loopAST(root) {
          let ret = "";
          if (root != null) {
               //console.log(root.children.length);
               try{
                    if (root.children.length > 0) 
                    {
                         root.value = root.value.replace(/\"/g, "");
                         ret += root.id + "[ " + root.color + " label=\"" + root.value + "\"];\n"
                    }
               }catch(e){console.log(e)}
               for (let i = 0; i < root.children.length; i++) {

                    if (root.children.length > 0) {
                         try
                         {
                         root.children[i].value = root.children[i].value.replace(/\"/g, "");
                         root.children[i].value = root.children[i].value.replace(/\\/g, "#");
                         ret += root.children[i].id + "[ " + root.children[i].color + " label=\"" + root.children[i].value + "\"];\n"
                         ret += root.id + "->" + root.children[i].id + "\n";
                         ret += loopAST(root.children[i]);
                         }catch(e){console.log(e)}
                    }
               }
          }
          return ret;
     }

     function setTipeDeclaration(root, type) {
          if (root != null) {
               if(root.value === "DECLARACION"){
                    root.children.unshift(type);
                    return;
               }
                    
               for (let i = 0; i < root.children.length; i++) {

                    if (root.children.length > 0) {
                         loopAST(root.children[i]);
                    }
               }
          }
     }


     function check_to_add(node)
     {
          if(node.children.length === 1 && node.children[0].value === "epsilon")
               return false;
          else 
               return true;
     }
     /*
import Node from './clases/Node';
export 
     */
%}

/* Definición Léxica */
%lex

%options case-sensitive

%%

"//".*                              // comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] // comentario multiple líneas

//SIMBOLOS
//incremento y decremento
"++"              return 'incremento';
"--"              return 'decremento';

//aritmeticos
"+"              return 'suma';
"-"              return 'resta';   
"**"             return 'potencia';
"*"              return 'multiplicacion';
"/"              return 'slash';
"%"              return 'modulo';
"?"              return 'quest';

//relacionales
">="               return 'mayorigual';
"<="               return 'menorigual';
"<"                return 'menor';
">"                return 'mayor';
"==="              return 'referencias';
"=="               return 'identico';
"!="               return 'diferente';

//simbolos
"["              return 'llavea';     
"]"              return 'llavec';
"{"              return 'corchetea';     
"}"              return 'corchetec';
"("              return 'parenta';     
")"              return 'parentc';
","              return 'coma';
"."              return 'punto';
"="              return 'igual';
";"              return 'puntocoma';
":"              return 'dospuntos';

//logicos
"!"              return 'not';
"&&"              return 'and';
"||"              return 'or';



//Reservadas
"document.getElementById"             return 'ElbyID';
"null"                  return 'resnull';
"undefined"             return 'resundefined';
"function"              return 'resfunction';
"Array"                 return 'resarray';
"number"                return 'resnumber';
"let"                   return 'reslet';
"var"                   return 'resvar';
"const"                 return 'resconst';
"type"                  return 'restype';
"string"                return 'resstring';
"true"                  return 'restrue';
"false"                 return 'resfalse';
"if"                    return 'resif';
"else"                  return 'reselse';
"switch"                return 'resswitch';
"case"                  return 'rescase';
"default"               return 'resdefault';
"break"                 return 'resbreak';
"continue"              return 'rescontinue';
"return"                return 'resreturn';
"console.log"           return 'resprint';
"void"                  return 'resvoid';
"for"                   return 'resfor';
"while"                 return 'reswhile';
"do"                    return 'resdo';
"boolean"               return 'resboolean';
"in"                    return 'resin';
"of"                    return 'resof';
"push"                  return 'respush';
"pop"                   return 'respop';
"length"                return 'reslength';

/* Espacios en blanco */
[ \r\t\n]+                  {}
[0-9]+"."[0-9]+\b|[0-9]+\b    			                         return 'number';
([\"]("\\\""|[^"])*[^\\][\"])|[\"][\"]|[\'][^']*[\']|"`"[^`]*"`"        return 'cadena';
([a-zA-Z"_"])[a-z0-9A-Z"_""ñ""Ñ"]*                                    return 'id';
<<EOF>>                 return 'EOF';

.                       { }
/lex

/* Asociación de operadores y precedencia */

%right igual
%left incremento
%left decremento
%left or, quest
%left and
%left identico, diferente, referencias
%left mayor, menor, mayorigual, menorigual
%left suma, resta
%left multiplicacion, slash,modulo
%right potencia
%right not
%left parenta,parentc,llavea,llavec

%start ini

%% /* Definición de la gramática */

ini
	: INSTRUCTIONSG EOF { root = $1; let arbol = createAST(root); return arbol;}
     | EOF
;

INSTRUCTIONSG
	: INSTRUCTIONG INSTRUCTIONSG { if($2.value === "INSTRUCTIONS"){ $2.children.unshift($1); $$ = $2; } else { $$ = new Node(id++,"INSTRUCTIONS"); $$.children.push($1); $$.children.push($2); }}
	| INSTRUCTIONG {$$ = $1;}
;

INSTRUCTIONG
	: FUNCTION {$$ = $1;}
     | DECLARATION puntocoma {$$ = $1;}
     | ASSIGMENTWITHTYPE {$$ = $1;}
     | IF {$$ = $1;}
     | SWITCH {$$ = $1;}
     | WHILE {$$ = $1;}
     | DOWHILE puntocoma {$$ = $1;}
     | FOR {$$ = $1;}
     | PRINT puntocoma {$$ = $1;}
     | CALLF puntocoma {$$ = $1;}
     | error { /*this is error*/ console.log($1); }
;

FUNCTION
    : resfunction id parenta LISTAPARAMETROS parentc BLOCK {$$ = new Node(id++,"FUNCION");  $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3)); $$.children.push($4); $$.children.push(new Node(id++,$5)); $$.children.push($6);}
    | resfunction id parenta parentc BLOCK {$$ = new Node(id++,"FUNCION"); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3)); $$.children.push(new Node(id++,$4)); $$.children.push($5);}
;

TYPE
     : resinteger {$$ = new Node(id++,"TYPE"); $$.children.push(new Node(id++,$1)); }
     | resboolean {$$ = new Node(id++,"TYPE"); $$.children.push(new Node(id++,$1)); }
     | resstring {$$ = new Node(id++,"TYPE"); $$.children.push(new Node(id++,$1)); }
     | id {$$ = new Node(id++,"TYPE"); $$.children.push(new Node(id++,$1)); }
     | resnumber {$$ = new Node(id++,"TYPE"); $$.children.push(new Node(id++,$1)); }
     | resundefined {$$ = new Node(id++,"TYPE"); $$.children.push(new Node(id++,$1)); }
;

MULTIDIMENSION
     : llavea llavec MULTIDIMENSION {$$ = new Node(id++,"MULTIDIMENSION"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push($3); }
     | llavea llavec {$$ = new Node(id++,"MULTIDIMENSION"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2));}
;

LISTAPARAMETROS
     : LSPBETHA LISTAPARAMETROSPRIM { $$ = new Node(id++,"LISTAPARAMETROS"); $$.children.push($1); $2.forEach( e => $$.children.push(e)); }
;

LISTAPARAMETROSPRIM
     : LSALPHA LISTAPARAMETROSPRIM { $$ = []; $$.push($1); $2.forEach( e => $$.push(e)); }
     | { $$ = []; }
;

LSPBETHA
     : id { $$ = new Node(id++,$1); }
;

LSALPHA
     : coma id { $$ = new Node(id++,$2); }
;

TYPEVAR
     : resconst {$$ = new Node(id++,"TIPO"); $$.children.push(new Node(id++,$1)); }
     | reslet {$$ = new Node(id++,"TIPO"); $$.children.push(new Node(id++,$1)); }
     | resvar {$$ = new Node(id++,"TIPO"); $$.children.push(new Node(id++,$1)); }
;

DECLARATION
     : TYPEVAR LISTID {$$ = $2; setTipeDeclaration($2, $1);}
;

LISTID
     : LISPBETHA LISTIDPRIM { if(check_to_add($2)){$$ = $2; $$.children.push($1);}else{$$ = $1;} }
;

LISTIDPRIM
     : LISALPHA LISTIDPRIM { if(check_to_add($2)){$$ = $2; $$.children.push($1);}else{$$ = new Node(id++,"Multiple Declaracion"); $$.children.push($1);} }
     | { $$ = new Node(id++,"DECLARACION"); $$.children.push(new Node(id++,"epsilon")); }
;

LISPBETHA
     : id ASSVALUE {$$ = new Node(id++,"DECLARACION"); let n1 = new Node(id++,"NOMBRE"); n1.children.push(new Node(id++,$1)); $$.children.push(n1); if(check_to_add($2)){$$.children.push($2);} get_complex($$, this._$.first_line, this._$.first_column); }
;

LISALPHA
     : coma id ASSVALUE {$$ = new Node(id++,"DECLARACION"); let n2 = new Node(id++,"NOMBRE"); n2.children.push(new Node(id++,$2)); $$.children.push(n2); if(check_to_add($3)){$$.children.push($3);} get_complex($$, this._$.first_line, this._$.first_column);}
;

ASSVALUE
     : igual EXPRT {$$ = new Node(id++,"VALOR");$$.children.push($2);}
     | igual llavea llavec {$$ = new Node(id++,"VALOR"); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3));}
     | igual llavea DATAPRINT llavec {$$ = new Node(id++,"VALOR"); $$.children.push(new Node(id++,$2)); $$.children.push($3); $$.children.push(new Node(id++,$4));}
     | igual DECASSTYPE {$$ = new Node(id++,"CONTENTASWT"); $$.children.push($2);}
     | {$$ = new Node(id++,"VALOR"); $$.children.push(new Node(id++,"epsilon"));}
;

BLOCK
     : corchetea BLOCK2 {$$ = new Node(id++,"BLOCK");$$.children.push(new Node(id++,'{'));if(check_to_add($2) === true)$$.children.push($2); $$.children.push(new Node(id++,'}'));}
;

BLOCK2
     : INSTRUCTIONS corchetec {$$ = $1;}
     | corchetec {$$ = new Node(id++,"epsilon"); $$.children.push(new Node(id++,"epsilon"));}
;


INSTRUCTIONS
     : INSTRUCTION INSTRUCTIONS {$$ = new Node(id++,"INSTRUCTION");$$.children.push($1); $$.children.push($2);}
     | INSTRUCTION {$$ = new Node(id++,"INSTRUCTION");$$.children.push($1);}
;

INSTRUCTION
     : DECLARATION puntocoma {$$ = $1;}
     | ASSIGMENTWITHTYPE {$$ = $1;}
     | IF {$$ = $1;}
     | SWITCH {$$ = $1;}
     | WHILE {$$ = $1;}
     | DOWHILE puntocoma {$$ = $1;}
     | FOR {$$ = $1;}
     | PRINT puntocoma 
     | CALLF puntocoma {$$ = $1;}
     | resbreak puntocoma {$$ = new Node(id++,"BREAK");}
     | rescontinue puntocoma {$$ = new Node(id++,"CONTINUE");}
     | resreturn EXPRT puntocoma {$$ = new Node(id++,"RETURN");$$.children.push($2);}
     | resreturn puntocoma {$$ = new Node(id++,"RETURN");}
     | error { /*this is error*/ console.log($1); }
;

ASSIGNMENT
    : IDVALOR OPERADOR igual EXPRT {$$ = new Node(id++,"ASSIGNMENT"); $$.children.push($1); $$.children.push($2); $$.children.push(new Node(id++,$3)); $$.children.push($4); get_complex($$, this._$.first_line, this._$.first_column); }
    | id DECINC {$$ = new Node(id++,"ASSIGNMENT"); $$.children.push(new Node(id++,$1)); $$.children.push($2); get_complex($$, this._$.first_line, this._$.first_column); }
    | IDVALOR igual EXPRT { $$ = new Node(id++,"ASSIGNMENT"); $$.children.push($1); $$.children.push(new Node(id++,$2)); $$.children.push($3); get_complex($$, this._$.first_line, this._$.first_column); }
;

OPERADOR
     : suma {$$ = new Node(id++,"OPERADOR"); $$.children.push(new Node(id++,$1)); }
     | resta {$$ = new Node(id++,"OPERADOR"); $$.children.push(new Node(id++,$1)); }
     | potencia {$$ = new Node(id++,"OPERADOR"); $$.children.push(new Node(id++,$1)); }
     | multiplicacion {$$ = new Node(id++,"OPERADOR"); $$.children.push(new Node(id++,$1)); }
     | slash {$$ = new Node(id++,"OPERADOR"); $$.children.push(new Node(id++,$1)); }
     | modulo {$$ = new Node(id++,"OPERADOR"); $$.children.push(new Node(id++,$1)); }
;

ASSIGMENTWITHTYPE
     : IDVALOR CONTENTASWT puntocoma {$$ = new Node(id++,"ASSIGMENTWITHTYPE"); $$.children.push($1); $$.children.push($2); $$.children.push(new Node(id++,$3));}
     | ASSIGNMENT puntocoma { $$ = $1; $$.children.push(new Node(id++,$2));}
     | IDVALORASS puntocoma { $$ = $1; $$.children.push(new Node(id++,$2));}
;

CONTENTASWT
     : igual llavea llavec {$$ = new Node(id++,"VALOR"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3));}
     | igual DECASSTYPE {$$ = new Node(id++,"VALOR "); $$.children.push(new Node(id++,$1)); $$.children.push($2);}
;

DECASSTYPE
     : corchetea ASSIGNMENTTYPE   {$$ = $2;}
;

ASSIGNMENTTYPE
     : id dospuntos VALUETYPE ASSIGNMENTTYPEPRIM  { let a1 = new Node(id++,"ATRIBUTO"); a1.children.push(new Node(id++,$1)); a1.children.push(new Node(id++,$2)); a1.children.push($3); if(check_to_add($4) === true){$$ = $4; $$.children.unshift(a1); } else $$ = a1; }
;

ASSIGNMENTTYPEPRIM
     : coma id dospuntos VALUETYPE ASSIGNMENTTYPEPRIM  { let a = new Node(id++,"ATRIBUTO"); a.children.push(new Node(id++,$2)); a.children.push(new Node(id++,$3)); a.children.push($4); if(check_to_add($5) === true){$$ = new Node(id++,"ATRIBUTOS"); $$.children.push(a); $$.children.push($5); } else $$ = a; }
     | corchetec {$$ = new Node(id++,"epsilon"); $$.children.push(new Node(id++,"epsilon"));}
;

VALUETYPE 
     : EXPRT {$$ = new Node(id++,"VALOR"); $$.children.push($1);}
     | DECASSTYPE {$$ = new Node(id++,"VALOR"); $$.children.push($1);}
;


PARAMETROUNITARIO
     : parenta EXPRT parentc {$$ = new Node(id++,"CONDICION"); $$.children.push(new Node(id++,"(")); $$.children.push($2); $$.children.push(new Node(id++,")"));}
;

IF
     : CELSE ELSE {$$ = new Node(id++,"SENTENCIA"); $$.children.push($1); if(check_to_add($2) === true){$$.children.push($2);}}
;

CELSE
     : CELSE reselse IFF {$$ = new Node(id++,"CELSE"); $$.children.push($1); $$.children.push(new Node(id++,"ELSE")); $$.children.push($3);}
     | IFF { $$ = $1;}
;

ELSE
     : reselse BLOCK {$$ = new Node(id++,"ELSE"); $$.children.push($2);}
     | {$$ = new Node(id++,"ELSE"); $$.children.push(new Node(id++,"epsilon"));}
;

IFF
     : resif PARAMETROUNITARIO BLOCK {$$ = new Node(id++,"IF"); $$.children.push($2); $$.children.push($3);}
;

SWITCH
     : resswitch PARAMETROUNITARIO corchetea CASES DEFAULT corchetec {$$ = new Node(id++,"SWITCH"); $$.children.push(new Node(id++,"switch")); $$.children.push($2); $$.children.push(new Node(id++,"{")); $$.children.push($4); if(check_to_add($5) === true){$$.children.push($5);} $$.children.push(new Node(id++,"}"));}
;

CASES
     : CASES rescase EXPRT dospuntos INSTRUCTIONS {$$ = new Node(id++,"CASES"); $$.children.push($1); $$.children.push(new Node(id++,"case")); $$.children.push($3); $$.children.push(new Node(id++,":")); $$.children.push($5);}
     | CASES rescase EXPRT dospuntos {$$ = new Node(id++,"CASES"); $$.children.push($1); $$.children.push(new Node(id++,"case")); $$.children.push($3); $$.children.push(new Node(id++,":"));}
     | rescase EXPRT dospuntos INSTRUCTIONS {$$ = new Node(id++,"CASES"); $$.children.push(new Node(id++,"case")); $$.children.push($2); $$.children.push(new Node(id++,":")); $$.children.push($4);}
     | rescase EXPRT dospuntos {$$ = new Node(id++,"CASES"); $$.children.push(new Node(id++,"case")); $$.children.push($2); $$.children.push(new Node(id++,":")); }
;

DEFAULT
     : resdefault dospuntos INSTRUCTIONS {$$ = new Node(id++,"DEFAULT"); $$.children.push(new Node(id++,"default")); $$.children.push(new Node(id++,":")); $$.children.push($3);}
     | resdefault dospuntos {$$ = new Node(id++,"DEFAULT"); $$.children.push(new Node(id++,"default")); $$.children.push(new Node(id++,":"));}
     | {$$ = new Node(id++,"DEFAULT"); $$.children.push(new Node(id++,"epsilon"));}
;

WHILE
     : reswhile PARAMETROUNITARIO BLOCK {$$ = new Node(id++,"WHILE"); $$.children.push($2); $$.children.push($3);}
;

DOWHILE
     : resdo BLOCK reswhile PARAMETROUNITARIO {$$ = new Node(id++,"DOWHILE"); $$.children.push(new Node(id++,"do")); $$.children.push($2); $$.children.push(new Node(id++,"while")); $$.children.push($4);}
;

FOR
     : resfor parenta DECFOR puntocoma EXPRTFOR puntocoma ASSIGFOR parentc BLOCK {$$ = new Node(id++,"FOR");$$.children.push(new Node(id++,'for'));$$.children.push(new Node(id++,'('));if(check_to_add($3) === true){$$.children.push($3);}$$.children.push(new Node(id++,';'));if(check_to_add($5) === true)$$.children.push($5);$$.children.push(new Node(id++,';'));if(check_to_add($7) === true)$$.children.push($7);$$.children.push(new Node(id++,')'));$$.children.push($9); get_complex($$, this._$.first_line, this._$.first_column);}
     | resfor parenta FINONDEC FINON EXP parentc BLOCK { $$ = new Node(id++,"FOR");$$.children.push(new Node(id++,'for'));$$.children.push(new Node(id++,'('));$$.children.push($3);$$.children.push($4);$$.children.push($5);$$.children.push(new Node(id++,')'));$$.children.push($7); get_complex($$, this._$.first_line, this._$.first_column);}
;

FINONDEC
     : TYPEVAR id { $$ = new Node(id++,"DEC"); $$.children.push($1); $$.children.push(new Node(id++,$2)); }
     | id { $$ = new Node(id++,"ASIGN"); $$.children.push(new Node(id++,$1)); }
;

ASSIGFOR
    : ASSIGNMENT {$$ = $1;}
    | {$$ = new Node(id++,"epsilon"); $$.children.push(new Node(id++,"epsilon"));}
;

EXPRTFOR
     : EXPRT {$$ = $1;}
     | {$$ = new Node(id++,"epsilon"); $$.children.push(new Node(id++,"epsilon"));}
;

DECFOR
    : DECLARATION {$$ = new Node(id++,"DEC"); $$.children.push($1);}
    | ASSIGNMENT {$$ = new Node(id++,"DEC"); $$.children.push($1);}
    | {$$ = new Node(id++,"DEC"); $$.children.push(new Node(id++,"epsilon"));}
;

FINON
     :resof {$$ = new Node(id++,"FINON"); $$.children.push(new Node(id++,$1));}
     |resin {$$ = new Node(id++,"FINON"); $$.children.push(new Node(id++,$1));}
;

DECINC
     :incremento {$$ = new Node(id++,"DECINC"); $$.children.push(new Node(id++,$1));}
     |decremento {$$ = new Node(id++,"DECINC"); $$.children.push(new Node(id++,$1));}
;

PRINT
    : resprint parenta DATAPRINT parentc {$$ = new Node(id++,"PRINT");$$.children.push(new Node(id++,$1));$$.children.push(new Node(id++,"("));$$.children.push($3); $$.children.push(new Node(id++,")")); get_complex($$, this._$.first_line, this._$.first_column); }
;

DATAPRINT
     : EXPRT coma DATAPRINT {$$ = new Node(id++,"DATAPRINT"); $$.children.push($1); $$.children.push(new Node(id++,$2)); $$.children.push($3);}
     | EXPRT {$$ = new Node(id++,"DATAPRINT"); $$.children.push($1);}
;

EXPRT
	: EXPRT or EXPRT {$$ = new Node(id++,"OR"); $$.children.push($1); $$.children.push(new Node(id++,$2)); $$.children.push($3);}
     | EXPRT quest EXPRT dospuntos EXPRT {$$ = new Node(id++,"TERNARIO"); $$.children.push($1); $$.children.push(new Node(id++,$2)); $$.children.push($3); $$.children.push(new Node(id++,$4)); $$.children.push($5);}
     | EXPRT2 {$$ = $1;}
;

EXPRT2
     : EXPRT2 and EXPRT2 {$$ = new Node(id++,"AND"); $$.children.push($1); $$.children.push(new Node(id++,$2)); $$.children.push($3);}
     | EXPR {$$ = $1;}
;
//-----------------------------------------------------------------------------------------------------------

//producciones para las operaciones relacionales
EXPR
	: EXPR diferente EXPR {$$ = new Node(id++,"DIFERENTE"); $$.children.push($1); $$.children.push(new Node(id++,"!=")); $$.children.push($3);}
     | EXPR identico EXPR {$$ = new Node(id++,"IGUAL"); $$.children.push($1); $$.children.push(new Node(id++,"==")); $$.children.push($3);}
	| EXPR referencias EXPR {$$ = new Node(id++,"IDENTICO"); $$.children.push($1); $$.children.push(new Node(id++,"===")); $$.children.push($3);}
     | EXPR1 {$$ = $1;}
;

EXPR1
     : EXPR1 mayor EXPR1 {$$ = new Node(id++,"MAYOR"); $$.children.push($1); $$.children.push(new Node(id++,">")); $$.children.push($3);}
     | EXPR1 menor EXPR1 {$$ = new Node(id++,"MENOR"); $$.children.push($1); $$.children.push(new Node(id++,"<")); $$.children.push($3);}
     | EXPR1 mayorigual EXPR1 {$$ = new Node(id++,"MAYOR IGUAL"); $$.children.push($1); $$.children.push(new Node(id++,">=")); $$.children.push($3);}
     | EXPR1 menorigual EXPR1 {$$ = new Node(id++,"MENOR IGUAL"); $$.children.push($1); $$.children.push(new Node(id++,"<=")); $$.children.push($3);}
     | EXP {$$ = $1;}
;
//-----------------------------------------------------------------------------------------------------------

//producciones para operaciones aritmeticas
EXP  
     : EXP suma EXP {$$ = new Node(id++,"SUMA"); $$.children.push($1); $$.children.push(new Node(id++,"+")); $$.children.push($3);}
     | EXP resta EXP {$$ = new Node(id++,"RESTA"); $$.children.push($1); $$.children.push(new Node(id++,"-")); $$.children.push($3);}
     | EXP1 {$$ = $1;}
;

EXP1 
     : EXP1 multiplicacion EXP1 {$$ = new Node(id++,"MULTIPLICACIÓPN"); $$.children.push($1); $$.children.push(new Node(id++,"*")); $$.children.push($3);}
     | EXP1 slash EXP1 {$$ = new Node(id++,"DIVISIÓN"); $$.children.push($1); $$.children.push(new Node(id++,"/")); $$.children.push($3);}
     | EXP1 modulo EXP1 {$$ = new Node(id++,"MODULO"); $$.children.push($1); $$.children.push(new Node(id++,"%")); $$.children.push($3);}
     | EXP1 potencia EXP1 {$$ = new Node(id++,"POTENCIA"); $$.children.push($1); $$.children.push(new Node(id++,"^")); $$.children.push($3);}
     | EXP2 {$$ = $1;}
;

EXP2
     : not EXP2 {$$ = new Node(id++,"NEGACIÓN");$$.children.push(new Node(id++,$1)); $$.children.push($2);}
     | EXP3 {$$ = $1;}
;

EXP3
     : number {$$ = new Node(id++,$1);}
     | resta number {$$ = new Node(id++,"EXP3");$$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2));}
     | resta IDVALOR {$$ = new Node(id++,"EXP3");$$.children.push(new Node(id++,$1)); $$.children.push($2);}
     | parenta EXPRT parentc {$$ = new Node(id++,"EXP3");$$.children.push(new Node(id++,"("));$$.children.push($2); $$.children.push(new Node(id++,")"));}
     | cadena {$$ = new Node(id++,$1);}
     | restrue {$$ = new Node(id++,$1);}
     | resfalse {$$ = new Node(id++,$1);}
     | CALLF {$$ = $1;}
     | resnull {$$ = new Node(id++,$1);}
     | resundefined {$$ = new Node(id++,$1);}
     | IDVALOR {$$ = $1;}
     | IDVALOR DECINC {$$ = new Node(id++,"EXP3"); $$.children.push($1); $$.children.push($2);}
     | ElbyID parenta EXPRT parentc {$$ = new Node(id++,"EXP3"); $$.children.push(new Node(id++,"document")); $$.children.push(new Node(id++,".")); $$.children.push(new Node(id++,"getElementById")); $$.children.push(new Node(id++,"("));$$.children.push($2); $$.children.push(new Node(id++,")"));}
;

IDVALOR  
     : id IDVALOR2 {$$ = new Node(id++,"IDVALOR");$$.children.push(new Node(id++,$1)); if(check_to_add($2) === true){$$.children.push($2);}}
     | id ARREGLO IDVALOR2 {$$ = new Node(id++,"IDVALOR"); $$.children.push(new Node(id++,$1));  $$.children.push($2); $$.children.push($3);}
;

ARREGLO
     : llavea EXPRT llavec ARREGLO {$$ = new Node(id++,"ARREGLO"); $$.children.push(new Node(id++,$1)); $$.children.push($2); $$.children.push(new Node(id++,$3)); $$.children.push($4); }
     | llavea EXPRT llavec {$$ = new Node(id++,"ARREGLO"); $$.children.push(new Node(id++,$1)); $$.children.push($2); $$.children.push(new Node(id++,$3)); }
;

IDVALOR2
     : punto IDVALOR {$$ = new Node(id++,"IDVALOR2");$$.children.push(new Node(id++,$1)); $$.children.push($2);}
     | punto respop parenta parentc {$$ = new Node(id++,"IDVALOR2"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3)); $$.children.push(new Node(id++,$4));}
     | punto reslength {$$ = new Node(id++,"IDVALOR2"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2));}
     | punto CALLF {$$ = $2;}
     | {$$ = new Node(id++,"IDVALOR2"); $$.children.push(new Node(id++,"epsilon"));}
;

CALLF
     :id parenta PARAMETERS {$$ = new Node(id++,"CALLF"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push($3); }
;

PARAMETERS
     : EXPRT PARAMETERSPRIM  {$$ = new Node(id++,"PARAMETROS"); $$.children.push($1); if(check_to_add($2) === true){$$.children.push($2);} }
     | parentc { $$ = new Node(id++,"IDVALOR2"); $$.children.push(new Node(id++,"epsilon")); }
;

PARAMETERSPRIM
     : coma EXPRT PARAMETERSPRIM {$$ = new Node(id++,"IDVALOR"); $$.children.push(new Node(id++,$1)); $$.children.push($2); if(check_to_add($3) === true){$$.children.push($3);} }
     | parentc { $$ = new Node(id++,"IDVALOR2"); $$.children.push(new Node(id++,"epsilon")); }
;

IDVALORASS  
     : id IDVALOR2ASS {$$ = new Node(id++,"IDVALORASS");$$.children.push(new Node(id++,$1)); if(check_to_add($2) === true){$$.children.push($2);}}
     | id ARREGLO IDVALOR2ASS {$$ = new Node(id++,"IDVALORASS"); $$.children.push(new Node(id++,$1));  $$.children.push($2); $$.children.push($3);}
;

IDVALOR2ASS
     : punto IDVALORASS {$$ = new Node(id++,"IDVALOR2ASS");$$.children.push(new Node(id++,$1)); $$.children.push($2);}
     | punto respush parenta EXPRT parentc {$$ = new Node(id++,"IDVALOR2ASS"); $$.children.push(new Node(id++,$1)); $$.children.push(new Node(id++,$2)); $$.children.push(new Node(id++,$3)); $$.children.push($4); $$.children.push(new Node(id++,$5));}
;