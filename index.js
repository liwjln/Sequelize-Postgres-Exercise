const express = require('express');
const app = express();
const port = 4000 || process.env.PORT;
const expressHbs = require('express-handlebars');
const paginateHelper = require('express-handlebars-paginate');

app.use(express.static(__dirname + '/html'));

var hbs = expressHbs.create({
    layoutsDirs: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    defaultLayout: 'layout',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    },
    helpers: {
        showDate: (date) => {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        },
        when: function (operand_1, operator, operand_2, options) {
            (operators = {
                eq: function (l, r) {
                    return l == r;
                },
                noteq: function (l, r) {
                    return l != r;
                },
                gt: function (l, r) {
                    return Number(l) > Number(r);
                },
                or: function (l, r) {
                    return l || r;
                },
                and: function (l, r) {
                    return l && r;
                },
                '%': function (l, r) {
                    return l % r === 0;
                },
            }),
                (result = operators[operator](operand_1, operand_2));

            if (result) return options.fn(this);
            else return options.inverse(this);
        },
    },
});

hbs.handlebars.registerHelper(
    'paginateHelper',
    paginateHelper.createPagination
);

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.get('/', (req, res) => res.redirect('/blogs'));
app.use('/blogs', require('./routes/blogRouter'));

app.get('/createTables', (req, res) => {
    let models = require('./models');
    models.sequelize.sync().then(() => {
        res.send('Tables created!');
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));
