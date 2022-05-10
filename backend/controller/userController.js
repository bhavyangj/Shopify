const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

// Register user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
	const { name, email, password } = req.body;
	const user = await User.create({
		name,
		email,
		password,
		avatar: {
			public_id: "sample id",
			url: "sample url",
		},
	});
	sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new ErrorHander("Please Enter Email & Password", 400));
	}
	const user = await User.findOne({ email }).select("+password");
	if (!user) {
		return next(new ErrorHander("Invalid Email or Password", 401));
	}
	const isPasswordMatched = user.comparePassword(password);
	if (!isPasswordMatched) {
		return next(new ErrorHander("Invalid Email or Password", 401));
	}
	sendToken(user, 200, res);
});

// Logout user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
	res.cookie("token", null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});
	res.status(200).json({
		success: true,
		message: "logged out successfully",
	});
});

// Forgot password

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new ErrorHander("User not Found", 404));
	}

	// Get Reset password Token
	const resetToken = user.getResetPasswordToken();
	await user.save({ validateBeforeSave: false });
	const resetPasswordUrl = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/password/reset${resetToken}`;

	const message = `Your Password Reset Token is : \n\n ${resetPasswordUrl} \nIf you have not requested this email then, please ignore it.`;
	try {
		await sendEmail({
			email: user.email,
			subject: `Shopify Password Recovery`,
			message,
		});
		res.status(200).json({
			success: true,
			message: `Email Sent to ${user.email} successfully`,
		});
	} catch (error) {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;
		await user.save({ validateBeforeSave: false });
		return next(new ErrorHander(error.message, 500));
	}
});

// Get User Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.user.id);
	res.status(200).json({
		success: true,
		user,
	});
});

// Update Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.user.id).select("+password");
	const isPasswordMatched = await user.comparePassword(
		req.body.currentPassword
	);
	console.log(user, isPasswordMatched);
	if (!isPasswordMatched) {
		return next(new ErrorHander("Current Password is not Correct", 400));
	}
	if (req.body.newPassword !== req.body.confirmPassword) {
		return next(new ErrorHander("Password does not match", 400));
	}
	user.password = req.body.newPassword;
	await user.save();
	sendToken(user, 200, res);
});
