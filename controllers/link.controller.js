const Link = require('../models/Link');
const config = require('config');
const shortid = require('shortid');

exports.generateLink = async (req, res) => {
  try {
    const baseUrl = config.get('baseUrl');
    const {from} = req.body;
    const code = shortid.generate();
    const existing = await Link.findOne({from});

    if (existing) {
      return res.json({link: existing});
    }

    const to = baseUrl + '/t/' + code;
    const link = new Link({
      code, to, from, owner: req.user.userId
    });

    await link.save();

    res.status(201).json({link});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLinks = async (req, res) => {
  try {
    const links = await Link.find({owner: req.user.userId});
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    res.json(link);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};