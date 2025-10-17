import Request from "../Models/Request.js";
import Profile from "../Models/Profilemodel.js";

/**
 * @desc Send a profile request
 */
export const sendRequest = async (req, res) => {
  try {
    const { senderProfileId, receiverProfileId, message } = req.body;

    if (!senderProfileId || !receiverProfileId) {
      return res.status(400).json({ message: "Both profile IDs are required" });
    }

    const receiverProfile = await Profile.findById(receiverProfileId).populate("user");
    if (!receiverProfile)
      return res.status(404).json({ message: "Receiver profile not found" });

    if (receiverProfile.user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot send request to yourself" });
    }

    const existing = await Request.findOne({
      sender: req.user._id,
      senderProfile: senderProfileId,
      receiverProfile: receiverProfileId,
    });
    if (existing)
      return res.status(400).json({ message: "Request already sent" });

    const newRequest = await Request.create({
      sender: req.user._id,
      senderProfile: senderProfileId,
      receiver: receiverProfile.user._id,
      receiverProfile: receiverProfileId,
      message,
    });

    // ✅ Send Firebase notification
    if (receiverProfile.user.fcmToken) {
      await sendNotification(
        receiverProfile.user.fcmToken,
        "New Profile Request",
        `${req.user.name} has sent a request to your profile`,
        { type: "profile_request", requestId: newRequest._id.toString() }
      );
    }

    res.status(201).json({ message: "Request sent successfully", request: newRequest });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Get requests received by logged-in user
 */
export const getReceivedRequests = async (req, res) => {
  try {
    const requests = await Request.find({ receiver: req.user._id })
      .populate("sender", "name email")
      .populate("senderProfile", "fullName age gender")
      .populate("receiverProfile", "fullName")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Get requests sent by logged-in user
 */
export const getSentRequests = async (req, res) => {
  try {
    const requests = await Request.find({ sender: req.user._id })
      .populate("receiver", "name email")
      .populate("receiverProfile", "fullName")
      .populate("senderProfile", "fullName")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Accept or reject a request
 */
export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body; // accepted | rejected

    const request = await Request.findById(requestId).populate("sender");
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to modify this request" });
    }

    request.status = status;
    await request.save();

    // ✅ Notify sender about status update
    if (request.sender.fcmToken) {
      await sendNotification(
        request.sender.fcmToken,
        "Request Update",
        `${req.user.name} has ${status} your request`,
        { type: "request_status", requestId: request._id.toString(), status }
      );
    }

    res.json({ message: `Request ${status}`, request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * @desc Cancel request (by sender)
 */
export const cancelRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this request" });
    }

    request.status = "cancelled";
    await request.save();

    res.json({ message: "Request cancelled", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};