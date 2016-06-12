/**
 * Created by sangjoonlee on 2016-06-11.
 */

var connection =
    require('../dbConnection.js').dbConnect();

module.exports =
    function viewStory(req , res , next){

        var storyId = req.params.storyId;

        connection.query('SELECT * FROM Story WHERE storyId = ?',
            storyId,
            function(err,rows){
                console.log(rows);
                if(err) {
                    console.log("Error Selecting : %s ", err);
                }
                res.render('storyView', {
                    title: 'Queued - Story Detail - #' + storyId,
                    requirementsSelected: 'pure-menu-selected',
                    data: rows[0],
                    user: req.user});

            });

    };