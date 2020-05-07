const fs = require("fs-extra")
const path = require("path")
const solc = require("solc")

const compileDir = path.resolve(__dirname,"../src/build")
// console.log(compileDir)

fs.removeSync(compileDir)
fs.ensureDirSync(compileDir)

const files = fs.readdirSync(path.resolve(__dirname,"../contracts"))
files.map(
    src=>{
        const solcFile = path.resolve(__dirname,"../contracts",src)

        const content = fs.readFileSync(solcFile,"utf-8")

        const res = solc.compile(content,1)
        // console.log(res)

        if(Array.isArray(res.errors) && res.errors.length>0){
            res.errors.map(
                err=>{
                    if( err.indexOf("Error") != -1){
                        throw new Error("编译合约失败：",res.errors)
                    }
                }
            )
        }

        Object.keys(res.contracts).map(
            name=>{
                const contractJsonName = name.replace(/^:/,"")+".json"
                const filePath = path.resolve(__dirname,"../src/build",contractJsonName)
                fs.outputJSONSync(filePath,res.contracts[name])
                console.log(filePath," -  compile successfuly.")
            }
        )

    }
)
