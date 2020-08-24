class find{
    constructor(data, url=null){
        this.data = data;
        this.url = url;
        this.id = null;
    }
    getId(url=this.url){
        this.id = this.data.find(e=>e.url==url).id;
    }
    getArrayId(data=this.data, parent_id=this.id){
        var parent = [];
        data.forEach(e=>{
            if(e.parent_id == parent_id){
                parent.push(e.id);
                var result = this.getArrayId(data, e.id);
                parent = parent.concat(result);
            }
        });
        return parent;
    }
    get(){
        this.getId();
        var arr = this.getArrayId();
        arr.push(this.id);
        return arr;
    }
    getArrayParent(data=this.data, id=this.id){
        var parent = [];
        data.forEach(e=>{
            if(e.id == id){
                parent.push(e.id);
                var result = this.getArrayParent(data, e.parent_id);
                parent = parent.concat(result);
            }
        });
        return parent;
    }
    getParent(){
        this.getId();
        var arr = this.getArrayParent();
        return arr;
    }
}

module.exports = find;