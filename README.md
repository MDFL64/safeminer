# Node JS Rest API

## Structure WIP

## Endpoints

### Authentication

`GET api/login`
`POST api/login`
`GET api/register`
`POST api/register`

### SafetyCard

`GET api/reports`
`POST api/reports`
`PUT api/reports/:id`
**LATER** `DELETE api/reports/:id`

## Database structure

```
SafetyCard (table) {
  _id            : "id of safety card; MongoDB_ID",
  EmployeeID     : "id of an employee; MongoDB_ID",
  DateCreated    : "date when safety card was created; Date ISO8601",
  DateModified   : "date when safety card was last modified; Date ISO8601",
  JobName        : "name of the job performed; String",
  JobDescription : "description of the job performed; String",
  Dangers        : [
      {
          Type        : "type of hazard; Int",
          Scale       : "scale of hazard; Int",
          Description : "description of steps to prevent this hazard; String",          
      }
  ],
  Geolocation    : "location of the area; TBD"
}

Users (table) {
  _id      : "id of an employee; relates to EmployeeID",
  Name     : "name of an employee; String",
  Position : "job position of an employee; String",
  isAdmin  : "if the user is admin or not; Bool",
  Age      : "age of an employee",
  Points   : "points employee got so far"
}

```
