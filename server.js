const express = require("express");
const app = express();
const port = 3000;
// const con=require('./connection')
var bodyParser = require("body-parser");
const db = require("./models");

const sequelize = require("sequelize");
const { Op } = sequelize;
const { Cat, SubCat, sequelizeCon, Users, Wallets } = require("./models");
db.sequelizeCon.sync({ force: false }).then(() => {
  console.log("Drop and Resync with { force: false }");
});

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("cat.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const CategoryPackage = grpcObject.CategoryPackage;

const server = new grpc.Server();
server.bind("0.0.0.0:40000", grpc.ServerCredentials.createInsecure());

server.addService(CategoryPackage.Category.service, {
  listCategory: listCategory,
  addCategoryAndSub: addCategoryAndSub,
  listWallets: listWallets,
});

server.start();
// grpc
async function listWallets(call, callback) {
  let resData = await Wallets.findAll({});
  // let finaldata = [];
  let finaldata = [];
  resData.forEach((element) => {
    finaldata.push({
      walletId: element.wallet_id,
      walletName: element.wallet_name,
      isActive: element.is_active,
    });
  });

  callback(null, {"data":finaldata});
}

async function addCategoryAndSub(call, callback) {
  console.log(call.request);
   
  let resdata = await Users.create({
    user_id: call.request.userId,
    cat_ids: call.request.catIds,
    sub_cat_ids: call.request.subCatIds,
    is_active: 1,
  });
  callback(null, { msg: "success" });
}


async function listCategory(call, callback) {
  let query = `select  mst_cat.cat_id,cat_name,cat_disp_order,cat_img ,sub_cat_id,sub_cat_name,sub_cat_img,sub_cat_disp_order from mst_cat left join mst_subcat on mst_cat.cat_id=mst_subcat.cat_id order by  mst_cat.cat_id`;
  const resData = await sequelizeCon.query(query, {
    type: sequelize.QueryTypes.SELECT,
  });

  // res.json(resData)

  let catId = 0;
  let catDetail = [];
  const finaldata = [];

  if (resData.length > 0) {
    for (let i = 0; i < resData.length; i++) {
      if (resData[i].cat_id && catId != resData[i].cat_id) {
        if (i > 0) {
          finaldata.push({
            catid: resData[i - 1].cat_id,
            catname: resData[i - 1].cat_name,
            catdisporder: resData[i - 1].cat_disp_order,

            catimg: resData[i - 1].cat_img,
            subCategories: catDetail,
          });
        }

        catDetail = [];

        catDetail.push({
          subcatid: resData[i].sub_cat_id,
          subcatname: resData[i].sub_cat_name,
          subcatimg: resData[i].sub_cat_img,
          subcatdisporder: resData[i].sub_cat_disp_order,
        });
      } else {
        catDetail.push({
          subcatid: resData[i].sub_cat_id,
          subcatname: resData[i].sub_cat_name,
          subcatimg: resData[i].sub_cat_img,
          subcatdisporder: resData[i].sub_cat_disp_order,
        });
      }
      catId = resData[i].cat_id;
    }
    const n = resData.length - 1;
    if (resData[n].cat_id) {
      finaldata.push({
        catid: resData[n].cat_id,
        catname: resData[n].cat_name,
        catdisp_order: resData[n].cat_disp_order,

        catimg: resData[n].cat_img,
        subCategories: catDetail,
      });
    }
  }

  callback(null, { data: finaldata });
}
// rest
app.use(bodyParser());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/listCategory", async (req, res) => {
  try {
    let data = await SubCat.findAll({});
    res.json(data);
  } catch (error) {
    console.log(error);
    res.send("error");
  }
});

app.post("/addCategory", async (req, res) => {
  try {
    let { cat_id, sub_cat_name, sub_cat_disp_order, sub_cat_img, is_active } =
      req.body;
    // console.log(cat_name,disp_order,img)
    const catDoc = await SubCat.create({
      cat_id,
      sub_cat_img,
      sub_cat_name,
      sub_cat_disp_order,
      is_active: 1,
    });

    res.json({ status: 200, message: "ok" });
  } catch (error) {
    console.log(error);
    res.send("error");
  }
});
app.post("/editCategory", async (req, res) => {
  try {
    let {
      sub_cat_id,
      cat_id,
      sub_cat_name,
      sub_cat_disp_order,
      sub_cat_img,
      is_active,
    } = req.body;
    let category = await SubCat.findOne({
      where: {
        sub_cat_id,
      },
    });
    if (category) {
      let categoryData = {};
      if (sub_cat_name) categoryData.sub_cat_name = sub_cat_name;
      if (sub_cat_disp_order)
        categoryData.sub_cat_disp_order = sub_cat_disp_order;
      if (sub_cat_img) categoryData.sub_cat_img = sub_cat_img;
      if (cat_id) categoryData.cat_id = cat_id;

      await SubCat.update(categoryData, { where: { sub_cat_id } });
      res.json({ status: 200, message: "ok" });
    } else {
      res.json({ status: 101, message: "Cat Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.send("error");
  }
});
app.post("/ChangeStatus", async (req, res) => {
  try {
    let { sub_cat_id, is_active } = req.body;
    let category = await Cat.findOne({
      where: {
        sub_cat_id,
      },
    });
    // console.log(category)
    if (category) {
      await Cat.update({ is_active }, { where: { sub_cat_id } });
      res.json({ status: 200, message: "ok" });
    } else {
      res.json({ status: 101, message: "Cat Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.send("error");
  }
});

app.post("/test", async (req, res) => {
  let { user_id, cat_ids, sub_cat_ids } = req.body;

  let resData = await Wallets.findAll({});
  let finaldata = [];
  resData.forEach((element) => {
    finaldata.push({
      walletId: element.wallet_id,
      walletName: element.wallet_name,
      isActive: element.is_active,
    });
  });

  res.json(finaldata);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
