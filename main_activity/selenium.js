//npm install selenium-webdriver chromedriver
require("chromedriver");
let swd = require("selenium-webdriver");
let browser = new swd.Builder();
let {email,password} = require("./credentials.json");
//const { resolve } = require("path");
//tab 
let tabnew = browser.forBrowser("chrome").build();
let tabWillBeOpenedPromise = tabnew.get("https://www.hackerrank.com/auth/login");

tabWillBeOpenedPromise
    .then(function(){
        let findTimeOutP = tabnew.manage().setTimeouts({
            implicit: 10000
        });
        return findTimeOutP;
    }).then(function(){
        let inputBoxPromise = tabnew.findElement(swd.By.css("#input-1"));
        return inputBoxPromise;
    }).then(function(inputBox){
        let inputBoxWillbeFilledP = inputBox.sendKeys(email);
        return inputBoxWillbeFilledP;

    }).then(function(){
        let passwordBoxPromise = tabnew.findElement(swd.By.css("#input-2"));
        return passwordBoxPromise;
    }).then(function(passwordBox){
        let passwordBoxP = passwordBox.sendKeys(password);
        return passwordBoxP;
    }).then(function(){
         let loginBPromise = tabnew.findElement(swd.By.css("[data-analytics='LoginPassword']"));
         return loginBPromise;
    }).then(function(loginB){
        let loginBP = loginB.click();
        return loginBP;
    }).then(function(){
        let InterBPromise = tabnew.findElement(swd.By.css("#base-card-1-link"));
        return InterBPromise;
    }).then(function(InterB){
        let InterBP = InterB.click();
        return InterBP;
    }).then(function(){
        let WarmBPromise = tabnew.findElement(swd.By.css("a[data-attr1='warmup']"));
        return WarmBPromise;
    }).then(function(WarmB){
        let WarmBP = WarmB.click();
        return WarmBP;
    }).then(function(){
        //let QuesB = tabnew.getCurrentUrl();
        //return QuesB;
        let allQtag = tabnew.findElements(swd.By.css("a.js-track-click.challenge-list-item"));// all ques tags
        return allQtag;
    }).then(function(alQues){
        let allQuesLinkP = alQues.map(function(anchor){
            return anchor.getAttribute("href");
        })
        let allLinkPromise = Promise.all(allQuesLinkP)
        return allLinkPromise;
    }).then(function(allQLink){
        let f1Promise = questionSolve(allQLink[0]);
        for(let i=1;i<allQLink.length;i++){
            f1Promise = f1Promise.then(function(){
                return questionSolve(allQLink[i]);
            })    
        }
        let firstQuesWillBeSolvedP =f1Promise;
        return firstQuesWillBeSolvedP;
    }).then(function(){
        console.log("All questions");
    }).catch(function(err){
         console.log(err);
     })
function questionSolve(url){
        return new Promise(function(resolve,reject){
            //logic to solve a Question
            let qPageWillBeOpenedP = tabnew.get(url);
            qPageWillBeOpenedP.then(function(){
                let editorialWillBeSelectedPromise=tabnew.findElement(swd.By.css("a[data-attr2='Editorial']"));
                return editorialWillBeSelectedPromise;
         }).then(function(editorialP){
             let EditBtnP = editorialP.click();
             return EditBtnP;
         })
         .then(function(){
             let UnlockBtnP = handleBtn();
             return UnlockBtnP;
         }).then(function(){
            let CopyCodeP = copyCode();
            return CopyCodeP;
         }).then(function(code){
           let codePasteP = pasteSol(code);
           return codePasteP;
         }).then(function(){
             resolve();
         })
         .catch(function(err){
             reject(err);
         })
    });
}
function handleBtn(){
    return new Promise(function(resolve,reject){
        let UnlockBttnP = tabnew.findElement(swd.By.css(".editorial-content-locked button.ui-btn.ui-btn-normal"));
        UnlockBttnP.then(function(UnlockBttn){
            let lockBtnP = UnlockBttn.click();
            return lockBtnP;
        }).then(function(){
            resolve();
        }).catch(function(){
            console.log("BTn NOt found");
            resolve();
        })
    })
}

function copyCode(){
    return new Promise(function(resolve,reject){
        let alllangElmenP = tabnew.findElements(swd.By.css(".hackdown-content h3"));
        let allcodeElmenP = tabnew.findElements(swd.By.css(".hackdown-content .highlight"));
        let bothArrayP = Promise.all([alllangElmenP,allcodeElmenP]);
        bothArrayP.then(function(bothArray){
            let langElements = bothArray[0];
            gcodesElements = bothArray[1];
            let alllangTextP = [];
            for(let i =0;i<langElements.length;i++){
                let clangP = langElements[i].getText();
                alllangTextP.push(clangP);
            }
            return Promise.all(alllangTextP);
        }).then(function(alllang){
            let codeP;
            for(let i=0;i<alllang.length;i++){
                if (alllang[i].includes("C++")){
                    codeP = gcodesElements[i].getText();
                    break;
                }
            }
                return codeP;
            }).then(function(code){
                console.log(code)
                resolve(code);
            }).catch(function(err){
                reject(err);
            })

        });


}

function pasteSol(code){
    return new Promise(function(resolve,reject){
        let probTabP = tabnew.findElement(swd.By.css("li#Problem"));
        probTabP.then(function(probTab){
            let probTabClickP = probTab.click();
            return probTabClickP;
        }).then(function(){
            let inputBoxP = tabnew.findElement(swd.By.css(".custom-input-checkbox"));
            return inputBoxP;
        }).then(function(inputBox){
            let inputBoxClickP = inputBox.click();
            return inputBoxClickP;
        }).then(function(){
            let customInputBoxP = tabnew.findElement(swd.By.css(".custominput"));
            return customInputBoxP;
        }).then(function(customInputBox){
            gcInputBox = customInputBox;
            let codeEnterdP =  customInputBox.sendKeys(code);
            return codeEnterdP;
        }).then(function(){
            let ctrlSelP =  gcInputBox.sendKeys(swd.Key.CONTROL+"a");
            return ctrlSelP;
        }).then(function(){
            let ctrlCutP = gcInputBox.sendKeys(swd.Key.CONTROL+"x");
            return ctrlCutP;
        }).then(function(){
            let areaP = tabnew.findElement(swd.By.css("textarea"));
            console.log("i am text area");
            return areaP;
        }).then(function(Area){
            gTextArea = Area;
            let codeWillSelP = Area.sendKeys(swd.Key.CONTROL+"a");
            return codeWillSelP;
        }).then(function(){
            let ctrlPasteP = gTextArea.sendKeys(swd.Key.CONTROL+"v");
            return ctrlPasteP;
        }).then(function(){
            let submitBntP = tabnew.findElement(swd.By.css(".btn-primary.hr-monaco-submit"));
            return submitBntP;
        }).then(function(submitBnt){
            let submitBntClickP = submitBnt.click();
            return submitBntClickP;
        }).then(function(){
            resolve();
        }).catch(function(err){
            reject(err);
        })
    });
}