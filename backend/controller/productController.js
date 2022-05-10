const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/ApiFeatures");

// Create product -- Admin Only
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
	req.body.user = req.user.id;
	const product = await Product.create(req.body);
	res.status(201).json({
		success: true,
		product,
	});
});

// Get All Products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
	const resultPerPage = 8;
	const productCount = await Product.countDocuments();
	const apifeatures = new ApiFeatures(Product.find(), req.query)
		.search()
		.filter()
		.pagination(resultPerPage);
	const products = await apifeatures.query;

	res.status(200).json({
		success: true,
		products,
		productCount,
	});
});

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
	const product = await Product.findById(req.params.id);
	if (!product) {
		return next(new ErrorHander("Product not Found", 404));
	}
	res.status(200).json({
		success: true,
		product,
	});
});

// Update Product -- Admin Only
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
	let product = await Product.findById(req.params.id);
	if (!product) {
		return next(new ErrorHander("Product not Found", 404));
	}
	product = await Product.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});
	res.status(200).json({
		success: true,
		product,
	});
});

// Delete Product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
	const product = await Product.findById(req.params.id);
	if (!product) {
		return next(new ErrorHander("Product not Found", 404));
	}
	await product.remove();
	res.status(200).json({
		success: true,
		message: "Product Deleted Successfully",
	});
});
