import mongoose from "mongoose"; // Added import
import projectModel from "../models/project.model.js";

export const createProject = async ({ name, userId }) => {
  if (!name || !userId) {
    throw new Error("Name and user ID are required");
  }

  const project = await projectModel.create({ name, users: [userId] });
  return project;
};

export const getProjects = async ({ userId }) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const projects = await projectModel.find({ users: userId });
  return projects;
};

export const addUsers = async ({ projectId, users, userId }) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  // Validate projectId
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID");
  }
  if (!users) {
    throw new Error("Users array is required");
  }

  if (
    !Array.isArray(users) ||
    users.some((userId) => !mongoose.Types.ObjectId.isValid(userId))
  ) {
    throw new Error("Invalid user IDs in users array");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const project = await projectModel.findOne({
    _id: projectId,
    users: userId,
  });

  if (!project) {
    throw new Error("Project not found");
  }
  const updatedProject = await projectModel.findOneAndUpdate(
    { _id: projectId },
    { $addToSet: { users: { $each: users } } },
    { new: true }
  );
  return updatedProject;
};

export const getProject = async ({ projectId }) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID");
  }
  const project = await projectModel.findById(projectId).populate('users');
  return project;
};
