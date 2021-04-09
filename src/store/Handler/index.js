const Form = require("./Form");
const filters = { Form };
module.exports = {
    createHandler(type, attributes) {
        const FilterType = filters[type];
        return new FilterType(attributes);
    }
};
