var express = require("express");
var router = express.Router();

// Create Group
router.post("/create", (res, req) => {});

// Get all Groups
router.get("/", (req, res) => {});

// Get Group
router.get("/:id", (res, req) => {});

// Get invitation code
router.get("/invitation/:code", (res, req) => {});

// Update Group
router.put("/:id", (res, req) => {});

// Delete Group
router.delete("/:id", (res, req) => {});
