const db_prep = require("../db/db_prep");
const category = require("../category/category");
const store = async (name, parent_id) => {
  try {
    const { Organization } = await db_prep();

    if (parent_id) {
      const parent = await Organization.findByPk(parent_id);
      if (!parent)
        throw {
          status: 400,
          message: "Organization - parent organization does not exist",
          level: "Error",
          dump: error,
        };
    }

    const org = { name };

    if (parent_id) org.parent_id = parent_id;
    const new_org = await Organization.create(org);

    const default_categories = [
      "sentiment",
      "goals",
      "positive_influences",
      "negative_influences",
    ];

    for (const cat of default_categories) {
      await category.store(cat, new_org.id);
    }

    return new_org.id;
  } catch (error) {
    if (error.level) throw error;
    throw {
      status: 500,
      message: "Organization - error generating new organization",
      level: "Error",
      dump: error,
    };
  }
};

const add_users = async (org_id, user_ids) => {
  try {
    const { Organization, User } = await db_prep();

    const org = await Organization.findByPk(org_id);

    const parent = org.parent_id
      ? await Organization.findByPk(org.parent_id)
      : null;

    if (org.parent_id && !parent)
      throw {
        status: 400,
        message: "Organization - parent organization does not exist",
        level: "Error",
        dump: error,
      };

    const users = await User.findAll({
      where: {
        id: user_ids,
      },
    });

    if (users.length !== user_ids.length)
      throw {
        status: 400,
        message: "Organization - some users do not exist",
        level: "Error",
        dump: error,
      };

    await org.addUsers(users);
    parent && (await parent.addUsers(users));

    return true;
  } catch (error) {
    if (error.level) throw error;
    throw {
      status: 500,
      message: "Organization - error assigning users to org",
      level: "Error",
      dump: error,
    };
  }
};

module.exports = { store, add_users };
