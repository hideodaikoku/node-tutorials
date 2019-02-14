const express = require('express');
const Joi = require('joi');

const app = express();
app.use(express.json()); //middlware. We use middleware in the requst processing pipleine

const courses = [
    {id: 1, name:'java'},
    {id: 2, name:'python'},
    {id: 3, name:'C++'}
]

app.get('/', (req,res) =>{
    res.send('Hi There')
});

app.get('/api/courses', (req,res)=>{
    res.send(courses);
});

app.get('/api/courses/:id', (req,res)=>{
    let course= courses.find(c => c.id ===parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given ID was not found')
    res.send(course);
});

app.post('/api/courses',(req,res)=>{

    const result = validateCourse(req.body);

    const { error } = validateCourse(req.body);
    if(error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const course = {
        id: courses.length+1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };
    
    const result=Joi.validate(course,schema);

    return result

}

//update
app.put('/api/courses/:id',(req,res)=>{

    //check if course exists
    let course= courses.find(c => c.id ===parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found')
    

    //validate input
    const result = validateCourse(req.body);

    const { error } = validateCourse(req.body);
    if(error){
        return res.status(400).send(result.error.details[0].message);
    }

    //update course name
    course.name = (req.body.name);
    res.send(courses);
})

app.get('/api/posts/:year/:month',(req,res)=>{
    res.send(req.query);
    console.log(req.params.month,req.params.year);
});

app.delete('/feapi/courses/:id', (req,res) => {

    let course= courses.find(c => c.id ===parseInt(req.params.id));
    if(!course){
        return res.status(404).send('The course with the given ID was not found')
    }
    //delete

    const index= courses.indexOf(course);
    courses.splice(index,1);
    
    res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on port ${port}`))

