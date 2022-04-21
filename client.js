const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader")


const packageDef = protoLoader.loadSync("cat.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);

const CategoryPackage = grpcObject.CategoryPackage;



const client = new CategoryPackage.Category("localhost:40000", 
grpc.credentials.createInsecure())


 

client.listCategory(null, (err, response) => {
    console.log(response)
    
})  

client.listWallets(null,(err,res)=>{
    console.log(res);

})
 
client.addCategoryAndSub({userId:5,catIds:'1,2,3',subCatIds:'1,2'},(err,response)=>{
    console.log("read the todos from server " + JSON.stringify(response))

})

