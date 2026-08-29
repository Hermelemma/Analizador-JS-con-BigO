class If {
    constructor(e, c, _type, _row, _column) {
        this.exp = e;
        this.body = c;
        this.type = _type;
        this.row = _row;
        this.column = _column;
    }
}

export default If;