const axios = require("axios");

const accessToken = process.env.GITHUB_ACCESS_TOKEN;

exports.getProfile = async () => {
  const result = await axios({
    url: "https://api.github.com/graphql",
    method: "post",
    headers: { Authorization: `bearer ${accessToken}` },
    data: {
      query: `
        query {
          viewer {
            login
            name
            bio
            company
            email
            id
            location
            repositories(first: 100, privacy:PUBLIC){
              nodes {
                id
                name
                url
              }
            }
          }
        }
        `
    }
  }).catch(err => {
    throw new Error(err.response.statusText);
  });

  return result.data;
};
