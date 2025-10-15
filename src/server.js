const express = require('express');
const app = express();


const porta = 3000;


app.set("view engine" ,"ejs");

app.set("views","./View");



app.get("/",(req,res)=>{

    res.render("test");

})

app.listen(3000,() => {
    console.log(`Servidor rodando na porta ${porta}`);    
})



