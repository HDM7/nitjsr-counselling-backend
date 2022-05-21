const db = require("../../helpers/dbconnect");

const updateStudentVerifyingOfficer = async (req, res) => {
  const centerInchargeEmail = req.user.email || "chairman@nimcet.in";
  const { verifyingOfficer: verifyingOfficerEmail, regNo } = req.body;

  try {
    const studentStatus = await db.queryAsync(
      "SELECT name FROM student_status WHERE regno = ?",
      [regNo]
    );

    if (studentStatus.length == 0) {
      throw new Error("No such student found!");
    }

    const centerInchargeCollege = await db.queryAsync(
      "SELECT college FROM center_incharge WHERE email = ?",
      [centerInchargeEmail]
    );

    const verifyingOfficerCollege = await db.queryAsync(
      "SELECT college FROM verifying_officers WHERE email = ?",
      [verifyingOfficerEmail]
    );

    if (verifyingOfficerCollege.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Verifying officer does not exist" });
    }

    if (verifyingOfficerCollege !== centerInchargeCollege) {
      throw new Error("Unauthorized access");
    }

    await db.queryAsync(
      "UPDATE student_status SET verifying_officer = ? WHERE regNo = ?",
      [verifyingOfficerEmail, regNo]
    );

    res.status(200).json({ success: true, message: "Update successful" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = updateStudentVerifyingOfficer;
