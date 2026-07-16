class Node {

    constructor(_id,_value) {
        this.id = _id;
        this.value = _value;
        this.children = [];
        this.color = "color=black,";
        this.row = -1;
        this.column = -1;
    }

    addNode(node){
        this.children.push(node);
    }
}

export default Node;