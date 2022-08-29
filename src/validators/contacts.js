const Yup = require("yup");

exports.getAllContacts = Yup.object().shape({
    query: Yup.string(),
    page: Yup.number(),
    perPage: Yup.number(),
    favourite: Yup.boolean(),
});