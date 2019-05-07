/*jshint esversion: 6 */

document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  const store = {}
  const endPoint = 'http://localhost:3000/api/v1/lessons';
  const container = document.querySelector(".container");
  const lessonForm = document.querySelector(".lesson-form");
  lessonForm.style.display = "none";


  function createElement(element) {
    return document.createElement(element);
  }

  function append(parent, element) {
    return parent.appendChild(element);
  }

  function addClass(element, className) {
    return element.classList.add(className);
  }


  const toggleButton = document.querySelector(".toggle-button");

  toggleButton.addEventListener("click", function() {
    if (lessonForm.style.display == '' || lessonForm.style.display == "block")
      lessonForm.style.display = 'none';
    else
      lessonForm.style.display = 'block';
  });


  function makeLesson(lesson) {
    const lessonDiv = createElement("div"),
      lessonName = createElement("h2"),
      lessonInstructor = createElement("h5"),
      lessonMod = createElement("h5"),
      lessonVideo = createElement("a"),
      videoIcon = createElement("i"),
      lessonCode = createElement("a"),
      codeIcon = createElement("i"),
      lessonLikes = createElement("p");
    deleteButton = createElement("i");
    editButton = createElement("i");
    likeButton = createElement("i");
    contentDiv = createElement("div");

    lessonName.innerHTML = lesson.name;

    lessonInstructor.innerHTML = "Instructor: " + lesson.instructor;

    if (lesson.mod_id) {
      lessonMod.innerHTML = "Module: " + lesson.mod_id;
    } else {
      lessonMod.innerHTML = "Module: " + lesson.mod.name;
    }
    if (lesson.video) {
      lessonVideo.href = "http://" + lesson.video;
    } else {
      lessonVideo.style.display = "none";
    }

    if (lesson.code) {
      lessonCode.href = "http://" + lesson.code;
    } else {
      lessonCode.style.display = "none";
    }
    lessonCode.href = "http://" + lesson.code;
    lessonLikes.innerHTML = lesson.likes;
    deleteButton.id = lesson.id;
    deleteButton.classList.add("fa-trash-alt");
    deleteButton.classList.add("fas");
    deleteButton.classList.add("delete-button");
    deleteButton.classList.add("hvr-grow");


    editButton.classList.add("edit-button");
    editButton.classList.add("fas");
    editButton.classList.add("fa-edit");
    editButton.classList.add("hvr-grow");

    codeIcon.classList.add("fa-github-square");
    codeIcon.classList.add("fab");
    codeIcon.classList.add("code-icon");
    codeIcon.classList.add("hvr-shrink");

    videoIcon.classList.add("fa-youtube");
    videoIcon.classList.add("fab");
    videoIcon.classList.add("video-icon");
    videoIcon.classList.add("hvr-shrink");

    lessonLikes.classList.add("lesson-likes")

    likeButton.classList.add("fas");
    likeButton.classList.add("fa-star");
    likeButton.classList.add("like-icon");
    likeButton.classList.add("hvr-grow");
    likeButton.id = lesson.id


    contentDiv.classList.add("content-div");

    lessonDiv.classList.add("col-sm");
    lessonDiv.classList.add("hvr-grow");

    lessonLikes.classList.add("lesson-likes");


    deleteButton.addEventListener("click", function(event) {
      let lessonId = parseInt(this.id);

      this.parentElement.remove();
      deleteLesson(lessonId);
    });


    likeButton.addEventListener("click", function(event) {
      let likeNum = this.parentElement
      likeNum.innerText = parseInt(likeNum.innerText) + 1
              likeLesson(parseInt(this.id), parseInt(likeNum.innerText))
    });

    append(lessonDiv, lessonName);
    append(contentDiv, lessonInstructor);
    append(contentDiv, lessonMod);
    append(lessonDiv, lessonVideo);
    append(lessonDiv, lessonCode);
    append(lessonLikes, likeButton);
    append(lessonDiv, lessonLikes);
    append(lessonDiv, deleteButton);
    append(lessonDiv, editButton);
    append(lessonCode, codeIcon);
    append(lessonVideo, videoIcon);
    append(lessonDiv, contentDiv);
    append(container, lessonDiv);
  }

  fetch(endPoint)
    .then(response => response.json())
    .then(function(array) {
      array.map(person => {
        makeLesson(person);
      });
    });

  lessonForm.addEventListener("submit", function(event) {
    location.reload()
    event.preventDefault();

    const formData = new FormData(event.target),
      name = formData.get("name"),
      code = formData.get("code"),
      video = formData.get("video"),
      instructor = formData.get("instructor"),
      mod = formData.get("mod_id");
    const data = {
      name: name,
      code: code.substring(8),
      video: video.substring(8),
      instructor: instructor,
      mod_id: parseInt(mod),
      likes: 0,
    };

    makeLesson(data);
    this.reset();
    lessonForm.style.display = "none";
    fetch(endPoint, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .catch(error => console.log(error));
  });


  function deleteLesson(lessonId) {
    return fetch(`${endPoint}/${lessonId}`, {
        method: "DELETE",
      })
      .catch(error => console.log(error));
  }




  function likeLesson(lessonId, data) {
    return fetch(endPoint + `/${lessonId}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({likes: data})
    });
  }

});
