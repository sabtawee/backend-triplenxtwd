const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");
const supplier_ref_id = "s123456";
const apiKey = "ZeLepLHjo262ANGruT6BHkeS7aQLPMNG";

const GetProductLocation = async (req, res) => {
  try {
    // product_code: '2000602561327',
    // quantity: 1,
    // color: 'ดำ',
    // size: '100 เมตร',
    // latitude: 14.169528,
    // longitude: 100.3169363,
    // pd_type: 'THW 1x2.5'

    console.log(req.body);

    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    let pd_type = req.body.pd_type;
    let color = req.body.color;
    let quantity = req.body.quantity;

    const result = await prisma.products.findMany({
      where: {
        pd_type: pd_type,
        pd_color: color,
      },
    });
    console.log(result.length);
    if (result.length > 0) {
      console.log("have data");
    } else {
      console.log("no data");
    }
    if (result.length > 0) {
      const params = {
        location_gps: latitude + "," + longitude,
        quantity: quantity,
        product_code: result[0].barcode,
        supplier_ref_id: supplier_ref_id,
      };
      console.log(params);
      const config = {
        headers: {
          "API-Key": apiKey,
        },
      };
      const apiUrl = `https://thaiwatsadu.com/api/get-product-stock`;
      await axios
        .get(apiUrl, { params: params, headers: config.headers })
        .then((response) => {
          console.log(response.data);
          res.status(200).json({
            status: "success",
            message: "Read Data Success",
            data: response.data,
            inhouse: result,
          });
        })
        .catch((error) => {
          res.status(500).json({
            status: "error",
            message: "Read Data Failed",
          });
        });
    } else {
      res.json({
        status: "error",
        message: "Read Data Failed",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const ChangeLocation = async (req, res) => {
  try {
    let product_code = req.body.product_code;
    let quantity = req.body.quantity;
    let region = req.body.region;

    const body = {
      product_code: product_code,
      quantity: quantity,
      region: region,
      supplier_ref_id: supplier_ref_id,
    };

    const config = {
      headers: {
        "API-Key": apiKey,
      },
    };

    const apiUrl = `https://thaiwatsadu.com/api/post-check-stock-region`;
    await axios
      .post(apiUrl, body, { headers: config.headers })
      .then((response) => {
        console.log(response.data);
        res.status(200).json({
          status: "success",
          message: "Read Data Success",
          data: response.data,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: "error",
          message: "Read Data Failed",
        });
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const portProductStock = async (req, res) => {
  try {
    let product = req.body.product;
    const ApiUrl = `https://thaiwatsadu.com/api/post-products-stock`;
    const config = {
      headers: {
        "API-Key": apiKey,
      },
    };
    const body = {
      supplier_ref_id: supplier_ref_id,
      products: product,
    };
    try {
      await axios
      .post(ApiUrl, body, config)
      .then((response) => {
        res.status(200).json({
          status: "success",
          message: "Read Data Success",
          data: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: "error",
          message: "Read Data Failed",
        });
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const portSeller = async (req, res) => {
  try {
    let product = req.body.product;
    let store = req.body.store_id;

    let product_seller = [];
    product.forEach(item => {
      product_seller.push({
        product_code: item.product_code,
        quantity: item.quantity,
      })
    });

    const ApiUrl = `https://thaiwatsadu.com/api/post-products-order`;

    const config = {
      headers: {
        "API-Key": apiKey,
      },
    };

    const body = {
      supplier_ref_id: supplier_ref_id,
      store_id: store,
      products: product_seller,
    };

    await axios.post(ApiUrl, body, config).then((response) => {
      console.log(response.data);
      res.status(200).json({
        status: "success",
        message: "Read Data Success",
        data: response.data,
      });
    }).catch((error) => {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "Read Data Failed",
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    
  }
};

module.exports = {
  GetProductLocation,
  ChangeLocation,
  portProductStock,
  portSeller,
};
