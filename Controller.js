export const testRoute = (req, res) => {
  res.send("Test Route");
};
export const usernameController = (req, res) => {
  const username = req.params.username;
  res.send(`welcome ${username}`);
};

export const keywordSearchController = (req, res) => {
  const keyword = req.query.keyword;
  console.log(keyword);
  res.send(`Searching for ${keyword}`);
};

export const userLogin = (req, res) => {
  res.send("user logged In");
};

export const userSingUp = (req, res) => {
  res.send("Please Sign Up");
};

export const jsonPostRequest = (req, res) => {
  console.log(req.body);
  res.send("Json Data Received!");
};
export const userWithJson = (req, res) => {
  const { name, email } = req.body;
  console.log(name + " " + email);
  res.json({
    message: `user ${name} with email ${email} created successfully`,
  });
};
export const putRequestJson = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  res.json({
    message: `user ${name} with email ${email} updated successfully with id ${id}`,
  });
};
export const deleteRequest = (req, res) => {
  const { id } = req.params;
  res.json({
    message: `user with id ${id} deleted successfully`,
  });
};
export const withMultipleParam = (req, res) => {
  const { id, name } = req.params;
  res.json({
    id,
    name,
  });
};

export const textPostRequest = (req, res) => {
  console.log(req.body);
  res.send("Text Data Received!");
};
export const rawPostRequest = (req, res) => {
  console.log(req.body);
  res.send("raw Data Received!");
};

export const urlEncoded = (req, res) => {
  console.log(req.body);
  res.send("Url Encoded Form Data Received!");
};

//multipart post request
export const fileUpload = (req, res) => {
  console.log(req.file); // Log the file information
  console.log(req.body); // Log other form data
  res.send("File uploaded successfully!");
};
