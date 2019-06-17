var bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    express = require('express'),
    app = express()
    
//APP CONFIG
mongoose.connect("mongodb://localhost:27017/blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

//MONGOOSE/MODEL CONFIG
var blogSchema = mongoose.Schema({
    title: String,
    image: {type: String, default: "https://images.unsplash.com/photo-1558980663-3685c1d673c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model('Blog', blogSchema);

//RESTFUL ROUTES
app.get('/',(req, res) => {
    res.redirect('/blogs');
});

//INDEX ROUTE
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err){
            console.log("ERROR");
        } else {
            res.render('index', {blogs: blogs});
        }
    });
});

// NEW (blog) ROUTE
app.get("/blogs/new", (req, res) => {
    res.render("new");   
});

//CREATE ROUTE

app.post("/blogs", (req, res) => {
    //create blog
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            res.redirect("/blogs")
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, () => {
    console.log('SERVER RUNNING!');
});