const express = require("express");
const bodyParser = require("body-parser");
const nodeCmd = require('node-cmd');


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
        res.sendFile(__dirname + "/index.html");
});


app.post("/", function(req,res){
    
        const url = req.body.repoUrl;

        console.log(url);
        // let installed = true;
        // nodeCmd.run('snyk');
        // nodeCmd.run('snyk -v', (err, data, stderr)=>{
        //         if(data.search('No such file or directory') != -1){
        //                 installed = false;
        //         }
        // })
        
        // if(installed === false){
             nodeCmd.runSync('npm install -g snyk');
        //      console.log(installed);
        // }
  
        // nodeCmd.run('snyk -v', (err, data, stderr)=>{
        //         console.log(data);
        // })
        nodeCmd.runSync('snyk auth 3fb8d4f3-00eb-49cc-ba59-21b028e30dc8');
        const synkTest = 'snyk test --json ' + url;
        
        nodeCmd.run(
                synkTest,
        function(err, data, stderr){
                const obj=JSON.parse(data)
        	// console.log(obj["severityMap"]);
                res.send(obj["severityMap"]);
               }
        );
       
});





// const nodeCmd = require('node-cmd');
// nodeCmd.runSync('npm install -g snyk');
// nodeCmd.runSync('snyk auth 3fb8d4f3-00eb-49cc-ba59-21b028e30dc8');
// nodeCmd.run('snyk');
// nodeCmd.run(
//         'snyk test --json https://gitlab.com/nidhi0512/JavaVulnerableLab',
//         function(err, data, stderr){
//                 const obj=JSON.parse(data)
//         	console.log(obj["severityMap"]);
//         }
// );


app.listen(process.env.PORT || 3000, function(){
        console.log("server is runnning on port 3000");
});
