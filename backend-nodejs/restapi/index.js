const express=require("express");
const fs=require('fs')
const app=express();
const port=8000;

const users=require('./MOCK_DATA.json');

//Middleware -Plugins  convert to JAVASCRIPT Object
app.use(express.urlencoded({extended:false})); // form data ko parse karta hai middleware
app.use(express.json());
// app.use(express.static('public')); // public folder ko static folder banata hai


// custom middleware
app.use((req,res,next)=>{
    console.log("Hello ji Mid1");
    // return res.send("gfh");
    req.myUserName="Pragun";
    next();
})

app.use((req,res,next)=>{
  // myUserName is accessiabLe here and later middleware 
  console.log("Hello ji Mid2",req.myUserName);
  // return res.send("hello");
  next();
})

app.use((req,res,next)=>{
  fs.appendFile("log.txt",
    `\n${Date.now()}  ${req.ip}  ${req.method}  ${req.path}`,(err,data)=>{
      next();
    }
  )
})

//ROUTES

// send the user data in html form directly
app.get('/users',(req,res)=>{
  console.log("Inside Get Request",req.myUserName);
   const html=`
     <ui>
       ${users.map((user) => `<li>${user.first_name}</li>`).join('')}
     </ui>
   `;
   res.send(html); 
//    combining the users(array of string)
})


// send json data-frontend will render the json accordingly - hybrid route
app.get('/api/users',(req,res)=>{
    //  res.setHeader("myName","Pragun"); //Custom Header
    //  Always add X- to custom header
    res.setHeader("X-myName","Pragun"); //Custom Header
     res.json(users);

})

// dynamic path parameter of dynamic Route
app.get('/api/users/:id',(req,res)=>{
    const id=Number(req.params.id);
    const user=users.find(users => id===users.id);
    if(!user){
      return res.status(404).json({err:  "Not Found User id"});
    }
    return res.json(user);
})

// grouping (no need to change the route name every where and use return keyword pratices)
// app.route('/api/users/:id')
//    .get((req,res)=>{
//       return res.send("hello")
//    })
//    .patch((req,res)=>{
    
//    })
//    .delete((req,res)=>{
    
//    })

app.post('/api/users',(req,res)=>{
    const body=req.body; // we have to use json parse middleware
    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender){
      return res.status(400).json("Required all filled")
    }
    users.push({id:users.length+1,...body});
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
        return res.status(201).json({status:"Done",id:users.length})
    })
    console.log(body);
})


app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})