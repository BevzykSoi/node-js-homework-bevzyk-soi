const Yup = require('yup');

exports.updateSubscription = Yup.object().shape({
    subscription: Yup.string().oneOf(["starter", "pro", "business"]).required(),
});