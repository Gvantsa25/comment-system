import jsonData from "../data.json";

let data = null;

function saveData() {
  localStorage.setItem("comms", JSON.stringify(data));
}

function find(id, getParent = false) {
  let found = null;

  for (let comment of data.comments) {
    if (comment.id === id) {
      found = comment;
      break;
    }

    if (comment.replies.length) {
      for (let reply of comment.replies) {
        if (reply.id === id) {
          if (getParent) {
            found = comment;
          } else {
            found = reply;
          }
          break;
        }
      }
    }
  }
  return found;
}

const comments = localStorage.getItem("comms");
if (comments) {
  data = JSON.parse(comments);
} else {
  data = jsonData;
}

const getId = () => Date.now();
const getUser = () => data.currentUser;
const getAllComments = () => {
  data.comments.sort((a, b) => (a.score > b.score ? -1 : 1));
  return data.comments;
};

const addComment = (content) => {
  const date = new Date();
  const comment = {
    id: getId(),
    content,
    score: 0,
    user: getUser(),
    replies: [],
    createdAt: `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  };

  data.comments.push(comment);
};

const deleteComment = (id) => {
  for (let i = 0; i < data.comments.length; i++) {
    const comment = data.comments[i];

    if (comment.id === id) {
      data.comments.splice(i, 1);
      return;
    }

    if (comment.replies.length) {
      for (let j = 0; j < comment.replies.length; j++) {
        const reply = comment.replies[j];
        if (reply.id === id) {
          comment.replies.splice(j, 1);
          return;
        }
      }
    }
  }
};

const addReply = (id, content, replyingTo) => {
  const comment = {
    id: getId(),
    content,
    score: 0,
    user: getUser(),
    createdAt: new Date().toISOString(),
    replyingTo,
  };
  let parentComment = find(id, true);

  if (!parentComment) return;
  parentComment.replies.unshift(comment);
};

const editComment = (id, content) => {
  let found = find(id);
  if (!found) return;
  found.content = content;
};

const vote = (id, type) => {
  let found = find(id);
  if (!found) return;
  if (type === "up") found.score++;
  else found.score--;
};

export {
  getUser,
  getAllComments,
  addComment,
  addReply,
  vote,
  editComment,
  deleteComment,
  saveData,
};
