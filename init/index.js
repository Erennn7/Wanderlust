const mongoose=require("mongoose");
const initData=require("../init/data.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDb = async ()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({ ...obj, owner:"66a77afee12dc22b9af05993"}));//map creates new array and  ...obj means that the rest of the data will be same but owners will be added
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDb();