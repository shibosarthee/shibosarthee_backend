import User from "../Models/User.js";
import generateToken from "../Utils/generateToken.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetching users", error: error.message });
  }
};

export const getUserbyId = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "user not founnd" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "error while fetching user", error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ phone: req.body.phone });
    if (existingUser) {
      return res.status(400).json({ message: "user already exists" });
    }
    const user = await User.create(req.body);
    res.status(200).json({ 
      message: "user created successfully",
      token: generateToken(user._id),
      user
     });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error while creating user", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updateuser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updateUser) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ message: "user updated successfully", User });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error while upadeting user", error: error.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while deleting user", error: error.message });
  }
};
