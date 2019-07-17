$("#device-list").on("change", "input[type=checkbox]", function() {
  let checkbox = $(this).closest("input[type=checkbox]");

  let serial_number = $(this)
    .parents(".card-text")
    .find(".serial-number")
    .text();

  let is_checked = checkbox.is(":checked");

  $.ajax({
    url: "/api/controllers/switch_state",
    type: "POST",
    dataType: "json",
    data: {
      serial_number: serial_number,
      command: "switch_on_off",
      state: is_checked ? "on" : "off"
    }
  }).done(function(response) {
    state = is_checked ? "on" : "off";
    console.log("switched state to " + state);
    console.log(response);
  });
});
