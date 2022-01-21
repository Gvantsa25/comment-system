import "./index.css";
import {
  vote,
  getAllComments,
  addComment,
  addReply,
  getUser,
  editComment,
  deleteComment,
  saveData,
} from "./data";

const root = document.getElementById("container");
const commentsParent = document.createElement("div");

root.appendChild(commentsParent);

function newComment() {
  const newCommentEl = document.createElement("textarea");
  const newCommentBtn = document.createElement("button");
  newCommentBtn.textContent = "SEND";
  commentsParent.appendChild(newCommentEl);
  commentsParent.appendChild(newCommentBtn);

  newCommentBtn.addEventListener("click", () => {
    const value = newCommentEl.value;
    if (!value) return;
    addComment(value);
    render();
  });
}

function newReply(parent, id) {
  const newCommentEl = document.createElement("textarea");
  const newReplyBtn = document.createElement("button");
  const newReplayContainer = document.createElement("div");
  newReplayContainer.classList.add("update-comment-text");
  newReplayContainer.appendChild(newCommentEl);
  newReplayContainer.appendChild(newReplyBtn);

  newReplyBtn.textContent = "SEND";

  parent.appendChild(newReplayContainer);

  newReplyBtn.addEventListener("click", function () {
    // Read textarea value
    const value = newCommentEl.value;

    // if empty string is provided don't continue
    if (!value) return;

    addReply(id, value, "gvantsa");

    render();
  });
}

function updateComment(parent, id) {
  const commentContent = parent.querySelector(".comment-content");
  const textarea = document.createElement("textarea");

  textarea.style.display = "block";
  textarea.value = commentContent.innerHTML;

  const updateBtn = document.createElement("button");
  updateBtn.textContent = "UPDATE";

  const updateCommentContainer = document.createElement("div");
  updateCommentContainer.classList.add("update-comment-text");
  updateCommentContainer.appendChild(textarea);
  updateCommentContainer.appendChild(updateBtn);

  commentContent.remove();
  parent.appendChild(updateCommentContainer);

  updateBtn.addEventListener("click", function () {
    if (!textarea.value) return;
    editComment(id, textarea.value);
    render();
  });
}

function render() {
  commentsParent.innerHTML = "";
  getAllComments().forEach((comm) => {
    const commentEl = singleComment(comm);
    commentsParent.appendChild(commentEl);

    if (comm.replies.length) {
      comm.replies.forEach((reply) => {
        const replyEl = singleComment(reply);
        replyEl.classList.add("comment-reply");
        commentsParent.appendChild(replyEl);
      });
    }
  });
  newComment();
  saveData();
}

function singleComment(data) {
  const commEl = document.createElement("div");
  commEl.classList.add("comment");
  const markup = `
    <div class="comment-votes">
      <button id="increment">+</button>
      <span>${data.score}</span>
      <button id="decrement">-</button>
    </div>
    <div class="comment-content-container">
      
      <div class="comment-header">
        <div class="user-info">
          <img src="${data.user.image.png}">          
          <p><strong>${data.user.username}</strong></p>
          <p>${data.createdAt}</p>
        </div>
        <div>
          <button class="reply">reply</button>
          ${
            data.user.username === getUser().username
              ? "<button class='edit'>Edit</button> <button class='delete'>Delete</button>"
              : ""
          }
        </div>
      </div>
      <p class="comment-content">${data.content}</p>
    </div>
  `;

  commEl.insertAdjacentHTML("beforeend", markup);

  // Handle all events on the parent element
  commEl.addEventListener("click", function (event) {
    if (event.target.id === "increment") {
      vote(data.id, "up");
      render();
    } else if (event.target.id === "decrement") {
      vote(data.id, "down");
      render();
    }
    if (Array.from(event.target.classList).includes("reply")) {
      newReply(commEl, data.id);
      return;
    }
    if (Array.from(event.target.classList).includes("edit")) {
      updateComment(commEl, data.id);
    }
    if (Array.from(event.target.classList).includes("delete")) {
      deleteComment(data.id);
      render();
    }
  });

  return commEl;
}

render();
