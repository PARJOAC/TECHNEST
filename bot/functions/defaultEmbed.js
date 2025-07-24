const { redEmbed } = require("./interactionEmbed");

async function errorEmbed(interaction, client, description, type) {
  return redEmbed(interaction, client, {
    type: type,
    title: "Error",
    description: description,
    withResponse: true,
    components: [],
  });
}

module.exports = {
  errorEmbed,
};
