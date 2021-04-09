const Checkbox = require("./Type/Checkbox");
const Slider = require("./Type/Slider");
const filters = { Checkbox, Slider };
module.exports = {
    createFilter(type, attributes) {
        const FilterType = filters[type];
        return new FilterType(attributes);
    }
};
