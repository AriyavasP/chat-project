import mongoose from "mongoose";
import QA from "../models/model_qa";
import Answer from "../models/model_answer";

const createQuestion = async (
  question: string,
  number: number,
  group: string
) => {
  try {
    const quest = new QA({
      _id: new mongoose.Types.ObjectId(),
      option: [null],
      group: group,
      number: number,
      message: question,
      create_time: new Date(),
      status: true,
    });

    await quest.save();

    return quest;
  } catch (error) {
    throw error;
  }
};

const showQuestion = async () => {
  try {
    const qa = await QA.find({});

    return qa;
  } catch (error) {
    throw error;
  }
};

const sentQuestion = async () => {
  try {
    const qa = QA.aggregate([{ $project: { _id: 0, message: 1, group: 1 } }]);

    return qa;
  } catch (error) {
    throw error;
  }
};

const createAnswer = async (answer: string, questionid: string) => {
  try {
    const ans = new Answer({
      _id: new mongoose.Types.ObjectId(),
      id_question: questionid,
      message: answer,
      create_time: new Date(),
      status: true,
    });

    await ans.save();

    return ans;
  } catch (error) {
    throw error;
  }
};

const showAnswer = async () => {
  try {
    const ans = await Answer.find({});

    return ans;
  } catch (error) {
    throw error;
  }
};

const showAnswerbyID = async (ID: string) => {
  try {
    const ans = await Answer.findOne({ id_question: ID });

    return ans;
  } catch (error) {
    throw error;
  }
};

const addQatoDatabase = async (
  questionmassage: string,
  answermassage: any,
  group: string,
  number: number
) => {
  try {
    const quest = new QA({
      _id: new mongoose.Types.ObjectId(),
      option: [null],
      group: group,
      number: number,
      message: questionmassage,
      create_time: new Date(),
      status: true,
    });

    await quest.save();
    if (answermassage != null) {
      for (const data of answermassage) {
        const ans = new Answer({
          _id: new mongoose.Types.ObjectId(),
          id_question: quest._id,
          message: data,
          create_time: new Date(),
          status: true,
        });
        await ans.save();
      }
    }

    return quest;
  } catch (error) {
    throw error;
  }
};

const updateAnswer = async (
  answer: string,
  questionid: string,
  group: string
) => {
  try {
    const ans: any = await Answer.findOne({ id_question: questionid });
    ans.message = answer;
    ans.group = group;

    await ans.save();

    return ans;
  } catch (error) {
    throw error;
  }
};

const showQuestionAndAnswer = async () => {
  try {
    const ans: any = await Answer.find({});
    const qa: any = await QA.find({});

    const data: any = qa.map((dataqa: any) => {
      let test = ans.map((dataans: any) => {
        let newdata: any = [];
        if (dataqa._id == dataans.id_question) {
          newdata = [
            {
              Q: dataqa.message,
              A: dataans.message,
              id_question: dataqa._id,
              id_answer: dataans._id,
              count: dataqa.number,
            },
          ];
        }
        return newdata;
      });
      return test;
    });

    let test: any = [];

    for (let i = 0; i < data.length; i++) {
      for (let k = 0; k < data[i].length; k++) {
        if (data[i][k].length > 0) {
          test = test.concat(data[i][k]);
        }
      }
    }

    return test;
  } catch (error) {
    throw error;
  }
};

const deleteQA = async (questionid: any, answerid: any) => {
  try {
    const ans = await Answer.remove({ _id: answerid });
    const qa = await QA.remove({ _id: questionid });

    return "Delete Successful";
  } catch (error) {
    throw error;
  }
};

const searchgroup = async (message: string) => {
  const qa: any = await QA.aggregate([{ $match: { group: message } }]);
  const ans: any = await Answer.find({});

  let datatest: any = [];

  for (const itemqa of qa) {
    for (const itemans of ans) {
      if (itemqa._id == itemans.id_question) {
        datatest.push({
          Q: itemqa.message,
          A: itemans.message,
        });
      }
    }
  }

  return datatest;
};

const searchkeyword = async (message: string) => {
  const qa: any = await QA.aggregate([{ $project: { message: 1, _id: 1 } }]);

  let data: any = [];
  for (const item of qa) {
    data.push(item.message);
  }

  let result = [];

  let keywordmacth = [];

  for (const item of data) {
    result.push(item.split(" "));
  }

  const afterinput = message.split(" ");

  // for (const datain of afterinput) {
  //   for (const i of result) {
  //     for (const k of i) {
  //       if (datain == k) {
  //         keywordmacth.push(i);
  //         console.log("MACTH", k);
  //       }
  //     }
  //   }
  // }

  for (let i = 0; i < afterinput.length; i++) {
    for (let k = 0; k < result.length; k++) {
      for (let j = 0; j < result[k].length; j++) {
        if (
          afterinput[i].toUpperCase() == result[k][j].toUpperCase() &&
          afterinput[0].toUpperCase() == result[k][0].toUpperCase()
        ) {
          keywordmacth.push(result[k]);
          // console.log("MACTH", result[k][j]);
        }
      }
    }
  }

  let sentence = [];

  for (const item of keywordmacth) {
    sentence.push(item.join(" "));
  }

  const calculate = sentence.reduce(function (r: any, a: any) {
    r[a] = r[a] || [];
    r[a].push(a);
    return r;
  }, {});

  const summary = Object.keys(calculate)
    .map((item) => {
      return {
        word: item,
        count: calculate[item].length,
        persen: ((calculate[item].length * 100) / sentence.length).toFixed(2),
      };
    })
    .filter((item: any) => item.count >= afterinput.length);

  // console.log(summary.sort((a: any, b: any) => b.count - a.count).filter((item: any) => item.count >= afterinput.length));

  const questionexpected: any = summary.sort(
    (a: any, b: any) => b.count - a.count
  )[0];

  let answerofquestion: any;

  if (questionexpected === undefined) {
    return false;
  }

  // const num = sentence.length * 0.4;

  // if (num > questionexpected.count) {
  //   return false;
  // }

  for (const item of qa) {
    if (item.message == questionexpected.word) {
      answerofquestion = item;
    }
  }

  const ans = await Answer.findOne({ id_question: answerofquestion._id });

  const updatecount: any = await QA.findById(answerofquestion._id);
  updatecount.number = updatecount.number + 1;
  await updatecount.save();

  return ans;
};

export {
  createQuestion,
  showQuestion,
  createAnswer,
  showAnswer,
  addQatoDatabase,
  updateAnswer,
  showQuestionAndAnswer,
  deleteQA,
  searchgroup,
  searchkeyword,
  sentQuestion,
  showAnswerbyID,
};
