const {model} = require('mongoose')
const { posts } = require("../temp");

const totalPosts = () => posts.length;

const ProjectsModel = model('projects')

const Projects = async (parent, args, { req }) => {
  const p = await ProjectsModel.find();
  return p;
};

//mutation
const newPost = (parent, args, context) => {
  //create new post object
  // console.log(args.input);
  // const { title, description } = args.input;

  const post = {
    id: posts.length + 1,
    // title,
    // description,
    ...args.input,
  };

  posts.push(post);
  return post;
};

module.exports = {
  Query: {
    totalPosts,
    Projects,
  },

  Mutation: {
    newPost,
  },
};
