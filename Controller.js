
export const usernameController = (req, res)=>{
  const username = req.params.username;
  res.send(`welcome ${username}`);
}

export const keywordSearchController =(req, res)=>{
  const keyword = req.query.keyword;
  res.send(`Searching for ${keyword}`);
}

export const userLogin=(req, res)=>{
  res.send('user logged In')
}

export const userSingUp=(req, res)=>{
  res.send('Please Sign Up')
}