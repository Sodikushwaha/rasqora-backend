const mangoose = require('mongoose');
const vendorSchema = new mangoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firm: [
        {
            type: mangoose.Schema.Types.ObjectId,
            ref: 'Firm'
        }
    ]

});
module.exports = mangoose.model('Vendor', vendorSchema);