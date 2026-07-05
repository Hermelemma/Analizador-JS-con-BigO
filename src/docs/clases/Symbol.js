class Symbol {
    
    constructor(_id, _value, _type, _type_exp, _type_var, _type_c, /*_type_o,*/ _row, _column) {
        this.id = _id;
        this.value = _value;
        this.type = _type;
        this.type_exp = _type_exp;
        this.type_var = _type_var;
        this.type_c = _type_c;
        //this.type_o = _type_o;
        this.row = _row;
        this.column = _column;
    }
}        
//new Declaration([$1],null,$3.id,$3.access,Type.LOCAL,Type.VAR,Type.PRIMITIVO,0,this._$.first_line,this._$.first_column)

export default Symbol;