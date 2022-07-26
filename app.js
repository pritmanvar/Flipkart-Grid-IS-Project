const express = require("express");
const bodyParser = require("body-parser");
const nodeCmd = require('node-cmd');
const https = require('https');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
        res.sendFile(__dirname + "/index.html");
});


app.post("/", function(req,res){
    
        const url = req.body.repoUrl;
<<<<<<< Updated upstream

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
=======
        const nodeCmd = require('node-cmd');
        nodeCmd.runSync('npm install -g snyk');
        nodeCmd.runSync('snyk auth 3fb8d4f3-00eb-49cc-ba59-21b028e30dc8');
        nodeCmd.run('snyk');
        const snykTest = 'snyk test --json ' + url;
        nodeCmd.run(
                snykTest,
                function(err, data, stderr){
                        const obj=JSON.parse(data)
                        console.log(obj["severityMap"]);
                        res.send(obj["severityMap"]);
                }
        );


        const match = url.match(
                /^https?:\/\/(www\.)?github.com\/(?<owner>[\w.-]+)\/(?<name>[\w.-]+)/
        );
        const owner = match.groups.owner;
        const repoN = match.groups.name;
        console.log(owner);
        console.log(repoN);
        console.log(url);

        //user info
        const user = owner;
        const options = {
            hostname: 'api.github.com',
            path: '/users/' + owner,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36'
            },
            OAUth: "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"
        }
        https.get(options,(response) => {
                let body = "";
            
                response.on("data", (chunk) => {
                    body += chunk;
                });
            
                response.on("end", () => {
                    try {
                        let json = JSON.parse(body);
                        // do something with JSON
                        // res.send(json);
                        const last_update = json.updated_at;
                        console.log(last_update);
                        // res.send(json);

                    } catch (error) {
                        console.error(error.message);
                    };
                });
            
            }).on("error", (error) => {
                console.error(error.message);
        });

       
        //for repo information 
       
        const reponame = repoN;
        const option = {
            hostname: 'api.github.com',
            path: '/repos/' + user + '/' + repoN,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36'
            },
            OAUth: "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"
        }
>>>>>>> Stashed changes
        
        https.get(option,(response) => {
                let body = "";
            
                response.on("data", (chunk) => {
                    body += chunk;
                });
            
                response.on("end", () => {
                    try {
                        let json = JSON.parse(body);
                        // do something with JSON
                        // res.send(json);
                        const fork = json.forks_count; //if forks_count is zero then returning it will cause app crash
                        const repoName = json.name;
                        const repoFullName = json.full_name;
                        const lastUpdate = json.updated_at;
                        const license = json.license;
                        const stars = json.stargazers_count;
                        

                    } catch (error) {
                        console.error(error.message);
                    };
                });
            
            }).on("error", (error) => {
                console.error(error.message);
            });
       
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




