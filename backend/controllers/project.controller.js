import projectModel from "../models/project.model.js";
import userModel from "../models/user.model.js";
import * as projectService from "../services/project.service.js";
import { validationResult } from "express-validator";

export const createProject = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name } = req.body;
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    console.log(req.body);
    const userId = loggedInUser._id;
    const newProject = await projectService.createProject({ name, userId });
    res.status(201).json(newProject);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const loggedInUser = await userModel.findOne({ email: req.user.email });

    const userId = loggedInUser._id;
    const projects = await projectService.getProjects({ userId });
    return res.status(200).json({ projects: projects });
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
};

export const addUser = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { projectId, users } = req.body;
    
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const userId = loggedInUser._id;
    const project = await projectService.addUsers({ projectId, users, userId });
    return res.status(200).json({ project: project });
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
};
