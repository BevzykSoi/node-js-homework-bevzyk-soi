module.exports = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    console.log(error);
    res.status(statusCode).send(error);
    process.exit(1);
}