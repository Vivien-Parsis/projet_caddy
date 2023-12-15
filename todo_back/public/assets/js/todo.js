document.addEventListener('alpine:init', () => {
    Alpine.data('todo', () => ({
        todoList : "",
        NewContentTodo : "",
        NewDateTodo : "",
        getTodo(){
            fetch("https://todo.localhost/api/getTodo",{method:"GET"})
            .then(res=>res.json())
            .then(data=>this.todoList=data)
            .catch(err=>console.log(err));
        },
        addTodo(){
            fetch("https://todo.localhost/api/addTodo",
            {method:"POST",
            headers:{"content-type":"application/json"},
            body:JSON.stringify({"content":this.NewContentTodo,"date":this.NewDateTodo})})
            .then(()=>{this.NewContentTodo="";this.NewDateTodo="";})
            .then(()=>{this.getTodo()})
            .catch(err=>console.log(err))
        },
        removeTodo(id){
            fetch("https://todo.localhost/api/removeTodo",
            {method:"POST",
            headers:{"content-type":"application/json"},
            body:JSON.stringify({"id":id})})
            .then(()=>{this.getTodo()})
            .catch(err=>console.log(err))
        },
        modifyTodo(id,content,date,done){
            fetch("https://todo.localhost/api/modifyTodo",
            {method:"POST",
            headers:{"content-type":"application/json"},
            body:JSON.stringify({"id":id,"content":content,"date":date,"done":done})})
            .then(()=>{this.getTodo()})
            .catch(err=>console.log(err))
        },
        doneTodo(id,done){
            fetch("https://todo.localhost/api/doneTodo",
            {method:"POST",
            headers:{"content-type":"application/json"},
            body:JSON.stringify({"id":id,"done":done})})
            .then(()=>{this.getTodo()})
            .catch(err=>console.log(err))
        }
    }))
    Alpine.data('modify', () => ({
        showModify : false,
        newContent : "",
        newDate : "",
        newDone : "",
        modifyCurrent(id){
            if(this.NewDate=='' || this.newContent==''){
                return;
            }
            this.modifyTodo(id,this.newContent,this.newDate,this.newDone)
            this.showModify=false;
        },
        initDone(done,node){
            this.newDone=done;
            node.checked=done=="1"?true:false;
        },
        changeDone(id,node){
            this.newDone=this.newDone=="1"?"0":"1";
            node.checked=this.newDone=="1"?true:false;
            this.doneTodo(id,this.newDone);
        }
    }))
})