const controller = {};
const models = require('../models');
const { Op } = require('sequelize');

let page;
let category;
let search;
let tag;

controller.showList = async (req, res) => {
    page = req.query.page || 1;
    if (req.query.category) {
        category = req.query.category;
    } else if (req.query.search) {
        search = req.query.search;
    } else if (req.query.tag) {
        tag = req.query.tag;
    } else if (!req.query.page) {
        category = req.query.category;
        search = req.query.search;
        tag = req.query.tag;
    }
    let totalBlogs = await models.Blog.findAll({
        where: {
            ...(category ? { categoryId: category } : {}),
            ...(search ? { title: { [Op.iLike]: '%' + search + '%' } } : {}),
        },
        include: [
            { model: models.Tag, where: tag ? { id: tag } : {} },
        ],
    });
    console.log(totalBlogs.length);
    res.locals.blogs = await models.Blog.findAll({
        where: {
            ...(category ? { categoryId: category } : {}),
            ...(search ? { title: { [Op.iLike]: '%' + search + '%' } } : {}),
        },
        include: [
            { model: models.Comment },
            { model: models.Tag, where: tag ? { id: tag } : {} },
        ],
        limit: 4,
        offset: (page - 1) * 4,
    });
    res.locals.categories = await models.Category.findAll({
        include: [{ model: models.Blog }],
    });
    res.locals.tags = await models.Tag.findAll();
    res.render('index', {
        pagination: {
            page: parseInt(page),
            limit: 1,
            totalRows: Math.ceil(totalBlogs.length / 4),
        },
    });
};

controller.showDetails = async (req, res) => {
    let id = isNaN(req.params.id) ? 0 : req.params.id;
    res.locals.blog = await models.Blog.findOne({
        attributes: ['id', 'title', 'description', 'createdAt'],
        where: { id: id },
        include: [
            { model: models.Category },
            { model: models.User },
            { model: models.Tag },
            { model: models.Comment },
        ],
    });
    res.locals.categories = await models.Category.findAll({
        include: [{ model: models.Blog }],
    });
    res.locals.tags = await models.Tag.findAll();
    res.render('details');
};

module.exports = controller;
