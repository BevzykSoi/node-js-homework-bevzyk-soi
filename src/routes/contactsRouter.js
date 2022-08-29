const express = require("express");
const {
    searchContacts,
    createNewContact,
    getContactById,
    updateContact,
    updateFavouriteForContact,
    deleteContact,
} = require("../controllers/contactsController");

const router = express.Router();
const schemaValidate = require("../middlewares/schemaValidate");
const contactsValidators = require("../validators/contacts");

router.get("/", schemaValidate(contactsValidators.getAllContacts), searchContacts);
router.post("/", createNewContact);
router.get("/:id", getContactById);
router.put("/:id", updateContact);
router.patch("/:id/favourite", updateFavouriteForContact);
router.delete("/:id", deleteContact);

module.exports = router;