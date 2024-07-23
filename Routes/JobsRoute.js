import express from "express";
import { GetsJobs, JobsCreated, JobsDelete, jobsStats_filter, JobsUpdate } from "../Controllers/UsersJobsController.js";
import { userAuthentication } from "../Middlewares/AuthMiddleware.js";
const JobsRoute=express.Router();

JobsRoute.post("/jobsCreted",userAuthentication,JobsCreated);
JobsRoute.get("/get/all-jobs",userAuthentication,GetsJobs);
JobsRoute.put("/jobs/update/:id",userAuthentication,JobsUpdate);
JobsRoute.delete("/jobs/delete/:id",userAuthentication,JobsDelete);
JobsRoute.get("/jobs-stats",userAuthentication,jobsStats_filter)

export default JobsRoute;