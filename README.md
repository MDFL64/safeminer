# Please follow README as our specs/endpoints/db is defined here.

Should you have any questions - ask! :)

# Node JS Rest API

## Workflow

1. Always keep your master/branches updated.
2. Checkout branch.
3. Do awesome feature.
4. Pull again (to update).
5. Commit.
6. Push (to the feat-### branch, not master).
7. Make pull request.

## Structure WIP

## Endpoints

### Authentication

- `GET api/login`
- `POST api/login`
- `GET api/register`
- `POST api/register`

### SafetyCard

- `GET api/reports`
- `POST api/reports`
- `PUT api/reports/:id`
- **LATER** `DELETE api/reports/:id`

## Database structure

Tables:
- reports
- users


**Instructions.**

```
Reports (table) {
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
  Geolocation    : "location of the area; TBD",
  isDeleted      : "bool"
}

Users (table) {
  _id      : "id of an employee; relates to EmployeeID",
  Email    : "email of an employee; email type w/ regex",
  Password : "password of an employee; use bcrypt to hash and compare"
  Name     : "name of an employee; String",
  Position : "job position of an employee; String",
  isAdmin  : "if the user is admin or not; Bool",  
  Points   : "points employee got so far",
  isDeleted: "bool"
}

```
