import User from "../Model/userModel.js";
import bcryptjs from "bcryptjs";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, userName, password, confirmPassword, gender } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "password dont match" });
    }

    const user = await User.findOne({ userName });

    if (user) {
      return res.status(400).json({ error: "UserName is already exists" });
    }

    //Hasj password
    const salt = await bcryptjs.genSalt(10);
    const hashpass = await bcryptjs.hash(password, salt);


    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/Girl?username=${userName}`;

    const newUser = new User({
      fullName,
      userName,
      password: hashpass,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });



    if (newUser) {
      // Generate JWT token here
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        profilePic: newUser.profilePic,
      });

    } else {
      res.status(400).json({ error: "Invalid user data" });
    }



    // await newUser.save();

    // res.status(201).json({
    //   _id: newUser._id,
    //   fullName: newUser.fullName,
    //   userName: newUser.userName,
    //   profilePic: newUser.profilePic, 
    // });



  } catch (error) {
    console.log("error in signUp conrtroller", error.message);
    res.status(500).json({ error: "error message " });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }

};
export const login = async (req, res) => {

  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    // const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || " ");

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      profilePic: user.profilePic,
    });
  }
  catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }

};
