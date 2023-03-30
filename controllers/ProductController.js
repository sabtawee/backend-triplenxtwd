const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await prisma.products.findMany();
    if (products.length === 0) {
      return res.status(404).json({ message: "Products not found!" });
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductsByReCom = async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      where: {
        pd_recom: "1",
      },
    });
    if (products.length === 0) {
      return res.status(404).json({ message: "Products not found!" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductsByBarcode = async (req, res) => {
  try {
    const barcode = req.params.barcode;
    const product = await prisma.products.findMany({
      where: {
        barcode: barcode,
      },
    });
    const color = await prisma.products.findMany({
      select: {
        pd_color: true,
      },
      where: {
        pd_type: product[0].pd_type,
      },
    });

    const length = await prisma.products.findMany({
      select: {
        pd_length: true,
        pd_price: true,
        pd_discount: true,
      },
      where: {
        pd_type: product[0].pd_type,
      },
    });
    console.log(length);

    const feature_product = await prisma.feature_product.findMany({
      where: {
        barcode: barcode,
      },
    });
    const slogan_product = await prisma.slogan_product.findMany({
      where: {
        barcode: barcode,
      },
    });

    const subdetail_product = await prisma.subdetail_product.findMany({
      where: {
        barcode: barcode,
      },
    });

    const usage_product = await prisma.usage_product.findMany({
      where: {
        barcode: barcode,
      },
    });

    if (product) {
      return res.status(200).json({
        product: product,
        feature_product: feature_product,
        slogan_product: slogan_product,
        subdetail_product: subdetail_product,
        usage_product: usage_product,
        color: color,
        length: length,
      });
    }
    res.status(404).json({ message: "Product not found!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.products.findUnique({
      where: { id: Number(id) },
    });
    if (product) {
      return res.status(200).json({ product });
    }
    res.status(404).json({ message: "Product not found!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    let sku = req.body.sku;
    let barcode = req.body.barcode;
    let pd_name = req.body.pd_name;
    let pd_detail = req.body.pd_detail;
    let pd_type = req.body.pd_type;
    let pd_price = req.body.pd_price;
    let pd_discount = req.body.pd_discount;
    let pd_length = req.body.pd_length;
    let pd_color = req.body.pd_color;
    let pd_recom = req.body.pd_recom;
    let pd_picture = req.files.pd_picture[0].path;
    let pd_picture_1 = req.files.pd_picture_1[0].path;
    let pd_picture_2 = req.files.pd_picture_2[0].path;
    let pd_picture_3 = req.files.pd_picture_3[0].path;
    let pd_picturebig = req.files.pd_picturebig[0].path;
    const result = await prisma.products.create({
      data: {
        sku: sku,
        barcode: barcode,
        pd_name: pd_name,
        pd_detail: pd_detail,
        pd_type: pd_type,
        pd_price: pd_price,
        pd_discount: pd_discount,
        pd_length: pd_length,
        pd_color: pd_color,
        pd_recom: pd_recom,
        pd_picture: pd_picture,
        pd_picture_1: pd_picture_1,
        pd_picture_2: pd_picture_2,
        pd_picture_3: pd_picture_3,
        pd_picturebig: pd_picturebig,
      },
    });
    res.status(201).json(result);
  } catch (error) {
    console.log({ message: error.message });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.product.delete({
      where: { id: Number(id) },
    });
    res.status(204).json(deleted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductInCart = async (req, res) => {
  try {
    let pd_type = req.body.pd_type;
    let pd_color = req.body.color;
    let size = req.body.size;
    const product = await prisma.products.findMany({
      where: {
        pd_type: pd_type,
        pd_color: pd_color,
        pd_length: size,
      },
    });
    res.status(200).json(product);
  } catch (error) {}
};

const getCategorys = async (req, res) => {
  try {
    //group by pd_type and get data all
    let params = req.params.type;
    console.log(params);

    if (params === "all") {
      const result = await prisma.products.findMany({
        select: {
          sku: true,
          barcode: true,
          pd_type: true,
          pd_name: true,
          pd_discount: true,
          pd_price: true,
          pd_detail: true,
          pd_picture: true,
          pd_length: true,
        },
      });
      if (result.length === 0) {
        res.status(404).json({ message: "Product not found!" });
        return;
      } else {
        // fitter by pd_type no duplicate
        const result2 = result.filter((item, index, self) => {
          if (item.pd_length === "ตัดเมตร") {
            console.log("ตัดเมตร");
            return false;
          } else {
            return (
              self.findIndex((t) => {
                return t.pd_type === item.pd_type;
              }) === index
            );
          }
        });
        res.status(200).json(result2);
        return;
      }
    }

    const result = await prisma.products.findMany({
      select: {
        sku: true,
        barcode: true,
        pd_type: true,
        pd_name: true,
        pd_discount: true,
        pd_price: true,
        pd_detail: true,
        pd_picture: true,
        pd_length: true,
      },
      where: {
        type: params,
      },
    });
    if (result.length === 0) {
      res.status(404).json({ message: "Product not found!" });
      return;
    } else {
      // fitter by pd_type no duplicate and pd_length === 0
      const result2 = result.filter((item, index, self) => {
        if (item.pd_length === "ตัดเมตร") {
          console.log("ตัดเมตร");
          return false;
        } else {
          console.log("ไม่ตัดเมตร");
          return (
            self.findIndex((t) => {
              return t.pd_type === item.pd_type;
            }) === index
          );
        }
      });
      res.status(200).json(result2);
      return;
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = {
  getProducts,
  getProductsByReCom,
  getProductsByBarcode,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductInCart,
  getCategorys,
};
