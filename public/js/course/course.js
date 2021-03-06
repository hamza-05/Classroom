var teacherAddCartList;
var teacherData = [];

function getCourseId() {
    return $('meta[name="course-id"]').attr('content');
}

function deleteCourse() {
    var ok = confirm("Are you want to delete this course");
    if (!ok) return;
    $.get(url.get() + "/delete", function(response) {
        toast.success(response.msg);
        loadCourseList();
    }).fail(function(error) {
        failError.toast(error);
    });
}

function leaveCourse() {
    var ok = confirm("Are you want to leave this course");
    if (!ok) return;
    $.get(url.get() + "/leave", function(response) {
        toast.success(response.msg);
        loadCourseList();
    }).fail(function(error) {
        failError.toast(error);
    });
}

function loadCreateCourse() {
    modal.md.open("Create Course");
    loader(modal.md.body);
    $.get(url.get(1) + "/create", function(response) {
        modal.md.setBody(response);
    });
}

function loadCourseList() {
    url.load('/teacher/courses');
}

function loadTeacherList() {
    url.load(url.get());
}

function viewAddTeacher() {
    teacherAddCartList = [];
    modal.md.open("Add Teacher");
    loader(modal.md.body);
    $.get(url.get(1) + "/create", function(response) {
        modal.md.setBody(response);
    });
}

function addTeacher() {
    var userId = prompt("prompt", "User Id");
    if (!userId) return;
    var data = {
        'user_id': userId,
    };
    $.post(url.get(1) + "/create", app.setToken(data), function(response) {
        console.log(response);
        if (response.error == 1) {
            toast.danger(response.errorMsg);
        } else {
            toast.success(response.msg);
            loadTeacherList();
        }
    });
}

function acceptRequest() {
    var ok = confirm("Are you want to join this course");
    if (!ok) return;
    courseId = getCourseId();
    var data = {
        'course_id': courseId
    };
    $.post("/teacher/courses/" + courseId + "/confirm", app.setToken(data), function(response) {
        toast.success("Successfully Confirm Request");
        url.load();
    });
}

function deleteRequest() {
    var ok = confirm("Are you want to cancel this request");
    if (!ok) return;
    courseId = getCourseId();
    var data = {
        'course_id': courseId
    };
    $.get("/teacher/courses/" + courseId + "/setting/leave", function(response) {
        toast.success(response.msg);
        loadCourseList();
    }).fail(function(error) {
        failError.toast(error);
    });
}

function deleteTeacher(userId) {
    var ok = confirm("Are you want to delete this teacher");
    if (!ok) return;
    var data = {
        'user_id': userId
    };
    $.get(url.get(1) + "/delete", app.setToken(data), function(response) {
        console.log(response);
        if (response.error == 1) {
            toast.danger(response.errorMsg);
        } else {
            toast.success(response.msg);
            loadTeacherList();
        }
    });
}

function archiveCourseAction(isArchive) {
    msg = isArchive ? "current" : "archive";
    msg = "Are you want to add " + msg + " this course";
    var ok = confirm(msg);
    if (!ok) return;
    var data = {
        'is_archive': isArchive ^ 1
    };
    $.post(url.get() + "/archive", app.setToken(data), function(response) {
        toast.success(response.msg);
        url.load();
    }).fail(function(error) {
        failError.toast(error);
    });
}

function teacherAddCart(id) {
    teacherAddCartList[id] = {
        login_id: teacherData[id].login_id,
        full_name: teacherData[id].full_name
    };
    $("#select-list-area").html("");
    teacherAddCartList.forEach(prepareAddCart);
}

function prepareAddCart(data) {
    var div = "<span class='label label-primary cart-span'>(" + data.login_id + ") " + data.full_name + " <i class='fa fa-times'></i></span>";
    $("#select-list-area").append(div);
}

function getTeacherList() {
    var searchVal = $("#searchTeacher").val();
    if (searchVal == "") {
        $("#responseSearch").html("");
        return;
    }
    var data = {
        'searchVal': searchVal
    }
    $("#select-search-area-loader").show();
    $.get("/teacher/api/teacher_list", app.setToken(data), function(list) {
        $("#responseSearch").html("");
        teacherData = [];
        $.each(list, function(key, teacher) {
            teacherData[teacher.id] = teacher;
            var div = "<div class='select-search-result-li' onclick='teacherAddCart(" + teacher.id + ")'><img src='" + teacher.avatar + "'><b>" + teacher.login_id + "</b><br/>" + teacher.full_name + " (" + teacher.nick_name + ")</div>";
            $("#responseSearch").append(div);
        });
        $("#select-search-area-loader").hide();
    });
}