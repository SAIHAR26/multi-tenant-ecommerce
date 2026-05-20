const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin access only"
        });
    }

    next();
};

const vendorOnly = (req, res, next) => {
    if (req.user.role !== "vendor") {
        return res.status(403).json({
            message: "Vendor access only"
        });
    }

    next();
};

const customerOnly = (req, res, next) => {
    if (req.user.role !== "customer") {
        return res.status(403).json({
            message: "Customer access only"
        });
    }

    next();
};

module.exports = {
    adminOnly,
    vendorOnly,
    customerOnly
};