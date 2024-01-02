const SQLTool = require('./../tool/SQLTool.js');

const testCorrectMySQL = () => {
    const listOfTest = [{
        "test":"test\\\'\r\n\"\x00\x1atest",
        "expected":"test\\\\\\\'\\\r\\\n\\\"\\\x00\\\x1atest"
    },{
        "test":"test",
        "expected":"test"
    }];
    let allCheck = true;
    for(let currentTest of listOfTest){
        if(!currentTest.expected == SQLTool.correctMySQL(currentTest.test)){
            allCheck = false;
            break;
        }
    }
    return allCheck ? "valid test" : "failed test";
}   
const testCheckInt = () => {
    const listOfTest = [{
        "test":"12",
        "expected":true
    },{
        "test":"1r2",
        "expected":false
    },{
        "test":123,
        "expected":true
    },{
        "test":"aaa",   
        "expected":false
    }];
    let allCheck = true;
    for(let currentTest of listOfTest){
        if(!currentTest.expected == SQLTool.checkInt(currentTest.test)){
            allCheck = false;
            break;
        }
    }
    return allCheck ? "valid test" : "failed test";
}
const testCheckDate = () => {
    const listOfTest = [{
            "test":"1000-11-11",
            "expected":true
        },{
            "test":"1000-11-32",
            "expected":false
        },{
            "test":"1000-11-32-1999-11-11",
            "expected":false
        },{
            "test":"1aaz-11-ab",
            "expected":false
    }];
    let allCheck = true;
    for(let currentTest of listOfTest){
        if(!currentTest.expected == SQLTool.checkDate(currentTest.test)){
            allCheck = false;
            break;
        }
    }
    return allCheck ? "valid test" : "failed test";
}

module.exports = {testCheckDate,testCheckInt,testCorrectMySQL};