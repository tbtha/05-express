const express = require('express')
const joyas = require('./data/joyas.js')
const app = express()

const HATEOAS = ()=>{
  return joyas.results.map(item => {
    return{
      name: item.name,
      href:`http://localhost:3000/api/v2/joyas/${item.id}`
    }
  })
}

const HATEOAS2 = ()=>{
  return joyas.results.map(item => {
    return{
      nombre: item.name,
      src:`http://localhost:3000/api/v2/joyas/${item.id}`
    }
  })
}

// 1.Crear una ruta para la devolución de todas las joyas aplicando HATEOAS
// http://localhost:3000/api/v1/joyas
app.get('/api/v1/joyas', (req, res) => {
  return res.json(HATEOAS())
})



//2.Hacer una segunda versión de la API que ofrezca los mismos datos pero con los nombres de las propiedades diferentes
//  http://localhost:3000/api/v2/joyas
//6.Permitir hacer paginación de las joyas usando Query Strings
//http://localhost:3000/api/v2/joyas?page=3
//7.Permitir hacer ordenamiento de las joyas según su valor de forma ascendente o descendente usando Query Strings.
// http://localhost:3000/api/v2/joyas?values=asc
// http://localhost:3000/api/v2/joyas?values=des

app.get('/api/v2/joyas', (req, res) => {
  const {values, page} = req.query;
  const datos = HATEOAS2();
  if(page){
    return res.json(datos.slice(page * 2-2, page * 2));
      
  }
  if(values =="asc"){
      const asc = joyas.results.sort((a,b) => (a.value > b.value ? 1 : -1));
      return res.json(asc)
  }
  if(values == "des"){
    const des = joyas.results.sort((a,b) => (a.value < b.value ? 1 : -1));
      return res.json(des)
  }
  return res.json(HATEOAS2())  
  
})


//3.La API REST debe poder ofrecer una ruta con la que se puedan filtrar las joyas por categoría.
// http://localhost:3000/api/v2/joyas/categoria/aros
app.get('/api/v2/joyas/categoria/:category', (req, res) => {
  const {category} = req.params;
  const categoria = joyas.results.filter((item => item.category == category))

  return res.json(categoria)
})

//4.Crear una ruta que permita el filtrado por campos de una joya a consultar.
// http://localhost:3000/api/v2/joyas/1?fields=model,category,metal
//5.Crear una ruta que devuelva como payload un JSON con un mensaje de error cuando el usuario consulte el id de una joya que no exista
// http://localhost:3000/api/v2/joyas/55

app.get("/api/v2/joyas/:id",(req,res) => {
  const {id} = req.params;
  const j = joyas.results.find((item => item.id ===  parseInt(id)))
  const joyaFind = {...j}
  
  const {fields} = req.query;
  
  if(!j){
    return res.json({
      error :"404 Not Found",
      msg:`ID  :${id} no existe `
    })
  } 
  if(!fields){
    return res.json(joyaFind)
  }
  
  const arrayFields = fields.split(",");
  
  for(let propiedad in joyaFind){
    if(!arrayFields.includes(propiedad)){
      delete joyaFind[propiedad];
    }
  }
  return res.json(joyaFind)
});



app.listen(3000, () => console.log('Your app listening on port 3000'))
