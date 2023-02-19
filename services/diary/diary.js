const db_prep = require("../db/db_prep");
const openai = require("../openai/openai");

const categorize = async (diary) => {
  const { title, content, organization_id, user_id } = diary;
  const { Category, Grouping } = await db_prep();

  const categories = await Category.findAll({
    where: {
      organization_id,
    },
  });

  const groupings = await Grouping.findAll({
    where: {
      user_id,
      organization_id,
    },
  });

  const prompt = `Read the diary:
    ${title}
    ${content}
    --
    Identify the overall sentiment of the content as a number (very negative = -2, very positive = 2).
    Does the writer identify any goals? Return these as an array strings.
    Does the writer identify any positive influences? Return an array with a value (short sentence string), a weight (number that adds up to 1 across the array) and a general grouping (class, teacher, friends, food, work, etc.)
    Does the writer identify any negative influences? Return an array with a value (short sentence string), a weight (number that adds up to 1 across the array) and a general grouping (class, teacher, friends, food, work, etc.)
    ${
      categories.length > 4
        ? `For each of the following categories, return an array strings that fall into this grouping, each should have a weight that adds up to 1:
    ${categories.reduce((acc, cat) => `${acc}\n${cat.name}`, "")}`
        : ""
    }
    Return the response as a JSON object. If this is not a diary entry, return false.
    ex. {"sentiment": 1, "goals": ["goal1", "goal2"], "positive_influences": [{"value":"influence1", "grouping": "homework", "weight": 0.2}, {"value":"influence2","grouping": "parents", "weight":  0.3} ... ], "negative_influences": [{"value":"influence1","category": "teacher", "weight": 0.2}, {"value":"influence2", "category": "sports","weight":  0.3} ... ], "category1":[{"value":"item1", "weight": 0.2}, {"value":"item2", "weight":  0.3} ... ], "category2":[{"value":"item1", "weight": 0.2}, {"value":"item2", "weight":  0.3} ... ]}`;
  try {
    const response =
      '{"sentiment": 1, "goals": ["Create diary analyzer prototype", "Build out linking interface", "Integrations to Google and O365", "Prepare YCombinator application", "Buy tickets for Seoul"], "positive_influences": [{"value":"Dashboards coming along well", "grouping": "Work", "weight": 0.2}, {"value":"Moving in a more positive direction with website", "grouping": "Work", "weight": 0.3}, {"value":"Pick up Lian this afternoon", "grouping": "Friends", "weight": 0.5}], "negative_influences": [{"value":"Stress about getting clients for main project", "grouping": "Work", "weight": 0.5}, {"value":"Need to dedicate time to building out linking interface", "grouping": "Work", "weight": 0.5}]}';
    //await openai.call(prompt);

    const weights = JSON.parse(response);

    for (const key in weights) {
      const cat = categories.find((cat) => {
        return cat.name === key;
      });

      if (cat) {
        if (Array.isArray(weights[key])) {
          for (const item of weights[key]) {
            const association = {};

            if (typeof item === "string") association.value = item;
            else {
              association.value = item.value;
              association.weight = item.weight || 0;
              if (item.grouping) {
                const grouping = groupings.find((grouping) => {
                  return grouping.name === item.grouping;
                });
                if (grouping) association.grouping_id = grouping.id;
                else {
                  const new_grouping = await Grouping.create({
                    name: item.grouping,
                    user_id,
                    organization_id,
                  });
                  association.grouping_id = new_grouping.id;
                }
              }
            }
            await diary.addCategory(cat.id, { through: association });
          }
        } else {
          const association =
            typeof weights[key] === "number"
              ? { weight: weights[key] }
              : { value: weights[key] };
          await diary.addCategory(cat.id, { through: association });
        }
      }
    }

    console.log(weights);
  } catch (error) {
    throw {
      status: 500,
      message: "Diary - error parsing OpenAI response",
      level: "Error",
      dump: error,
    };
  }
};

const store = async ({ title, content }, user_id, organization_id) => {
  try {
    const { Diary, Organization } = await db_prep();

    const org = await Organization.findByPk(organization_id);

    if (!org)
      throw {
        status: 400,
        message: "Diary - organization does not exist",
        level: "Error",
      };

    const new_diary = await Diary.create({
      title,
      content,
      user_id,
      organization_id,
    });

    await categorize(new_diary);

    return new_diary.id;
  } catch (error) {
    if (error.level) throw error;
    throw {
      status: 500,
      message: "Diary - error generating new diary",
      level: "Error",
      dump: error,
    };
  }
};

module.exports = { store };
