import express from "express";
import {
  Questionrequest,
  ShowFAQs,
  Answerrequest,
  ShowAns,
  addFaqsdata,
  updateAns,
  ShowQA,
  deleteDATAFAQs,
  keyword,
  ShowAnsByUserid,
} from "../controllers/Controller_Qa";
import { verifytoken } from "../middleware/validateJWTtoken";

const router = express.Router();

router.post("/createquestion", verifytoken, Questionrequest);
router.get("/showquestion", ShowFAQs);
router.post("/createans", verifytoken, Answerrequest);
router.get("/showanswer", verifytoken, ShowAns);

router.post("/addfaqs", verifytoken, addFaqsdata);
router.post("/ansupdate", verifytoken, updateAns);
router.get("/showallqa", ShowQA);
router.delete("/deletedatafaqs", verifytoken, deleteDATAFAQs);

router.post("/keyword", keyword);

router.post("/showansbyuserid", verifytoken, ShowAnsByUserid);

export = router;
