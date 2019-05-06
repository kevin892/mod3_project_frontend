document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');

  const endPoint = 'http://localhost:3000/api/v1/lessons';
  const container = document.querySelector(".container");
  const lessonForm = document.querySelector(".lesson-form")


  function createElement(element) {
    return document.createElement(element)
  }

  function append(parent, element) {
    return parent.appendChild(element)
  }

  function addClass(element, className) {
    return element.classList.add(className)
  }


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
     deleteButton = createElement("button")

     lessonName.innerHTML = lesson.name;
     lessonInstructor.innerHTML = lesson.instructor;

     if (lesson.mod_id) {
       lessonMod.innerHTML = lesson.mod_id
     }
     else {
       lessonMod.innerHTML = lesson.mod.name
     }

     lessonVideo.href = "http://" + lesson.video;
     lessonCode.href = "http://" + lesson.code;
     lessonLikes.innerHTML = lesson.likes;
     deleteButton.innerHTML = "Delete"
     deleteButton.classList.add(lesson.id)
     lessonDiv.classList.add("col-sm")

     deleteButton.addEventListener("click", function(event) {
       let lessonId = parseInt(this.classList[0])
       this.parentElement.remove()
       deleteLesson(lessonId)
     })

     append(lessonDiv, lessonName);
     append(lessonDiv, lessonInstructor);
     append(lessonDiv, lessonMod);
     append(lessonDiv, lessonVideo);
     append(lessonDiv, lessonCode);
     append(lessonDiv, lessonLikes);
     append(lessonDiv, deleteButton)
     append(container, lessonDiv);
  }

  fetch(endPoint)
    .then(response => response.json())
    .then(function(array) {
      array.map(person => {
        makeLesson(person)
      })
    });

  lessonForm.addEventListener("submit", function(event) {
    event.preventDefault()
    const formData = new FormData(event.target),
      name = formData.get("name"),
      code = formData.get("code"),
      video = formData.get("video"),
      instructor = formData.get("instructor"),
      mod = formData.get("mod_id");
    const data = {
        name: name,
        code: code,
        video: video,
        instructor: instructor,
        mod_id: parseInt(mod),
        likes: 0,
      }
      makeLesson(data)
    fetch(endPoint, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .catch(error => console.log(error))
  })


  // const deleteLesson = (lessonId) => {
  //   return fetch(`${endPoint}/${lessonId}`, {
  //     method: "DELETE",
  //   })
  //   .then(res => res.json())
  // }
  //



function deleteLesson(lessonId) {
  return fetch(`${endPoint}/${lessonId}`, {
    method: "DELETE",
  })
  .catch(error => console.log(error))
}
})
