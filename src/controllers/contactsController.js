const { Contact } = require("../models/index");

exports.searchContacts = async (req, res, next) => {
    try {
        const allContacts = await Contact.find();

        res.json(allContacts);
    } catch (error) {
        next(error);
    }
}

exports.createNewContact = async (req, res, next) => {
    try {
        const newContact = await Contact.create(req.body);

        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
}

exports.getContactById = async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            res.status(404).send("Contact not found!");
            return;
        }

        res.json(contact);
    } catch (error) {
        next(error);
    }
}

exports.updateContact = async (req, res, next) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, });

        if (!contact) {
            res.status(404).send("Contact not found!");
            return;
        }

        res.json(contact);
    } catch (error) {
        next(error);
    }
}

exports.updateFavouriteForContact = async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            res.status(404).send("Contact not found!");
            return;
        }

        contact.favourite = req.body.favourite;
        await contact.save();

        res.json(contact);
    } catch (error) {
        next(error);
    }
}

exports.deleteContact = async (req, res, next) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            res.status(404).send("Contact not found!");
            return;
        }

        res.json({
            message: "Contact deleted!",
        });
    } catch (error) {
        next(error);
    }
}