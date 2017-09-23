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

Renders page

- `POST api/login`

Necessary fields:

```
Email: String,
Password: String
```

- `GET api/register`

Renders page

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
          Type        : "type of hazard; Int; check the "categories of hazard" below",
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
  Points   : "points employee got so far",
  isDeleted: "bool"
}

```

## Categories of dangers

- **Acids**

*Type* 1

- **Eye injury**

*Type* 2

- **Head injury**

*Type* 3

- **Slip and trips**

*Type* 4

- **Sharp edges**

*Type* 5

- **Rock slide**

*Type* 6

- **Heavy equipment**

*Type* 7

- **Suspended loads**

*Type* 8

- **Loud noises**

*Type* 9

- **Fall danger**

*Type* 10

- **L.O.T.O.**

*Type* 11

- **Welding**

*Type* 12

- **Electrocution**

*Type* 13

- **Toxic fumes**

*Type* 14

- **Other**

*Type* 0
