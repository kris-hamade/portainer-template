const http = require('http');
const request = require('axios');
const express = require('express');
const fs = require('fs');

const app = express()

var filePath = './templates.json'; 
fs.unlinkSync(filePath);

var templateCompilation = {             
    "version": "2",
    "templates": []
}

const templateSites = [
        `https://raw.githubusercontent.com/portainer/templates/master/templates-2.0.json`,
        `https://raw.githubusercontent.com/dnburgess/self-hosted-template/master/template.json`,
        `https://raw.githubusercontent.com/Qballjos/portainer_templates/master/Template/template.json`,
        `https://raw.githubusercontent.com/SelfhostedPro/selfhosted_templates/portainer-2.0/Template/template.json`,
        `https://raw.githubusercontent.com/technorabilia/portainer-templates/main/lsio/templates/templates-2.0.json`,
        `https://raw.githubusercontent.com/mikestraney/portainer-templates/master/templates.json`,
]

app.use(express.static('public'));

//Creates function for async sleep if needed to delay functions
const sleep = ms => new Promise(res => setTimeout(res, ms))

const compileTemplates = () => new Promise((resolve, reject) => {
    templateCompilation = {             
        "version": "2",
        "templates": []
    }
 templateSites.map(templates =>
        request.get(templates).then(response => {
            
            for (let i in response.data.templates){
                templateCompilation['templates'].push(response.data.templates[i])
            }

            resolve(response)
            return templateCompilation
        })
    ) 
    
    
})

const printObject = async () => {
    console.log("Compiling Templates")
    console.log(templateCompilation)
    let data = JSON.stringify(templateCompilation)
    fs.writeFileSync('templates.json', data);
}

const runProgram = async () => {
    await compileTemplates()
    await printObject()
}
runProgram()