(function() {
  const input = $("input");
  const list = $("#list");
  const status = $("#status-bar");
  const select = $("#select-all");
  const clear = $("#clear");
  const filters = $("#filters");
  let count = 0;

  // add to-dos
  input.on("keyup", function(event) {
    if (event.keyCode == 13) {
      console.log("enter");

      addToDo();
      input.val("");
    }
  });

  updateTaskCounter();
  if (count > 0) {
    showList();
  }

  // edit to-dos by double-clicking
  list.on("dblclick", ".todo", function(event) {
    let target = event.currentTarget;
    let value = $(target).html();

    console.log(value);

    target.setAttribute("contentEditable", true);
    target.focus();

    $(target).on("keydown", function(event) {
      if (event.keyCode == 13) {
        target.setAttribute("contentEditable", false);
      }
    });
    $(target).on("keydown", function(event) {
      if (event.keyCode == 27) {
        target.setAttribute("innerHTML", value);

        target.setAttribute("contentEditable", false);
      }
    });
    event.stopPropagation();
  });

  // check/uncheck to-dos
  list.on("click", ".check", function(event) {
    let target = event.currentTarget;

    if (target.checked) {
      count--;
      addCompleted(target);
    } else {
      count++;
      removeCompleted(target);
    }
    console.log(filters.find("div").eq(1));

    updateTaskCounter();
  });

  // select/unselect all
  select.on("click", function() {
    let check = [];

    $(".item").each(function() {
      let checkbox = this.firstElementChild;
      if (checkbox.checked === true) {
        check.push("checked");
      } else {
        check.push("unchecked");
      }
    });
    if (check.includes("checked") || !check.includes("checked")) {
      $("input[type=checkbox]").prop("checked", true);
      addCompleted($("input[type=checkbox]"));
      count = 0;
    }
    if (!check.includes("unchecked")) {
      console.log("Check:", check);
      $("input[type=checkbox]").prop("checked", false);
      removeCompleted($("input[type=checkbox]"));

      count = check.length;
    }
    console.log(check);
    updateTaskCounter();
  });

  // clear completed
  clear.on("click", function(event) {
    $(".completed").each(function() {
      localStorage.removeItem(
        $(this)
          .find(".todo")
          .html()
      );
      console.log(
        $(this)
          .find(".todo")
          .html()
      );
      this.remove();
    });
    if (!$(".completed").length && count <= 0) {
      hideList();
    }
  });

  // delete to-dos
  list.on("click", ".delete", function(event) {
    let parent = $(event.currentTarget)
      .parent()
      .eq(0);

    if (!parent.hasClass("completed")) {
      count--;
    }
    // localStorage.removeItem(
    //   event.currentTarget.previousElementSibling.innerHTML
    // );
    console.log(event.currentTarget.previousElementSibling.innerHTML);
    parent.remove();

    if ($(".item").length < 1) {
      hideList();
    }
    updateTaskCounter();
  });

  // filters
  filters.on("click", function(event) {
    let target = event.target;
    console.log(event);

    if (target.innerText === "All") {
      $(target.parentElement)
        .find("div")
        .removeClass("active");
      $(target).addClass("active");
      list.find(".item").show();
    } else if (target.innerText === "Active") {
      $(target.parentElement)
        .find("div")
        .removeClass("active");

      $(target).toggleClass("active");
      list.find(".item").show();
      list.find(".completed").hide();
    } else {
      $(target.parentElement)
        .find("div")
        .removeClass("active");

      $(target).toggleClass("active");
      list.find(".item").hide();
      list.find(".completed").show();
    }
  });

  function addToDo() {
    count++;

    let toDo = input.val();
    showList();

    // localStorage.toDos = {};
    // localStorage.toDos.setItem(toDo, "unchecked");

    list.append(`<div class="item">
      <input type="checkbox" class="check">
      <div class="todo">${toDo}</div>
      <div class="delete">
        ✕
      </div>
    </div>`);

    filters.find("div").removeClass("active");
    filters
      .find("div")
      .eq(0)
      .addClass("active");
    list.find(".item").show();

    updateTaskCounter();
  }

  function showList() {
    list.css({ display: "block" });
    status.css({ display: "grid" });
    select.css({ visibility: "visible" });
  }

  function hideList() {
    count = 0;
    list.css({ display: "none" });
    status.css({ display: "none" });
    select.css({ visibility: "hidden" });
  }

  function addCompleted(target) {
    // localStorage.setItem(target.nextElementSibling.innerText, "checked");
    $(target)
      .closest(".item")
      .addClass("completed");
    if (
      filters
        .find("div")
        .eq(1)
        .hasClass("active")
    ) {
      list.find(".completed").hide();
    }
    clear.css({ visibility: "visible" });
  }

  function removeCompleted(target) {
    // localStorage.setItem(target.nextElementSibling.innerText, "unchecked");

    $(target)
      .closest(".item")
      .removeClass("completed");
    if (
      filters
        .find("div")
        .eq(2)
        .hasClass("active")
    ) {
      list.find(".item").hide();
      list.find(".completed").show();
    }
    if ($(".completed").length < 1) {
      clear.css({ visibility: "hidden" });
    }
  }

  function updateTaskCounter() {
    // localStorage.setItem("taskCounter", count);
    console.log(count);
    if (count === 0) {
      $(".count").html(`You've done it all, congrats!`);
    } else if (count === 1) {
      $(".count").html(`${count} task to do`);
    } else {
      $(".count").html(`${count} tasks to do`);
    }
  }
})();
