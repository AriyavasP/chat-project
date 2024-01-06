import { NextFunction, Request, Response } from "express";
import {
  createQuestion,
  showQuestion,
  createAnswer,
  showAnswer,
  addQatoDatabase,
  updateAnswer,
  showQuestionAndAnswer,
  deleteQA,
  searchkeyword,
  showAnswerbyID,
} from "../services/Service_Qa";

const Questionrequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { question, number, group } = req.body;
  createQuestion(question, number, group)
    .then((data: any) => {
      res.status(200).json({ data: data });
    })
    .catch((err: any) => {
      res.status(500).json({ err: err.message });
    });
};

const ShowFAQs = async (req: Request, res: Response, next: NextFunction) => {
  showQuestion()
    .then((data: any) => {
      res.status(200).json({ data: data });
    })
    .catch((err: any) => {
      res.status(500).json({ err: err.message });
    });
};

const Answerrequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { answer, questionid } = req.body;
  createAnswer(answer, questionid)
    .then((data: any) => {
      res.status(200).json({ data: data });
    })
    .catch((err: any) => {
      res.status(500).json({ err: err.message });
    });
};

const ShowAns = async (req: Request, res: Response, next: NextFunction) => {
  showAnswer()
    .then((data: any) => {
      res.status(200).json({ data: data });
    })
    .catch((err: any) => {
      res.status(500).json({ err: err.message });
    });
};

const ShowAnsByUserid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { questionid } = req.body;
  showAnswerbyID(questionid)
    .then((data: any) => {
      res.status(200).json({ data: data });
    })
    .catch((err: any) => {
      res.status(500).json({ err: err.message });
    });
};

const addFaqsdata = async (req: Request, res: Response, next: NextFunction) => {
  const { questionmassage, answermassage, number, group } = req.body;
  addQatoDatabase(questionmassage, answermassage, group, number)
    .then((data: any) => {
      res.status(200).json({ data: data });
    })
    .catch((err: any) => {
      res.status(500).json({ err: err.message });
    });
};

const updateAns = async (req: Request, res: Response, next: NextFunction) => {
  const { questionid, answer, group } = req.body;
  updateAnswer(answer, questionid, group)
    .then((data: any) => {
      res.status(200).json({ data: data });
    })
    .catch((err: any) => {
      res.status(500).json({ err: err.message });
    });
};

const ShowQA = async (req: Request, res: Response, next: NextFunction) => {
  showQuestionAndAnswer()
    .then((data: any) => {
      res.status(200).json({ data: data });
    })
    .catch((err: any) => {
      res.status(500).json({ err: err.message });
    });
};

const deleteDATAFAQs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { questionid, answerid } = req.body;
  deleteQA(questionid, answerid)
    .then((data: any) => {
      res.status(200).json({ data: data });
    })
    .catch((err: any) => {
      res.status(500).json({ err: err.message });
    });
};

const keyword = async (req: Request, res: Response, next: NextFunction) => {
  const { message } = req.body;
  searchkeyword(message)
    .then((data: any) => {
      res.status(200).json({ data: data });
    })
    .catch((err: any) => {
      res.status(500).json({ err: err.message });
    });
};
export {
  Questionrequest,
  ShowFAQs,
  Answerrequest,
  ShowAns,
  addFaqsdata,
  updateAns,
  ShowQA,
  deleteDATAFAQs,
  keyword,
  ShowAnsByUserid
};
