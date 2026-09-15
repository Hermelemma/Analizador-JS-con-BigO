const optionsMenu = [
    {
        "key": "0",
        "label": "Instrucciones Básicas",
        "data": "Instrucciones Folder",
        "icon": "pi pi-fw pi-inbox",
        "children":
            [
                { "key": "0-0", "label": "Declaración", "icon": "pi pi-fw pi-calendar-plus" },
                { "key": "0-1", "label": "Asignación", "icon": "pi pi-fw pi-calendar-plus" }
            ]
    },
    {
        "key": "1",
        "label": "Ciclos e Iteraciones",
        "data": "CEI Folder",
        "icon": "pi pi-fw pi-calendar",
        "children":
            [
                { "key": "1-0", "label": "For", "icon": "pi pi-fw pi-calendar-plus" },
                { "key": "1-1", "label": "For-In", "icon": "pi pi-fw pi-calendar-plus" },
                { "key": "1-2", "label": "For-Of", "icon": "pi pi-fw pi-calendar-plus" },
                { "key": "1-3", "label": "While", "icon": "pi pi-fw pi-calendar-plus" },
                { "key": "1-4", "label": "Do-While", "icon": "pi pi-fw pi-calendar-plus" }
            ]
    },
    {
        "key": "2",
        "label": "Funciones",
        "data": "Funciones Folder",
        "icon": "pi pi-fw pi-calendar",
        "children":
            [
                { "key": "2-0", "label": "Fibonacci", "icon": "pi pi-fw pi-calendar-plus" },
                { "key": "2-1", "label": "QuickSort", "icon": "pi pi-fw pi-calendar-plus" },
            ]
    }
]

const valueMenu = {
declaracion:
`//Declaración de un objeto.
let persona = {
    nombre : "Hola mi nombre es Carlos!",
    edad : 16,
    altura : "1.7 metros"
};

//Declaración de una variable.
let m = persona.nombre;
console.log(m);
console.log("Tengo " + persona.edad + "años de edad.");

//Declaración de una cosntante.
const uno = 1;

//Declaración de una variable.
var n = 5 * uno;

//Declaración de un arreglo.
let arr = ["nueve", 8, "siete", 6, persona.nombre];
console.log(arr[4]);`,
asignacion:
`//Es necesario realizar una declaración primero.
let persona = {
    nombre : "Hola mi nombre es Carlos!",
    edad : 20,
    altura : "1.7 metros"
};

//Procedemos a realizar la asignación.
persona.nombre = "Hola mi nombre es Carlos Lopez!";
persona.edad = 18;
persona.altura = "1.72 metros";`,
for:
`// For Estandar
for(let i = 0; i < 10; i++){
  console.log(i);
}

let j = 0;
for(;j < 1;){
  j++;
  console.log(j);
}

// For infinito
for(;;){
  console.log("Enciclado");
}

for(;;j++){
  console.log(j);
}`,
forIn:
`// For in
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
for(let elemento in arr){
  console.log(elemento);
}

let aux;
for(aux in arr){
  console.log(aux);
}`,
forOf:
`// For of
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
for(let elemento of arr){
  console.log(elemento);
}

let aux;
for(aux of arr){
  console.log(aux);
}`,
while:
`// While
let d = 0;
let salida = false;

while(d < 1 && salida === true){
  if(salida == false){
    d = d + 5;
  }else if(d === 1){
    d = s + 1;
  }else if(salida == true){
    break;
  }else if(salida == true && d === 5){
    d = 1;
  }else{
    d++;
  }
}

//While true
while(true){
  console.log("ciclo infinito");

}`,
doWhile:
`// DoWhile
let d = 0;
let salida = false;

do{
  if(salida == false){
    d = d + 5;
  }else if(d === 1){
    d = s + 1;
  }else if(salida == true){
    break;
  }else if(salida == true && d === 5){
    d = 5;
    break;
  }
   d++;
}while(d < 1 && salida === true);`,
fibonacci:
`//Función para calcular la secuencia de fibonacci
function fibonacci(numero) {
  if(numero < 2) {
      return numero;
  }
  else {
      return fibonacci(numero-1) + fibonacci(numero - 2);
  }
}`,
quickSort:
`//Algoritmo de ordenamiento QuickSort
var array = [8, 2, 5, 7, 4, 3, 12, 6, 19, 11, 10, 13, 9];
quickSort(array, 0, array.length -1);


function  quickSort(arr, left, right)
{
	var i = left;
	var j = right;
	var tmp;
	pivotidx = (left + right) / 2; 
	var pivot = parseInt(arr[pivotidx.toFixed()]);  
	/* partition */
	while (i <= j)
	{
		while (parseInt(arr[i]) < pivot) {
 		  i++;
 		}
		while (parseInt(arr[j]) > pivot) {
		  j--;
		}
		if (i <= j)
		{
			tmp = arr[i];
			arr[i] = arr[j];
			arr[j] = tmp;
			i++;
			j--;
		}
	}

	/* recursion */
	if (left < j) {
	  quickSort(arr, left, j);
	}
	if (i < right) {
	  quickSort(arr, i, right);
	}
	return arr;
}`
}

