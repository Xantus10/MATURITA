/**
 * File: subjects.ts
 * Purpose: Subjects management related routes
 */

import { Router, type Request, type Response } from "express";
import { checkRole, loggedin } from "../middlewares/session.js";
import { Types } from "mongoose";
import Subject from "../db/models/subject.js";

const subjectsrouter = Router();

// User must be logged in
subjectsrouter.use(loggedin);

/**
 * Return a list of all subjects
 */
subjectsrouter.get('/', async (req: Request, res: Response) => {
  let slist = await Subject.find();
  return res.status(200).send({slist: slist});
});

/**
 * Add a new subject
 */
subjectsrouter.post('/', checkRole('admin'), async (req: Request, res: Response) => {
  if (!req.body.subject) return res.status(400).send({msg: "subj.4.0"});
  let subject = req.body.subject;
  let exists = await Subject.findOne({ Subject: subject });
  if (!exists) {
    await Subject.insertOne({ Subject: subject });
  }
  return res.status(201).send({msg: 'subj.2.0'});
});

/**
 * Remove a subject
 */
subjectsrouter.delete('/', checkRole('admin'), async (req: Request, res: Response) => {
  if (!req.body.subjectid) return res.status(400).send({msg: "std.4.0"});
  let subjectid = new Types.ObjectId(req.body.subjectid as string);
  let exists = await Subject.findById(subjectid);
  if (exists) {
    let rmsub = await Subject.findByIdAndDelete(subjectid);
    return res.status(200).send({msg: 'subj.2.1'});
  }
  return res.status(404).send({msg: 'subj.4.1'});
});


export default subjectsrouter;
