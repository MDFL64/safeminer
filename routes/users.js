module.exports.get_user_details = (request, response) => {
  response.status(200).send({
    EmployeeID : request.user._id,
    Email      : request.user.Email,
    Name       : request.user.Name,
    Points     : request.user.Points
  });
}