const notacionDiagrama =
    `
digraph Notacion_Diagrama_de_Flujo {
    rankdir="LR";
    splines=ortho;
    node [shape=box];

    //Nodos
    co [shape=box, colorscheme=blues8 , color=2, label="Instrucción"];
    cod [label="Constante"];
    cop [label="No"];
    
    lo [shape=box, colorscheme=blues8 , color=5, label="Instrucción"];
    lod [label="logarítmico"];
    lop [label="No"];

    li [shape=box, colorscheme=blues8 , color=8, label="Instrucción"];
    lid [label="lineal"];
    lip [label="No"];

    llo [shape=box, color=orange, label="Instrucción"];
    llod [label="logarítmico lineal"];
    llop [label="No"];
    
    cu [shape=box, color=orange3, label="Instrucción"];
    cud [label="cuadrático"];
    cup [label="Si"];
    
    al [shape=box, color=orangered, label="Instrucción"];
    ald [label="Algebraico"];
    alp [label="Si"];
    
    ex [shape=box, color=orangered3, label="Instrucción"];
    exd [label="Exponencial"];
    exp [label="Si"];
    
    fa [shape=box, color=red, label="Instrucción"];
    fad [label="Factorial"];
    fap [label="Si"];

    ni [shape=box, color=black, label="Etiqueta"];
    nid [label="No Aplica"];
    nip [label="No Aplica"];
    
    //Complejidad
    co -> cod [label="Complejidad"];
    lo -> lod [label="Complejidad"];
    llo -> llod [label="Complejidad"];
    cu -> cud [label="Complejidad"];
    al -> ald [label="Complejidad"];
    ex -> exd [label="Complejidad"];
    fa -> fad [label="Complejidad"];
    li -> lid [label="Complejidad"];
    ni -> nid [label="Complejidad"];
    //punto de mejora
    cod -> cop [label="¿Punto de Mejora?"];
    lod -> lop [label="¿Punto de Mejora?"];
    llod -> llop [label="¿Punto de Mejora?"];
    cud -> cup [label="¿Punto de Mejora?"];
    ald -> alp [label="¿Punto de Mejora?"];
    exd -> exp [label="¿Punto de Mejora?"];
    fad -> fap [label="¿Punto de Mejora?"];
    lid -> lip [label="¿Punto de Mejora?"];
    nid -> nip [label="¿Punto de Mejora?"];
}
`;

const columnsTable = [
    {header: "Tipo", field: "tipo"},
    {header: "¿Punto de mejora?", field: "mejora"},
    {header: "Fila", field: "fila"},
    {header: "Columna", field: "columna"}
];

function puntoMejora(complex) {
    complex = complex.substring(0, 2);
    switch (complex) {
         case "CO":
         case "LO":
         case "LI":
         case "LL":
              return "No";
         case "CU":
         case "AL":
         case "EX":
         case "FA":
              return "Si";
         default:
              return "No";
    }
}


export { optionsMenu, valueMenu, notacionDiagrama, columnsTable, puntoMejora }