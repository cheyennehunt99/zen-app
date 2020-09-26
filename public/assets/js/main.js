$(document).ready(() => {
  //Posts reflection to database

  //On click for submit button
  $(".submit").on("click", async () => {
    //Cleans and stores reflection for text box
    const saveReflection = $("#comment_text")
      .val()
      .trim();

    //Gets quote id from data-attr
    const id = $(".quote").data("id");

    //Gets user id from db
    const submit = $.get("/api/user_data")
      .then(data => {
        console.log(data.id);
        return (user = data.id);
      })
      //Uses that info to complete request
      .then(user => {
        //Sends data
        $.post("/api/likes", {
          userId: user,
          quoteId: id,
          reflection: saveReflection
        });
      });
    //Returns submission
    return submit;
  });

  $(".dislike").on("click", () => {
    // clear input box
    $(".submit").val("");
    // clear any old content
    $("#comment_text").empty();
  });

  $(".heart").on("click", () => {
    // clear input box
    $(".submit").val("");
    // clear any old content
    $("#comment_text").empty();
  });
});
