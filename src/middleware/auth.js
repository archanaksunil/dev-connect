const adminAuth = (req, res, next) => {
    const token = "xyz";
    const auth = token === "abc";
    if(!auth) {
        res.status(401).send("Not authorized");
    } else {
        console.log("authorized")
        next();
    }
}

const userAuth = (req, res, next) => {
    const token = "xyz";
    const auth = token === "xyz";
    if(!auth) {
        res.status(401).send("Not authorized");
    } else {
        console.log("authorized")
        next();
    }
}

module.exports = {adminAuth, userAuth};