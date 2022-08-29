const { Contact } = require("../models/index");

exports.searchContacts = async (req, res, next) => {
    try {
        let { query, page, perPage, favourite } = req.query;
        let searchFilter = {};

        if (!page) {
            page = 1;
        } else {
            page = +page;
        }

        if (!perPage) {
            perPage = 20;
        } else {
            perPage = +perPage;
        }

        if (!favourite) {
            searchFilter = {
                name: {
                    $regex: query,
                    $options: "i",
                },
            };
        } else {
            searchFilter = {
                name: {
                    $regex: query,
                    $options: "i",
                },
                favourite,
            };
        }

        

        const allContacts = await Contact.find(searchFilter, null, {
            limit: perPage,
            skip: (page - 1) * perPage,
        }).populate({
            path: "owner",
        });

        const contactsCount = await Contact.count(searchFilter);

        res.json({
            items: allContacts,
            count: contactsCount,
            pagesCount: Math.ceil(contactsCount / perPage),
            page,
            perPage
        });
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
        const contact = await Contact.findById(req.params.id).populate({
            path: "owner",
        });

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
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, }).populate({
            path: "owner",
        });

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
        const contact = await Contact.findById(req.params.id).populate({
            path: "owner",
        });

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
        const contact = await Contact.findByIdAndDelete(req.params.id).populate({
            path: "owner",
        });

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