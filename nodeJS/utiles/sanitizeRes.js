const mongoose = require("mongoose");

const toJSONPlugin = (schema) => {
  schema.set("toJSON", {
    transform: function (doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  });
};

mongoose.plugin(toJSONPlugin);

module.exports = toJSONPlugin;
