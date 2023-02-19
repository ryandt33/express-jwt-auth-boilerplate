const get_model = require("./get_model");

const db_prep = async () => {
  const System = await get_model("system");
  const Logger = await get_model("logger");
  const User = await get_model("user");
  const Diary = await get_model("diary");
  const Category = await get_model("category");
  const Category_Association = await get_model("category_association");
  const Organization = await get_model("organization");
  const Grouping = await get_model("grouping");

  User.hasMany(Diary, {
    foreignKey: "user_id",
    as: "diaries",
  });
  Diary.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  Diary.belongsTo(Organization, {
    foreignKey: "organization_id",
    as: "organization",
  });
  Organization.hasMany(Diary, {
    foreignKey: "organization_id",
    as: "diaries",
  });

  Category.belongsToMany(Diary, {
    through: Category_Association,
    foreignKey: "category_id",
    as: "diaries",
  });
  Diary.belongsToMany(Category, {
    through: Category_Association,
    foreignKey: "diary_id",
    as: "categories",
  });

  User.belongsToMany(Organization, {
    through: "user_organization",
    foreignKey: "user_id",
    as: "organizations",
  });
  Organization.belongsToMany(User, {
    through: "user_organization",
    foreignKey: "organization_id",
    as: "users",
  });
  Organization.belongsTo(Organization, {
    foreignKey: "parent_id",
    as: "parent",
  });

  Category.belongsTo(Organization, {
    foreignKey: "organization_id",
    as: "organization",
  });
  Organization.hasMany(Category, {
    foreignKey: "organization_id",
    as: "categories",
  });

  Category_Association.belongsTo(Grouping, {
    foreignKey: "grouping_id",
    as: "grouping",
  });
  Grouping.hasMany(Category_Association, {
    foreignKey: "grouping_id",
    as: "category_associations",
  });

  Grouping.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });
  User.hasMany(Grouping, {
    foreignKey: "user_id",
    as: "groupings",
  });

  Grouping.belongsTo(Organization, {
    foreignKey: "organization_id",
    as: "organization",
  });
  Organization.hasMany(Grouping, {
    foreignKey: "organization_id",
    as: "groupings",
  });

  return {
    System,
    Logger,
    User,
    Diary,
    Category,
    Category_Association,
    Organization,
    Grouping,
  };
};

module.exports = db_prep;
