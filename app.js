import express from "express";
import ejs from "ejs";
import mongoose from "mongoose";

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


 mongoose.connect("mongodb+srv://RakshitKhullar:Rakshit@123@cluster0.qfbmm.mongodb.net/BankingSystemDatabase",{useNewUrlParser: true,useUnifiedTopology: true});

const customerSchema =  new mongoose.Schema({
  accountno: Number,
  name: String,
  email: String,
  contact: Number,
  bankBalance: Number,
  transactions: []
});

const Customer = mongoose.model("Customer",customerSchema);

const customersarray = [
  {accountno: 9213921301 ,name: "Batista"  ,email: "souravbot123@gmail.com"   ,contact: 9999999901    ,bankBalance:100000,transations:[] },
  {accountno: 9213921302 ,name: "Rao"   ,email: "rmayank99@gmail.com"  ,contact:  9999999902   ,bankBalance:10000,transations:[]  },
  {accountno: 9213921303 ,name: "Ritik"   ,email: "ritiksherawat@gmail.com"  ,contact:  9999999903   ,bankBalance:200000,transations:[]  },
  {accountno: 9213921304 ,name: "Khulli"   ,email:  "rokorakshit@gmail.com"  ,contact:  9999999904   ,bankBalance:30000,transations:[]  },
  {accountno: 9213921305 ,name: "Piyush"   ,email: "piyushrocks21@gmail.com"  ,contact:  9999999905    ,bankBalance:40000,transations:[]   },
  {accountno: 9213921306 ,name: "jonty"   ,email:  "jontyrocks24@gmail.com"  ,contact:  9999999906    ,bankBalance:500000,transations:[]   },
  {accountno: 9213921307 ,name: "Ishu"   ,email: "mansukhrathore@gmail.com"   ,contact:  9999999907    ,bankBalance:450000,transations:[]  },
  {accountno: 9213921308 ,name: "Sumit"   ,email: "sumitsharma@gmail.com"   ,contact: 9999999908     ,bankBalance:50000,transations:[]  },
  {accountno: 9213921309 ,name: "Vikas"  ,email:  "vikasjangra@gmail.com"  ,contact: 9999999909     ,bankBalance:60000,transations:[]  },
  {accountno: 9213921310 ,name: "Bhaskar"  ,email: "bhaskar@gmail.com"   ,contact: 9999999910     ,bankBalance:70000,transations:[]  }
];

 // Customer.insertMany(customersarray,(err,result) => {
 //   if(!err){
 //     console.log("Array of customers added successfully");
 //   }
 // });

///////////////////////    Get Requests     ////////////////////////
app.get("/",(req,res) => {
  res.render("home");
});
app.get("/transferhistoryinfo",(req,res) => {
  res.render("transferhistoryinfo");
});

///////////////////////    Post requests    //////////////////////
//////////////// show all customers  ///////////////
app.post("/customers",(req,res) => {
  Customer.find({},(err,foundCustomers) => {
    if(!err){
      res.render("customers",{customers: foundCustomers});
    }
  })
});

app.post("/transferinfo",(req,res) => {
  res.render("transferinfo");
});

//////////////// Transfer money from one account to another  ///////////////
app.post("/transfermoney",(req,res) => {
  const transferfrom = req.body.transferfrom;
  const transferto = req.body.transferto;
  const amount = req.body.amount;

  if(transferfrom === transferto){
    res.render("sameaccountfailure");
  }else{
    //////////////////////   find receiver   /////////////////////////
    Customer.findOne({accountno: transferfrom},(err,sendercustomer) => {
      if(!err){
        if(sendercustomer.bankBalance >= amount){
          console.log("sendercustomer bank balance :" + sendercustomer.bankBalance)
          const newbalance = Number(sendercustomer.bankBalance) - Number(amount);
          console.log("newbalance:" + newbalance);
     //////////////////////// Update sender bank balance ////////////
          Customer.updateOne({accountno: transferfrom},{$set:{bankBalance: newbalance}},(err) => {
            if(!err){
              // sendercustomer.transactions.push("sent:" + amount);
              // sendercustomer.save();
              console.log(sendercustomer.transactions);
              console.log("Successfully updated sender's account.");
            }
          });

    //////////////////////   find receiver   /////////////////////////
          Customer.findOne({accountno: transferto},(err,receivercustomer) => {
            if(!err){
                const newbalanceto = Number(receivercustomer.bankBalance) + Number(amount);
    //////////////////////// Update receiver bank balance ////////////
                Customer.updateOne({accountno: transferto},{bankBalance: newbalanceto},(err) => {
                  if(!err){
                    sendercustomer.transactions.push("sent: " + amount + " to " + receivercustomer.name);
                    sendercustomer.save();
                    receivercustomer.transactions.push("received: " + amount + " from " + sendercustomer.name);
                    receivercustomer.save();
                    console.log(receivercustomer.transactions);
                    console.log("Successfully updated receiver's account.");
                  }
                });
                res.render("paymentsuccessful");
            }
          });
        }else{
          res.render("paymentfailure");
        }
      }
    });
  }
});

//////////////// show all previous transactions  ///////////////
app.post("/transferhistoryinfo",(req,res) => {
  const an = req.body.accountnumber;
  Customer.find({accountno: an},(err,customer) => {
    if(!err){
      console.log(customer[0].transactions);
      res.render("showtransactionhistory",{alltransactions: customer[0].transactions});
    }
  });
});

app.listen(process.env.PORT || 3000,() => {
  console.log("This server is working just fine.")
});