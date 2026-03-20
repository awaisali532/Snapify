const Order = require("../models/order-model");
const Account = require("../models/account-model");
const ScorePackage = require("../models/score-package-model");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");

const extractPublicId = (url) => {
  try {
    const parts = url.split("/");
    const file = parts.pop().split(".")[0];
    const folder = parts.pop();
    return `${folder}/${file}`;
  } catch (error) {
    return null;
  }
};

const createOrder = async (req, res) => {
  let uploadedScreenshotUrl = req.body.paymentScreenshot;

  try {
    const {
      orderType = "Account",
      buyerName,
      buyerPhone,
      buyerEmail,
      accountId,
      scorePackageId,
      snapchatUsername,
      snapchatPassword,
      paymentMethod,
      paymentScreenshot,
    } = req.body;

    let newOrderData = {
      user: req.user._id,
      orderType,
      buyerName,
      buyerPhone,
      buyerEmail,
      paymentMethod,
      paymentScreenshot,
      status: "Pending",
    };

    let discordEmbedTitle = "";
    let priceString = "";

    if (orderType === "Account") {
      const account = await Account.findById(accountId);

      if (!account) throw new Error("Account not found!");
      if (account.isSold)
        throw new Error("Sorry! This account is already sold.");

      newOrderData.account = accountId;
      newOrderData.priceAtPurchase = account.price;
      discordEmbedTitle = `📦 Account Buy: ${account.title}`;
      priceString = `Rs ${account.price}`;

      account.isSold = true;
      await account.save();
    } else if (orderType === "Boosting") {
      const pkg = await ScorePackage.findById(scorePackageId);

      if (!pkg) throw new Error("Package not found!");
      if (!pkg.isActive) throw new Error("Package unavailable.");

      const finalPrice = pkg.isOffer ? pkg.offerPrice : pkg.price;

      newOrderData.scorePackage = scorePackageId;
      newOrderData.snapchatUsername = snapchatUsername;
      newOrderData.snapchatPassword = snapchatPassword;
      newOrderData.priceAtPurchase = finalPrice;

      discordEmbedTitle = `🚀 Score Boost: ${pkg.title} (+${pkg.scoreAmount})`;
      priceString = `Rs ${finalPrice}`;
    }

    const newOrder = new Order(newOrderData);
    const savedOrder = await newOrder.save();

    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (discordWebhookUrl) {
      const discordMessage = {
        content: `🚨 **NEW ${orderType.toUpperCase()} ORDER!** 🚨`,
        embeds: [
          {
            title: discordEmbedTitle,
            color: 16763904,
            fields: [
              { name: "👤 Buyer", value: buyerName, inline: true },
              { name: "📱 WhatsApp", value: buyerPhone, inline: true },
              { name: "💳 Method", value: paymentMethod, inline: true },
              { name: "💰 Price", value: priceString, inline: true },
              {
                name: "🔗 Order ID",
                value: savedOrder._id.toString(),
                inline: false,
              },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      };
      axios
        .post(discordWebhookUrl, discordMessage)
        .catch((err) => console.error("Discord Error:", err.message));
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: savedOrder,
    });
  } catch (error) {
    if (uploadedScreenshotUrl) {
      const publicId = extractPublicId(uploadedScreenshotUrl);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log(
            `[CLEANUP] Orphaned receipt deleted from Cloudinary: ${publicId}`,
          );
        } catch (cleanupError) {
          console.error("Failed to delete orphaned receipt:", cleanupError);
        }
      }
    }

    res.status(400).json({
      success: false,
      message: error.message || "Failed to place order",
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate(
        "account",
        "title price gender snapchatUsername snapchatPassword recoveryEmail emailPassword images",
      )
      .populate("scorePackage", "title scoreAmount deliveryTime") // Boosting ke liye
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch your orders" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ isVisibleToAdmin: true })
      .populate(
        "account",
        "title price gender snapchatUsername snapchatPassword images",
      )

      .populate("scorePackage", "title scoreAmount isOffer")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate("account");
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (order.orderType === "Account" && order.account) {
      if (status === "Rejected" && order.status !== "Rejected") {
        await Account.findByIdAndUpdate(order.account._id, { isSold: false });
      } else if (status !== "Rejected" && order.status === "Rejected") {
        await Account.findByIdAndUpdate(order.account._id, { isSold: true });
      }

      if (status === "Verified" && order.status !== "Verified") {
        if (order.account.images && order.account.images.length > 0) {
          for (const imgUrl of order.account.images) {
            const publicId = extractPublicId(imgUrl);
            if (publicId) await cloudinary.uploader.destroy(publicId);
          }
          await Account.findByIdAndUpdate(order.account._id, { images: [] });
        }
      }
    }

    order.status = status;
    await order.save();
    res.status(200).json({
      success: true,
      message: `Order marked as ${status}`,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

const trackOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("account")
      .populate("scorePackage");
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Invalid Order ID." });

    let responseData = {
      orderId: order._id,
      orderType: order.orderType,
      buyerName: order.buyerName,
      status: order.status,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      price: order.priceAtPurchase,
      title:
        order.orderType === "Account"
          ? order.account?.title || "N/A"
          : order.scorePackage?.title || "N/A",
    };

    if (
      order.status === "Verified" &&
      order.orderType === "Account" &&
      order.account
    ) {
      responseData.secretCredentials = {
        snapchatUsername: order.account.snapchatUsername,
        snapchatPassword: order.account.snapchatPassword,
        recoveryEmail: order.account.recoveryEmail,
        emailPassword: order.account.emailPassword,
      };
    }

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Invalid Order ID format." });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (order.paymentScreenshot && order.paymentScreenshot !== "deleted") {
      const publicId = extractPublicId(order.paymentScreenshot);
      if (publicId) await cloudinary.uploader.destroy(publicId);
      order.paymentScreenshot = "deleted";
    }

    order.isVisibleToAdmin = false;
    await order.save();
    res
      .status(200)
      .json({ success: true, message: "Order hidden successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to hide order" });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalAccounts = await Account.countDocuments();
    const soldAccounts = await Account.countDocuments({ isSold: true });
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const verifiedOrders = await Order.find({ status: "Verified" }).sort({
      createdAt: 1,
    });

    const totalRevenue = verifiedOrders.reduce(
      (sum, order) => sum + order.priceAtPurchase,
      0,
    );

    const chartDataMap = {};
    verifiedOrders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
      if (!chartDataMap[date])
        chartDataMap[date] = { date, revenue: 0, orders: 0 };
      chartDataMap[date].revenue += order.priceAtPurchase;
      chartDataMap[date].orders += 1;
    });

    res.status(200).json({
      success: true,
      data: {
        totalAccounts,
        soldAccounts,
        pendingOrders,
        totalRevenue,
        chartData: Object.values(chartDataMap),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  trackOrder,
  getMyOrders,
  deleteOrder,
  getDashboardStats,
};
