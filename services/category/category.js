const db_prep = require("../db/db_prep");

const store = async (name, organization_id) => {
  try {
    const { Category, Organization } = await db_prep();

    const org = await Organization.findByPk(organization_id);

    if (!org)
      throw {
        status: 400,
        message: "Category - organization does not exist",
        level: "Error",
        dump: error,
      };

    const existing_category = await Category.findOne({
      where: {
        name,
        organization_id,
      },
    });

    if (existing_category)
      throw {
        status: 400,
        message: "Category - category already exists",
        level: "Error",
      };

    const new_category = await Category.create({
      name,
      organization_id,
    });

    return new_category.id;
  } catch (error) {
    if (error.level) throw error;
    throw {
      status: 500,
      message: "Category - error generating new category",
      level: "Error",
      dump: error,
    };
  }
};

module.exports = { store };
