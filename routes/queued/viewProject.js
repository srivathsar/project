/**
 * Created by sangjoonlee on 2016-06-09.
 */
var connection =
    require('../dbConnection.js').dbConnect();

module.exports =
    function viewProject(req, res, next){

        var projectId;
        var project_name;
        var description;
        var status_Backlog = "Backlog";
        var status_Current = "Current";
        var status_Done = "Done";
        var status_Release = "Release";


        projectId = req.params.projectId;



        // query all stories that are related to this project

        connection.query('SELECT * FROM QueuedStory WHERE projectId = ?',
            projectId,
            function(err,rows){
                connection.query('SELECT project_name, Description FROM QueuedProjects WHERE projectId = ?',
                projectId,
                    function(err,projectName) {
                        connection.query('SELECT * FROM QueuedStory WHERE projectId = ? AND story_status = ?',
                            [projectId, status_Backlog],
                            function(err,Backlog) {
                                connection.query('SELECT * FROM QueuedStory WHERE projectId = ? AND story_status = ?',
                                    [projectId, status_Current],
                                    function (err, Current) {
                                        connection.query('SELECT * FROM QueuedStory WHERE projectId = ? AND story_status = ?',
                                            [projectId, status_Done],
                                            function (err, Done) {
                                                connection.query('SELECT * FROM QueuedStory WHERE projectId = ? AND story_status = ?',
                                                    [projectId, status_Release],
                                                    function (err, Release) {


                                                        if (err) {
                                                            console.log("Error Get all Stories : %s ", err);
                                                        }


                                                        // #debug: printing projectId of the currently requested view
                                                        console.log("projectId: %s", projectId);
                                                        console.log("projectName: %s", projectName[0].project_name);
                                                        console.log("projectName: %s", projectName[0].Description);
                                                        project_name = projectName[0].project_name;
                                                        description  = projectName[0].Description;

                                                        res.render('queuedProjectView',
                                                            {
                                                                title: project_name + ' | μProject',
                                                                requirementsSelected: 'pure-menu-selected',
                                                                projectId: projectId,
                                                                project_name: project_name,
                                                                description: description,
                                                                data: rows,
                                                                backlog: Backlog,
                                                                current: Current,
                                                                done: Done,
                                                                release: Release,
                                                                css: ['queued-projectview.css', 'bootstrap-editable.css'],
                                                                js: ['queued-project.js', 'bootstrap-editable.js'],
                                                                user: req.user
                                                            });
                                                    });
                                            });
                                    });
                            });
                    });
            });
    };
